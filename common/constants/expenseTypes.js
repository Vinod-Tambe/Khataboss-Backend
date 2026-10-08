"use strict";

const EXPENSE_TYPE_OPTIONS = [
  { code: "PERSONAL", label: "Personal Expense" },
  { code: "JOURNAL", label: "Journal Expense" },
  { code: "BUSINESS", label: "Business Expense" },
  { code: "OFFICE", label: "Office Expense" },
];

const DEFAULT_EXPENSE_TYPE_CODE = "PERSONAL";

function resolveExpenseTypePanel(input) {
  const raw = String(input ?? "").trim();
  if (!raw) {
    return EXPENSE_TYPE_OPTIONS.find((o) => o.code === DEFAULT_EXPENSE_TYPE_CODE).label;
  }
  const upper = raw.toUpperCase();
  const byCode = EXPENSE_TYPE_OPTIONS.find((o) => o.code === upper);
  if (byCode) return byCode.label;
  const byLabel = EXPENSE_TYPE_OPTIONS.find(
    (o) => o.label.toLowerCase() === raw.toLowerCase()
  );
  if (byLabel) return byLabel.label;
  return EXPENSE_TYPE_OPTIONS.find((o) => o.code === DEFAULT_EXPENSE_TYPE_CODE).label;
}

function formatExpenseNarrationWithType(narration, panelName) {
  const type = expenseTypeLabelFromPanel(panelName);
  const text = String(narration ?? "").trim();
  if (!text || text === "-") return `(${type})`;
  return `${text} (${type})`;
}

function expenseTypeLabelFromPanel(panelName) {
  const raw = String(panelName ?? "").trim();
  if (!raw) return resolveExpenseTypePanel(null);
  const byLabel = EXPENSE_TYPE_OPTIONS.find(
    (o) => o.label.toLowerCase() === raw.toLowerCase()
  );
  return byLabel ? byLabel.label : raw;
}

module.exports = {
  EXPENSE_TYPE_OPTIONS,
  DEFAULT_EXPENSE_TYPE_CODE,
  resolveExpenseTypePanel,
  expenseTypeLabelFromPanel,
  formatExpenseNarrationWithType,
};
