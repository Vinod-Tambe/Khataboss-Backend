"use strict";

const formTemplateService = require("../service/form-template.service");
const { getTenantPrisma } = require("../../../utils/tenantPrisma");
const { BASE_URL } = require("../../../config/db");

class FormTemplateController {
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
      const templates = await formTemplateService.listTemplates(dbUrl, {
        ownId: req.user.own_id,
      });

      return res.status(200).json({
        success: true,
        message: "Form templates fetched successfully",
        data: templates,
      });
    } catch (error) {
      console.error("List Form Templates Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch form templates",
        error: error.message,
      });
    }
  }

  async getTemplate(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const { firmId } = req.query;

      if (!firmId) {
        return res.status(400).json({
          success: false,
          message: "firmId is required",
        });
      }

      const firm = await this._resolveFirm(dbUrl, firmId);
      if (!firm) {
        return res.status(404).json({ success: false, message: "Firm not found" });
      }

      const template = await formTemplateService.getTemplateByFirm(dbUrl, firm.firm_id, {
        ownId: firm.firm_own_id || req.user.own_id,
        firmName: firm.firm_name,
      });

      return res.status(200).json({
        success: true,
        message: "Form template fetched successfully",
        data: template,
      });
    } catch (error) {
      console.error("Get Form Template Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch form template",
        error: error.message,
      });
    }
  }

  async updateTemplate(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const { uuid } = req.params;

      const existing = await formTemplateService.getTemplateByUuid(dbUrl, uuid);
      if (!existing) {
        return res.status(404).json({ success: false, message: "Form template not found" });
      }

      const updatedBy =
        req.user?.own_name || req.user?.own_login_id || req.user?.email || "owner";

      const template = await formTemplateService.updateTemplate(
        dbUrl,
        uuid,
        req.body,
        updatedBy
      );

      return res.status(200).json({
        success: true,
        message: "Form template updated successfully",
        data: template,
      });
    } catch (error) {
      console.error("Update Form Template Error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to update form template",
      });
    }
  }
}

module.exports = new FormTemplateController();
