"use strict";

const releaseService = require("../service/release.service");
const { BASE_URL } = require("../../../config/db");

class ReleaseController {
  getDbUrl(dbName) {
    return `${BASE_URL}/${dbName}`;
  }

  async addRelease(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const data = { ...req.body };

      // Validation
      if (!data.rel_girv_id || !data.rel_firm_id || !data.rel_user_id || !data.rel_trans_date) {
        return res.status(400).json({ error: "Missing required fields for release." });
      }

      const result = await releaseService.addRelease(dbUrl, req.user, data);

      return res.status(201).json({
        message: "Loan released successfully.",
        data: result,
      });
    } catch (error) {
      console.error("❌ Error releasing loan:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  async deleteRelease(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const { rel_id } = req.params;

      if (!rel_id) {
        return res.status(400).json({ error: "Release ID is required." });
      }

      const result = await releaseService.deleteRelease(dbUrl, req.user, rel_id);

      return res.status(200).json({
        message: "Loan release reverted successfully.",
        data: result,
      });
    } catch (error) {
      console.error("❌ Error deleting release:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ReleaseController();
