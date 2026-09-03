"use strict";

const { getTenantPrisma } = require("../../../utils/tenantPrisma");

class AccountService {
  /**
   * Get the prisma client for the given tenant database URL.
   * @param {string} dbUrl 
   */
  getPrisma(dbUrl) {
    return getTenantPrisma(dbUrl);
  }

  /**
   * Create a new account.
   * @param {string} dbUrl 
   * @param {object} accountData 
   */
  async createAccount(dbUrl, accountData) {
    const prisma = this.getPrisma(dbUrl);

      return await prisma.account.create({
        data: accountData,
      });
    
  }

  /**
   * Move legacy Secured/Unsecured loan COA under Loans & Advances (Asset).
   * Safe to call repeatedly.
   */
  async repairLoanReceivableParents(dbUrl, firmId = null) {
    const prisma = this.getPrisma(dbUrl);

      const where = {
        acc_is_deleted: false,
        acc_name: { in: ["Secured Loans", "Unsecured Loans"] },
        acc_pre_acc: "Loans (Liability)",
      };
      if (firmId) {
        where.acc_firm_id = parseInt(firmId);
      }
      return await prisma.account.updateMany({
        where,
        data: {
          acc_pre_acc: "Loans & Advances (Asset)",
          acc_balance_type: "DR",
        },
      });
    
  }

  /**
   * Get all accounts (not deleted).
   * @param {string} dbUrl 
   * @param {number} firmId Optional firm ID to filter by
   */
  async getAccounts(dbUrl, firmId = null) {
    const prisma = this.getPrisma(dbUrl);

      // Self-heal legacy loan receivable grouping for existing tenants
      await prisma.account.updateMany({
        where: {
          acc_is_deleted: false,
          acc_name: { in: ["Secured Loans", "Unsecured Loans"] },
          acc_pre_acc: "Loans (Liability)",
          ...(firmId ? { acc_firm_id: parseInt(firmId) } : {}),
        },
        data: {
          acc_pre_acc: "Loans & Advances (Asset)",
          acc_balance_type: "DR",
        },
      });

      const where = { acc_is_deleted: false };
      if (firmId) {
        where.acc_firm_id = parseInt(firmId);
      }

      return await prisma.account.findMany({
        where: where,
        orderBy: { acc_created_at: "desc" },
        include: {
          firm: {
            select: {
              firm_name: true,
              firm_uuid: true,
            }
          }
        }
      });
    
  }

  /**
   * Get an account by UUID.
   * @param {string} dbUrl 
   * @param {string} acc_uuid 
   */
  async getAccountByUuid(dbUrl, acc_uuid) {
    const prisma = this.getPrisma(dbUrl);

      return await prisma.account.findUnique({
        where: { acc_uuid: acc_uuid, acc_is_deleted: false },
        include: {
          firm: {
            select: {
              firm_name: true,
              firm_uuid: true,
            }
          }
        }
      });
    
  }

  /**
   * Update an account by UUID.
   * @param {string} dbUrl 
   * @param {string} acc_uuid 
   * @param {object} updateData 
   */
  async updateAccountByUuid(dbUrl, acc_uuid, updateData) {
    const prisma = this.getPrisma(dbUrl);

      return await prisma.account.update({
        where: { acc_uuid: acc_uuid },
        data: updateData,
      });
    
  }

  /**
   * Soft delete an account by UUID.
   * @param {string} dbUrl 
   * @param {string} acc_uuid 
   * @param {string} deletedBy 
   */
  async deleteAccountByUuid(dbUrl, acc_uuid, deletedBy = null) {
    const prisma = this.getPrisma(dbUrl);

      return await prisma.account.update({
        where: { acc_uuid: acc_uuid },
        data: {
          acc_is_deleted: true,
          acc_deleted_at: new Date(),
          acc_deleted_by: deletedBy,
        },
      });
    
  }

  /**
   * Get all accounts for dropdown (id, uuid and name only).
   * @param {string} dbUrl 
   * @param {number} firmId Optional firm ID to filter by
   */
  async getAccountsDropdown(dbUrl, firmId = null) {
    const prisma = this.getPrisma(dbUrl);

      const where = { acc_is_deleted: false };
      if (firmId) {
        where.acc_firm_id = parseInt(firmId);
      }

      return await prisma.account.findMany({
        where: where,
        select: {
          acc_id: true,
          acc_uuid: true,
          acc_name: true,
        },
        orderBy: { acc_name: "asc" },
      });
    
  }

  /**
   * Check if an account is a system account.
   * @param {string} dbUrl 
   * @param {string} acc_uuid 
   */
  async isSystemAccount(dbUrl, acc_uuid) {
    const prisma = this.getPrisma(dbUrl);

      const account = await prisma.account.findUnique({
        where: { acc_uuid: acc_uuid },
        select: { acc_is_system: true }
      });
      return account?.acc_is_system === true;
    
  }

  /**
   * Check for duplicate account names under the same firm (case-insensitive).
   * @param {string} dbUrl
   * @param {string} acc_name
   * @param {number} firmId
   * @param {string} excludeUuid Optional UUID to exclude (for updates)
   */
  async checkDuplicateName(dbUrl, acc_name, firmId, excludeUuid = null) {
    const prisma = this.getPrisma(dbUrl);
    const trimmedName = (acc_name || "").trim();
    if (!trimmedName || !firmId) return false;

    const existing = await prisma.account.findFirst({
      where: {
        acc_name: {
          equals: trimmedName,
          mode: "insensitive",
        },
        acc_firm_id: firmId,
        acc_is_deleted: false,
        NOT: excludeUuid ? { acc_uuid: excludeUuid } : undefined,
      },
    });
    return !!existing;
  }

  /**
   * Get opening balances for accounts.
   * @param {string} dbUrl
   * @param {number|string} firmId
   * @param {string} startDate
   * @param {number|string} accId
   */
  async get_acc_opening_balance(dbUrl, firmId = "N", startDate, accId = "N") {
    const prisma = this.getPrisma(dbUrl);

      // Ensure startDate is treated as UTC end-of-day to include all accounts created on that date
      const [year, month, day] = startDate.split("-").map(Number);
      const endOfStartDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

      const where = {
        acc_opening_date: { lte: endOfStartDate },
        acc_is_deleted: false
      };

      if (firmId !== "N") {
        where.acc_firm_id = parseInt(firmId);
      }

      if (accId !== "N") {
        if (isNaN(parseInt(accId)) || accId.toString().includes("-")) {
          where.acc_uuid = accId.toString();
        } else {
          where.acc_id = parseInt(accId);
        }
      } else {
        where.acc_cash_balance = { not: "0" };
      }

      return await prisma.account.findMany({
        where: where,
        select: {
          acc_id: true,
          acc_uuid: true,
          acc_name: true,
          acc_firm_id: true,
          acc_balance_type: true,
          acc_cash_balance: true,
          acc_pre_acc: true,
        },
      });
    
  }

  /**
   * Get totals of DR and CR accounts and their difference.
   * @param {string} dbUrl 
   * @param {number} firmId Optional firm ID to filter by
   */
  async getAccountTotals(dbUrl, firmId = null) {
    const prisma = this.getPrisma(dbUrl);

      const where = { acc_is_deleted: false };
      if (firmId) {
        where.acc_firm_id = parseInt(firmId);
      }

      const accounts = await prisma.account.findMany({
        where: where,
        select: {
          acc_cash_balance: true,
          acc_balance_type: true,
        },
      });

      let debitTotal = 0;
      let creditTotal = 0;

      for (const account of accounts) {
        const balance = parseFloat(account.acc_cash_balance || 0);
        if (account.acc_balance_type === "DR") {
          debitTotal += balance;
        } else if (account.acc_balance_type === "CR") {
          creditTotal += balance;
        }
      }

      const difference = Math.abs(debitTotal - creditTotal);

      return {
        debitTotal,
        creditTotal,
        difference,
      };
    
  }
}

module.exports = new AccountService();
