"use strict";

const { getMasterPrisma } = require("../../../utils/masterPrisma");
const fs = require("fs");
const path = require("path");
const firmService = require("../service/firm.service");
const imageService = require("../../../utils/image.service");
const { BASE_URL } = require("../../../config/db");
const {
  logActivity,
  MODULE,
  ACTION,
  descriptions,
} = require("../../../common/service/activityLog.service");

const masterPrisma = getMasterPrisma();

class FirmController {
  /**
   * Helper to resolve DB URL from a db name.
   */
  getDbUrl(dbName) {
    return `${BASE_URL}/${dbName}`;
  }



  /**
   * POST /firm
   */
  async createFirm(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const firmData = { ...req.body };

      // Ensure firm_own_id is set from the authenticated user
      firmData.firm_own_id = req.user.own_id;

      // Convert date strings if any
      if (firmData.firm_start_date) {
        firmData.firm_start_date = new Date(firmData.firm_start_date);
      }
      if (firmData.firm_add_date) {
        firmData.firm_add_date = new Date(firmData.firm_add_date);
      }
      if (firmData.firm_balance) {
        firmData.firm_balance = String(firmData.firm_balance);
      }
      if (firmData.firm_own_id) {
        firmData.firm_own_id = parseInt(firmData.firm_own_id);
      }

      // 0. Pre-validate Uniqueness (Firm ID and Registration No)
      const validationError = await firmService.checkUniqueFields(dbUrl, firmData);
      if (validationError) {
        return res.status(409).json({ error: validationError.error });
      }

      // 1. Create Firm record first (to get firm_id)
      const newFirm = await firmService.createFirm(dbUrl, firmData);

      logActivity(dbUrl, req.user, {
        firmId: newFirm.firm_id,
        module: MODULE.FIRM,
        action: ACTION.CREATE,
        subject: "Firm Added",
        description: (at) => descriptions.firmCreated(newFirm, at),
        entityType: "firm",
        entityId: newFirm.firm_id,
        refNo: newFirm.firm_unique_id || String(newFirm.firm_id),
      });

      // 2. Create Default Accounts
      await firmService.createDefaultAccounts(
        dbUrl,
        newFirm.firm_id,
        newFirm.firm_own_id,
        newFirm.firm_balance,
        newFirm.firm_start_date
      );

      // 3. Seed firm-wise email / WhatsApp / SMS templates (non-blocking)
      try {
        const {
          seedMessageTemplatesForFirm,
        } = require("../../../prisma/seeder/message-template-seeder");
        await seedMessageTemplatesForFirm(dbUrl, {
          ownId: newFirm.firm_own_id,
          firmId: newFirm.firm_id,
          firmName: newFirm.firm_name,
        });
      } catch (seedErr) {
        console.warn("⚠️ Failed to seed message templates:", seedErr.message);
      }

      if (req.files && Object.keys(req.files).length > 0) {
        const movedFiles = await imageService.moveFiles(
          newFirm.firm_own_id,
          "firm",
          newFirm.firm_id,
          req.files
        );

        const updateData = {};
        if (movedFiles.firm_own_sign_img) updateData.firm_own_sign_img = movedFiles.firm_own_sign_img;
        if (movedFiles.firm_left_logo_img) updateData.firm_left_logo_img = movedFiles.firm_left_logo_img;
        if (movedFiles.firm_right_logo_img) updateData.firm_right_logo_img = movedFiles.firm_right_logo_img;
        if (movedFiles.firm_qr_code_img) updateData.firm_qr_code_img = movedFiles.firm_qr_code_img;
        if (movedFiles.firm_pan_no_img) updateData.firm_pan_no_img = movedFiles.firm_pan_no_img;

        if (Object.keys(updateData).length > 0) {
          const updatedFirm = await firmService.updateFirmByUuid(dbUrl, newFirm.firm_uuid, updateData);
          return res.status(201).json({
            success: true,
            message: "Firm created successfully with images.",
            data: updatedFirm,
          });
        }
      }

      return res.status(201).json({
        success: true,
        message: "Firm created successfully.",
        data: newFirm,
      });
    } catch (error) {
      console.error("❌  Error creating firm:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /firm
   */
  async getFirms(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const firms = await firmService.getFirms(dbUrl);

      return res.status(200).json({
        success: true,
        message: "Firms fetched successfully.",
        data: firms,
      });
    } catch (error) {
      console.error("❌  Error fetching firms:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /firm/dropdown
   */
  async getFirmsDropdown(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const firms = await firmService.getFirmsDropdown(dbUrl);

      return res.status(200).json({
        success: true,
        message: "Firms for dropdown fetched successfully.",
        data: firms,
      });
    } catch (error) {
      console.error("❌  Error fetching firms for dropdown:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /firm/:uuid
   */
  async getFirmByUuid(req, res) {
    try {
      const { uuid } = req.params;
      const dbUrl = this.getDbUrl(req.user.own_db);
      const firm = await firmService.getFirmByUuid(dbUrl, uuid);

      if (!firm) {
        return res.status(404).json({ error: "Firm not found." });
      }

      return res.status(200).json({
        success: true,
        message: "Firm fetched successfully.",
        data: firm,
      });
    } catch (error) {
      console.error("❌  Error fetching firm:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * PUT /firm/:uuid
   */
  async updateFirm(req, res) {
    try {
      const { uuid } = req.params;
      const dbUrl = this.getDbUrl(req.user.own_db);
      const updateData = { ...req.body };

      // Ensure firm_own_id is set from the authenticated user
      updateData.firm_own_id = req.user.own_id;

      // Convert date strings if any
      if (updateData.firm_start_date) {
        updateData.firm_start_date = new Date(updateData.firm_start_date);
      }
      if (updateData.firm_add_date) {
        updateData.firm_add_date = new Date(updateData.firm_add_date);
      }
      if (updateData.firm_balance) {
        updateData.firm_balance = String(updateData.firm_balance);
      }
      if (updateData.firm_own_id) {
        updateData.firm_own_id = parseInt(updateData.firm_own_id);
      }

      // 0. Pre-validate Uniqueness (Exclude current UUID)
      const validationError = await firmService.checkUniqueFields(dbUrl, updateData, uuid);
      if (validationError) {
        return res.status(409).json({ error: validationError.error });
      }

      // Handle File Uploads
      if (req.files && Object.keys(req.files).length > 0) {
        // Fetch firm to get firm_id for folder naming
        const firm = await firmService.getFirmByUuid(dbUrl, uuid);
        if (!firm) {
          return res.status(404).json({ error: "Firm not found." });
        }
        const firmId = firm.firm_id;

        const movedFiles = await imageService.replaceFiles(
          req.user.own_id,
          "firm",
          firmId,
          req.files,
          firm
        );

        if (movedFiles.firm_own_sign_img) updateData.firm_own_sign_img = movedFiles.firm_own_sign_img;
        if (movedFiles.firm_left_logo_img) updateData.firm_left_logo_img = movedFiles.firm_left_logo_img;
        if (movedFiles.firm_right_logo_img) updateData.firm_right_logo_img = movedFiles.firm_right_logo_img;
        if (movedFiles.firm_qr_code_img) updateData.firm_qr_code_img = movedFiles.firm_qr_code_img;
        if (movedFiles.firm_pan_no_img) updateData.firm_pan_no_img = movedFiles.firm_pan_no_img;
      }

      const updatedFirm = await firmService.updateFirmByUuid(dbUrl, uuid, updateData);

      logActivity(dbUrl, req.user, {
        firmId: updatedFirm.firm_id,
        module: MODULE.FIRM,
        action: ACTION.UPDATE,
        subject: "Firm Updated",
        description: (at) => descriptions.firmUpdated(updatedFirm, at),
        entityType: "firm",
        entityId: updatedFirm.firm_id,
        refNo: updatedFirm.firm_unique_id || String(updatedFirm.firm_id),
      });

      // 3. Sync Capital Account balance if firm_balance is updated
      if (updateData.firm_balance !== undefined) {
        await firmService.updateCapitalAccountBalance(dbUrl, updatedFirm.firm_id, updatedFirm.firm_balance);
      }

      return res.status(200).json({
        success: true,
        message: "Firm updated successfully.",
        data: updatedFirm,
      });
    } catch (error) {
      console.error("❌  Error updating firm:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * DELETE /firm/:uuid
   */
  async deleteFirm(req, res) {
    try {
      const { uuid } = req.params;
      const dbUrl = this.getDbUrl(req.user.own_db);
      const firmToDelete = await firmService.getFirmByUuid(dbUrl, uuid);
      if (!firmToDelete) {
        return res.status(404).json({ error: "Firm not found." });
      }

      await firmService.deleteFirmByUuid(dbUrl, uuid, req.user.own_login_id || "Admin");

      logActivity(dbUrl, req.user, {
        firmId: firmToDelete.firm_id,
        module: MODULE.FIRM,
        action: ACTION.DELETE,
        subject: "Firm Deleted",
        description: (at) => descriptions.firmDeleted(firmToDelete, at),
        entityType: "firm",
        entityId: firmToDelete.firm_id,
        refNo: firmToDelete.firm_unique_id || String(firmToDelete.firm_id),
      });

      return res.status(200).json({
        success: true,
        message: "Firm deleted successfully (soft delete).",
      });
    } catch (error) {
      console.error("❌  Error deleting firm:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new FirmController();
