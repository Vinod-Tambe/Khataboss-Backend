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

      // 2. Calculate Totals
      let totalFinanceAmount = 0;
      let totalFinancePending = 0;
      
      finances.forEach(f => {
        if (f.fin_status === "ACTIVE") {
          totalFinanceAmount += (f.fin_prin_amt || 0);
          f.finance_trans.forEach(t => {
            totalFinancePending += (t.ft_pending_amt || 0);
          });
        }
      });

      // 3. Get Latest 5 Finances for list (Active only for the table)
      const latestFinances = finances
        .filter(f => f.fin_status === "ACTIVE")
        .slice(0, 5);

      // 4. Get Latest 5 Transactions
      const transWhere = {
        fm_user_id: uId,
        fm_is_deleted: false,
      };
      if (fId) transWhere.fm_firm_id = fId;

      const latestTransactions = await prisma.finance_Money_Transaction.findMany({
        where: transWhere,
        orderBy: { fm_created_at: "desc" },
        take: 5,
      });

      // 5. Loan placeholders (Loans are not in a separate table yet)
      const totalLoanCount = 0;
      const totalLoanAmount = 0;

      return {
        totals: {
          totalFinanceAmount,
          totalFinancePending,
          totalLoanCount,
          totalLoanAmount
        },
        latestFinances,
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
