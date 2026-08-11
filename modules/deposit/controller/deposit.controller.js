"use strict";

const depositService = require("../service/deposit.service");
const { BASE_URL } = require("../../../config/db");
const {
  logActivity,
  MODULE,
  ACTION,
  descriptions,
} = require("../../../common/service/activityLog.service");
const { formatLoanNo } = require("../../../utils/journalNarration");

class DepositController {
  getDbUrl(dbName) {
    return `${BASE_URL}/${dbName}`;
  }

  async addDeposit(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const data = { ...req.body };

      // Validation
      if (!data.dep_girv_id || !data.dep_firm_id || !data.dep_user_id || !data.dep_trans_date) {
        return res.status(400).json({ error: "Missing required fields for deposit." });
      }

      const result = await depositService.addDeposit(dbUrl, req.user, data);

      const girvi = result?.girvi || result?.updatedGirvi;
      const deposit = result?.depositRecord || result;
      logActivity(dbUrl, req.user, {
        firmId: data.dep_firm_id,
        module: MODULE.LOAN,
        action: ACTION.DEPOSIT,
        subject: "Loan Deposit",
        description: (at) => descriptions.loanDeposit(girvi, deposit, at),
        transDate: deposit?.dep_trans_date,
        entityType: "girvi",
        entityId: data.dep_girv_id,
        refNo: formatLoanNo(girvi),
        amount: deposit?.dep_payable_amt ?? deposit?.dep_prin_amt,
      });

      return res.status(201).json({
        message: "Deposit added successfully.",
        data: result,
      });
    } catch (error) {
      console.error("❌ Error adding deposit:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new DepositController();
