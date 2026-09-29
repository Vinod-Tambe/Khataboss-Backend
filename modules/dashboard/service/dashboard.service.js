"use strict";

const { Prisma } = require("../../../prisma/generated/main");
const { getTenantPrisma } = require("../../../utils/tenantPrisma");
const girviService = require("../../girvi/service/girvi.service");

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

function sumStatusCounts(groups, statusKey, countKey) {
  const map = new Map();
  for (const row of groups) {
    const status = String(row[statusKey] || "").toUpperCase();
    const count = row._count?.[countKey] || 0;
    map.set(status, (map.get(status) || 0) + count);
  }
  return map;
}

function formatPeriodBucketLabel(bucket, period) {
  if (period === "year") return String(bucket);
  const d = bucket instanceof Date ? bucket : new Date(bucket);
  if (Number.isNaN(d.getTime())) return String(bucket);
  if (period === "month") {
    return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  }
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function mapLastFivePeriodRows(rows, period) {
  const ordered = [...rows].sort((a, b) => {
    if (period === "year") return Number(a.bucket) - Number(b.bucket);
    const av = a.bucket instanceof Date ? a.bucket.getTime() : new Date(a.bucket).getTime();
    const bv = b.bucket instanceof Date ? b.bucket.getTime() : new Date(b.bucket).getTime();
    return av - bv;
  });
  return {
    categories: ordered.map((r) => formatPeriodBucketLabel(r.bucket, period)),
    counts: ordered.map((r) => Number(r.count) || 0),
  };
}

async function fetchLoanLastFive(prisma, fId, period) {
  const firmSql = fId ? Prisma.sql`AND girv_firm_id = ${fId}` : Prisma.empty;
  if (period === "day") {
    const rows = await prisma.$queryRaw`
      SELECT DATE(girv_created_at) AS bucket, COUNT(*)::int AS count
      FROM girvi
      WHERE girv_is_deleted = false
      ${firmSql}
      GROUP BY 1
      ORDER BY 1 DESC
      LIMIT 5`;
    return mapLastFivePeriodRows(rows, period);
  }
  if (period === "month") {
    const rows = await prisma.$queryRaw`
      SELECT date_trunc('month', girv_created_at) AS bucket, COUNT(*)::int AS count
      FROM girvi
      WHERE girv_is_deleted = false
      ${firmSql}
      GROUP BY 1
      ORDER BY 1 DESC
      LIMIT 5`;
    return mapLastFivePeriodRows(rows, period);
  }
  const rows = await prisma.$queryRaw`
    SELECT EXTRACT(YEAR FROM girv_created_at)::int AS bucket, COUNT(*)::int AS count
    FROM girvi
    WHERE girv_is_deleted = false
    ${firmSql}
    GROUP BY 1
    ORDER BY 1 DESC
    LIMIT 5`;
  return mapLastFivePeriodRows(rows, period);
}

async function fetchFinanceLastFive(prisma, fId, period) {
  const firmSql = fId ? Prisma.sql`AND fin_firm_id = ${fId}` : Prisma.empty;
  if (period === "day") {
    const rows = await prisma.$queryRaw`
      SELECT DATE(fin_created_at) AS bucket, COUNT(*)::int AS count
      FROM finance
      WHERE fin_is_deleted = false
      ${firmSql}
      GROUP BY 1
      ORDER BY 1 DESC
      LIMIT 5`;
    return mapLastFivePeriodRows(rows, period);
  }
  if (period === "month") {
    const rows = await prisma.$queryRaw`
      SELECT date_trunc('month', fin_created_at) AS bucket, COUNT(*)::int AS count
      FROM finance
      WHERE fin_is_deleted = false
      ${firmSql}
      GROUP BY 1
      ORDER BY 1 DESC
      LIMIT 5`;
    return mapLastFivePeriodRows(rows, period);
  }
  const rows = await prisma.$queryRaw`
    SELECT EXTRACT(YEAR FROM fin_created_at)::int AS bucket, COUNT(*)::int AS count
    FROM finance
    WHERE fin_is_deleted = false
    ${firmSql}
    GROUP BY 1
    ORDER BY 1 DESC
    LIMIT 5`;
  return mapLastFivePeriodRows(rows, period);
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
      sortDate: new Date(fm.fm_trans_date || fm.fm_created_at).getTime(),
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
    const loanWhere = { girv_is_deleted: false, ...(fId && { girv_firm_id: fId }) };
    const financeWhere = { fin_is_deleted: false, ...(fId && { fin_firm_id: fId }) };
    const userWhere = { user_is_deleted: false, ...(fId && { user_firm_id: fId }) };

    const [
      loanGroups,
      financeGroups,
      totalUsers,
      totalStaff,
      loanLastDay,
      loanLastMonth,
      loanLastYear,
      financeLastDay,
      financeLastMonth,
      financeLastYear,
    ] = await Promise.all([
      prisma.girvi.groupBy({
        by: ["girv_status"],
        where: loanWhere,
        _count: { girv_id: true },
      }),
      prisma.finance.groupBy({
        by: ["fin_status"],
        where: financeWhere,
        _count: { fin_id: true },
      }),
      prisma.user.count({ where: userWhere }),
      prisma.staff.count({ where: { staff_is_deleted: false } }),
      fetchLoanLastFive(prisma, fId, "day"),
      fetchLoanLastFive(prisma, fId, "month"),
      fetchLoanLastFive(prisma, fId, "year"),
      fetchFinanceLastFive(prisma, fId, "day"),
      fetchFinanceLastFive(prisma, fId, "month"),
      fetchFinanceLastFive(prisma, fId, "year"),
    ]);

    const loanStatus = sumStatusCounts(loanGroups, "girv_status", "girv_id");
    const activeLoans = loanStatus.get("ACTIVE") || 0;
    const auctionLoans = loanStatus.get("AUCTION") || 0;
    const releaseLoans = loanStatus.get("RELEASED") || 0;
    const transferLoans = loanStatus.get("TRANSFERRED") || 0;
    const closedLoans = loanStatus.get("CLOSED") || 0;
    const totalLoan =
      activeLoans + auctionLoans + releaseLoans + transferLoans + closedLoans;

    const financeStatus = sumStatusCounts(financeGroups, "fin_status", "fin_id");
    const activeFinance =
      (financeStatus.get("ACTIVE") || 0) + (financeStatus.get("PARTIAL") || 0);
    let closedFinance = 0;
    for (const st of CLOSED_FINANCE_STATUSES) {
      closedFinance += financeStatus.get(st) || 0;
    }
    const totalFinance = activeFinance + closedFinance;

    const loanPieLabels = [
      "Active Loans",
      "Auction Loans",
      "Release Loans",
      "Transfer Loans",
    ];
    const loanPieSeries = [
      activeLoans,
      auctionLoans,
      releaseLoans,
      transferLoans,
    ];

    const financePieLabels = ["Active Finance", "Close Finance"];
    const financePieSeries = [activeFinance, closedFinance];

    return {
      cards: {
        totalFinance,
        totalLoan,
        totalUsers,
        totalStaff,
      },
      charts: {
        loanAudit: {
          total: totalLoan,
          active: activeLoans,
          auction: auctionLoans,
          released: releaseLoans,
          transfer: transferLoans,
          closed: closedLoans,
          labels: loanPieLabels,
          series: loanPieSeries,
        },
        loanLast: {
          day: loanLastDay,
          month: loanLastMonth,
          year: loanLastYear,
        },
        financeAudit: {
          total: totalFinance,
          active: activeFinance,
          closed: closedFinance,
          labels: financePieLabels,
          series: financePieSeries,
        },
        financeLast: {
          day: financeLastDay,
          month: financeLastMonth,
          year: financeLastYear,
        },
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

    const enrichedLatestLoans = await girviService.enrichGirvisListData(prisma, latestLoans);

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
      latestLoans: enrichedLatestLoans,
      latestTransactions,
    };
  }
}

module.exports = new DashboardService();
