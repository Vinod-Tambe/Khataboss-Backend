"use strict";

const { getTenantPrisma } = require("../../../utils/tenantPrisma");
const journalService = require("../../journal/service/journal.service");
const serialNumberService = require("../../../common/service/serialNumber.service");
const { calculateFirstMonthInterest, getLoanInterestSummary } = require("../../../utils/loanInterest");
const messageDispatchService = require("../../../common/service/message-dispatch.service");
const { getCustomerWhatsAppNo } = require("../../../utils/customer.helper");
const {
  addLoanVoucher,
  firstMonthInterestVoucher,
  transferOutVoucher,
  transferInVoucher,
  loanLine,
  loanJournalDeletePatterns,
  formatLoanNo,
} = require("../../../utils/journalNarration");
const { resolveIncomeAccount } = require("../../../utils/incomeAccounts");
const { buildGstInclusiveCreditLines } = require("../../../utils/indianCompliance");
const { deletePanelJournal } = require("../../../utils/loanJournalHelper");
const imageService = require("../../../utils/image.service");

class GirviService {
  getPrisma(dbUrl) {
    return getTenantPrisma(dbUrl);
  }

  /**
   * Helper to parse account ID and fall back to firm's default account if not selected.
   */
  async resolveAccount(prisma, firmId, customAccId, fallbackNames) {
    let parsedId = customAccId ? parseInt(customAccId) : null;
    if (parsedId && !isNaN(parsedId) && parsedId > 0) {
      return parsedId;
    }
    
    for (const name of fallbackNames) {
      const acc = await prisma.account.findFirst({
        where: {
          acc_firm_id: parseInt(firmId),
          acc_is_deleted: false,
          acc_name: {
            contains: name,
            mode: 'insensitive',
          },
        },
      });
      if (acc) return acc.acc_id;
    }
    return null;
  }

  async createGirvi(dbUrl, girviData, stockItems) {
    const prisma = this.getPrisma(dbUrl);
    try {
      // 1. Resolve Automatic Fields if not provided
      const firmId = girviData.girv_firm_id;
      
      let girv_dr_acc_id = girviData.girv_dr_acc_id;
      if (!girv_dr_acc_id || girv_dr_acc_id === 0) {
        const searchName = girviData.girv_type === "unsecured" ? "Unsecured Loans" : "Secured Loans";
        girv_dr_acc_id = await this.resolveAccount(prisma, firmId, null, [searchName]);
        girviData.girv_dr_acc_id = girv_dr_acc_id;
      }

      girviData.girv_cash_acc_id = await this.resolveAccount(prisma, firmId, girviData.girv_cash_acc_id, ["Cash In Hand", "Cash"]);
      girviData.girv_bank_acc_id = await this.resolveAccount(prisma, firmId, girviData.girv_bank_acc_id, ["Bank Account", "Bank"]);
      girviData.girv_online_acc_id = await this.resolveAccount(prisma, firmId, girviData.girv_online_acc_id, ["Online Account", "Online"]);
      girviData.girv_card_acc_id = await this.resolveAccount(prisma, firmId, girviData.girv_card_acc_id, ["Card Account", "Card", "POS"]);

      // Processing fee income account
      const processingFeesAccId = await resolveIncomeAccount(
        prisma,
        firmId,
        girviData.girv_own_id || 1,
        "PROCESSING"
      );

      // 2. Create Girvi and Stock within transaction
      const newGirvi = await prisma.$transaction(async (tx) => {
        if (!girviData.girv_unique_code) {
          girviData.girv_unique_code = await serialNumberService.getNextSerialNumber(tx, "LOAN");
        }
        if (!girviData.girv_loan_no) {
          girviData.girv_loan_no = girviData.girv_unique_code;
        }

        // Create Girvi
        const createdGirvi = await tx.girvi.create({
          data: girviData,
        });

        // Create associated stock items if provided
        if (stockItems && stockItems.length > 0) {
          const stockData = stockItems.map((item) => ({
            ...item,
            st_referance_panel: "girvi",
            st_referance_id: createdGirvi.girv_id,
            st_own_id: createdGirvi.girv_own_id,
            st_firm_id: createdGirvi.girv_firm_id,
            st_user_id: createdGirvi.girv_user_id,
          }));

          await tx.stock.createMany({
            data: stockData,
          });
          
          // Fetch and attach the created stock items to verify they were inserted
          const createdStocks = await tx.stock.findMany({
            where: {
              st_referance_panel: "girvi",
              st_referance_id: createdGirvi.girv_id
            }
          });
          createdGirvi.items = createdStocks;
        }

        return createdGirvi;
      });

      // 3. Create Journal Entry (prin = payments + process + charge)
      try {
        await this.postAddLoanJournal(dbUrl, newGirvi, processingFeesAccId);
        await this.postFirstMonthInterestJournal(dbUrl, newGirvi);
      } catch (journalErr) {
        // Compensate: remove journals + orphan loan if ledger post failed
        try {
          await this.deleteLoanJournalVouchers(dbUrl, newGirvi, ["add", "firstMonth"]);
          await prisma.stock.deleteMany({
            where: {
              st_referance_panel: "girvi",
              st_referance_id: newGirvi.girv_id,
            },
          });
          await prisma.girvi.delete({ where: { girv_id: newGirvi.girv_id } });
        } catch (cleanupErr) {
          console.error("❌ Failed to rollback girvi after journal error:", cleanupErr.message);
        }
        throw journalErr;
      }

      const user =
        newGirvi.girv_user_id > 0
          ? await prisma.user.findUnique({ where: { user_id: newGirvi.girv_user_id } })
          : null;
      messageDispatchService.dispatchSafe({
        dbUrl,
        ownDb: messageDispatchService.ownDbFromUrl(dbUrl),
        firmId: newGirvi.girv_firm_id,
        templateKey: "loan_created",
        toPhone: getCustomerWhatsAppNo(user),
        toEmail: user?.user_email_id,
        vars: {
          1: user
            ? `${user.user_first_name || ""} ${user.user_last_name || ""}`.trim()
            : "",
          2: newGirvi.girv_loan_no || String(newGirvi.girv_id),
          3: String(newGirvi.girv_prin_amt),
          4: newGirvi.girv_start_date,
        },
      });

      return newGirvi;
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Map first-month interest DR account to cash / bank / online / card channel.
   */
  resolveFirstMonthIntChannel(girvi = {}, drAccount = null) {
    const id = parseInt(girvi.girv_first_int_dr_acc_id, 10) || 0;
    if (!id) return "cash";
    if (id === parseInt(girvi.girv_cash_acc_id, 10)) return "cash";
    if (id === parseInt(girvi.girv_bank_acc_id, 10)) return "bank";
    if (id === parseInt(girvi.girv_online_acc_id, 10)) return "online";
    if (id === parseInt(girvi.girv_card_acc_id, 10)) return "card";

    const name = String(drAccount?.acc_name || "").toLowerCase();
    if (name.includes("bank")) return "bank";
    if (name.includes("online")) return "online";
    if (name.includes("card")) return "card";
    return "cash";
  }

  /**
   * Gross disbursement per channel for the add-loan journal.
   * When first-month interest is prepaid, add it back so DR principal = total CR.
   */
  getGrossDisbursementAmounts(girvi = {}, drAccount = null) {
    const cash = parseFloat(girvi.girv_cash_amt) || 0;
    const bank = parseFloat(girvi.girv_bank_amt) || 0;
    const online = parseFloat(girvi.girv_online_amt) || 0;
    const card = parseFloat(girvi.girv_card_amt) || 0;

    if (girvi.girv_first_int !== "Y") {
      return { cash, bank, online, card };
    }

    const firstMonthInt =
      calculateFirstMonthInterest(
        girvi.girv_prin_amt,
        girvi.girv_roi,
        girvi.girv_interest_method || "simple",
        girvi.girv_compound_freq || "monthly",
        girvi.girv_roi_type || "monthly"
      ) || 0;

    if (!(firstMonthInt > 0)) {
      return { cash, bank, online, card };
    }

    const channel = this.resolveFirstMonthIntChannel(girvi, drAccount);
    return {
      cash: cash + (channel === "cash" ? firstMonthInt : 0),
      bank: bank + (channel === "bank" ? firstMonthInt : 0),
      online: online + (channel === "online" ? firstMonthInt : 0),
      card: card + (channel === "card" ? firstMonthInt : 0),
    };
  }

  /**
   * Principal disbursement journal.
   * DR Loan = principal; CR Cash/Bank = gross payments; CR Processing Fees = process + charge.
   * When first-month interest is prepaid, gross payment CR includes that amount so the
   * separate first-month interest journal (DR Cash, CR Interest Rec) keeps trial balance in sync.
   */
  async postAddLoanJournal(dbUrl, girvi, processingFeesAccId = null) {
    if (!girvi) return;
    const prisma = this.getPrisma(dbUrl);
    if (!processingFeesAccId) {
      processingFeesAccId = await resolveIncomeAccount(
        prisma,
        girvi.girv_firm_id,
        girvi.girv_own_id || 1,
        "PROCESSING"
      );
    }
    const processAmt = parseFloat(girvi.girv_process_amt) || 0;
    const chargeAmt = parseFloat(girvi.girv_charge_amt) || 0;

    let drAccount = null;
    if (girvi.girv_first_int === "Y" && girvi.girv_first_int_dr_acc_id) {
      drAccount = await prisma.account.findFirst({
        where: { acc_id: parseInt(girvi.girv_first_int_dr_acc_id, 10) },
        select: { acc_id: true, acc_name: true },
      });
    }
    const disbursement = this.getGrossDisbursementAmounts(girvi, drAccount);

    const firm = await prisma.firm.findFirst({
      where: { firm_id: girvi.girv_firm_id, firm_is_deleted: false },
      select: { firm_gstin_no: true, firm_pan_no: true, firm_own_id: true },
    });

    const processFeeLines =
      processAmt > 0
        ? await buildGstInclusiveCreditLines({
            prisma,
            firm,
            firmId: girvi.girv_firm_id,
            ownId: girvi.girv_own_id || 1,
            grossAmount: processAmt,
            incomeAccId: processingFeesAccId,
            transDate: girvi.girv_start_date,
            narration: loanLine("Process Charge", girvi),
          })
        : [];

    const chargeFeeLines =
      chargeAmt > 0
        ? await buildGstInclusiveCreditLines({
            prisma,
            firm,
            firmId: girvi.girv_firm_id,
            ownId: girvi.girv_own_id || 1,
            grossAmount: chargeAmt,
            incomeAccId: processingFeesAccId,
            transDate: girvi.girv_start_date,
            narration: loanLine("Other Charge", girvi),
          })
        : [];

    const journal_request = {
      journal_date: {
        jrnl_date: girvi.girv_start_date,
        jrnl_firm_id: girvi.girv_firm_id,
        jrnl_own_id: girvi.girv_own_id,
        jrnl_user_id: girvi.girv_user_id,
        jrnl_amt: girvi.girv_prin_amt,
        jrnl_panel: "Girvi",
        jrnl_other_info: addLoanVoucher(girvi),
      },
      joural_trans_data: [
        {
          jrtr_crdr: "CR",
          jrtr_date: girvi.girv_start_date,
          jrtr_cr_acc_id: girvi.girv_cash_acc_id,
          jrtr_cr_amt: disbursement.cash,
          jrtr_acc_info: girvi.girv_cash_info,
        },
        {
          jrtr_crdr: "CR",
          jrtr_date: girvi.girv_start_date,
          jrtr_cr_acc_id: girvi.girv_bank_acc_id,
          jrtr_cr_amt: disbursement.bank,
          jrtr_acc_info: girvi.girv_bank_info,
        },
        {
          jrtr_crdr: "CR",
          jrtr_date: girvi.girv_start_date,
          jrtr_cr_acc_id: girvi.girv_online_acc_id,
          jrtr_cr_amt: disbursement.online,
          jrtr_acc_info: girvi.girv_online_info,
        },
        {
          jrtr_crdr: "CR",
          jrtr_date: girvi.girv_start_date,
          jrtr_cr_acc_id: girvi.girv_card_acc_id,
          jrtr_cr_amt: disbursement.card,
            jrtr_acc_info: girvi.girv_card_info,
          },
          ...processFeeLines,
          ...chargeFeeLines,
          {
            jrtr_crdr: "DR",
          jrtr_date: girvi.girv_start_date,
          jrtr_dr_acc_id: girvi.girv_dr_acc_id,
          jrtr_dr_amt: girvi.girv_prin_amt,
          jrtr_acc_info: loanLine("Add New Loan", girvi),
        },
      ].filter(
        (t) =>
          (t.jrtr_cr_amt && parseFloat(t.jrtr_cr_amt) > 0) ||
          (t.jrtr_dr_amt && parseFloat(t.jrtr_dr_amt) > 0)
      ),
    };

    try {
      await journalService.create_journal_entry(dbUrl, journal_request);
    } catch (journalErr) {
      console.error("❌ Failed to create journal entry for girvi:", journalErr.message);
      throw new Error(
        `Loan saved but account entry failed: ${journalErr.message}. Please edit/retry the loan so journals are posted.`
      );
    }
  }

  async deleteLoanJournalVouchers(dbUrl, girvi, kinds = []) {
    const patterns = loanJournalDeletePatterns(girvi, kinds);
    for (const pattern of patterns) {
      await this.deleteGirviJournalsByInfo(dbUrl, pattern);
    }
  }

  async deleteGirviJournalsByInfo(dbUrl, containsText) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const journals = await prisma.journal.findMany({
        where: {
          jrnl_other_info: { contains: containsText },
          jrnl_is_deleted: false,
        },
        select: { jrnl_id: true },
      });
      for (const j of journals) {
        await prisma.journal.delete({ where: { jrnl_id: j.jrnl_id } });
      }
      return journals.length;
    } catch (err) {
      console.error("❌ Failed to delete girvi journals:", err.message);
      return 0;
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Post prepaid first-month interest journal when girv_first_int = Y.
   */
  async postFirstMonthInterestJournal(dbUrl, girvi) {
    if (!girvi || girvi.girv_first_int !== "Y") return;

    const amount = calculateFirstMonthInterest(
      girvi.girv_prin_amt,
      girvi.girv_roi,
      girvi.girv_interest_method || "simple",
      girvi.girv_compound_freq || "monthly",
      girvi.girv_roi_type || "monthly"
    );
    if (!(amount > 0)) {
      throw new Error(
        "First-month interest is enabled but calculated amount is 0. Check principal and ROI."
      );
    }
    if (!girvi.girv_first_int_dr_acc_id || !girvi.girv_first_int_cr_acc_id) {
      throw new Error(
        "First-month interest is enabled but DR/CR accounts are missing. Select Interest Payment accounts."
      );
    }

    const journal_request = {
      journal_date: {
        jrnl_date: girvi.girv_start_date,
        jrnl_firm_id: girvi.girv_firm_id,
        jrnl_own_id: girvi.girv_own_id,
        jrnl_user_id: girvi.girv_user_id,
        jrnl_amt: amount,
        jrnl_panel: "Girvi",
        jrnl_other_info: firstMonthInterestVoucher(girvi),
      },
      joural_trans_data: [
        {
          jrtr_crdr: "DR",
          jrtr_date: girvi.girv_start_date,
          jrtr_dr_acc_id: girvi.girv_first_int_dr_acc_id,
          jrtr_dr_amt: amount,
          jrtr_acc_info: loanLine("First Month Interest", girvi),
        },
        {
          jrtr_crdr: "CR",
          jrtr_date: girvi.girv_start_date,
          jrtr_cr_acc_id: girvi.girv_first_int_cr_acc_id,
          jrtr_cr_amt: amount,
          jrtr_acc_info: loanLine("First Month Interest Rec", girvi),
        },
      ],
    };

    try {
      await journalService.create_journal_entry(dbUrl, journal_request);
    } catch (journalErr) {
      console.error("❌ Failed to create first-month interest journal:", journalErr.message);
      throw new Error(
        `First-month interest journal failed: ${journalErr.message}. Loan exists — fix accounts and update loan.`
      );
    }
  }

  async enrichGirvisListData(prisma, girvis) {
    if (!girvis?.length) return [];

    const girvIds = girvis.map((g) => g.girv_id);

    const [additionalPrincipals, deposits, releases, stocks] = await Promise.all([
      prisma.additionalPrincipal.findMany({
        where: { ap_girv_id: { in: girvIds }, ap_is_deleted: false },
      }),
      prisma.girviDeposit.findMany({
        where: { dep_girv_id: { in: girvIds }, dep_is_deleted: false },
      }),
      prisma.girviRelease.findMany({
        where: { rel_girv_id: { in: girvIds }, rel_is_deleted: false },
        orderBy: { rel_trans_date: "asc" },
      }),
      prisma.stock.findMany({
        where: {
          st_referance_panel: "girvi",
          st_referance_id: { in: girvIds },
          st_is_deleted: false,
        },
      }),
    ]);

    const groupBy = (rows, idKey) =>
      rows.reduce((acc, row) => {
        const id = row[idKey];
        if (!acc[id]) acc[id] = [];
        acc[id].push(row);
        return acc;
      }, {});

    const apByGirv = groupBy(additionalPrincipals, "ap_girv_id");
    const depByGirv = groupBy(deposits, "dep_girv_id");
    const relByGirv = groupBy(releases, "rel_girv_id");
    const stockByGirv = groupBy(stocks, "st_referance_id");

    return girvis.map((g) => {
      const aps = apByGirv[g.girv_id] || [];
      const deps = depByGirv[g.girv_id] || [];
      const rels = relByGirv[g.girv_id] || [];
      const items = stockByGirv[g.girv_id] || [];
      const interest_summary = getLoanInterestSummary({
        ...g,
        additionalPrincipals: aps,
        deposits: deps,
        releases: rels,
      });
      const total_valuation = items.reduce(
        (sum, item) =>
          sum + (parseFloat(item.st_final_valuation || item.st_valuation) || 0),
        0
      );
      const isSecured = String(g.girv_type || "").toLowerCase() === "secured";
      const finalPay = interest_summary.totalDueAmount ?? interest_summary.pending;
      const profit_loss =
        isSecured && total_valuation > 0
          ? parseFloat((total_valuation - finalPay).toFixed(2))
          : null;

      return {
        ...g,
        additionalPrincipals: aps,
        deposits: deps,
        releases: rels,
        items,
        interest_summary,
        total_valuation,
        profit_loss,
      };
    });
  }

  async getGirvis(dbUrl, firmId, userId, status) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const where = { girv_is_deleted: false };
      if (firmId) {
        where.girv_firm_id = parseInt(firmId);
      }
      if (userId) {
        where.girv_user_id = parseInt(userId);
      }
      if (status && status !== "ALL") {
        where.girv_status = status;
      }
      const girvis = await prisma.girvi.findMany({
        where,
        orderBy: { girv_created_at: "desc" },
        include: {
          firm: true,
          user: true,
          transferMoneyLender: true,
        },
      });

      const transferFirmIds = [
        ...new Set(
          girvis
            .map((g) => g.girv_transfer_firm_id)
            .filter((id) => id != null && id > 0)
        ),
      ];

      let transferFirmMap = {};
      if (transferFirmIds.length > 0) {
        const transferFirms = await prisma.firm.findMany({
          where: { firm_id: { in: transferFirmIds } },
          select: { firm_id: true, firm_name: true },
        });
        transferFirmMap = Object.fromEntries(
          transferFirms.map((f) => [f.firm_id, f])
        );
      }

      const enriched = await this.enrichGirvisListData(prisma, girvis);

      return enriched.map((g) => ({
        ...g,
        transferFirm: g.girv_transfer_firm_id
          ? transferFirmMap[g.girv_transfer_firm_id] || null
          : null,
      }));
    } finally {
      await prisma.$disconnect();
    }
  }

  async getGirvisDropdown(dbUrl, firmId, userId) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const where = { 
        girv_is_deleted: false,
        girv_user_id: parseInt(userId),
        girv_status: 'ACTIVE'
      };
      if (firmId) {
        where.girv_firm_id = parseInt(firmId);
      }
      return await prisma.girvi.findMany({
        where,
        select: {
          girv_id: true,
          girv_unique_code: true,
          girv_loan_no: true,
          girv_prin_amt: true,
          girv_status: true,
        },
        orderBy: { girv_created_at: "desc" },
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  async getGirviById(dbUrl, girvId) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const isNum = !isNaN(girvId) && !isNaN(parseInt(girvId));
      let girvi = null;
      if (isNum) {
        girvi = await prisma.girvi.findUnique({
          where: { girv_id: parseInt(girvId) },
          include: {
            firm: true,
            user: true,
            transferMoneyLender: true,
          }
        });
      }
      if (!girvi && typeof girvId === "string") {
        girvi = await prisma.girvi.findFirst({
          where: {
            OR: [
              { girv_unique_code: girvId.trim() },
              { girv_loan_no: girvId.trim() },
            ],
          },
          include: {
            firm: true,
            user: true,
            transferMoneyLender: true,
          }
        });
      }

      if (!girvi) throw new Error("Girvi not found");

      const targetId = girvi.girv_id;
      const items = await prisma.stock.findMany({
        where: {
          st_referance_panel: "girvi",
          st_referance_id: targetId,
          st_is_deleted: false,
        }
      });

      const additionalPrincipals = await prisma.additionalPrincipal.findMany({
        where: {
          ap_girv_id: targetId,
          ap_is_deleted: false,
        },
        orderBy: {
          ap_trans_date: 'asc'
        }
      });

      const deposits = await prisma.girviDeposit.findMany({
        where: {
          dep_girv_id: targetId,
          dep_is_deleted: false
        },
        orderBy: {
          dep_trans_date: 'asc'
        }
      });

      const releases = await prisma.girviRelease.findMany({
        where: {
          rel_girv_id: targetId,
          rel_is_deleted: false
        },
        include: {
          pickupUser: true,
        },
        orderBy: {
          rel_trans_date: 'asc'
        }
      });

      return {
        ...girvi,
        items,
        additionalPrincipals,
        deposits,
        releases,
        interest_summary: getLoanInterestSummary({
          ...girvi,
          additionalPrincipals,
          deposits,
          releases,
        }),
      };
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateGirvi(dbUrl, girvUuid, girviData, stockItems, allowFinancialUpdate) {
    const prisma = this.getPrisma(dbUrl);
    try {
      // Find existing loan
      const existing = await prisma.girvi.findUnique({
        where: { girv_uuid: girvUuid },
        include: { additionalPrincipals: true, deposits: true, releases: true }
      });
      if (!existing) throw new Error("Loan not found.");

      // Check if transactions exist to enforce financial update block at the service layer as well
      const hasTransactions = existing.additionalPrincipals.length > 0 || existing.deposits.length > 0 || existing.releases.length > 0;
      
      let updateData = {};

      if (hasTransactions || existing.girv_status !== 'ACTIVE') {
        // Only allow non-financial fields; interest settings remain editable on active loans
        updateData = {
          girv_packet_no: girviData.girv_packet_no,
          girv_locker_no: girviData.girv_locker_no,
          girv_other_info: girviData.girv_other_info,
          girv_pay_info: girviData.girv_pay_info,
          girv_cash_info: girviData.girv_cash_info,
          girv_bank_info: girviData.girv_bank_info,
          girv_online_info: girviData.girv_online_info,
          girv_card_info: girviData.girv_card_info,
        };

        if (existing.girv_status === 'ACTIVE') {
          updateData.girv_roi = girviData.girv_roi;
          updateData.girv_roi_type = girviData.girv_roi_type;
          updateData.girv_interest_method = girviData.girv_interest_method;
          updateData.girv_compound_freq = girviData.girv_compound_freq;
        }
      } else {
        // Allow all updates
        updateData = { ...girviData };
      }

      // Validate girv_firm_id to prevent FK constraint failure
      if (updateData.girv_firm_id) {
        const firmExists = await prisma.firm.findUnique({
          where: { firm_id: parseInt(updateData.girv_firm_id) }
        });
        if (!firmExists) {
          updateData.girv_firm_id = existing.girv_firm_id;
        }
      }

      // Validate girv_user_id to prevent FK constraint failure
      if (updateData.girv_user_id) {
        const userExists = await prisma.user.findUnique({
          where: { user_id: parseInt(updateData.girv_user_id) }
        });
        if (!userExists) {
          updateData.girv_user_id = existing.girv_user_id;
        }
      }

      updateData.girv_updated_at = new Date();

      // Resolve accounts when financial update allowed
      if (!hasTransactions && existing.girv_status === "ACTIVE") {
        const firmId = updateData.girv_firm_id || existing.girv_firm_id;
        const loanType = updateData.girv_type || existing.girv_type;
        if (!updateData.girv_dr_acc_id) {
          updateData.girv_dr_acc_id = await this.resolveAccount(
            prisma,
            firmId,
            null,
            [loanType === "unsecured" ? "Unsecured Loans" : "Secured Loans", "Loans & Advances"]
          );
        }
        updateData.girv_cash_acc_id = await this.resolveAccount(
          prisma,
          firmId,
          updateData.girv_cash_acc_id,
          ["Cash In Hand", "Cash"]
        );
        updateData.girv_bank_acc_id = await this.resolveAccount(
          prisma,
          firmId,
          updateData.girv_bank_acc_id,
          ["Bank Account", "Bank"]
        );
        updateData.girv_online_acc_id = await this.resolveAccount(
          prisma,
          firmId,
          updateData.girv_online_acc_id,
          ["Online Account", "Online"]
        );
        updateData.girv_card_acc_id = await this.resolveAccount(
          prisma,
          firmId,
          updateData.girv_card_acc_id,
          ["Card Account", "Card", "POS"]
        );
      }

      const updatedGirvi = await prisma.girvi.update({
        where: { girv_uuid: girvUuid },
        data: updateData,
      });

      // Resync disbursement + first-month journals when financial fields edited
      if (!hasTransactions && existing.girv_status === "ACTIVE") {
        const processingFeesAccId = await resolveIncomeAccount(
          prisma,
          updatedGirvi.girv_firm_id,
          updatedGirvi.girv_own_id || 1,
          "PROCESSING"
        );

        try {
          await this.deleteLoanJournalVouchers(dbUrl, updatedGirvi, ["add", "firstMonth"]);

          await this.postAddLoanJournal(dbUrl, updatedGirvi, processingFeesAccId);

          if (updatedGirvi.girv_first_int === "Y") {
            await this.postFirstMonthInterestJournal(dbUrl, updatedGirvi);
          }
        } catch (journalErr) {
          // Restore prior loan financials + original journals
          try {
            const restoreFields = {
              girv_prin_amt: existing.girv_prin_amt,
              girv_final_amt: existing.girv_final_amt,
              girv_roi: existing.girv_roi,
              girv_roi_type: existing.girv_roi_type,
              girv_interest_method: existing.girv_interest_method,
              girv_compound_freq: existing.girv_compound_freq,
              girv_process_amt: existing.girv_process_amt,
              girv_process_per: existing.girv_process_per,
              girv_charge_amt: existing.girv_charge_amt,
              girv_charge_per: existing.girv_charge_per,
              girv_start_date: existing.girv_start_date,
              girv_type: existing.girv_type,
              girv_first_int: existing.girv_first_int,
              girv_first_int_dr_acc_id: existing.girv_first_int_dr_acc_id,
              girv_first_int_cr_acc_id: existing.girv_first_int_cr_acc_id,
              girv_cash_amt: existing.girv_cash_amt,
              girv_bank_amt: existing.girv_bank_amt,
              girv_online_amt: existing.girv_online_amt,
              girv_card_amt: existing.girv_card_amt,
              girv_cash_acc_id: existing.girv_cash_acc_id,
              girv_bank_acc_id: existing.girv_bank_acc_id,
              girv_online_acc_id: existing.girv_online_acc_id,
              girv_card_acc_id: existing.girv_card_acc_id,
              girv_dr_acc_id: existing.girv_dr_acc_id,
              girv_firm_id: existing.girv_firm_id,
            };
            await prisma.girvi.update({
              where: { girv_uuid: girvUuid },
              data: restoreFields,
            });
            await this.deleteLoanJournalVouchers(dbUrl, existing, ["add", "firstMonth"]);
            await this.postAddLoanJournal(dbUrl, existing, processingFeesAccId);
            if (existing.girv_first_int === "Y") {
              await this.postFirstMonthInterestJournal(dbUrl, existing);
            }
          } catch (restoreErr) {
            console.error(
              "❌ Failed to restore loan journals after update failure:",
              restoreErr.message
            );
          }
          throw new Error(
            `Loan journal update failed and was rolled back: ${journalErr.message}`
          );
        }
      }

      // Update Stock Items if allowed (only if no transactions and status is active)
      if (!hasTransactions && existing.girv_status === 'ACTIVE' && stockItems) {
        const oldStocks = await prisma.stock.findMany({
          where: {
            st_referance_panel: 'girvi',
            st_referance_id: existing.girv_id,
          },
          select: { st_image: true },
        });

        const newPaths = new Set(
          stockItems
            .map((item) => imageService.resolveStoredPath(item.st_image))
            .filter(Boolean)
        );

        for (const old of oldStocks) {
          const oldPath = imageService.resolveStoredPath(old.st_image);
          if (oldPath && !newPaths.has(oldPath)) {
            await imageService.deleteFile(oldPath);
          }
        }

        // Delete old items
        await prisma.stock.deleteMany({
          where: { 
            st_referance_panel: 'girvi',
            st_referance_id: updatedGirvi.girv_id 
          }
        });

        // Insert new ones
        if (stockItems.length > 0) {
          const itemsToInsert = stockItems.map(item => ({
            ...item,
            st_referance_panel: 'girvi',
            st_referance_id: updatedGirvi.girv_id,
            st_firm_id: updatedGirvi.girv_firm_id,
            st_user_id: updatedGirvi.girv_user_id,
            st_own_id: updatedGirvi.girv_own_id,
          }));
          await prisma.stock.createMany({
            data: itemsToInsert,
          });
        }
      }

      return updatedGirvi;
    } finally {
      await prisma.$disconnect();
    }
  }

  async transferLoan(dbUrl, girvUuid, formData, requestUser) {
    const prisma = this.getPrisma(dbUrl);
    const transferTo = String(formData.transfer_to || "firm").toLowerCase();
    const isMoneyLenderTransfer = transferTo === "money_lender";
    const targetFirmId = parseInt(formData.targetFirmId, 10);
    const targetMoneyLenderId = formData.targetMoneyLenderId
      ? parseInt(formData.targetMoneyLenderId, 10)
      : null;

    try {
      if (!targetFirmId || Number.isNaN(targetFirmId)) {
        throw new Error("Target firm ID is required for transfer.");
      }
      if (isMoneyLenderTransfer && (!targetMoneyLenderId || Number.isNaN(targetMoneyLenderId))) {
        throw new Error("Target money lender ID is required for money lender transfer.");
      }

      const existing = await prisma.girvi.findUnique({
        where: { girv_uuid: girvUuid },
        include: { user: true }
      });
      if (!existing) throw new Error("Loan not found.");
      if (existing.girv_status !== "ACTIVE") throw new Error("Only active loans can be transferred.");

      const targetFirm = await prisma.firm.findUnique({
        where: { firm_id: targetFirmId }
      });
      if (!targetFirm) throw new Error("Target firm not found.");
      if (targetFirm.firm_own_id !== existing.girv_own_id) {
        throw new Error("Target firm must belong to the same owner.");
      }

      let targetMoneyLender = null;
      if (isMoneyLenderTransfer) {
        targetMoneyLender = await prisma.moneyLender.findFirst({
          where: {
            ml_id: targetMoneyLenderId,
            is_active: true,
          }
        });
        if (!targetMoneyLender) throw new Error("Target money lender not found or inactive.");
        if (targetMoneyLender.ml_own_id !== existing.girv_own_id) {
          throw new Error("Target money lender must belong to the same owner.");
        }
        if (
          targetMoneyLender.ml_firm_id &&
          targetMoneyLender.ml_firm_id !== targetFirmId
        ) {
          throw new Error("Selected money lender does not belong to the selected transfer firm.");
        }
      }

      // Check if user exists in target firm
      let targetUser = await prisma.user.findFirst({
        where: {
          user_firm_id: targetFirmId,
          user_mobile_no: existing.user.user_mobile_no,
          user_is_deleted: false,
        }
      });

      // If user doesn't exist in target firm, duplicate them
      if (!targetUser) {
        const {
          user_id,
          user_uuid,
          user_firm_id,
          user_add_date,
          user_created_at,
          user_updated_at,
          ...userCloneData
        } = existing.user;
        targetUser = await prisma.user.create({
          data: {
            ...userCloneData,
            user_firm_id: targetFirmId,
            user_created_by: requestUser.own_login_id || "System Transfer"
          }
        });
      }

      const items = await prisma.stock.findMany({
        where: {
          st_referance_panel: "girvi",
          st_referance_id: existing.girv_id,
          st_is_deleted: false
        }
      });

      // Resolve TARGET firm accounts (do not reuse source firm account IDs)
      const targetDrAccId = await this.resolveAccount(
        prisma,
        targetFirmId,
        null,
        [
          existing.girv_type === "unsecured" ? "Unsecured Loans" : "Secured Loans",
          "Loans & Advances",
        ]
      );
      const targetCashAccId = await this.resolveAccount(
        prisma,
        targetFirmId,
        formData.girv_cash_acc_id,
        ["Cash In Hand", "Cash"]
      );
      const targetBankAccId = await this.resolveAccount(
        prisma,
        targetFirmId,
        formData.girv_bank_acc_id,
        ["Bank Account", "Bank"]
      );
      const targetOnlineAccId = await this.resolveAccount(
        prisma,
        targetFirmId,
        formData.girv_online_acc_id,
        ["Online Account", "Online"]
      );
      const targetCardAccId = await this.resolveAccount(
        prisma,
        targetFirmId,
        formData.girv_card_acc_id,
        ["Card Account", "Card", "POS"]
      );

      const newGirvi = await prisma.$transaction(async (tx) => {
        // 1. Create the new loan in the target firm
        const {
          girv_id,
          girv_uuid,
          girv_firm_id,
          girv_user_id,
          girv_status,
          girv_created_at,
          girv_updated_at,
          girv_transfer_firm_id,
          girv_transfer_girv_id,
          girv_transfer_ml_id,
          girv_is_transferred_in,
          girv_transfer_from_girv_id,
          girv_transfer_from_firm_id,
          girv_dr_acc_id,
          girv_first_int,
          girv_first_int_cr_acc_id,
          girv_first_int_dr_acc_id,
          girv_cash_acc_id,
          girv_bank_acc_id,
          girv_online_acc_id,
          girv_card_acc_id,
          girv_cash_amt,
          girv_bank_amt,
          girv_online_amt,
          girv_card_amt,
          user,
          transferMoneyLender,
          ...girviCloneData
        } = existing;

        const created = await tx.girvi.create({
          data: {
            ...girviCloneData,
            girv_firm_id: targetFirmId,
            girv_user_id: targetUser.user_id,
            girv_status: "ACTIVE",
            girv_transfer_firm_id: null,
            girv_transfer_girv_id: null,
            girv_transfer_ml_id: null,
            girv_is_transferred_in: true,
            girv_transfer_from_girv_id: existing.girv_id,
            girv_transfer_from_firm_id: existing.girv_firm_id,
            girv_dr_acc_id: targetDrAccId,
            girv_first_int: "N",
            girv_first_int_cr_acc_id: null,
            girv_first_int_dr_acc_id: null,
            girv_created_by: requestUser.own_login_id || "System Transfer",
            girv_start_date: formData.transfer_date || girviCloneData.girv_start_date,
            girv_prin_amt: formData.girv_prin_amt ? parseFloat(formData.girv_prin_amt) : girviCloneData.girv_prin_amt,
            girv_roi: formData.girv_roi ? parseFloat(formData.girv_roi) : girviCloneData.girv_roi,
            girv_interest_method: formData.girv_interest_method || girviCloneData.girv_interest_method,
            girv_packet_no: formData.girv_packet_no || girviCloneData.girv_packet_no,
            girv_locker_no: formData.girv_locker_no || girviCloneData.girv_locker_no,
            girv_cash_acc_id: targetCashAccId,
            girv_cash_info: formData.girv_cash_info || null,
            girv_cash_amt: formData.girv_cash_amt ? parseFloat(formData.girv_cash_amt) : 0,
            girv_bank_acc_id: targetBankAccId,
            girv_bank_info: formData.girv_bank_info || null,
            girv_bank_amt: formData.girv_bank_amt ? parseFloat(formData.girv_bank_amt) : 0,
            girv_online_acc_id: targetOnlineAccId,
            girv_online_info: formData.girv_online_info || null,
            girv_online_amt: formData.girv_online_amt ? parseFloat(formData.girv_online_amt) : 0,
            girv_card_acc_id: targetCardAccId,
            girv_card_info: formData.girv_card_info || null,
            girv_card_amt: formData.girv_card_amt ? parseFloat(formData.girv_card_amt) : 0,
            girv_pay_info: formData.girv_pay_info || null,
            girv_other_info: formData.girv_other_info || null,
          }
        });

        // 2. Duplicate stock items
        if (items.length > 0) {
          const itemsToInsert = items.map((item) => {
            const {
              st_id,
              st_uuid,
              st_referance_id,
              st_firm_id,
              st_user_id,
              st_created_at,
              st_updated_at,
              ...itemCloneData
            } = item;
            return {
              ...itemCloneData,
              st_referance_id: created.girv_id,
              st_firm_id: targetFirmId,
              st_user_id: targetUser.user_id,
              st_created_by: requestUser.own_login_id || "System Transfer"
            };
          });
          await tx.stock.createMany({
            data: itemsToInsert
          });
        }

        // 3. Mark old loan as TRANSFERRED
        const mlName = targetMoneyLender
          ? [targetMoneyLender.ml_first_name, targetMoneyLender.ml_last_name].filter(Boolean).join(" ").trim()
          : "";
        const transferNote = isMoneyLenderTransfer
          ? `Transferred to money lender ${mlName || `#${targetMoneyLenderId}`} (ML ID: ${targetMoneyLenderId}) via firm ${targetFirm.firm_name} (ID: ${targetFirmId})`
          : `Transferred to firm ${targetFirm.firm_name} (ID: ${targetFirmId})`;

        const sourcePrinBefore = parseFloat(existing.girv_prin_amt) || 0;
        const sourceFinalBefore = parseFloat(existing.girv_final_amt) || 0;

        await tx.girvi.update({
          where: { girv_uuid: girvUuid },
          data: {
            girv_status: "TRANSFERRED",
            girv_transfer_firm_id: targetFirmId,
            girv_transfer_girv_id: created.girv_id,
            girv_transfer_ml_id: isMoneyLenderTransfer ? targetMoneyLenderId : null,
            girv_prin_amt: 0,
            girv_final_amt: 0,
            girv_other_info:
              transferNote + (existing.girv_other_info ? ` | ${existing.girv_other_info}` : ""),
          },
        });

        created._sourcePrinBefore = sourcePrinBefore;
        created._sourceFinalBefore = sourceFinalBefore;
        return created;
      });

      const settlementCash = parseFloat(formData.girv_cash_amt) || 0;
      const settlementBank = parseFloat(formData.girv_bank_amt) || 0;
      const settlementOnline = parseFloat(formData.girv_online_amt) || 0;
      const settlementCard = parseFloat(formData.girv_card_amt) || 0;
      const settlementTotal =
        settlementCash + settlementBank + settlementOnline + settlementCard;
      // Clear books using actual outstanding on source loan (not editable form prin)
      const sourcePrin =
        parseFloat(newGirvi._sourcePrinBefore) ||
        parseFloat(existing.girv_prin_amt) ||
        0;
      const newPrin = parseFloat(newGirvi.girv_prin_amt) || sourcePrin;
      let interestAmt = parseFloat(formData.transfer_int_amt);
      if (Number.isNaN(interestAmt)) {
        interestAmt = Math.max(0, parseFloat((settlementTotal - sourcePrin).toFixed(2)));
      }
      let extraAmt = 0;
      let discAmt = 0;
      const afterPrin = parseFloat((settlementTotal - sourcePrin).toFixed(2));
      if (afterPrin >= 0) {
        if (interestAmt > afterPrin) interestAmt = afterPrin;
        extraAmt = parseFloat((afterPrin - interestAmt).toFixed(2));
      } else {
        interestAmt = 0;
        discAmt = Math.abs(afterPrin);
      }

      // 4. Account entries for transfer settlement
      try {
        await this.postTransferLoanJournals(
          dbUrl,
          existing,
          newGirvi,
          isMoneyLenderTransfer,
          {
            cash: settlementCash,
            bank: settlementBank,
            online: settlementOnline,
            card: settlementCard,
            sourcePrin,
            newPrin,
            interestAmt,
            extraAmt,
            discAmt,
          }
        );
      } catch (journalErr) {
        await this.compensateFailedTransfer(
          dbUrl,
          existing,
          newGirvi,
          newGirvi._sourcePrinBefore,
          newGirvi._sourceFinalBefore
        );
        throw journalErr;
      }

      return newGirvi;
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Scale payment channels so they sum to targetAmount (for transfer IN principal booking).
   */
  scaleChannelsToAmount(channels, targetAmount) {
    const cash = parseFloat(channels.cash) || 0;
    const bank = parseFloat(channels.bank) || 0;
    const online = parseFloat(channels.online) || 0;
    const card = parseFloat(channels.card) || 0;
    const total = cash + bank + online + card;
    const target = parseFloat(targetAmount) || 0;
    if (!(target > 0)) return { cash: 0, bank: 0, online: 0, card: 0 };
    if (!(total > 0)) return { cash: target, bank: 0, online: 0, card: 0 };
    if (Math.abs(total - target) < 0.01) return { cash, bank, online, card };
    const scale = target / total;
    const scaled = {
      cash: parseFloat((cash * scale).toFixed(2)),
      bank: parseFloat((bank * scale).toFixed(2)),
      online: parseFloat((online * scale).toFixed(2)),
      card: parseFloat((card * scale).toFixed(2)),
    };
    // Fix rounding on largest channel
    const sum = scaled.cash + scaled.bank + scaled.online + scaled.card;
    const diff = parseFloat((target - sum).toFixed(2));
    if (diff !== 0) {
      const key = ["cash", "bank", "online", "card"].sort(
        (a, b) => scaled[b] - scaled[a]
      )[0];
      scaled[key] = parseFloat((scaled[key] + diff).toFixed(2));
    }
    return scaled;
  }

  async compensateFailedTransfer(
    dbUrl,
    sourceGirvi,
    newGirvi,
    sourcePrinBefore,
    sourceFinalBefore
  ) {
    const prisma = this.getPrisma(dbUrl);
    try {
      await this.deleteLoanJournalVouchers(dbUrl, sourceGirvi, ["transferOut"]);
      await this.deleteLoanJournalVouchers(dbUrl, newGirvi, ["transferIn"]);
      await prisma.stock.deleteMany({
        where: {
          st_referance_panel: "girvi",
          st_referance_id: newGirvi.girv_id,
        },
      });
      await prisma.girvi.delete({ where: { girv_id: newGirvi.girv_id } }).catch(() => {});
      await prisma.girvi.update({
        where: { girv_id: sourceGirvi.girv_id },
        data: {
          girv_status: "ACTIVE",
          girv_transfer_firm_id: null,
          girv_transfer_girv_id: null,
          girv_transfer_ml_id: null,
          girv_prin_amt: sourcePrinBefore ?? sourceGirvi.girv_prin_amt,
          girv_final_amt: sourceFinalBefore ?? sourceGirvi.girv_final_amt,
        },
      });
    } catch (err) {
      console.error("❌ Failed to compensate transfer after journal error:", err.message);
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * TRANSFER LOAN OUT (source): DR cash · CR loan prin · CR Interest Rec (+ extra/disc)
   * TRANSFER LOAN IN (target): DR loan prin · CR cash (principal only)
   */
  async postTransferLoanJournals(
    dbUrl,
    sourceGirvi,
    targetGirvi,
    isMoneyLenderTransfer = false,
    amounts = {}
  ) {
    if (!sourceGirvi || !targetGirvi) return;

    const prisma = this.getPrisma(dbUrl);
    try {
      const transferDate = targetGirvi.girv_start_date;
      const cash = parseFloat(amounts.cash) || 0;
      const bank = parseFloat(amounts.bank) || 0;
      const online = parseFloat(amounts.online) || 0;
      const card = parseFloat(amounts.card) || 0;
      const settlement = cash + bank + online + card;
      const sourcePrin = parseFloat(amounts.sourcePrin) || 0;
      const newPrin = parseFloat(amounts.newPrin) || sourcePrin;
      const interestAmt = parseFloat(amounts.interestAmt) || 0;
      const extraAmt = parseFloat(amounts.extraAmt) || 0;
      const discAmt = parseFloat(amounts.discAmt) || 0;
      if (!(settlement > 0) && !(sourcePrin > 0)) return;

      const sourceLoanAcc =
        sourceGirvi.girv_dr_acc_id ||
        (await this.resolveAccount(prisma, sourceGirvi.girv_firm_id, null, [
          sourceGirvi.girv_type === "unsecured" ? "Unsecured Loans" : "Secured Loans",
          "Loans & Advances",
        ]));
      const interestAccId = await resolveIncomeAccount(
        prisma,
        sourceGirvi.girv_firm_id,
        sourceGirvi.girv_own_id || 1,
        "INTEREST"
      );
      const extraAccId = await resolveIncomeAccount(
        prisma,
        sourceGirvi.girv_firm_id,
        sourceGirvi.girv_own_id || 1,
        "EXTRA"
      );
      const discAccId = await this.resolveAccount(
        prisma,
        sourceGirvi.girv_firm_id,
        null,
        ["Indirect Expenses", "Discount Account", "Expenses (Indirect)"]
      );

      const sourceCashAcc = await this.resolveAccount(
        prisma,
        sourceGirvi.girv_firm_id,
        null,
        ["Cash In Hand", "Cash"]
      );
      const sourceBankAcc = await this.resolveAccount(
        prisma,
        sourceGirvi.girv_firm_id,
        null,
        ["Bank Account", "Bank"]
      );
      const sourceOnlineAcc = await this.resolveAccount(
        prisma,
        sourceGirvi.girv_firm_id,
        null,
        ["Online Account", "Online"]
      );
      const sourceCardAcc = await this.resolveAccount(
        prisma,
        sourceGirvi.girv_firm_id,
        null,
        ["Card Account", "Card", "POS"]
      );

      const toLabel = isMoneyLenderTransfer
        ? `ML transfer from Loan ${formatLoanNo(sourceGirvi)}`
        : `Firm transfer from Loan ${formatLoanNo(sourceGirvi)} → ${formatLoanNo(targetGirvi)}`;

      const outJournal = {
        journal_date: {
          jrnl_date: transferDate,
          jrnl_firm_id: sourceGirvi.girv_firm_id,
          jrnl_own_id: sourceGirvi.girv_own_id,
          jrnl_user_id: sourceGirvi.girv_user_id,
          jrnl_amt: settlement || sourcePrin,
          jrnl_panel: "Girvi",
          jrnl_other_info: transferOutVoucher(sourceGirvi, targetGirvi),
        },
        joural_trans_data: [
          {
            jrtr_crdr: "DR",
            jrtr_date: transferDate,
            jrtr_dr_acc_id: sourceCashAcc,
            jrtr_dr_amt: cash,
            jrtr_acc_info: toLabel,
          },
          {
            jrtr_crdr: "DR",
            jrtr_date: transferDate,
            jrtr_dr_acc_id: sourceBankAcc,
            jrtr_dr_amt: bank,
            jrtr_acc_info: toLabel,
          },
          {
            jrtr_crdr: "DR",
            jrtr_date: transferDate,
            jrtr_dr_acc_id: sourceOnlineAcc,
            jrtr_dr_amt: online,
            jrtr_acc_info: toLabel,
          },
          {
            jrtr_crdr: "DR",
            jrtr_date: transferDate,
            jrtr_dr_acc_id: sourceCardAcc,
            jrtr_dr_amt: card,
            jrtr_acc_info: toLabel,
          },
          {
            jrtr_crdr: "DR",
            jrtr_date: transferDate,
            jrtr_dr_acc_id: discAccId,
            jrtr_dr_amt: discAmt,
            jrtr_acc_info: loanLine("Transfer Discount", sourceGirvi),
          },
          {
            jrtr_crdr: "CR",
            jrtr_date: transferDate,
            jrtr_cr_acc_id: sourceLoanAcc,
            jrtr_cr_amt: sourcePrin,
            jrtr_acc_info: loanLine("Transfer Loan OUT principal", sourceGirvi),
          },
          {
            jrtr_crdr: "CR",
            jrtr_date: transferDate,
            jrtr_cr_acc_id: interestAccId,
            jrtr_cr_amt: interestAmt,
            jrtr_acc_info: loanLine("Transfer Interest Rec", sourceGirvi),
          },
          {
            jrtr_crdr: "CR",
            jrtr_date: transferDate,
            jrtr_cr_acc_id: extraAccId,
            jrtr_cr_amt: extraAmt,
            jrtr_acc_info: loanLine("Transfer Extra", sourceGirvi),
          },
        ].filter(
          (t) =>
            (t.jrtr_cr_amt && parseFloat(t.jrtr_cr_amt) > 0) ||
            (t.jrtr_dr_amt && parseFloat(t.jrtr_dr_amt) > 0)
        ),
      };

      await journalService.create_journal_entry(dbUrl, outJournal);

      const inChannels = this.scaleChannelsToAmount(
        { cash, bank, online, card },
        newPrin
      );
      const targetLoanAcc =
        targetGirvi.girv_dr_acc_id ||
        (await this.resolveAccount(prisma, targetGirvi.girv_firm_id, null, [
          targetGirvi.girv_type === "unsecured" ? "Unsecured Loans" : "Secured Loans",
          "Loans & Advances",
        ]));

      const inJournal = {
        journal_date: {
          jrnl_date: transferDate,
          jrnl_firm_id: targetGirvi.girv_firm_id,
          jrnl_own_id: targetGirvi.girv_own_id,
          jrnl_user_id: targetGirvi.girv_user_id,
          jrnl_amt: newPrin,
          jrnl_panel: "Girvi",
          jrnl_other_info: transferInVoucher(targetGirvi, sourceGirvi),
        },
        joural_trans_data: [
          {
            jrtr_crdr: "CR",
            jrtr_date: transferDate,
            jrtr_cr_acc_id: targetGirvi.girv_cash_acc_id,
            jrtr_cr_amt: inChannels.cash,
            jrtr_acc_info: targetGirvi.girv_cash_info,
          },
          {
            jrtr_crdr: "CR",
            jrtr_date: transferDate,
            jrtr_cr_acc_id: targetGirvi.girv_bank_acc_id,
            jrtr_cr_amt: inChannels.bank,
            jrtr_acc_info: targetGirvi.girv_bank_info,
          },
          {
            jrtr_crdr: "CR",
            jrtr_date: transferDate,
            jrtr_cr_acc_id: targetGirvi.girv_online_acc_id,
            jrtr_cr_amt: inChannels.online,
            jrtr_acc_info: targetGirvi.girv_online_info,
          },
          {
            jrtr_crdr: "CR",
            jrtr_date: transferDate,
            jrtr_cr_acc_id: targetGirvi.girv_card_acc_id,
            jrtr_cr_amt: inChannels.card,
            jrtr_acc_info: targetGirvi.girv_card_info,
          },
          {
            jrtr_crdr: "DR",
            jrtr_date: transferDate,
            jrtr_dr_acc_id: targetLoanAcc,
            jrtr_dr_amt: newPrin,
            jrtr_acc_info: loanLine("Transfer Loan IN book", targetGirvi),
          },
        ].filter(
          (t) =>
            (t.jrtr_cr_amt && parseFloat(t.jrtr_cr_amt) > 0) ||
            (t.jrtr_dr_amt && parseFloat(t.jrtr_dr_amt) > 0)
        ),
      };

      await journalService.create_journal_entry(dbUrl, inJournal);
    } finally {
      await prisma.$disconnect();
    }
  }

  async deleteCreationJournals(dbUrl, girvi) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const patterns = loanJournalDeletePatterns(girvi, ["add", "firstMonth"]);
      const deletedIds = new Set();

      for (const pattern of patterns) {
        const journals = await prisma.journal.findMany({
          where: {
            jrnl_other_info: pattern,
            jrnl_panel: "Girvi",
            jrnl_firm_id: girvi.girv_firm_id,
            jrnl_is_deleted: false,
          },
        });

        for (const journal of journals) {
          if (deletedIds.has(journal.jrnl_id)) continue;
          await deletePanelJournal(dbUrl, journal);
          deletedIds.add(journal.jrnl_id);
        }
      }

      return deletedIds.size;
    } finally {
      await prisma.$disconnect();
    }
  }

  async deleteGirvi(dbUrl, reqUser, girvId) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const isNum = !isNaN(girvId) && !isNaN(parseInt(girvId, 10));
      let girvi = null;

      if (isNum) {
        girvi = await prisma.girvi.findFirst({
          where: {
            girv_id: parseInt(girvId, 10),
            girv_is_deleted: false,
          },
        });
      }

      if (!girvi && typeof girvId === "string") {
        girvi = await prisma.girvi.findFirst({
          where: {
            girv_is_deleted: false,
            OR: [
              { girv_unique_code: girvId.trim() },
              { girv_loan_no: girvId.trim() },
            ],
          },
        });
      }

      if (!girvi) {
        throw new Error("Girvi (Loan) record not found.");
      }

      if (girvi.girv_status !== "ACTIVE") {
        throw new Error(`Only ACTIVE loans can be deleted. Current status: ${girvi.girv_status}.`);
      }

      const [depositCount, releaseCount, apCount, auctionCount] = await Promise.all([
        prisma.girviDeposit.count({
          where: { dep_girv_id: girvi.girv_id, dep_is_deleted: false },
        }),
        prisma.girviRelease.count({
          where: { rel_girv_id: girvi.girv_id, rel_is_deleted: false },
        }),
        prisma.additionalPrincipal.count({
          where: { ap_girv_id: girvi.girv_id, ap_is_deleted: false },
        }),
        prisma.auctionLoan.count({
          where: { al_girv_id: girvi.girv_id },
        }),
      ]);

      if (depositCount > 0 || releaseCount > 0 || apCount > 0 || auctionCount > 0) {
        throw new Error(
          "Cannot delete loan with deposits, releases, additional principal, or auction records. Remove those transactions first."
        );
      }

      await this.deleteCreationJournals(dbUrl, girvi);

      const deleted = await prisma.girvi.update({
        where: { girv_id: girvi.girv_id },
        data: {
          girv_is_deleted: true,
          girv_deleted_at: new Date(),
          girv_deleted_by: reqUser?.own_login_id || "Admin",
        },
      });

      await prisma.stock.updateMany({
        where: {
          st_referance_panel: "girvi",
          st_referance_id: girvi.girv_id,
          st_is_deleted: false,
        },
        data: {
          st_is_deleted: true,
          st_deleted_at: new Date(),
        },
      });

      return deleted;
    } finally {
      await prisma.$disconnect();
    }
  }
}

module.exports = new GirviService();
