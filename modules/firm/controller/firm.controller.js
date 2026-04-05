"use strict";

const fs = require("fs");
const path = require("path");
const firmService = require("../service/firm.service");
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
   * Helper to move uploaded files to firm/{firm_id}/ directory.
   */
  async moveFirmFiles(firmId, files) {
    const targetDir = path.join(__dirname, "../../../uploads/firm", firmId.toString());
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const movedFiles = {};

    for (const fieldname in files) {
      const file = files[fieldname][0];
      const newFileName = `${fieldname}-${Date.now()}${path.extname(file.originalname)}`;
      const newPath = path.join(targetDir, newFileName);
      
      fs.renameSync(file.path, newPath);
      
      movedFiles[fieldname] = {
        filename: newFileName,
        originalName: file.originalname,
        path: `uploads/firm/${firmId}/${newFileName}`,
        mimetype: file.mimetype,
        size: file.size,
      };
    }

    return movedFiles;
  }

  /**
   * POST /firm
   */
  async createFirm(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const firmData = { ...req.body };

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

      // 2. If files are uploaded, move them and update the record
      if (req.files && Object.keys(req.files).length > 0) {
        const movedFiles = await this.moveFirmFiles(newFirm.firm_id, req.files);
        
        const updateData = {};
        if (movedFiles.firm_own_sign_img) updateData.firm_own_sign_img = movedFiles.firm_own_sign_img;
        if (movedFiles.firm_left_logo_img) updateData.firm_left_logo_img = movedFiles.firm_left_logo_img;
        if (movedFiles.firm_right_logo) updateData.firm_right_logo = movedFiles.firm_right_logo;

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
        const movedFiles = await this.moveFirmFiles(id, req.files);
        if (movedFiles.firm_own_sign_img) updateData.firm_own_sign_img = movedFiles.firm_own_sign_img;
        if (movedFiles.firm_left_logo_img) updateData.firm_left_logo_img = movedFiles.firm_left_logo_img;
        if (movedFiles.firm_right_logo) updateData.firm_right_logo = movedFiles.firm_right_logo;
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
