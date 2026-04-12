"use strict";

const { PrismaClient } = require("../../../prisma/generated/main");

class JournalService {
  /**
   * Get the prisma client for the given tenant database URL.
   */
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
   * Create a journal entry and its associated transactions.
   * @param {string} dbUrl 
   * @param {object} data { journal_date: {}, joural_trans_data: [] }
   */
  async create_journal_entry(dbUrl, data) {
    const prisma = this.getPrisma(dbUrl);
    try {
      return await prisma.$transaction(async (tx) => {
        // 1. Create Journal
        const journalData = data.journal_date;
        const journal = await tx.journal.create({
          data: {
            jrnl_firm_id: journalData.jrnl_firm_id,
            jrnl_own_id: journalData.jrnl_own_id,
            jrnl_user_id: journalData.jrnl_user_id,
            jrnl_date: journalData.jrnl_date,
            jrnl_amt: parseFloat(journalData.jrnl_amt),
            jrnl_panel: journalData.jrnl_panel,
            jrnl_other_info: journalData.jrnl_other_info,
            jrnl_add_date: new Date().toISOString(), // Optional: if needed
          },
        });

        // 2. Create Journal Transactions
        const transData = data.joural_trans_data;
        const transactions = transData
          .filter(t => (t.jrtr_cr_amt && parseFloat(t.jrtr_cr_amt) > 0) || (t.jrtr_dr_amt && parseFloat(t.jrtr_dr_amt) > 0))
          .map((t) => ({
            jrtr_jrnl_id: journal.jrnl_id,
            jrtr_firm_id: journalData.jrnl_firm_id,
            jrtr_own_id: journalData.jrnl_own_id,
            jrtr_user_id: journalData.jrnl_user_id,
            jrtr_cr_acc_id: t.jrtr_cr_acc_id ? parseInt(t.jrtr_cr_acc_id) : null,
            jrtr_dr_acc_id: t.jrtr_dr_acc_id ? parseInt(t.jrtr_dr_acc_id) : null,
            jrtr_date: t.jrtr_date,
            jrtr_panel: journalData.jrnl_panel,
            jrtr_crdr: t.jrtr_crdr,
            jrtr_cr_amt: t.jrtr_cr_amt ? parseFloat(t.jrtr_cr_amt) : 0,
            jrtr_dr_amt: t.jrtr_dr_amt ? parseFloat(t.jrtr_dr_amt) : 0,
            jrtr_acc_info: t.jrtr_acc_info,
            jrtr_other_info: t.jrtr_other_info || journalData.jrnl_other_info,
          }));

        if (transactions.length > 0) {
          await tx.journalTransaction.createMany({
            data: transactions,
          });
        }

        return journal.jrnl_id;
      });
    } catch (error) {
      console.error("❌ Error creating journal entry:", error.message);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Delete a journal entry and its associated transactions.
   */
  async delete_journal_entry(dbUrl, jrnl_id, own_id, firm_id) {
    const prisma = this.getPrisma(dbUrl);
    try {
      return await prisma.$transaction(async (tx) => {
        // Delete Journal Transactions first
        await tx.journalTransaction.deleteMany({
          where: {
            jrtr_jrnl_id: parseInt(jrnl_id),
            jrtr_own_id: parseInt(own_id),
            jrtr_firm_id: parseInt(firm_id),
          },
        });

        // Delete Journal
        return await tx.journal.delete({
          where: {
            jrnl_id: parseInt(jrnl_id),
          },
        });
      });
    } catch (error) {
      console.error("❌ Error deleting journal entry:", error.message);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }
}

module.exports = new JournalService();
