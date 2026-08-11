"use strict";

const { PrismaClient } = require("../../../prisma/generated/main");
const journalService = require("../../journal/service/journal.service");
const {
  depositVoucher,
  loanLine,
} = require("../../../utils/journalNarration");
const { assertActiveLoan } = require("../../../utils/loanValidation");
const {
  findPanelJournal,
  deletePanelJournal,
} = require("../../../utils/loanJournalHelper");

class DepositService {
  getPrisma(dbUrl) {
    return new PrismaClient({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
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

  async addDeposit(dbUrl, reqUser, data) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const firmId = parseInt(data.dep_firm_id);
      
      // Resolve payment accounts
      const dep_cash_acc_id = await this.resolveAccount(prisma, firmId, data.dep_cash_acc_id, ["Cash In Hand", "Cash"]);
      const dep_bank_acc_id = await this.resolveAccount(prisma, firmId, data.dep_bank_acc_id, ["Bank Account", "Bank"]);
      const dep_online_acc_id = await this.resolveAccount(prisma, firmId, data.dep_online_acc_id, ["Online Account", "Online"]);
      const dep_card_acc_id = await this.resolveAccount(prisma, firmId, data.dep_card_acc_id, ["Card Account", "Card", "POS"]);

      // Resolve special accounts (Interest Rec = default COA income account)
      const dep_prin_acc_id = await this.resolveAccount(prisma, firmId, data.dep_prin_acc_id, ["Principal Account", "Secured Loans", "Unsecured Loans", "Girvi Account", "Loans & Advances"]);
      const dep_int_acc_id = await this.resolveAccount(prisma, firmId, data.dep_int_acc_id, ["Interest Rec", "Interest Account", "Interest Income", "Indirect Incomes"]);
      const dep_disc_acc_id = await this.resolveAccount(prisma, firmId, data.dep_disc_acc_id, ["Discount Account", "Discount Expenses", "Indirect Expenses", "Expenses (Indirect)"]);
      const dep_extra_acc_id = await this.resolveAccount(prisma, firmId, data.dep_extra_acc_id, ["Extra Income", "Other Income", "Interest Rec", "Indirect Incomes"]);

      const result = await prisma.$transaction(async (tx) => {
        // 1. Fetch the parent Girvi/Loan record
        const girvi = await tx.girvi.findUnique({
          where: { girv_id: parseInt(data.dep_girv_id) }
        });

        if (!girvi) {
          throw new Error("Girvi (Loan) record not found");
        }
        assertActiveLoan(girvi, "accept deposits");

        // 2. Insert GirviDeposit record
        const depositRecord = await tx.girviDeposit.create({
          data: {
            dep_own_id: reqUser.own_id,
            dep_firm_id: firmId,
            dep_user_id: parseInt(data.dep_user_id),
            dep_girv_id: parseInt(data.dep_girv_id),
            dep_staff_id: data.dep_staff_id ? parseInt(data.dep_staff_id) : 0,

            dep_trans_date: data.dep_trans_date,
            dep_prin_amt: data.dep_prin_amt ? parseFloat(data.dep_prin_amt) : 0,
            dep_int_amt: data.dep_int_amt ? parseFloat(data.dep_int_amt) : 0,
            dep_disc_amt: data.dep_disc_amt ? parseFloat(data.dep_disc_amt) : 0,
            dep_extra_amt: data.dep_extra_amt ? parseFloat(data.dep_extra_amt) : 0,
            dep_payable_amt: data.dep_payable_amt ? parseFloat(data.dep_payable_amt) : 0,

            dep_prin_acc_id,
            dep_int_acc_id,
            dep_disc_acc_id,
            dep_extra_acc_id,

            dep_cash_amt: data.dep_cash_amt ? parseFloat(data.dep_cash_amt) : 0,
            dep_cash_acc_id,
            dep_cash_info: data.dep_cash_info || "",

            dep_bank_amt: data.dep_bank_amt ? parseFloat(data.dep_bank_amt) : 0,
            dep_bank_acc_id,
            dep_bank_info: data.dep_bank_info || "",

            dep_online_amt: data.dep_online_amt ? parseFloat(data.dep_online_amt) : 0,
            dep_online_acc_id,
            dep_online_info: data.dep_online_info || "",

            dep_card_amt: data.dep_card_amt ? parseFloat(data.dep_card_amt) : 0,
            dep_card_acc_id,
            dep_card_info: data.dep_card_info || "",

            dep_pay_info: data.dep_pay_info || "",
            dep_other_info: data.dep_other_info || "",
            dep_created_by: reqUser.own_login_id || "Admin",
          }
        });

        // 3. Update Parent Girvi Record
        const prinRec = depositRecord.dep_prin_amt || 0;
        let updateData = {};
        if (prinRec > 0) {
            updateData.girv_prin_amt = { decrement: prinRec };
            updateData.girv_final_amt = { decrement: prinRec };
        }
        
        let updatedGirvi = girvi;
        if (Object.keys(updateData).length > 0) {
            updatedGirvi = await tx.girvi.update({
                where: { girv_id: girvi.girv_id },
                data: updateData
            });
        }

        return { depositRecord, updatedGirvi, girvi };
      });

      // 4. Create Journal Entry
      const depRec = result.depositRecord;
      
      const journal_request = {
        journal_date: {
          jrnl_date: depRec.dep_trans_date,
          jrnl_firm_id: depRec.dep_firm_id,
          jrnl_own_id: depRec.dep_own_id,
          jrnl_user_id: depRec.dep_user_id,
          jrnl_amt: depRec.dep_payable_amt,
          jrnl_panel: "Girvi",
          jrnl_other_info: depositVoucher(result.girvi, depRec.dep_trans_date),
        },
        joural_trans_data: [
          // Debits (Money Coming In & Discount Given)
          { jrtr_crdr: "DR", jrtr_date: depRec.dep_trans_date, jrtr_dr_acc_id: depRec.dep_cash_acc_id, jrtr_dr_amt: depRec.dep_cash_amt, jrtr_acc_info: depRec.dep_cash_info },
          { jrtr_crdr: "DR", jrtr_date: depRec.dep_trans_date, jrtr_dr_acc_id: depRec.dep_bank_acc_id, jrtr_dr_amt: depRec.dep_bank_amt, jrtr_acc_info: depRec.dep_bank_info },
          { jrtr_crdr: "DR", jrtr_date: depRec.dep_trans_date, jrtr_dr_acc_id: depRec.dep_online_acc_id, jrtr_dr_amt: depRec.dep_online_amt, jrtr_acc_info: depRec.dep_online_info },
          { jrtr_crdr: "DR", jrtr_date: depRec.dep_trans_date, jrtr_dr_acc_id: depRec.dep_card_acc_id, jrtr_dr_amt: depRec.dep_card_amt, jrtr_acc_info: depRec.dep_card_info },
          { jrtr_crdr: "DR", jrtr_date: depRec.dep_trans_date, jrtr_dr_acc_id: depRec.dep_disc_acc_id, jrtr_dr_amt: depRec.dep_disc_amt, jrtr_acc_info: loanLine("Discount Given", result.girvi) },
          
          // Credits (Reduction of Loan, Income)
          { jrtr_crdr: "CR", jrtr_date: depRec.dep_trans_date, jrtr_cr_acc_id: result.girvi.girv_dr_acc_id || depRec.dep_prin_acc_id, jrtr_cr_amt: depRec.dep_prin_amt, jrtr_acc_info: loanLine("Principal Received", result.girvi) },
          { jrtr_crdr: "CR", jrtr_date: depRec.dep_trans_date, jrtr_cr_acc_id: depRec.dep_int_acc_id, jrtr_cr_amt: depRec.dep_int_amt, jrtr_acc_info: loanLine("Interest Received", result.girvi) },
          { jrtr_crdr: "CR", jrtr_date: depRec.dep_trans_date, jrtr_cr_acc_id: depRec.dep_extra_acc_id, jrtr_cr_amt: depRec.dep_extra_amt, jrtr_acc_info: loanLine("Extra Amount Received", result.girvi) }
        ].filter(t => (t.jrtr_cr_amt && parseFloat(t.jrtr_cr_amt) > 0) || (t.jrtr_dr_amt && parseFloat(t.jrtr_dr_amt) > 0)),
      };

      try {
        await journalService.create_journal_entry(dbUrl, journal_request);
      } catch (journalErr) {
        console.error("❌ Failed to create journal entry for deposit:", journalErr.message);
        // Compensate operational row so Daybook/ledger stay aligned
        try {
          const prinRec = parseFloat(depRec.dep_prin_amt) || 0;
          await prisma.girviDeposit.delete({ where: { dep_id: depRec.dep_id } });
          if (prinRec > 0) {
            await prisma.girvi.update({
              where: { girv_id: depRec.dep_girv_id },
              data: {
                girv_prin_amt: { increment: prinRec },
                girv_final_amt: { increment: prinRec },
              },
            });
          }
        } catch (cleanupErr) {
          console.error("❌ Failed to rollback deposit after journal error:", cleanupErr.message);
        }
        throw new Error(
          `Deposit account entry failed and was rolled back: ${journalErr.message}`
        );
      }

      return result;
    } finally {
      await prisma.$disconnect();
    }
  }

  async deleteDeposit(dbUrl, reqUser, dep_id) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const depositRecord = await prisma.girviDeposit.findFirst({
        where: {
          dep_id: parseInt(dep_id, 10),
          dep_is_deleted: false,
        },
      });

      if (!depositRecord) {
        throw new Error("Deposit record not found.");
      }

      const girviBefore = await prisma.girvi.findUnique({
        where: { girv_id: depositRecord.dep_girv_id },
      });

      if (!girviBefore) {
        throw new Error("Parent Girvi (Loan) record not found.");
      }
      assertActiveLoan(girviBefore, "revert deposits");

      const voucherInfo = depositVoucher(girviBefore, depositRecord.dep_trans_date);
      const journal = await findPanelJournal(prisma, {
        voucherInfo,
        firmId: depositRecord.dep_firm_id,
        amount: depositRecord.dep_payable_amt,
      });

      const result = await prisma.$transaction(async (tx) => {
        const currentGirvi = await tx.girvi.findUnique({
          where: { girv_id: depositRecord.dep_girv_id },
        });
        if (!currentGirvi) {
          throw new Error("Parent Girvi (Loan) record not found.");
        }
        assertActiveLoan(currentGirvi, "revert deposits");

        const prinRec = parseFloat(depositRecord.dep_prin_amt) || 0;
        const updateData = {
          dep_is_deleted: true,
          dep_deleted_at: new Date(),
          dep_deleted_by: reqUser?.own_login_id || "Admin",
        };

        if (prinRec > 0) {
          await tx.girvi.update({
            where: { girv_id: currentGirvi.girv_id },
            data: {
              girv_prin_amt: { increment: prinRec },
              girv_final_amt: { increment: prinRec },
            },
          });
        }

        await tx.girviDeposit.update({
          where: { dep_id: depositRecord.dep_id },
          data: updateData,
        });

        const updatedGirvi = await tx.girvi.findUnique({
          where: { girv_id: currentGirvi.girv_id },
        });

        return { success: true, updatedGirvi, depositRecord, girvi: girviBefore };
      });

      if (journal) {
        await deletePanelJournal(dbUrl, journal);
      }

      return result;
    } finally {
      await prisma.$disconnect();
    }
  }
}

module.exports = new DepositService();
