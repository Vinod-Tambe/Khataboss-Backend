"use strict";

const addPrincipalService = require("../service/principal.service");
const { BASE_URL } = require("../../../config/db");
const {
  logActivity,
  MODULE,
  ACTION,
  descriptions,
} = require("../../../common/service/activityLog.service");
const { formatLoanNo } = require("../../../utils/journalNarration");

class AddPrincipalController {
  getDbUrl(dbName) {
    return `${BASE_URL}/${dbName}`;
  }

  async addAdditionalPrincipal(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const data = { ...req.body };

      // Validation
      if (!data.ap_girv_id || !data.ap_firm_id || !data.ap_user_id || !data.ap_trans_date || !data.ap_prin_amt || !data.ap_roi) {
        return res.status(400).json({ error: "Missing required fields for adding additional principal." });
      }

      const result = await addPrincipalService.addAdditionalPrincipal(dbUrl, req.user, data);

      const girvi = result?.girvi || result?.updatedGirvi;
      const ap = result?.apRecord || result;
      logActivity(dbUrl, req.user, {
        firmId: data.ap_firm_id,
        module: MODULE.LOAN,
        action: ACTION.ADD_PRINCIPAL,
        subject: "Additional Principal",
        description: (at) => descriptions.loanAddPrincipal(girvi, ap, at),
        transDate: ap?.ap_trans_date,
        entityType: "girvi",
        entityId: data.ap_girv_id,
        refNo: formatLoanNo(girvi),
        amount: ap?.ap_payable_amt ?? ap?.ap_prin_amt,
      });

      return res.status(201).json({
        message: "Additional principal added successfully.",
        data: result,
      });
    } catch (error) {
      console.error("❌ Error adding additional principal:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AddPrincipalController();
