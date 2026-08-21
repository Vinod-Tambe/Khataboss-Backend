"use strict";

const agreementTemplateService = require("../service/agreement-template.service");
const { getTenantPrisma } = require("../../../utils/tenantPrisma");
const { BASE_URL } = require("../../../config/db");
const { normalizeType } = require("../../../utils/agreementTemplateConfig");

class AgreementTemplateController {
  getDbUrl(dbName) {
    return `${BASE_URL}/${dbName}`;
  }

  async _resolveFirm(dbUrl, firmId) {
    const prisma = getTenantPrisma(dbUrl);
    return prisma.firm.findFirst({
      where: { firm_id: parseInt(firmId, 10), firm_is_deleted: false },
      select: { firm_id: true, firm_own_id: true, firm_name: true },
    });
  }

  async listTemplates(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const { type } = req.query;

      const templates = await agreementTemplateService.listTemplates(dbUrl, {
        ownId: req.user.own_id,
        type: type ? normalizeType(type) : undefined,
      });

      return res.status(200).json({
        success: true,
        message: "Agreement templates fetched successfully",
        data: templates,
      });
    } catch (error) {
      console.error("List Agreement Templates Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch agreement templates",
        error: error.message,
      });
    }
  }

  async getTemplate(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const { firmId, type } = req.query;

      if (!firmId) {
        return res.status(400).json({
          success: false,
          message: "firmId is required",
        });
      }

      if (!type) {
        return res.status(400).json({
          success: false,
          message: "type is required (Loan or Finance)",
        });
      }

      const firm = await this._resolveFirm(dbUrl, firmId);
      if (!firm) {
        return res.status(404).json({ success: false, message: "Firm not found" });
      }

      const template = await agreementTemplateService.getTemplateByFirm(
        dbUrl,
        firm.firm_id,
        normalizeType(type),
        {
          ownId: firm.firm_own_id || req.user.own_id,
          firmName: firm.firm_name,
        }
      );

      return res.status(200).json({
        success: true,
        message: "Agreement template fetched successfully",
        data: template,
      });
    } catch (error) {
      console.error("Get Agreement Template Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch agreement template",
        error: error.message,
      });
    }
  }

  async updateTemplate(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const { uuid } = req.params;

      const existing = await agreementTemplateService.getTemplateByUuid(dbUrl, uuid);
      if (!existing) {
        return res.status(404).json({ success: false, message: "Agreement template not found" });
      }

      const updatedBy =
        req.user?.own_name || req.user?.own_login_id || req.user?.email || "owner";

      const template = await agreementTemplateService.updateTemplate(
        dbUrl,
        uuid,
        req.body,
        updatedBy
      );

      return res.status(200).json({
        success: true,
        message: "Agreement template updated successfully",
        data: template,
      });
    } catch (error) {
      console.error("Update Agreement Template Error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to update agreement template",
      });
    }
  }
}

module.exports = new AgreementTemplateController();
