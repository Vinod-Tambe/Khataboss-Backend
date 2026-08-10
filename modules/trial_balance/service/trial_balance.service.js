"use strict";

const accountService = require("../../account/service/account.service");
const journalTransService = require("./journal_trans.service");

class TrialBalanceService {
  /**
   * Get all trial balance data for a given firm and date range.
   * @param {string} dbUrl 
   * @param {object} filters { firmId, startDate, endDate }
   */
  async get_all_trial_balance_data(dbUrl, filters = {}) {
    try {
      // Validate inputs
      if (!filters.startDate || !filters.endDate) {
        throw new Error("Missing required filters: startDate, or endDate");
      }

      // Previous day in a timezone-independent way (aligned with P&L / Balance Sheet)
      const [year, month, day] = filters.startDate.split("-").map(Number);
      const prevDay = new Date(Date.UTC(year, month - 1, day - 1));
      const get_end_date = prevDay.toISOString().split("T")[0];

      // Fetch data concurrently
      const [previousDayClosing, openingBalances, accounts, journalTransactions] =
        await Promise.all([
          journalTransService.get_all_acc_journal_trans(dbUrl, null, get_end_date, filters.firmId),
          accountService.get_acc_opening_balance(dbUrl, filters.firmId || "N", filters.startDate),
          accountService.getAccounts(dbUrl, filters.firmId),
          journalTransService.get_all_acc_journal_trans(dbUrl, filters.startDate, filters.endDate, filters.firmId),
        ]);

      // Create a Map for accounts lookup
      const accountMap = new Map(
        accounts.map((acc) => [
          acc.acc_id,
          {
            acc_name: acc.acc_name || "Unknown",
            acc_uuid: acc.acc_uuid,
            acc_cash_balance: parseFloat(acc.acc_cash_balance || 0),
          },
        ])
      );

      // Initialize trial balance Map for efficient updates
      const trialBalanceMap = new Map();

      // Process opening balances from account masters
      for (const acc of openingBalances) {
        const accId = Number(acc.acc_id);
        let accOpenBalance = parseFloat(acc.acc_cash_balance || 0);
        if (acc.acc_balance_type === "CR") {
          accOpenBalance = 0 - accOpenBalance;
        }
        trialBalanceMap.set(accId, {
          acc_id: accId,
          acc_uuid: acc.acc_uuid,
          acc_name: acc.acc_name || "Unknown",
          acc_open_balance: accOpenBalance,
          total_cr_amt: 0,
          total_dr_amt: 0,
          acc_close_balance: accOpenBalance,
        });
      }

      // Process previous day's closing balances as additional opening balance
      for (const prev of previousDayClosing) {
        const accId = Number(prev.acc_id);
        const previousPeriodBalance = (prev.total_dr_amt || 0) - (prev.total_cr_amt || 0);
        let entry = trialBalanceMap.get(accId);

        if (entry) {
          entry.acc_open_balance += previousPeriodBalance;
        } else {
          const account = accountMap.get(accId) || { acc_name: "Not found", acc_cash_balance: 0 };
          trialBalanceMap.set(accId, {
            acc_id: accId,
            acc_uuid: account.acc_uuid,
            acc_name: account.acc_name,
            acc_open_balance: previousPeriodBalance,
            total_cr_amt: 0,
            total_dr_amt: 0,
            acc_close_balance: previousPeriodBalance,
          });
        }
      }

      // Process journal transactions for the current period
      for (const journal of journalTransactions) {
        const accId = Number(journal.acc_id);
        let entry = trialBalanceMap.get(accId);

        if (!entry) {
          const account = accountMap.get(accId) || { acc_name: "Not found", acc_cash_balance: 0 };
          entry = {
            acc_id: accId,
            acc_uuid: account.acc_uuid,
            acc_name: account.acc_name,
            acc_open_balance: 0,
            total_cr_amt: 0,
            total_dr_amt: 0,
            acc_close_balance: 0,
          };
          trialBalanceMap.set(accId, entry);
        }

        entry.total_cr_amt += journal.total_cr_amt || 0;
        entry.total_dr_amt += journal.total_dr_amt || 0;
      }

      // Final calculations and filtering
      for (const [key, value] of trialBalanceMap.entries()) {
        // Calculate Closing Balance: Opening + Debit - Credit
        value.acc_close_balance = value.acc_open_balance + value.total_dr_amt - value.total_cr_amt;
        
        // Filter out entries with all zeros
        if (
          value.acc_open_balance === 0 &&
          value.total_cr_amt === 0 &&
          value.total_dr_amt === 0 &&
          value.acc_close_balance === 0
        ) {
          trialBalanceMap.delete(key);
        }
      }

      return Array.from(trialBalanceMap.values());
    } catch (error) {
      console.error("❌ Error in get_all_trial_balance_data:", error.message);
      throw error;
    }
  }
}

module.exports = new TrialBalanceService();
