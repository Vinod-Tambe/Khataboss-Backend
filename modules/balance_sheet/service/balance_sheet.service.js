"use strict";

const accountService = require("../../account/service/account.service");
const journalTransService = require("../../trial_balance/service/journal_trans.service");

class BalanceSheetService {
    /**
     * Get all balance sheet data for a given firm and date range.
     * @param {string} dbUrl 
     * @param {object} filters { firmId, startDate, endDate }
     */
    async get_all_balance_sheet_data(dbUrl, filters = {}) {
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
                "Current Liabilities"
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
                "Current Assets"
            ];

            // Convert Map to aggregated objects
            for (const [key, value] of trialBalanceMap.entries()) {
                value.acc_balance = value.acc_open_balance + value.total_dr_amt - value.total_cr_amt;
                
                if (value.acc_balance === 0) {
                    continue;
                }

                const accType = (value.acc_pre_acc || "").toUpperCase().trim();
                const isAssetGroup = assetGroups.some(g => g.toUpperCase() === accType);
                const isLiabilityGroup = liabilityGroups.some(g => g.toUpperCase() === accType);

                if (isAssetGroup) {
                    // Positive balance is an Asset, Negative is a Liability (e.g. Bank OD)
                    if (value.acc_balance > 0) {
                        if (!assetsObj[value.acc_pre_acc]) assetsObj[value.acc_pre_acc] = 0;
                        assetsObj[value.acc_pre_acc] += value.acc_balance;
                    } else {
                        const groupName = `${value.acc_pre_acc} (Cr Balance)`;
                        if (!liabilitiesObj[groupName]) liabilitiesObj[groupName] = 0;
                        liabilitiesObj[groupName] += Math.abs(value.acc_balance);
                    }
                } else if (isLiabilityGroup) {
                    // Negative balance in map is a CR balance (Positive Liability)
                    // Positive balance in map is a DR balance (Negative Liability -> Asset)
                    if (value.acc_balance < 0) {
                        if (!liabilitiesObj[value.acc_pre_acc]) liabilitiesObj[value.acc_pre_acc] = 0;
                        liabilitiesObj[value.acc_pre_acc] += Math.abs(value.acc_balance);
                    } else {
                        const groupName = `${value.acc_pre_acc} (Dr Balance)`;
                        if (!assetsObj[groupName]) assetsObj[groupName] = 0;
                        assetsObj[groupName] += value.acc_balance;
                    }
                }
            }

            // Clean up: If any group ended up with a negative total, we might want to handle it 
            // (e.g. negative Asset is a Liability), but for now we keep it simple as per accounting standards.

            // Convert aggregated objects back to arrays of objects
            const assets = Object.entries(assetsObj).map(([key, val]) => ({ [key]: val }));
            const liabilities = Object.entries(liabilitiesObj).map(([key, val]) => ({ [key]: val }));

            return {
                assets,
                liabilities
            };
        } catch (error) {
            console.error('❌ Error in get_all_balance_sheet_data:', error.message);
            throw error;
        }
    }
}

module.exports = new BalanceSheetService();
