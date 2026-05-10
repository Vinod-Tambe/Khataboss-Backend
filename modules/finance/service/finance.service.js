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

  async getFinances(dbUrl, firmId = null, userId = null, status = null) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const where = { fin_is_deleted: false };
      
      if (firmId && firmId !== 'all') {
        where.fin_firm_id = parseInt(firmId);
      }
      
      if (userId && userId !== 'all') {
        where.fin_user_id = parseInt(userId);
      }
      
      if (status && status !== 'ALL') {
        where.fin_status = status;
      }

      return await prisma.finance.findMany({
        where: where,
        orderBy: { fin_created_at: "desc" },
        include: {
          user: {
            select: { user_first_name: true, user_last_name: true, user_mobile_no: true }
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
      const finance = await prisma.finance.findUnique({
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

      if (!finance) throw new Error("Finance record not found");
      return finance;
    } finally {
      await prisma.$disconnect();
    }
  }

  async processPayment(dbUrl, data) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const fin_id = parseInt(data.fm_fin_id);
      const paymentAmt = parseFloat(data.fm_trans_amt);
      const isRollback = data.fm_trans_type === "ROLLBACK";

      // 1. Get Finance and relevant EMIs
      const finance = await prisma.finance.findUnique({
        where: { fin_id },
        include: {
          finance_trans: {
            // If PAID: find pending/partial
            // If ROLLBACK: find paid/partial
            where: isRollback
              ? { ft_paid_amt: { gt: 0 } }
              : { ft_emi_status: { in: ["PENDING", "PARTIAL", "DUE"] } },
            orderBy: { ft_emi_no: isRollback ? "desc" : "asc" },
          },
        },
      });

      if (!finance) throw new Error("Finance record not found");

      // 2. Create Money Transaction Entry
      const moneyTrans = await prisma.finance_Money_Transaction.create({
        data: {
          fm_own_id: finance.fin_own_id,
          fm_firm_id: finance.fin_firm_id,
          fm_user_id: finance.fin_user_id,
          fm_fin_id: finance.fin_id,
          fm_trans_crdr: isRollback ? "CR" : "DR",
          fm_trans_date: data.fm_trans_date,
          fm_trans_type: isRollback ? "ROLLBACK" : "PAID",
          fm_trans_amt: paymentAmt,
          fm_cash_amt: parseFloat(data.fm_cash_amt || 0),
          fm_bank_amt: parseFloat(data.fm_bank_amt || 0),
          fm_online_amt: parseFloat(data.fm_online_amt || 0),
          fm_card_amt: parseFloat(data.fm_card_amt || 0),
          fm_cash_acc_id: data.fm_cash_acc_id ? parseInt(data.fm_cash_acc_id) : null,
          fm_bank_acc_id: data.fm_bank_acc_id ? parseInt(data.fm_bank_acc_id) : null,
          fm_online_acc_id: data.fm_online_acc_id ? parseInt(data.fm_online_acc_id) : null,
          fm_card_acc_id: data.fm_card_acc_id ? parseInt(data.fm_card_acc_id) : null,
          fm_dr_acc_id: finance.fin_dr_acc_id,
          fm_cash_info: data.fm_cash_info || "",
          fm_bank_info: data.fm_bank_info || "",
          fm_online_info: data.fm_online_info || "",
          fm_card_info: data.fm_card_info || "",
          fm_pay_info: data.fm_pay_info || "",
          fm_other_info: data.fm_other_info || "",
        },
      });

      // 3. Update EMIs (Waterfall or Reverse Waterfall logic)
      let remainingAmt = paymentAmt;
      for (const emi of finance.finance_trans) {
        if (remainingAmt <= 0) break;

        let toApply = 0;
        if (!isRollback) {
          // PAID logic: Reduce pending, Increase paid
          toApply = Math.min(remainingAmt, emi.ft_pending_amt);
          const newPaidAmt = emi.ft_paid_amt + toApply;
          const newPendingAmt = emi.ft_pending_amt - toApply;
          const newStatus = newPendingAmt <= 0 ? "PAID" : newPaidAmt > 0 ? "PARTIAL" : "PENDING";

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
          // ROLLBACK logic: Increase pending, Reduce paid
          toApply = Math.min(remainingAmt, emi.ft_paid_amt);
          const newPaidAmt = emi.ft_paid_amt - toApply;
          const newPendingAmt = emi.ft_pending_amt + toApply;
          const newStatus = newPaidAmt <= 0 ? "PENDING" : "PARTIAL";

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

        remainingAmt -= toApply;
      }

      // 4. Create Journal Entry
      // PAID: DR Cash/Bank, CR Customer (Loan)
      // ROLLBACK: DR Customer (Loan), CR Cash/Bank
      const journal_request = {
        journal_date: {
          jrnl_date: data.fm_trans_date,
          jrnl_firm_id: finance.fin_firm_id,
          jrnl_own_id: finance.fin_own_id,
          jrnl_user_id: finance.fin_user_id,
          jrnl_amt: paymentAmt,
          jrnl_panel: "Finance",
          jrnl_other_info: `${isRollback ? "EMI Rollback" : "EMI Payment"} | Fin No - ${finance.fin_id} | Money Trans - ${moneyTrans.fm_id}`,
        },
        joural_trans_data: [
          // If PAID: DR the assets. If ROLLBACK: CR the assets.
          { 
            jrtr_crdr: isRollback ? "CR" : "DR", 
            jrtr_date: data.fm_trans_date, 
            [isRollback ? "jrtr_cr_acc_id" : "jrtr_dr_acc_id"]: moneyTrans.fm_cash_acc_id, 
            [isRollback ? "jrtr_cr_amt" : "jrtr_dr_amt"]: moneyTrans.fm_cash_amt, 
            jrtr_acc_info: moneyTrans.fm_cash_info 
          },
          { 
            jrtr_crdr: isRollback ? "CR" : "DR", 
            jrtr_date: data.fm_trans_date, 
            [isRollback ? "jrtr_cr_acc_id" : "jrtr_dr_acc_id"]: moneyTrans.fm_bank_acc_id, 
            [isRollback ? "jrtr_cr_amt" : "jrtr_dr_amt"]: moneyTrans.fm_bank_amt, 
            jrtr_acc_info: moneyTrans.fm_bank_info 
          },
          { 
            jrtr_crdr: isRollback ? "CR" : "DR", 
            jrtr_date: data.fm_trans_date, 
            [isRollback ? "jrtr_cr_acc_id" : "jrtr_dr_acc_id"]: moneyTrans.fm_online_acc_id, 
            [isRollback ? "jrtr_cr_amt" : "jrtr_dr_amt"]: moneyTrans.fm_online_amt, 
            jrtr_acc_info: moneyTrans.fm_online_info 
          },
          { 
            jrtr_crdr: isRollback ? "CR" : "DR", 
            jrtr_date: data.fm_trans_date, 
            [isRollback ? "jrtr_cr_acc_id" : "jrtr_dr_acc_id"]: moneyTrans.fm_card_acc_id, 
            [isRollback ? "jrtr_cr_amt" : "jrtr_dr_amt"]: moneyTrans.fm_card_amt, 
            jrtr_acc_info: moneyTrans.fm_card_info 
          },
          // The loan account (fin_dr_acc_id)
          // If PAID: CR it. If ROLLBACK: DR it.
          { 
            jrtr_crdr: isRollback ? "DR" : "CR", 
            jrtr_date: data.fm_trans_date, 
            [isRollback ? "jrtr_dr_acc_id" : "jrtr_cr_acc_id"]: finance.fin_dr_acc_id, 
            [isRollback ? "jrtr_dr_amt" : "jrtr_cr_amt"]: paymentAmt, 
            jrtr_acc_info: `${isRollback ? "EMI Rollback" : "EMI Payment"} : Fin No - ${finance.fin_id}` 
          }
        ].filter(t => (t.jrtr_cr_amt && parseFloat(t.jrtr_cr_amt) > 0) || (t.jrtr_dr_amt && parseFloat(t.jrtr_dr_amt) > 0)),
      };

      const jrnl_id = await journalService.create_journal_entry(dbUrl, journal_request);

      // 5. Update Money Trans with Journal ID
      await prisma.finance_Money_Transaction.update({
        where: { fm_id: moneyTrans.fm_id },
        data: { fm_jrnl_id: jrnl_id },
      });

      return moneyTrans;
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
