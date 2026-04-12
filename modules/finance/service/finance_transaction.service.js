"use strict";

const { PrismaClient } = require("../../../prisma/generated/main");

class FinanceTransactionService {
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
   * Helper to format date as YYYY-MM-DD
   */
  formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  /**
   * Create finance transactions (EMIs)
   * @param {string} dbUrl 
   * @param {object} data Basic transaction data (ids, etc.)
   * @param {number} count Number of EMIs
   * @param {number} fin_freq Frequency (e.g., 1)
   * @param {string} fin_freq_type "MONTHLY" or "DAILY"
   * @param {string} start_date Start date string
   */
  async create_finance_transaction(dbUrl, data, count = 1, fin_freq = 1, fin_freq_type = "MONTHLY", start_date) {
    const prisma = this.getPrisma(dbUrl);
    try {
      count = parseInt(count, 10);
      fin_freq = parseInt(fin_freq, 10);

      if (isNaN(count) || count < 1) throw new Error("Count must be a positive integer");
      if (isNaN(fin_freq) || fin_freq < 1) throw new Error("Frequency must be a positive integer");
      if (!["MONTHLY", "DAILY", "WEEKLY", "YEARLY"].includes(fin_freq_type)) {
        throw new Error("Invalid frequency type");
      }

      let currentStartDate;
      try {
        currentStartDate = new Date(start_date);
        if (isNaN(currentStartDate.getTime())) throw new Error("Invalid date");
      } catch (e) {
        throw new Error("Date parsing error: " + e.message);
      }

      const transactions = [];
      for (let i = 1; i <= count; i++) {
        const dueDate = new Date(currentStartDate);
        if (fin_freq_type === "MONTHLY") {
          dueDate.setMonth(dueDate.getMonth() + fin_freq);
        } else if (fin_freq_type === "DAILY") {
          dueDate.setDate(dueDate.getDate() + fin_freq);
        } else if (fin_freq_type === "WEEKLY") {
          dueDate.setDate(dueDate.getDate() + (fin_freq * 7));
        } else if (fin_freq_type === "YEARLY") {
          dueDate.setFullYear(dueDate.getFullYear() + fin_freq);
        }

        transactions.push({
          ft_firm_id: data.ft_firm_id,
          ft_own_id: data.ft_own_id,
          ft_user_id: data.ft_user_id,
          ft_fin_id: data.ft_fin_id,
          ft_emi_no: i,
          ft_start_date: this.formatDate(currentStartDate),
          ft_due_date: this.formatDate(dueDate),
          ft_emi_amt: parseFloat(data.ft_emi_amt),
          ft_paid_amt: 0,
          ft_pending_amt: parseFloat(data.ft_emi_amt),
          ft_emi_status: "PENDING", // PENDING, PAID, DUE, etc.
          ft_add_date: new Date().toISOString().split('T')[0],
        });

        currentStartDate = new Date(dueDate);
      }

      return await prisma.finance_Transaction.createMany({
        data: transactions,
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  async delete_finance_transaction(dbUrl, fin_id) {
    const prisma = this.getPrisma(dbUrl);
    try {
      return await prisma.finance_Transaction.deleteMany({
        where: { ft_fin_id: parseInt(fin_id) },
      });
    } finally {
      await prisma.$disconnect();
    }
  }
}

module.exports = new FinanceTransactionService();
