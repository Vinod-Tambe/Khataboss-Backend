"use strict";

const { getTenantPrisma } = require("../../../utils/tenantPrisma");
const { calculateFirstMonthInterest } = require("../../../utils/loanInterest");

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

const round2 = (n) => parseFloat((Number(n) || 0).toFixed(2));

function firstMonthInterestAmount(girvi) {
  if (girvi.girv_first_int !== "Y") return 0;
  return (
    calculateFirstMonthInterest(
      girvi.girv_prin_amt,
      girvi.girv_roi,
      girvi.girv_interest_method || "simple",
      girvi.girv_compound_freq || "monthly",
      girvi.girv_roi_type || "monthly"
    ) || 0
  );
}

function financeInterestReceivedAmt(row) {
  const type = String(row.fm_trans_type || "").toUpperCase();
  const amt = parseFloat(row.fm_trans_amt) || 0;
  const info = row.fm_pay_info || "";
  if (type === "INTEREST") {
    const m = /INT:([\d.]+)/i.exec(info);
    return m ? parseFloat(m[1]) || 0 : amt;
  }
  return 0;
}

function financeInterestPaidAmt(row) {
  const type = String(row.fm_trans_type || "").toUpperCase();
  const amt = parseFloat(row.fm_trans_amt) || 0;
  const info = row.fm_pay_info || "";
  if (type === "ROLLBACK") {
    const m = /ROLLBACK_INT:([\d.]+)/i.exec(info);
    if (m) return parseFloat(m[1]) || 0;
    if (/INTEREST/i.test(info) || /ROLLBACK_INT/i.test(info)) return amt;
  }
  return 0;
}

function emptyDayBuckets() {
  return { received: 0, paid: 0 };
}

function bump(bucketMap, dateKey, field, amount) {
  const d = toDateKey(dateKey);
  const a = parseFloat(amount) || 0;
  if (!d || !(a > 0)) return;
  if (!bucketMap[d]) bucketMap[d] = emptyDayBuckets();
  bucketMap[d][field] = round2(bucketMap[d][field] + a);
}

class InterestLedgerService {
  getPrisma(dbUrl) {
    return getTenantPrisma(dbUrl);
  }

  async getInterestDailyLedger(dbUrl, filters = {}) {
    const prisma = this.getPrisma(dbUrl);
    const rangeStart = toDateKey(filters.startDate);
    const rangeEnd = toDateKey(filters.endDate);
    if (!rangeStart || !rangeEnd) {
      throw new Error("startDate and endDate are required (YYYY-MM-DD).");
    }
    if (rangeStart > rangeEnd) {
      throw new Error("startDate must be before or equal to endDate.");
    }

    const firmId = filters.firmId ? parseInt(filters.firmId, 10) : null;

    const applyFirmRelease = (w) => (firmId ? { ...w, rel_firm_id: firmId } : w);
    const applyFirmDeposit = (w) => (firmId ? { ...w, dep_firm_id: firmId } : w);
    const applyFirmGirvi = (w) => (firmId ? { ...w, girv_firm_id: firmId } : w);
    const applyFirmFinance = (w) => (firmId ? { ...w, fm_firm_id: firmId } : w);
    const applyFirmAuction = (w) => (firmId ? { ...w, al_firm_id: firmId } : w);

    try {
      const [releases, deposits, girvisFirstInt, financeTrans, auctions] = await Promise.all([
        prisma.girviRelease.findMany({
          where: applyFirmRelease({ rel_is_deleted: false }),
          select: {
            rel_trans_date: true,
            rel_int_amt: true,
            rel_disc_amt: true,
          },
        }),
        prisma.girviDeposit.findMany({
          where: applyFirmDeposit({ dep_is_deleted: false }),
          select: { dep_trans_date: true, dep_int_amt: true },
        }),
        prisma.girvi.findMany({
          where: applyFirmGirvi({
            girv_is_deleted: false,
            girv_first_int: "Y",
          }),
          select: {
            girv_start_date: true,
            girv_prin_amt: true,
            girv_roi: true,
            girv_interest_method: true,
            girv_compound_freq: true,
            girv_roi_type: true,
            girv_first_int: true,
          },
        }),
        prisma.finance_Money_Transaction.findMany({
          where: applyFirmFinance({
            fm_is_deleted: false,
            fm_trans_type: { in: ["INTEREST", "ROLLBACK"] },
          }),
          select: {
            fm_trans_date: true,
            fm_trans_type: true,
            fm_trans_amt: true,
            fm_pay_info: true,
          },
        }),
        prisma.auctionLoan.findMany({
          where: applyFirmAuction({}),
          select: { al_date: true, al_int_amt: true },
        }),
      ]);

      const dayBuckets = {};
      let opening = 0;

      const applyEvent = (dateKey, received, paid) => {
        const d = toDateKey(dateKey);
        if (!d) return;
        const rec = round2(received);
        const pay = round2(paid);
        if (d < rangeStart) {
          opening = round2(opening + rec - pay);
          return;
        }
        if (d > rangeEnd) return;
        if (rec > 0) bump(dayBuckets, d, "received", rec);
        if (pay > 0) bump(dayBuckets, d, "paid", pay);
      };

      releases.forEach((r) => {
        applyEvent(r.rel_trans_date, parseFloat(r.rel_int_amt) || 0, parseFloat(r.rel_disc_amt) || 0);
      });

      deposits.forEach((d) => {
        applyEvent(d.dep_trans_date, parseFloat(d.dep_int_amt) || 0, 0);
      });

      girvisFirstInt.forEach((g) => {
        const amt = firstMonthInterestAmount(g);
        if (amt > 0) applyEvent(g.girv_start_date, amt, 0);
      });

      financeTrans.forEach((fm) => {
        applyEvent(
          fm.fm_trans_date,
          financeInterestReceivedAmt(fm),
          financeInterestPaidAmt(fm)
        );
      });

      auctions.forEach((a) => {
        applyEvent(a.al_date, parseFloat(a.al_int_amt) || 0, 0);
      });

      let carry = opening;
      const rows = eachDayKeys(rangeStart, rangeEnd).map((date) => {
        const bucket = dayBuckets[date] || emptyDayBuckets();
        const received = round2(bucket.received);
        const paid = round2(bucket.paid);
        const rowOpening = carry;
        const final = round2(rowOpening + received - paid);
        carry = final;
        return {
          date,
          opening: rowOpening,
          received,
          paid,
          final,
        };
      });

      return {
        startDate: rangeStart,
        endDate: rangeEnd,
        rows,
      };
    } finally {
      await prisma.$disconnect();
    }
  }
}

module.exports = new InterestLedgerService();
