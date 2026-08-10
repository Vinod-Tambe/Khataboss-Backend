"use strict";

const accountService = require("../../account/service/account.service");
const journalTransService = require("../../trial_balance/service/journal_trans.service");

const LOAN_RECEIVABLE_NAMES = new Set([
  "SECURED LOANS",
  "UNSECURED LOANS",
  "LOANS & ADVANCES",
]);

/** Display Secured / Unsecured as separate BS lines under assets. */
function loanReceivableDisplayName(accName) {
  const name = (accName || "").trim().toUpperCase();
  if (name === "SECURED LOANS") return "Secured Loans";
  if (name === "UNSECURED LOANS") return "Unsecured Loans";
  return "Loans & Advances (Asset)";
}

class BalanceSheetService {
  /**
   * Get all balance sheet data for a given firm and date range.
   * @param {string} dbUrl
   * @param {object} filters { firmId, startDate, endDate }
   */
  async get_all_balance_sheet_data(dbUrl, filters = {}) {
    try {
      if (!filters.startDate || !filters.endDate) {
        throw new Error("Missing required filters: startDate, or endDate");
      }

      const [year, month, day] = filters.startDate.split("-").map(Number);
      const prevDay = new Date(Date.UTC(year, month - 1, day - 1));
      const get_end_date = prevDay.toISOString().split("T")[0];

      const [previousDayClosing, openingBalances, accounts, journalTransactions] =
        await Promise.all([
          journalTransService.get_all_acc_journal_trans(
            dbUrl,
            null,
            get_end_date,
            filters.firmId
          ),
          accountService.get_acc_opening_balance(
            dbUrl,
            filters.firmId || "N",
            filters.startDate
          ),
          accountService.getAccounts(dbUrl, filters.firmId),
          journalTransService.get_all_acc_journal_trans(
            dbUrl,
            filters.startDate,
            filters.endDate,
            filters.firmId
          ),
        ]);

      const accountMap = new Map(
        accounts.map((acc) => [
          acc.acc_id,
          {
            acc_name: acc.acc_name || "Unknown",
            acc_pre_acc: acc.acc_pre_acc || "Unknown",
            acc_cash_balance: parseFloat(acc.acc_cash_balance || 0),
          },
        ])
      );

      const trialBalanceMap = new Map();

      for (const acc of openingBalances) {
        const accId = Number(acc.acc_id);
        let accOpenBalance = parseFloat(acc.acc_cash_balance || 0);
        if (acc.acc_balance_type === "CR") {
          accOpenBalance = 0 - accOpenBalance;
        }
        trialBalanceMap.set(accId, {
          acc_name: acc.acc_name || "Unknown",
          acc_pre_acc: acc.acc_pre_acc,
          acc_open_balance: accOpenBalance,
          acc_id: accId,
          total_cr_amt: 0,
          total_dr_amt: 0,
          acc_balance: accOpenBalance,
        });
      }

      for (const prev of previousDayClosing) {
        const accId = Number(prev.acc_id);
        const previousPeriodBalance =
          (prev.total_dr_amt || 0) - (prev.total_cr_amt || 0);
        let entry = trialBalanceMap.get(accId);

        if (entry) {
          entry.acc_open_balance += previousPeriodBalance;
        } else {
          const account = accountMap.get(accId) || {
            acc_name: "Not found",
            acc_pre_acc: "NOF",
            acc_cash_balance: 0,
          };
          trialBalanceMap.set(accId, {
            acc_name: account.acc_name,
            acc_pre_acc: account.acc_pre_acc,
            acc_open_balance: previousPeriodBalance,
            acc_id: accId,
            total_cr_amt: 0,
            total_dr_amt: 0,
            acc_balance: previousPeriodBalance,
          });
        }
      }

      for (const journal of journalTransactions) {
        const accId = Number(journal.acc_id);
        let entry = trialBalanceMap.get(accId);

        if (!entry) {
          const account = accountMap.get(accId) || {
            acc_name: "Not found",
            acc_pre_acc: "NOF",
            acc_cash_balance: 0,
          };
          entry = {
            acc_name: account.acc_name,
            acc_pre_acc: account.acc_pre_acc,
            acc_open_balance: 0,
            acc_id: accId,
            total_cr_amt: 0,
            total_dr_amt: 0,
            acc_balance: 0,
          };
          trialBalanceMap.set(accId, entry);
        }

        entry.total_cr_amt += journal.total_cr_amt || 0;
        entry.total_dr_amt += journal.total_dr_amt || 0;
      }

      const assetsObj = {};
      const liabilitiesObj = {};

      const liabilityGroups = [
        "Capital Account",
        "Loans (Liability)",
        "Secured Loans (Liability)",
        "Unsecured Loans (Liability)",
        "Reserves & Surplus",
        "Sundry Creditors",
        "Duties & Taxes",
        "Provisions",
        "Suspense Account",
        "Branch/Divisions",
        "Current Liabilities",
      ];

      const assetGroups = [
        "Bank Accounts",
        "Cash-in-Hand",
        "Deposits (Asset)",
        "Fixed Assets",
        "Investments",
        "Loans & Advances (Asset)",
        "Secured Loans",
        "Unsecured Loans",
        "Misc. Expenses (Asset)",
        "Stock-in-Hand",
        "Sundry Debtors",
        "Current Assets",
      ];

      // Period P&L close (matches profit_loss.service period-only logic)
      let openingStock = 0;
      let closingStock = 0;
      let periodPurchases = 0;
      let periodDirectExp = 0;
      let periodSales = 0;
      let periodIndirectExp = 0;
      let periodIndirectInc = 0;

      for (const [, value] of trialBalanceMap.entries()) {
        value.acc_balance =
          value.acc_open_balance + value.total_dr_amt - value.total_cr_amt;
        const periodMovement =
          (value.total_dr_amt || 0) - (value.total_cr_amt || 0);
        const preAcc = (value.acc_pre_acc || "").trim();
        const accName = (value.acc_name || "").trim();
        const accType = preAcc.toUpperCase();
        const isLoanReceivable = LOAN_RECEIVABLE_NAMES.has(accName.toUpperCase());

        if (preAcc === "Stock-in-Hand") {
          openingStock += value.acc_open_balance;
          closingStock += value.acc_balance;
        } else if (preAcc === "Purchase Accounts" || preAcc === "Purchases") {
          periodPurchases += periodMovement;
        } else if (
          preAcc === "Direct Expenses" ||
          preAcc === "Expenses (Direct)"
        ) {
          periodDirectExp += periodMovement;
        } else if (
          preAcc === "Direct Incomes" ||
          preAcc === "Income (Direct)" ||
          preAcc === "Sales Accounts"
        ) {
          periodSales += -periodMovement;
        } else if (
          preAcc === "Indirect Expenses" ||
          preAcc === "Expenses (Indirect)"
        ) {
          periodIndirectExp += periodMovement;
        } else if (
          preAcc === "Indirect Incomes" ||
          preAcc === "Income (Indirect)"
        ) {
          periodIndirectInc += -periodMovement;
        }

        if (value.acc_balance === 0) {
          continue;
        }

        const isAssetGroup =
          isLoanReceivable ||
          assetGroups.some((g) => g.toUpperCase() === accType);
        const isLiabilityGroup =
          !isLoanReceivable &&
          liabilityGroups.some((g) => g.toUpperCase() === accType);

        // Present loan receivables as assets; keep Secured / Unsecured as separate lines
        const assetGroupName = isLoanReceivable
          ? loanReceivableDisplayName(accName)
          : value.acc_pre_acc;

        if (isAssetGroup) {
          if (value.acc_balance > 0) {
            if (!assetsObj[assetGroupName]) assetsObj[assetGroupName] = 0;
            assetsObj[assetGroupName] += value.acc_balance;
          } else {
            const groupName = `${assetGroupName} (Cr Balance)`;
            if (!liabilitiesObj[groupName]) liabilitiesObj[groupName] = 0;
            liabilitiesObj[groupName] += Math.abs(value.acc_balance);
          }
        } else if (isLiabilityGroup) {
          if (value.acc_balance < 0) {
            if (!liabilitiesObj[value.acc_pre_acc]) {
              liabilitiesObj[value.acc_pre_acc] = 0;
            }
            liabilitiesObj[value.acc_pre_acc] += Math.abs(value.acc_balance);
          } else {
            const groupName = `${value.acc_pre_acc} (Dr Balance)`;
            if (!assetsObj[groupName]) assetsObj[groupName] = 0;
            assetsObj[groupName] += value.acc_balance;
          }
        }
      }

      const tradingDebits = openingStock + periodPurchases + periodDirectExp;
      const tradingCredits = periodSales + closingStock;
      let grossProfit = 0;
      let grossLoss = 0;
      if (tradingCredits > tradingDebits) {
        grossProfit = tradingCredits - tradingDebits;
      } else {
        grossLoss = tradingDebits - tradingCredits;
      }

      const pnlCredits = grossProfit + periodIndirectInc;
      const pnlDebits = grossLoss + periodIndirectExp;
      let netProfit = 0;
      let netLoss = 0;
      if (pnlCredits > pnlDebits) {
        netProfit = pnlCredits - pnlDebits;
      } else {
        netLoss = pnlDebits - pnlCredits;
      }

      // Close current-period P&L into Balance Sheet (backend source of truth)
      if (netProfit > 0) {
        liabilitiesObj["Profit & Loss A/c"] =
          (liabilitiesObj["Profit & Loss A/c"] || 0) + netProfit;
      } else if (netLoss > 0) {
        assetsObj["Profit & Loss A/c"] =
          (assetsObj["Profit & Loss A/c"] || 0) + netLoss;
      }

      const assets = Object.entries(assetsObj).map(([key, val]) => ({
        [key]: val,
      }));
      const liabilities = Object.entries(liabilitiesObj).map(([key, val]) => ({
        [key]: val,
      }));

      return {
        assets,
        liabilities,
        netProfit,
        netLoss,
      };
    } catch (error) {
      console.error("❌ Error in get_all_balance_sheet_data:", error.message);
      throw error;
    }
  }
}

module.exports = new BalanceSheetService();
