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
   * Get a firm by ID.
   * @param {string} dbUrl 
   * @param {number} firm_id 
   */
  async getFirmById(dbUrl, firm_id) {
    const prisma = this.getPrisma(dbUrl);
    try {
      return await prisma.firm.findUnique({
        where: { firm_id: parseInt(firm_id), firm_is_deleted: false },
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Update a firm.
   * @param {string} dbUrl 
   * @param {number} firm_id 
   * @param {object} updateData 
   */
  async updateFirm(dbUrl, firm_id, updateData) {
    const prisma = this.getPrisma(dbUrl);
    try {
      return await prisma.firm.update({
        where: { firm_id: parseInt(firm_id) },
        data: updateData,
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Soft delete a firm.
   * @param {string} dbUrl 
   * @param {number} firm_id 
   * @param {string} deletedBy 
   */
  async deleteFirm(dbUrl, firm_id, deletedBy = null) {
    const prisma = this.getPrisma(dbUrl);
    try {
      return await prisma.firm.update({
        where: { firm_id: parseInt(firm_id) },
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
