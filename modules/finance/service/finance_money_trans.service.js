"use strict";

const { PrismaClient } = require("../../../prisma/generated/main");
const journalService = require("../../journal/service/journal.service");

class FinanceMoneyTransService {
  getPrisma(dbUrl) {
    return new PrismaClient({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
  }

  async create_finance_money_entry(dbUrl, transData) {
    const prisma = this.getPrisma(dbUrl);
    try {
      return await prisma.finance_Money_Transaction.create({
        data: transData,
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  async delete_finance_money_entries(dbUrl, fin_id) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const entries = await prisma.finance_Money_Transaction.findMany({
        where: { fm_fin_id: parseInt(fin_id) },
      });

      if (entries.length === 0) return { deletedCount: 0 };

      const result = await prisma.finance_Money_Transaction.deleteMany({
        where: { fm_fin_id: parseInt(fin_id) },
      });

      for (const entry of entries) {
        if (entry.fm_jrnl_id) {
          await journalService.delete_journal_entry(dbUrl, entry.fm_jrnl_id, entry.fm_own_id, entry.fm_firm_id);
        }
      }

      return {
        deletedCount: result.count,
        deletedEntries: entries,
      };
    } finally {
      await prisma.$disconnect();
    }
  }
}

module.exports = new FinanceMoneyTransService();
