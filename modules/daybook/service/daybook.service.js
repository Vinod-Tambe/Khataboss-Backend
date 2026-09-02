"use strict";

const { getTenantPrisma } = require("../../../utils/tenantPrisma");
const accountService = require("../../account/service/account.service");
const userService = require("../../user/service/user.service");
const { calculateFirstMonthInterest } = require("../../../utils/loanInterest");

/** Finance money-trans types counted as cash inflows in Day Book + opening balance. */
const FINANCE_COLLECTION_INFLOW_TYPES = ["PAID", "CLOSE", "FINE", "INTEREST"];

class DaybookService {
  /**
   * Get the prisma client for the given tenant database URL.
   * @param {string} dbUrl 
   */
  getPrisma(dbUrl) {
    return getTenantPrisma(dbUrl);
  }

  // Reusable function to format date as DD-MM-YYYY
  formatDateToDDMMYYYY(date) {
    if (!date) return "";
    let d;
    if (typeof date === "string" && date.match(/^\d{2}-\d{2}-\d{4}$/)) {
      const [day, month, year] = date.split("-");
      d = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
    } else {
      d = new Date(date);
    }
    if (isNaN(d)) return "";
    const day = String(d.getUTCDate()).padStart(2, "0");
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const year = d.getUTCFullYear();
    return `${day}-${month}-${year}`;
  }

  // Helper to resolve user name
  async getCustomerName(dbUrl, userId) {
    if (!userId) return "-";
    const name = await userService.get_user_full_name(dbUrl, userId);
    return name || "-";
  }

  /**
   * Scale cash channels so they sum to principal (transfer IN = principal out only).
   */
  scaleChannelsToAmount(channels = {}, targetAmount = 0) {
    const cash = parseFloat(channels.cash) || 0;
    const bank = parseFloat(channels.bank) || 0;
    const online = parseFloat(channels.online) || 0;
    const card = parseFloat(channels.card) || 0;
    const total = cash + bank + online + card;
    const target = parseFloat(targetAmount) || 0;
    if (!(target > 0)) return { cash: 0, bank: 0, online: 0, card: 0 };
    if (!(total > 0)) return { cash: target, bank: 0, online: 0, card: 0 };
    if (Math.abs(total - target) < 0.01) return { cash, bank, online, card };
    const scale = target / total;
    const scaled = {
      cash: parseFloat((cash * scale).toFixed(2)),
      bank: parseFloat((bank * scale).toFixed(2)),
      online: parseFloat((online * scale).toFixed(2)),
      card: parseFloat((card * scale).toFixed(2)),
    };
    const sum = scaled.cash + scaled.bank + scaled.online + scaled.card;
    const diff = parseFloat((target - sum).toFixed(2));
    if (diff !== 0) {
      const key = ["cash", "bank", "online", "card"].sort(
        (a, b) => scaled[b] - scaled[a]
      )[0];
      scaled[key] = parseFloat((scaled[key] + diff).toFixed(2));
    }
    return scaled;
  }

  // Centralized error handler
  handleError(error, title, colorClass, amtColor, isSummary = false) {
    console.error(`Error fetching ${title} data:`, error);
    return {
      title,
      colorClass,
      amtColor,
      column: isSummary
        ? ["TYPE", "CASH", "BANK", "ONLINE", "CARD"]
        : ["DATE", "FIRM", "CUSTOMER NAME", "CUST ID", "CASH", "BANK", "ONLINE", "CARD", "DISC"],
      data: [],
      error: error.message,
    };
  }

  /**
   * Map Prisma records to response format
   */
  async mapToResponse(dbUrl, item) {
    const toNumber = (value) => (parseFloat(value) || 0).toFixed(2);
    const userId = item.fin_user_id || item.fm_user_id || item.girv_user_id || item.dep_user_id || item.rel_user_id || item.ap_user_id || item.al_buyer_id || "";
    const customerName = await this.getCustomerName(dbUrl, userId);

    return {
      db_date: this.formatDateToDDMMYYYY(item.fin_start_date || item.fm_trans_date || item.girv_start_date || item.dep_trans_date || item.rel_trans_date || item.ap_trans_date || item.al_date),
      db_firm: item.firm?.firm_name || item.finance?.firm?.firm_name || "-",
      db_customer_name: customerName,
      db_cust_id: userId ? `C${userId}` : "-",
      db_user_id: userId,
      db_user_uuid: item.user?.user_uuid || "",
      db_cash_amt: toNumber(item.fin_cash_amt || item.fm_cash_amt || item.girv_cash_amt || item.dep_cash_amt || item.rel_cash_amt || item.ap_cash_amt || item.al_cash_amt),
      db_bank_amt: toNumber(item.fin_bank_amt || item.fm_bank_amt || item.girv_bank_amt || item.dep_bank_amt || item.rel_bank_amt || item.ap_bank_amt || item.al_bank_amt),
      db_online_amt: toNumber(item.fin_online_amt || item.fm_online_amt || item.girv_online_amt || item.dep_online_amt || item.rel_online_amt || item.ap_online_amt || item.al_online_amt),
      db_card_amt: toNumber(item.fin_card_amt || item.fm_card_amt || item.girv_card_amt || item.dep_card_amt || item.rel_card_amt || item.ap_card_amt || item.al_card_amt),
      db_disc_amt: toNumber(item.dep_disc_amt || item.rel_disc_amt || 0),
    };
  }

  // 1. Finance Added (Outflow)
  async get_add_new_finance_data(dbUrl, filters = {}) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const where = { fin_is_deleted: false };
      if (filters.firmId) {
        where.fin_firm_id = parseInt(filters.firmId);
      }
      if (filters.startDate || filters.endDate) {
        where.fin_start_date = {};
        if (filters.startDate) where.fin_start_date.gte = filters.startDate;
        if (filters.endDate) where.fin_start_date.lte = filters.endDate;
      }

      const financeRecords = await prisma.finance.findMany({
        where,
        select: {
          fin_start_date: true,
          fin_firm_id: true,
          fin_user_id: true,
          fin_cash_amt: true,
          fin_bank_amt: true,
          fin_online_amt: true,
          fin_card_amt: true,
          user: { select: { user_uuid: true } },
          firm: { select: { firm_name: true } }
        },
      });

      if (financeRecords.length === 0) return 0;

      const data = await Promise.all(
        financeRecords.map((item) => this.mapToResponse(dbUrl, item))
      );

      return {
        title: "FINANCE ADDED",
        colorClass: "bg-green",
        amtColor: "text-danger",
        column: ["DATE", "FIRM", "CUSTOMER NAME", "CUST ID", "CASH", "BANK", "ONLINE", "CARD", "DISC"],
        data,
      };
    } catch (error) {
      return this.handleError(error, "FINANCE ADDED", "bg-green", "text-danger");
    } finally {
      await prisma.$disconnect();
    }
  }

  formatLoanRef(girvi = {}) {
    return (
      girvi.girv_unique_code ||
      girvi.girv_loan_no ||
      (girvi.girv_id ? `LN-${girvi.girv_id}` : "-")
    );
  }

  formatFinanceRef(finance = {}) {
    return finance.fin_unique_code || (finance.fin_id ? `Fin-${finance.fin_id}` : "-");
  }

  /** Map interest payment DR account to cash / bank / online / card channel. */
  resolvePaymentChannel(drAccId, loan = {}, drAccount = null) {
    const id = parseInt(drAccId, 10) || 0;
    if (!id) return "cash";
    if (id === parseInt(loan.girv_cash_acc_id, 10)) return "cash";
    if (id === parseInt(loan.girv_bank_acc_id, 10)) return "bank";
    if (id === parseInt(loan.girv_online_acc_id, 10)) return "online";
    if (id === parseInt(loan.girv_card_acc_id, 10)) return "card";

    const name = String(drAccount?.acc_name || "").toLowerCase();
    if (name.includes("bank")) return "bank";
    if (name.includes("online")) return "online";
    if (name.includes("card")) return "card";
    return "cash";
  }

  getFirstMonthInterestAmount(item = {}) {
    if (item.girv_first_int !== "Y") return 0;
    return (
      calculateFirstMonthInterest(
        item.girv_prin_amt,
        item.girv_roi,
        item.girv_interest_method || "simple",
        item.girv_compound_freq || "monthly",
        item.girv_roi_type || "monthly"
      ) || 0
    );
  }

  /** Allocate process + charge across disbursement channels (same ratio as net payment). */
  getProcessingChannels(item = {}) {
    const processAmt = parseFloat(item.girv_process_amt ?? item.fin_proccess_amt) || 0;
    const chargeAmt = parseFloat(item.girv_charge_amt) || 0;
    const total = parseFloat((processAmt + chargeAmt).toFixed(2));

    if (!(total > 0)) {
      return { cash: 0, bank: 0, online: 0, card: 0, process: 0, charge: 0, total: 0 };
    }

    const base = {
      cash: parseFloat(item.girv_cash_amt ?? item.fin_cash_amt) || 0,
      bank: parseFloat(item.girv_bank_amt ?? item.fin_bank_amt) || 0,
      online: parseFloat(item.girv_online_amt ?? item.fin_online_amt) || 0,
      card: parseFloat(item.girv_card_amt ?? item.fin_card_amt) || 0,
    };
    const channels = this.scaleChannelsToAmount(base, total);

    return {
      cash: channels.cash,
      bank: channels.bank,
      online: channels.online,
      card: channels.card,
      process: processAmt,
      charge: chargeAmt,
      total,
    };
  }

  /** Full principal disbursement channels for LOAN ADDED (includes process, charge, first-month interest). */
  getLoanAddedChannels(item = {}) {
    const cash = parseFloat(item.girv_cash_amt) || 0;
    const bank = parseFloat(item.girv_bank_amt) || 0;
    const online = parseFloat(item.girv_online_amt) || 0;
    const card = parseFloat(item.girv_card_amt) || 0;
    const base = { cash, bank, online, card };

    const processAmt = parseFloat(item.girv_process_amt) || 0;
    const chargeAmt = parseFloat(item.girv_charge_amt) || 0;
    const processChargeTotal = processAmt + chargeAmt;

    let channels = { cash, bank, online, card };
    if (processChargeTotal > 0) {
      const allocated = this.scaleChannelsToAmount(base, processChargeTotal);
      channels = {
        cash: channels.cash + allocated.cash,
        bank: channels.bank + allocated.bank,
        online: channels.online + allocated.online,
        card: channels.card + allocated.card,
      };
    }

    const interestAmt = this.getFirstMonthInterestAmount(item);
    if (interestAmt > 0) {
      const channel = this.resolvePaymentChannel(
        item.girv_first_int_dr_acc_id,
        item,
        item.firstIntDrAccount
      );
      channels[channel] = parseFloat((channels[channel] + interestAmt).toFixed(2));
    }

    return channels;
  }

  /** Payment channels for prepaid first-month interest (cash inflow). */
  getFirstMonthInterestChannels(item = {}) {
    const interestAmt = this.getFirstMonthInterestAmount(item);
    if (!(interestAmt > 0)) {
      return { cash: 0, bank: 0, online: 0, card: 0, interest: 0 };
    }

    const channel = this.resolvePaymentChannel(
      item.girv_first_int_dr_acc_id,
      item,
      item.firstIntDrAccount
    );

    return {
      cash: channel === "cash" ? interestAmt : 0,
      bank: channel === "bank" ? interestAmt : 0,
      online: channel === "online" ? interestAmt : 0,
      card: channel === "card" ? interestAmt : 0,
      interest: interestAmt,
    };
  }

  async mapLoanAddedRow(dbUrl, item) {
    const toNumber = (value) => (parseFloat(value) || 0).toFixed(2);
    const userId = item.girv_user_id || "";
    const customerName = await this.getCustomerName(dbUrl, userId);
    const channels = this.getLoanAddedChannels(item);

    return {
      db_date: this.formatDateToDDMMYYYY(item.girv_start_date),
      db_firm: item.firm?.firm_name || "-",
      db_customer_name: customerName,
      db_cust_id: userId ? `C${userId}` : "-",
      db_user_id: userId,
      db_user_uuid: item.user?.user_uuid || "",
      db_cash_amt: toNumber(channels.cash),
      db_bank_amt: toNumber(channels.bank),
      db_online_amt: toNumber(channels.online),
      db_card_amt: toNumber(channels.card),
      db_disc_amt: "0.00",
    };
  }

  async mapProcessingRow(dbUrl, item) {
    const toNumber = (value) => (parseFloat(value) || 0).toFixed(2);
    const userId = item.girv_user_id || item.fin_user_id || "";
    const customerName = await this.getCustomerName(dbUrl, userId);
    const channels = this.getProcessingChannels(item);

    return {
      db_date: this.formatDateToDDMMYYYY(item.girv_start_date || item.fin_start_date),
      db_firm: item.firm?.firm_name || "-",
      db_customer_name: customerName,
      db_cust_id: userId ? `C${userId}` : "-",
      db_user_id: userId,
      db_user_uuid: item.user?.user_uuid || "",
      db_ref_no: item.girv_id ? this.formatLoanRef(item) : this.formatFinanceRef(item),
      db_ref_type: item.girv_id ? "LOAN" : "FINANCE",
      db_girv_id: item.girv_id || null,
      db_girv_uuid: item.girv_uuid || null,
      db_fin_id: item.fin_id || null,
      db_process_amt: toNumber(channels.process),
      db_charge_amt: toNumber(channels.charge),
      db_total_amt: toNumber(channels.total),
      db_cash_amt: toNumber(channels.cash),
      db_bank_amt: toNumber(channels.bank),
      db_online_amt: toNumber(channels.online),
      db_card_amt: toNumber(channels.card),
      db_disc_amt: "0.00",
    };
  }

  async mapFirstMonthInterestRow(dbUrl, item) {
    const toNumber = (value) => (parseFloat(value) || 0).toFixed(2);
    const userId = item.girv_user_id || "";
    const customerName = await this.getCustomerName(dbUrl, userId);
    const channels = this.getFirstMonthInterestChannels(item);

    return {
      db_date: this.formatDateToDDMMYYYY(item.girv_start_date),
      db_firm: item.firm?.firm_name || "-",
      db_customer_name: customerName,
      db_cust_id: userId ? `C${userId}` : "-",
      db_user_id: userId,
      db_user_uuid: item.user?.user_uuid || "",
      db_ref_no: this.formatLoanRef(item),
      db_ref_type: "LOAN",
      db_girv_id: item.girv_id || null,
      db_girv_uuid: item.girv_uuid || null,
      db_interest_amt: toNumber(channels.interest),
      db_cash_amt: toNumber(channels.cash),
      db_bank_amt: toNumber(channels.bank),
      db_online_amt: toNumber(channels.online),
      db_card_amt: toNumber(channels.card),
      db_disc_amt: "0.00",
    };
  }

  /** Prepaid first-month interest at loan creation (informational — not cash movement). */
  async get_first_month_interest_data(dbUrl, filters = {}) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const transferLinks = await prisma.girvi.findMany({
        where: { girv_transfer_girv_id: { not: null } },
        select: { girv_transfer_girv_id: true },
      });
      const transferTargetIds = [
        ...new Set(
          transferLinks.map((r) => r.girv_transfer_girv_id).filter(Boolean)
        ),
      ];

      const loanWhere = {
        girv_is_deleted: false,
        girv_is_transferred_in: false,
        girv_first_int: "Y",
        ...(transferTargetIds.length > 0
          ? { girv_id: { notIn: transferTargetIds } }
          : {}),
      };
      if (filters.firmId) {
        loanWhere.girv_firm_id = parseInt(filters.firmId);
      }
      if (filters.startDate || filters.endDate) {
        loanWhere.girv_start_date = {};
        if (filters.startDate) loanWhere.girv_start_date.gte = filters.startDate;
        if (filters.endDate) loanWhere.girv_start_date.lte = filters.endDate;
      }

      const loanRecords = await prisma.girvi.findMany({
        where: loanWhere,
        select: {
          girv_id: true,
          girv_uuid: true,
          girv_unique_code: true,
          girv_loan_no: true,
          girv_start_date: true,
          girv_firm_id: true,
          girv_user_id: true,
          girv_prin_amt: true,
          girv_roi: true,
          girv_interest_method: true,
          girv_compound_freq: true,
          girv_roi_type: true,
          girv_first_int: true,
          girv_first_int_dr_acc_id: true,
          girv_cash_acc_id: true,
          girv_bank_acc_id: true,
          girv_online_acc_id: true,
          girv_card_acc_id: true,
          firstIntDrAccount: {
            select: { acc_id: true, acc_name: true },
          },
          user: { select: { user_uuid: true } },
          firm: { select: { firm_name: true } },
        },
      });

      const rows = (
        await Promise.all(loanRecords.map((item) => this.mapFirstMonthInterestRow(dbUrl, item)))
      ).filter((row) => parseFloat(row.db_interest_amt) > 0);

      if (rows.length === 0) return 0;

      rows.sort((a, b) => {
        const parse = (d) => {
          const [day, month, year] = String(d || "").split("-");
          return new Date(`${year}-${month}-${day}`).getTime() || 0;
        };
        return parse(b.db_date) - parse(a.db_date);
      });

      return {
        title: "FIRST MONTH INTEREST",
        colorClass: "bg-primary",
        amtColor: "text-primary",
        column: [
          "DATE",
          "FIRM",
          "CUSTOMER NAME",
          "REF NO",
          "TYPE",
          "CASH",
          "BANK",
          "ONLINE",
          "CARD",
          "DISC",
        ],
        data: rows,
      };
    } catch (error) {
      return this.handleError(error, "FIRST MONTH INTEREST", "bg-primary", "text-primary");
    } finally {
      await prisma.$disconnect();
    }
  }

  /** Processing / charge income at loan or finance creation (informational — not cash movement). */
  async get_processing_amount_data(dbUrl, filters = {}) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const transferLinks = await prisma.girvi.findMany({
        where: { girv_transfer_girv_id: { not: null } },
        select: { girv_transfer_girv_id: true },
      });
      const transferTargetIds = [
        ...new Set(
          transferLinks.map((r) => r.girv_transfer_girv_id).filter(Boolean)
        ),
      ];

      const loanWhere = {
        girv_is_deleted: false,
        girv_is_transferred_in: false,
        OR: [
          { girv_process_amt: { gt: 0 } },
          { girv_charge_amt: { gt: 0 } },
        ],
        ...(transferTargetIds.length > 0
          ? { girv_id: { notIn: transferTargetIds } }
          : {}),
      };
      if (filters.firmId) {
        loanWhere.girv_firm_id = parseInt(filters.firmId);
      }
      if (filters.startDate || filters.endDate) {
        loanWhere.girv_start_date = {};
        if (filters.startDate) loanWhere.girv_start_date.gte = filters.startDate;
        if (filters.endDate) loanWhere.girv_start_date.lte = filters.endDate;
      }

      const financeWhere = {
        fin_is_deleted: false,
        fin_proccess_amt: { gt: 0 },
      };
      if (filters.firmId) {
        financeWhere.fin_firm_id = parseInt(filters.firmId);
      }
      if (filters.startDate || filters.endDate) {
        financeWhere.fin_start_date = {};
        if (filters.startDate) financeWhere.fin_start_date.gte = filters.startDate;
        if (filters.endDate) financeWhere.fin_start_date.lte = filters.endDate;
      }

      const [loanRecords, financeRecords] = await Promise.all([
        prisma.girvi.findMany({
          where: loanWhere,
          select: {
            girv_id: true,
            girv_uuid: true,
            girv_unique_code: true,
            girv_loan_no: true,
            girv_start_date: true,
            girv_firm_id: true,
            girv_user_id: true,
            girv_process_amt: true,
            girv_charge_amt: true,
            girv_cash_amt: true,
            girv_bank_amt: true,
            girv_online_amt: true,
            girv_card_amt: true,
            user: { select: { user_uuid: true } },
            firm: { select: { firm_name: true } },
          },
        }),
        prisma.finance.findMany({
          where: financeWhere,
          select: {
            fin_id: true,
            fin_unique_code: true,
            fin_start_date: true,
            fin_firm_id: true,
            fin_user_id: true,
            fin_proccess_amt: true,
            fin_cash_amt: true,
            fin_bank_amt: true,
            fin_online_amt: true,
            fin_card_amt: true,
            user: { select: { user_uuid: true } },
            firm: { select: { firm_name: true } },
          },
        }),
      ]);

      const rows = [
        ...(await Promise.all(loanRecords.map((item) => this.mapProcessingRow(dbUrl, item)))),
        ...(await Promise.all(financeRecords.map((item) => this.mapProcessingRow(dbUrl, item)))),
      ];

      if (rows.length === 0) return 0;

      rows.sort((a, b) => {
        const parse = (d) => {
          const [day, month, year] = String(d || "").split("-");
          return new Date(`${year}-${month}-${day}`).getTime() || 0;
        };
        return parse(b.db_date) - parse(a.db_date);
      });

      return {
        title: "PROCESSING AMOUNT",
        colorClass: "bg-success",
        amtColor: "text-success",
        column: [
          "DATE",
          "FIRM",
          "CUSTOMER NAME",
          "REF NO",
          "TYPE",
          "CASH",
          "BANK",
          "ONLINE",
          "CARD",
          "DISC",
        ],
        data: rows,
      };
    } catch (error) {
      return this.handleError(error, "PROCESSING AMOUNT", "bg-success", "text-success");
    } finally {
      await prisma.$disconnect();
    }
  }

  // 2. Girvi Added (Outflow) — excludes loans created by firm/ML transfer
  async get_add_new_girvi_data(dbUrl, filters = {}) {
    const prisma = this.getPrisma(dbUrl);
    try {
      // Also exclude legacy transfer targets (before girv_is_transferred_in existed)
      const transferLinks = await prisma.girvi.findMany({
        where: { girv_transfer_girv_id: { not: null } },
        select: { girv_transfer_girv_id: true },
      });
      const transferTargetIds = [
        ...new Set(
          transferLinks.map((r) => r.girv_transfer_girv_id).filter(Boolean)
        ),
      ];

      const where = {
        girv_is_deleted: false,
        girv_is_transferred_in: false,
        ...(transferTargetIds.length > 0
          ? { girv_id: { notIn: transferTargetIds } }
          : {}),
      };
      if (filters.firmId) {
        where.girv_firm_id = parseInt(filters.firmId);
      }
      if (filters.startDate || filters.endDate) {
        where.girv_start_date = {};
        if (filters.startDate) where.girv_start_date.gte = filters.startDate;
        if (filters.endDate) where.girv_start_date.lte = filters.endDate;
      }

      const girviRecords = await prisma.girvi.findMany({
        where,
        select: {
          girv_start_date: true,
          girv_firm_id: true,
          girv_user_id: true,
          girv_prin_amt: true,
          girv_roi: true,
          girv_interest_method: true,
          girv_compound_freq: true,
          girv_roi_type: true,
          girv_first_int: true,
          girv_first_int_dr_acc_id: true,
          girv_process_amt: true,
          girv_charge_amt: true,
          girv_cash_amt: true,
          girv_bank_amt: true,
          girv_online_amt: true,
          girv_card_amt: true,
          girv_cash_acc_id: true,
          girv_bank_acc_id: true,
          girv_online_acc_id: true,
          girv_card_acc_id: true,
          firstIntDrAccount: {
            select: { acc_id: true, acc_name: true },
          },
          user: { select: { user_uuid: true } },
          firm: { select: { firm_name: true } }
        },
      });

      if (girviRecords.length === 0) return 0;

      const data = await Promise.all(
        girviRecords.map((item) => this.mapLoanAddedRow(dbUrl, item))
      );

      return {
        title: "LOAN ADDED",
        colorClass: "bg-purple",
        amtColor: "text-danger",
        column: ["DATE", "FIRM", "CUSTOMER NAME", "CUST ID", "CASH", "BANK", "ONLINE", "CARD", "DISC"],
        data,
      };
    } catch (error) {
      return this.handleError(error, "LOAN ADDED", "bg-purple", "text-danger");
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * TRANSFER LOAN OUT (Amount In / DR) — source firm side.
   * Uses transferred source loans; settlement amounts/date come from the new target loan.
   */
  async get_transfer_loan_out_data(dbUrl, filters = {}) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const where = {
        girv_is_deleted: false,
        girv_status: "TRANSFERRED",
        girv_transfer_girv_id: { not: null },
      };
      if (filters.firmId) {
        where.girv_firm_id = parseInt(filters.firmId);
      }

      const sourceLoans = await prisma.girvi.findMany({
        where,
        select: {
          girv_id: true,
          girv_firm_id: true,
          girv_user_id: true,
          girv_transfer_girv_id: true,
          girv_transfer_ml_id: true,
          user: { select: { user_uuid: true } },
          firm: { select: { firm_name: true } },
          transferMoneyLender: {
            select: { ml_first_name: true, ml_last_name: true },
          },
        },
      });

      if (sourceLoans.length === 0) return 0;

      const targetIds = [
        ...new Set(
          sourceLoans.map((s) => s.girv_transfer_girv_id).filter(Boolean)
        ),
      ];
      const targetLoans = await prisma.girvi.findMany({
        where: { girv_id: { in: targetIds }, girv_is_deleted: false },
        select: {
          girv_id: true,
          girv_start_date: true,
          girv_cash_amt: true,
          girv_bank_amt: true,
          girv_online_amt: true,
          girv_card_amt: true,
          firm: { select: { firm_name: true } },
        },
      });
      const targetMap = Object.fromEntries(
        targetLoans.map((t) => [t.girv_id, t])
      );

      const inDateRange = (dateStr) => {
        if (!dateStr) return false;
        if (filters.startDate && dateStr < filters.startDate) return false;
        if (filters.endDate && dateStr > filters.endDate) return false;
        return true;
      };

      const mapped = [];
      for (const source of sourceLoans) {
        const target = targetMap[source.girv_transfer_girv_id];
        if (!target || !inDateRange(target.girv_start_date)) continue;

        const mlName = source.transferMoneyLender
          ? [source.transferMoneyLender.ml_first_name, source.transferMoneyLender.ml_last_name]
              .filter(Boolean)
              .join(" ")
              .trim()
          : "";
        const toLabel = mlName
          ? `ML: ${mlName}`
          : target.firm?.firm_name
            ? `Firm: ${target.firm.firm_name}`
            : "Transfer";

        const row = await this.mapToResponse(dbUrl, {
          girv_start_date: target.girv_start_date,
          girv_user_id: source.girv_user_id,
          girv_cash_amt: target.girv_cash_amt,
          girv_bank_amt: target.girv_bank_amt,
          girv_online_amt: target.girv_online_amt,
          girv_card_amt: target.girv_card_amt,
          user: source.user,
          firm: source.firm,
        });
        row.db_customer_name = `${row.db_customer_name} (${toLabel})`;
        mapped.push(row);
      }

      if (mapped.length === 0) return 0;

      return {
        title: "TRANSFER LOAN OUT",
        colorClass: "bg-cust-info",
        amtColor: "text-success",
        column: ["DATE", "FIRM", "CUSTOMER NAME", "CUST ID", "CASH", "BANK", "ONLINE", "CARD", "DISC"],
        data: mapped,
      };
    } catch (error) {
      return this.handleError(error, "TRANSFER LOAN OUT", "bg-cust-info", "text-success");
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * TRANSFER LOAN IN (Amount Out / CR) — target firm side.
   * Includes same-firm ML transfers so Daybook cash matches journals and users can track both legs.
   * Supports legacy rows via source.girv_transfer_girv_id links.
   */
  async get_transfer_loan_in_data(dbUrl, filters = {}) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const sourceLinks = await prisma.girvi.findMany({
        where: {
          girv_is_deleted: false,
          girv_status: "TRANSFERRED",
          girv_transfer_girv_id: { not: null },
        },
        select: {
          girv_id: true,
          girv_firm_id: true,
          girv_transfer_girv_id: true,
          girv_transfer_ml_id: true,
          firm: { select: { firm_name: true } },
          transferMoneyLender: {
            select: { ml_first_name: true, ml_last_name: true },
          },
        },
      });
      if (sourceLinks.length === 0) return 0;

      const targetIds = [
        ...new Set(sourceLinks.map((s) => s.girv_transfer_girv_id).filter(Boolean)),
      ];
      const sourceByTargetId = Object.fromEntries(
        sourceLinks.map((s) => [s.girv_transfer_girv_id, s])
      );

      const where = {
        girv_is_deleted: false,
        girv_id: { in: targetIds },
      };
      if (filters.firmId) {
        where.girv_firm_id = parseInt(filters.firmId);
      }
      if (filters.startDate || filters.endDate) {
        where.girv_start_date = {};
        if (filters.startDate) where.girv_start_date.gte = filters.startDate;
        if (filters.endDate) where.girv_start_date.lte = filters.endDate;
      }

      const records = await prisma.girvi.findMany({
        where,
        select: {
          girv_id: true,
          girv_start_date: true,
          girv_firm_id: true,
          girv_user_id: true,
          girv_prin_amt: true,
          girv_cash_amt: true,
          girv_bank_amt: true,
          girv_online_amt: true,
          girv_card_amt: true,
          girv_transfer_from_firm_id: true,
          user: { select: { user_uuid: true } },
          firm: { select: { firm_name: true } },
        },
      });

      if (records.length === 0) return 0;

      const data = await Promise.all(
        records.map(async (item) => {
          // IN = principal booking only (interest was recognized on OUT)
          const scaled = this.scaleChannelsToAmount(
            {
              cash: item.girv_cash_amt,
              bank: item.girv_bank_amt,
              online: item.girv_online_amt,
              card: item.girv_card_amt,
            },
            item.girv_prin_amt
          );
          const row = await this.mapToResponse(dbUrl, {
            ...item,
            girv_cash_amt: scaled.cash,
            girv_bank_amt: scaled.bank,
            girv_online_amt: scaled.online,
            girv_card_amt: scaled.card,
          });
          const source = sourceByTargetId[item.girv_id];
          const fromFirmId =
            item.girv_transfer_from_firm_id ?? source?.girv_firm_id ?? null;
          const isSameFirm =
            fromFirmId != null && Number(fromFirmId) === Number(item.girv_firm_id);
          const fromName = source?.firm?.firm_name || "Firm";
          const mlName = source?.transferMoneyLender
            ? [source.transferMoneyLender.ml_first_name, source.transferMoneyLender.ml_last_name]
                .filter(Boolean)
                .join(" ")
                .trim()
            : "";

          if (isSameFirm && mlName) {
            row.db_customer_name = `${row.db_customer_name} (ML: ${mlName})`;
          } else if (isSameFirm) {
            row.db_customer_name = `${row.db_customer_name} (Same Firm Transfer)`;
          } else {
            row.db_customer_name = `${row.db_customer_name} (From: ${fromName})`;
          }
          return row;
        })
      );

      return {
        title: "TRANSFER LOAN IN",
        colorClass: "bg-info",
        amtColor: "text-danger",
        column: ["DATE", "FIRM", "CUSTOMER NAME", "CUST ID", "CASH", "BANK", "ONLINE", "CARD", "DISC"],
        data,
      };
    } catch (error) {
      return this.handleError(error, "TRANSFER LOAN IN", "bg-info", "text-danger");
    } finally {
      await prisma.$disconnect();
    }
  }

  // 3. Additional Loan Principal (Outflow)
  async get_additional_principal_data(dbUrl, filters = {}) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const where = { ap_is_deleted: false };
      if (filters.firmId) {
        where.ap_firm_id = parseInt(filters.firmId);
      }
      if (filters.startDate || filters.endDate) {
        where.ap_trans_date = {};
        if (filters.startDate) where.ap_trans_date.gte = filters.startDate;
        if (filters.endDate) where.ap_trans_date.lte = filters.endDate;
      }

      const records = await prisma.additionalPrincipal.findMany({
        where,
        select: {
          ap_trans_date: true,
          ap_firm_id: true,
          ap_user_id: true,
          ap_cash_amt: true,
          ap_bank_amt: true,
          ap_online_amt: true,
          ap_card_amt: true,
          user: { select: { user_uuid: true } },
          firm: { select: { firm_name: true } }
        },
      });

      if (records.length === 0) return 0;

      const data = await Promise.all(
        records.map((item) => this.mapToResponse(dbUrl, item))
      );

      return {
        title: "ADDITIONAL LOAN PRINCIPAL",
        colorClass: "bg-pink",
        amtColor: "text-danger",
        column: ["DATE", "FIRM", "CUSTOMER NAME", "CUST ID", "CASH", "BANK", "ONLINE", "CARD", "DISC"],
        data,
      };
    } catch (error) {
      return this.handleError(error, "ADDITIONAL LOAN PRINCIPAL", "bg-pink", "text-danger");
    } finally {
      await prisma.$disconnect();
    }
  }

  // 4. Girvi Deposit (Inflow)
  async get_girvi_deposit_data(dbUrl, filters = {}) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const where = { dep_is_deleted: false };
      if (filters.firmId) {
        where.dep_firm_id = parseInt(filters.firmId);
      }
      if (filters.startDate || filters.endDate) {
        where.dep_trans_date = {};
        if (filters.startDate) where.dep_trans_date.gte = filters.startDate;
        if (filters.endDate) where.dep_trans_date.lte = filters.endDate;
      }

      const records = await prisma.girviDeposit.findMany({
        where,
        select: {
          dep_trans_date: true,
          dep_firm_id: true,
          dep_user_id: true,
          dep_cash_amt: true,
          dep_bank_amt: true,
          dep_online_amt: true,
          dep_card_amt: true,
          dep_disc_amt: true,
          user: { select: { user_uuid: true } },
          firm: { select: { firm_name: true } }
        },
      });

      if (records.length === 0) return 0;

      const data = await Promise.all(
        records.map((item) => this.mapToResponse(dbUrl, item))
      );

      return {
        title: "LOAN DEPOSIT",
        colorClass: "bg-blue",
        amtColor: "text-success",
        column: ["DATE", "FIRM", "CUSTOMER NAME", "CUST ID", "CASH", "BANK", "ONLINE", "CARD", "DISC"],
        data,
      };
    } catch (error) {
      return this.handleError(error, "LOAN DEPOSIT", "bg-blue", "text-success");
    } finally {
      await prisma.$disconnect();
    }
  }

  // 5. Girvi Release (Inflow)
  async get_girvi_release_data(dbUrl, filters = {}) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const where = { rel_is_deleted: false };
      if (filters.firmId) {
        where.rel_firm_id = parseInt(filters.firmId);
      }
      if (filters.startDate || filters.endDate) {
        where.rel_trans_date = {};
        if (filters.startDate) where.rel_trans_date.gte = filters.startDate;
        if (filters.endDate) where.rel_trans_date.lte = filters.endDate;
      }

      const records = await prisma.girviRelease.findMany({
        where,
        select: {
          rel_trans_date: true,
          rel_firm_id: true,
          rel_user_id: true,
          rel_cash_amt: true,
          rel_bank_amt: true,
          rel_online_amt: true,
          rel_card_amt: true,
          rel_disc_amt: true,
          user: { select: { user_uuid: true } },
          firm: { select: { firm_name: true } }
        },
      });

      if (records.length === 0) return 0;

      const data = await Promise.all(
        records.map((item) => this.mapToResponse(dbUrl, item))
      );

      return {
        title: "RELEASE LOAN",
        colorClass: "bg-cust-info",
        amtColor: "text-success",
        column: ["DATE", "FIRM", "CUSTOMER NAME", "CUST ID", "CASH", "BANK", "ONLINE", "CARD", "DISC"],
        data,
      };
    } catch (error) {
      return this.handleError(error, "RELEASE LOAN", "bg-cust-info", "text-success");
    } finally {
      await prisma.$disconnect();
    }
  }

  // 6. Auction Loan (Inflow)
  async get_auction_loan_data(dbUrl, filters = {}) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const where = {};
      if (filters.firmId) {
        where.al_firm_id = parseInt(filters.firmId);
      }
      if (filters.startDate || filters.endDate) {
        where.al_date = {};
        if (filters.startDate) where.al_date.gte = filters.startDate;
        if (filters.endDate) where.al_date.lte = filters.endDate;
      }

      const records = await prisma.auctionLoan.findMany({
        where,
      });

      if (records.length === 0) return 0;

      const firmIds = [...new Set(records.map((r) => r.al_firm_id).filter(Boolean))];
      const buyerIds = [...new Set(records.map((r) => r.al_buyer_id).filter(Boolean))];

      const firms = await prisma.firm.findMany({
        where: { firm_id: { in: firmIds } },
        select: { firm_id: true, firm_name: true },
      });
      const firmMap = new Map(firms.map((f) => [f.firm_id, f.firm_name]));

      const auctionUsers = await prisma.auctionUser.findMany({
        where: { au_id: { in: buyerIds } },
        select: { au_id: true, au_full_name: true },
      });
      const auctionUserMap = new Map(auctionUsers.map((u) => [u.au_id, u.au_full_name]));

      const data = await Promise.all(
        records.map(async (item) => ({
          db_date: this.formatDateToDDMMYYYY(item.al_date),
          db_firm: firmMap.get(item.al_firm_id) || "-",
          db_customer_name: auctionUserMap.get(item.al_buyer_id) || (await this.getCustomerName(dbUrl, item.al_buyer_id)),
          db_cust_id: item.al_buyer_id ? `AU-${item.al_buyer_id}` : "-",
          db_user_id: item.al_buyer_id,
          db_user_uuid: "",
          db_cash_amt: (parseFloat(item.al_cash_amt) || 0).toFixed(2),
          db_bank_amt: (parseFloat(item.al_bank_amt) || 0).toFixed(2),
          db_online_amt: (parseFloat(item.al_online_amt) || 0).toFixed(2),
          db_card_amt: (parseFloat(item.al_card_amt) || 0).toFixed(2),
          db_disc_amt: (0).toFixed(2),
        }))
      );

      return {
        title: "AUCTION LOAN",
        colorClass: "bg-warning",
        amtColor: "text-success",
        column: ["DATE", "FIRM", "CUSTOMER NAME", "CUST ID", "CASH", "BANK", "ONLINE", "CARD", "DISC"],
        data,
      };
    } catch (error) {
      return this.handleError(error, "AUCTION LOAN", "bg-warning", "text-success");
    } finally {
      await prisma.$disconnect();
    }
  }

  // 7 & 8. Finance collections (PAID/CLOSE/FINE/INTEREST = Inflow / ROLLBACK = Outflow)
  async get_finance_emi_data(dbUrl, type, title, colorClass, amtColor, filters = {}) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const where = {
        fm_trans_type: Array.isArray(type) ? { in: type } : type,
        fm_is_deleted: false
      };
      if (filters.firmId) {
        where.fm_firm_id = parseInt(filters.firmId);
      }
      if (filters.startDate || filters.endDate) {
        where.fm_trans_date = {};
        if (filters.startDate) where.fm_trans_date.gte = filters.startDate;
        if (filters.endDate) where.fm_trans_date.lte = filters.endDate;
      }

      const records = await prisma.finance_Money_Transaction.findMany({
        where,
        select: {
          fm_trans_date: true,
          fm_firm_id: true,
          fm_user_id: true,
          fm_cash_amt: true,
          fm_bank_amt: true,
          fm_online_amt: true,
          fm_card_amt: true,
          user: { select: { user_uuid: true } },
          firm: { select: { firm_name: true } },
          finance: {
            select: {
              firm: { select: { firm_name: true } }
            }
          }
        },
      });

      if (records.length === 0) return 0;

      const data = await Promise.all(
        records.map((item) => this.mapToResponse(dbUrl, item))
      );

      return {
        title,
        colorClass,
        amtColor,
        column: ["DATE", "FIRM", "CUSTOMER NAME", "CUST ID", "CASH", "BANK", "ONLINE", "CARD", "DISC"],
        data,
      };
    } catch (error) {
      return this.handleError(error, title, colorClass, amtColor);
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Calculate Daybook Summary (Opening Balance)
   */
  async get_day_book_summary(dbUrl, filters = {}) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const firmId = filters.firmId ? parseInt(filters.firmId) : null;
      const startDate = filters.startDate || null;

      // 1. OUTFLOWS prior to startDate
      // a) Finance Added
      const financeAdded = await prisma.finance.findMany({
        where: {
          fin_is_deleted: false,
          ...(firmId && { fin_firm_id: firmId }),
          ...(startDate && { fin_start_date: { lt: startDate } }),
        },
        select: { fin_cash_amt: true, fin_bank_amt: true, fin_online_amt: true, fin_card_amt: true },
      });
      const sumFinance = financeAdded.reduce(
        (acc, item) => ({
          cash: acc.cash + (parseFloat(item.fin_cash_amt) || 0),
          bank: acc.bank + (parseFloat(item.fin_bank_amt) || 0),
          online: acc.online + (parseFloat(item.fin_online_amt) || 0),
          card: acc.card + (parseFloat(item.fin_card_amt) || 0),
        }),
        { cash: 0, bank: 0, online: 0, card: 0 }
      );

      // b) Girvi Added (exclude transfer-created loans — counted under TRANSFER LOAN IN)
      const legacyTransferLinks = await prisma.girvi.findMany({
        where: { girv_transfer_girv_id: { not: null } },
        select: { girv_transfer_girv_id: true },
      });
      const legacyTransferTargetIds = [
        ...new Set(
          legacyTransferLinks.map((r) => r.girv_transfer_girv_id).filter(Boolean)
        ),
      ];
      const girviAdded = await prisma.girvi.findMany({
        where: {
          girv_is_deleted: false,
          girv_is_transferred_in: false,
          ...(legacyTransferTargetIds.length > 0
            ? { girv_id: { notIn: legacyTransferTargetIds } }
            : {}),
          ...(firmId && { girv_firm_id: firmId }),
          ...(startDate && { girv_start_date: { lt: startDate } }),
        },
        select: {
          girv_cash_amt: true,
          girv_bank_amt: true,
          girv_online_amt: true,
          girv_card_amt: true,
          girv_prin_amt: true,
          girv_roi: true,
          girv_interest_method: true,
          girv_compound_freq: true,
          girv_roi_type: true,
          girv_first_int: true,
          girv_first_int_dr_acc_id: true,
          girv_process_amt: true,
          girv_charge_amt: true,
          girv_cash_acc_id: true,
          girv_bank_acc_id: true,
          girv_online_acc_id: true,
          girv_card_acc_id: true,
          firstIntDrAccount: {
            select: { acc_id: true, acc_name: true },
          },
        },
      });
      const sumGirvi = girviAdded.reduce(
        (acc, item) => {
          const channels = this.getLoanAddedChannels(item);
          return {
            cash: acc.cash + channels.cash,
            bank: acc.bank + channels.bank,
            online: acc.online + channels.online,
            card: acc.card + channels.card,
          };
        },
        { cash: 0, bank: 0, online: 0, card: 0 }
      );

      // e) Transfer Loan IN prior to startDate (all firms, including same-firm ML) → outflow
      const transferInSourceLinks = await prisma.girvi.findMany({
        where: {
          girv_is_deleted: false,
          girv_status: "TRANSFERRED",
          girv_transfer_girv_id: { not: null },
        },
        select: {
          girv_firm_id: true,
          girv_transfer_girv_id: true,
        },
      });
      const transferInTargetIds = [
        ...new Set(
          transferInSourceLinks.map((s) => s.girv_transfer_girv_id).filter(Boolean)
        ),
      ];
      let sumTransferIn = { cash: 0, bank: 0, online: 0, card: 0 };
      if (transferInTargetIds.length > 0) {
        const transferInLoans = await prisma.girvi.findMany({
          where: {
            girv_is_deleted: false,
            girv_id: { in: transferInTargetIds },
            ...(firmId && { girv_firm_id: firmId }),
            ...(startDate && { girv_start_date: { lt: startDate } }),
          },
          select: {
            girv_id: true,
            girv_firm_id: true,
            girv_prin_amt: true,
            girv_transfer_from_firm_id: true,
            girv_cash_amt: true,
            girv_bank_amt: true,
            girv_online_amt: true,
            girv_card_amt: true,
          },
        });
        sumTransferIn = transferInLoans.reduce((acc, item) => {
          const scaled = this.scaleChannelsToAmount(
            {
              cash: item.girv_cash_amt,
              bank: item.girv_bank_amt,
              online: item.girv_online_amt,
              card: item.girv_card_amt,
            },
            item.girv_prin_amt
          );
          return {
            cash: acc.cash + scaled.cash,
            bank: acc.bank + scaled.bank,
            online: acc.online + scaled.online,
            card: acc.card + scaled.card,
          };
        }, { cash: 0, bank: 0, online: 0, card: 0 });
      }

      // f) Transfer Loan OUT prior to startDate → inflow for source firm
      const transferOutSources = await prisma.girvi.findMany({
        where: {
          girv_is_deleted: false,
          girv_status: "TRANSFERRED",
          girv_transfer_girv_id: { not: null },
          ...(firmId && { girv_firm_id: firmId }),
        },
        select: { girv_transfer_girv_id: true },
      });
      const transferOutTargetIds = [
        ...new Set(
          transferOutSources.map((s) => s.girv_transfer_girv_id).filter(Boolean)
        ),
      ];
      let sumTransferOut = { cash: 0, bank: 0, online: 0, card: 0 };
      if (transferOutTargetIds.length > 0) {
        const transferOutTargets = await prisma.girvi.findMany({
          where: {
            girv_id: { in: transferOutTargetIds },
            girv_is_deleted: false,
            ...(startDate && { girv_start_date: { lt: startDate } }),
          },
          select: {
            girv_cash_amt: true,
            girv_bank_amt: true,
            girv_online_amt: true,
            girv_card_amt: true,
          },
        });
        sumTransferOut = transferOutTargets.reduce(
          (acc, item) => ({
            cash: acc.cash + (parseFloat(item.girv_cash_amt) || 0),
            bank: acc.bank + (parseFloat(item.girv_bank_amt) || 0),
            online: acc.online + (parseFloat(item.girv_online_amt) || 0),
            card: acc.card + (parseFloat(item.girv_card_amt) || 0),
          }),
          { cash: 0, bank: 0, online: 0, card: 0 }
        );
      }

      // c) Additional Principal
      const apAdded = await prisma.additionalPrincipal.findMany({
        where: {
          ap_is_deleted: false,
          ...(firmId && { ap_firm_id: firmId }),
          ...(startDate && { ap_trans_date: { lt: startDate } }),
        },
        select: { ap_cash_amt: true, ap_bank_amt: true, ap_online_amt: true, ap_card_amt: true },
      });
      const sumAp = apAdded.reduce(
        (acc, item) => ({
          cash: acc.cash + (parseFloat(item.ap_cash_amt) || 0),
          bank: acc.bank + (parseFloat(item.ap_bank_amt) || 0),
          online: acc.online + (parseFloat(item.ap_online_amt) || 0),
          card: acc.card + (parseFloat(item.ap_card_amt) || 0),
        }),
        { cash: 0, bank: 0, online: 0, card: 0 }
      );

      // d) Finance EMI Rollback
      const emiRollback = await prisma.finance_Money_Transaction.aggregate({
        where: {
          fm_trans_type: "ROLLBACK",
          fm_is_deleted: false,
          ...(firmId && { fm_firm_id: firmId }),
          ...(startDate && { fm_trans_date: { lt: startDate } }),
        },
        _sum: { fm_cash_amt: true, fm_bank_amt: true, fm_online_amt: true, fm_card_amt: true },
      });

      // 2. INFLOWS prior to startDate
      // a) Finance EMI/interest/fine paid + close (cash inflows)
      const emiPaid = await prisma.finance_Money_Transaction.aggregate({
        where: {
          fm_trans_type: { in: FINANCE_COLLECTION_INFLOW_TYPES },
          fm_is_deleted: false,
          ...(firmId && { fm_firm_id: firmId }),
          ...(startDate && { fm_trans_date: { lt: startDate } }),
        },
        _sum: { fm_cash_amt: true, fm_bank_amt: true, fm_online_amt: true, fm_card_amt: true },
      });

      // b) Girvi Deposit
      const girviDeposit = await prisma.girviDeposit.aggregate({
        where: {
          dep_is_deleted: false,
          ...(firmId && { dep_firm_id: firmId }),
          ...(startDate && { dep_trans_date: { lt: startDate } }),
        },
        _sum: { dep_cash_amt: true, dep_bank_amt: true, dep_online_amt: true, dep_card_amt: true },
      });

      // c) Girvi Release
      const girviRelease = await prisma.girviRelease.aggregate({
        where: {
          rel_is_deleted: false,
          ...(firmId && { rel_firm_id: firmId }),
          ...(startDate && { rel_trans_date: { lt: startDate } }),
        },
        _sum: { rel_cash_amt: true, rel_bank_amt: true, rel_online_amt: true, rel_card_amt: true },
      });

      // d) Auction Loan
      const auctionLoan = await prisma.auctionLoan.aggregate({
        where: {
          ...(firmId && { al_firm_id: firmId }),
          ...(startDate && { al_date: { lt: startDate } }),
        },
        _sum: { al_cash_amt: true, al_bank_amt: true, al_online_amt: true, al_card_amt: true },
      });

      // e) Prepaid first-month interest at loan creation (cash inflow)
      const girviFirstMonthInt = await prisma.girvi.findMany({
        where: {
          girv_is_deleted: false,
          girv_is_transferred_in: false,
          girv_first_int: "Y",
          ...(legacyTransferTargetIds.length > 0
            ? { girv_id: { notIn: legacyTransferTargetIds } }
            : {}),
          ...(firmId && { girv_firm_id: firmId }),
          ...(startDate && { girv_start_date: { lt: startDate } }),
        },
        select: {
          girv_prin_amt: true,
          girv_roi: true,
          girv_interest_method: true,
          girv_compound_freq: true,
          girv_roi_type: true,
          girv_first_int: true,
          girv_first_int_dr_acc_id: true,
          girv_cash_acc_id: true,
          girv_bank_acc_id: true,
          girv_online_acc_id: true,
          girv_card_acc_id: true,
          firstIntDrAccount: {
            select: { acc_id: true, acc_name: true },
          },
        },
      });
      const sumFirstMonthInt = girviFirstMonthInt.reduce(
        (acc, item) => {
          const channels = this.getFirstMonthInterestChannels(item);
          return {
            cash: acc.cash + channels.cash,
            bank: acc.bank + channels.bank,
            online: acc.online + channels.online,
            card: acc.card + channels.card,
          };
        },
        { cash: 0, bank: 0, online: 0, card: 0 }
      );

      // f) Processing / charge retained at loan or finance creation (cash inflow)
      const [girviProcessing, financeProcessing] = await Promise.all([
        prisma.girvi.findMany({
          where: {
            girv_is_deleted: false,
            girv_is_transferred_in: false,
            OR: [{ girv_process_amt: { gt: 0 } }, { girv_charge_amt: { gt: 0 } }],
            ...(legacyTransferTargetIds.length > 0
              ? { girv_id: { notIn: legacyTransferTargetIds } }
              : {}),
            ...(firmId && { girv_firm_id: firmId }),
            ...(startDate && { girv_start_date: { lt: startDate } }),
          },
          select: {
            girv_process_amt: true,
            girv_charge_amt: true,
            girv_cash_amt: true,
            girv_bank_amt: true,
            girv_online_amt: true,
            girv_card_amt: true,
          },
        }),
        prisma.finance.findMany({
          where: {
            fin_is_deleted: false,
            fin_proccess_amt: { gt: 0 },
            ...(firmId && { fin_firm_id: firmId }),
            ...(startDate && { fin_start_date: { lt: startDate } }),
          },
          select: {
            fin_proccess_amt: true,
            fin_cash_amt: true,
            fin_bank_amt: true,
            fin_online_amt: true,
            fin_card_amt: true,
          },
        }),
      ]);
      const sumProcessing = [...girviProcessing, ...financeProcessing].reduce(
        (acc, item) => {
          const channels = this.getProcessingChannels(item);
          return {
            cash: acc.cash + channels.cash,
            bank: acc.bank + channels.bank,
            online: acc.online + channels.online,
            card: acc.card + channels.card,
          };
        },
        { cash: 0, bank: 0, online: 0, card: 0 }
      );

      // 3. Account Opening Balances
      const all_opening_balances = await accountService.get_acc_opening_balance(
        dbUrl,
        (filters.firmId && filters.firmId !== "") ? filters.firmId : "N",
        filters.startDate || new Date().toISOString().split("T")[0]
      );

      const acc_cash_open = parseFloat(all_opening_balances.find(a => a.acc_name === "Cash In Hand")?.acc_cash_balance || 0);
      const acc_bank_open = parseFloat(all_opening_balances.find(a => a.acc_name === "Bank Account")?.acc_cash_balance || 0);
      const acc_online_open = parseFloat(all_opening_balances.find(a => a.acc_name === "Online Account")?.acc_cash_balance || 0);
      const acc_card_open = parseFloat(all_opening_balances.find(a => a.acc_name === "Card Account")?.acc_cash_balance || 0);

      const toNumber = (val) => (parseFloat(val) || 0).toFixed(2);

      const inflowCash =
        (emiPaid._sum.fm_cash_amt || 0) +
        (girviDeposit._sum.dep_cash_amt || 0) +
        (girviRelease._sum.rel_cash_amt || 0) +
        (auctionLoan._sum.al_cash_amt || 0) +
        sumTransferOut.cash +
        sumFirstMonthInt.cash +
        sumProcessing.cash;
      const inflowBank =
        (emiPaid._sum.fm_bank_amt || 0) +
        (girviDeposit._sum.dep_bank_amt || 0) +
        (girviRelease._sum.rel_bank_amt || 0) +
        (auctionLoan._sum.al_bank_amt || 0) +
        sumTransferOut.bank +
        sumFirstMonthInt.bank +
        sumProcessing.bank;
      const inflowOnline =
        (emiPaid._sum.fm_online_amt || 0) +
        (girviDeposit._sum.dep_online_amt || 0) +
        (girviRelease._sum.rel_online_amt || 0) +
        (auctionLoan._sum.al_online_amt || 0) +
        sumTransferOut.online +
        sumFirstMonthInt.online +
        sumProcessing.online;
      const inflowCard =
        (emiPaid._sum.fm_card_amt || 0) +
        (girviDeposit._sum.dep_card_amt || 0) +
        (girviRelease._sum.rel_card_amt || 0) +
        (auctionLoan._sum.al_card_amt || 0) +
        sumTransferOut.card +
        sumFirstMonthInt.card +
        sumProcessing.card;

      const outflowCash =
        sumFinance.cash +
        sumGirvi.cash +
        sumAp.cash +
        (emiRollback._sum.fm_cash_amt || 0) +
        sumTransferIn.cash;
      const outflowBank =
        sumFinance.bank +
        sumGirvi.bank +
        sumAp.bank +
        (emiRollback._sum.fm_bank_amt || 0) +
        sumTransferIn.bank;
      const outflowOnline =
        sumFinance.online +
        sumGirvi.online +
        sumAp.online +
        (emiRollback._sum.fm_online_amt || 0) +
        sumTransferIn.online;
      const outflowCard =
        sumFinance.card +
        sumGirvi.card +
        sumAp.card +
        (emiRollback._sum.fm_card_amt || 0) +
        sumTransferIn.card;

      // Formula: Opening = Acc_Opening + Inflows - Outflows
      const cash_open = toNumber(acc_cash_open + inflowCash - outflowCash);
      const bank_open = toNumber(acc_bank_open + inflowBank - outflowBank);
      const online_open = toNumber(acc_online_open + inflowOnline - outflowOnline);
      const card_open = toNumber(acc_card_open + inflowCard - outflowCard);

      const total_open = toNumber(parseFloat(cash_open) + parseFloat(bank_open) + parseFloat(online_open) + parseFloat(card_open));

      return {
        type: "OPENING BALANCE",
        total_cash_amt: cash_open,
        total_bank_amt: bank_open,
        total_online_amt: online_open,
        total_card_amt: card_open,
        total_open_amt: total_open,
      };
    } catch (error) {
      return this.handleError(error, "DAYBOOK SUMMARY", "bg-purple", "text-primary", true);
    } finally {
      await prisma.$disconnect();
    }
  }

  async get_all_daybook_data(dbUrl, filters = {}) {
    try {
      const [
        financeData,
        girviData,
        processingAmountData,
        firstMonthInterestData,
        additionalPrincipalData,
        girviDepositData,
        girviReleaseData,
        auctionLoanData,
        paidEmiData,
        rollbackEmiData,
        transferLoanOutData,
        transferLoanInData,
        summaryData
      ] = await Promise.all([
        this.get_add_new_finance_data(dbUrl, filters),
        this.get_add_new_girvi_data(dbUrl, filters),
        this.get_processing_amount_data(dbUrl, filters),
        this.get_first_month_interest_data(dbUrl, filters),
        this.get_additional_principal_data(dbUrl, filters),
        this.get_girvi_deposit_data(dbUrl, filters),
        this.get_girvi_release_data(dbUrl, filters),
        this.get_auction_loan_data(dbUrl, filters),
        this.get_finance_emi_data(dbUrl, FINANCE_COLLECTION_INFLOW_TYPES, "FINANCE EMI DEPOSIT", "bg-red", "text-success", filters),
        this.get_finance_emi_data(dbUrl, "ROLLBACK", "FINANCE EMI ROLLBACK", "bg-secondary", "text-danger", filters),
        this.get_transfer_loan_out_data(dbUrl, filters),
        this.get_transfer_loan_in_data(dbUrl, filters),
        this.get_day_book_summary(dbUrl, filters),
      ]);

      const response_arr = [];
      if (financeData !== 0) response_arr.push(financeData);
      if (girviData !== 0) response_arr.push(girviData);
      if (processingAmountData !== 0) response_arr.push(processingAmountData);
      if (firstMonthInterestData !== 0) response_arr.push(firstMonthInterestData);
      if (additionalPrincipalData !== 0) response_arr.push(additionalPrincipalData);
      if (girviDepositData !== 0) response_arr.push(girviDepositData);
      if (girviReleaseData !== 0) response_arr.push(girviReleaseData);
      if (auctionLoanData !== 0) response_arr.push(auctionLoanData);
      if (paidEmiData !== 0) response_arr.push(paidEmiData);
      if (rollbackEmiData !== 0) response_arr.push(rollbackEmiData);
      if (transferLoanOutData !== 0) response_arr.push(transferLoanOutData);
      if (transferLoanInData !== 0) response_arr.push(transferLoanInData);

      return { daybook_data: response_arr, summary: summaryData };
    } catch (error) {
      console.error("Error combining daybook data:", error);
      return { daybook_data: [], summary: {} };
    }
  }
}

module.exports = new DaybookService();
