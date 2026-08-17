"use strict";

const { getTenantPrisma } = require("../../../utils/tenantPrisma");

class JournalTransService {
  /**
   * Get the prisma client for the given tenant database URL.
   */
  getPrisma(dbUrl) {
    return getTenantPrisma(dbUrl);
  }

  /**
   * Get aggregated journal transaction totals for all accounts within a date range.
   * Excludes soft-deleted journal lines and soft-deleted parent journals.
   * @param {string} dbUrl
   * @param {string} startDate
   * @param {string} endDate
   * @param {number|string} firmId
   */
  async get_all_acc_journal_trans(dbUrl, startDate, endDate, firmId) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const where = {
        jrtr_is_deleted: false,
        journal: { jrnl_is_deleted: false },
      };
      if (firmId && firmId !== "N") {
        where.jrtr_firm_id = parseInt(firmId);
      }

      const dateQuery = {};
      if (startDate) dateQuery.gte = startDate;
      if (endDate) dateQuery.lte = endDate;
      if (Object.keys(dateQuery).length > 0) {
        where.jrtr_date = dateQuery;
      }

      // findMany supports relation filters; groupBy does not
      const rows = await prisma.journalTransaction.findMany({
        where,
        select: {
          jrtr_cr_acc_id: true,
          jrtr_dr_acc_id: true,
          jrtr_cr_amt: true,
          jrtr_dr_amt: true,
        },
      });

      const accountMap = new Map();

      for (const item of rows) {
        if (item.jrtr_cr_acc_id != null) {
          const accId = item.jrtr_cr_acc_id;
          const existing = accountMap.get(accId) || {
            acc_id: accId,
            total_cr_amt: 0,
            total_dr_amt: 0,
          };
          existing.total_cr_amt += parseFloat(item.jrtr_cr_amt || 0);
          accountMap.set(accId, existing);
        }
        if (item.jrtr_dr_acc_id != null) {
          const accId = item.jrtr_dr_acc_id;
          const existing = accountMap.get(accId) || {
            acc_id: accId,
            total_cr_amt: 0,
            total_dr_amt: 0,
          };
          existing.total_dr_amt += parseFloat(item.jrtr_dr_amt || 0);
          accountMap.set(accId, existing);
        }
      }

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
