"use strict";

/** Normalize FE/DB ROI type values to Prisma enum: monthly | annually */
const normalizeRoiType = (roiType) => {
  const t = String(roiType || "monthly").toLowerCase();
  if (t === "annual" || t === "annually" || t === "yearly") return "annually";
  return "monthly";
};

/** Convert stored ROI to monthly rate used by interest formulas */
const getMonthlyRate = (roi, roiType = "monthly") => {
  const rate = parseFloat(roi) || 0;
  return normalizeRoiType(roiType) === "annually" ? rate / 12 : rate;
};

/**
 * Accrued interest for a principal over `months` tenure (whole months).
 * Each calendar month or part thereof = 1 full month charge.
 */
const calculateInterest = (
  principal,
  rate,
  months,
  method = "simple",
  freq = "monthly",
  roiType = "monthly"
) => {
  const p = parseFloat(principal) || 0;
  const monthlyRate = getMonthlyRate(rate, roiType);
  const m = Math.max(0, Math.round(parseFloat(months) || 0));
  if (!p || !monthlyRate || !m) return 0;

  if (method === "compound") {
    const f = String(freq || "monthly").toLowerCase();
    let n = 1;
    if (f.includes("quarter")) n = 1 / 3;
    else if (f.includes("half")) n = 1 / 6;
    else if (f.includes("year") || f.includes("annual")) n = 1 / 12;
    else n = 1;

    const periods = m * n;
    const ratePerPeriod = monthlyRate / n;
    const amount = p * Math.pow(1 + ratePerPeriod / 100, periods);
    return parseFloat((amount - p).toFixed(2));
  }

  return parseFloat(((p * monthlyRate * m) / 100).toFixed(2));
};

const calculateFirstMonthInterest = (
  principal,
  rate,
  method = "simple",
  freq = "monthly",
  roiType = "monthly"
) => calculateInterest(principal, rate, 1, method, freq, roiType);

/** Parse YYYY-MM-DD (or ISO) as calendar date parts — avoids UTC day shift. */
const parseCalendarDate = (value) => {
  if (!value) return null;
  const str = String(value).trim().slice(0, 10);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str);
  if (match) {
    return {
      y: Number(match[1]),
      m: Number(match[2]) - 1,
      d: Number(match[3]),
    };
  }
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return { y: d.getFullYear(), m: d.getMonth(), d: d.getDate() };
};

const calendarDayMs = ({ y, m, d }) => Date.UTC(y, m, d);

const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();

/** Decompose start→end into calendar years, months, remaining days. */
const decomposePeriod = (start, end) => {
  let years = end.y - start.y;
  let months = end.m - start.m;
  let days = end.d - start.d;

  if (days < 0) {
    months -= 1;
    days += daysInMonth(end.y, end.m - 1);
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
};

/**
 * Count billable months: each full month + any extra days = +1 full month.
 * Min 1 month (even same-day loan).
 */
const getTenureMonths = (startDate, endDate = new Date()) => {
  const start = parseCalendarDate(startDate);
  const end = parseCalendarDate(endDate);
  if (!start || !end) return 1;

  const startMs = calendarDayMs(start);
  const endMs = calendarDayMs(end);
  if (endMs < startMs) return 0;

  const { years, months, days } = decomposePeriod(start, end);
  let totalMonths = years * 12 + months;
  if (days > 0) totalMonths += 1;

  return Math.max(1, totalMonths);
};

/** Single entry: billable months from dates, then interest (all method/ROI types). */
const calculateInterestForPeriod = (
  principal,
  rate,
  startDate,
  endDate = new Date(),
  method = "simple",
  freq = "monthly",
  roiType = "monthly"
) => {
  const months = getTenureMonths(startDate, endDate);
  return calculateInterest(principal, rate, months, method, freq, roiType);
};

const isFirstMonthInterestEnabled = (loan) =>
  loan?.girv_first_int === "Y" || loan?.girv_first_int === true;

/** Last date interest should accrue — stops after full principal is deposited. */
const resolveLoanInterestEndDate = (data, asOfDate = new Date()) => {
  const currentTotalPrincipal = parseFloat(data?.girv_prin_amt) || 0;
  if (currentTotalPrincipal > 0 || !data?.deposits?.length) return asOfDate;

  const principalDepositDates = data.deposits
    .filter((dep) => (parseFloat(dep.dep_prin_amt) || 0) > 0)
    .map((dep) => parseCalendarDate(dep.dep_trans_date))
    .filter(Boolean);
  if (!principalDepositDates.length) return asOfDate;

  const latest = principalDepositDates.reduce((maxDate, date) => {
    const dateMs = calendarDayMs(date);
    const maxMs = calendarDayMs(maxDate);
    return dateMs > maxMs ? date : maxDate;
  }, principalDepositDates[0]);

  return new Date(calendarDayMs(latest));
};

/**
 * Full pending interest breakdown for a loan (includes AP + first-month prepaid).
 */
const getLoanInterestSummary = (data, asOfDate = new Date()) => {
  if (!data) {
    return {
      originalPrincipal: 0,
      currentTotalPrincipal: 0,
      totalDepositsPrincipal: 0,
      totalReleasesPrincipal: 0,
      origInterest: 0,
      additionalInterestTotal: 0,
      totalInterest: 0,
      firstMonthInterest: 0,
      totalDepositsInterest: 0,
      totalReleasesInterest: 0,
      pendingInterest: 0,
      pendingPrincipal: 0,
      pending: 0,
      totalDueAmount: 0,
    };
  }

  const totalAdditionalPrincipal =
    data.additionalPrincipals?.reduce(
      (sum, ap) => sum + (parseFloat(ap.ap_prin_amt) || 0),
      0
    ) || 0;
  const totalReleasesPrincipal =
    data.releases?.reduce((sum, rel) => sum + (parseFloat(rel.rel_prin_amt) || 0), 0) || 0;
  const totalDepositsPrincipal =
    data.deposits?.reduce((sum, dep) => sum + (parseFloat(dep.dep_prin_amt) || 0), 0) || 0;
  const currentTotalPrincipal = parseFloat(data.girv_prin_amt) || 0;
  const originalPrincipal = Math.max(
    0,
    currentTotalPrincipal +
      totalReleasesPrincipal +
      totalDepositsPrincipal -
      totalAdditionalPrincipal
  );

  const roi = parseFloat(data.girv_roi) || 0;
  const roiType = data.girv_roi_type || "monthly";
  const interestMethod = data.girv_interest_method || "simple";
  const compoundFreq = data.girv_compound_freq || "monthly";

  const interestEndDate = resolveLoanInterestEndDate(data, asOfDate);

  const origInterest = calculateInterestForPeriod(
    originalPrincipal,
    roi,
    data.girv_start_date,
    interestEndDate,
    interestMethod,
    compoundFreq,
    roiType
  );

  let additionalInterestTotal = 0;
  if (currentTotalPrincipal > 0 && data.additionalPrincipals?.length) {
    data.additionalPrincipals.forEach((ap) => {
      const apPrin = parseFloat(ap.ap_prin_amt) || 0;
      const apRoi = parseFloat(ap.ap_roi) || roi;
      additionalInterestTotal += calculateInterestForPeriod(
        apPrin,
        apRoi,
        ap.ap_trans_date,
        interestEndDate,
        interestMethod,
        compoundFreq,
        roiType
      );
    });
  }

  const totalInterest = parseFloat((origInterest + additionalInterestTotal).toFixed(2));
  const totalReleasesInterest =
    data.releases?.reduce((sum, rel) => sum + (parseFloat(rel.rel_int_amt) || 0), 0) || 0;
  const totalDepositsInterest =
    data.deposits?.reduce((sum, dep) => sum + (parseFloat(dep.dep_int_amt) || 0), 0) || 0;

  const firstMonthInterest = isFirstMonthInterestEnabled(data)
    ? calculateFirstMonthInterest(
        originalPrincipal,
        roi,
        interestMethod,
        compoundFreq,
        roiType
      )
    : 0;

  const pendingInterest = Math.max(
    0,
    parseFloat(
      (totalInterest - totalDepositsInterest - totalReleasesInterest - firstMonthInterest).toFixed(2)
    )
  );
  const pendingPrincipal = currentTotalPrincipal;
  const pending = parseFloat((pendingPrincipal + pendingInterest).toFixed(2));
  const totalDueAmount = pending;

  return {
    originalPrincipal,
    currentTotalPrincipal,
    totalDepositsPrincipal,
    totalReleasesPrincipal,
    origInterest,
    additionalInterestTotal,
    totalInterest,
    firstMonthInterest,
    totalDepositsInterest,
    totalReleasesInterest,
    pendingInterest,
    pendingPrincipal,
    pending,
    totalDueAmount,
    roi,
    roiType,
    interestMethod,
    compoundFreq,
  };
};

module.exports = {
  normalizeRoiType,
  getMonthlyRate,
  calculateInterest,
  calculateFirstMonthInterest,
  calculateInterestForPeriod,
  getTenureMonths,
  isFirstMonthInterestEnabled,
  resolveLoanInterestEndDate,
  getLoanInterestSummary,
};
