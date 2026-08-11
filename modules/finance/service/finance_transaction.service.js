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
   * Create finance transactions (EMIs).
   * Last EMI absorbs rounding so schedule total equals receivable.
   */
  async create_finance_transaction(
    dbUrl,
    data,
    count = 1,
    fin_freq = 1,
    fin_freq_type = "MONTHLY",
    start_date,
    totalReceivable = null
  ) {
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

      const baseEmi = Math.round(parseFloat(data.ft_emi_amt) || 0);
      const receivable =
        totalReceivable != null
          ? parseFloat(totalReceivable)
          : parseFloat((baseEmi * count).toFixed(2));

      const transactions = [];
      let allocated = 0;
      for (let i = 1; i <= count; i++) {
        const dueDate = new Date(currentStartDate);
        if (fin_freq_type === "MONTHLY") {
          dueDate.setMonth(dueDate.getMonth() + fin_freq);
        } else if (fin_freq_type === "DAILY") {
          dueDate.setDate(dueDate.getDate() + fin_freq);
        } else if (fin_freq_type === "WEEKLY") {
          dueDate.setDate(dueDate.getDate() + fin_freq * 7);
        } else if (fin_freq_type === "YEARLY") {
          dueDate.setFullYear(dueDate.getFullYear() + fin_freq);
        }

        let emiAmt;
        if (i === count) {
          emiAmt = parseFloat((receivable - allocated).toFixed(2));
        } else {
          emiAmt = baseEmi;
          allocated = parseFloat((allocated + emiAmt).toFixed(2));
        }

        transactions.push({
          ft_firm_id: data.ft_firm_id,
          ft_own_id: data.ft_own_id,
          ft_user_id: data.ft_user_id,
          ft_fin_id: data.ft_fin_id,
          ft_emi_no: i,
          ft_start_date: this.formatDate(currentStartDate),
          ft_due_date: this.formatDate(dueDate),
          ft_emi_amt: emiAmt,
          ft_paid_amt: 0,
          ft_pending_amt: emiAmt,
          ft_emi_status: "PENDING",
          ft_add_date: new Date().toISOString().split("T")[0],
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

  /**
   * Mark overdue PENDING EMIs as DUE (due date before today, still pending).
   * Optional fin_id / firmId scope for details vs list/collection refresh.
   */
  async mark_overdue_emis_due(dbUrl, fin_id = null, asOfDate = null, firmId = null) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const today = asOfDate || new Date().toISOString().split("T")[0];
      const where = {
        ft_emi_status: "PENDING",
        ft_pending_amt: { gt: 0 },
        ft_due_date: { lt: today },
      };
      if (fin_id) {
        where.ft_fin_id = parseInt(fin_id, 10);
      }
      if (firmId && firmId !== "all") {
        where.ft_firm_id = parseInt(firmId, 10);
      }
      return await prisma.finance_Transaction.updateMany({
        where,
        data: { ft_emi_status: "DUE" },
      });
    } finally {
      await prisma.$disconnect();
    }
  }
}

module.exports = new FinanceTransactionService();
