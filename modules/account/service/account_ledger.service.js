"use strict";

const { getTenantPrisma } = require("../../../utils/tenantPrisma");
const accountService = require("./account.service");
const {
  collectReferenceIds,
  loadReferenceMaps,
  humanizeJournalNarration,
} = require("../../../utils/journalNarration");

class AccountLedgerService {
  /**
   * Get the prisma client for the given tenant database URL.
   */
  getPrisma(dbUrl) {
    return getTenantPrisma(dbUrl);
  }

  /**
   * Base filters shared by ledger journal queries (exclude soft-deleted rows).
   */
  baseJournalWhere(acc_id, extra = {}) {
    const parsedAccId = parseInt(acc_id, 10);
    return {
      jrtr_is_deleted: false,
      journal: { jrnl_is_deleted: false },
      OR: [
        { jrtr_cr_acc_id: parsedAccId },
        { jrtr_dr_acc_id: parsedAccId },
      ],
      ...extra,
    };
  }

  /**
   * Day before startDate using UTC (aligned with Trial Balance / P&L).
   */
  getPreviousDayDate(startDate) {
    const [year, month, day] = startDate.split("-").map(Number);
    const prevDay = new Date(Date.UTC(year, month - 1, day - 1));
    return prevDay.toISOString().split("T")[0];
  }

  /**
   * Get journal transaction entries for a specific account and date range.
   */
  async get_journal_trans_entries(dbUrl, startDate, endDate, acc_id, firm_id = "N") {
    const prisma = this.getPrisma(dbUrl);

      const query = this.baseJournalWhere(acc_id, {
        jrtr_date: {
          gte: startDate,
          lte: endDate,
        },
      });

      if (firm_id !== "N" && firm_id) {
        query.jrtr_firm_id = parseInt(firm_id, 10);
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
            select: { firm_name: true },
          },
        },
        orderBy: [{ jrtr_date: "asc" }, { jrtr_id: "asc" }],
      });
    
  }

  /**
   * Get aggregated journal transaction totals up to a specific date (for closing balance calculation).
   */
  async get_all_acc_journal_trans(dbUrl, endDate, firm_id, acc_id) {
    const prisma = this.getPrisma(dbUrl);

      const where = this.baseJournalWhere(acc_id, {
        jrtr_date: { lte: endDate },
      });

      if (firm_id !== "N" && firm_id) {
        where.jrtr_firm_id = parseInt(firm_id, 10);
      }

      const rows = await prisma.journalTransaction.findMany({
        where,
        select: {
          jrtr_cr_acc_id: true,
          jrtr_dr_acc_id: true,
          jrtr_cr_amt: true,
          jrtr_dr_amt: true,
        },
      });

      const parsedAccId = parseInt(acc_id, 10);
      let total_cr_amt = 0;
      let total_dr_amt = 0;

      for (const item of rows) {
        if (item.jrtr_cr_acc_id === parsedAccId) {
          total_cr_amt += parseFloat(item.jrtr_cr_amt || 0);
        }
        if (item.jrtr_dr_acc_id === parsedAccId) {
          total_dr_amt += parseFloat(item.jrtr_dr_amt || 0);
        }
      }

      return [{ total_cr_amt, total_dr_amt }];
    
  }

  /**
   * Attach user-friendly display_details to each journal line.
   */
  async enrichJournalLines(dbUrl, journalLines = []) {
    if (!journalLines.length) return journalLines;

    const narrationTexts = journalLines.flatMap((t) =>
      [t.jrtr_acc_info, t.jrtr_other_info].filter(Boolean)
    );
    const { girviIds, finIds } = collectReferenceIds(narrationTexts);

    const prisma = this.getPrisma(dbUrl);

      const refMaps = await loadReferenceMaps(prisma, girviIds, finIds);
      const humanize = (text) => humanizeJournalNarration(text, refMaps);

      return journalLines.map((t) => {
        const rawDetails = (t.jrtr_acc_info || t.jrtr_other_info || "").trim();
        return {
          ...t,
          display_details: humanize(rawDetails),
        };
      });
    
  }

  /**
   * Get detailed account ledger including opening balance and transaction history.
   */
  async get_account_ledger_details(dbUrl, filters = {}) {
    if (!filters.acc_id) {
      throw new Error("Account id is required");
    }

    // 1. Get initial opening balance from account details
    const get_acc_details = await accountService.get_acc_opening_balance(
      dbUrl,
      filters.firmId || "N",
      filters.startDate,
      filters.acc_id || "N"
    );

    const account =
      get_acc_details.find(
        (a) =>
          a.acc_id === Number(filters.acc_id) || a.acc_uuid === filters.acc_id
      ) || {};

    if (!account.acc_id) {
      throw new Error("Account not found");
    }

    const resolvedAccId = account.acc_id;
    const initial_opening_balance = parseFloat(account.acc_cash_balance || 0);
    const acc_balance_type = account.acc_balance_type || "CR";
    const acc_name = account.acc_name || "";
    const acc_pre_acc = account.acc_pre_acc || "";

    // 2. Calculate transactions sum BEFORE the start date (UTC-safe)
    const get_end_date = this.getPreviousDayDate(filters.startDate);

    const previousDayClosing = await this.get_all_acc_journal_trans(
      dbUrl,
      get_end_date,
      filters.firmId,
      resolvedAccId
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

    const enrichedJournalData = await this.enrichJournalLines(
      dbUrl,
      journal_trans_data || []
    );

    // Calculate opening balance at start date in credit-oriented terms (CR positive, DR negative)
    let signed_initial_opening_balance = initial_opening_balance;
    if (acc_balance_type === "DR") {
      signed_initial_opening_balance = -initial_opening_balance;
    }
    const acc_open_balanace =
      signed_initial_opening_balance + total_pre_cr_amt - total_pre_dr_amt;

    return {
      acc_id: resolvedAccId,
      acc_open_balanace: acc_open_balanace,
      acc_balance_type: acc_balance_type,
      acc_name: acc_name,
      acc_pre_acc: acc_pre_acc,
      jurnal_trans_data: enrichedJournalData,
    };
  }
}

module.exports = new AccountLedgerService();
