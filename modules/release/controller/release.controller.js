"use strict";

const releaseService = require("../service/release.service");
const { applyOtherImagesUpdate } = require("../../../utils/otherImages.helper");
const { BASE_URL } = require("../../../config/db");
const {
  logActivity,
  MODULE,
  ACTION,
  descriptions,
} = require("../../../common/service/activityLog.service");
const { formatLoanNo } = require("../../../utils/journalNarration");

class ReleaseController {
  getDbUrl(dbName) {
    return `${BASE_URL}/${dbName}`;
  }

  async addRelease(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const data = { ...req.body };

      // Validation
      if (!data.rel_girv_id || !data.rel_firm_id || !data.rel_user_id || !data.rel_trans_date) {
        return res.status(400).json({ error: "Missing required fields for release." });
      }

      const result = await releaseService.addRelease(dbUrl, req.user, data);

      const releaseUserId = result?.releaseUserId;
      if (releaseUserId && req.files && Object.keys(req.files).length > 0) {
        if (
          req.files.other_images ||
          data.other_images_remove ||
          data.other_images_meta ||
          data.other_images_update
        ) {
          const existingUser = await releaseService.getReleaseUserById(dbUrl, releaseUserId);
          const otherImages = await applyOtherImagesUpdate({
            ownId: req.user.own_id,
            moduleName: "release_user",
            entityId: releaseUserId,
            existingJson: existingUser?.ru_other_images,
            reqFiles: req.files,
            removePathsJson: data.other_images_remove,
            metaJson: data.other_images_meta,
            updateMetaJson: data.other_images_update,
          });
          await releaseService.updateReleaseUserOtherImages(dbUrl, releaseUserId, otherImages);
        }
      }

      const girvi = result?.girvi || result?.updatedGirvi;
      const release = result?.releaseRecord || result;
      logActivity(dbUrl, req.user, {
        firmId: data.rel_firm_id,
        module: MODULE.LOAN,
        action: ACTION.RELEASE,
        subject: "Loan Release",
        description: (at) => descriptions.loanRelease(girvi, release, at),
        transDate: release?.rel_trans_date,
        entityType: "girvi",
        entityId: data.rel_girv_id,
        refNo: formatLoanNo(girvi),
        amount: release?.rel_payable_amt ?? release?.rel_prin_amt,
      });

      return res.status(201).json({
        message: "Loan released successfully.",
        data: result,
      });
    } catch (error) {
      console.error("❌ Error releasing loan:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  async getReleaseUsers(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const { firmId, girvId, search } = req.query;
      const users = await releaseService.getReleaseUsers(dbUrl, { firmId, girvId, search });
      return res.status(200).json({
        message: "Release users fetched successfully.",
        data: users,
      });
    } catch (error) {
      console.error("❌ Error fetching release users:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  async deleteRelease(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const { rel_id } = req.params;

      if (!rel_id) {
        return res.status(400).json({ error: "Release ID is required." });
      }

      const result = await releaseService.deleteRelease(dbUrl, req.user, rel_id);

      const girvi = result?.updatedGirvi || result?.girvi;
      const release = result?.releaseRecord || result;
      logActivity(dbUrl, req.user, {
        firmId: release?.rel_firm_id || girvi?.girv_firm_id,
        module: MODULE.LOAN,
        action: ACTION.ROLLBACK,
        subject: "Release Reverted",
        description: (at) => descriptions.loanReleaseRevert(girvi, release, at),
        transDate: release?.rel_trans_date,
        entityType: "girvi",
        entityId: release?.rel_girv_id || girvi?.girv_id,
        refNo: formatLoanNo(girvi),
        amount: release?.rel_payable_amt ?? release?.rel_prin_amt,
      });

      return res.status(200).json({
        message: "Loan release reverted successfully.",
        data: result,
      });
    } catch (error) {
      console.error("❌ Error deleting release:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ReleaseController();
