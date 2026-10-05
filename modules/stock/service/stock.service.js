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

/** Case-insensitive substring match (PostgreSQL). */
const icontains = (value) => ({
  contains: String(value || "").trim(),
  mode: "insensitive",
});

const toDateKey = (value) => {
  if (!value) return null;
  const s = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
};

const eachDayKeys = (startKey, endKey) => {
  const days = [];
  let cur = new Date(`${startKey}T12:00:00.000Z`);
  const end = new Date(`${endKey}T12:00:00.000Z`);
  if (Number.isNaN(cur.getTime()) || Number.isNaN(end.getTime())) return days;
  while (cur <= end) {
    days.push(cur.toISOString().slice(0, 10));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return days;
};

const groupBy = (rows, idKey) =>
  rows.reduce((acc, row) => {
    const id = row[idKey];
    if (!acc[id]) acc[id] = [];
    acc[id].push(row);
    return acc;
  }, {});

const loanPrincipalAsOf = (loan, aps = [], deps = [], asOfDateKey) => {
  let principal = parseFloat(loan.girv_prin_amt) || 0;
  aps.forEach((ap) => {
    const d = toDateKey(ap.ap_trans_date);
    if (d && d < asOfDateKey) {
      principal += parseFloat(ap.ap_prin_amt) || 0;
    }
  });
  deps.forEach((dep) => {
    const d = toDateKey(dep.dep_trans_date);
    if (d && d < asOfDateKey) {
      principal -= parseFloat(dep.dep_prin_amt) || 0;
    }
  });
  return Math.max(0, parseFloat(principal.toFixed(2)));
};

const isLoanInStockOnDate = (loan, releases = [], dayKey) => {
  const start = toDateKey(loan.girv_start_date);
  if (!start || start >= dayKey) return false;
  const closedBefore = releases.some((rel) => {
    const rd = toDateKey(rel.rel_trans_date);
    return rd && rd < dayKey;
  });
  return !closedBefore;
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
          { girv_loan_no: icontains(term) },
          { girv_unique_code: icontains(term) },
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
          { st_item_name: icontains(search) },
          {
            user: {
              OR: [
                { user_first_name: icontains(search) },
                { user_last_name: icontains(search) },
                { user_mobile_no: icontains(search) },
                { user_phone_no: icontains(search) },
                { user_whatsapp_no: icontains(search) },
                { user_unique_code: icontains(search) },
                { user_father_name: icontains(search) },
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

  emptyDailyLedgerRows(rangeStart, rangeEnd) {
    const dayKeys = eachDayKeys(rangeStart, rangeEnd);
    return dayKeys.map((date) => ({
      date,
      opening: { amount: 0, girvi: 0 },
      received: { amount: 0, girvi: 0 },
      total: { amount: 0, girvi: 0 },
      released: { amount: 0, girvi: 0 },
      final: { amount: 0, girvi: 0 },
      interest: 0,
    }));
  }

  async computeDailyGirviMovementLedger(prisma, rangeStart, rangeEnd, girviWhere) {
    const girvis = await prisma.girvi.findMany({
        where: girviWhere,
        select: {
          girv_id: true,
          girv_start_date: true,
          girv_prin_amt: true,
          girv_status: true,
        },
      });

    const girvIds = girvis.map((g) => g.girv_id);
    if (!girvIds.length) {
      return this.emptyDailyLedgerRows(rangeStart, rangeEnd);
    }

    const [releases, additionalPrincipals, deposits] = await Promise.all([
        prisma.girviRelease.findMany({
          where: { rel_girv_id: { in: girvIds }, rel_is_deleted: false },
          select: {
            rel_girv_id: true,
            rel_trans_date: true,
            rel_prin_amt: true,
            rel_int_amt: true,
          },
        }),
        prisma.additionalPrincipal.findMany({
          where: { ap_girv_id: { in: girvIds }, ap_is_deleted: false },
          select: {
            ap_girv_id: true,
            ap_trans_date: true,
            ap_prin_amt: true,
          },
        }),
        prisma.girviDeposit.findMany({
          where: { dep_girv_id: { in: girvIds }, dep_is_deleted: false },
          select: {
            dep_girv_id: true,
            dep_trans_date: true,
            dep_prin_amt: true,
            dep_int_amt: true,
          },
        }),
    ]);

    const relByGirv = groupBy(releases, "rel_girv_id");
      const apByGirv = groupBy(additionalPrincipals, "ap_girv_id");
    const depByGirv = groupBy(deposits, "dep_girv_id");

    let carryAmount = 0;
      let carryGirvi = 0;
      girvis.forEach((loan) => {
        if (!isLoanInStockOnDate(loan, relByGirv[loan.girv_id] || [], rangeStart)) {
          return;
        }
        carryGirvi += 1;
        carryAmount += loanPrincipalAsOf(
          loan,
          apByGirv[loan.girv_id],
          depByGirv[loan.girv_id],
          rangeStart
        );
      });
    carryAmount = parseFloat(carryAmount.toFixed(2));

    const dayKeys = eachDayKeys(rangeStart, rangeEnd);
    const rows = dayKeys.map((dateKey) => {
        const opening = {
          amount: carryAmount,
          girvi: carryGirvi,
        };

      let receivedAmount = 0;
      let receivedGirvi = 0;
      let releasedAmount = 0;
      let releasedGirvi = 0;
      let interest = 0;

      girvis.forEach((loan) => {
          const start = toDateKey(loan.girv_start_date);
          if (start === dateKey) {
            receivedAmount += parseFloat(loan.girv_prin_amt) || 0;
            receivedGirvi += 1;
          }
        });

        additionalPrincipals.forEach((ap) => {
          if (toDateKey(ap.ap_trans_date) === dateKey) {
            receivedAmount += parseFloat(ap.ap_prin_amt) || 0;
          }
        });

        releases.forEach((rel) => {
          if (toDateKey(rel.rel_trans_date) === dateKey) {
            releasedAmount += parseFloat(rel.rel_prin_amt) || 0;
            releasedGirvi += 1;
            interest += parseFloat(rel.rel_int_amt) || 0;
          }
        });

        deposits.forEach((dep) => {
          if (toDateKey(dep.dep_trans_date) === dateKey) {
            releasedAmount += parseFloat(dep.dep_prin_amt) || 0;
            interest += parseFloat(dep.dep_int_amt) || 0;
          }
        });

        receivedAmount = parseFloat(receivedAmount.toFixed(2));
        releasedAmount = parseFloat(releasedAmount.toFixed(2));
        interest = parseFloat(interest.toFixed(2));

        const total = {
          amount: parseFloat((opening.amount + receivedAmount).toFixed(2)),
          girvi: opening.girvi + receivedGirvi,
        };
        const final = {
          amount: parseFloat(Math.max(0, total.amount - releasedAmount).toFixed(2)),
          girvi: Math.max(0, total.girvi - releasedGirvi),
        };

        const row = {
          date: dateKey,
          opening,
          received: { amount: receivedAmount, girvi: receivedGirvi },
          total,
          released: { amount: releasedAmount, girvi: releasedGirvi },
          final,
          interest,
        };

      carryAmount = final.amount;
      carryGirvi = final.girvi;
      return row;
    });

    return rows;
  }

  async runDailyGirviMovementLedgerReport(dbUrl, filters, girviWhereExtra = {}) {
    const prisma = this.getPrisma(dbUrl);
    const rangeStart = toDateKey(filters.startDate);
    const rangeEnd = toDateKey(filters.endDate);
    if (!rangeStart || !rangeEnd) {
      throw new Error("startDate and endDate are required (YYYY-MM-DD).");
    }
    if (rangeStart > rangeEnd) {
      throw new Error("startDate must be before or equal to endDate.");
    }

    const girviWhere = {
      girv_is_deleted: false,
      ...girviWhereExtra,
    };
    if (filters.firmId) {
      girviWhere.girv_firm_id = parseInt(filters.firmId, 10);
    }

    try {
      const rows = await this.computeDailyGirviMovementLedger(
        prisma,
        rangeStart,
        rangeEnd,
        girviWhere
      );
      return {
        startDate: rangeStart,
        endDate: rangeEnd,
        rows,
      };
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Daily loan stock ledger (all active loans): opening → received → total → released → closing.
   */
  async getLoanStockDailyLedger(dbUrl, filters = {}) {
    return this.runDailyGirviMovementLedgerReport(dbUrl, filters, {});
  }

  /**
   * Daily transferred-in loan ledger: loans received via inter-firm / ML transfer only.
   */
  async getTransferredLoanDailyLedger(dbUrl, filters = {}) {
    return this.runDailyGirviMovementLedgerReport(dbUrl, filters, {
      girv_is_transferred_in: true,
    });
  }
}

module.exports = new StockService();
