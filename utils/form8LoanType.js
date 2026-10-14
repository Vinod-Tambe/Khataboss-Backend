"use strict";

const FORM8_LOAN_TYPES = ["secured", "unsecured"];
const FORM8_STOCK_BLOCK_ID = "stock_line_items";

const normalizeForm8LoanType = (value) =>
  String(value || "").toLowerCase() === "unsecured" ? "unsecured" : "secured";

const getForm8LoanTypeLabel = (value) =>
  normalizeForm8LoanType(value) === "unsecured" ? "Unsecured" : "Secured";

const stripForm8StockBlocks = (order = []) =>
  (Array.isArray(order) ? order : []).filter((id) => id !== FORM8_STOCK_BLOCK_ID);

const ensureForm8StockBlock = (order = []) => {
  const next = Array.isArray(order) ? [...order] : [];
  if (next.includes(FORM8_STOCK_BLOCK_ID)) return next;
  const loanIdx = next.indexOf("section:loan_details");
  if (loanIdx >= 0) {
    next.splice(loanIdx + 1, 0, FORM8_STOCK_BLOCK_ID);
    return next;
  }
  const termsIdx = next.indexOf("form_terms");
  if (termsIdx >= 0) {
    next.splice(termsIdx, 0, FORM8_STOCK_BLOCK_ID);
    return next;
  }
  next.push(FORM8_STOCK_BLOCK_ID);
  return next;
};

const applyForm8LoanTypeToConfig = (config, loanType) => {
  const next = JSON.parse(JSON.stringify(config || {}));
  const type = normalizeForm8LoanType(loanType);
  next.loanType = type;
  next.layout = { ...(next.layout || {}) };

  if (type === "unsecured") {
    next.builderBlockOrder = stripForm8StockBlocks(next.builderBlockOrder || []);
    next.layout.showStockItemImages = false;
    const stockY = next.blockLayouts?.[FORM8_STOCK_BLOCK_ID]?.posYPct;
    if (stockY != null && next.blockLayouts?.form_terms?.posYPct != null) {
      const shift = Number(next.blockLayouts.form_terms.posYPct) - Number(stockY);
      if (Number.isFinite(shift) && shift > 0) {
        ["form_terms", "form_footer", "layout_footer_image", "signature_lines"].forEach((id) => {
          if (next.blockLayouts[id]?.posYPct != null) {
            next.blockLayouts[id].posYPct = Number(next.blockLayouts[id].posYPct) - shift;
          }
        });
      }
    }
  } else {
    next.builderBlockOrder = ensureForm8StockBlock(next.builderBlockOrder || []);
    if (next.layout.showStockItemImages === undefined) {
      next.layout.showStockItemImages = true;
    }
  }

  return next;
};

module.exports = {
  FORM8_LOAN_TYPES,
  FORM8_STOCK_BLOCK_ID,
  normalizeForm8LoanType,
  getForm8LoanTypeLabel,
  stripForm8StockBlocks,
  ensureForm8StockBlock,
  applyForm8LoanTypeToConfig,
};
