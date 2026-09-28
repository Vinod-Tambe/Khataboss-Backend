"use strict";

const moneyTransactionService = require("../service/money_transaction.service");
const { BASE_URL } = require("../../../config/db");
const {
  logActivity,
  MODULE,
  ACTION,
  descriptions,
} = require("../../../common/service/activityLog.service");

class MoneyTransactionController {
  getDbUrl(dbName) {
    return `${BASE_URL}/${dbName}`;
  }

  async create(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const data = await moneyTransactionService.createTransfer(dbUrl, req.user, req.body);

      logActivity(dbUrl, req.user, {
        firmId: req.body.mtf_firm_id || req.body.mt_firm_id,
        module: MODULE.ACCOUNT,
        action: ACTION.TRANSFER,
        subject: "Inter-Account Transfer",
        description: (at) => descriptions.moneyTransferCreated(data, at),
        entityType: "money_from_transaction",
        entityId: data.mtf_id,
        transDate: data.mtf_trans_date,
        amount: data.mtf_total_amt,
      });

      return res.status(201).json({
        message: "Transfer saved successfully.",
        data,
      });
    } catch (error) {
      console.error("❌ Money transfer create:", error.message);
      return res.status(400).json({ error: error.message });
    }
  }

  async list(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const { firmId, startDate, endDate } = req.query;
      const data = await moneyTransactionService.listTransfers(dbUrl, {
        firmId,
        startDate,
        endDate,
      });
      return res.status(200).json({ data });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getOne(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const data = await moneyTransactionService.getByUuid(dbUrl, req.params.uuid);
      if (!data) {
        return res.status(404).json({ error: "Transfer not found." });
      }
      return res.status(200).json({ data });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async remove(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const deleted = await moneyTransactionService.deleteTransfer(
        dbUrl,
        req.user,
        req.params.id
      );

      logActivity(dbUrl, req.user, {
        firmId: deleted.mtf_firm_id,
        module: MODULE.ACCOUNT,
        action: ACTION.DELETE,
        subject: "Inter-Account Transfer Deleted",
        description: (at) =>
          descriptions.moneyTransferDeleted(deleted.mtf_id, deleted.mtf_total_amt, at),
        entityType: "money_from_transaction",
        entityId: deleted.mtf_id,
        transDate: deleted.mtf_trans_date,
        amount: deleted.mtf_total_amt,
      });

      return res.status(200).json({ message: "Transfer deleted successfully." });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new MoneyTransactionController();
