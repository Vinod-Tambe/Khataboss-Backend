"use strict";

const { PrismaClient } = require("../../../prisma/generated/main");

class JournalTransService {
  /**
   * Get the prisma client for the given tenant database URL.
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
   * Get aggregated journal transaction totals for all accounts within a date range.
   * @param {string} dbUrl 
   * @param {string} startDate 
   * @param {string} endDate 
   * @param {number|string} firmId 
   */
  async get_all_acc_journal_trans(dbUrl, startDate, endDate, firmId) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const where = {};
      if (firmId && firmId !== "N") {
        where.jrtr_firm_id = parseInt(firmId);
      }

      const dateQuery = {};
      if (startDate) dateQuery.gte = startDate;
      if (endDate) dateQuery.lte = endDate;
      if (Object.keys(dateQuery).length > 0) {
        where.jrtr_date = dateQuery;
      }

      // Group by Credit Account
      const crAggregates = await prisma.journalTransaction.groupBy({
        by: ["jrtr_cr_acc_id"],
        where: {
          ...where,
          jrtr_cr_acc_id: { not: null },
        },
        _sum: {
          jrtr_cr_amt: true,
        },
      });

      // Group by Debit Account
      const drAggregates = await prisma.journalTransaction.groupBy({
        by: ["jrtr_dr_acc_id"],
        where: {
          ...where,
          jrtr_dr_acc_id: { not: null },
        },
        _sum: {
          jrtr_dr_amt: true,
        },
      });

      // Merge results
      const accountMap = new Map();

      crAggregates.forEach((item) => {
        const accId = item.jrtr_cr_acc_id;
        accountMap.set(accId, {
          acc_id: accId,
          total_cr_amt: parseFloat(item._sum.jrtr_cr_amt || 0),
          total_dr_amt: 0,
        });
      });

      drAggregates.forEach((item) => {
        const accId = item.jrtr_dr_acc_id;
        const existing = accountMap.get(accId);
        if (existing) {
          existing.total_dr_amt = parseFloat(item._sum.jrtr_dr_amt || 0);
        } else {
          accountMap.set(accId, {
            acc_id: accId,
            total_cr_amt: 0,
            total_dr_amt: parseFloat(item._sum.jrtr_dr_amt || 0),
          });
        }
      });

      return Array.from(accountMap.values());
    } catch (error) {
      console.error("❌ Error in get_all_acc_journal_trans:", error.message);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }
}

module.exports = new JournalTransService();
