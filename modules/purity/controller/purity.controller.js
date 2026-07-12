"use strict";

const purityService = require("../service/purity.service");
const { BASE_URL } = require("../../../config/db");

class PurityController {
  getDbUrl(dbName) {
    return `${BASE_URL}/${dbName}`;
  }

  async createPurity(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const data = req.body;
      data.purity_created_by = req.user?.user_name || "Admin";
      data.purity_own_id = req.user?.own_id || 1;
      
      const purity = await purityService.createPurity(dbUrl, data);
      res.status(201).json({ message: "Purity saved successfully", data: purity });
    } catch (error) {
      console.error("Create Purity Error:", error);
      res.status(500).json({ message: "Failed to save purity", error: error.message });
    }
  }

  async getPurities(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const { metal } = req.query;
      const purities = await purityService.getPurities(dbUrl, metal);
      res.status(200).json({ message: "Purities fetched successfully", data: purities });
    } catch (error) {
      console.error("Get Purities Error:", error);
      res.status(500).json({ message: "Failed to fetch purities", error: error.message });
    }
  }

  async updatePurity(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const { uuid } = req.params;
      const data = req.body;
      data.purity_updated_by = req.user?.user_name || "Admin";
      
      const purity = await purityService.updatePurity(dbUrl, uuid, data);
      res.status(200).json({ message: "Purity updated successfully", data: purity });
    } catch (error) {
      console.error("Update Purity Error:", error);
      res.status(500).json({ message: "Failed to update purity", error: error.message });
    }
  }

  async deletePurity(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const { uuid } = req.params;
      await purityService.deletePurity(dbUrl, uuid);
      res.status(200).json({ message: "Purity deleted successfully" });
    } catch (error) {
      console.error("Delete Purity Error:", error);
      res.status(500).json({ message: "Failed to delete purity", error: error.message });
    }
  }
}

module.exports = new PurityController();
