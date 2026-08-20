"use strict";

const fs = require("fs");
const path = require("path");
const { getTenantPrisma } = require("../../utils/tenantPrisma");

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

/**
 * Seed default form template for one firm (idempotent — one template per firm).
 */
const seedFormTemplateForFirm = async (target, { ownId, firmId, firmName = "" }) => {
  if (!ownId || !firmId) {
    throw new Error("ownId and firmId are required to seed form template");
  }

  let prisma = target;

  if (typeof target === "string") {
    prisma = getTenantPrisma(target);
  } else if (!target?.formTemplate) {
    throw new Error("Invalid Prisma client for form template seeding");
  }

  const seed = loadDefaultConfig();
  const config = mergeConfig(seed, firmName);

  const existing = await prisma.formTemplate.findFirst({
      where: { ft_firm_id: firmId, ft_is_deleted: false },
    });

    if (existing) {
      return { created: false, updated: false, skipped: true, uuid: existing.ft_uuid };
    }

    const row = await prisma.formTemplate.create({
      data: {
        ft_own_id: ownId,
        ft_firm_id: firmId,
        ft_config: config,
        ft_is_system: true,
        ft_status: "Active",
        ft_created_by: "system",
      },
    });

    return { created: true, updated: false, skipped: false, uuid: row.ft_uuid };
};

/**
 * Seed form templates for every non-deleted firm in a tenant DB.
 */
const seedFormTemplatesForTenant = async (dbUrl) => {
  const prisma = getTenantPrisma(dbUrl);

  try {
    const firms = await prisma.firm.findMany({
      where: { firm_is_deleted: false },
      select: { firm_id: true, firm_own_id: true, firm_name: true },
    });

    let created = 0;
    let skipped = 0;

    for (const firm of firms) {
      const result = await seedFormTemplateForFirm(prisma, {
        ownId: firm.firm_own_id,
        firmId: firm.firm_id,
        firmName: firm.firm_name,
      });
      if (result.created) created += 1;
      else skipped += 1;
    }

    console.log(
      `✅  Seeded form templates for ${firms.length} firm(s) (${created} new, ${skipped} existing).`
    );
    return { firms: firms.length, created, skipped };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  loadDefaultConfig,
  seedFormTemplateForFirm,
  seedFormTemplatesForTenant,
};
