"use strict";

const journalService = require("../modules/journal/service/journal.service");

async function findPanelJournal(prisma, { voucherInfo, firmId, amount, panel = "Girvi" }) {
  if (!voucherInfo) return null;
  const where = {
    jrnl_other_info: voucherInfo,
    jrnl_panel: panel,
    jrnl_is_deleted: false,
  };
  if (firmId != null) {
    where.jrnl_firm_id = parseInt(firmId, 10);
  }
  if (amount != null) {
    where.jrnl_amt = amount;
  }
  return prisma.journal.findFirst({ where });
}

async function deletePanelJournal(dbUrl, journal) {
  if (!journal?.jrnl_id) return false;
  await journalService.delete_journal_entry(
    dbUrl,
    journal.jrnl_id,
    journal.jrnl_own_id,
    journal.jrnl_firm_id
  );
  return true;
}

module.exports = {
  findPanelJournal,
  deletePanelJournal,
};
