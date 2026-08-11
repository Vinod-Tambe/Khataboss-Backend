"use strict";

const journalBookService = require("../service/journalBook.service");
const { BASE_URL } = require("../../../config/db");

class JournalBookController {
  getDbUrl(dbName) {
    return `${BASE_URL}/${dbName}`;
  }

  async getAllJournals(req, res) {
    try {
      const firmId = req.query.firmId ?? req.user.firm_id ?? "all";

      const dbUrl = this.getDbUrl(req.user.own_db);
      const journals = await journalBookService.getAllJournals(dbUrl, firmId);
      
      return res.status(200).json({
        message: "Journal entries retrieved successfully.",
        data: journals,
      });
    } catch (error) {
      console.error("JournalBookController getAllJournals error:", error);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new JournalBookController();
