"use strict";

const { PrismaClient } = require("../../../prisma/generated/main");
const accountService = require("../../account/service/account.service");
const userService = require("../../user/service/user.service");

class DaybookService {
  /**
   * Get the prisma client for the given tenant database URL.
   * @param {string} dbUrl 
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

  // Reusable function to format date as DD-MM-YYYY
  formatDateToDDMMYYYY(date) {
    if (!date) return "";
    let d;
    if (typeof date === "string" && date.match(/^\d{2}-\d{2}-\d{4}$/)) {
      const [day, month, year] = date.split("-");
      d = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
    } else {
      d = new Date(date);
    }
    if (isNaN(d)) return "";
    const day = String(d.getUTCDate()).padStart(2, "0");
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const year = d.getUTCFullYear();
    return `${day}-${month}-${year}`;
  }

  // Helper to resolve user name
  async getCustomerName(dbUrl, userId) {
    if (!userId) return "-";
    const name = await userService.get_user_full_name(dbUrl, userId);
    return name || "-";
  }

  // Centralized error handler
  handleError(error, title, colorClass, amtColor, isSummary = false) {
    console.error(`Error fetching ${title} data:`, error);
    return {
      title,
      colorClass,
      amtColor,
      column: isSummary
        ? ["TYPE", "CASH", "BANK", "ONLINE", "CARD"]
        : ["DATE", "FIRM", "CUSTOMER NAME", "CUST ID", "CASH", "BANK", "ONLINE", "CARD", "DISC"],
      data: [],
      error: error.message,
    };
  }

  /**
   * Map Prisma records to response format
   */
  async mapToResponse(dbUrl, item) {
    const toNumber = (value) => (parseFloat(value) || 0).toFixed(2);
    const userId = item.fin_user_id || item.fm_user_id || item.girv_user_id || "";
    const customerName = await this.getCustomerName(dbUrl, userId);

    return {
      db_date: this.formatDateToDDMMYYYY(item.fin_start_date || item.fm_trans_date || item.girv_start_date),
      db_firm: item.firm?.firm_name || item.finance?.firm?.firm_name || "-",
      db_customer_name: customerName,
      db_cust_id: `C${userId}`,
      db_user_id: userId,
      db_user_uuid: item.user?.user_uuid || "",
      db_cash_amt: toNumber(item.fin_cash_amt || item.fm_cash_amt || item.girv_cash_amt),
      db_bank_amt: toNumber(item.fin_bank_amt || item.fm_bank_amt || item.girv_bank_amt),
      db_online_amt: toNumber(item.fin_online_amt || item.fm_online_amt || item.girv_online_amt),
      db_card_amt: toNumber(item.fin_card_amt || item.fm_card_amt || item.girv_card_amt),
      db_disc_amt: (0).toFixed(2),
    };
  }

  async get_add_new_finance_data(dbUrl, filters = {}) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const where = { fin_is_deleted: false };
      if (filters.firmId) {
        where.fin_firm_id = parseInt(filters.firmId);
      }
      if (filters.startDate || filters.endDate) {
        where.fin_start_date = {};
        if (filters.startDate) where.fin_start_date.gte = filters.startDate;
        if (filters.endDate) where.fin_start_date.lte = filters.endDate;
      }

      const financeRecords = await prisma.finance.findMany({
        where,
        select: {
          fin_start_date: true,
          fin_firm_id: true,
          fin_user_id: true,
          fin_cash_amt: true,
          fin_bank_amt: true,
          fin_online_amt: true,
          fin_card_amt: true,
          user: {
            select: { user_uuid: true }
          },
          firm: {
            select: { firm_name: true }
          }
        },
      });

      if (financeRecords.length === 0) return 0;

      const data = await Promise.all(
        financeRecords.map((item) => this.mapToResponse(dbUrl, item))
      );

      return {
        title: "FINANCE ADDED",
        colorClass: "bg-green",
        amtColor: "text-danger",
        column: ["DATE", "FIRM", "CUSTOMER NAME", "CUST ID", "CASH", "BANK", "ONLINE", "CARD", "DISC"],
        data,
      };
    } catch (error) {
      return this.handleError(error, "FINANCE ADDED", "bg-green", "text-danger");
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Fetch girvi added data
   */
  async get_add_new_girvi_data(dbUrl, filters = {}) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const where = { girv_is_deleted: false };
      if (filters.firmId) {
        where.girv_firm_id = parseInt(filters.firmId);
      }
      if (filters.startDate || filters.endDate) {
        where.girv_start_date = {};
        if (filters.startDate) where.girv_start_date.gte = filters.startDate;
        if (filters.endDate) where.girv_start_date.lte = filters.endDate;
      }

      const girviRecords = await prisma.girvi.findMany({
        where,
        select: {
          girv_start_date: true,
          girv_firm_id: true,
          girv_user_id: true,
          girv_cash_amt: true,
          girv_bank_amt: true,
          girv_online_amt: true,
          girv_card_amt: true,
          user: {
            select: { user_uuid: true }
          },
          firm: {
            select: { firm_name: true }
          }
        },
      });

      if (girviRecords.length === 0) return 0;

      const data = await Promise.all(
        girviRecords.map((item) => this.mapToResponse(dbUrl, item))
      );

      return {
        title: "LOAN ADDED",
        colorClass: "bg-purple",
        amtColor: "text-danger",
        column: ["DATE", "FIRM", "CUSTOMER NAME", "CUST ID", "CASH", "BANK", "ONLINE", "CARD", "DISC"],
        data,
      };
    } catch (error) {
      return this.handleError(error, "LOAN ADDED", "bg-purple", "text-danger");
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Fetch EMI transaction data (PAID or ROLLBACK)
   */
  async get_finance_emi_data(dbUrl, type, title, colorClass, amtColor, filters = {}) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const where = {
        fm_trans_type: type,
        fm_is_deleted: false
      };
      if (filters.firmId) {
        where.fm_firm_id = parseInt(filters.firmId);
      }
      if (filters.startDate || filters.endDate) {
        where.fm_trans_date = {};
        if (filters.startDate) where.fm_trans_date.gte = filters.startDate;
        if (filters.endDate) where.fm_trans_date.lte = filters.endDate;
      }

      const records = await prisma.finance_Money_Transaction.findMany({
        where,
        select: {
          fm_trans_date: true,
          fm_firm_id: true,
          fm_user_id: true,
          fm_cash_amt: true,
          fm_bank_amt: true,
          fm_online_amt: true,
          fm_card_amt: true,
          user: {
            select: { user_uuid: true }
          },
          firm: {
            select: { firm_name: true }
          },
          finance: {
            select: {
              firm: {
                select: { firm_name: true }
              }
            }
          }
        },
      });

      if (records.length === 0) return 0;

      const data = await Promise.all(
        records.map((item) => this.mapToResponse(dbUrl, item))
      );

      return {
        title,
        colorClass,
        amtColor,
        column: ["DATE", "FIRM", "CUSTOMER NAME", "CUST ID", "CASH", "BANK", "ONLINE", "CARD", "DISC"],
        data,
      };
    } catch (error) {
      return this.handleError(error, title, colorClass, amtColor);
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Calculate Daybook Summary (Opening Balance)
   */
  async get_day_book_summary(dbUrl, filters = {}) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const firmId = filters.firmId ? parseInt(filters.firmId) : null;
      const startDate = filters.startDate || null;

      // 1. Finance Added (Outflow) Aggregation
      // Since fin_cash_amt is String, we fetch and sum in JS
      const financeAdded = await prisma.finance.findMany({
        where: {
          fin_is_deleted: false,
          ...(firmId && { fin_firm_id: firmId }),
          ...(startDate && { fin_start_date: { lt: startDate } }),
        },
        select: {
          fin_cash_amt: true,
          fin_bank_amt: true,
          fin_online_amt: true,
          fin_card_amt: true,
        },
      });

      const sumFinance = financeAdded.reduce(
        (acc, item) => ({
          cash: acc.cash + (parseFloat(item.fin_cash_amt) || 0),
          bank: acc.bank + (parseFloat(item.fin_bank_amt) || 0),
          online: acc.online + (parseFloat(item.fin_online_amt) || 0),
          card: acc.card + (parseFloat(item.fin_card_amt) || 0),
        }),
        { cash: 0, bank: 0, online: 0, card: 0 }
      );

      // 1b. Girvi Added (Outflow) Aggregation
      const girviAdded = await prisma.girvi.findMany({
        where: {
          girv_is_deleted: false,
          ...(firmId && { girv_firm_id: firmId }),
          ...(startDate && { girv_start_date: { lt: startDate } }),
        },
        select: {
          girv_cash_amt: true,
          girv_bank_amt: true,
          girv_online_amt: true,
          girv_card_amt: true,
        },
      });

      const sumGirvi = girviAdded.reduce(
        (acc, item) => ({
          cash: acc.cash + (parseFloat(item.girv_cash_amt) || 0),
          bank: acc.bank + (parseFloat(item.girv_bank_amt) || 0),
          online: acc.online + (parseFloat(item.girv_online_amt) || 0),
          card: acc.card + (parseFloat(item.girv_card_amt) || 0),
        }),
        { cash: 0, bank: 0, online: 0, card: 0 }
      );

      // 2. EMI Paid (Inflow) Aggregation
      const emiPaid = await prisma.finance_Money_Transaction.aggregate({
        where: {
          fm_trans_type: "PAID",
          fm_is_deleted: false,
          ...(firmId && { fm_firm_id: firmId }),
          ...(startDate && { fm_trans_date: { lt: startDate } }),
        },
        _sum: {
          fm_cash_amt: true,
          fm_bank_amt: true,
          fm_online_amt: true,
          fm_card_amt: true,
        },
      });

      // 3. EMI Rollback (Outflow) Aggregation
      const emiRollback = await prisma.finance_Money_Transaction.aggregate({
        where: {
          fm_trans_type: "ROLLBACK",
          fm_is_deleted: false,
          ...(firmId && { fm_firm_id: firmId }),
          ...(startDate && { fm_trans_date: { lt: startDate } }),
        },
        _sum: {
          fm_cash_amt: true,
          fm_bank_amt: true,
          fm_online_amt: true,
          fm_card_amt: true,
        },
      });

      // 4. Account Opening Balances
      const all_opening_balances = await accountService.get_acc_opening_balance(
        dbUrl,
        (filters.firmId && filters.firmId !== "") ? filters.firmId : "N",
        filters.startDate || new Date().toISOString().split("T")[0]
      );

      const acc_cash_open = parseFloat(all_opening_balances.find(a => a.acc_name === "Cash In Hand")?.acc_cash_balance || 0);
      const acc_bank_open = parseFloat(all_opening_balances.find(a => a.acc_name === "Bank Account")?.acc_cash_balance || 0);
      const acc_online_open = parseFloat(all_opening_balances.find(a => a.acc_name === "Online Account")?.acc_cash_balance || 0);
      const acc_card_open = parseFloat(all_opening_balances.find(a => a.acc_name === "Card Account")?.acc_cash_balance || 0);

      const toNumber = (val) => (parseFloat(val) || 0).toFixed(2);

      // Formula: Opening = Acc_Opening + PAID - (ADDED + ROLLBACK)
      const cash_open = toNumber(acc_cash_open + (emiPaid._sum.fm_cash_amt || 0) - (sumFinance.cash + sumGirvi.cash + (emiRollback._sum.fm_cash_amt || 0)));
      const bank_open = toNumber(acc_bank_open + (emiPaid._sum.fm_bank_amt || 0) - (sumFinance.bank + sumGirvi.bank + (emiRollback._sum.fm_bank_amt || 0)));
      const online_open = toNumber(acc_online_open + (emiPaid._sum.fm_online_amt || 0) - (sumFinance.online + sumGirvi.online + (emiRollback._sum.fm_online_amt || 0)));
      const card_open = toNumber(acc_card_open + (emiPaid._sum.fm_card_amt || 0) - (sumFinance.card + sumGirvi.card + (emiRollback._sum.fm_card_amt || 0)));

      const total_open = toNumber(parseFloat(cash_open) + parseFloat(bank_open) + parseFloat(online_open) + parseFloat(card_open));

      return {
        type: "OPENING BALANCE",
        total_cash_amt: cash_open,
        total_bank_amt: bank_open,
        total_online_amt: online_open,
        total_card_amt: card_open,
        total_open_amt: total_open,
      };
    } catch (error) {
      return this.handleError(error, "DAYBOOK SUMMARY", "bg-purple", "text-primary", true);
    } finally {
      await prisma.$disconnect();
    }
  }

  async get_all_daybook_data(dbUrl, filters = {}) {
    try {
      const [financeData, girviData, paidEmiData, rollbackEmiData, summaryData] = await Promise.all([
        this.get_add_new_finance_data(dbUrl, filters),
        this.get_add_new_girvi_data(dbUrl, filters),
        this.get_finance_emi_data(dbUrl, "PAID", "FINANCE EMI DEPOSIT", "bg-red", "text-success", filters),
        this.get_finance_emi_data(dbUrl, "ROLLBACK", "FINANCE EMI ROLLBACK", "bg-blue", "text-danger", filters),
        this.get_day_book_summary(dbUrl, filters),
      ]);

      const response_arr = [];
      if (financeData !== 0) response_arr.push(financeData);
      if (girviData !== 0) response_arr.push(girviData);
      if (paidEmiData !== 0) response_arr.push(paidEmiData);
      if (rollbackEmiData !== 0) response_arr.push(rollbackEmiData);

      return { daybook_data: response_arr, summary: summaryData };
    } catch (error) {
      console.error("Error combining daybook data:", error);
      return { daybook_data: [], summary: {} };
    }
  }
}

module.exports = new DaybookService();
