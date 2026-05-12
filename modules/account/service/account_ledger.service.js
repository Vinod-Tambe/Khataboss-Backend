"use strict";

const { PrismaClient } = require("../../../prisma/generated/main");
const accountService = require("./account.service");

class AccountLedgerService {
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
   * Get journal transaction entries for a specific account and date range.
   */
  async get_journal_trans_entries(dbUrl, startDate, endDate, acc_id, firm_id = "N") {
    const prisma = this.getPrisma(dbUrl);
    try {
      const query = {
        jrtr_date: {
          gte: startDate,
          lte: endDate,
        },
        OR: [
          { jrtr_cr_acc_id: parseInt(acc_id) },
          { jrtr_dr_acc_id: parseInt(acc_id) },
        ],
      };

      if (firm_id !== "N" && firm_id) {
        query.jrtr_firm_id = parseInt(firm_id);
      }

      return await prisma.journalTransaction.findMany({
        where: query,
        select: {
          jrtr_id: true,
          jrtr_cr_amt: true,
          jrtr_dr_amt: true,
          jrtr_firm_id: true,
          jrtr_user_id: true,
          jrtr_crdr: true,
          jrtr_acc_info: true,
          jrtr_other_info: true,
          jrtr_date: true,
          firm: {
            select: { firm_name: true }
          }
        },
        orderBy: { jrtr_date: "asc" }
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Get aggregated journal transaction totals up to a specific date (for closing balance calculation).
   */
  async get_all_acc_journal_trans(dbUrl, endDate, firm_id, acc_id) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const where = {
        jrtr_date: { lte: endDate },
        OR: [
          { jrtr_cr_acc_id: parseInt(acc_id) },
          { jrtr_dr_acc_id: parseInt(acc_id) },
        ],
      };

      if (firm_id !== "N" && firm_id) {
        where.jrtr_firm_id = parseInt(firm_id);
      }

      const aggregates = await prisma.journalTransaction.aggregate({
        where,
        _sum: {
          jrtr_cr_amt: true,
          jrtr_dr_amt: true,
        },
      });

      return [{
        total_cr_amt: aggregates._sum.jrtr_cr_amt || 0,
        total_dr_amt: aggregates._sum.jrtr_dr_amt || 0,
      }];
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Get detailed account ledger including opening balance and transaction history.
   */
  async get_account_ledger_details(dbUrl, filters = {}) {
    // 1. Get initial opening balance from account details
    const get_acc_details = await accountService.get_acc_opening_balance(
      dbUrl,
      filters.firmId || "N",
      filters.startDate,
      filters.acc_id || "N"
    );


    const account = get_acc_details.find((a) => 
      a.acc_id === Number(filters.acc_id) || a.acc_uuid === filters.acc_id
    ) || {};
    
    const resolvedAccId = account.acc_id || filters.acc_id;
    const initial_opening_balance = parseFloat(account.acc_cash_balance || 0);
    const acc_balance_type = account.acc_balance_type || "CR";
    const acc_name = account.acc_name || "";
    const acc_pre_acc = account.acc_pre_acc || "";

    // 2. Calculate transactions sum BEFORE the start date
    const startDateObj = new Date(filters.startDate);
    const prevDateObj = new Date(startDateObj);
    prevDateObj.setDate(startDateObj.getDate() - 1);
    const get_end_date = prevDateObj.toISOString().split("T")[0];


    const previousDayClosing = await this.get_all_acc_journal_trans(
      dbUrl,
      get_end_date,
      filters.firmId,
      Number(resolvedAccId)
    );

    const total_pre_cr_amt = previousDayClosing?.[0]?.total_cr_amt || 0;
    const total_pre_dr_amt = previousDayClosing?.[0]?.total_dr_amt || 0;


    // 3. Get transactions within the selected range
    const journal_trans_data = await this.get_journal_trans_entries(
      dbUrl,
      filters.startDate,
      filters.endDate,
      resolvedAccId,
      filters.firmId
    );

    return {
      acc_open_balanace: (initial_opening_balance + total_pre_dr_amt) - total_pre_cr_amt,
      acc_balance_type: acc_balance_type,
      acc_name: acc_name,
      acc_pre_acc: acc_pre_acc,
      jurnal_trans_data: journal_trans_data || [],
    };
  }
}

module.exports = new AccountLedgerService();
