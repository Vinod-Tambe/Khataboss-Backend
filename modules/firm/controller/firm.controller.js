"use strict";

const fs = require("fs");
const path = require("path");
const firmService = require("../service/firm.service");
const imageService = require("../../../utils/image.service");
const { BASE_URL } = require("../../../config/db");
const { PrismaClient: MasterPrismaClient } = require("../../../prisma/generated/master");

const masterPrisma = new MasterPrismaClient();

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
        firmData.firm_balance = parseFloat(firmData.firm_balance);
      }
      if (firmData.firm_own_id) {
        firmData.firm_own_id = parseInt(firmData.firm_own_id);
      }

      // 1. Create Firm record first (to get firm_id)
      const newFirm = await firmService.createFirm(dbUrl, firmData);

      if (req.files && Object.keys(req.files).length > 0) {
        const movedFiles = await imageService.moveFiles("firm", newFirm.firm_id, req.files);

        const updateData = {};
        if (movedFiles.firm_own_sign_img) updateData.firm_own_sign_img = movedFiles.firm_own_sign_img;
        if (movedFiles.firm_left_logo_img) updateData.firm_left_logo_img = movedFiles.firm_left_logo_img;
        if (movedFiles.firm_right_logo_img) updateData.firm_right_logo_img = movedFiles.firm_right_logo_img;
        if (movedFiles.firm_qr_code_img) updateData.firm_qr_code_img = movedFiles.firm_qr_code_img;

        if (Object.keys(updateData).length > 0) {
          const updatedFirm = await firmService.updateFirm(dbUrl, newFirm.firm_id, updateData);
          return res.status(201).json({
            message: "Firm created successfully with images.",
            data: updatedFirm,
          });
        }
      }

      return res.status(201).json({
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
        message: "Firms fetched successfully.",
        data: firms,
      });
    } catch (error) {
      console.error("❌  Error fetching firms:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /firm/:id
   */
  async getFirmById(req, res) {
    try {
      const { id } = req.params;
      const dbUrl = this.getDbUrl(req.user.own_db);
      const firm = await firmService.getFirmById(dbUrl, id);

      if (!firm) {
        return res.status(404).json({ error: "Firm not found." });
      }

      return res.status(200).json({
        message: "Firm fetched successfully.",
        data: firm,
      });
    } catch (error) {
      console.error("❌  Error fetching firm:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * PUT /firm/:id
   */
  async updateFirm(req, res) {
    try {
      const { id } = req.params;
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
        updateData.firm_balance = parseFloat(updateData.firm_balance);
      }
      if (updateData.firm_own_id) {
        updateData.firm_own_id = parseInt(updateData.firm_own_id);
      }

      // Handle File Uploads
      if (req.files && Object.keys(req.files).length > 0) {
        const movedFiles = await imageService.moveFiles("firm", id, req.files);
        if (movedFiles.firm_own_sign_img) updateData.firm_own_sign_img = movedFiles.firm_own_sign_img;
        if (movedFiles.firm_left_logo_img) updateData.firm_left_logo_img = movedFiles.firm_left_logo_img;
        if (movedFiles.firm_right_logo_img) updateData.firm_right_logo_img = movedFiles.firm_right_logo_img;
        if (movedFiles.firm_qr_code_img) updateData.firm_qr_code_img = movedFiles.firm_qr_code_img;
      }

      const updatedFirm = await firmService.updateFirm(dbUrl, id, updateData);

      return res.status(200).json({
        message: "Firm updated successfully.",
        data: updatedFirm,
      });
    } catch (error) {
      console.error("❌  Error updating firm:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * DELETE /firm/:id
   */
  async deleteFirm(req, res) {
    try {
      const { id } = req.params;
      const dbUrl = this.getDbUrl(req.user.own_db);
      await firmService.deleteFirm(dbUrl, id, "Admin");

      return res.status(200).json({
        message: "Firm deleted successfully (soft delete).",
      });
    } catch (error) {
      console.error("❌  Error deleting firm:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new FirmController();
