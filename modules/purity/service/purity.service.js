"use strict";

const { getTenantPrisma } = require("../../../utils/tenantPrisma");

class PurityService {
  getPrisma(dbUrl) {
    return getTenantPrisma(dbUrl);
  }

  async createPurity(dbUrl, data) {
    const prisma = this.getPrisma(dbUrl);

      const {
        purity_own_id,
        purity_metal,
        purity_name,
        purity_value,
        purity_desc,
        purity_created_by,
      } = data;

      return await prisma.purity.create({
        data: {
          purity_own_id: parseInt(purity_own_id) || 1,
          purity_metal,
          purity_name,
          purity_value: parseFloat(purity_value),
          purity_desc,
          purity_created_by,
        },
      });
    
  }

  async getPurities(dbUrl, metal) {
    const prisma = this.getPrisma(dbUrl);

      const whereClause = { purity_is_deleted: false };
      if (metal) {
        whereClause.purity_metal = metal;
      }

      return await prisma.purity.findMany({
        where: whereClause,
        orderBy: { purity_value: "desc" },
      });
    
  }

  async updatePurity(dbUrl, uuid, data) {
    const prisma = this.getPrisma(dbUrl);

      const {
        purity_metal,
        purity_name,
        purity_value,
        purity_desc,
        purity_updated_by,
      } = data;

      const existingPurity = await prisma.purity.findUnique({
        where: { purity_uuid: uuid }
      });

      if (!existingPurity) {
        throw new Error("Purity not found");
      }

      const newValue = parseFloat(purity_value);

      if (existingPurity.purity_value !== newValue || existingPurity.purity_name !== purity_name) {
        await prisma.rate.updateMany({
          where: {
            rate_metal: existingPurity.purity_metal,
            rate_purity: existingPurity.purity_name,
            rate_is_deleted: false
          },
          data: {
            rate_is_deleted: true,
            rate_updated_at: new Date()
          }
        });
      }

      return await prisma.purity.update({
        where: { purity_uuid: uuid },
        data: {
          purity_metal,
          purity_name,
          purity_value: newValue,
          purity_desc,
          purity_updated_by,
          purity_updated_at: new Date(),
        },
      });
    
  }

  async deletePurity(dbUrl, uuid) {
    const prisma = this.getPrisma(dbUrl);

      const existingPurity = await prisma.purity.findUnique({
        where: { purity_uuid: uuid }
      });

      if (existingPurity) {
        await prisma.rate.updateMany({
          where: {
            rate_metal: existingPurity.purity_metal,
            rate_purity: existingPurity.purity_name,
            rate_is_deleted: false
          },
          data: {
            rate_is_deleted: true,
            rate_updated_at: new Date()
          }
        });
      }

      return await prisma.purity.update({
        where: { purity_uuid: uuid },
        data: {
          purity_is_deleted: true,
          purity_updated_at: new Date(),
        },
      });
    
  }
}

module.exports = new PurityService();
