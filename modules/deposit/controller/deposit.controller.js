"use strict";

const depositService = require("../service/deposit.service");
const { BASE_URL } = require("../../../config/db");

class DepositController {
  getDbUrl(dbName) {
    return `${BASE_URL}/${dbName}`;
  }

  async addDeposit(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const data = { ...req.body };

      // Validation
      if (!data.dep_girv_id || !data.dep_firm_id || !data.dep_user_id || !data.dep_trans_date) {
        return res.status(400).json({ error: "Missing required fields for deposit." });
      }

      const result = await depositService.addDeposit(dbUrl, req.user, data);

      return res.status(201).json({
        message: "Deposit added successfully.",
        data: result,
      });
    } catch (error) {
      console.error("❌ Error adding deposit:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new DepositController();
