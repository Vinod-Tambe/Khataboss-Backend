"use strict";

const financeService = require("../service/finance.service");
const { BASE_URL } = require("../../../config/db");

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
      return res.status(201).json({
        message: "Finance record created successfully.",
        data: result,
      });
    } catch (error) {
      console.error("❌ Controller Error (createFinance):", error.message);
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
      await financeService.delete_finance(dbUrl, id);
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
