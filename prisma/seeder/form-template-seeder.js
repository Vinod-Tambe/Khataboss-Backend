"use strict";

const fs = require("fs");
const path = require("path");
const { getTenantPrisma } = require("../../utils/tenantPrisma");
const {
  FORM8_LOAN_TYPES,
  normalizeForm8LoanType,
  applyForm8LoanTypeToConfig,
} = require("../../utils/form8LoanType");
const { buildFormTemplatePrintHtml } = require("../../utils/buildFormTemplatePrintHtml");

const DEFAULT_PATH = path.join(__dirname, "../../common/template/form/default.json");

const loadDefaultConfig = () => {
  const raw = fs.readFileSync(DEFAULT_PATH, "utf8");
  return JSON.parse(raw);
};

const mergeConfig = (seed, firmName = "") => {
  const config = JSON.parse(JSON.stringify(seed));
  const replaceFirm = (val) =>
    typeof val === "string"
      ? val.replace(/\{\{firm_name\}\}/g, firmName || "{{firm_name}}")
      : val;

  config.headerNote = replaceFirm(config.headerNote || "");
  config.footerNote = replaceFirm(config.footerNote || "");
  config.termsAndConditions = replaceFirm(config.termsAndConditions || "");
  config.declarationText = replaceFirm(config.declarationText || "");
  return config;
};

const buildConfigForLoanType = (seed, firmName, loanType) =>
  applyForm8LoanTypeToConfig(mergeConfig(seed, firmName), loanType);

/**
 * Seed one Form 8 template (secured or unsecured) for a firm.
 */
const seedFormTemplateForFirmType = async (
  target,
  { ownId, firmId, firmName = "", loanType = "secured" }
) => {
  if (!ownId || !firmId) {
    throw new Error("ownId and firmId are required to seed form template");
  }

  const type = normalizeForm8LoanType(loanType);
  let prisma = target;

  if (typeof target === "string") {
    prisma = getTenantPrisma(target);
  } else if (!target?.formTemplate) {
    throw new Error("Invalid Prisma client for form template seeding");
  }

  const existing = await prisma.formTemplate.findFirst({
    where: { ft_firm_id: firmId, ft_loan_type: type, ft_is_deleted: false },
  });

  if (existing) {
    return { created: false, updated: false, skipped: true, uuid: existing.ft_uuid, loanType: type };
  }

  const seed = loadDefaultConfig();
  const config = buildConfigForLoanType(seed, firmName, type);

  const row = await prisma.formTemplate.create({
    data: {
      ft_own_id: ownId,
      ft_firm_id: firmId,
      ft_loan_type: type,
      ft_config: config,
      ft_html: buildFormTemplatePrintHtml(config, { firmName }),
      ft_is_system: true,
      ft_status: "Active",
      ft_created_by: "system",
      ft_updated_by: "system",
    },
  });

  return { created: true, updated: false, skipped: false, uuid: row.ft_uuid, loanType: type };
};

/**
 * Seed both Form 8 templates for one firm (secured + unsecured).
 */
const seedFormTemplateForFirm = async (target, { ownId, firmId, firmName = "" }) => {
  const results = [];
  for (const loanType of FORM8_LOAN_TYPES) {
    results.push(await seedFormTemplateForFirmType(target, { ownId, firmId, firmName, loanType }));
  }
  return {
    created: results.some((r) => r.created),
    updated: results.some((r) => r.updated),
    skipped: results.every((r) => r.skipped),
    results,
  };
};

/**
 * Seed form templates for every non-deleted firm in a tenant DB.
 */
const seedFormTemplatesForTenant = async (dbUrl) => {
  const prisma = getTenantPrisma(dbUrl);

  const firms = await prisma.firm.findMany({
    where: { firm_is_deleted: false },
    select: { firm_id: true, firm_own_id: true, firm_name: true },
  });

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const firm of firms) {
    const result = await seedFormTemplateForFirm(prisma, {
      ownId: firm.firm_own_id,
      firmId: firm.firm_id,
      firmName: firm.firm_name,
    });
    (result.results || []).forEach((item) => {
      if (item.created) created += 1;
      else if (item.updated) updated += 1;
      else skipped += 1;
    });
  }

  console.log(
    `✅  Seeded form templates for ${firms.length} firm(s) (${created} new, ${updated} refreshed, ${skipped} existing).`
  );
  return { firms: firms.length, created, updated, skipped };
};

module.exports = {
  loadDefaultConfig,
  seedFormTemplateForFirm,
  seedFormTemplateForFirmType,
  seedFormTemplatesForTenant,
};
