"use strict";

const { PrismaClient } = require("../../../prisma/generated/main");

class FirmService {
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
   * Create a new firm.
   * @param {string} dbUrl 
   * @param {object} firmData 
   */
  async createFirm(dbUrl, firmData) {
    const prisma = this.getPrisma(dbUrl);
    try {
      return await prisma.firm.create({
        data: firmData,
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Get all firms (not deleted).
   * @param {string} dbUrl 
   */
  async getFirms(dbUrl) {
    const prisma = this.getPrisma(dbUrl);
    try {
      return await prisma.firm.findMany({
        where: { firm_is_deleted: false },
        orderBy: { firm_created_at: "desc" },
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Get all firms for dropdown (id and name only).
   * @param {string} dbUrl 
   */
  async getFirmsDropdown(dbUrl) {
    const prisma = this.getPrisma(dbUrl);
    try {
      return await prisma.firm.findMany({
        where: { firm_is_deleted: false },
        select: {
          firm_id: true,
          firm_uuid: true,
          firm_name: true,
        },
        orderBy: { firm_name: "asc" },
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Get a firm by UUID.
   * @param {string} dbUrl 
   * @param {string} firm_uuid 
   */
  async getFirmByUuid(dbUrl, firm_uuid) {
    const prisma = this.getPrisma(dbUrl);
    try {
      return await prisma.firm.findUnique({
        where: { firm_uuid: firm_uuid, firm_is_deleted: false },
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Update a firm by UUID.
   * @param {string} dbUrl 
   * @param {string} firm_uuid 
   * @param {object} updateData 
   */
  async updateFirmByUuid(dbUrl, firm_uuid, updateData) {
    const prisma = this.getPrisma(dbUrl);
    try {
      return await prisma.firm.update({
        where: { firm_uuid: firm_uuid },
        data: updateData,
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Soft delete a firm by UUID.
   * @param {string} dbUrl 
   * @param {string} firm_uuid 
   * @param {string} deletedBy 
   */
  async deleteFirmByUuid(dbUrl, firm_uuid, deletedBy = null) {
    const prisma = this.getPrisma(dbUrl);
    try {
      return await prisma.firm.update({
        where: { firm_uuid: firm_uuid },
        data: {
          firm_is_deleted: true,
          firm_deleted_at: new Date(),
          firm_deleted_by: deletedBy,
        },
      });
    } finally {
      await prisma.$disconnect();
    }
  }
}

module.exports = new FirmService();
