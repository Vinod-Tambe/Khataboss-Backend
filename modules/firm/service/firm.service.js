"use strict";

const { getTenantPrisma } = require("../../../utils/tenantPrisma");
const serialNumberService = require("../../../common/service/serialNumber.service");

class FirmService {
  /**
   * Get the prisma client for the given tenant database URL.
   * @param {string} dbUrl 
   */
  getPrisma(dbUrl) {
    return getTenantPrisma(dbUrl);
  }

  /**
   * Create a new firm.
   * @param {string} dbUrl 
   * @param {object} firmData 
   */
  async createFirm(dbUrl, firmData) {
    const prisma = this.getPrisma(dbUrl);

      if (!firmData.firm_unique_code) {
        firmData.firm_unique_code = await serialNumberService.getNextSerialNumber(prisma, "FIRM");
      }
      return await prisma.firm.create({
        data: firmData,
      });
    
  }

  /**
   * Get all firms (not deleted).
   * @param {string} dbUrl 
   */
  async getFirms(dbUrl) {
    const prisma = this.getPrisma(dbUrl);

      return await prisma.firm.findMany({
        where: { firm_is_deleted: false },
        orderBy: { firm_created_at: "desc" },
      });
    
  }

  /**
   * Get all firms for dropdown (id and name only).
   * @param {string} dbUrl 
   */
  async getFirmsDropdown(dbUrl) {
    const prisma = this.getPrisma(dbUrl);

      return await prisma.firm.findMany({
        where: { firm_is_deleted: false },
        select: {
          firm_id: true,
          firm_uuid: true,
          firm_name: true,
        },
        orderBy: { firm_name: "asc" },
      });
    
  }

  /**
   * Get a firm by UUID.
   * @param {string} dbUrl 
   * @param {string} firm_uuid 
   */
  async getFirmByUuid(dbUrl, firm_uuid) {
    const prisma = this.getPrisma(dbUrl);

      return await prisma.firm.findUnique({
        where: { firm_uuid: firm_uuid, firm_is_deleted: false },
      });
    
  }

  /**
   * Update a firm by UUID.
   * @param {string} dbUrl 
   * @param {string} firm_uuid 
   * @param {object} updateData 
   */
  async updateFirmByUuid(dbUrl, firm_uuid, updateData) {
    const prisma = this.getPrisma(dbUrl);

      return await prisma.firm.update({
        where: { firm_uuid: firm_uuid },
        data: updateData,
      });
    
  }

  /**
   * Check for duplicate unique fields (firm_name, firm_reg_no).
   * @param {string} dbUrl 
   * @param {object} firmData 
   * @param {string} excludeUuid Optional UUID to exclude (for updates)
   */
  async checkUniqueFields(dbUrl, firmData, excludeUuid = null) {
    const prisma = this.getPrisma(dbUrl);

      // 1. Check Firm ID (firm_name)
      if (firmData.firm_name) {
        const existingName = await prisma.firm.findFirst({
          where: {
            firm_name: firmData.firm_name,
            firm_is_deleted: false,
            NOT: excludeUuid ? { firm_uuid: excludeUuid } : undefined,
          },
        });
        if (existingName) {
          return { error: `Firm already exists with Firm ID: ${firmData.firm_name}` };
        }
      }

      // 2. Check Registration No (firm_reg_no)
      if (firmData.firm_reg_no) {
        const existingReg = await prisma.firm.findFirst({
          where: {
            firm_reg_no: firmData.firm_reg_no,
            firm_is_deleted: false,
            NOT: excludeUuid ? { firm_uuid: excludeUuid } : undefined,
          },
        });
        if (existingReg) {
          return { error: `Firm already exists with Registration No: ${firmData.firm_reg_no}` };
        }
      }

      return null; // All good
    
  }

  /**
   * Soft delete a firm by UUID.
   * @param {string} dbUrl 
   * @param {string} firm_uuid 
   * @param {string} deletedBy 
   */
  async deleteFirmByUuid(dbUrl, firm_uuid, deletedBy = null) {
    const prisma = this.getPrisma(dbUrl);

      return await prisma.firm.update({
        where: { firm_uuid: firm_uuid },
        data: {
          firm_is_deleted: true,
          firm_deleted_at: new Date(),
          firm_deleted_by: deletedBy,
        },
      });
    
  }

  /**
   * Create default accounts for a new firm.
   * @param {string} dbUrl 
   * @param {number} firmId 
   * @param {number} ownId 
   * @param {string} firmBalance 
   * @param {Date} openingDate 
   */
  async createDefaultAccounts(dbUrl, firmId, ownId, firmBalance, openingDate) {
    const prisma = this.getPrisma(dbUrl);

      const { cr_accounts, dr_accounts } = require("../../../common/default-data/account");
      const accountsToCreate = [];

      cr_accounts.forEach(acc => {
        accountsToCreate.push({
          ...acc,
          acc_firm_id: firmId,
          acc_own_id: ownId,
          acc_is_system: true,
          acc_balance_type: 'CR',
          acc_opening_date: openingDate || new Date(),
          acc_cash_balance: (acc.acc_name === "Capital Account") ? String(firmBalance || "0") : "0"
        });
      });

      dr_accounts.forEach(acc => {
        accountsToCreate.push({
          ...acc,
          acc_firm_id: firmId,
          acc_own_id: ownId,
          acc_is_system: true,
          acc_balance_type: 'DR',
          acc_opening_date: openingDate || new Date(),
          acc_cash_balance: "0"
        });
      });

      return await prisma.account.createMany({
        data: accountsToCreate,
      });
    
  }

  /**
   * Update the balance of the "Capital Account" for a firm.
   * @param {string} dbUrl 
   * @param {number} firmId 
   * @param {string} firmBalance 
   */
  async updateCapitalAccountBalance(dbUrl, firmId, firmBalance) {
    const prisma = this.getPrisma(dbUrl);

      return await prisma.account.updateMany({
        where: {
          acc_firm_id: firmId,
          acc_name: "Capital Account",
          acc_is_deleted: false
        },
        data: {
          acc_cash_balance: String(firmBalance)
        }
      });
    
  }
}

module.exports = new FirmService();
