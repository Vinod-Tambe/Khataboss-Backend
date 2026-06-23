"use strict";

const addPrincipalService = require("../service/add_principal.service");
const { BASE_URL } = require("../../../config/db");

class AddPrincipalController {
  getDbUrl(dbName) {
    return `${BASE_URL}/${dbName}`;
  }

  async addAdditionalPrincipal(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const data = { ...req.body };

      // Validation
      if (!data.ap_girv_id || !data.ap_firm_id || !data.ap_user_id || !data.ap_trans_date || !data.ap_prin_amt || !data.ap_roi) {
        return res.status(400).json({ error: "Missing required fields for adding additional principal." });
      }

      const result = await addPrincipalService.addAdditionalPrincipal(dbUrl, req.user, data);

      return res.status(201).json({
        message: "Additional principal added successfully.",
        data: result,
      });
    } catch (error) {
      console.error("❌ Error adding additional principal:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AddPrincipalController();
