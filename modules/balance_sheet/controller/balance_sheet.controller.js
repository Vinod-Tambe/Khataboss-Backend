"use strict";

const balanceSheetService = require("../service/balance_sheet.service");
const { BASE_URL } = require("../../../config/db");

class BalanceSheetController {
  /**
   * Helper to resolve DB URL from a db name.
   */
  getDbUrl(dbName) {
    return `${BASE_URL}/${dbName}`;
  }

  /**
   * GET /balance-sheet
   */
  async get_all_balance_sheet_entries(req, res) {
    try {
      let { firmId, startDate, endDate, financialYear } = req.query;

      // Handle Financial Year parameter (e.g., "2025-2026")
      if (financialYear && financialYear.includes("-")) {
        const parts = financialYear.split("-");
        startDate = `${parts[0]}-04-01`;
        endDate = `${parts[1]}-03-31`;
      }

      // Default to current Financial Year if no dates provided
      if (!startDate || !endDate) {
        const today = new Date();
        const currentYear = today.getFullYear();
        const isAfterMarch = today.getMonth() >= 3; // April is index 3

        if (isAfterMarch) {
          startDate = `${currentYear}-04-01`;
          endDate = `${currentYear + 1}-03-31`;
        } else {
          startDate = `${currentYear - 1}-04-01`;
          endDate = `${currentYear}-03-31`;
        }
      }
      const dbUrl = this.getDbUrl(req.user.own_db);

      // Validate date format (YYYY-MM-DD) if provided
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (startDate && !dateRegex.test(startDate)) {
        return res.status(400).json({
          success: false,
          message: "Invalid start date format. Use YYYY-MM-DD",
        });
      }
      if (endDate && !dateRegex.test(endDate)) {
        return res.status(400).json({
          success: false,
          message: "Invalid end date format. Use YYYY-MM-DD",
        });
      }

      // Validate date range logic if both dates are provided
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start) || isNaN(end)) {
          return res.status(400).json({
            success: false,
            message: "Invalid date values",
          });
        }
        if (start > end) {
          return res.status(400).json({
            success: false,
            message: "Start date cannot be after end date",
          });
        }
      }

      // Prepare filters object
      const filters = {};
      if (firmId) filters.firmId = firmId;
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;

      const response = await balanceSheetService.get_all_balance_sheet_data(dbUrl, filters);

      return res.status(200).json({
        success: true,
        message: "Balance sheet entries fetched successfully",
        data: response,
      });
    } catch (error) {
      console.error("Error fetching balance sheet entries:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch balance sheet entries",
        error: error.message,
      });
    }
  }
}

module.exports = new BalanceSheetController();
