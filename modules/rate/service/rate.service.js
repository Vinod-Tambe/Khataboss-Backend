"use strict";

const { PrismaClient } = require("../../../prisma/generated/main");

class RateService {
  calculateDynamicRate(baseAmount, inputPurityValue, targetPurityValue) {
    let ratePerUnit = baseAmount / inputPurityValue;
    let finalRate = ratePerUnit * targetPurityValue;
    return Number(finalRate.toFixed(2));
  }

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

  async createRate(dbUrl, data) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const {
        rate_own_id,
        rate_firm_id,
        rate_metal,
        rate_purity,
        rate_amount,
        rate_unit,
        rate_date,
        rate_time,
        rate_desc,
        rate_created_by,
        calculateAll
      } = data;

      const baseAmount = parseFloat(rate_amount);
      const firmIdInt = parseInt(rate_firm_id) || 0;

      // Fetch dynamic purities for the selected metal
      const dynamicPurities = await prisma.purity.findMany({
        where: {
          purity_metal: rate_metal,
          purity_is_deleted: false,
        },
        orderBy: { purity_value: 'desc' }
      });

      let puritiesToCheck = [rate_purity];
      if (calculateAll) {
        if (dynamicPurities.length > 0) {
          puritiesToCheck = dynamicPurities.map(p => p.purity_name);
        } else {
          puritiesToCheck = [];
        }
      }

      const existingRates = await prisma.rate.findMany({
        where: {
          rate_firm_id: firmIdInt,
          rate_metal,
          rate_date,
          rate_is_deleted: false,
          rate_purity: { in: puritiesToCheck }
        }
      });

      const primaryExists = existingRates.find(r => r.rate_purity === rate_purity);
      if (primaryExists) {
        throw new Error("This purity rate is already added.");
      }

      if (calculateAll) {
        const inputPurityObj = dynamicPurities.find(p => p.purity_name === rate_purity);
        const inputPercentage = inputPurityObj ? inputPurityObj.purity_value : parseFloat(rate_purity.replace("%", ""));

        if (isNaN(inputPercentage)) {
          throw new Error("Invalid purity value. Cannot auto-calculate.");
        }

        const createdRates = [];

        for (const purity of puritiesToCheck) {
          const purityObj = dynamicPurities.find(p => p.purity_name === purity);
          const percentage = purityObj ? purityObj.purity_value : parseFloat(purity.replace("%", ""));

          if (isNaN(percentage)) continue;

          let calculatedAmount = this.calculateDynamicRate(baseAmount, inputPercentage, percentage);

          const existingRelated = existingRates.find(r => r.rate_purity === purity);

          if (existingRelated) {
            const updated = await prisma.rate.update({
              where: { rate_id: existingRelated.rate_id },
              data: {
                rate_firm_id: parseInt(rate_firm_id) || 0,
                rate_metal,
                rate_amount: calculatedAmount,
                rate_unit,
                rate_date,
                rate_time,
                rate_desc: purity === rate_purity ? rate_desc : `Auto-calculated based on ${rate_metal} ${rate_purity} rate`,
                rate_updated_by: rate_created_by,
                rate_updated_at: new Date()
              }
            });
            createdRates.push(updated);
          } else {
            const created = await prisma.rate.create({
              data: {
                rate_own_id: parseInt(rate_own_id) || 1,
                rate_firm_id: parseInt(rate_firm_id) || 0,
                rate_metal,
                rate_purity: purity,
                rate_amount: calculatedAmount,
                rate_unit,
                rate_date,
                rate_time,
                rate_desc: purity === rate_purity ? rate_desc : `Auto-calculated based on ${rate_metal} ${rate_purity} rate`,
                rate_created_by
              }
            });
            createdRates.push(created);
          }
        }
        return createdRates.find(r => r.rate_purity === rate_purity) || createdRates[0];
      } else {
        return await prisma.rate.create({
          data: {
            rate_own_id: parseInt(rate_own_id) || 1,
            rate_firm_id: parseInt(rate_firm_id) || 0,
            rate_metal,
            rate_purity,
            rate_amount: baseAmount,
            rate_unit,
            rate_date,
            rate_time,
            rate_desc,
            rate_created_by
          }
        });
      }
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateRate(dbUrl, uuid, data) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const {
        rate_firm_id,
        rate_metal,
        rate_purity,
        rate_amount,
        rate_unit,
        rate_date,
        rate_time,
        rate_desc,
        rate_updated_by,
        calculateAll
      } = data;

      const baseAmount = parseFloat(rate_amount);

      const existingRate = await prisma.rate.findUnique({
        where: { rate_uuid: uuid }
      });

      if (!existingRate) throw new Error("Rate not found");

      if (calculateAll) {
        const dynamicPurities = await prisma.purity.findMany({
          where: {
            purity_metal: rate_metal,
            purity_is_deleted: false,
          },
          orderBy: { purity_value: 'desc' }
        });

        const inputPurityObj = dynamicPurities.find(p => p.purity_name === rate_purity);
        const inputPercentage = inputPurityObj ? inputPurityObj.purity_value : parseFloat(rate_purity.replace("%", ""));

        if (isNaN(inputPercentage)) {
          throw new Error("Invalid purity value. Cannot auto-calculate.");
        }

        let puritiesToCalculate = [];
        if (dynamicPurities.length > 0) {
          puritiesToCalculate = dynamicPurities.map(p => p.purity_name);
        }

        const relatedRates = await prisma.rate.findMany({
          where: {
            rate_firm_id: existingRate.rate_firm_id,
            rate_metal: existingRate.rate_metal,
            rate_date: existingRate.rate_date,
            rate_is_deleted: false
          }
        });

        const updatedRates = [];

        for (const purity of puritiesToCalculate) {
          const purityObj = dynamicPurities.find(p => p.purity_name === purity);
          const percentage = purityObj ? purityObj.purity_value : parseFloat(purity.replace("%", ""));

          if (isNaN(percentage)) continue;

          let calculatedAmount = this.calculateDynamicRate(baseAmount, inputPercentage, percentage);

          const existingRelated = relatedRates.find(r => r.rate_purity === purity);

          if (existingRelated) {
            const updated = await prisma.rate.update({
              where: { rate_id: existingRelated.rate_id },
              data: {
                rate_firm_id: parseInt(rate_firm_id) || 0,
                rate_metal,
                rate_amount: calculatedAmount,
                rate_unit,
                rate_date,
                rate_time,
                rate_desc: purity === rate_purity ? rate_desc : `Auto-calculated based on ${rate_metal} ${rate_purity} rate`,
                rate_updated_by,
                rate_updated_at: new Date()
              }
            });
            updatedRates.push(updated);
          }
        }
        return updatedRates.find(r => r.rate_purity === rate_purity) || updatedRates[0];
      } else {
        return await prisma.rate.update({
          where: { rate_uuid: uuid },
          data: {
            rate_firm_id: parseInt(rate_firm_id) || 0,
            rate_metal,
            rate_purity,
            rate_amount: baseAmount,
            rate_unit,
            rate_date,
            rate_time,
            rate_desc,
            rate_updated_by,
            rate_updated_at: new Date()
          }
        });
      }
    } finally {
      await prisma.$disconnect();
    }
  }

  async getRates(dbUrl, firmId) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const whereClause = { rate_is_deleted: false };
      if (firmId && firmId !== 'all') {
        whereClause.rate_firm_id = parseInt(firmId);
      }

      return await prisma.rate.findMany({
        where: whereClause,
        orderBy: [
          { rate_date: "desc" },
          { rate_time: "desc" },
          { rate_id: "desc" }
        ],
        include: {
          firm: {
            select: { firm_name: true }
          }
        }
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  async deleteRate(dbUrl, uuid) {
    const prisma = this.getPrisma(dbUrl);
    try {
      return await prisma.rate.update({
        where: { rate_uuid: uuid },
        data: { rate_is_deleted: true, rate_deleted_at: new Date() }
      });
    } finally {
      await prisma.$disconnect();
    }
  }
}

module.exports = new RateService();
