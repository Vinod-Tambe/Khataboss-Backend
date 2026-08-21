"use strict";

const { getTenantPrisma } = require("../../utils/tenantPrisma");
const { loadDefaultConfig, normalizeType } = require("../../utils/agreementTemplateConfig");

const AGREEMENT_TYPES = ["Loan", "Finance"];

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

const seedAgreementTemplateForFirm = async (target, { ownId, firmId, firmName = "", type = "Loan" }) => {
  if (firmId == null || ownId == null) {
    throw new Error("ownId and firmId are required to seed agreement template");
  }

  const agreementType = normalizeType(type);
  let prisma = target;

  if (typeof target === "string") {
    prisma = getTenantPrisma(target);
  } else if (!target?.agreementTemplate) {
    throw new Error("Invalid Prisma client for agreement template seeding");
  }

  const seed = loadDefaultConfig(agreementType);
  const config = mergeConfig(seed, firmName);

  const existing = await prisma.agreementTemplate.findFirst({
    where: {
      at_firm_id: firmId,
      at_type: agreementType,
      at_is_deleted: false,
    },
  });

  if (existing) {
    return { created: false, updated: false, skipped: true, uuid: existing.at_uuid, type: agreementType };
  }

  const row = await prisma.agreementTemplate.create({
    data: {
      at_own_id: ownId,
      at_firm_id: firmId,
      at_type: agreementType,
      at_config: config,
      at_is_system: true,
      at_status: "Active",
      at_created_by: "system",
    },
  });

  return { created: true, updated: false, skipped: false, uuid: row.at_uuid, type: agreementType };
};

const seedAgreementTemplatesForFirm = async (target, { ownId, firmId, firmName = "" }) => {
  const results = [];
  for (const type of AGREEMENT_TYPES) {
    const result = await seedAgreementTemplateForFirm(target, { ownId, firmId, firmName, type });
    results.push(result);
  }
  return results;
};

const seedAgreementTemplatesForTenant = async (dbUrl) => {
  const prisma = getTenantPrisma(dbUrl);

  const firms = await prisma.firm.findMany({
    where: { firm_is_deleted: false },
    select: { firm_id: true, firm_own_id: true, firm_name: true },
  });

  let created = 0;
  let skipped = 0;

  for (const firm of firms) {
    const results = await seedAgreementTemplatesForFirm(prisma, {
      ownId: firm.firm_own_id,
      firmId: firm.firm_id,
      firmName: firm.firm_name,
    });
    results.forEach((result) => {
      if (result.created) created += 1;
      else skipped += 1;
    });
  }

  console.log(
    `✅  Seeded agreement templates for ${firms.length} firm(s) (${created} new, ${skipped} existing).`
  );
  return { firms: firms.length, created, skipped };
};

module.exports = {
  AGREEMENT_TYPES,
  seedAgreementTemplateForFirm,
  seedAgreementTemplatesForFirm,
  seedAgreementTemplatesForTenant,
};
