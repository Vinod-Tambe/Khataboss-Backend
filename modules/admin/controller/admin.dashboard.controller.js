"use strict";

const adminDashboardService = require("../services/admin.dashboard.service");

class AdminDashboardController {
  async getStats(req, res) {
    try {
      const data = await adminDashboardService.getDashboardStats();
      return res.status(200).json({
        success: true,
        message: "Admin dashboard stats fetched successfully.",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to load dashboard stats.",
      });
    }
  }
}

module.exports = new AdminDashboardController();
