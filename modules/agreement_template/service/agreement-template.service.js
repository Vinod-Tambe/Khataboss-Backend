"use strict";

const { getTenantPrisma } = require("../../../utils/tenantPrisma");
const {
  seedAgreementTemplateForFirm,
  seedAgreementTemplatesForFirm,
} = require("../../../prisma/seeder/agreement-template-seeder");
const {
  normalizeAgreementTemplateConfig,
  normalizeType,
} = require("../../../utils/agreementTemplateConfig");

const isMissingTableError = (error) => {
  const message = String(error?.message || "");
  return (
    message.includes("agreement_templates") &&
    (message.includes("does not exist") || message.includes("doesn't exist"))
  );
};

const mapTemplate = (row, firm = null) => {
  if (!row) return null;
  const type = normalizeType(row.at_type);
  const config = normalizeAgreementTemplateConfig(row.at_config || {}, type);
  return {
    id: row.at_uuid,
    uuid: row.at_uuid,
    firmId: row.at_firm_id,
    ownId: row.at_own_id,
    type,
    title: config.title || (type === "Finance" ? "FINANCE AGREEMENT" : "LOAN AGREEMENT"),
    subtitle: config.subtitle || "",
    config,
    status: row.at_status,
    isSystem: Boolean(row.at_is_system),
    firmName: firm?.firm_name || "",
    firmRegNo: firm?.firm_reg_no || "",
    updatedAt: row.at_updated_at,
    createdAt: row.at_created_at,
  };
};

class AgreementTemplateService {
  async ensureFirmTemplate(dbUrl, { ownId, firmId, firmName, type }) {
    return seedAgreementTemplateForFirm(dbUrl, { ownId, firmId, firmName, type });
  }

  async ensureFirmTemplates(dbUrl, { ownId, firmId, firmName }) {
    return seedAgreementTemplatesForFirm(dbUrl, { ownId, firmId, firmName });
  }

  async listTemplates(dbUrl, { ownId, type } = {}) {
    const prisma = getTenantPrisma(dbUrl);
    const agreementType = type ? normalizeType(type) : null;

    const firms = await prisma.firm.findMany({
      where: { firm_is_deleted: false },
      select: {
        firm_id: true,
        firm_own_id: true,
        firm_name: true,
        firm_reg_no: true,
        firm_shop_name: true,
      },
      orderBy: { firm_name: "asc" },
    });

    const results = [];

    for (const firm of firms) {
      const resolvedOwnId = firm.firm_own_id ?? ownId;

      try {
        if (agreementType) {
          await this.ensureFirmTemplate(dbUrl, {
            ownId: resolvedOwnId,
            firmId: firm.firm_id,
            firmName: firm.firm_name,
            type: agreementType,
          });
        } else {
          await this.ensureFirmTemplates(dbUrl, {
            ownId: resolvedOwnId,
            firmId: firm.firm_id,
            firmName: firm.firm_name,
          });
        }
      } catch (seedErr) {
        console.warn(
          `Agreement template seed skipped for firm ${firm.firm_id}:`,
          seedErr.message
        );
      }

      try {
        if (agreementType) {
          const row = await prisma.agreementTemplate.findFirst({
            where: {
              at_firm_id: firm.firm_id,
              at_type: agreementType,
              at_is_deleted: false,
            },
          });
          results.push(mapTemplate(row, firm));
        } else {
          const rows = await prisma.agreementTemplate.findMany({
            where: {
              at_firm_id: firm.firm_id,
              at_is_deleted: false,
            },
            orderBy: { at_type: "asc" },
          });

          if (rows.length) {
            rows.forEach((row) => results.push(mapTemplate(row, firm)));
          } else {
            results.push(mapTemplate(null, firm));
          }
        }
      } catch (queryErr) {
        if (isMissingTableError(queryErr)) {
          throw new Error(
            "Agreement templates table is missing. Run: node scripts/sync-tenants.js"
          );
        }
        throw queryErr;
      }
    }

    return results.filter(Boolean);
  }

  async getTemplateByFirm(dbUrl, firmId, type, { ownId, firmName } = {}) {
    const prisma = getTenantPrisma(dbUrl);
    const firmIdInt = parseInt(firmId, 10);
    const agreementType = normalizeType(type);

    await this.ensureFirmTemplate(dbUrl, {
      ownId,
      firmId: firmIdInt,
      firmName: firmName || "",
      type: agreementType,
    });

    const row = await prisma.agreementTemplate.findFirst({
      where: {
        at_firm_id: firmIdInt,
        at_type: agreementType,
        at_is_deleted: false,
      },
    });

    if (!row) return null;

    const firm = await prisma.firm.findFirst({
      where: { firm_id: firmIdInt, firm_is_deleted: false },
      select: { firm_name: true, firm_reg_no: true },
    });

    return mapTemplate(row, firm);
  }

  async getTemplateByUuid(dbUrl, uuid) {
    const prisma = getTenantPrisma(dbUrl);
    const row = await prisma.agreementTemplate.findFirst({
      where: { at_uuid: uuid, at_is_deleted: false },
    });
    if (!row) return null;

    const firm = await prisma.firm.findFirst({
      where: { firm_id: row.at_firm_id, firm_is_deleted: false },
      select: { firm_name: true, firm_reg_no: true },
    });

    return mapTemplate(row, firm);
  }

  async updateTemplate(dbUrl, uuid, payload, updatedBy = null) {
    const prisma = getTenantPrisma(dbUrl);
    const existing = await prisma.agreementTemplate.findFirst({
      where: { at_uuid: uuid, at_is_deleted: false },
    });

    if (!existing) {
      throw new Error("Agreement template not found");
    }

    let config = payload.config || payload.at_config;
    if (typeof config === "string") {
      try {
        config = JSON.parse(config);
      } catch {
        throw new Error("Invalid template configuration JSON");
      }
    }

    if (!config || typeof config !== "object") {
      throw new Error("Template configuration is required");
    }

    const merged = normalizeAgreementTemplateConfig(config, existing.at_type);

    const status =
      payload.status === "Inactive" || payload.at_status === "Inactive"
        ? "Inactive"
        : "Active";

    const updated = await prisma.agreementTemplate.update({
      where: { at_uuid: uuid },
      data: {
        at_config: merged,
        at_status: status,
        at_updated_by: updatedBy,
      },
    });

    const firm = await prisma.firm.findFirst({
      where: { firm_id: updated.at_firm_id, firm_is_deleted: false },
      select: { firm_name: true, firm_reg_no: true },
    });

    return mapTemplate(updated, firm);
  }
}

module.exports = new AgreementTemplateService();
