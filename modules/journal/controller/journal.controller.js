"use strict";

const journalService = require("../service/journal.service");
const { BASE_URL } = require("../../../config/db");

class JournalController {
  getDbUrl(dbName) {
    return `${BASE_URL}/${dbName}`;
  }

  async createJournal(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const jrnlId = await journalService.create_journal_entry(dbUrl, req.body);
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
      return res.status(200).json({
        message: "Journal entry deleted successfully.",
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new JournalController();
