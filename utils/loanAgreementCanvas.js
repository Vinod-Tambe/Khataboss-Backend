"use strict";

const { normalizeForm8LoanType, FORM8_STOCK_BLOCK_ID } = require("./form8LoanType");

const normalizeBuilderBlockOrder = (order = []) => {
  const out = [];
  (Array.isArray(order) ? order : []).forEach((id) => {
    if (!id || id === "layout_logo" || id === "layout_firm_center") return;
    if (!out.includes(id)) out.push(id);
  });
  return out;
};

const LOAN_SECURED_AGREEMENT_BLOCK_ORDER = [
  "layout_left_logo",
  "layout_right_logo",
  "form_header",
  "section:firm_details",
  "section:customer_details",
  "customer_photo",
  "section:loan_details",
  FORM8_STOCK_BLOCK_ID,
  "form_terms",
  "form_footer",
  "signature_lines",
];

const LOAN_UNSECURED_AGREEMENT_BLOCK_ORDER = LOAN_SECURED_AGREEMENT_BLOCK_ORDER.filter(
  (id) => id !== FORM8_STOCK_BLOCK_ID
);

const LOAN_AGREEMENT_SECTIONS_ON_CANVAS = new Set([
  "firm_details",
  "customer_details",
  "loan_details",
]);

const LOAN_AGREEMENT_SECTIONS_OFF_CANVAS = new Set([
  "item_details",
  "interest_summary",
  "transaction_history",
  "redemption_details",
]);

const AGREEMENT_CANVAS_BLOCK_LAYOUTS = {
  layout_left_logo: {
    widthPct: 28,
    heightMm: 14,
    heightMode: "fixed",
    posXPct: 0,
    posYPct: 0,
    freePosition: true,
    hAlign: "left",
  },
  layout_right_logo: {
    widthPct: 24,
    heightMm: 14,
    heightMode: "fixed",
    posXPct: 76,
    posYPct: 0,
    freePosition: true,
    hAlign: "right",
  },
  form_header: {
    widthPct: 100,
    heightMm: 24,
    heightMode: "fixed",
    posXPct: 0,
    posYPct: 5,
    freePosition: true,
  },
  "section:firm_details": {
    widthPct: 100,
    heightMm: 48,
    heightMode: "fixed",
    posXPct: 0,
    posYPct: 14,
    freePosition: true,
  },
  "section:customer_details": {
    widthPct: 100,
    heightMm: 52,
    heightMode: "fixed",
    posXPct: 0,
    posYPct: 34,
    freePosition: true,
  },
  customer_photo: {
    widthPct: 22,
    heightMm: 36,
    heightMode: "fixed",
    posXPct: 78,
    posYPct: 34,
    freePosition: true,
  },
  "section:loan_details": {
    widthPct: 100,
    heightMm: 48,
    heightMode: "fixed",
    posXPct: 0,
    posYPct: 54,
    freePosition: true,
  },
  [FORM8_STOCK_BLOCK_ID]: {
    widthPct: 100,
    heightMm: null,
    heightMode: "auto",
    posXPct: 0,
    posYPct: 72,
    freePosition: true,
  },
  form_terms: {
    widthPct: 100,
    heightMm: 32,
    heightMode: "fixed",
    posXPct: 0,
    posYPct: 88,
    freePosition: true,
  },
  form_footer: {
    widthPct: 100,
    heightMm: 16,
    heightMode: "fixed",
    posXPct: 0,
    posYPct: 98,
    freePosition: true,
  },
  signature_lines: {
    widthPct: 100,
    heightMm: 22,
    heightMode: "fixed",
    posXPct: 0,
    posYPct: 104,
    freePosition: true,
  },
};

const getLoanAgreementBlockOrder = (config) => {
  const loanType = normalizeForm8LoanType(config?.loanType);
  return loanType === "unsecured"
    ? LOAN_UNSECURED_AGREEMENT_BLOCK_ORDER
    : LOAN_SECURED_AGREEMENT_BLOCK_ORDER;
};

const applyLoanAgreementCanvas = (config, loanType = config?.loanType) => {
  if (!config || config.agreementDocumentType === "Finance") return config;

  const next = JSON.parse(JSON.stringify(config));
  const resolved = normalizeForm8LoanType(loanType || next.loanType);
  next.loanType = resolved;
  next.form8AllDescFields = false;

  const targetOrder = getLoanAgreementBlockOrder(next);
  let order = normalizeBuilderBlockOrder(next.builderBlockOrder || []);
  const looksLikeForm8 =
    order.includes("section:transaction_history") ||
    order.includes("section:redemption_details") ||
    next.title === "FORM 8" ||
    !order.length ||
    !order.includes("section:loan_details");

  if (looksLikeForm8) {
    order = [...targetOrder];
  } else if (resolved === "unsecured") {
    order = order.filter((id) => id !== FORM8_STOCK_BLOCK_ID);
    if (!order.includes("section:loan_details")) {
      order = [...LOAN_UNSECURED_AGREEMENT_BLOCK_ORDER];
    }
  } else if (!order.includes(FORM8_STOCK_BLOCK_ID)) {
    order = [...LOAN_SECURED_AGREEMENT_BLOCK_ORDER];
  }

  next.builderBlockOrder = normalizeBuilderBlockOrder(order);

  const layouts = { ...(next.blockLayouts || {}) };
  Object.entries(AGREEMENT_CANVAS_BLOCK_LAYOUTS).forEach(([blockId, defaults]) => {
    if (targetOrder.includes(blockId)) {
      layouts[blockId] = { ...defaults, ...(layouts[blockId] || {}) };
    }
  });
  if (resolved === "unsecured") {
    delete layouts[FORM8_STOCK_BLOCK_ID];
  }
  next.blockLayouts = layouts;

  next.layout = {
    ...(next.layout || {}),
    showStockItemImages: resolved === "secured",
  };

  if (Array.isArray(next.sections)) {
    next.sections = next.sections.map((section) => {
      if (LOAN_AGREEMENT_SECTIONS_ON_CANVAS.has(section.id)) {
        return { ...section, enabled: true };
      }
      if (LOAN_AGREEMENT_SECTIONS_OFF_CANVAS.has(section.id)) {
        return { ...section, enabled: false };
      }
      return section;
    });
  }

  return next;
};

module.exports = {
  LOAN_SECURED_AGREEMENT_BLOCK_ORDER,
  getLoanAgreementBlockOrder,
  applyLoanAgreementCanvas,
};
