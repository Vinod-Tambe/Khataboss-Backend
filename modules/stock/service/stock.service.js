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

  /**
   * Pledged items (loan collateral) with linked loan + customer for item ledger report.
   */
  async getStockLedger(dbUrl, filters = {}) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const where = {
        st_is_deleted: false,
        st_referance_panel: "girvi",
      };
      if (filters.firmId) {
        where.st_firm_id = parseInt(filters.firmId);
      }
      if (filters.metalType && filters.metalType !== "ALL") {
        where.st_metal_type = String(filters.metalType).toLowerCase();
      }
      if (filters.itemStatus && filters.itemStatus !== "ALL") {
        where.st_status = String(filters.itemStatus).toLowerCase();
      }

      const stocks = await prisma.stock.findMany({
        where,
        orderBy: { st_created_at: "desc" },
        include: {
          firm: { select: { firm_id: true, firm_name: true } },
          user: {
            select: {
              user_id: true,
              user_first_name: true,
              user_last_name: true,
              user_mobile_no: true,
            },
          },
        },
      });

      const girvIds = [
        ...new Set(
          stocks.map((s) => s.st_referance_id).filter((id) => id != null)
        ),
      ];

      const girvis =
        girvIds.length > 0
          ? await prisma.girvi.findMany({
              where: { girv_id: { in: girvIds }, girv_is_deleted: false },
              select: {
                girv_id: true,
                girv_uuid: true,
                girv_unique_code: true,
                girv_loan_no: true,
                girv_start_date: true,
                girv_status: true,
                girv_packet_no: true,
                girv_locker_no: true,
                girv_type: true,
              },
            })
          : [];

      const girvMap = Object.fromEntries(girvis.map((g) => [g.girv_id, g]));

      let rows = stocks.map((st) => ({
        ...st,
        loan: girvMap[st.st_referance_id] || null,
      }));

      if (filters.loanStatus && filters.loanStatus !== "ALL") {
        const loanStatus = String(filters.loanStatus).toUpperCase();
        rows = rows.filter(
          (r) => String(r.loan?.girv_status || "").toUpperCase() === loanStatus
        );
      }

      if (filters.startDate && filters.endDate) {
        const rangeStart = new Date(filters.startDate);
        const rangeEnd = new Date(filters.endDate);
        rangeEnd.setHours(23, 59, 59, 999);
        rows = rows.filter((r) => {
          const pledgeDate = r.loan?.girv_start_date
            ? new Date(r.loan.girv_start_date)
            : r.st_add_date
              ? new Date(r.st_add_date)
              : null;
          if (!pledgeDate || Number.isNaN(pledgeDate.getTime())) return true;
          return pledgeDate >= rangeStart && pledgeDate <= rangeEnd;
        });
      }

      return rows;
    } finally {
      await prisma.$disconnect();
    }
  }
}

module.exports = new StockService();
