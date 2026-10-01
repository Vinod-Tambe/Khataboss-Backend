"use strict";

const { getTenantPrisma } = require("../../../utils/tenantPrisma");

const USER_LEDGER_SELECT = {
  user_id: true,
  user_uuid: true,
  user_unique_code: true,
  user_first_name: true,
  user_last_name: true,
  user_mobile_no: true,
  user_phone_no: true,
  user_profile_img: true,
};

const GIRV_LEDGER_SELECT = {
  girv_id: true,
  girv_uuid: true,
  girv_unique_code: true,
  girv_loan_no: true,
  girv_start_date: true,
  girv_status: true,
  girv_packet_no: true,
  girv_locker_no: true,
  girv_type: true,
};

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

  parseFirmId(firmId) {
    if (firmId == null || firmId === "" || firmId === "all" || firmId === "N") {
      return null;
    }
    const id = parseInt(firmId, 10);
    return Number.isNaN(id) ? null : id;
  }

  async resolveGirvIdsForLoanStatus(prisma, loanStatus, firmId) {
    const girvWhere = {
      girv_is_deleted: false,
      girv_status: String(loanStatus).toUpperCase(),
    };
    const parsedFirm = this.parseFirmId(firmId);
    if (parsedFirm != null) {
      girvWhere.girv_firm_id = parsedFirm;
    }
    const matching = await prisma.girvi.findMany({
      where: girvWhere,
      select: { girv_id: true },
    });
    return matching.map((g) => g.girv_id);
  }

  async resolveGirvIdsForDateRange(prisma, startDate, endDate) {
    const rangeStart = new Date(startDate);
    const rangeEnd = new Date(endDate);
    rangeEnd.setHours(23, 59, 59, 999);
    if (Number.isNaN(rangeStart.getTime()) || Number.isNaN(rangeEnd.getTime())) {
      return null;
    }

    const girvis = await prisma.girvi.findMany({
      where: { girv_is_deleted: false },
      select: { girv_id: true, girv_start_date: true },
    });

    return girvis
      .filter((g) => {
        const pledgeDate = g.girv_start_date ? new Date(g.girv_start_date) : null;
        if (!pledgeDate || Number.isNaN(pledgeDate.getTime())) return false;
        return pledgeDate >= rangeStart && pledgeDate <= rangeEnd;
      })
      .map((g) => g.girv_id);
  }

  async resolveGirvIdsForSearch(prisma, search) {
    const term = String(search || "").trim();
    if (!term) return [];

    const girvMatches = await prisma.girvi.findMany({
      where: {
        girv_is_deleted: false,
        OR: [
          { girv_loan_no: { contains: term } },
          { girv_unique_code: { contains: term } },
        ],
      },
      select: { girv_id: true },
    });
    return girvMatches.map((g) => g.girv_id);
  }

  intersectIds(currentIds, nextIds) {
    if (currentIds == null) return nextIds;
    if (!nextIds.length) return [];
    const set = new Set(nextIds);
    return currentIds.filter((id) => set.has(id));
  }

  async attachLoans(prisma, stocks) {
    const girvIds = [
      ...new Set(stocks.map((s) => s.st_referance_id).filter((id) => id != null)),
    ];

    const girvis =
      girvIds.length > 0
        ? await prisma.girvi.findMany({
            where: { girv_id: { in: girvIds }, girv_is_deleted: false },
            select: GIRV_LEDGER_SELECT,
          })
        : [];

    const girvMap = Object.fromEntries(girvis.map((g) => [g.girv_id, g]));

    return stocks.map((st) => ({
      ...st,
      loan: girvMap[st.st_referance_id] || null,
    }));
  }

  /**
   * Pledged items (loan collateral) with linked loan + customer.
   * Supports pagination (default page=1, limit=16) and filters.
   */
  async getStockLedger(dbUrl, filters = {}) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const page = Math.max(1, parseInt(filters.page, 10) || 1);
      const limit = Math.min(
        5000,
        Math.max(1, parseInt(filters.limit, 10) || 16)
      );
      const skip = (page - 1) * limit;

      const and = [{ st_is_deleted: false }, { st_referance_panel: "girvi" }];

      const parsedFirm = this.parseFirmId(filters.firmId);
      if (parsedFirm != null) {
        and.push({ st_firm_id: parsedFirm });
      }

      if (filters.metalType && filters.metalType !== "ALL") {
        and.push({ st_metal_type: String(filters.metalType).toLowerCase() });
      }

      if (filters.itemStatus && filters.itemStatus !== "ALL") {
        and.push({ st_status: String(filters.itemStatus).toLowerCase() });
      }

      let girvIdFilter = null;

      if (filters.loanStatus && filters.loanStatus !== "ALL") {
        girvIdFilter = await this.resolveGirvIdsForLoanStatus(
          prisma,
          filters.loanStatus,
          filters.firmId
        );
        if (!girvIdFilter.length) {
          return { data: [], total: 0, page, limit, totalPages: 0 };
        }
      }

      if (filters.startDate && filters.endDate) {
        const dateIds = await this.resolveGirvIdsForDateRange(
          prisma,
          filters.startDate,
          filters.endDate
        );
        if (dateIds == null) {
          return { data: [], total: 0, page, limit, totalPages: 0 };
        }
        girvIdFilter = this.intersectIds(girvIdFilter, dateIds);
        if (!girvIdFilter.length) {
          return { data: [], total: 0, page, limit, totalPages: 0 };
        }
      }

      if (girvIdFilter != null) {
        and.push({ st_referance_id: { in: girvIdFilter } });
      }

      const search = String(filters.search || filters.q || "").trim();
      if (search) {
        const searchGirvIds = await this.resolveGirvIdsForSearch(prisma, search);
        const orClause = [
          { st_item_name: { contains: search } },
          {
            user: {
              OR: [
                { user_first_name: { contains: search } },
                { user_last_name: { contains: search } },
                { user_mobile_no: { contains: search } },
                { user_phone_no: { contains: search } },
                { user_unique_code: { contains: search } },
              ],
            },
          },
        ];
        if (searchGirvIds.length) {
          orClause.push({ st_referance_id: { in: searchGirvIds } });
        }
        and.push({ OR: orClause });
      }

      const where = { AND: and };

      const total = await prisma.stock.count({ where });

      const stocks = await prisma.stock.findMany({
        where,
        orderBy: { st_created_at: "desc" },
        skip,
        take: limit,
        include: {
          firm: { select: { firm_id: true, firm_name: true } },
          user: { select: USER_LEDGER_SELECT },
        },
      });

      const data = await this.attachLoans(prisma, stocks);
      const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

      return { data, total, page, limit, totalPages };
    } finally {
      await prisma.$disconnect();
    }
  }

  async getStockByUuid(dbUrl, stockUuid) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const uuid = String(stockUuid || "").trim();
      if (!uuid) {
        throw new Error("Stock id is required");
      }

      const isNumericId = /^\d+$/.test(uuid);
      const stock = await prisma.stock.findFirst({
        where: isNumericId
          ? { st_id: parseInt(uuid, 10), st_is_deleted: false }
          : { st_uuid: uuid, st_is_deleted: false },
        include: {
          firm: { select: { firm_id: true, firm_name: true } },
          user: {
            select: {
              user_id: true,
              user_uuid: true,
              user_unique_code: true,
              user_first_name: true,
              user_last_name: true,
              user_father_name: true,
              user_mobile_no: true,
              user_whatsapp_no: true,
              user_city: true,
              user_per_address: true,
              user_curr_address: true,
              user_profile_img: true,
            },
          },
        },
      });

      if (!stock) {
        throw new Error("Stock not found");
      }

      let loan = null;
      let loanItems = [];

      if (
        stock.st_referance_panel === "girvi" &&
        stock.st_referance_id != null
      ) {
        loan = await prisma.girvi.findFirst({
          where: {
            girv_id: stock.st_referance_id,
            girv_is_deleted: false,
          },
          select: {
            girv_id: true,
            girv_uuid: true,
            girv_unique_code: true,
            girv_loan_no: true,
            girv_loan_pre_no: true,
            girv_start_date: true,
            girv_status: true,
            girv_type: true,
            girv_prin_amt: true,
            girv_final_amt: true,
            girv_roi: true,
            girv_roi_type: true,
            girv_packet_no: true,
            girv_locker_no: true,
            girv_interest_method: true,
            girv_compound_freq: true,
          },
        });

        loanItems = await prisma.stock.findMany({
          where: {
            st_referance_panel: "girvi",
            st_referance_id: stock.st_referance_id,
            st_is_deleted: false,
          },
          orderBy: { st_id: "asc" },
        });
      }

      return { stock, loan, loanItems };
    } finally {
      await prisma.$disconnect();
    }
  }
}

module.exports = new StockService();
