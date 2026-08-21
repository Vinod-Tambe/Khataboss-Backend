"use strict";

const { getTenantPrisma } = require("../../../utils/tenantPrisma");
const journalService = require("../../journal/service/journal.service");
const messageDispatchService = require("../../../common/service/message-dispatch.service");
const { getCustomerWhatsAppNo } = require("../../../utils/customer.helper");
const serialNumberService = require("../../../common/service/serialNumber.service");
const {
  releaseVoucher,
  loanLine,
} = require("../../../utils/journalNarration");
const { assertActiveLoan } = require("../../../utils/loanValidation");
const { resolveIncomeAccount } = require("../../../utils/incomeAccounts");

class ReleaseService {
  getPrisma(dbUrl) {
    return getTenantPrisma(dbUrl);
  }

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

  parseBoolean(value) {
    return value === true || value === "true" || value === 1 || value === "1";
  }

  parseItemImages(value) {
    if (!value) return null;
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : null;
      } catch {
        return null;
      }
    }
    return null;
  }

  async findOrCreateReleaseUser(tx, firmId, data) {
    const searchConditions = [];
    if (data.ru_mobile) searchConditions.push({ ru_mobile: data.ru_mobile });
    if (data.ru_email) searchConditions.push({ ru_email: data.ru_email });
    if (data.ru_aadhaar) searchConditions.push({ ru_aadhaar: data.ru_aadhaar });
    if (data.ru_pan) searchConditions.push({ ru_pan: data.ru_pan });

    if (searchConditions.length === 0 && data.ru_full_name) {
      searchConditions.push({ ru_full_name: data.ru_full_name });
    }

    let releaseUserId = null;

    if (searchConditions.length > 0) {
      const existingUsers = await tx.releaseUser.findMany({
        where: {
          ru_firm_id: firmId,
          OR: searchConditions,
        },
      });

      if (existingUsers.length > 0) {
        const exactMatch = existingUsers.find(
          (existing) =>
            (existing.ru_full_name || "") === (data.ru_full_name || "") &&
            (existing.ru_mobile || "") === (data.ru_mobile || "") &&
            (existing.ru_email || "") === (data.ru_email || "") &&
            (existing.ru_aadhaar || "") === (data.ru_aadhaar || "") &&
            (existing.ru_pan || "") === (data.ru_pan || "")
        );

        if (exactMatch) {
          releaseUserId = exactMatch.ru_id;
        } else {
          throw new Error("Release user already exists with mismatched details.");
        }
      }
    }

    if (!releaseUserId) {
      const ruUniqueCode = await serialNumberService.getNextSerialNumber(tx, "RELEASE_USER");
      const newUser = await tx.releaseUser.create({
        data: {
          ru_unique_code: ruUniqueCode,
          ru_firm_id: firmId,
          ru_full_name: data.ru_full_name || "",
          ru_mobile: data.ru_mobile || "",
          ru_email: data.ru_email || "",
          ru_aadhaar: data.ru_aadhaar || "",
          ru_gender: data.ru_gender || "",
          ru_pan: data.ru_pan || "",
          ru_address: data.ru_address || "",
          ru_state: data.ru_state || "",
          ru_city: data.ru_city || "",
          ru_country: data.ru_country || "",
          ru_village: data.ru_village || "",
          ru_pincode: data.ru_pincode || "",
        },
      });
      releaseUserId = newUser.ru_id;
    }

    return releaseUserId;
  }

  async getReleaseUserById(dbUrl, ruId) {
    const prisma = this.getPrisma(dbUrl);

      return await prisma.releaseUser.findUnique({
        where: { ru_id: parseInt(ruId) },
      });
    
  }

  async updateReleaseUserOtherImages(dbUrl, ruId, otherImages) {
    const prisma = this.getPrisma(dbUrl);

      return await prisma.releaseUser.update({
        where: { ru_id: parseInt(ruId) },
        data: { ru_other_images: otherImages },
      });
    
  }

  async getReleaseUsers(dbUrl, { firmId, girvId, search } = {}) {
    const prisma = this.getPrisma(dbUrl);

      if (girvId) {
        const releases = await prisma.girviRelease.findMany({
          where: {
            rel_girv_id: parseInt(girvId),
            rel_is_other_user: true,
            rel_pickup_user_id: { not: null },
            rel_is_deleted: false,
          },
          include: { pickupUser: true },
          orderBy: { rel_trans_date: "asc" },
        });

        const byUserId = new Map();
        releases.forEach((rel) => {
          const user = rel.pickupUser;
          if (!user) return;
          if (!byUserId.has(user.ru_id)) {
            byUserId.set(user.ru_id, {
              ...user,
              release_dates: [],
            });
          }
          const entry = byUserId.get(user.ru_id);
          if (rel.rel_trans_date && !entry.release_dates.includes(rel.rel_trans_date)) {
            entry.release_dates.push(rel.rel_trans_date);
          }
        });
        return Array.from(byUserId.values());
      }

      const whereClause = {};
      if (firmId && firmId !== "all") {
        whereClause.ru_firm_id = parseInt(firmId);
      }
      if (search) {
        whereClause.OR = [
          { ru_full_name: { contains: search, mode: "insensitive" } },
          { ru_mobile: { contains: search, mode: "insensitive" } },
          { ru_email: { contains: search, mode: "insensitive" } },
          { ru_aadhaar: { contains: search, mode: "insensitive" } },
        ];
      }

      return prisma.releaseUser.findMany({
        where: whereClause,
        orderBy: { ru_id: "desc" },
      });
    
  }

  async addRelease(dbUrl, reqUser, data) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const firmId = parseInt(data.rel_firm_id);
      const isOtherUser = this.parseBoolean(data.rel_is_other_user);
      const itemImages = this.parseItemImages(data.rel_item_images);

      if (isOtherUser) {
        if (!data.ru_full_name || !String(data.ru_full_name).trim()) {
          throw new Error("Release user full name is required.");
        }
        if (!data.ru_mobile || String(data.ru_mobile).trim().length < 10) {
          throw new Error("Valid release user mobile number is required.");
        }
      }
      
      // Resolve payment accounts
      const rel_cash_acc_id = await this.resolveAccount(prisma, firmId, data.rel_cash_acc_id, ["Cash In Hand", "Cash"]);
      const rel_bank_acc_id = await this.resolveAccount(prisma, firmId, data.rel_bank_acc_id, ["Bank Account", "Bank"]);
      const rel_online_acc_id = await this.resolveAccount(prisma, firmId, data.rel_online_acc_id, ["Online Account", "Online"]);
      const rel_card_acc_id = await this.resolveAccount(prisma, firmId, data.rel_card_acc_id, ["Card Account", "Card", "POS"]);

      // Resolve special accounts — P&L split income types when not overridden
      const rel_prin_acc_id = await this.resolveAccount(prisma, firmId, data.rel_prin_acc_id, ["Principal Account", "Secured Loans", "Unsecured Loans", "Girvi Account", "Loans & Advances"]);
      const ownId = reqUser?.own_id || data.rel_own_id || 1;
      const rel_int_acc_id =
        data.rel_int_acc_id && parseInt(data.rel_int_acc_id, 10) > 0
          ? await this.resolveAccount(prisma, firmId, data.rel_int_acc_id, [
              "Interest Rec",
              "Interest Account",
              "Interest Income",
              "Indirect Incomes",
            ])
          : await resolveIncomeAccount(prisma, firmId, ownId, "INTEREST");
      const rel_disc_acc_id = await this.resolveAccount(prisma, firmId, data.rel_disc_acc_id, ["Discount Account", "Discount Expenses", "Indirect Expenses", "Expenses (Indirect)"]);
      const rel_extra_acc_id =
        data.rel_extra_acc_id && parseInt(data.rel_extra_acc_id, 10) > 0
          ? await this.resolveAccount(prisma, firmId, data.rel_extra_acc_id, [
              "Extra Income",
              "Other Income",
              "Interest Rec",
              "Indirect Incomes",
            ])
          : await resolveIncomeAccount(prisma, firmId, ownId, "EXTRA");

      const result = await prisma.$transaction(async (tx) => {
        // 1. Fetch the parent Girvi/Loan record
        const girvi = await tx.girvi.findUnique({
          where: { girv_id: parseInt(data.rel_girv_id) }
        });

        if (!girvi) {
          throw new Error("Girvi (Loan) record not found");
        }
        assertActiveLoan(girvi, "be released");

        let pickupUserId = null;
        if (isOtherUser) {
          pickupUserId = await this.findOrCreateReleaseUser(tx, firmId, data);
        }

        // 2. Insert GirviRelease record
        const releaseRecord = await tx.girviRelease.create({
          data: {
            rel_own_id: reqUser.own_id,
            rel_firm_id: firmId,
            rel_user_id: parseInt(data.rel_user_id),
            rel_girv_id: parseInt(data.rel_girv_id),
            rel_staff_id: data.rel_staff_id ? parseInt(data.rel_staff_id) : 0,

            rel_trans_date: data.rel_trans_date,
            rel_prin_amt: data.rel_prin_amt ? parseFloat(data.rel_prin_amt) : 0,
            rel_int_amt: data.rel_int_amt ? parseFloat(data.rel_int_amt) : 0,
            rel_disc_amt: data.rel_disc_amt ? parseFloat(data.rel_disc_amt) : 0,
            rel_extra_amt: data.rel_extra_amt ? parseFloat(data.rel_extra_amt) : 0,
            rel_payable_amt: data.rel_payable_amt ? parseFloat(data.rel_payable_amt) : 0,

            rel_prin_acc_id,
            rel_int_acc_id,
            rel_disc_acc_id,
            rel_extra_acc_id,

            rel_cash_amt: data.rel_cash_amt ? parseFloat(data.rel_cash_amt) : 0,
            rel_cash_acc_id,
            rel_cash_info: data.rel_cash_info || "",

            rel_bank_amt: data.rel_bank_amt ? parseFloat(data.rel_bank_amt) : 0,
            rel_bank_acc_id,
            rel_bank_info: data.rel_bank_info || "",

            rel_online_amt: data.rel_online_amt ? parseFloat(data.rel_online_amt) : 0,
            rel_online_acc_id,
            rel_online_info: data.rel_online_info || "",

            rel_card_amt: data.rel_card_amt ? parseFloat(data.rel_card_amt) : 0,
            rel_card_acc_id,
            rel_card_info: data.rel_card_info || "",

            rel_pay_info: data.rel_pay_info || "",
            rel_other_info: data.rel_other_info || "",
            rel_remark: data.rel_remark || "",
            rel_item_images: itemImages,
            rel_is_other_user: isOtherUser,
            rel_pickup_user_id: pickupUserId,

            rel_created_by: reqUser.own_login_id || "Admin",
          }
        });

        // 3. Update Parent Girvi Record
        const prinRec = releaseRecord.rel_prin_amt || 0;
        const currentPrin = parseFloat(girvi.girv_prin_amt) || 0;
        const newPrin = Math.max(0, currentPrin - prinRec);
        let updateData = {};
        
        if (prinRec > 0) {
            updateData.girv_prin_amt = { decrement: prinRec };
            updateData.girv_final_amt = { decrement: prinRec };
        }
        
        const markedReleased = newPrin <= 0.01;
        if (markedReleased) {
            updateData.girv_status = "RELEASED";
        }

        let updatedGirvi = girvi;
        if (Object.keys(updateData).length > 0) {
            updatedGirvi = await tx.girvi.update({
                where: { girv_id: girvi.girv_id },
                data: updateData
            });
        }

        return { releaseRecord, updatedGirvi, girvi, markedReleased, releaseUserId: pickupUserId };
      });

      // 4. Create Journal Entry (same pattern as Deposit)
      const relRec = result.releaseRecord;
      
      const journal_request = {
        journal_date: {
          jrnl_date: relRec.rel_trans_date,
          jrnl_firm_id: relRec.rel_firm_id,
          jrnl_own_id: relRec.rel_own_id,
          jrnl_user_id: relRec.rel_user_id,
          jrnl_amt: relRec.rel_payable_amt,
          jrnl_panel: "Girvi",
          jrnl_other_info: releaseVoucher(result.girvi, relRec.rel_trans_date),
        },
        joural_trans_data: [
          // Debits (Money Coming In & Discount Given)
          { jrtr_crdr: "DR", jrtr_date: relRec.rel_trans_date, jrtr_dr_acc_id: relRec.rel_cash_acc_id, jrtr_dr_amt: relRec.rel_cash_amt, jrtr_acc_info: relRec.rel_cash_info },
          { jrtr_crdr: "DR", jrtr_date: relRec.rel_trans_date, jrtr_dr_acc_id: relRec.rel_bank_acc_id, jrtr_dr_amt: relRec.rel_bank_amt, jrtr_acc_info: relRec.rel_bank_info },
          { jrtr_crdr: "DR", jrtr_date: relRec.rel_trans_date, jrtr_dr_acc_id: relRec.rel_online_acc_id, jrtr_dr_amt: relRec.rel_online_amt, jrtr_acc_info: relRec.rel_online_info },
          { jrtr_crdr: "DR", jrtr_date: relRec.rel_trans_date, jrtr_dr_acc_id: relRec.rel_card_acc_id, jrtr_dr_amt: relRec.rel_card_amt, jrtr_acc_info: relRec.rel_card_info },
          { jrtr_crdr: "DR", jrtr_date: relRec.rel_trans_date, jrtr_dr_acc_id: relRec.rel_disc_acc_id, jrtr_dr_amt: relRec.rel_disc_amt, jrtr_acc_info: loanLine("Discount Given", result.girvi) },
          
          // Credits (Reduction of Loan, Income)
          { jrtr_crdr: "CR", jrtr_date: relRec.rel_trans_date, jrtr_cr_acc_id: result.girvi.girv_dr_acc_id || relRec.rel_prin_acc_id, jrtr_cr_amt: relRec.rel_prin_amt, jrtr_acc_info: loanLine("Principal Received (Release)", result.girvi) },
          { jrtr_crdr: "CR", jrtr_date: relRec.rel_trans_date, jrtr_cr_acc_id: relRec.rel_int_acc_id, jrtr_cr_amt: relRec.rel_int_amt, jrtr_acc_info: loanLine("Interest Received (Release)", result.girvi) },
          { jrtr_crdr: "CR", jrtr_date: relRec.rel_trans_date, jrtr_cr_acc_id: relRec.rel_extra_acc_id, jrtr_cr_amt: relRec.rel_extra_amt, jrtr_acc_info: loanLine("Extra Income (Release)", result.girvi) },
        ].filter(
          (t) =>
            (t.jrtr_cr_amt && parseFloat(t.jrtr_cr_amt) > 0) ||
            (t.jrtr_dr_amt && parseFloat(t.jrtr_dr_amt) > 0)
        ),
      };

      const rollbackRelease = async () => {
        const prinRec = parseFloat(relRec.rel_prin_amt) || 0;
        await prisma.girviRelease.delete({ where: { rel_id: relRec.rel_id } });
        await prisma.girvi.update({
          where: { girv_id: relRec.rel_girv_id },
          data: {
            girv_status: result.markedReleased ? "ACTIVE" : result.girvi.girv_status,
            ...(prinRec > 0
              ? {
                  girv_prin_amt: { increment: prinRec },
                  girv_final_amt: { increment: prinRec },
                }
              : {}),
          },
        });
      };

      if (!journal_request.joural_trans_data.length) {
        try {
          await rollbackRelease();
        } catch (cleanupErr) {
          console.error(
            "❌ Failed to rollback release after empty journal:",
            cleanupErr.message
          );
        }
        throw new Error(
          "Release account entry has no valid journal lines. Check release amounts and accounts."
        );
      }

      try {
        await journalService.create_journal_entry(dbUrl, journal_request);
      } catch (jErr) {
        console.error("Failed to insert release journal:", jErr);
        try {
          await rollbackRelease();
        } catch (cleanupErr) {
          console.error("❌ Failed to rollback release after journal error:", cleanupErr.message);
        }
        throw new Error(
          `Release account entry failed and was rolled back: ${jErr.message}`
        );
      }

      const user =
        relRec.rel_user_id > 0
          ? await prisma.user.findUnique({ where: { user_id: relRec.rel_user_id } })
          : null;
      messageDispatchService.dispatchSafe({
        dbUrl,
        ownDb: messageDispatchService.ownDbFromUrl(dbUrl),
        firmId: relRec.rel_firm_id,
        templateKey: "loan_release",
        toPhone: getCustomerWhatsAppNo(user),
        toEmail: user?.user_email_id,
        vars: {
          1: user
            ? `${user.user_first_name || ""} ${user.user_last_name || ""}`.trim()
            : "",
          2: String(relRec.rel_girv_id),
          3: String(relRec.rel_payable_amt),
          4: relRec.rel_trans_date,
        },
      });

      return result;
    } catch (error) {
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }

  async deleteRelease(dbUrl, reqUser, rel_id) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const releaseRecord = await prisma.girviRelease.findUnique({
        where: { rel_id: parseInt(rel_id) }
      });

      if (!releaseRecord) {
        throw new Error("Release record not found.");
      }

      const girviBefore = await prisma.girvi.findUnique({
        where: { girv_id: releaseRecord.rel_girv_id },
      });

      if (!girviBefore) {
        throw new Error("Parent Girvi (Loan) record not found.");
      }

      const result = await prisma.$transaction(async (tx) => {
        const girvi = await tx.girvi.findUnique({
          where: { girv_id: releaseRecord.rel_girv_id }
        });

        if (!girvi) {
          throw new Error("Parent Girvi (Loan) record not found.");
        }

        const prinRec = releaseRecord.rel_prin_amt || 0;
        const restoredPrin = Math.max(0, (parseFloat(girvi.girv_prin_amt) || 0) + prinRec);
        const updateData = {
          girv_status: restoredPrin <= 0.01 ? "RELEASED" : "ACTIVE",
        };
        
        if (prinRec > 0) {
            updateData.girv_prin_amt = { increment: prinRec };
            updateData.girv_final_amt = { increment: prinRec };
        }

        const updatedGirvi = await tx.girvi.update({
            where: { girv_id: girvi.girv_id },
            data: updateData
        });

        await tx.girviRelease.delete({
          where: { rel_id: parseInt(rel_id) }
        });

        return { success: true, updatedGirvi, releaseRecord, girvi };
      });

      const voucherInfo = releaseVoucher(girviBefore, releaseRecord.rel_trans_date);
      const journal = await prisma.journal.findFirst({
        where: {
          jrnl_other_info: voucherInfo,
          jrnl_panel: "Girvi",
          jrnl_amt: releaseRecord.rel_payable_amt,
          jrnl_firm_id: releaseRecord.rel_firm_id,
        },
      });

      if (journal) {
        await journalService.delete_journal_entry(
          dbUrl,
          journal.jrnl_id,
          releaseRecord.rel_own_id,
          releaseRecord.rel_firm_id
        );
      }

      return result;
    } catch (error) {
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }
}

module.exports = new ReleaseService();
