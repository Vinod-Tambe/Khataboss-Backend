"use strict";

const rateService = require("../service/rate.service");
const { BASE_URL } = require("../../../config/db");

class RateController {
  getDbUrl(dbName) {
    return `${BASE_URL}/${dbName}`;
  }

  async createRate(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const data = req.body;
      data.rate_created_by = req.user?.user_name || "Admin";
      data.rate_own_id = req.user?.own_id || 1;
      
      const rate = await rateService.createRate(dbUrl, data);
      res.status(201).json({ message: "Rate saved successfully", data: rate });
    } catch (error) {
      console.error("Create Rate Error:", error);
      res.status(500).json({ message: "Failed to save rate", error: error.message });
    }
  }

  async updateRate(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const { uuid } = req.params;
      const data = req.body;
      data.rate_updated_by = req.user?.user_name || "Admin";
      
      const rate = await rateService.updateRate(dbUrl, uuid, data);
      res.status(200).json({ message: "Rate updated successfully", data: rate });
    } catch (error) {
      console.error("Update Rate Error:", error);
      res.status(500).json({ message: "Failed to update rate", error: error.message });
    }
  }

  async getRates(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const { firmId } = req.query;
      const rates = await rateService.getRates(dbUrl, firmId);
      res.status(200).json({ message: "Rates fetched successfully", data: rates });
    } catch (error) {
      console.error("Get Rates Error:", error);
      res.status(500).json({ message: "Failed to fetch rates", error: error.message });
    }
  }

  async deleteRate(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const { uuid } = req.params;
      await rateService.deleteRate(dbUrl, uuid);
      res.status(200).json({ message: "Rate deleted successfully" });
    } catch (error) {
      console.error("Delete Rate Error:", error);
      res.status(500).json({ message: "Failed to delete rate", error: error.message });
    }
  }
}

module.exports = new RateController();
