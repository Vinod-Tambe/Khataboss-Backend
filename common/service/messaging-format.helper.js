"use strict";

function formatInr(amount) {
  const n = Number(amount) || 0;
  return `₹ ${n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDisplayDate(value) {
  if (!value) return "—";
  const dt = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(dt.getTime())) return String(value);
  return dt.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function buildCustomerName(user) {
  if (!user) return "Customer";
  const name = `${user.user_first_name || ""} ${user.user_last_name || ""}`.trim();
  return name || "Customer";
}

function buildLoanRef(girvi = {}) {
  return (
    girvi.girv_unique_code ||
    girvi.girv_loan_no ||
    girvi.girv_packet_no ||
    (girvi.girv_id != null ? String(girvi.girv_id) : "—")
  );
}

function buildFinanceRef(finance = {}) {
  return finance.fin_unique_code || (finance.fin_id != null ? String(finance.fin_id) : "—");
}

/** Standard WhatsApp template vars: 1=name, 2=ref, 3=amount/detail, 4=date */
function buildStandardVars(user, ref, amount, dateValue) {
  return {
    1: buildCustomerName(user),
    2: ref,
    3: typeof amount === "number" || /^[\d.]+$/.test(String(amount))
      ? formatInr(amount)
      : String(amount ?? "—"),
    4: formatDisplayDate(dateValue),
  };
}

module.exports = {
  formatInr,
  formatDisplayDate,
  buildCustomerName,
  buildLoanRef,
  buildFinanceRef,
  buildStandardVars,
};
