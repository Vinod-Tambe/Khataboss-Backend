"use strict";

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const fieldLayoutClass = (layout) => {
  if (layout === "full") return "f8-field f8-field--full";
  if (layout === "small") return "f8-field f8-field--small";
  return "f8-field f8-field--half";
};

const buildFormTemplatePrintHtml = (config, { firmName = "" } = {}) => {
  if (!config) return "";
  const order = Array.isArray(config.builderBlockOrder) ? config.builderBlockOrder : [];
  const layout = config.layout || {};
  const sections = config.sections || [];
  const chunks = [];

  order.forEach((blockId) => {
    const sectionId = String(blockId || "").startsWith("section:")
      ? blockId.slice("section:".length)
      : null;
    if (sectionId) {
      const section = sections.find((s) => s.id === sectionId && s.enabled);
      if (!section) return;
      const fields = (section.fields || [])
        .filter((f) => f.enabled && f.id !== "customer_photo")
        .map(
          (f) =>
            `<div class="${fieldLayoutClass(f.fieldLayout)}"><span class="f8-label">${esc(
              f.label || f.id
            )}</span><span class="f8-value">{{${esc(f.id)}}}</span></div>`
        )
        .join("");
      chunks.push(
        `<section class="f8-block f8-section" data-block-id="${esc(blockId)}"><h3 class="f8-title">${esc(
          section.label || sectionId
        )}</h3><div class="f8-fields">${fields}</div></section>`
      );
      return;
    }

    if (blockId === "form_header") {
      chunks.push(
        `<header class="f8-block f8-header" data-block-id="form_header"><h1>${esc(
          config.title || "FORM 8"
        )}</h1>${config.subtitle ? `<p class="f8-subtitle">${esc(config.subtitle)}</p>` : ""}${
          config.headerNote ? `<p class="f8-note">${config.headerNote}</p>` : ""
        }</header>`
      );
      return;
    }

    if (blockId === "stock_line_items" && config.loanType !== "unsecured") {
      chunks.push(
        `<section class="f8-block" data-block-id="stock_line_items"><h3 class="f8-title">Stock Information</h3>` +
          `<table class="f8-stock" data-role="stock-table"><thead><tr>` +
          `<th>METAL</th><th>ITEM NAME</th><th>QTY</th><th>GS WT</th><th>NT WT</th><th>PURITY</th><th>RATE</th><th>FINE WT</th><th>VALUATION</th>` +
          `</tr></thead><tbody data-role="stock-body"><tr data-role="stock-row-template" hidden>` +
          `<td data-col="metal"></td><td data-col="item_name"></td><td data-col="quantity"></td>` +
          `<td data-col="gs_weight"></td><td data-col="nt_weight"></td><td data-col="purity"></td>` +
          `<td data-col="rate"></td><td data-col="fine_weight"></td><td data-col="valuation"></td>` +
          `</tr></tbody></table></section>`
      );
      return;
    }

    if (blockId === "form_terms" && config.termsAndConditions) {
      chunks.push(
        `<section class="f8-block f8-terms" data-block-id="form_terms"><h3 class="f8-title">Terms &amp; Conditions</h3><p>${esc(
          config.termsAndConditions
        )}</p></section>`
      );
      return;
    }

    if (blockId === "form_footer" && config.footerNote) {
      chunks.push(
        `<section class="f8-block" data-block-id="form_footer"><h3 class="f8-title">${esc(
          config.footerNoteTitle || "Footer note"
        )}</h3><div class="f8-footer-note-body">${esc(config.footerNote)}</div></section>`
      );
      return;
    }

    if (blockId === "signature_lines") {
      chunks.push(
        `<section class="f8-block f8-signatures" data-block-id="signature_lines">` +
          `<div class="f8-sign"><div class="f8-sign-line"></div><div class="f8-sign-name">{{firm_name}}</div></div>` +
          `<div class="f8-sign"><div class="f8-sign-line"></div><div class="f8-sign-name">{{customer_name}}</div></div>` +
          `</section>`
      );
      return;
    }

    if (blockId === "layout_left_logo" && layout.showLeftLogo !== false) {
      chunks.push(
        `<div class="f8-block f8-logo" data-block-id="layout_left_logo"><img data-asset="leftLogo" alt="Left logo" /></div>`
      );
    }
    if (blockId === "layout_right_logo" && layout.showRightLogo !== false) {
      chunks.push(
        `<div class="f8-block f8-logo" data-block-id="layout_right_logo"><img data-asset="rightLogo" alt="Right logo" /></div>`
      );
    }
    if (blockId === "customer_photo" && layout.showCustomerPhoto) {
      chunks.push(
        `<div class="f8-block f8-photo" data-block-id="customer_photo"><img data-asset="customerPhoto" alt="Customer photo" /></div>`
      );
    }
  });

  return (
    `<!DOCTYPE html><html><head><meta charset="utf-8" /><title>${esc(
      config.title || "FORM 8"
    )}</title>` +
    `<style>body{margin:0;font-family:Arial,sans-serif;font-size:9pt;color:#334155}` +
    `.f8-page{width:210mm;min-height:297mm;padding:12mm 14mm;box-sizing:border-box}` +
    `.f8-fields{display:flex;flex-wrap:wrap;gap:4px 8px}` +
    `.f8-field--half{width:calc(50% - 4px)}.f8-field--full{width:100%}` +
    `.f8-title{background:#eef3f8;color:#3d4f63;padding:4px 6px;margin:0 0 6px}` +
    `.f8-stock{width:100%;border-collapse:collapse}.f8-stock th,.f8-stock td{padding:3px}` +
    `.f8-signatures{display:flex;justify-content:space-between;gap:24px;margin-top:16px}` +
    `.f8-sign-line{border-top:1px solid #94a3b8;margin-bottom:4px}</style></head>` +
    `<body><div class="f8-page" data-firm="${esc(firmName)}">${chunks.join("")}</div></body></html>`
  );
};

module.exports = { buildFormTemplatePrintHtml };
