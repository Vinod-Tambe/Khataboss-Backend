"use strict";

const { PrismaClient } = require("../../../prisma/generated/main");

class AccountService {
  /**
   * Get the prisma client for the given tenant database URL.
   * @param {string} dbUrl 
   */
  getPrisma(dbUrl) {
    return new PrismaClient({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
  }

  /**
   * Create a new account.
   * @param {string} dbUrl 
   * @param {object} accountData 
   */
  async createAccount(dbUrl, accountData) {
    const prisma = this.getPrisma(dbUrl);
    try {
      return await prisma.account.create({
        data: accountData,
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Get all accounts (not deleted).
   * @param {string} dbUrl 
   * @param {number} firmId Optional firm ID to filter by
   */
  async getAccounts(dbUrl, firmId = null) {
    const prisma = this.getPrisma(dbUrl);
    try {
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
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Get an account by UUID.
   * @param {string} dbUrl 
   * @param {string} acc_uuid 
   */
  async getAccountByUuid(dbUrl, acc_uuid) {
    const prisma = this.getPrisma(dbUrl);
    try {
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
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Update an account by UUID.
   * @param {string} dbUrl 
   * @param {string} acc_uuid 
   * @param {object} updateData 
   */
  async updateAccountByUuid(dbUrl, acc_uuid, updateData) {
    const prisma = this.getPrisma(dbUrl);
    try {
      return await prisma.account.update({
        where: { acc_uuid: acc_uuid },
        data: updateData,
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Soft delete an account by UUID.
   * @param {string} dbUrl 
   * @param {string} acc_uuid 
   * @param {string} deletedBy 
   */
  async deleteAccountByUuid(dbUrl, acc_uuid, deletedBy = null) {
    const prisma = this.getPrisma(dbUrl);
    try {
      return await prisma.account.update({
        where: { acc_uuid: acc_uuid },
        data: {
          acc_is_deleted: true,
          acc_deleted_at: new Date(),
          acc_deleted_by: deletedBy,
        },
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Get all accounts for dropdown (id, uuid and name only).
   * @param {string} dbUrl 
   * @param {number} firmId Optional firm ID to filter by
   */
  async getAccountsDropdown(dbUrl, firmId = null) {
    const prisma = this.getPrisma(dbUrl);
    try {
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
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Check if an account is a system account.
   * @param {string} dbUrl 
   * @param {string} acc_uuid 
   */
  async isSystemAccount(dbUrl, acc_uuid) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const account = await prisma.account.findUnique({
        where: { acc_uuid: acc_uuid },
        select: { acc_is_system: true }
      });
      return account?.acc_is_system === true;
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Check for duplicate account names under the same firm and primary account.
   * @param {string} dbUrl 
   * @param {string} acc_name 
   * @param {number} firmId 
   * @param {string} preAcc
   * @param {string} excludeUuid Optional UUID to exclude (for updates)
   */
  async checkDuplicateName(dbUrl, acc_name, firmId, preAcc, excludeUuid = null) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const existing = await prisma.account.findFirst({
        where: {
          acc_name: acc_name,
          acc_firm_id: firmId,
          acc_pre_acc: preAcc,
          acc_is_deleted: false,
          NOT: excludeUuid ? { acc_uuid: excludeUuid } : undefined,
        },
      });
      return existing ? true : false;
    } finally {
      await prisma.$disconnect();
    }
  }
}

module.exports = new AccountService();
