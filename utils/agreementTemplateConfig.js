"use strict";

const fs = require("fs");
const path = require("path");
const { normalizeFormTemplateConfig } = require("./formTemplateConfig");
const {
  buildAgreementBuilderConfig,
  normalizeAgreementType,
} = require("./agreementBuilderConfig");
const { normalizeForm8LoanType, applyForm8LoanTypeToConfig } = require("./form8LoanType");
const { applyFinanceAgreementCanvas } = require("./financeAgreementCanvas");
const { applyLoanAgreementCanvas } = require("./loanAgreementCanvas");

const LOAN_DEFAULT_PATH = path.join(__dirname, "../common/template/agreement/loan-default.json");
const FINANCE_DEFAULT_PATH = path.join(__dirname, "../common/template/agreement/finance-default.json");

const cachedDefaults = {};

const normalizeType = normalizeAgreementType;

const getDefaultPath = (type) =>
  normalizeType(type) === "Finance" ? FINANCE_DEFAULT_PATH : LOAN_DEFAULT_PATH;

const loadLegacyMeta = (type = "Loan") => {
  const key = normalizeType(type);
  if (cachedDefaults[`meta_${key}`]) return cachedDefaults[`meta_${key}`];
  cachedDefaults[`meta_${key}`] = JSON.parse(fs.readFileSync(getDefaultPath(key), "utf8"));
  return cachedDefaults[`meta_${key}`];
};

const loadDefaultConfig = (type = "Loan", loanType = "secured") => {
  const key = `${normalizeType(type)}_${normalizeForm8LoanType(loanType)}`;
  if (cachedDefaults[key]) return cachedDefaults[key];
  cachedDefaults[key] = buildAgreementBuilderConfig(type, loanType);
  return cachedDefaults[key];
};

const normalizeAgreementTemplateConfig = (config, type = "Loan", loanType = "secured") => {
  const docType = normalizeType(type);
  const resolvedLoanType =
    docType === "Finance" ? "secured" : normalizeForm8LoanType(loanType || config?.loanType);
  const defaults = loadDefaultConfig(docType, resolvedLoanType);

  let merged = normalizeFormTemplateConfig(
    {
      ...defaults,
      ...config,
      agreementDocumentType: docType,
      loanType: resolvedLoanType,
    },
    defaults
  );

  if (docType === "Finance") {
    merged = applyFinanceAgreementCanvas(merged);
  } else {
    merged.agreementDocumentType = "Loan";
    merged = applyLoanAgreementCanvas(merged, resolvedLoanType);
  }

  const meta = loadLegacyMeta(docType);
  merged.title = merged.title || meta.title;
  merged.subtitle = merged.subtitle || meta.subtitle;
  return merged;
};

module.exports = {
  normalizeType,
  loadLegacyMeta,
  loadDefaultConfig,
  normalizeAgreementTemplateConfig,
};
