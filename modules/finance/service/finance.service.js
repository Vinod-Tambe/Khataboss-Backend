"use strict";

const { PrismaClient } = require("../../../prisma/generated/main");
const financeTransactionService = require("./finance_transaction.service");
const financeMoneyTransService = require("./finance_money_trans.service");
const journalService = require("../../journal/service/journal.service");

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
   * Create a new finance record with transactions and journal entries.
   */
  async create_finance(dbUrl, data) {
    const prisma = this.getPrisma(dbUrl);
    try {
      // 1. Resolve Automatic Fields
      let fin_dr_acc_id = data.fin_dr_acc_id ? parseInt(data.fin_dr_acc_id) : 0;
      if (!fin_dr_acc_id || fin_dr_acc_id === 0) {
        const drAcc = await prisma.account.findFirst({
          where: {
            acc_name: "Unsecured Loans",
            acc_firm_id: parseInt(data.fin_firm_id),
            acc_is_deleted: false,
          },
        });
        if (drAcc) fin_dr_acc_id = drAcc.acc_id;
      }

      // 2. Create Finance Record
      const finance = await prisma.finance.create({
        data: {
          fin_own_id: parseInt(data.fin_own_id || 1),
          fin_firm_id: parseInt(data.fin_firm_id),
          fin_user_id: data.fin_user_id ? parseInt(data.fin_user_id) : 0, // Default to 0 as requested to manage backend side
          fin_staff_id: parseInt(data.fin_staff_id || 0),
          fin_prin_amt: parseFloat(data.fin_prin_amt),
          fin_no_of_emi: parseInt(data.fin_no_of_emi),
          fin_start_date: data.fin_start_date,
          fin_freq_type: data.fin_freq_type || "MONTHLY",
          fin_freq: data.fin_freq || "",
          fin_roi: data.fin_roi,
          fin_collec_amt: parseFloat(data.fin_collec_amt || 0),
          fin_proccess_amt: parseFloat(data.fin_proccess_amt || 0),
          fin_fine_amt: parseFloat(data.fin_fine_amt || 0),
          fin_fine_emi_no: parseInt(data.fin_fine_emi_no || 0),
          fin_emi_amt: parseFloat(data.fin_emi_amt || 0),
          fin_final_amt: parseFloat(data.fin_final_amt || 0),
          
          fin_cash_amt: String(data.fin_cash_amt || ""),
          fin_bank_amt: String(data.fin_bank_amt || ""),
          fin_online_amt: String(data.fin_online_amt || ""),
          fin_card_amt: String(data.fin_card_amt || ""),

          fin_cash_acc_id: data.fin_cash_acc_id ? parseInt(data.fin_cash_acc_id) : null,
          fin_bank_acc_id: data.fin_bank_acc_id ? parseInt(data.fin_bank_acc_id) : null,
          fin_online_acc_id: data.fin_online_acc_id ? parseInt(data.fin_online_acc_id) : null,
          fin_card_acc_id: data.fin_card_acc_id ? parseInt(data.fin_card_acc_id) : null,
          fin_dr_acc_id: fin_dr_acc_id,

          fin_cash_info: data.fin_cash_info || "",
          fin_bank_info: data.fin_bank_info || "",
          fin_online_info: data.fin_online_info || "",
          fin_card_info: data.fin_card_info || "",
          
          fin_pay_info: data.fin_pay_info || "",
          fin_other_info: data.fin_other_info || "",
          fin_add_date: new Date().toISOString().split('T')[0],
          fin_created_by: data.fin_created_by || "",
        },
      });

      // 2. Create Finance Transactions (EMIs)
      const finance_trans_data = {
        ft_firm_id: finance.fin_firm_id,
        ft_own_id: finance.fin_own_id,
        ft_user_id: finance.fin_user_id,
        ft_fin_id: finance.fin_id,
        ft_emi_amt: finance.fin_emi_amt,
      };

      await financeTransactionService.create_finance_transaction(
        dbUrl,
        finance_trans_data,
        finance.fin_no_of_emi,
        parseInt(finance.fin_freq) || 1,
        finance.fin_freq_type,
        finance.fin_start_date
      );

      // 3. Create Journal Entry
      const journal_request = {
        journal_date: {
          jrnl_date: finance.fin_start_date,
          jrnl_firm_id: finance.fin_firm_id,
          jrnl_own_id: finance.fin_own_id,
          jrnl_user_id: finance.fin_user_id,
          jrnl_amt: finance.fin_final_amt,
          jrnl_panel: "Finance",
          jrnl_other_info: `Add New Finance | Fin No - ${finance.fin_id}`,
        },
        joural_trans_data: [
          { jrtr_crdr: "CR", jrtr_date: finance.fin_start_date, jrtr_cr_acc_id: finance.fin_cash_acc_id, jrtr_cr_amt: finance.fin_cash_amt, jrtr_acc_info: finance.fin_cash_info },
          { jrtr_crdr: "CR", jrtr_date: finance.fin_start_date, jrtr_cr_acc_id: finance.fin_bank_acc_id, jrtr_cr_amt: finance.fin_bank_amt, jrtr_acc_info: finance.fin_bank_info },
          { jrtr_crdr: "CR", jrtr_date: finance.fin_start_date, jrtr_cr_acc_id: finance.fin_online_acc_id, jrtr_cr_amt: finance.fin_online_amt, jrtr_acc_info: finance.fin_online_info },
          { jrtr_crdr: "CR", jrtr_date: finance.fin_start_date, jrtr_cr_acc_id: finance.fin_card_acc_id, jrtr_cr_amt: finance.fin_card_amt, jrtr_acc_info: finance.fin_card_info },
          { jrtr_crdr: "DR", jrtr_date: finance.fin_start_date, jrtr_dr_acc_id: finance.fin_dr_acc_id, jrtr_dr_amt: finance.fin_final_amt, jrtr_acc_info: `Add New Finance : Fin No - ${finance.fin_id}` }
        ].filter(t => (t.jrtr_cr_amt && parseFloat(t.jrtr_cr_amt) > 0) || (t.jrtr_dr_amt && parseFloat(t.jrtr_dr_amt) > 0)),
      };

      const jrnl_id = await journalService.create_journal_entry(dbUrl, journal_request);

      // 4. Update Finance with Journal ID
      const updatedFinance = await prisma.finance.update({
        where: { fin_id: finance.fin_id },
        data: { fin_jrnl_id: jrnl_id },
      });

      return updatedFinance;
    } catch (error) {
      console.error("❌ Error in create_finance:", error.message);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }

  async getFinances(dbUrl, firmId = null) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const where = { fin_is_deleted: false };
      if (firmId && firmId !== 'all') {
        where.fin_firm_id = parseInt(firmId);
      }
      return await prisma.finance.findMany({
        where: where,
        orderBy: { fin_created_at: "desc" },
        include: {
          user: {
            select: { user_first_name: true, user_last_name: true }
          },
          firm: {
            select: { firm_name: true }
          }
        }
      });
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
