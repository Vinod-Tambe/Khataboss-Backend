"use strict";

const { PrismaClient } = require("../../../prisma/generated/main");

class MoneyLenderService {
  getPrisma(dbUrl) {
    return new PrismaClient({
      datasources: { db: { url: dbUrl } },
    });
  }

  async checkUniqueFields(dbUrl, data, excludeUuid = null) {
    const prisma = this.getPrisma(dbUrl);
    try {
      if (data.ml_phone) {
        const existingPhone = await prisma.moneyLender.findFirst({
          where: {
            ml_phone: data.ml_phone,
            is_active: true,
            NOT: excludeUuid ? { ml_uuid: excludeUuid } : undefined,
          }
        });
        if (existingPhone) return { error: `Money Lender already exists with Phone: ${data.ml_phone}` };
      }

      if (data.ml_aadhaar) {
        const existingAadhaar = await prisma.moneyLender.findFirst({
          where: {
            ml_aadhaar: data.ml_aadhaar,
            is_active: true,
            NOT: excludeUuid ? { ml_uuid: excludeUuid } : undefined,
          }
        });
        if (existingAadhaar) return { error: `Money Lender already exists with Aadhaar: ${data.ml_aadhaar}` };
      }

      if (data.ml_pan) {
        const existingPan = await prisma.moneyLender.findFirst({
          where: {
            ml_pan: data.ml_pan,
            is_active: true,
            NOT: excludeUuid ? { ml_uuid: excludeUuid } : undefined,
          }
        });
        if (existingPan) return { error: `Money Lender already exists with PAN: ${data.ml_pan}` };
      }

      if (data.ml_email) {
        const existingEmail = await prisma.moneyLender.findFirst({
          where: {
            ml_email: data.ml_email,
            is_active: true,
            NOT: excludeUuid ? { ml_uuid: excludeUuid } : undefined,
          }
        });
        if (existingEmail) return { error: `Money Lender already exists with Email: ${data.ml_email}` };
      }

      return null;
    } finally {
      await prisma.$disconnect();
    }
  }

  async createMoneyLender(dbUrl, data) {
    const prisma = this.getPrisma(dbUrl);
    try {
      if (data.ml_dob) data.ml_dob = new Date(data.ml_dob); else delete data.ml_dob;
      if (data.ml_firm_id) data.ml_firm_id = parseInt(data.ml_firm_id); else delete data.ml_firm_id;
      if (data.ml_own_id) data.ml_own_id = parseInt(data.ml_own_id);

      // Clean empty strings so they don't break optional date/int fields
      Object.keys(data).forEach(key => {
        if (data[key] === "") data[key] = null;
      });

      return await prisma.moneyLender.create({
        data,
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  async getMoneyLenders(dbUrl) {
    const prisma = this.getPrisma(dbUrl);
    try {
      return await prisma.moneyLender.findMany({
        where: { is_active: true },
        orderBy: { created_at: "desc" },
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  async getMoneyLenderByUuid(dbUrl, uuid) {
    const prisma = this.getPrisma(dbUrl);
    try {
      return await prisma.moneyLender.findUnique({
        where: { ml_uuid: uuid },
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateMoneyLender(dbUrl, uuid, data) {
    const prisma = this.getPrisma(dbUrl);
    try {
      if (data.ml_dob) data.ml_dob = new Date(data.ml_dob); else delete data.ml_dob;
      if (data.ml_firm_id) data.ml_firm_id = parseInt(data.ml_firm_id); else delete data.ml_firm_id;
      
      Object.keys(data).forEach(key => {
        if (data[key] === "") data[key] = null;
      });
      
      return await prisma.moneyLender.update({
        where: { ml_uuid: uuid },
        data,
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  async deleteMoneyLender(dbUrl, uuid) {
    const prisma = this.getPrisma(dbUrl);
    try {
      return await prisma.moneyLender.update({
        where: { ml_uuid: uuid },
        data: {
          is_active: false,
        },
      });
    } finally {
      await prisma.$disconnect();
    }
  }
}

module.exports = new MoneyLenderService();
