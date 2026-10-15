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
const { normalizeForm8LoanType } = require("../../../utils/form8LoanType");

const mapTemplate = (row, firm = null) => {
  if (!row) return null;
  const type = normalizeType(row.at_type);
  const loanType = normalizeForm8LoanType(row.at_loan_type);
  const config = normalizeAgreementTemplateConfig(row.at_config || {}, type, loanType);
  return {
    id: row.at_uuid,
    uuid: row.at_uuid,
    firmId: row.at_firm_id,
    ownId: row.at_own_id,
    type,
    loanType,
    title: config.title || (type === "Finance" ? "FINANCE AGREEMENT" : "LOAN AGREEMENT"),
    subtitle: config.subtitle || "",
    config,
    status: row.at_status,
    isSystem: Boolean(row.at_is_system),
    firmName: firm?.firm_name || "",
    firmRegNo: firm?.firm_reg_no || "",
    html: row.at_html || "",
    printHtml: row.at_html || "",
    updatedAt: row.at_updated_at,
    createdAt: row.at_created_at,
  };
};

class AgreementTemplateService {
  async ensureFirmTemplate(dbUrl, { ownId, firmId, firmName, type, loanType }) {
    return seedAgreementTemplateForFirm(dbUrl, {
      ownId,
      firmId,
      firmName,
      type,
      loanType,
    });
  }

  async ensureFirmTemplates(dbUrl, { ownId, firmId, firmName }) {
    return seedAgreementTemplatesForFirm(dbUrl, { ownId, firmId, firmName });
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
      const resolvedOwnId = firm.firm_own_id ?? ownId;
      try {
        await this.ensureFirmTemplates(dbUrl, {
          ownId: resolvedOwnId,
          firmId: firm.firm_id,
          firmName: firm.firm_name,
        });
      } catch (seedErr) {
        console.warn(
          `Agreement template seed skipped for firm ${firm.firm_id}:`,
          seedErr.message
        );
      }

      const rows = await prisma.agreementTemplate.findMany({
        where: { at_firm_id: firm.firm_id, at_is_deleted: false },
        orderBy: [{ at_type: "asc" }, { at_loan_type: "asc" }],
      });

      rows.forEach((row) => results.push(mapTemplate(row, firm)));
    }

    return results.filter(Boolean);
  }

  async getTemplateByFirm(dbUrl, firmId, type, { ownId, firmName, loanType } = {}) {
    const prisma = getTenantPrisma(dbUrl);
    const firmIdInt = parseInt(firmId, 10);
    const agreementType = normalizeType(type);
    const resolvedLoanType =
      agreementType === "Finance" ? "secured" : normalizeForm8LoanType(loanType);

    await this.ensureFirmTemplate(dbUrl, {
      ownId,
      firmId: firmIdInt,
      firmName: firmName || "",
      type: agreementType,
      loanType: resolvedLoanType,
    });

    const row = await prisma.agreementTemplate.findFirst({
      where: {
        at_firm_id: firmIdInt,
        at_type: agreementType,
        at_loan_type: resolvedLoanType,
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

    const merged = normalizeAgreementTemplateConfig(
      config,
      existing.at_type,
      existing.at_loan_type
    );

    const status =
      payload.status === "Inactive" || payload.at_status === "Inactive"
        ? "Inactive"
        : "Active";

    const htmlRaw = payload.html != null ? payload.html : payload.printHtml;
    const html =
      htmlRaw == null || htmlRaw === ""
        ? existing.at_html || ""
        : String(htmlRaw);

    const updated = await prisma.agreementTemplate.update({
      where: { at_uuid: uuid },
      data: {
        at_config: merged,
        at_html: html,
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
