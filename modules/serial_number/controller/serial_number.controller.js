"use strict";

const serialNumberService = require("../../../common/service/serialNumber.service");
const { getTenantPrisma } = require("../../../utils/tenantPrisma");

class SerialNumberController {
  /**
   * Get all serial number configurations.
   */
  async getConfigs(req, res) {
    try {
      const dbUrl = req.user?.db_url || process.env.DATABASE_MAIN_URL;
      const prisma = getTenantPrisma(dbUrl);

      const configs = await serialNumberService.getAllConfigs(prisma);
      return res.status(200).json({
        success: true,
        data: configs,
      });
    } catch (error) {
      console.error("❌ Error in getConfigs:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch serial number configurations",
        error: error.message,
      });
    }
  }

  /**
   * Update serial number configuration for an entity type.
   */
  async updateConfig(req, res) {
    try {
      const dbUrl = req.user?.db_url || process.env.DATABASE_MAIN_URL;
      const prisma = getTenantPrisma(dbUrl);

      const { entity_type } = req.params;
      const { start_number, current_number, number_prefix } = req.body;

      const updated = await serialNumberService.updateConfig(prisma, entity_type, {
        start_number,
        current_number,
        number_prefix,
      });

      return res.status(200).json({
        success: true,
        message: "Serial number configuration updated successfully",
        data: updated,
      });
    } catch (error) {
      console.error("❌ Error in updateConfig:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to update serial number configuration",
        error: error.message,
      });
    }
  }

  /**
   * Generate next serial number for a specific entity type.
   */
  async generateNextCode(req, res) {
    try {
      const dbUrl = req.user?.db_url || process.env.DATABASE_MAIN_URL;
      const prisma = getTenantPrisma(dbUrl);

      const { entity_type } = req.params;
      const uniqueCode = await serialNumberService.getNextSerialNumber(prisma, entity_type);

      return res.status(200).json({
        success: true,
        entity_type,
        unique_code: uniqueCode,
      });
    } catch (error) {
      console.error("❌ Error in generateNextCode:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to generate next serial code",
        error: error.message,
      });
    }
  }
}

module.exports = new SerialNumberController();
