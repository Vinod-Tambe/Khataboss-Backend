"use strict";

const daybookService = require("../service/daybook.service");
const { BASE_URL } = require("../../../config/db");

class DaybookController {
  /**
   * Helper to resolve DB URL from a db name.
   */
  getDbUrl(dbName) {
    return `${BASE_URL}/${dbName}`;
  }

  /**
   * GET /daybook
   */
  async get_all_daybook_entries(req, res) {
    try {
      const { firmId, startDate, endDate } = req.query;
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

      const response = await daybookService.get_all_daybook_data(dbUrl, filters);

      return res.status(200).json({
        success: true,
        message: "Daybook entries fetched successfully",
        data: response,
      });
    } catch (error) {
      console.error("Error fetching daybook entries:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch daybook entries",
        error: error.message,
      });
    }
  }
}

module.exports = new DaybookController();
