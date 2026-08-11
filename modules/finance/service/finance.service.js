"use strict";

const { PrismaClient } = require("../../../prisma/generated/main");
const financeTransactionService = require("./finance_transaction.service");
const financeMoneyTransService = require("./finance_money_trans.service");
const journalService = require("../../journal/service/journal.service");
const serialNumberService = require("../../../common/service/serialNumber.service");
const {
  computeFinanceFine,
  sumPaidFineAndCollect,
} = require("../../../utils/financeFine");
const messageDispatchService = require("../../../common/service/message-dispatch.service");
const {
  addFinanceVoucher,
  financeCollectionVoucher,
  finLine,
  finRef,
  financeJournalDeletePatterns,
} = require("../../../utils/journalNarration");
const { assertWholeNumberEmi } = require("../../../utils/financeEmiValidation");
const {
  buildFinanceInterestSummary,
  isBundledInterestFinance,
} = require("../../../utils/financeInterest");

function buildFinanceRollbackSummary(finance = {}) {
  const emiPaid = (finance.finance_trans || []).reduce(
    (s, e) => s + (parseFloat(e.ft_paid_amt) || 0),
    0
  );
  const intSummary = buildFinanceInterestSummary(finance);
  const paidFine = sumPaidFineAndCollect(finance.finance_money_trans || []);
  return {
    emi_paid: parseFloat(emiPaid.toFixed(2)),
    interest_paid: intSummary.interest_paid,
    fine_paid: paidFine.finePaid,
    collect_paid: paidFine.collectPaid,
    fine_collect_paid: paidFine.fineCollectPaid,
    can_rollback_emi: emiPaid > 0.01,
    can_rollback_interest:
      intSummary.interest_separate && intSummary.interest_paid > 0.01,
    can_rollback_fine: paidFine.fineCollectPaid > 0.01,
  };
}

function evaluateFinanceSettlement(finance, moneyTrans, emis, asOfDate = null) {
  const allEmisPaid =
    emis.length > 0 && emis.every((emi) => emi.ft_emi_status === "PAID");
  const ctx = {
    ...finance,
    finance_trans: emis,
    finance_money_trans: moneyTrans,
  };
  const intSummary = buildFinanceInterestSummary(ctx);
  const interestSettled =
    !intSummary.interest_separate || intSummary.pending_interest <= 0.01;
  const fineCalc = computeFinanceFine(finance, emis, asOfDate);
  const paidFine = sumPaidFineAndCollect(moneyTrans);
  const pendingFine = Math.max(
    0,
    parseFloat((fineCalc.totalFine - paidFine.finePaid).toFixed(2))
  );
  const pendingCollect = Math.max(
    0,
    parseFloat((fineCalc.collectAmt - paidFine.collectPaid).toFixed(2))
  );
  const pendingFineTotal = parseFloat((pendingFine + pendingCollect).toFixed(2));
  const fineSettled = pendingFineTotal <= 0.01;
  return {
    allEmisPaid,
    interestSettled,
    fineSettled,
    fullySettled: allEmisPaid && interestSettled && fineSettled,
    pendingFineTotal,
  };
}

class FinanceService {
  getPrisma(dbUrl) {
    return new PrismaClient({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
  }

  /**
   * Helper to parse account ID and fall back to firm's default account if not selected.
   */
  async resolveAccount(prisma, firmId, customAccId, fallbackNames) {
    let parsedId = customAccId ? parseInt(customAccId) : null;
    if (parsedId && !isNaN(parsedId) && parsedId > 0) {
      return parsedId;
    }
    
    // Try to find the fallback account under this firm in the database
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

  /**
   * Create a new finance record with transactions and journal entries.
   * Accounting (loan-aligned, interest collected separately):
   *   DR Unsecured Loans = principal
   *   CR Cash/Bank/...   = disbursed (prin − process fee)
   *   CR Interest Rec    = process fee only (ROI interest via INTEREST payments)
   */
  async create_finance(dbUrl, data) {
    const prisma = this.getPrisma(dbUrl);
    let createdFinId = null;
    try {
      const firmId = parseInt(data.fin_firm_id);
      const prin = parseFloat(data.fin_prin_amt) || 0;
      const processAmt = parseFloat(data.fin_proccess_amt) || 0;
      const roi = parseFloat(data.fin_roi) || 0;
      const n = parseInt(data.fin_no_of_emi, 10) || 0;

      if (!(prin > 0)) throw new Error("Principal amount must be greater than 0");
      if (!(n > 0)) throw new Error("Number of EMIs must be greater than 0");
      if (processAmt < 0 || processAmt > prin) {
        throw new Error("Process fee must be between 0 and principal");
      }

      const fineAmt = parseFloat(data.fin_fine_amt || 0) || 0;
      const fineEmiNo = parseInt(data.fin_fine_emi_no || 0, 10) || 0;
      if (fineAmt > 0 || fineEmiNo > 0) {
        if (!(fineAmt > 0 && fineEmiNo > 0)) {
          throw new Error("Both Fine Amount and Fine EMI No are required when fine is set");
        }
        if (fineEmiNo > n) {
          throw new Error(
            `Fine EMI No (${fineEmiNo}) cannot exceed total number of EMIs (${n})`
          );
        }
      }

      const interestAmt =
        roi > 0 ? parseFloat(((prin * roi) / 100).toFixed(2)) : 0;
      const receivable = parseFloat((prin + interestAmt).toFixed(2));
      const disbursed = parseFloat((prin - processAmt).toFixed(2));
      const emiAmt = assertWholeNumberEmi(prin, n);
      void receivable;

      const fin_cash_amt_val = parseFloat(data.fin_cash_amt || 0);
      const fin_bank_amt_val = parseFloat(data.fin_bank_amt || 0);
      const fin_online_amt_val = parseFloat(data.fin_online_amt || 0);
      const fin_card_amt_val = parseFloat(data.fin_card_amt || 0);
      const channelSum = parseFloat(
        (fin_cash_amt_val + fin_bank_amt_val + fin_online_amt_val + fin_card_amt_val).toFixed(2)
      );
      if (Math.abs(channelSum - disbursed) > 0.01) {
        throw new Error(
          `Payment channels (${channelSum}) must equal disbursement amount (${disbursed})`
        );
      }

      let fin_dr_acc_id = data.fin_dr_acc_id ? parseInt(data.fin_dr_acc_id) : 0;
      if (!fin_dr_acc_id || fin_dr_acc_id === 0) {
        fin_dr_acc_id = await this.resolveAccount(prisma, firmId, null, [
          "Unsecured Loans",
          "Loans & Advances",
          "Finance Dr Account",
          "Loan Account",
        ]);
      }
      if (!fin_dr_acc_id) {
        throw new Error("Loan receivable account (Unsecured Loans) not found for firm");
      }

      const feeIncomeAccId = await this.resolveAccount(prisma, firmId, null, [
        "Interest Rec",
        "Indirect Incomes",
        "Direct Incomes",
      ]);
      if (processAmt > 0 && !feeIncomeAccId) {
        throw new Error(
          "Income account (Interest Rec) not found for firm. Required for process fee."
        );
      }

      const fin_cash_acc_id =
        fin_cash_amt_val > 0
          ? await this.resolveAccount(prisma, firmId, data.fin_cash_acc_id, ["Cash In Hand", "Cash"])
          : null;
      const fin_bank_acc_id =
        fin_bank_amt_val > 0
          ? await this.resolveAccount(prisma, firmId, data.fin_bank_acc_id, ["Bank Account", "Bank"])
          : null;
      const fin_online_acc_id =
        fin_online_amt_val > 0
          ? await this.resolveAccount(prisma, firmId, data.fin_online_acc_id, ["Online Account", "Online"])
          : null;
      const fin_card_acc_id =
        fin_card_amt_val > 0
          ? await this.resolveAccount(prisma, firmId, data.fin_card_acc_id, ["Card Account", "Card", "POS"])
          : null;

      let finUniqueCode = data.fin_unique_code;
      if (!finUniqueCode) {
        finUniqueCode = await serialNumberService.getNextSerialNumber(prisma, "FINANCE");
      }

      const finance = await prisma.finance.create({
        data: {
          fin_unique_code: finUniqueCode,
          fin_own_id: parseInt(data.fin_own_id || 1),
          fin_firm_id: firmId,
          fin_user_id: data.fin_user_id ? parseInt(data.fin_user_id) : 0,
          fin_staff_id: parseInt(data.fin_staff_id || 0),
          fin_prin_amt: prin,
          fin_no_of_emi: n,
          fin_start_date: data.fin_start_date,
          fin_freq_type: data.fin_freq_type || "MONTHLY",
          fin_freq: data.fin_freq != null && String(data.fin_freq).trim() !== "" ? String(data.fin_freq) : "1",
          fin_roi: data.fin_roi,
          fin_collec_amt: parseFloat(data.fin_collec_amt || 0),
          fin_proccess_amt: processAmt,
          fin_fine_amt: fineAmt,
          fin_fine_emi_no: fineEmiNo,
          fin_emi_amt: emiAmt,
          fin_final_amt: disbursed,

          fin_cash_amt: String(data.fin_cash_amt || ""),
          fin_bank_amt: String(data.fin_bank_amt || ""),
          fin_online_amt: String(data.fin_online_amt || ""),
          fin_card_amt: String(data.fin_card_amt || ""),

          fin_cash_acc_id,
          fin_bank_acc_id,
          fin_online_acc_id,
          fin_card_acc_id,
          fin_dr_acc_id,

          fin_cash_info: data.fin_cash_info || "",
          fin_bank_info: data.fin_bank_info || "",
          fin_online_info: data.fin_online_info || "",
          fin_card_info: data.fin_card_info || "",

          fin_pay_info: data.fin_pay_info || "",
          fin_other_info: data.fin_other_info || "",
          fin_add_date: new Date().toISOString().split("T")[0],
          fin_created_by: data.fin_created_by || "",
        },
      });
      createdFinId = finance.fin_id;

      await financeTransactionService.create_finance_transaction(
        dbUrl,
        {
          ft_firm_id: finance.fin_firm_id,
          ft_own_id: finance.fin_own_id,
          ft_user_id: finance.fin_user_id,
          ft_fin_id: finance.fin_id,
          ft_emi_amt: finance.fin_emi_amt,
        },
        finance.fin_no_of_emi,
        parseInt(finance.fin_freq) || 1,
        finance.fin_freq_type,
        finance.fin_start_date,
        prin
      );

      // DR Loan = principal; CR Cash = disbursed; CR Interest Rec = process fee only (interest collected separately)
      const journal_request = {
        journal_date: {
          jrnl_date: finance.fin_start_date,
          jrnl_firm_id: finance.fin_firm_id,
          jrnl_own_id: finance.fin_own_id,
          jrnl_user_id: finance.fin_user_id,
          jrnl_amt: prin,
          jrnl_panel: "Finance",
          jrnl_other_info: addFinanceVoucher(finance),
        },
        joural_trans_data: [
          {
            jrtr_crdr: "CR",
            jrtr_date: finance.fin_start_date,
            jrtr_cr_acc_id: finance.fin_cash_acc_id,
            jrtr_cr_amt: fin_cash_amt_val,
            jrtr_acc_info: finance.fin_cash_info,
          },
          {
            jrtr_crdr: "CR",
            jrtr_date: finance.fin_start_date,
            jrtr_cr_acc_id: finance.fin_bank_acc_id,
            jrtr_cr_amt: fin_bank_amt_val,
            jrtr_acc_info: finance.fin_bank_info,
          },
          {
            jrtr_crdr: "CR",
            jrtr_date: finance.fin_start_date,
            jrtr_cr_acc_id: finance.fin_online_acc_id,
            jrtr_cr_amt: fin_online_amt_val,
            jrtr_acc_info: finance.fin_online_info,
          },
          {
            jrtr_crdr: "CR",
            jrtr_date: finance.fin_start_date,
            jrtr_cr_acc_id: finance.fin_card_acc_id,
            jrtr_cr_amt: fin_card_amt_val,
            jrtr_acc_info: finance.fin_card_info,
          },
          {
            jrtr_crdr: "CR",
            jrtr_date: finance.fin_start_date,
            jrtr_cr_acc_id: feeIncomeAccId,
            jrtr_cr_amt: processAmt,
            jrtr_acc_info: finLine("Finance Process Fee", finance),
          },
          {
            jrtr_crdr: "DR",
            jrtr_date: finance.fin_start_date,
            jrtr_dr_acc_id: finance.fin_dr_acc_id,
            jrtr_dr_amt: prin,
            jrtr_acc_info: finLine("Add New Finance", finance),
          },
        ].filter(
          (t) =>
            (t.jrtr_cr_amt && parseFloat(t.jrtr_cr_amt) > 0) ||
            (t.jrtr_dr_amt && parseFloat(t.jrtr_dr_amt) > 0)
        ),
      };

      if (Math.abs(prin - (disbursed + processAmt)) > 0.02) {
        throw new Error("Finance journal imbalance: principal must equal disbursement + process fee");
      }

      let jrnl_id;
      try {
        jrnl_id = await journalService.create_journal_entry(dbUrl, journal_request);
      } catch (journalErr) {
        await financeTransactionService.delete_finance_transaction(dbUrl, finance.fin_id);
        await prisma.finance.delete({ where: { fin_id: finance.fin_id } });
        createdFinId = null;
        throw new Error(
          `Finance account entry failed and was rolled back: ${journalErr.message}`
        );
      }

      const result = await prisma.finance.update({
        where: { fin_id: finance.fin_id },
        data: { fin_jrnl_id: jrnl_id },
      });

      const user =
        finance.fin_user_id > 0
          ? await prisma.user.findUnique({ where: { user_id: finance.fin_user_id } })
          : null;
      messageDispatchService.dispatchSafe({
        dbUrl,
        ownDb: messageDispatchService.ownDbFromUrl(dbUrl),
        firmId: finance.fin_firm_id,
        templateKey: "finance_created",
        toPhone: user?.user_mobile_no,
        toEmail: user?.user_email_id,
        vars: {
          1: user
            ? `${user.user_first_name || ""} ${user.user_last_name || ""}`.trim()
            : "",
          2: finance.fin_unique_code || String(finance.fin_id),
          3: String(finance.fin_prin_amt),
          4: finance.fin_start_date,
        },
      });

      return result;
    } catch (error) {
      console.error("❌ Error in create_finance:", error.message);
      if (createdFinId) {
        try {
          await financeTransactionService.delete_finance_transaction(dbUrl, createdFinId);
          await prisma.finance.delete({ where: { fin_id: createdFinId } });
        } catch (_) {
          /* ignore cleanup errors */
        }
      }
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }

  async getFinances(dbUrl, firmId = null, userId = null, status = null) {
    const prisma = this.getPrisma(dbUrl);
    try {
      // Refresh overdue EMI statuses whenever list is loaded (firm-scoped when possible)
      await financeTransactionService.mark_overdue_emis_due(
        dbUrl,
        null,
        null,
        firmId && firmId !== "all" ? firmId : null
      );

      const where = { fin_is_deleted: false };
      
      if (firmId && firmId !== 'all') {
        where.fin_firm_id = parseInt(firmId);
      }
      
      if (userId && userId !== 'all') {
        where.fin_user_id = parseInt(userId);
      }
      
      if (status && status !== 'ALL') {
        if (status === 'TODAY_PENDING_EMI') {
          const todayStr = new Date().toISOString().split('T')[0];
          where.finance_trans = {
            some: {
              ft_due_date: { lte: todayStr },
              ft_emi_status: { in: ['PENDING', 'PARTIAL', 'DUE'] }
            }
          };
        } else {
          where.fin_status = status;
        }
      }

      return await prisma.finance.findMany({
        where: where,
        orderBy: { fin_created_at: "desc" },
        include: {
          user: {
            select: {
              user_id: true,
              user_uuid: true,
              user_first_name: true,
              user_last_name: true,
              user_mobile_no: true,
              user_profile_img: true,
              user_other_info: true,
            }
          },
          firm: {
            select: { firm_name: true }
          },
          finance_trans: {
            where: { ft_is_deleted: false },
            select: {
              ft_emi_status: true,
              ft_pending_amt: true,
            },
          },
        }
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  async getFinancesDropdown(dbUrl, firmId = null, userId = null) {
    const prisma = this.getPrisma(dbUrl);
    try {
      await financeTransactionService.mark_overdue_emis_due(
        dbUrl,
        null,
        null,
        firmId && firmId !== "all" ? firmId : null
      );

      const where = { 
        fin_is_deleted: false,
        fin_status: 'ACTIVE'
      };
      
      if (firmId && firmId !== 'all') {
        where.fin_firm_id = parseInt(firmId);
      }
      
      if (userId && userId !== 'all') {
        where.fin_user_id = parseInt(userId);
      }

      return await prisma.finance.findMany({
        where: where,
        select: {
          fin_id: true,
          fin_unique_code: true,
          fin_prin_amt: true,
          fin_status: true,
        },
        orderBy: { fin_created_at: "desc" },
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  async getTransactions(dbUrl, firmId = null, userId = null) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const where = { fm_is_deleted: false };
      
      if (firmId && firmId !== 'all') {
        where.fm_firm_id = parseInt(firmId);
      }
      
      if (userId && userId !== 'all') {
        where.fm_user_id = parseInt(userId);
      }

      return await prisma.finance_Money_Transaction.findMany({
        where: where,
        orderBy: { fm_created_at: "desc" },
        take: 5,
        include: {
          user: {
            select: { user_first_name: true, user_last_name: true, user_mobile_no: true }
          },
          finance: {
            select: { fin_id: true, fin_prin_amt: true }
          }
        }
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  async getFinanceDetails(dbUrl, id) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const isNum = !isNaN(id) && !isNaN(parseInt(id));
      let finance = null;
      if (isNum) {
        finance = await prisma.finance.findUnique({
          where: { fin_id: parseInt(id) },
          include: {
            user: {
              select: { user_first_name: true, user_last_name: true, user_mobile_no: true }
            },
            firm: {
              select: { firm_name: true }
            },
            finance_trans: {
              orderBy: { ft_emi_no: "asc" }
            },
            finance_money_trans: {
              orderBy: { fm_created_at: "desc" }
            }
          }
        });
      }
      if (!finance && typeof id === "string") {
        finance = await prisma.finance.findFirst({
          where: { fin_unique_code: id.trim() },
          include: {
            user: {
              select: { user_first_name: true, user_last_name: true, user_mobile_no: true }
            },
            firm: {
              select: { firm_name: true }
            },
            finance_trans: {
              orderBy: { ft_emi_no: "asc" }
            },
            finance_money_trans: {
              orderBy: { fm_created_at: "desc" }
            }
          }
        });
      }

      if (!finance) throw new Error("Finance record not found");

      await financeTransactionService.mark_overdue_emis_due(dbUrl, finance.fin_id);
      finance.finance_trans = await prisma.finance_Transaction.findMany({
        where: { ft_fin_id: finance.fin_id },
        orderBy: { ft_emi_no: "asc" },
      });

      const fineCalc = computeFinanceFine(finance, finance.finance_trans);
      const paid = sumPaidFineAndCollect(finance.finance_money_trans || []);
      const pendingFine = Math.max(
        0,
        parseFloat((fineCalc.totalFine - paid.finePaid).toFixed(2))
      );
      const pendingCollect = Math.max(
        0,
        parseFloat((fineCalc.collectAmt - paid.collectPaid).toFixed(2))
      );

      const hasEmiPaid = (finance.finance_trans || []).some(
        (e) => (parseFloat(e.ft_paid_amt) || 0) > 0
      );
      const hasMoney = (finance.finance_money_trans || []).some((t) => !t.fm_is_deleted);
      const hasPayments =
        hasEmiPaid ||
        hasMoney ||
        ["CLOSED", "COMPLETED"].includes(finance.fin_status);

      return {
        ...finance,
        finance_trans: fineCalc.emisWithFine,
        has_payments: hasPayments,
        interest_summary: buildFinanceInterestSummary(finance),
        rollback_summary: buildFinanceRollbackSummary(finance),
        fine_summary: {
          enabled: fineCalc.enabled,
          fineAmt: fineCalc.fineAmt,
          fineEmiNo: fineCalc.fineEmiNo,
          collectAmt: fineCalc.collectAmt,
          overdueCount: fineCalc.overdueCount,
          chargeCount: fineCalc.chargeCount,
          totalFine: fineCalc.totalFine,
          label: fineCalc.label,
          finePaid: paid.finePaid,
          collectPaid: paid.collectPaid,
          pendingFine,
          pendingCollect,
          pendingTotal: parseFloat((pendingFine + pendingCollect).toFixed(2)),
        },
      };
    } finally {
      await prisma.$disconnect();
    }
  }

  async deleteFinanceJournalsByInfo(dbUrl, containsText) {
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
      console.error("❌ Failed to delete finance journals:", err.message);
      return 0;
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Update finance.
   * - No payments: allow financial rebuild (EMI + journal resync)
   * - Has payments: only fine / collect / other_info / channel info notes
   * - CLOSED: only other_info
   */
  async update_finance(dbUrl, id, data) {
    const prisma = this.getPrisma(dbUrl);
    const finId = parseInt(id, 10);
    let previousSnapshot = null;
    try {
      const existing = await prisma.finance.findUnique({
        where: { fin_id: finId },
        include: {
          finance_trans: true,
          finance_money_trans: { where: { fm_is_deleted: false } },
        },
      });
      if (!existing || existing.fin_is_deleted) {
        throw new Error("Finance record not found");
      }

      previousSnapshot = { ...existing };

      const hasEmiPaid = (existing.finance_trans || []).some(
        (e) => (parseFloat(e.ft_paid_amt) || 0) > 0
      );
      const hasMoney = (existing.finance_money_trans || []).length > 0;
      const hasPayments =
        hasEmiPaid ||
        hasMoney ||
        ["CLOSED", "COMPLETED"].includes(existing.fin_status);
      const isClosed = existing.fin_status === "CLOSED";

      const paidParts = sumPaidFineAndCollect(existing.finance_money_trans || []);

      if (isClosed) {
        const updated = await prisma.finance.update({
          where: { fin_id: finId },
          data: {
            fin_other_info:
              data.fin_other_info != null
                ? data.fin_other_info
                : existing.fin_other_info,
          },
        });
        return { ...updated, has_payments: true };
      }

      // Always-safe optional fields (even after payments)
      const fineAmt =
        data.fin_fine_amt != null
          ? parseFloat(data.fin_fine_amt) || 0
          : parseFloat(existing.fin_fine_amt) || 0;
      const fineEmiNo =
        data.fin_fine_emi_no != null
          ? parseInt(data.fin_fine_emi_no, 10) || 0
          : parseInt(existing.fin_fine_emi_no, 10) || 0;
      const collectAmt =
        data.fin_collec_amt != null
          ? parseFloat(data.fin_collec_amt) || 0
          : parseFloat(existing.fin_collec_amt) || 0;

      const emiCountForFine = hasPayments
        ? existing.fin_no_of_emi
        : parseInt(data.fin_no_of_emi != null ? data.fin_no_of_emi : existing.fin_no_of_emi, 10) ||
          existing.fin_no_of_emi;

      if (fineAmt > 0 || fineEmiNo > 0) {
        if (!(fineAmt > 0 && fineEmiNo > 0)) {
          throw new Error("Both Fine Amount and Fine EMI No are required when fine is set");
        }
        if (fineEmiNo > emiCountForFine) {
          throw new Error(
            `Fine EMI No (${fineEmiNo}) cannot exceed total number of EMIs (${emiCountForFine})`
          );
        }
      }
      if (collectAmt + 0.01 < paidParts.collectPaid) {
        throw new Error(
          `Collect Amount cannot be less than already collected (${paidParts.collectPaid.toFixed(2)})`
        );
      }

      if (hasPayments) {
        const updated = await prisma.finance.update({
          where: { fin_id: finId },
          data: {
            fin_fine_amt: fineAmt,
            fin_fine_emi_no: fineEmiNo,
            fin_collec_amt: collectAmt,
            fin_other_info:
              data.fin_other_info != null
                ? data.fin_other_info
                : existing.fin_other_info,
            fin_pay_info:
              data.fin_pay_info != null ? data.fin_pay_info : existing.fin_pay_info,
            fin_cash_info:
              data.fin_cash_info != null
                ? data.fin_cash_info
                : existing.fin_cash_info,
            fin_bank_info:
              data.fin_bank_info != null
                ? data.fin_bank_info
                : existing.fin_bank_info,
            fin_online_info:
              data.fin_online_info != null
                ? data.fin_online_info
                : existing.fin_online_info,
            fin_card_info:
              data.fin_card_info != null
                ? data.fin_card_info
                : existing.fin_card_info,
          },
        });
        return { ...updated, has_payments: true };
      }

      // Full financial update (no payments yet)
      const firmId = data.fin_firm_id
        ? parseInt(data.fin_firm_id, 10)
        : existing.fin_firm_id;
      const prin = parseFloat(
        data.fin_prin_amt != null ? data.fin_prin_amt : existing.fin_prin_amt
      ) || 0;
      const processAmt = parseFloat(
        data.fin_proccess_amt != null
          ? data.fin_proccess_amt
          : existing.fin_proccess_amt
      ) || 0;
      const roi = parseFloat(
        data.fin_roi != null ? data.fin_roi : existing.fin_roi
      ) || 0;
      const n =
        parseInt(
          data.fin_no_of_emi != null ? data.fin_no_of_emi : existing.fin_no_of_emi,
          10
        ) || 0;

      if (!(prin > 0)) throw new Error("Principal amount must be greater than 0");
      if (!(n > 0)) throw new Error("Number of EMIs must be greater than 0");
      if (processAmt < 0 || processAmt > prin) {
        throw new Error("Process fee must be between 0 and principal");
      }

      const interestAmt =
        roi > 0 ? parseFloat(((prin * roi) / 100).toFixed(2)) : 0;
      const receivable = parseFloat((prin + interestAmt).toFixed(2));
      const disbursed = parseFloat((prin - processAmt).toFixed(2));
      const emiAmt = assertWholeNumberEmi(prin, n);
      void receivable;

      const fin_cash_amt_val = parseFloat(
        data.fin_cash_amt != null ? data.fin_cash_amt : existing.fin_cash_amt
      ) || 0;
      const fin_bank_amt_val = parseFloat(
        data.fin_bank_amt != null ? data.fin_bank_amt : existing.fin_bank_amt
      ) || 0;
      const fin_online_amt_val = parseFloat(
        data.fin_online_amt != null ? data.fin_online_amt : existing.fin_online_amt
      ) || 0;
      const fin_card_amt_val = parseFloat(
        data.fin_card_amt != null ? data.fin_card_amt : existing.fin_card_amt
      ) || 0;
      const channelSum = parseFloat(
        (fin_cash_amt_val + fin_bank_amt_val + fin_online_amt_val + fin_card_amt_val).toFixed(2)
      );
      if (Math.abs(channelSum - disbursed) > 0.01) {
        throw new Error(
          `Payment channels (${channelSum}) must equal disbursement amount (${disbursed})`
        );
      }

      let fin_dr_acc_id = data.fin_dr_acc_id
        ? parseInt(data.fin_dr_acc_id, 10)
        : existing.fin_dr_acc_id;
      if (!fin_dr_acc_id) {
        fin_dr_acc_id = await this.resolveAccount(prisma, firmId, null, [
          "Unsecured Loans",
          "Loans & Advances",
          "Finance Dr Account",
          "Loan Account",
        ]);
      }
      if (!fin_dr_acc_id) {
        throw new Error("Loan receivable account (Unsecured Loans) not found for firm");
      }

      const feeIncomeAccId = await this.resolveAccount(prisma, firmId, null, [
        "Interest Rec",
        "Indirect Incomes",
        "Direct Incomes",
      ]);
      if (processAmt > 0 && !feeIncomeAccId) {
        throw new Error(
          "Income account (Interest Rec) not found for firm. Required for process fee."
        );
      }

      const fin_cash_acc_id =
        fin_cash_amt_val > 0
          ? await this.resolveAccount(
              prisma,
              firmId,
              data.fin_cash_acc_id != null
                ? data.fin_cash_acc_id
                : existing.fin_cash_acc_id,
              ["Cash In Hand", "Cash"]
            )
          : null;
      const fin_bank_acc_id =
        fin_bank_amt_val > 0
          ? await this.resolveAccount(
              prisma,
              firmId,
              data.fin_bank_acc_id != null
                ? data.fin_bank_acc_id
                : existing.fin_bank_acc_id,
              ["Bank Account", "Bank"]
            )
          : null;
      const fin_online_acc_id =
        fin_online_amt_val > 0
          ? await this.resolveAccount(
              prisma,
              firmId,
              data.fin_online_acc_id != null
                ? data.fin_online_acc_id
                : existing.fin_online_acc_id,
              ["Online Account", "Online"]
            )
          : null;
      const fin_card_acc_id =
        fin_card_amt_val > 0
          ? await this.resolveAccount(
              prisma,
              firmId,
              data.fin_card_acc_id != null
                ? data.fin_card_acc_id
                : existing.fin_card_acc_id,
              ["Card Account", "Card", "POS"]
            )
          : null;

      const startDate =
        data.fin_start_date != null ? data.fin_start_date : existing.fin_start_date;
      const freqType =
        data.fin_freq_type != null ? data.fin_freq_type : existing.fin_freq_type;
      const freq =
        data.fin_freq != null && String(data.fin_freq).trim() !== ""
          ? String(data.fin_freq)
          : existing.fin_freq != null && String(existing.fin_freq).trim() !== ""
            ? String(existing.fin_freq)
            : "1";

      const updated = await prisma.finance.update({
        where: { fin_id: finId },
        data: {
          fin_firm_id: firmId,
          fin_user_id:
            data.fin_user_id != null
              ? parseInt(data.fin_user_id, 10)
              : existing.fin_user_id,
          fin_prin_amt: prin,
          fin_no_of_emi: n,
          fin_start_date: startDate,
          fin_freq_type: freqType || "MONTHLY",
          fin_freq: freq,
          fin_roi: data.fin_roi != null ? String(data.fin_roi) : existing.fin_roi,
          fin_collec_amt: collectAmt,
          fin_proccess_amt: processAmt,
          fin_fine_amt: fineAmt,
          fin_fine_emi_no: fineEmiNo,
          fin_emi_amt: emiAmt,
          fin_final_amt: disbursed,
          fin_cash_amt: String(fin_cash_amt_val),
          fin_bank_amt: String(fin_bank_amt_val),
          fin_online_amt: String(fin_online_amt_val),
          fin_card_amt: String(fin_card_amt_val),
          fin_cash_acc_id,
          fin_bank_acc_id,
          fin_online_acc_id,
          fin_card_acc_id,
          fin_dr_acc_id,
          fin_cash_info:
            data.fin_cash_info != null
              ? data.fin_cash_info
              : existing.fin_cash_info,
          fin_bank_info:
            data.fin_bank_info != null
              ? data.fin_bank_info
              : existing.fin_bank_info,
          fin_online_info:
            data.fin_online_info != null
              ? data.fin_online_info
              : existing.fin_online_info,
          fin_card_info:
            data.fin_card_info != null
              ? data.fin_card_info
              : existing.fin_card_info,
          fin_pay_info:
            data.fin_pay_info != null ? data.fin_pay_info : existing.fin_pay_info,
          fin_other_info:
            data.fin_other_info != null
              ? data.fin_other_info
              : existing.fin_other_info,
        },
      });

      await financeTransactionService.delete_finance_transaction(dbUrl, finId);
      await financeTransactionService.create_finance_transaction(
        dbUrl,
        {
          ft_firm_id: updated.fin_firm_id,
          ft_own_id: updated.fin_own_id,
          ft_user_id: updated.fin_user_id,
          ft_fin_id: updated.fin_id,
          ft_emi_amt: updated.fin_emi_amt,
        },
        updated.fin_no_of_emi,
        parseInt(updated.fin_freq, 10) || 1,
        updated.fin_freq_type,
        updated.fin_start_date,
        prin
      );

      try {
        for (const pattern of financeJournalDeletePatterns(updated)) {
          await this.deleteFinanceJournalsByInfo(dbUrl, pattern);
        }

        const journal_request = {
          journal_date: {
            jrnl_date: updated.fin_start_date,
            jrnl_firm_id: updated.fin_firm_id,
            jrnl_own_id: updated.fin_own_id,
            jrnl_user_id: updated.fin_user_id,
            jrnl_amt: prin,
            jrnl_panel: "Finance",
            jrnl_other_info: addFinanceVoucher(updated),
          },
          joural_trans_data: [
            {
              jrtr_crdr: "CR",
              jrtr_date: updated.fin_start_date,
              jrtr_cr_acc_id: updated.fin_cash_acc_id,
              jrtr_cr_amt: fin_cash_amt_val,
              jrtr_acc_info: updated.fin_cash_info,
            },
            {
              jrtr_crdr: "CR",
              jrtr_date: updated.fin_start_date,
              jrtr_cr_acc_id: updated.fin_bank_acc_id,
              jrtr_cr_amt: fin_bank_amt_val,
              jrtr_acc_info: updated.fin_bank_info,
            },
            {
              jrtr_crdr: "CR",
              jrtr_date: updated.fin_start_date,
              jrtr_cr_acc_id: updated.fin_online_acc_id,
              jrtr_cr_amt: fin_online_amt_val,
              jrtr_acc_info: updated.fin_online_info,
            },
            {
              jrtr_crdr: "CR",
              jrtr_date: updated.fin_start_date,
              jrtr_cr_acc_id: updated.fin_card_acc_id,
              jrtr_cr_amt: fin_card_amt_val,
              jrtr_acc_info: updated.fin_card_info,
            },
            {
              jrtr_crdr: "CR",
              jrtr_date: updated.fin_start_date,
              jrtr_cr_acc_id: feeIncomeAccId,
              jrtr_cr_amt: processAmt,
              jrtr_acc_info: finLine("Finance Process Fee", updated),
            },
            {
              jrtr_crdr: "DR",
              jrtr_date: updated.fin_start_date,
              jrtr_dr_acc_id: updated.fin_dr_acc_id,
              jrtr_dr_amt: prin,
              jrtr_acc_info: finLine("Add New Finance", updated),
            },
          ].filter(
            (t) =>
              (t.jrtr_cr_amt && parseFloat(t.jrtr_cr_amt) > 0) ||
              (t.jrtr_dr_amt && parseFloat(t.jrtr_dr_amt) > 0)
          ),
        };

        const jrnl_id = await journalService.create_journal_entry(
          dbUrl,
          journal_request
        );
        return await prisma.finance.update({
          where: { fin_id: finId },
          data: { fin_jrnl_id: jrnl_id },
        }).then((row) => ({ ...row, has_payments: false }));
      } catch (journalErr) {
        // Restore previous finance + EMI schedule + journal
        try {
          const {
            finance_trans: _t,
            finance_money_trans: _m,
            ...restoreRow
          } = previousSnapshot;
          await prisma.finance.update({
            where: { fin_id: finId },
            data: {
              fin_firm_id: restoreRow.fin_firm_id,
              fin_user_id: restoreRow.fin_user_id,
              fin_prin_amt: restoreRow.fin_prin_amt,
              fin_no_of_emi: restoreRow.fin_no_of_emi,
              fin_start_date: restoreRow.fin_start_date,
              fin_freq_type: restoreRow.fin_freq_type,
              fin_freq: restoreRow.fin_freq,
              fin_roi: restoreRow.fin_roi,
              fin_collec_amt: restoreRow.fin_collec_amt,
              fin_proccess_amt: restoreRow.fin_proccess_amt,
              fin_fine_amt: restoreRow.fin_fine_amt,
              fin_fine_emi_no: restoreRow.fin_fine_emi_no,
              fin_emi_amt: restoreRow.fin_emi_amt,
              fin_final_amt: restoreRow.fin_final_amt,
              fin_cash_amt: restoreRow.fin_cash_amt,
              fin_bank_amt: restoreRow.fin_bank_amt,
              fin_online_amt: restoreRow.fin_online_amt,
              fin_card_amt: restoreRow.fin_card_amt,
              fin_cash_acc_id: restoreRow.fin_cash_acc_id,
              fin_bank_acc_id: restoreRow.fin_bank_acc_id,
              fin_online_acc_id: restoreRow.fin_online_acc_id,
              fin_card_acc_id: restoreRow.fin_card_acc_id,
              fin_dr_acc_id: restoreRow.fin_dr_acc_id,
              fin_cash_info: restoreRow.fin_cash_info,
              fin_bank_info: restoreRow.fin_bank_info,
              fin_online_info: restoreRow.fin_online_info,
              fin_card_info: restoreRow.fin_card_info,
              fin_pay_info: restoreRow.fin_pay_info,
              fin_other_info: restoreRow.fin_other_info,
              fin_jrnl_id: restoreRow.fin_jrnl_id,
            },
          });
          await financeTransactionService.delete_finance_transaction(dbUrl, finId);
          if (previousSnapshot.finance_trans?.length) {
            await prisma.finance_Transaction.createMany({
              data: previousSnapshot.finance_trans.map((e) => ({
                ft_firm_id: e.ft_firm_id,
                ft_own_id: e.ft_own_id,
                ft_user_id: e.ft_user_id,
                ft_fin_id: e.ft_fin_id,
                ft_emi_no: e.ft_emi_no,
                ft_start_date: e.ft_start_date,
                ft_due_date: e.ft_due_date,
                ft_emi_amt: e.ft_emi_amt,
                ft_paid_amt: e.ft_paid_amt,
                ft_pending_amt: e.ft_pending_amt,
                ft_emi_status: e.ft_emi_status,
                ft_add_date: e.ft_add_date,
                ft_fine_amt: e.ft_fine_amt || 0,
                ft_paid_date: e.ft_paid_date,
              })),
            });
          }
        } catch (restoreErr) {
          console.error("❌ Finance update restore failed:", restoreErr.message);
        }
        throw new Error(
          `Finance journal update failed and was rolled back: ${journalErr.message}`
        );
      }
    } catch (error) {
      console.error("❌ Error in update_finance:", error.message);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }

  async processPayment(dbUrl, data) {
    const prisma = this.getPrisma(dbUrl);
    let moneyTransId = null;
    const emiSnapshots = [];
    let previousFinanceStatus = null;
    try {
      const fin_id = parseInt(data.fm_fin_id);
      const paymentAmt = parseFloat(data.fm_trans_amt);
      const transType = data.fm_trans_type;
      const isRollback = transType === "ROLLBACK";
      const rollbackType = isRollback
        ? String(data.fm_rollback_type || "EMI").toUpperCase()
        : null;
      const isEmiRollback = isRollback && rollbackType === "EMI";
      const isInterestRollback = isRollback && rollbackType === "INTEREST";
      const isFineRollback = isRollback && rollbackType === "FINE";
      const isClose = transType === "CLOSE";
      const isFine = transType === "FINE";
      const isInterest = transType === "INTEREST";
      const isCollection = transType === "PAID" || isClose;
      const isEmiPayment = isCollection || isEmiRollback;

      if (!(paymentAmt > 0)) throw new Error("Payment amount must be greater than 0");

      if (isRollback && !["EMI", "INTEREST", "FINE"].includes(rollbackType)) {
        throw new Error("Invalid rollback type. Choose EMI, INTEREST, or FINE.");
      }

      const finance = await prisma.finance.findUnique({
        where: { fin_id },
        include: {
          finance_trans: { orderBy: { ft_emi_no: "asc" } },
          finance_money_trans: { where: { fm_is_deleted: false } },
        },
      });

      if (!finance) throw new Error("Finance record not found");
      if (finance.fin_status === "CLOSED" && !isRollback) {
        throw new Error("Cannot collect on a closed finance");
      }
      previousFinanceStatus = finance.fin_status;

      const fm_cash_amt = parseFloat(data.fm_cash_amt || 0);
      const fm_bank_amt = parseFloat(data.fm_bank_amt || 0);
      const fm_online_amt = parseFloat(data.fm_online_amt || 0);
      const fm_card_amt = parseFloat(data.fm_card_amt || 0);
      const channelSum = parseFloat(
        (fm_cash_amt + fm_bank_amt + fm_online_amt + fm_card_amt).toFixed(2)
      );
      if (Math.abs(channelSum - paymentAmt) > 0.01) {
        throw new Error(
          `Payment channels (${channelSum}) must equal transaction amount (${paymentAmt})`
        );
      }

      let finePortion = 0;
      let collectPortion = 0;
      let incomeAccId = null;

      if (isFine) {
        const fineCalc = computeFinanceFine(
          finance,
          finance.finance_trans,
          data.fm_trans_date
        );
        if (!fineCalc.enabled && !(fineCalc.collectAmt > 0)) {
          throw new Error("Fine / collect amount is not configured for this finance");
        }
        const paid = sumPaidFineAndCollect(finance.finance_money_trans || []);
        const pendingFine = Math.max(
          0,
          parseFloat((fineCalc.totalFine - paid.finePaid).toFixed(2))
        );
        const pendingCollect = Math.max(
          0,
          parseFloat((fineCalc.collectAmt - paid.collectPaid).toFixed(2))
        );
        const maxPayable = parseFloat((pendingFine + pendingCollect).toFixed(2));
        if (!(maxPayable > 0)) {
          throw new Error("No pending fine or collect amount to pay");
        }
        if (paymentAmt > maxPayable + 0.01) {
          throw new Error(
            `Fine/collect payment exceeds pending total (${maxPayable.toFixed(2)})`
          );
        }

        const rawFine =
          data.fm_fine_amt != null && data.fm_fine_amt !== ""
            ? parseFloat(data.fm_fine_amt)
            : NaN;
        const rawCollect =
          data.fm_collect_amt != null && data.fm_collect_amt !== ""
            ? parseFloat(data.fm_collect_amt)
            : NaN;

        if (!Number.isNaN(rawFine) && !Number.isNaN(rawCollect)) {
          finePortion = rawFine;
          collectPortion = rawCollect;
        } else {
          finePortion = Math.min(paymentAmt, pendingFine);
          collectPortion = parseFloat((paymentAmt - finePortion).toFixed(2));
        }

        finePortion = parseFloat((finePortion || 0).toFixed(2));
        collectPortion = parseFloat((collectPortion || 0).toFixed(2));

        if (finePortion < -0.01 || collectPortion < -0.01) {
          throw new Error("Fine/collect portions cannot be negative");
        }
        if (finePortion > pendingFine + 0.01) {
          throw new Error(`Fine portion exceeds pending fine (${pendingFine.toFixed(2)})`);
        }
        if (collectPortion > pendingCollect + 0.01) {
          throw new Error(
            `Collect portion exceeds pending collect (${pendingCollect.toFixed(2)})`
          );
        }
        if (Math.abs(finePortion + collectPortion - paymentAmt) > 0.01) {
          throw new Error("Fine + collect portions must equal payment amount");
        }

        incomeAccId = await this.resolveAccount(prisma, finance.fin_firm_id, null, [
          "Interest Rec",
          "Indirect Incomes",
          "Direct Incomes",
          "Extra Income",
        ]);
        if (!incomeAccId) {
          throw new Error("Income account (Interest Rec) not found for firm");
        }
      }

      if (isInterest) {
        if (isBundledInterestFinance(finance)) {
          throw new Error(
            "This finance has interest bundled in EMIs. Use EMI payment instead."
          );
        }
        const intSummary = buildFinanceInterestSummary(finance);
        if (!intSummary.interest_separate) {
          throw new Error("No separate interest is configured for this finance");
        }
        const pendingInt = intSummary.pending_interest;
        if (!(pendingInt > 0)) {
          throw new Error("No pending interest to pay");
        }
        if (paymentAmt > pendingInt + 0.01) {
          throw new Error(
            `Interest payment exceeds pending amount (${pendingInt.toFixed(2)})`
          );
        }
        incomeAccId = await this.resolveAccount(prisma, finance.fin_firm_id, null, [
          "Interest Rec",
          "Indirect Incomes",
          "Direct Incomes",
          "Extra Income",
        ]);
        if (!incomeAccId) {
          throw new Error("Income account (Interest Rec) not found for firm");
        }
      }

      if (isInterestRollback) {
        if (isBundledInterestFinance(finance)) {
          throw new Error(
            "Interest rollback is not available for bundled-interest finances."
          );
        }
        const intSummary = buildFinanceInterestSummary(finance);
        if (!intSummary.interest_separate) {
          throw new Error("No separate interest payments to rollback");
        }
        if (!(intSummary.interest_paid > 0)) {
          throw new Error("No paid interest available to rollback");
        }
        if (paymentAmt > intSummary.interest_paid + 0.01) {
          throw new Error(
            `Interest rollback exceeds paid interest (${intSummary.interest_paid.toFixed(2)})`
          );
        }
        incomeAccId = await this.resolveAccount(prisma, finance.fin_firm_id, null, [
          "Interest Rec",
          "Indirect Incomes",
          "Direct Incomes",
          "Extra Income",
        ]);
        if (!incomeAccId) {
          throw new Error("Income account (Interest Rec) not found for firm");
        }
      }

      if (isFineRollback) {
        const paid = sumPaidFineAndCollect(finance.finance_money_trans || []);
        if (!(paid.fineCollectPaid > 0)) {
          throw new Error("No paid fine/collect available to rollback");
        }
        const rawFine =
          data.fm_fine_amt != null && data.fm_fine_amt !== ""
            ? parseFloat(data.fm_fine_amt)
            : NaN;
        const rawCollect =
          data.fm_collect_amt != null && data.fm_collect_amt !== ""
            ? parseFloat(data.fm_collect_amt)
            : NaN;
        if (!Number.isNaN(rawFine) && !Number.isNaN(rawCollect)) {
          finePortion = rawFine;
          collectPortion = rawCollect;
        } else {
          collectPortion = Math.min(paymentAmt, paid.collectPaid);
          finePortion = parseFloat((paymentAmt - collectPortion).toFixed(2));
        }
        finePortion = parseFloat((finePortion || 0).toFixed(2));
        collectPortion = parseFloat((collectPortion || 0).toFixed(2));
        if (finePortion > paid.finePaid + 0.01) {
          throw new Error(
            `Fine rollback exceeds paid fine (${paid.finePaid.toFixed(2)})`
          );
        }
        if (collectPortion > paid.collectPaid + 0.01) {
          throw new Error(
            `Collect rollback exceeds paid collect (${paid.collectPaid.toFixed(2)})`
          );
        }
        if (Math.abs(finePortion + collectPortion - paymentAmt) > 0.01) {
          throw new Error("Fine + collect rollback portions must equal total amount");
        }
        incomeAccId = await this.resolveAccount(prisma, finance.fin_firm_id, null, [
          "Interest Rec",
          "Indirect Incomes",
          "Direct Incomes",
          "Extra Income",
        ]);
        if (!incomeAccId) {
          throw new Error("Income account (Interest Rec) not found for firm");
        }
      }

      const totalPending = finance.finance_trans.reduce(
        (s, e) => s + (parseFloat(e.ft_pending_amt) || 0),
        0
      );
      const totalPaid = finance.finance_trans.reduce(
        (s, e) => s + (parseFloat(e.ft_paid_amt) || 0),
        0
      );

      if (isCollection && paymentAmt > totalPending + 0.01) {
        throw new Error(`Payment exceeds pending EMI total (${totalPending.toFixed(2)})`);
      }
      if (isEmiRollback && paymentAmt > totalPaid + 0.01) {
        throw new Error(`EMI rollback exceeds paid total (${totalPaid.toFixed(2)})`);
      }
      if (isClose && !isBundledInterestFinance(finance)) {
        const intSummary = buildFinanceInterestSummary(finance);
        if (intSummary.pending_interest > 0.01) {
          throw new Error(
            `Pay pending interest (₹${intSummary.pending_interest.toFixed(2)}) before closing`
          );
        }
      }
      if (isClose && Math.abs(paymentAmt - totalPending) > 0.01) {
        throw new Error(
          `Close payment must equal full pending amount (${totalPending.toFixed(2)})`
        );
      }

      const fm_cash_acc_id =
        fm_cash_amt > 0
          ? await this.resolveAccount(prisma, finance.fin_firm_id, data.fm_cash_acc_id, [
              "Cash In Hand",
              "Cash",
            ])
          : null;
      const fm_bank_acc_id =
        fm_bank_amt > 0
          ? await this.resolveAccount(prisma, finance.fin_firm_id, data.fm_bank_acc_id, [
              "Bank Account",
              "Bank",
            ])
          : null;
      const fm_online_acc_id =
        fm_online_amt > 0
          ? await this.resolveAccount(prisma, finance.fin_firm_id, data.fm_online_acc_id, [
              "Online Account",
              "Online",
            ])
          : null;
      const fm_card_acc_id =
        fm_card_amt > 0
          ? await this.resolveAccount(prisma, finance.fin_firm_id, data.fm_card_acc_id, [
              "Card Account",
              "Card",
              "POS",
            ])
          : null;

      const payInfo = isFine
        ? `FINE:${finePortion.toFixed(2)}|COLLECT:${collectPortion.toFixed(2)}`
        : isInterest
          ? `INT:${paymentAmt.toFixed(2)}`
          : isInterestRollback
            ? `ROLLBACK_INT:${paymentAmt.toFixed(2)}`
            : isFineRollback
              ? `ROLLBACK_FINE:${finePortion.toFixed(2)}|COLLECT:${collectPortion.toFixed(2)}`
              : isEmiRollback
                ? `ROLLBACK_EMI:${paymentAmt.toFixed(2)}`
                : data.fm_pay_info || "";

      const creditIncomeTypes =
        isFine || isInterest || isInterestRollback || isFineRollback;

      const moneyTrans = await prisma.finance_Money_Transaction.create({
        data: {
          fm_own_id: finance.fin_own_id,
          fm_firm_id: finance.fin_firm_id,
          fm_user_id: finance.fin_user_id,
          fm_fin_id: finance.fin_id,
          fm_trans_crdr: isRollback ? "CR" : "DR",
          fm_trans_date: data.fm_trans_date,
          fm_trans_type: transType,
          fm_trans_amt: paymentAmt,
          fm_cash_amt,
          fm_bank_amt,
          fm_online_amt,
          fm_card_amt,
          fm_cash_acc_id,
          fm_bank_acc_id,
          fm_online_acc_id,
          fm_card_acc_id,
          fm_dr_acc_id: creditIncomeTypes ? incomeAccId : finance.fin_dr_acc_id,
          fm_cash_info: data.fm_cash_info || "",
          fm_bank_info: data.fm_bank_info || "",
          fm_online_info: data.fm_online_info || "",
          fm_card_info: data.fm_card_info || "",
          fm_pay_info: payInfo,
          fm_other_info: data.fm_other_info || "",
        },
      });
      moneyTransId = moneyTrans.fm_id;

      if (isEmiPayment) {
        const emisForApply = isEmiRollback
          ? finance.finance_trans
              .filter((e) => (parseFloat(e.ft_paid_amt) || 0) > 0)
              .sort((a, b) => (b.ft_emi_no || 0) - (a.ft_emi_no || 0))
          : finance.finance_trans.filter((e) =>
              ["PENDING", "PARTIAL", "DUE"].includes(
                (e.ft_emi_status || "").toUpperCase()
              )
            );

        let remainingAmt = paymentAmt;
        for (const emi of emisForApply) {
          if (remainingAmt <= 0) break;
          emiSnapshots.push({
            ft_id: emi.ft_id,
            ft_paid_amt: emi.ft_paid_amt,
            ft_pending_amt: emi.ft_pending_amt,
            ft_emi_status: emi.ft_emi_status,
            ft_paid_date: emi.ft_paid_date,
          });

          let toApply = 0;
          if (!isEmiRollback) {
            toApply = Math.min(remainingAmt, emi.ft_pending_amt);
            const newPaidAmt = emi.ft_paid_amt + toApply;
            const newPendingAmt = emi.ft_pending_amt - toApply;
            const newStatus =
              newPendingAmt <= 0 ? "PAID" : newPaidAmt > 0 ? "PARTIAL" : "PENDING";

            await prisma.finance_Transaction.update({
              where: { ft_id: emi.ft_id },
              data: {
                ft_paid_amt: newPaidAmt,
                ft_pending_amt: newPendingAmt,
                ft_emi_status: newStatus,
                ft_paid_date: newStatus === "PAID" ? data.fm_trans_date : emi.ft_paid_date,
              },
            });
          } else {
            toApply = Math.min(remainingAmt, emi.ft_paid_amt);
            const newPaidAmt = emi.ft_paid_amt - toApply;
            const newPendingAmt = emi.ft_pending_amt + toApply;
            const dueToday = new Date().toISOString().split("T")[0];
            let newStatus = newPaidAmt <= 0 ? "PENDING" : "PARTIAL";
            if (
              newPaidAmt <= 0 &&
              emi.ft_due_date &&
              emi.ft_due_date < dueToday
            ) {
              newStatus = "DUE";
            }

            await prisma.finance_Transaction.update({
              where: { ft_id: emi.ft_id },
              data: {
                ft_paid_amt: newPaidAmt,
                ft_pending_amt: newPendingAmt,
                ft_emi_status: newStatus,
                ft_paid_date: newPaidAmt <= 0 ? null : emi.ft_paid_date,
              },
            });
          }

          remainingAmt = parseFloat((remainingAmt - toApply).toFixed(2));
        }

        if (remainingAmt > 0.01) {
          throw new Error(
            `Could not apply full amount to EMIs. Leftover ${remainingAmt.toFixed(2)}`
          );
        }
      }

      const allEmisAfter = await prisma.finance_Transaction.findMany({
        where: { ft_fin_id: finance.fin_id },
      });
      const moneyTransAfter = [...(finance.finance_money_trans || []), moneyTrans];
      const settlement = evaluateFinanceSettlement(
        finance,
        moneyTransAfter,
        allEmisAfter,
        data.fm_trans_date
      );

      if (isEmiPayment || isInterest || isInterestRollback || isFine || isFineRollback) {
        let newFinanceStatus = finance.fin_status;
        if (isClose) {
          if (!settlement.allEmisPaid) {
            throw new Error("Close requires all EMIs to be fully settled");
          }
          newFinanceStatus = "CLOSED";
        } else if (settlement.fullySettled) {
          newFinanceStatus = "COMPLETED";
        } else if (
          finance.fin_status === "COMPLETED" ||
          finance.fin_status === "CLOSED"
        ) {
          newFinanceStatus = "ACTIVE";
        }

        if (newFinanceStatus !== finance.fin_status) {
          await prisma.finance.update({
            where: { fin_id: finance.fin_id },
            data: { fin_status: newFinanceStatus },
          });
        }
      }

      const journalLabel = isEmiRollback
        ? "EMI Rollback"
        : isInterestRollback
          ? "Interest Rollback"
          : isFineRollback
            ? "Fine / Collect Rollback"
            : isRollback
              ? "EMI Rollback"
              : isClose
                ? "EMI Close Payment"
                : isFine
                  ? "Fine / Collect Payment"
                  : isInterest
                    ? "Interest Payment"
                    : "EMI Payment";

      const creditAccId =
        isFine || isInterest || isInterestRollback || isFineRollback
          ? incomeAccId
          : finance.fin_dr_acc_id;

      const journal_request = {
        journal_date: {
          jrnl_date: data.fm_trans_date,
          jrnl_firm_id: finance.fin_firm_id,
          jrnl_own_id: finance.fin_own_id,
          jrnl_user_id: finance.fin_user_id,
          jrnl_amt: paymentAmt,
          jrnl_panel: "Finance",
          jrnl_other_info: financeCollectionVoucher(finance, journalLabel, data.fm_trans_date),
        },
        joural_trans_data: [
          {
            jrtr_crdr: isRollback ? "CR" : "DR",
            jrtr_date: data.fm_trans_date,
            [isRollback ? "jrtr_cr_acc_id" : "jrtr_dr_acc_id"]: moneyTrans.fm_cash_acc_id,
            [isRollback ? "jrtr_cr_amt" : "jrtr_dr_amt"]: moneyTrans.fm_cash_amt,
            jrtr_acc_info: moneyTrans.fm_cash_info,
          },
          {
            jrtr_crdr: isRollback ? "CR" : "DR",
            jrtr_date: data.fm_trans_date,
            [isRollback ? "jrtr_cr_acc_id" : "jrtr_dr_acc_id"]: moneyTrans.fm_bank_acc_id,
            [isRollback ? "jrtr_cr_amt" : "jrtr_dr_amt"]: moneyTrans.fm_bank_amt,
            jrtr_acc_info: moneyTrans.fm_bank_info,
          },
          {
            jrtr_crdr: isRollback ? "CR" : "DR",
            jrtr_date: data.fm_trans_date,
            [isRollback ? "jrtr_cr_acc_id" : "jrtr_dr_acc_id"]: moneyTrans.fm_online_acc_id,
            [isRollback ? "jrtr_cr_amt" : "jrtr_dr_amt"]: moneyTrans.fm_online_amt,
            jrtr_acc_info: moneyTrans.fm_online_info,
          },
          {
            jrtr_crdr: isRollback ? "CR" : "DR",
            jrtr_date: data.fm_trans_date,
            [isRollback ? "jrtr_cr_acc_id" : "jrtr_dr_acc_id"]: moneyTrans.fm_card_acc_id,
            [isRollback ? "jrtr_cr_amt" : "jrtr_dr_amt"]: moneyTrans.fm_card_amt,
            jrtr_acc_info: moneyTrans.fm_card_info,
          },
          {
            jrtr_crdr: isRollback ? "DR" : "CR",
            jrtr_date: data.fm_trans_date,
            [isRollback ? "jrtr_dr_acc_id" : "jrtr_cr_acc_id"]: creditAccId,
            [isRollback ? "jrtr_dr_amt" : "jrtr_cr_amt"]: paymentAmt,
            jrtr_acc_info: isFine
              ? `${journalLabel} (Fine ${finePortion.toFixed(2)} + Collect ${collectPortion.toFixed(2)}) : ${finRef(finance)}`
              : isFineRollback
                ? `${journalLabel} (Fine ${finePortion.toFixed(2)} + Collect ${collectPortion.toFixed(2)}) : ${finRef(finance)}`
              : isInterest
                ? finLine("Interest Received", finance)
                : isInterestRollback
                  ? finLine("Interest Rollback", finance)
                  : finLine(journalLabel, finance),
          },
        ].filter(
          (t) =>
            (t.jrtr_cr_amt && parseFloat(t.jrtr_cr_amt) > 0) ||
            (t.jrtr_dr_amt && parseFloat(t.jrtr_dr_amt) > 0)
        ),
      };

      let jrnl_id;
      try {
        jrnl_id = await journalService.create_journal_entry(dbUrl, journal_request);
      } catch (journalErr) {
        // Compensate EMI + money row + status
        for (const snap of emiSnapshots) {
          await prisma.finance_Transaction.update({
            where: { ft_id: snap.ft_id },
            data: {
              ft_paid_amt: snap.ft_paid_amt,
              ft_pending_amt: snap.ft_pending_amt,
              ft_emi_status: snap.ft_emi_status,
              ft_paid_date: snap.ft_paid_date,
            },
          });
        }
        if (previousFinanceStatus != null) {
          await prisma.finance.update({
            where: { fin_id: finance.fin_id },
            data: { fin_status: previousFinanceStatus },
          });
        }
        await prisma.finance_Money_Transaction.delete({
          where: { fm_id: moneyTrans.fm_id },
        });
        moneyTransId = null;
        throw new Error(
          `Finance payment account entry failed and was rolled back: ${journalErr.message}`
        );
      }

      await prisma.finance_Money_Transaction.update({
        where: { fm_id: moneyTrans.fm_id },
        data: { fm_jrnl_id: jrnl_id },
      });

      if (transType === "PAID" || transType === "CLOSE" || transType === "INTEREST") {
        const user =
          finance.fin_user_id > 0
            ? await prisma.user.findUnique({ where: { user_id: finance.fin_user_id } })
            : null;
        const templateKey =
          transType === "CLOSE" ? "finance_closed" : "finance_payment_received";
        messageDispatchService.dispatchSafe({
          dbUrl,
          ownDb: messageDispatchService.ownDbFromUrl(dbUrl),
          firmId: finance.fin_firm_id,
          templateKey,
          toPhone: user?.user_mobile_no,
          toEmail: user?.user_email_id,
          vars: {
            1: user
              ? `${user.user_first_name || ""} ${user.user_last_name || ""}`.trim()
              : "",
            2: finance.fin_unique_code || String(finance.fin_id),
            3: String(paymentAmt),
            4: data.fm_trans_date || new Date().toISOString().split("T")[0],
          },
        });
      }

      return moneyTrans;
    } catch (error) {
      // If leftover/validation failed after money row created, clean it up
      if (moneyTransId && !String(error.message || "").includes("rolled back")) {
        try {
          for (const snap of emiSnapshots) {
            await prisma.finance_Transaction.update({
              where: { ft_id: snap.ft_id },
              data: {
                ft_paid_amt: snap.ft_paid_amt,
                ft_pending_amt: snap.ft_pending_amt,
                ft_emi_status: snap.ft_emi_status,
                ft_paid_date: snap.ft_paid_date,
              },
            });
          }
          if (previousFinanceStatus != null) {
            await prisma.finance.update({
              where: { fin_id: parseInt(data.fm_fin_id) },
              data: { fin_status: previousFinanceStatus },
            });
          }
          await prisma.finance_Money_Transaction.delete({
            where: { fm_id: moneyTransId },
          });
        } catch (cleanupErr) {
          console.error("❌ Finance payment cleanup failed:", cleanupErr.message);
        }
      }
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }

  async delete_finance(dbUrl, id) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const finance = await prisma.finance.findUnique({
        where: { fin_id: parseInt(id) },
      });

      if (!finance) throw new Error("Finance record not found");

      // Soft delete or hard delete based on requirements. User logic seems to imply hard delete for relations.
      await financeTransactionService.delete_finance_transaction(dbUrl, id);
      await financeMoneyTransService.delete_finance_money_entries(dbUrl, id);

      if (finance.fin_jrnl_id) {
        await journalService.delete_journal_entry(dbUrl, finance.fin_jrnl_id, finance.fin_own_id, finance.fin_firm_id);
      }

      return await prisma.finance.update({
        where: { fin_id: parseInt(id) },
        data: {
          fin_is_deleted: true,
          fin_deleted_at: new Date(),
        },
      });
    } finally {
      await prisma.$disconnect();
    }
  }
}

module.exports = new FinanceService();
