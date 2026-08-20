"use strict";

const { getTenantPrisma } = require("../../../utils/tenantPrisma");
const {
  seedFormTemplateForFirm,
} = require("../../../prisma/seeder/form-template-seeder");
const {
  loadDefaultConfig,
  normalizeFormTemplateConfig,
} = require("../../../utils/formTemplateConfig");

const mapTemplate = (row, firm = null) => {
  if (!row) return null;
  const config = normalizeFormTemplateConfig(row.ft_config || {}, loadDefaultConfig());
  return {
    id: row.ft_uuid,
    uuid: row.ft_uuid,
    firmId: row.ft_firm_id,
    ownId: row.ft_own_id,
    title: config.title || "FORM 8",
    subtitle: config.subtitle || "",
    config,
    status: row.ft_status,
    isSystem: Boolean(row.ft_is_system),
    firmName: firm?.firm_name || "",
    firmRegNo: firm?.firm_reg_no || "",
    updatedAt: row.ft_updated_at,
    createdAt: row.ft_created_at,
  };
};

class FormTemplateService {
  async ensureFirmTemplate(dbUrl, { ownId, firmId, firmName }) {
    return seedFormTemplateForFirm(dbUrl, { ownId, firmId, firmName });
  }

  async listTemplates(dbUrl, { ownId } = {}) {
    const prisma = getTenantPrisma(dbUrl);

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
      await this.ensureFirmTemplate(dbUrl, {
        ownId: firm.firm_own_id || ownId,
        firmId: firm.firm_id,
        firmName: firm.firm_name,
      });

      const row = await prisma.formTemplate.findFirst({
        where: { ft_firm_id: firm.firm_id, ft_is_deleted: false },
      });

      results.push(mapTemplate(row, firm));
    }

    return results;
  }

  async getTemplateByFirm(dbUrl, firmId, { ownId, firmName } = {}) {
    const prisma = getTenantPrisma(dbUrl);
    const firmIdInt = parseInt(firmId, 10);

    await this.ensureFirmTemplate(dbUrl, {
      ownId,
      firmId: firmIdInt,
      firmName: firmName || "",
    });

    const row = await prisma.formTemplate.findFirst({
      where: { ft_firm_id: firmIdInt, ft_is_deleted: false },
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
    const row = await prisma.formTemplate.findFirst({
      where: { ft_uuid: uuid, ft_is_deleted: false },
    });
    if (!row) return null;

    const firm = await prisma.firm.findFirst({
      where: { firm_id: row.ft_firm_id, firm_is_deleted: false },
      select: { firm_name: true, firm_reg_no: true },
    });

    return mapTemplate(row, firm);
  }

  async updateTemplate(dbUrl, uuid, payload, updatedBy = null) {
    const prisma = getTenantPrisma(dbUrl);
    const existing = await prisma.formTemplate.findFirst({
      where: { ft_uuid: uuid, ft_is_deleted: false },
    });

    if (!existing) {
      throw new Error("Form template not found");
    }

    let config = payload.config || payload.ft_config;
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

    const defaultConfig = loadDefaultConfig();
    const merged = normalizeFormTemplateConfig(config, defaultConfig);

    const status =
      payload.status === "Inactive" || payload.ft_status === "Inactive"
        ? "Inactive"
        : "Active";

    const updated = await prisma.formTemplate.update({
      where: { ft_uuid: uuid },
      data: {
        ft_config: merged,
        ft_status: status,
        ft_updated_by: updatedBy,
      },
    });

    const firm = await prisma.firm.findFirst({
      where: { firm_id: updated.ft_firm_id, firm_is_deleted: false },
      select: { firm_name: true, firm_reg_no: true },
    });

    return mapTemplate(updated, firm);
  }
}

module.exports = new FormTemplateService();
