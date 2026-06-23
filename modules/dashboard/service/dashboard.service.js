"use strict";

const { PrismaClient } = require("../../../prisma/generated/main");

class DashboardService {
  getPrisma(dbUrl) {
    return new PrismaClient({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
  }

  async getUserDashboard(dbUrl, firmId, userId) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const fId = firmId ? parseInt(firmId) : undefined;
      const uId = userId ? parseInt(userId) : undefined;

      if (!uId) throw new Error("User ID is required for user dashboard.");

      const whereClause = {
        fin_user_id: uId,
        fin_is_deleted: false,
      };
      if (fId) whereClause.fin_firm_id = fId;

      // 1. Get All Finances for totals and lists
      const finances = await prisma.finance.findMany({
        where: whereClause,
        include: {
          finance_trans: {
            where: { ft_is_deleted: false }
          },
          user: {
            select: { user_first_name: true, user_last_name: true, user_mobile_no: true }
          },
          firm: {
            select: { firm_name: true }
          }
        },
        orderBy: { fin_created_at: "desc" }
      });

      // 2. Calculate Finance Totals
      let totalActiveFinance = 0;
      let totalCloseFinance = 0;
      let totalActiveFinanceAmt = 0;
      let totalCloseFinanceAmt = 0;
      let totalFinancePending = 0;
      
      finances.forEach(f => {
        if (f.fin_status === "ACTIVE") {
          totalActiveFinance += 1;
          totalActiveFinanceAmt += (f.fin_prin_amt || 0);
          f.finance_trans.forEach(t => {
            totalFinancePending += (t.ft_pending_amt || 0);
          });
        } else if (f.fin_status === "CLOSED" || f.fin_status === "COMPLETED" || f.fin_status === "INACTIVE") {
          totalCloseFinance += 1;
          totalCloseFinanceAmt += (f.fin_prin_amt || 0);
        }
      });

      // 3. Get Latest 5 Finances for list (Active only for the table)
      const latestFinances = finances
        .filter(f => f.fin_status === "ACTIVE")
        .slice(0, 5);

      // 4. Get Latest 5 Transactions (Finance & Loan) from Journal
      const journalWhere = {
        jrnl_user_id: uId,
        jrnl_is_deleted: false,
      };
      if (fId) journalWhere.jrnl_firm_id = fId;

      const latestTransactions = await prisma.journal.findMany({
        where: journalWhere,
        orderBy: { jrnl_created_at: "desc" },
        take: 5,
        include: {
          financeMoneyTransactions: {
            where: { fm_is_deleted: false }
          }
        }
      });

      // 5. Fetch actual Loan (Girvi) records
      const loanWhereClause = {
        girv_user_id: uId,
        girv_is_deleted: false,
      };
      if (fId) loanWhereClause.girv_firm_id = fId;

      const loans = await prisma.girvi.findMany({
        where: loanWhereClause,
        orderBy: { girv_created_at: "desc" }
      });

      // Calculate Loan Totals (Active and Released)
      let totalActiveLoan = 0;
      let totalReleaseLoan = 0;
      let totalActiveLoanAmt = 0;
      let totalReleaseLoanAmt = 0;

      loans.forEach(l => {
        if (l.girv_status === "ACTIVE") {
          totalActiveLoan += 1;
          totalActiveLoanAmt += (l.girv_prin_amt || 0);
        } else if (l.girv_status === "RELEASED") {
          totalReleaseLoan += 1;
          totalReleaseLoanAmt += (l.girv_prin_amt || 0);
        }
      });

      // Get Latest 5 Active Loans
      const latestLoans = loans
        .filter(l => l.girv_status === "ACTIVE")
        .slice(0, 5);

      return {
        totals: {
          totalActiveFinance,
          totalCloseFinance,
          totalActiveFinanceAmt,
          totalCloseFinanceAmt,
          totalActiveLoan,
          totalReleaseLoan,
          totalActiveLoanAmt,
          totalReleaseLoanAmt,
          totalFinancePending
        },
        latestFinances,
        latestLoans,
        latestTransactions
      };
    } catch (error) {
      console.error("❌ Service Error (getUserDashboard):", error.message);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }
}

module.exports = new DashboardService();
