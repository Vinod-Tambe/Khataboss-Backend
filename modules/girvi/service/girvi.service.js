"use strict";

const { PrismaClient } = require("../../../prisma/generated/main");

class GirviService {
  getPrisma(dbUrl) {
    return new PrismaClient({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
  }

  async createGirvi(dbUrl, girviData, stockItems) {
    const prisma = this.getPrisma(dbUrl);
    try {
      return await prisma.$transaction(async (tx) => {
        // Create Girvi
        const newGirvi = await tx.girvi.create({
          data: girviData,
        });

        // Create associated stock items if provided
        if (stockItems && stockItems.length > 0) {
          const stockData = stockItems.map((item) => ({
            ...item,
            st_referance_panel: "girvi",
            st_referance_id: newGirvi.girv_id,
            st_own_id: newGirvi.girv_own_id,
            st_firm_id: newGirvi.girv_firm_id,
            st_user_id: newGirvi.girv_user_id,
          }));

          await tx.stock.createMany({
            data: stockData,
          });
          
          // Fetch and attach the created stock items to verify they were inserted
          const createdStocks = await tx.stock.findMany({
            where: {
              st_referance_panel: "girvi",
              st_referance_id: newGirvi.girv_id
            }
          });
          newGirvi.items = createdStocks;
        }

        return newGirvi;
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  async getGirvis(dbUrl, firmId) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const where = { girv_is_deleted: false };
      if (firmId) {
        where.girv_firm_id = parseInt(firmId);
      }
      return await prisma.girvi.findMany({
        where,
        orderBy: { girv_created_at: "desc" },
      });
    } finally {
      await prisma.$disconnect();
    }
  }
}

module.exports = new GirviService();
