"use strict";

const fs = require("fs");
const path = require("path");
const {
  normalizeForm8LoanType,
  applyForm8LoanTypeToConfig,
} = require("./form8LoanType");
const { applyFinanceAgreementCanvas } = require("./financeAgreementCanvas");
const { applyLoanAgreementCanvas } = require("./loanAgreementCanvas");

const LOAN_META_PATH = path.join(__dirname, "../common/template/agreement/loan-default.json");
const FINANCE_META_PATH = path.join(__dirname, "../common/template/agreement/finance-default.json");

const normalizeAgreementType = (type) =>
  String(type || "Loan").trim() === "Finance" ? "Finance" : "Loan";

const loadMeta = (type) => {
  const file = normalizeAgreementType(type) === "Finance" ? FINANCE_META_PATH : LOAN_META_PATH;
  return JSON.parse(fs.readFileSync(file, "utf8"));
};

const mergeFirmName = (config, firmName = "") => {
  const next = JSON.parse(JSON.stringify(config));
  const replaceFirm = (val) =>
    typeof val === "string"
      ? val.replace(/\{\{firm_name\}\}/g, firmName || "{{firm_name}}")
      : val;
  next.headerNote = replaceFirm(next.headerNote || "");
  next.footerNote = replaceFirm(next.footerNote || "");
  next.termsAndConditions = replaceFirm(next.termsAndConditions || "");
  next.declarationText = replaceFirm(next.declarationText || "");
  return next;
};

/** Builder-ready agreement config (canvas + JSON) for seeding and normalize. */
const buildAgreementBuilderConfig = (
  agreementType = "Loan",
  loanType = "secured",
  firmName = ""
) => {
  const docType = normalizeAgreementType(agreementType);
  const meta = loadMeta(docType);
  const resolvedLoanType =
    docType === "Finance" ? "secured" : normalizeForm8LoanType(loanType);

  let merged = {
    title: meta.title || "LOAN AGREEMENT",
    subtitle: meta.subtitle || "",
    complianceReference: meta.complianceReference || "",
    headerNote: meta.headerNote || "",
    footerNote: meta.footerNote || "",
    termsAndConditions: meta.termsAndConditions || "",
    declarationText: meta.declarationText || "",
    signatureLabels: { ...(meta.signatureLabels || {}) },
    variables: meta.variables?.length ? meta.variables : [],
    theme: { ...(meta.theme || {}) },
    layout: { ...(meta.layout || {}) },
    sections: Array.isArray(meta.sections) ? JSON.parse(JSON.stringify(meta.sections)) : [],
    pageSize: meta.pageSize || "A4",
    orientation: meta.orientation || "portrait",
    fontSize: meta.fontSize || "medium",
    showPageNumbers: meta.showPageNumbers !== false,
    agreementDocumentType: docType,
    loanType: resolvedLoanType,
    canvasLayout: "free",
    singlePageLayout: true,
    form8AllDescFields: false,
    builderBlockOrder: [],
    blockLayouts: {},
    assets: {},
  };

  merged = mergeFirmName(merged, firmName);

  if (docType === "Finance") {
    merged = applyForm8LoanTypeToConfig(merged, "unsecured");
    merged.loanType = "secured";
    merged.agreementDocumentType = "Finance";
    merged = applyFinanceAgreementCanvas(merged);
  } else {
    merged = applyForm8LoanTypeToConfig(merged, resolvedLoanType);
    merged = applyLoanAgreementCanvas(merged, resolvedLoanType);
  }
  return merged;
};

module.exports = {
  normalizeAgreementType,
  buildAgreementBuilderConfig,
};
