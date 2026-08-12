"use strict";

const dashboardService = require("../service/dashboard.service");
const { BASE_URL } = require("../../../config/db");

class DashboardController {
  getDbUrl(dbName) {
    return `${BASE_URL}/${dbName}`;
  }

  async getUserDashboard(req, res) {
    try {
      const { firmId, userId } = req.query;
      const dbUrl = this.getDbUrl(req.user.own_db);
      const result = await dashboardService.getUserDashboard(dbUrl, firmId, userId);
      return res.status(200).json({
        message: "User dashboard data fetched successfully.",
        data: result,
      });
    } catch (error) {
      console.error("❌ Controller Error (getUserDashboard):", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  async getOwnerDashboard(req, res) {
    try {
      const { firmId } = req.query;
      const dbUrl = this.getDbUrl(req.user.own_db);
      const result = await dashboardService.getOwnerDashboard(dbUrl, firmId);
      return res.status(200).json({
        message: "Dashboard data fetched successfully.",
        data: result,
      });
    } catch (error) {
      console.error("❌ Controller Error (getOwnerDashboard):", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new DashboardController();
