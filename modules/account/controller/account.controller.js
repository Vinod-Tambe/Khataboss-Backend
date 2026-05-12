"use strict";

const accountService = require("../service/account.service");
const accountLedgerService = require("../service/account_ledger.service");
const { BASE_URL } = require("../../../config/db");

class AccountController {
  /**
   * Helper to resolve DB URL from a db name.
   */
  getDbUrl(dbName) {
    return `${BASE_URL}/${dbName}`;
  }

  /**
   * POST /account
   */
  async createAccount(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const accountData = { ...req.body };

      // Ensure acc_own_id is from the authenticated user
      accountData.acc_own_id = req.user.own_id;

      // Type Conversions
      if (accountData.acc_opening_date) {
        accountData.acc_opening_date = new Date(accountData.acc_opening_date);
      }
      if (accountData.acc_firm_id) {
        accountData.acc_firm_id = parseInt(accountData.acc_firm_id);
      }
      if (accountData.acc_cash_balance) {
        accountData.acc_cash_balance = String(accountData.acc_cash_balance);
      }

      // Check Duplicates within the same firm and primary account
      const isDuplicate = await accountService.checkDuplicateName(
        dbUrl,
        accountData.acc_name,
        accountData.acc_firm_id,
        accountData.acc_pre_acc
      );
      if (isDuplicate) {
        return res.status(409).json({ error: `Account already exists for this firm with the same Name and Primary Account.` });
      }

      const newAccount = await accountService.createAccount(dbUrl, accountData);

      return res.status(201).json({
        message: "Account created successfully.",
        data: newAccount,
      });
    } catch (error) {
      console.error("❌  Error creating account:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /account
   */
  async getAccounts(req, res) {
    try {
      const { firmId } = req.query;
      const dbUrl = this.getDbUrl(req.user.own_db);
      const accounts = await accountService.getAccounts(dbUrl, firmId);

      return res.status(200).json({
        message: "Accounts fetched successfully.",
        data: accounts,
      });
    } catch (error) {
      console.error("❌  Error fetching accounts:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /account/dropdown
   */
  async getAccountsDropdown(req, res) {
    try {
      const { firmId } = req.query;
      const dbUrl = this.getDbUrl(req.user.own_db);
      const accounts = await accountService.getAccountsDropdown(dbUrl, firmId);

      return res.status(200).json({
        message: "Accounts for dropdown fetched successfully.",
        data: accounts,
      });
    } catch (error) {
      console.error("❌  Error fetching accounts for dropdown:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /account/:uuid
   */
  async getAccountByUuid(req, res) {
    try {
      const { uuid } = req.params;
      const dbUrl = this.getDbUrl(req.user.own_db);
      const account = await accountService.getAccountByUuid(dbUrl, uuid);

      if (!account) {
        return res.status(404).json({ error: "Account not found." });
      }

      return res.status(200).json({
        message: "Account fetched successfully.",
        data: account,
      });
    } catch (error) {
      console.error("❌  Error fetching account:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * PUT /account/:uuid
   */
  async updateAccount(req, res) {
    try {
      const { uuid } = req.params;
      const dbUrl = this.getDbUrl(req.user.own_db);
      const updateData = { ...req.body };

      // Type Conversions if provided
      if (updateData.acc_opening_date) {
        updateData.acc_opening_date = new Date(updateData.acc_opening_date);
      }
      if (updateData.acc_firm_id) {
        updateData.acc_firm_id = parseInt(updateData.acc_firm_id);
      }
      if (updateData.acc_cash_balance) {
        updateData.acc_cash_balance = String(updateData.acc_cash_balance);
      }

      // Check Duplicates if name or firmId is changing
      if (updateData.acc_name || updateData.acc_firm_id) {
        // Fetch current account to get its firmId if not provided
        const currentAccount = await accountService.getAccountByUuid(dbUrl, uuid);
        if (!currentAccount) {
          return res.status(404).json({ error: "Account not found." });
        }
        const firmId = updateData.acc_firm_id || currentAccount.acc_firm_id;
        const name = updateData.acc_name || currentAccount.acc_name;
        const preAcc = updateData.acc_pre_acc === undefined ? currentAccount.acc_pre_acc : updateData.acc_pre_acc;

        const isDuplicate = await accountService.checkDuplicateName(dbUrl, name, firmId, preAcc, uuid);
        if (isDuplicate) {
          return res.status(409).json({ error: `Account already exists for this firm with the same Name and Primary Account.` });
        }
      }

      const updatedAccount = await accountService.updateAccountByUuid(dbUrl, uuid, updateData);

      return res.status(200).json({
        message: "Account updated successfully.",
        data: updatedAccount,
      });
    } catch (error) {
      console.error("❌  Error updating account:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * DELETE /account/:uuid
   */
  async deleteAccount(req, res) {
    try {
      const { uuid } = req.params;
      const dbUrl = this.getDbUrl(req.user.own_db);
      
      // Check if the account is a system account
      const isSystem = await accountService.isSystemAccount(dbUrl, uuid);
      if (isSystem) {
        return res.status(403).json({ error: "This account is a system base account, you cannot delete this." });
      }

      await accountService.deleteAccountByUuid(dbUrl, uuid, req.user.own_login_id || "Admin");

      return res.status(200).json({
        message: "Account deleted successfully (soft delete).",
      });
    } catch (error) {
      console.error("❌  Error deleting account:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /account/ledger
   */
  async get_account_ledger(req, res) {
    try {
      const { firmId, startDate, endDate, acc_id } = req.query;
      const dbUrl = this.getDbUrl(req.user.own_db);

      // Validate date format (YYYY-MM-DD) if provided
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (startDate && !dateRegex.test(startDate)) {
        return res.status(400).json({
          success: false,
          message: "Invalid start date format. Use YYYY-MM-DD",
        });
      }
      if (endDate && !dateRegex.test(endDate)) {
        return res.status(400).json({
          success: false,
          message: "Invalid end date format. Use YYYY-MM-DD",
        });
      }

      // Validate date range logic if both dates are provided
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start) || isNaN(end)) {
          return res.status(400).json({
            success: false,
            message: "Invalid date values",
          });
        }
        if (start > end) {
          return res.status(400).json({
            success: false,
            message: "Start date cannot be after end date",
          });
        }
      }

      // Prepare filters object
      const filters = {
        firmId,
        acc_id,
        startDate,
        endDate
      };

      const response = await accountLedgerService.get_account_ledger_details(dbUrl, filters);

      return res.status(200).json({
        success: true,
        message: "ledger entries fetched successfully",
        data: response,
      });
    } catch (error) {
      console.error("Error fetching ledger entries:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch ledger entries",
        error: error.message,
      });
    }
  }
}

module.exports = new AccountController();
