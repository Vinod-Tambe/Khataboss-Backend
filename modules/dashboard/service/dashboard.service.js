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

      // 4. Get User Transactions across all modules (Finance & Loans & Journal)
      const fmWhere = { fm_user_id: uId, fm_is_deleted: false };
      if (fId) fmWhere.fm_firm_id = fId;
      const fmtList = await prisma.finance_Money_Transaction.findMany({
        where: fmWhere,
        orderBy: { fm_created_at: "desc" },
        take: 10,
        include: {
          finance: {
            select: { fin_id: true, fin_unique_code: true }
          }
        }
      });

      const depWhere = { dep_user_id: uId, dep_is_deleted: false };
      if (fId) depWhere.dep_firm_id = fId;
      const depList = await prisma.girviDeposit.findMany({
        where: depWhere,
        orderBy: { dep_created_at: "desc" },
        take: 10,
        include: {
          girvi: {
            select: { girv_id: true, girv_unique_code: true, girv_loan_no: true }
          }
        }
      });

      const relWhere = { rel_user_id: uId, rel_is_deleted: false };
      if (fId) relWhere.rel_firm_id = fId;
      const relList = await prisma.girviRelease.findMany({
        where: relWhere,
        orderBy: { rel_created_at: "desc" },
        take: 10,
        include: {
          girvi: {
            select: { girv_id: true, girv_unique_code: true, girv_loan_no: true }
          }
        }
      });

      const apWhere = { ap_user_id: uId, ap_is_deleted: false };
      if (fId) apWhere.ap_firm_id = fId;
      const apList = await prisma.additionalPrincipal.findMany({
        where: apWhere,
        orderBy: { ap_created_at: "desc" },
        take: 10,
        include: {
          girvi: {
            select: { girv_id: true, girv_unique_code: true, girv_loan_no: true }
          }
        }
      });

      const journalWhere = { jrnl_user_id: uId, jrnl_is_deleted: false };
      if (fId) journalWhere.jrnl_firm_id = fId;
      const journalList = await prisma.journal.findMany({
        where: journalWhere,
        orderBy: { jrnl_created_at: "desc" },
        take: 10,
        include: {
          financeMoneyTransactions: { where: { fm_is_deleted: false } }
        }
      });

      const unifiedTransactions = [];

      fmtList.forEach((fm) => {
        unifiedTransactions.push({
          sortDate: new Date(fm.fm_created_at || fm.fm_trans_date).getTime(),
          jrnl_id: fm.fm_id,
          transNo: `FMT-${fm.fm_id}`,
          jrnl_amt: fm.fm_trans_amt,
          jrnl_panel: "Finance EMI Pay",
          jrnl_date: fm.fm_trans_date || fm.fm_created_at,
          fin_id: fm.finance?.fin_id,
          fin_code: fm.finance?.fin_unique_code || (fm.finance?.fin_id ? `FIN-${fm.finance.fin_id}` : null),
          girv_id: null,
          girv_code: null,
          jrnl_other_info: fm.fm_pay_info || fm.fm_other_info || "Finance EMI Payment",
        });
      });

      depList.forEach((dep) => {
        const amt = dep.dep_payable_amt || ((dep.dep_prin_amt || 0) + (dep.dep_int_amt || 0));
        unifiedTransactions.push({
          sortDate: new Date(dep.dep_created_at || dep.dep_trans_date).getTime(),
          jrnl_id: dep.dep_id,
          transNo: `DEP-${dep.dep_id}`,
          jrnl_amt: amt,
          jrnl_panel: "Loan Deposit",
          jrnl_date: dep.dep_trans_date || dep.dep_created_at,
          fin_id: null,
          fin_code: null,
          girv_id: dep.girvi?.girv_id,
          girv_code: dep.girvi?.girv_unique_code || dep.girvi?.girv_loan_no || (dep.girvi?.girv_id ? `LN-${dep.girvi.girv_id}` : null),
          jrnl_other_info: dep.dep_pay_info || dep.dep_other_info || "Loan Deposit Payment",
        });
      });

      relList.forEach((rel) => {
        unifiedTransactions.push({
          sortDate: new Date(rel.rel_created_at || rel.rel_trans_date).getTime(),
          jrnl_id: rel.rel_id,
          transNo: `REL-${rel.rel_id}`,
          jrnl_amt: rel.rel_payable_amt || rel.rel_prin_amt,
          jrnl_panel: "Loan Release",
          jrnl_date: rel.rel_trans_date || rel.rel_created_at,
          fin_id: null,
          fin_code: null,
          girv_id: rel.girvi?.girv_id,
          girv_code: rel.girvi?.girv_unique_code || rel.girvi?.girv_loan_no || (rel.girvi?.girv_id ? `LN-${rel.girvi.girv_id}` : null),
          jrnl_other_info: rel.rel_pay_info || rel.rel_other_info || "Loan Release Payment",
        });
      });

      apList.forEach((ap) => {
        unifiedTransactions.push({
          sortDate: new Date(ap.ap_created_at || ap.ap_trans_date).getTime(),
          jrnl_id: ap.ap_id,
          transNo: `AP-${ap.ap_id}`,
          jrnl_amt: ap.ap_prin_amt,
          jrnl_panel: "Additional Principal",
          jrnl_date: ap.ap_trans_date || ap.ap_created_at,
          fin_id: null,
          fin_code: null,
          girv_id: ap.girvi?.girv_id,
          girv_code: ap.girvi?.girv_unique_code || ap.girvi?.girv_loan_no || (ap.girvi?.girv_id ? `LN-${ap.girvi.girv_id}` : null),
          jrnl_other_info: ap.ap_pay_info || ap.ap_other_info || "Additional Principal Top-up",
        });
      });

      journalList.forEach((j) => {
        const fmTrans = j.financeMoneyTransactions?.[0];
        unifiedTransactions.push({
          sortDate: new Date(j.jrnl_created_at || j.jrnl_date).getTime(),
          jrnl_id: j.jrnl_id,
          transNo: `TR-${j.jrnl_id}`,
          jrnl_amt: j.jrnl_amt,
          jrnl_panel: j.jrnl_panel || "Journal",
          jrnl_date: j.jrnl_date || j.jrnl_created_at,
          fin_id: fmTrans?.fm_fin_id,
          fin_code: null,
          girv_id: null,
          girv_code: null,
          jrnl_other_info: j.jrnl_other_info || "",
        });
      });

      unifiedTransactions.sort((a, b) => b.sortDate - a.sortDate);
      const latestTransactions = unifiedTransactions.slice(0, 5);

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
