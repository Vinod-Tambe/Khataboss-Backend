"use strict";

const { Prisma } = require("../../../prisma/generated/main");
const { getTenantPrisma } = require("../../../utils/tenantPrisma");

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CLOSED_FINANCE_STATUSES = ["CLOSED", "COMPLETED", "INACTIVE"];

function parseFirmId(firmId) {
  if (!firmId || firmId === "all") return undefined;
  const id = parseInt(firmId, 10);
  return Number.isNaN(id) ? undefined : id;
}

function parseUserId(userId) {
  const id = parseInt(userId, 10);
  return Number.isNaN(id) ? undefined : id;
}

function emptySeries(length) {
  return Array.from({ length }, () => 0);
}

function fillMonthlySeries(rows, valueKey = "count") {
  const series = emptySeries(12);
  rows.forEach((row) => {
    const monthIndex = Number(row.month) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      series[monthIndex] = Number(row[valueKey]) || 0;
    }
  });
  return series;
}

function fillYearlySeries(rows, years, valueKey = "count") {
  const map = new Map(rows.map((r) => [Number(r.year), Number(r[valueKey]) || 0]));
  return years.map((year) => map.get(year) || 0);
}

function fillWeeklySeries(rows, weekStarts) {
  const map = new Map(
    rows.map((r) => [new Date(r.week_start).toISOString().slice(0, 10), Number(r.total) || 0])
  );
  return weekStarts.map((d) => map.get(d.toISOString().slice(0, 10)) || 0);
}

function sumGroupByStats(groups, activeStatus, closedStatuses, countKey, sumKey) {
  let activeCount = 0;
  let activeAmt = 0;
  let closedCount = 0;
  let closedAmt = 0;

  groups.forEach((g) => {
    const status = String(g[Object.keys(g).find((k) => k.includes("status"))] || "").toUpperCase();
    const count = g._count?.[countKey] || 0;
    const amt = g._sum?.[sumKey] || 0;
    if (status === activeStatus) {
      activeCount += count;
      activeAmt += amt;
    } else if (closedStatuses.includes(status)) {
      closedCount += count;
      closedAmt += amt;
    }
  });

  return { activeCount, activeAmt, closedCount, closedAmt };
}

function buildUnifiedTransactions({ fmtList, depList, relList, apList, journalList }) {
  const unified = [];

  fmtList.forEach((fm) => {
    unified.push({
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
    const amt = dep.dep_payable_amt || (dep.dep_prin_amt || 0) + (dep.dep_int_amt || 0);
    unified.push({
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
    unified.push({
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
    unified.push({
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
    unified.push({
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

  unified.sort((a, b) => b.sortDate - a.sortDate);
  return unified.slice(0, 5);
}

class DashboardService {
  async getOwnerDashboard(dbUrl, firmId) {
    const prisma = getTenantPrisma(dbUrl);
    const fId = parseFirmId(firmId);
    const now = new Date();
    const currentYear = now.getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const firmFinanceSql = fId ? Prisma.sql`AND fin_firm_id = ${fId}` : Prisma.empty;
    const firmGirviSql = fId ? Prisma.sql`AND girv_firm_id = ${fId}` : Prisma.empty;
    const firmDepSql = fId ? Prisma.sql`AND dep_firm_id = ${fId}` : Prisma.empty;
    const firmRelSql = fId ? Prisma.sql`AND rel_firm_id = ${fId}` : Prisma.empty;
    const firmFmtSql = fId ? Prisma.sql`AND fm_firm_id = ${fId}` : Prisma.empty;

    const weekStarts = [];
    for (let i = 3; i >= 0; i -= 1) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * 7);
      d.setHours(0, 0, 0, 0);
      weekStarts.push(new Date(d));
    }
    const weeklyFrom = weekStarts[0];

    const yearlyFrom = new Date(currentYear - 4, 0, 1);
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);

    const last7Start = new Date(now);
    last7Start.setDate(last7Start.getDate() - 6);
    last7Start.setHours(0, 0, 0, 0);

    const [
      totalFinance,
      totalLoan,
      totalUsers,
      totalStaff,
      financeMonthlyCount,
      girviMonthlyCount,
      financeMonthlyAmt,
      girviMonthlyAmt,
      financeWeeklyCount,
      girviWeeklyCount,
      financeWeeklyAmt,
      girviWeeklyAmt,
      financeYearlyCount,
      girviYearlyCount,
      financeYearlyAmt,
      girviYearlyAmt,
      profitRows,
      lossRows,
      depDaily,
      relDaily,
      fmtDaily,
    ] = await Promise.all([
      prisma.finance.count({ where: { fin_is_deleted: false, ...(fId && { fin_firm_id: fId }) } }),
      prisma.girvi.count({ where: { girv_is_deleted: false, ...(fId && { girv_firm_id: fId }) } }),
      prisma.user.count({ where: { user_is_deleted: false, ...(fId && { user_firm_id: fId }) } }),
      prisma.staff.count({ where: { staff_is_deleted: false } }),

      prisma.$queryRaw`
        SELECT EXTRACT(MONTH FROM fin_created_at)::int AS month, COUNT(*)::int AS count
        FROM finance
        WHERE fin_is_deleted = false AND fin_created_at >= ${yearStart}
        ${firmFinanceSql}
        GROUP BY 1 ORDER BY 1`,
      prisma.$queryRaw`
        SELECT EXTRACT(MONTH FROM girv_created_at)::int AS month, COUNT(*)::int AS count
        FROM girvi
        WHERE girv_is_deleted = false AND girv_created_at >= ${yearStart}
        ${firmGirviSql}
        GROUP BY 1 ORDER BY 1`,
      prisma.$queryRaw`
        SELECT EXTRACT(MONTH FROM fin_created_at)::int AS month, COALESCE(SUM(fin_prin_amt), 0)::float AS amount
        FROM finance
        WHERE fin_is_deleted = false AND fin_created_at >= ${yearStart}
        ${firmFinanceSql}
        GROUP BY 1 ORDER BY 1`,
      prisma.$queryRaw`
        SELECT EXTRACT(MONTH FROM girv_created_at)::int AS month, COALESCE(SUM(girv_prin_amt), 0)::float AS amount
        FROM girvi
        WHERE girv_is_deleted = false AND girv_created_at >= ${yearStart}
        ${firmGirviSql}
        GROUP BY 1 ORDER BY 1`,

      prisma.$queryRaw`
        SELECT date_trunc('week', fin_created_at) AS week_start, COUNT(*)::int AS total
        FROM finance
        WHERE fin_is_deleted = false AND fin_created_at >= ${weeklyFrom}
        ${firmFinanceSql}
        GROUP BY 1 ORDER BY 1`,
      prisma.$queryRaw`
        SELECT date_trunc('week', girv_created_at) AS week_start, COUNT(*)::int AS total
        FROM girvi
        WHERE girv_is_deleted = false AND girv_created_at >= ${weeklyFrom}
        ${firmGirviSql}
        GROUP BY 1 ORDER BY 1`,
      prisma.$queryRaw`
        SELECT date_trunc('week', fin_created_at) AS week_start, COALESCE(SUM(fin_prin_amt), 0)::float AS total
        FROM finance
        WHERE fin_is_deleted = false AND fin_created_at >= ${weeklyFrom}
        ${firmFinanceSql}
        GROUP BY 1 ORDER BY 1`,
      prisma.$queryRaw`
        SELECT date_trunc('week', girv_created_at) AS week_start, COALESCE(SUM(girv_prin_amt), 0)::float AS total
        FROM girvi
        WHERE girv_is_deleted = false AND girv_created_at >= ${weeklyFrom}
        ${firmGirviSql}
        GROUP BY 1 ORDER BY 1`,

      prisma.$queryRaw`
        SELECT EXTRACT(YEAR FROM fin_created_at)::int AS year, COUNT(*)::int AS count
        FROM finance
        WHERE fin_is_deleted = false AND fin_created_at >= ${yearlyFrom}
        ${firmFinanceSql}
        GROUP BY 1 ORDER BY 1`,
      prisma.$queryRaw`
        SELECT EXTRACT(YEAR FROM girv_created_at)::int AS year, COUNT(*)::int AS count
        FROM girvi
        WHERE girv_is_deleted = false AND girv_created_at >= ${yearlyFrom}
        ${firmGirviSql}
        GROUP BY 1 ORDER BY 1`,
      prisma.$queryRaw`
        SELECT EXTRACT(YEAR FROM fin_created_at)::int AS year, COALESCE(SUM(fin_prin_amt), 0)::float AS amount
        FROM finance
        WHERE fin_is_deleted = false AND fin_created_at >= ${yearlyFrom}
        ${firmFinanceSql}
        GROUP BY 1 ORDER BY 1`,
      prisma.$queryRaw`
        SELECT EXTRACT(YEAR FROM girv_created_at)::int AS year, COALESCE(SUM(girv_prin_amt), 0)::float AS amount
        FROM girvi
        WHERE girv_is_deleted = false AND girv_created_at >= ${yearlyFrom}
        ${firmGirviSql}
        GROUP BY 1 ORDER BY 1`,

      prisma.$queryRaw`
        SELECT EXTRACT(YEAR FROM dep_created_at)::int AS year,
               COALESCE(SUM(dep_int_amt), 0)::float AS profit
        FROM girvi_deposit
        WHERE dep_is_deleted = false AND dep_created_at >= ${yearlyFrom}
        ${firmDepSql}
        GROUP BY 1 ORDER BY 1`,
      prisma.$queryRaw`
        SELECT EXTRACT(YEAR FROM rel_created_at)::int AS year,
               COALESCE(SUM(rel_disc_amt), 0)::float AS loss
        FROM girvi_release
        WHERE rel_is_deleted = false AND rel_created_at >= ${yearlyFrom}
        ${firmRelSql}
        GROUP BY 1 ORDER BY 1`,

      prisma.$queryRaw`
        SELECT DATE(dep_created_at) AS day,
               COALESCE(SUM(COALESCE(dep_payable_amt, dep_prin_amt + dep_int_amt)), 0)::float AS amount
        FROM girvi_deposit
        WHERE dep_is_deleted = false AND dep_created_at >= ${last7Start}
        ${firmDepSql}
        GROUP BY 1 ORDER BY 1`,
      prisma.$queryRaw`
        SELECT DATE(rel_created_at) AS day,
               COALESCE(SUM(COALESCE(rel_payable_amt, rel_prin_amt)), 0)::float AS amount
        FROM girvi_release
        WHERE rel_is_deleted = false AND rel_created_at >= ${last7Start}
        ${firmRelSql}
        GROUP BY 1 ORDER BY 1`,
      prisma.$queryRaw`
        SELECT DATE(fm_created_at) AS day,
               COALESCE(SUM(fm_trans_amt), 0)::float AS amount
        FROM finance_money_trans
        WHERE fm_is_deleted = false AND fm_created_at >= ${last7Start}
        ${firmFmtSql}
        GROUP BY 1 ORDER BY 1`,
    ]);

    const last7Days = [];
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const key = d.toISOString().slice(0, 10);
      const loanAmt =
        (depDaily.find((r) => new Date(r.day).toISOString().slice(0, 10) === key)?.amount || 0) +
        (relDaily.find((r) => new Date(r.day).toISOString().slice(0, 10) === key)?.amount || 0);
      const financeAmt =
        fmtDaily.find((r) => new Date(r.day).toISOString().slice(0, 10) === key)?.amount || 0;
      last7Days.push({
        day: DAY_LABELS[d.getDay()],
        date: key,
        loan: Number(loanAmt) || 0,
        finance: Number(financeAmt) || 0,
      });
    }

    const profitMap = new Map(profitRows.map((r) => [Number(r.year), Number(r.profit) || 0]));
    const lossMap = new Map(lossRows.map((r) => [Number(r.year), Number(r.loss) || 0]));
    const profitLoss = years.map((year) => ({
      year: String(year),
      profit: profitMap.get(year) || 0,
      loss: lossMap.get(year) || 0,
    }));

    return {
      cards: {
        totalFinance,
        totalLoan,
        totalUsers,
        totalStaff,
      },
      charts: {
        counts: {
          weekly: {
            categories: weekStarts.map((_, i) => `Week ${i + 1}`),
            loans: fillWeeklySeries(girviWeeklyCount, weekStarts),
            finance: fillWeeklySeries(financeWeeklyCount, weekStarts),
          },
          monthly: {
            categories: MONTH_LABELS,
            loans: fillMonthlySeries(girviMonthlyCount),
            finance: fillMonthlySeries(financeMonthlyCount),
          },
          yearly: {
            categories: years.map(String),
            loans: fillYearlySeries(girviYearlyCount, years),
            finance: fillYearlySeries(financeYearlyCount, years),
          },
        },
        amounts: {
          weekly: {
            categories: weekStarts.map((_, i) => `Week ${i + 1}`),
            loans: fillWeeklySeries(girviWeeklyAmt, weekStarts),
            finance: fillWeeklySeries(financeWeeklyAmt, weekStarts),
          },
          monthly: {
            categories: MONTH_LABELS,
            loans: fillMonthlySeries(girviMonthlyAmt, "amount"),
            finance: fillMonthlySeries(financeMonthlyAmt, "amount"),
          },
          yearly: {
            categories: years.map(String),
            loans: fillYearlySeries(girviYearlyAmt, years, "amount"),
            finance: fillYearlySeries(financeYearlyAmt, years, "amount"),
          },
        },
        profitLoss,
        last7Days,
      },
    };
  }

  async getUserDashboard(dbUrl, firmId, userId) {
    const prisma = getTenantPrisma(dbUrl);
    const fId = parseFirmId(firmId);
    const uId = parseUserId(userId);

    if (!uId) throw new Error("User ID is required for user dashboard.");

    const financeWhere = { fin_user_id: uId, fin_is_deleted: false, ...(fId && { fin_firm_id: fId }) };
    const loanWhere = { girv_user_id: uId, girv_is_deleted: false, ...(fId && { girv_firm_id: fId }) };

    const [
      financeGroups,
      loanGroups,
      pendingAgg,
      latestFinances,
      latestLoans,
      fmtList,
      depList,
      relList,
      apList,
      journalList,
    ] = await Promise.all([
      prisma.finance.groupBy({
        by: ["fin_status"],
        where: financeWhere,
        _count: { fin_id: true },
        _sum: { fin_prin_amt: true },
      }),
      prisma.girvi.groupBy({
        by: ["girv_status"],
        where: loanWhere,
        _count: { girv_id: true },
        _sum: { girv_prin_amt: true },
      }),
      prisma.finance_Transaction.aggregate({
        where: {
          ft_user_id: uId,
          ft_is_deleted: false,
          ...(fId && { ft_firm_id: fId }),
          finance: { fin_is_deleted: false, fin_status: "ACTIVE" },
        },
        _sum: { ft_pending_amt: true },
      }),
      prisma.finance.findMany({
        where: { ...financeWhere, fin_status: "ACTIVE" },
        take: 5,
        orderBy: { fin_created_at: "desc" },
        include: {
          finance_trans: { where: { ft_is_deleted: false } },
          firm: { select: { firm_name: true } },
        },
      }),
      prisma.girvi.findMany({
        where: { ...loanWhere, girv_status: "ACTIVE" },
        take: 5,
        orderBy: { girv_created_at: "desc" },
      }),
      prisma.finance_Money_Transaction.findMany({
        where: { fm_user_id: uId, fm_is_deleted: false, ...(fId && { fm_firm_id: fId }) },
        orderBy: { fm_created_at: "desc" },
        take: 10,
        include: { finance: { select: { fin_id: true, fin_unique_code: true } } },
      }),
      prisma.girviDeposit.findMany({
        where: { dep_user_id: uId, dep_is_deleted: false, ...(fId && { dep_firm_id: fId }) },
        orderBy: { dep_created_at: "desc" },
        take: 10,
        include: { girvi: { select: { girv_id: true, girv_unique_code: true, girv_loan_no: true } } },
      }),
      prisma.girviRelease.findMany({
        where: { rel_user_id: uId, rel_is_deleted: false, ...(fId && { rel_firm_id: fId }) },
        orderBy: { rel_created_at: "desc" },
        take: 10,
        include: { girvi: { select: { girv_id: true, girv_unique_code: true, girv_loan_no: true } } },
      }),
      prisma.additionalPrincipal.findMany({
        where: { ap_user_id: uId, ap_is_deleted: false, ...(fId && { ap_firm_id: fId }) },
        orderBy: { ap_created_at: "desc" },
        take: 10,
        include: { girvi: { select: { girv_id: true, girv_unique_code: true, girv_loan_no: true } } },
      }),
      prisma.journal.findMany({
        where: { jrnl_user_id: uId, jrnl_is_deleted: false, ...(fId && { jrnl_firm_id: fId }) },
        orderBy: { jrnl_created_at: "desc" },
        take: 10,
        include: { financeMoneyTransactions: { where: { fm_is_deleted: false } } },
      }),
    ]);

    const financeStats = sumGroupByStats(
      financeGroups,
      "ACTIVE",
      CLOSED_FINANCE_STATUSES,
      "fin_id",
      "fin_prin_amt"
    );
    const loanStats = sumGroupByStats(loanGroups, "ACTIVE", ["RELEASED"], "girv_id", "girv_prin_amt");

    const latestTransactions = buildUnifiedTransactions({
      fmtList,
      depList,
      relList,
      apList,
      journalList,
    });

    return {
      totals: {
        totalActiveFinance: financeStats.activeCount,
        totalCloseFinance: financeStats.closedCount,
        totalActiveFinanceAmt: financeStats.activeAmt,
        totalCloseFinanceAmt: financeStats.closedAmt,
        totalActiveLoan: loanStats.activeCount,
        totalReleaseLoan: loanStats.closedCount,
        totalActiveLoanAmt: loanStats.activeAmt,
        totalReleaseLoanAmt: loanStats.closedAmt,
        totalFinancePending: pendingAgg._sum.ft_pending_amt || 0,
      },
      latestFinances,
      latestLoans,
      latestTransactions,
    };
  }
}

module.exports = new DashboardService();
