"use strict";

const fs = require("fs");
const path = require("path");
const { normalizeFormTemplateConfig } = require("./formTemplateConfig");

const LOAN_DEFAULT_PATH = path.join(__dirname, "../common/template/agreement/loan-default.json");
const FINANCE_DEFAULT_PATH = path.join(__dirname, "../common/template/agreement/finance-default.json");

const cachedDefaults = {};

const normalizeType = (type) => {
  const value = String(type || "Loan").trim();
  return value === "Finance" ? "Finance" : "Loan";
};

const getDefaultPath = (type) =>
  normalizeType(type) === "Finance" ? FINANCE_DEFAULT_PATH : LOAN_DEFAULT_PATH;

const loadDefaultConfig = (type = "Loan") => {
  const key = normalizeType(type);
  if (cachedDefaults[key]) return cachedDefaults[key];
  cachedDefaults[key] = JSON.parse(fs.readFileSync(getDefaultPath(key), "utf8"));
  return cachedDefaults[key];
};

const normalizeAgreementTemplateConfig = (config, type = "Loan") => {
  const defaults = loadDefaultConfig(type);
  return normalizeFormTemplateConfig(config, defaults);
};

module.exports = {
  normalizeType,
  loadDefaultConfig,
  normalizeAgreementTemplateConfig,
};
