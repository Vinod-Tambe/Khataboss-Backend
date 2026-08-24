"use strict";

const accountService = require("../../account/service/account.service");
const journalTransService = require("../../trial_balance/service/journal_trans.service");
const { formatIndirectIncomesForPnl, splitInterestRecJournalLines, applyLegacyInterestRecSplit, INCOME_ACCOUNT_TYPES } = require("../../../utils/incomeAccounts");
const {
  buildScheduleIIIOtherIncome,
  buildComplianceMeta,
  summariseGstPayables,
  ensureComplianceAccounts,
} = require("../../../utils/indianCompliance");
const { getTenantPrisma } = require("../../../utils/tenantPrisma");

class ProfitLossService {
  /**
   * Get all profit and loss data for a given firm and date range.
   * @param {string} dbUrl 
   * @param {object} filters { firmId, startDate, endDate }
   */
  async get_profit_loss_data(dbUrl, filters = {}) {
    try {
      // Validate inputs
      if (!filters.startDate || !filters.endDate) {
        throw new Error("Missing required filters: startDate, or endDate");
      }

      // Calculate previous day for startDate in a timezone-independent way
      const [year, month, day] = filters.startDate.split("-").map(Number);
      const prevDay = new Date(Date.UTC(year, month - 1, day - 1));
      const get_end_date = prevDay.toISOString().split("T")[0];

      // Fetch data concurrently
      const [previousDayClosing, openingBalances, accounts, journalTransactions] = await Promise.all([
        journalTransService.get_all_acc_journal_trans(dbUrl, null, get_end_date, filters.firmId),
        accountService.get_acc_opening_balance(dbUrl, filters.firmId || "N", filters.startDate),
        accountService.getAccounts(dbUrl, filters.firmId),
        journalTransService.get_all_acc_journal_trans(dbUrl, filters.startDate, filters.endDate, filters.firmId)
      ]);

      // Create a Map for accounts lookup
      const accountMap = new Map(
        accounts.map(acc => [acc.acc_id, {
          acc_name: acc.acc_name || 'Unknown',
          acc_pre_acc: acc.acc_pre_acc || 'Unknown',
          acc_cash_balance: parseFloat(acc.acc_cash_balance || 0)
        }])
      );

      // Initialize trial balance Map for efficient updates
      const trialBalanceMap = new Map();

      // Process opening balances from account masters
      for (const acc of openingBalances) {
        const accId = Number(acc.acc_id);
        let accOpenBalance = parseFloat(acc.acc_cash_balance || 0);
        if (acc.acc_balance_type === 'CR') {
          accOpenBalance = 0 - accOpenBalance;
        }
        trialBalanceMap.set(accId, {
          acc_name: acc.acc_name || 'Unknown',
          acc_pre_acc: acc.acc_pre_acc,
          acc_open_balance: accOpenBalance,
          acc_id: accId,
          total_cr_amt: 0,
          total_dr_amt: 0,
          acc_balance: accOpenBalance
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
          const account = accountMap.get(accId) || { acc_name: 'Not found', acc_pre_acc: 'NOF', acc_cash_balance: 0 };
          trialBalanceMap.set(accId, {
            acc_name: account.acc_name,
            acc_pre_acc: account.acc_pre_acc,
            acc_open_balance: previousPeriodBalance,
            acc_id: accId,
            total_cr_amt: 0,
            total_dr_amt: 0,
            acc_balance: previousPeriodBalance
          });
        }
      }

      // Process journal transactions for the current period
      for (const journal of journalTransactions) {
        const accId = Number(journal.acc_id);
        let entry = trialBalanceMap.get(accId);

        if (!entry) {
          const account = accountMap.get(accId) || { acc_name: 'Not found', acc_pre_acc: 'NOF', acc_cash_balance: 0 };
          entry = {
            acc_name: account.acc_name,
            acc_pre_acc: account.acc_pre_acc,
            acc_open_balance: 0,
            acc_id: accId,
            total_cr_amt: 0,
            total_dr_amt: 0,
            acc_balance: 0
          };
          trialBalanceMap.set(accId, entry);
        }

        entry.total_cr_amt += journal.total_cr_amt || 0;
        entry.total_dr_amt += journal.total_dr_amt || 0;
      }

      // Collections for report segments
      let openingStock = 0;
      let closingStock = 0;

      const purchasesList = [];
      const directExpensesList = [];
      const salesList = [];
      const indirectExpensesList = [];
      const indirectIncomesList = [];

      let openingCapital = 0;
      let additions = 0;
      let drawings = 0;

      // Stock = open/close (cumulative). Trading & P&L lines = period movement only.
      for (const [accId, entry] of trialBalanceMap.entries()) {
        entry.acc_balance = entry.acc_open_balance + entry.total_dr_amt - entry.total_cr_amt;
        const periodMovement = (entry.total_dr_amt || 0) - (entry.total_cr_amt || 0);

        const preAcc = (entry.acc_pre_acc || "").trim();
        const accName = entry.acc_name || "Unknown";

        if (preAcc === "Stock-in-Hand") {
          openingStock += entry.acc_open_balance;
          closingStock += entry.acc_balance;
        } else if (preAcc === "Purchase Accounts" || preAcc === "Purchases") {
          if (periodMovement !== 0) {
            purchasesList.push({ item: accName, amount: periodMovement });
          }
        } else if (preAcc === "Direct Expenses" || preAcc === "Expenses (Direct)") {
          if (periodMovement !== 0) {
            directExpensesList.push({ item: accName, amount: periodMovement });
          }
        } else if (preAcc === "Direct Incomes" || preAcc === "Income (Direct)" || preAcc === "Sales Accounts") {
          if (periodMovement !== 0) {
            salesList.push({ item: accName, amount: -periodMovement });
          }
        } else if (preAcc === "Indirect Expenses" || preAcc === "Expenses (Indirect)") {
          if (periodMovement !== 0) {
            indirectExpensesList.push({ item: accName, amount: periodMovement });
          }
        } else if (preAcc === "Indirect Incomes" || preAcc === "Income (Indirect)") {
          if (periodMovement !== 0) {
            indirectIncomesList.push({ item: accName, amount: -periodMovement });
          }
        } else if (preAcc === "Capital Account") {
          openingCapital += -entry.acc_open_balance;
          drawings += entry.total_dr_amt;
          additions += entry.total_cr_amt;
        }
      }

      // 1. Trading Account Calculations
      const totalPurchases = purchasesList.reduce((sum, p) => sum + p.amount, 0);
      const totalDirectExpenses = directExpensesList.reduce((sum, d) => sum + d.amount, 0);
      const totalSales = salesList.reduce((sum, s) => sum + s.amount, 0);

      const tradingDebits = openingStock + totalPurchases + totalDirectExpenses;
      const tradingCredits = totalSales + closingStock;

      let grossProfit = 0;
      let grossLoss = 0;

      if (tradingCredits > tradingDebits) {
        grossProfit = tradingCredits - tradingDebits;
      } else {
        grossLoss = tradingDebits - tradingCredits;
      }

      const tradingTotalExpenditure = tradingDebits + grossProfit;
      const tradingTotalRevenue = tradingCredits + grossLoss;

      // 2. Profit & Loss Account Calculations
      const totalIndirectExpenses = indirectExpensesList.reduce((sum, i) => sum + i.amount, 0);
      const totalIndirectIncomes = indirectIncomesList.reduce((sum, ii) => sum + ii.amount, 0);

      const pnlDebits = grossLoss + totalIndirectExpenses;
      const pnlCredits = grossProfit + totalIndirectIncomes;

      let netProfit = 0;
      let netLoss = 0;

      if (pnlCredits > pnlDebits) {
        netProfit = pnlCredits - pnlDebits;
      } else {
        netLoss = pnlDebits - pnlCredits;
      }

      const pnlTotalExpenditure = pnlDebits + netProfit;
      const pnlTotalRevenue = pnlCredits + netLoss;

      // Split legacy Interest Rec lines so Processing Amount shows separately on P&L
      let interestRecAccId = null;
      for (const [accId, entry] of trialBalanceMap.entries()) {
        const name = (entry.acc_name || "").trim().toLowerCase();
        if (name === INCOME_ACCOUNT_TYPES.INTEREST.acc_name.toLowerCase()) {
          interestRecAccId = accId;
          break;
        }
      }

      let adjustedIndirectIncomes = indirectIncomesList;
      if (interestRecAccId) {
        const interestRecLines = await journalTransService.get_journal_lines_for_accounts(
          dbUrl,
          filters.startDate,
          filters.endDate,
          filters.firmId,
          [interestRecAccId]
        );
        const splits = splitInterestRecJournalLines(interestRecLines, interestRecAccId);
        adjustedIndirectIncomes = applyLegacyInterestRecSplit(indirectIncomesList, splits);
      }

      const formattedIndirectIncomes = formatIndirectIncomesForPnl(adjustedIndirectIncomes);
      const scheduleIII = buildScheduleIIIOtherIncome(formattedIndirectIncomes);
      const gstSummary = summariseGstPayables(trialBalanceMap, accountMap);

      let firm = null;
      if (filters.firmId && filters.firmId !== "N") {
        const prisma = getTenantPrisma(dbUrl);
        try {
          firm = await prisma.firm.findFirst({
            where: {
              firm_id: parseInt(filters.firmId, 10),
              firm_is_deleted: false,
            },
            select: {
              firm_id: true,
              firm_name: true,
              firm_gstin_no: true,
              firm_pan_no: true,
              firm_own_id: true,
            },
          });
          if (firm) {
            await ensureComplianceAccounts(
              prisma,
              firm.firm_id,
              firm.firm_own_id || 1
            );
          }
        } finally {
          await prisma.$disconnect();
        }
      }

      const compliance = buildComplianceMeta({
        firm,
        startDate: filters.startDate,
        endDate: filters.endDate,
        gstSummary,
      });

      // 3. Capital Account Calculations
      const closingCapital = openingCapital + additions + netProfit - netLoss - drawings;

      return {
        tradingAccount: {
          expenditure: [
            { item: "Opening Stock", amount: openingStock },
            ...purchasesList,
            ...directExpensesList
          ],
          revenue: [
            ...salesList,
            { item: "Closing Stock", amount: closingStock }
          ],
          grossProfit,
          grossLoss,
          totalExpenditure: tradingTotalExpenditure,
          totalRevenue: tradingTotalRevenue
        },
        profitLossAccount: {
          expenditure: [
            ...indirectExpensesList
          ],
          revenue: [
            ...formattedIndirectIncomes
          ],
          netProfit,
          netLoss,
          totalExpenditure: pnlTotalExpenditure,
          totalRevenue: pnlTotalRevenue
        },
        capitalAccount: {
          openingCapital,
          additions,
          drawings,
          netProfit,
          netLoss,
          closingCapital
        },
        scheduleIII,
        compliance,
      };
    } catch (error) {
      console.error('❌ Error in get_profit_loss_data:', error.message);
      throw error;
    }
  }
}

module.exports = new ProfitLossService();
