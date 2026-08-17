"use strict";

const { getTenantPrisma } = require("../../../utils/tenantPrisma");

class StockService {
  getPrisma(dbUrl) {
    return getTenantPrisma(dbUrl);
  }

  async getStocks(dbUrl, firmId) {
    const prisma = this.getPrisma(dbUrl);

      const where = { st_is_deleted: false };
      if (firmId) {
        where.st_firm_id = parseInt(firmId);
      }
      return await prisma.stock.findMany({
        where,
        orderBy: { st_created_at: "desc" },
      });
    
  }

  async createStock(dbUrl, stockData) {
    const prisma = this.getPrisma(dbUrl);

      return await prisma.stock.create({
        data: stockData,
      });
    
  }
}

module.exports = new StockService();
