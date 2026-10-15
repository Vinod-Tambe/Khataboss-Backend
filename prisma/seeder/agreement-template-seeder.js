"use strict";

const { getTenantPrisma } = require("../../utils/tenantPrisma");
const { buildFormTemplatePrintHtml } = require("../../utils/buildFormTemplatePrintHtml");
const {
  buildAgreementBuilderConfig,
  normalizeAgreementType,
} = require("../../utils/agreementBuilderConfig");
const { normalizeForm8LoanType } = require("../../utils/form8LoanType");

const LOAN_VARIANTS = ["secured", "unsecured"];

const seedAgreementTemplateForFirm = async (
  target,
  { ownId, firmId, firmName = "", type = "Loan", loanType = "secured" }
) => {
  if (firmId == null || ownId == null) {
    throw new Error("ownId and firmId are required to seed agreement template");
  }

  const agreementType = normalizeAgreementType(type);
  const resolvedLoanType =
    agreementType === "Finance" ? "secured" : normalizeForm8LoanType(loanType);

  let prisma = target;
  if (typeof target === "string") {
    prisma = getTenantPrisma(target);
  } else if (!target?.agreementTemplate) {
    throw new Error("Invalid Prisma client for agreement template seeding");
  }

  const existing = await prisma.agreementTemplate.findFirst({
    where: {
      at_firm_id: firmId,
      at_type: agreementType,
      at_loan_type: resolvedLoanType,
      at_is_deleted: false,
    },
  });

  if (existing) {
    return {
      created: false,
      updated: false,
      skipped: true,
      uuid: existing.at_uuid,
      type: agreementType,
      loanType: resolvedLoanType,
    };
  }

  const config = buildAgreementBuilderConfig(agreementType, resolvedLoanType, firmName);
  const html = buildFormTemplatePrintHtml(config, { firmName });

  const row = await prisma.agreementTemplate.create({
    data: {
      at_own_id: ownId,
      at_firm_id: firmId,
      at_type: agreementType,
      at_loan_type: resolvedLoanType,
      at_config: config,
      at_html: html,
      at_is_system: true,
      at_status: "Active",
      at_created_by: "system",
    },
  });

  return {
    created: true,
    updated: false,
    skipped: false,
    uuid: row.at_uuid,
    type: agreementType,
    loanType: resolvedLoanType,
  };
};

const seedAgreementTemplatesForFirm = async (target, { ownId, firmId, firmName = "" }) => {
  const results = [];
  for (const loanType of LOAN_VARIANTS) {
    results.push(
      await seedAgreementTemplateForFirm(target, {
        ownId,
        firmId,
        firmName,
        type: "Loan",
        loanType,
      })
    );
  }
  results.push(
    await seedAgreementTemplateForFirm(target, {
      ownId,
      firmId,
      firmName,
      type: "Finance",
      loanType: "secured",
    })
  );
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
  LOAN_VARIANTS,
  seedAgreementTemplateForFirm,
  seedAgreementTemplatesForFirm,
  seedAgreementTemplatesForTenant,
};
