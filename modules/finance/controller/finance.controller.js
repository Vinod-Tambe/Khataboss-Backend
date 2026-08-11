"use strict";

const financeService = require("../service/finance.service");
const { BASE_URL } = require("../../../config/db");
const {
  logActivity,
  MODULE,
  ACTION,
  descriptions,
} = require("../../../common/service/activityLog.service");
const { formatFinNo } = require("../../../utils/journalNarration");

function financePaymentSubject(transType, rollbackType) {
  if (transType === "PAID") return "EMI Payment";
  if (transType === "CLOSE") return "Finance Closed";
  if (transType === "INTEREST") return "Interest Payment";
  if (transType === "FINE") return "Fine / Collect Payment";
  if (transType === "ROLLBACK") {
    const rb = String(rollbackType || "EMI").toUpperCase();
    if (rb === "INTEREST") return "Rollback — Interest";
    if (rb === "FINE") return "Rollback — Fine";
    return "Rollback — EMI";
  }
  return "Finance Payment";
}

class FinanceController {
  getDbUrl(dbName) {
    return `${BASE_URL}/${dbName}`;
  }

  async createFinance(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const data = { ...req.body };
      
      // Ensure IDs from authenticated user
      data.fin_own_id = req.user.own_id;
      data.fin_created_by = req.user.own_login_id;
      
      const result = await financeService.create_finance(dbUrl, data);

      logActivity(dbUrl, req.user, {
        firmId: result.fin_firm_id,
        module: MODULE.FINANCE,
        action: ACTION.CREATE,
        subject: "Finance Added",
        description: (at) => descriptions.financeCreated(result, at),
        transDate: result.fin_start_date,
        entityType: "finance",
        entityId: result.fin_id,
        refNo: formatFinNo(result),
        amount: result.fin_prin_amt,
      });

      return res.status(201).json({
        message: "Finance record created successfully.",
        data: result,
      });
    } catch (error) {
      console.error("❌ Controller Error (createFinance):", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  async updateFinance(req, res) {
    try {
      const { id } = req.params;
      const dbUrl = this.getDbUrl(req.user.own_db);
      const result = await financeService.update_finance(dbUrl, id, req.body);

      logActivity(dbUrl, req.user, {
        firmId: result.fin_firm_id,
        module: MODULE.FINANCE,
        action: ACTION.UPDATE,
        subject: "Finance Updated",
        description: (at) => descriptions.financeUpdated(result, at),
        transDate: result.fin_start_date,
        entityType: "finance",
        entityId: result.fin_id,
        refNo: formatFinNo(result),
        amount: result.fin_prin_amt,
      });

      return res.status(200).json({
        message: "Finance record updated successfully.",
        data: result,
      });
    } catch (error) {
      console.error("❌ Controller Error (updateFinance):", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  async getFinances(req, res) {
    try {
      const { firmId, userId, status } = req.query;
      const dbUrl = this.getDbUrl(req.user.own_db);
      const result = await financeService.getFinances(dbUrl, firmId, userId, status);
      return res.status(200).json({
        message: "Finances fetched successfully.",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getFinancesDropdown(req, res) {
    try {
      const { userId } = req.params;
      const { firmId } = req.query;
      const dbUrl = this.getDbUrl(req.user.own_db);
      const result = await financeService.getFinancesDropdown(dbUrl, firmId, userId);
      return res.status(200).json({
        message: "Finances dropdown fetched successfully.",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getTransactions(req, res) {
    try {
      const { firmId, userId } = req.query;
      const dbUrl = this.getDbUrl(req.user.own_db);
      const result = await financeService.getTransactions(dbUrl, firmId, userId);
      return res.status(200).json({
        message: "Transactions fetched successfully.",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async deleteFinance(req, res) {
    try {
      const { id } = req.params;
      const dbUrl = this.getDbUrl(req.user.own_db);
      const deleted = await financeService.delete_finance(dbUrl, id);

      logActivity(dbUrl, req.user, {
        firmId: deleted.fin_firm_id,
        module: MODULE.FINANCE,
        action: ACTION.DELETE,
        subject: "Finance Deleted",
        description: (at) => descriptions.financeDeleted(deleted, at),
        transDate: deleted.fin_start_date,
        entityType: "finance",
        entityId: deleted.fin_id,
        refNo: formatFinNo(deleted),
        amount: deleted.fin_prin_amt,
      });

      return res.status(200).json({
        message: "Finance record deleted successfully.",
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getFinanceDetails(req, res) {
    try {
      const { id } = req.params;
      const dbUrl = this.getDbUrl(req.user.own_db);
      const result = await financeService.getFinanceDetails(dbUrl, id);
      return res.status(200).json({
        message: "Finance details fetched successfully.",
        data: result,
      });
    } catch (error) {
      console.error("❌ Controller Error (getFinanceDetails):", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  async createPayment(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const result = await financeService.processPayment(dbUrl, req.body);

      const finance = { fin_id: result.fm_fin_id, fin_unique_code: null };
      const transType = req.body.fm_trans_type || result.fm_trans_type;
      logActivity(dbUrl, req.user, {
        firmId: result.fm_firm_id,
        module: MODULE.FINANCE,
        action: transType === "ROLLBACK" ? ACTION.ROLLBACK : ACTION.PAYMENT,
        subject: financePaymentSubject(transType, req.body.fm_rollback_type),
        description: (at) => descriptions.financePayment(finance, req.body, result, at),
        transDate: req.body.fm_trans_date ?? result.fm_trans_date,
        entityType: "finance",
        entityId: result.fm_fin_id,
        refNo: formatFinNo(finance),
        amount: result.fm_trans_amt,
      });

      return res.status(201).json({
        message: "Payment processed successfully.",
        data: result,
      });
    } catch (error) {
      console.error("❌ Controller Error (createPayment):", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new FinanceController();
