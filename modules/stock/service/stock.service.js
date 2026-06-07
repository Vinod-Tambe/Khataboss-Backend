"use strict";

const { PrismaClient } = require("../../../prisma/generated/main");

class StockService {
  getPrisma(dbUrl) {
    return new PrismaClient({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
  }

  async getStocks(dbUrl, firmId) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const where = { st_is_deleted: false };
      if (firmId) {
        where.st_firm_id = parseInt(firmId);
      }
      return await prisma.stock.findMany({
        where,
        orderBy: { st_created_at: "desc" },
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  async createStock(dbUrl, stockData) {
    const prisma = this.getPrisma(dbUrl);
    try {
      return await prisma.stock.create({
        data: stockData,
      });
    } finally {
      await prisma.$disconnect();
    }
  }
}

module.exports = new StockService();
