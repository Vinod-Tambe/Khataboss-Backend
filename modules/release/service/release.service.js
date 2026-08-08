"use strict";

const { PrismaClient } = require("../../../prisma/generated/main");
const journalService = require("../../journal/service/journal.service");

class ReleaseService {
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

  async addRelease(dbUrl, reqUser, data) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const firmId = parseInt(data.rel_firm_id);
      
      // Resolve payment accounts
      const rel_cash_acc_id = await this.resolveAccount(prisma, firmId, data.rel_cash_acc_id, ["Cash In Hand", "Cash"]);
      const rel_bank_acc_id = await this.resolveAccount(prisma, firmId, data.rel_bank_acc_id, ["Bank Account", "Bank"]);
      const rel_online_acc_id = await this.resolveAccount(prisma, firmId, data.rel_online_acc_id, ["Online Account", "Online"]);
      const rel_card_acc_id = await this.resolveAccount(prisma, firmId, data.rel_card_acc_id, ["Card Account", "Card", "POS"]);

      // Resolve special accounts
      const rel_prin_acc_id = await this.resolveAccount(prisma, firmId, data.rel_prin_acc_id, ["Principal Account", "Secured Loans", "Unsecured Loans", "Girvi Account"]);
      const rel_int_acc_id = await this.resolveAccount(prisma, firmId, data.rel_int_acc_id, ["Interest Account", "Interest Income"]);
      const rel_disc_acc_id = await this.resolveAccount(prisma, firmId, data.rel_disc_acc_id, ["Discount Account", "Discount Expenses"]);
      const rel_extra_acc_id = await this.resolveAccount(prisma, firmId, data.rel_extra_acc_id, ["Extra Income", "Other Income"]);

      const result = await prisma.$transaction(async (tx) => {
        // 1. Fetch the parent Girvi/Loan record
        const girvi = await tx.girvi.findUnique({
          where: { girv_id: parseInt(data.rel_girv_id) }
        });

        if (!girvi) {
          throw new Error("Girvi (Loan) record not found");
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
            rel_created_by: reqUser.own_login_id || "Admin",
          }
        });

        // 3. Update Parent Girvi Record
        const prinRec = releaseRecord.rel_prin_amt || 0;
        let updateData = {};
        
        if (prinRec > 0) {
            updateData.girv_prin_amt = { decrement: prinRec };
            updateData.girv_final_amt = { decrement: prinRec };
        }
        
        // Ensure status is marked as RELEASED
        updateData.girv_status = "RELEASED";

        let updatedGirvi = girvi;
        if (Object.keys(updateData).length > 0) {
            updatedGirvi = await tx.girvi.update({
                where: { girv_id: girvi.girv_id },
                data: updateData
            });
        }

        return { releaseRecord, updatedGirvi, girvi };
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
          jrnl_other_info: `Loan Released | Loan No - ${relRec.rel_girv_id} | Release No - ${relRec.rel_id}`,
        },
        joural_trans_data: [
          // Debits (Money Coming In & Discount Given)
          { jrtr_crdr: "DR", jrtr_date: relRec.rel_trans_date, jrtr_dr_acc_id: relRec.rel_cash_acc_id, jrtr_dr_amt: relRec.rel_cash_amt, jrtr_acc_info: relRec.rel_cash_info },
          { jrtr_crdr: "DR", jrtr_date: relRec.rel_trans_date, jrtr_dr_acc_id: relRec.rel_bank_acc_id, jrtr_dr_amt: relRec.rel_bank_amt, jrtr_acc_info: relRec.rel_bank_info },
          { jrtr_crdr: "DR", jrtr_date: relRec.rel_trans_date, jrtr_dr_acc_id: relRec.rel_online_acc_id, jrtr_dr_amt: relRec.rel_online_amt, jrtr_acc_info: relRec.rel_online_info },
          { jrtr_crdr: "DR", jrtr_date: relRec.rel_trans_date, jrtr_dr_acc_id: relRec.rel_card_acc_id, jrtr_dr_amt: relRec.rel_card_amt, jrtr_acc_info: relRec.rel_card_info },
          { jrtr_crdr: "DR", jrtr_date: relRec.rel_trans_date, jrtr_dr_acc_id: relRec.rel_disc_acc_id, jrtr_dr_amt: relRec.rel_disc_amt, jrtr_acc_info: `Discount Given : Loan No - ${relRec.rel_girv_id}` },
          
          // Credits (Reduction of Loan, Income)
          { jrtr_crdr: "CR", jrtr_date: relRec.rel_trans_date, jrtr_cr_acc_id: result.girvi.girv_dr_acc_id || relRec.rel_prin_acc_id, jrtr_cr_amt: relRec.rel_prin_amt, jrtr_acc_info: `Principal Received (Release) : Loan No - ${relRec.rel_girv_id}` },
          { jrtr_crdr: "CR", jrtr_date: relRec.rel_trans_date, jrtr_cr_acc_id: relRec.rel_int_acc_id, jrtr_cr_amt: relRec.rel_int_amt, jrtr_acc_info: `Interest Received (Release) : Loan No - ${relRec.rel_girv_id}` },
          { jrtr_crdr: "CR", jrtr_date: relRec.rel_trans_date, jrtr_cr_acc_id: relRec.rel_extra_acc_id, jrtr_cr_amt: relRec.rel_extra_amt, jrtr_acc_info: `Extra Income (Release) : Loan No - ${relRec.rel_girv_id}` },
        ].filter(t => (t.jrtr_cr_amt > 0 || t.jrtr_dr_amt > 0)) // Only keep rows with > 0 amounts
      };

      if (journal_request.joural_trans_data.length > 0) {
        try {
          await journalService.addJournal(dbUrl, reqUser, journal_request);
        } catch (jErr) {
          console.error("Failed to insert release journal, but release was created:", jErr);
        }
      }

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

      const result = await prisma.$transaction(async (tx) => {
        // 1. Fetch Parent Girvi
        const girvi = await tx.girvi.findUnique({
          where: { girv_id: releaseRecord.rel_girv_id }
        });

        if (!girvi) {
          throw new Error("Parent Girvi (Loan) record not found.");
        }

        // 2. Revert principal amount & status
        const prinRec = releaseRecord.rel_prin_amt || 0;
        let updateData = {};
        
        if (prinRec > 0) {
            updateData.girv_prin_amt = { increment: prinRec };
            updateData.girv_final_amt = { increment: prinRec };
        }
        
        // Revert status to ACTIVE
        updateData.girv_status = "ACTIVE";

        const updatedGirvi = await tx.girvi.update({
            where: { girv_id: girvi.girv_id },
            data: updateData
        });

        // 3. Delete GirviRelease record
        await tx.girviRelease.delete({
          where: { rel_id: parseInt(rel_id) }
        });

        // 4. Delete associated Journal Entry
        // The journal entry was created with jrnl_other_info containing `Release No - ${rel_id}`
        const journal = await tx.journal.findFirst({
          where: {
            jrnl_other_info: {
              contains: `Release No - ${rel_id}`
            }
          }
        });

        if (journal) {
          await tx.journal.delete({
            where: { jrnl_id: journal.jrnl_id }
          });
        }

        return { success: true, updatedGirvi };
      });

      return result;
    } catch (error) {
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }
}

module.exports = new ReleaseService();
