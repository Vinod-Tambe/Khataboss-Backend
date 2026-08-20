"use strict";

const {
  listActivityLogs,
  getActorLoginId,
} = require("../../../common/service/activityLog.service");
const { ROLE_STAFF } = require("../../../common/service/permission.helper");
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
      const isEntityScope = Boolean(entityType && entityId);
      const listFilters = {
        firmId: firmId || "all",
        entityType,
        entityId,
        module,
        startDate,
        endDate,
        page,
        limit,
      };

      // Staff users see only their own logs on the global logs page.
      // Entity-scoped logs (e.g. loan activity modal) show all users for that record.
      if (req.user.role === ROLE_STAFF && !isEntityScope) {
        listFilters.loginId = getActorLoginId(req.user);
      }

      const result = await listActivityLogs(dbUrl, listFilters);

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
