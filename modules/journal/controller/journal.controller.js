"use strict";

const journalService = require("../service/journal.service");
const { BASE_URL } = require("../../../config/db");
const {
  logActivity,
  GLOBAL_FIRM_ID,
  MODULE,
  ACTION,
  descriptions,
} = require("../../../common/service/activityLog.service");

class JournalController {
  getDbUrl(dbName) {
    return `${BASE_URL}/${dbName}`;
  }

  async createJournal(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const jrnlId = await journalService.create_journal_entry(dbUrl, req.body);

      logActivity(dbUrl, req.user, {
        firmId: req.body.jrnl_firm_id || GLOBAL_FIRM_ID,
        module: MODULE.JOURNAL,
        action: ACTION.CREATE,
        subject: "Journal Entry",
        description: (at) => descriptions.journalCreated(req.body, jrnlId, at),
        entityType: "journal",
        entityId: jrnlId,
        transDate: req.body.jrnl_trans_date,
      });

      return res.status(201).json({
        message: "Journal entry created successfully.",
        data: { jrnl_id: jrnlId },
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async deleteJournal(req, res) {
    try {
      const { id } = req.params;
      const { own_id, firm_id } = req.query;
      const dbUrl = this.getDbUrl(req.user.own_db);
      await journalService.delete_journal_entry(dbUrl, id, own_id, firm_id);

      logActivity(dbUrl, req.user, {
        firmId: firm_id || GLOBAL_FIRM_ID,
        module: MODULE.JOURNAL,
        action: ACTION.DELETE,
        subject: "Journal Deleted",
        description: (at) => descriptions.journalDeleted(id, at),
        entityType: "journal",
        entityId: parseInt(id, 10) || null,
      });

      return res.status(200).json({
        message: "Journal entry deleted successfully.",
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new JournalController();
