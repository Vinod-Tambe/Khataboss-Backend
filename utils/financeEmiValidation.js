"use strict";

/**
 * Receivable must divide evenly by EMI count (whole rupee per EMI).
 */
function isWholeNumberEmi(receivable, emiCount) {
  const n = parseInt(emiCount, 10) || 0;
  const total = parseFloat(receivable) || 0;
  if (!(total > 0 && n > 0)) return false;
  const receivablePaise = Math.round(total * 100);
  return receivablePaise % n === 0;
}

function getWholeEmiAmount(receivable, emiCount) {
  const n = parseInt(emiCount, 10) || 0;
  const total = parseFloat(receivable) || 0;
  if (!(total > 0 && n > 0)) return 0;
  const receivablePaise = Math.round(total * 100);
  return receivablePaise / n / 100;
}

function assertWholeNumberEmi(receivable, emiCount) {
  const n = parseInt(emiCount, 10) || 0;
  const total = parseFloat(receivable) || 0;
  if (!isWholeNumberEmi(total, n)) {
    throw new Error(
      `Per EMI amount must be a whole number. ${total.toFixed(2)} cannot be divided evenly into ${n} EMIs. Adjust principal, ROI, or EMI count.`
    );
  }
  return getWholeEmiAmount(total, n);
}

module.exports = {
  isWholeNumberEmi,
  getWholeEmiAmount,
  assertWholeNumberEmi,
};
