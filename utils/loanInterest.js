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
 * Accrued interest for a principal over `months` tenure.
 * `rate` is the stored ROI; `roiType` decides monthly vs annual.
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
  const m = parseFloat(months) || 0;
  if (!p || !monthlyRate || !m) return 0;

  if (method === "compound") {
    let n = 1;
    if (freq === "monthly") n = 1;
    else if (freq === "quarterly") n = 1 / 3;
    else if (freq === "half_yearly") n = 1 / 6;
    else if (freq === "yearly") n = 1 / 12;

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

module.exports = {
  normalizeRoiType,
  getMonthlyRate,
  calculateInterest,
  calculateFirstMonthInterest,
};
