"use strict";

const { listActivityLogs } = require("../../../common/service/activityLog.service");
const { BASE_URL } = require("../../../config/db");

class LogController {
  getDbUrl(dbName) {
    return `${BASE_URL}/${dbName}`;
  }

  async getLogs(req, res) {
    try {
      const {
        firmId,
        entityType,
        entityId,
        module,
        startDate,
        endDate,
        page,
        limit,
      } = req.query;

      const dbUrl = this.getDbUrl(req.user.own_db);
      const result = await listActivityLogs(dbUrl, {
        firmId: firmId || "all",
        entityType,
        entityId,
        module,
        startDate,
        endDate,
        page,
        limit,
      });

      return res.status(200).json({
        message: "Logs fetched successfully.",
        data: result.rows,
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit,
        },
      });
    } catch (error) {
      console.error("Error fetching logs:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new LogController();
