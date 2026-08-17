"use strict";

const { getTenantPrisma } = require("../../../utils/tenantPrisma");
const {
  collectReferenceIds,
  loadReferenceMaps,
  humanizeJournalNarration,
} = require("../../../utils/journalNarration");

class JournalBookService {
  getPrisma(dbUrl) {
    return getTenantPrisma(dbUrl);
  }

  mapTransactionLine(t, humanize) {
    const isDr = String(t.jrtr_crdr).toUpperCase() === "DR";
    const account = isDr ? t.debitAccount : t.creditAccount;
    const accName = account?.acc_name || "Unknown Account";
    const amount = isDr
      ? parseFloat(t.jrtr_dr_amt || 0)
      : parseFloat(t.jrtr_cr_amt || 0);
    const rawNarration = (t.jrtr_acc_info || t.jrtr_other_info || "").trim();

    return {
      jrtr_id: t.jrtr_id,
      side: isDr ? "DR" : "CR",
      acc_id: account?.acc_id || (isDr ? t.jrtr_dr_acc_id : t.jrtr_cr_acc_id) || null,
      acc_uuid: account?.acc_uuid || null,
      acc_name: accName,
      amount,
      narration: humanize(rawNarration),
    };
  }

  buildDisplayLines(drLines, crLines) {
    const displayLines = [];

    drLines.forEach((line) => {
      displayLines.push({
        side: "DR",
        acc_id: line.acc_id,
        acc_uuid: line.acc_uuid,
        acc_name: line.acc_name,
        narration: line.narration,
        debit: line.amount,
        credit: 0,
      });
    });

    crLines.forEach((line) => {
      displayLines.push({
        side: "CR",
        acc_id: line.acc_id,
        acc_uuid: line.acc_uuid,
        acc_name: line.acc_name,
        narration: line.narration,
        debit: 0,
        credit: line.amount,
      });
    });

    return displayLines;
  }

  isAllFirms(firmId) {
    if (firmId == null || firmId === "") return true;
    const normalized = String(firmId).trim().toLowerCase();
    return normalized === "all" || normalized === "n";
  }

  /**
   * Return journal vouchers grouped with aligned DR/CR lines for the journal book report.
   */
  async getAllJournals(dbUrl, firmId) {
    const prisma = this.getPrisma(dbUrl);
    const allFirms = this.isAllFirms(firmId);
    const parsedFirmId = parseInt(firmId, 10);

    if (!allFirms && (Number.isNaN(parsedFirmId) || parsedFirmId <= 0)) {
      throw new Error("Invalid firmId");
    }

    const where = { jrnl_is_deleted: false };
    if (!allFirms) {
      where.jrnl_firm_id = parsedFirmId;
    }


      const journals = await prisma.journal.findMany({
        where,
        orderBy: [{ jrnl_date: "desc" }, { jrnl_id: "desc" }],
        include: {
          firm: { select: { firm_id: true, firm_name: true } },
          journalTransactions: {
            where: { jrtr_is_deleted: false },
            include: {
              debitAccount: { select: { acc_id: true, acc_name: true, acc_uuid: true } },
              creditAccount: { select: { acc_id: true, acc_name: true, acc_uuid: true } },
            },
            orderBy: [{ jrtr_id: "asc" }],
          },
        },
      });

      const narrationTexts = [];
      journals.forEach((j) => {
        if (j.jrnl_other_info) narrationTexts.push(j.jrnl_other_info);
        j.journalTransactions.forEach((t) => {
          if (t.jrtr_acc_info) narrationTexts.push(t.jrtr_acc_info);
          if (t.jrtr_other_info) narrationTexts.push(t.jrtr_other_info);
        });
      });

      const { girviIds, finIds } = collectReferenceIds(narrationTexts);
      const refMaps = await loadReferenceMaps(prisma, girviIds, finIds);
      const humanize = (text) => humanizeJournalNarration(text, refMaps);

      return journals
        .filter((j) => j.journalTransactions.length > 0)
        .map((j) => {
          const lines = j.journalTransactions.map((t) =>
            this.mapTransactionLine(t, humanize)
          );
          const drLines = lines.filter((l) => l.side === "DR");
          const crLines = lines.filter((l) => l.side === "CR");
          const displayLines = this.buildDisplayLines(drLines, crLines);
          const totalDr = parseFloat(
            drLines.reduce((sum, l) => sum + l.amount, 0).toFixed(2)
          );
          const totalCr = parseFloat(
            crLines.reduce((sum, l) => sum + l.amount, 0).toFixed(2)
          );
          const voucherInfo = humanize(j.jrnl_other_info || "");

          return {
            row_id: `jrnl-${j.jrnl_id}`,
            jrnl_id: j.jrnl_id,
            jrtr_date: j.jrnl_date,
            jrnl_date: j.jrnl_date,
            firm_id: j.jrnl_firm_id,
            firm_name: j.firm?.firm_name || "",
            jrnl_other_info: voucherInfo,
            jrnl_panel: j.jrnl_panel || "",
            jrnl_amt: j.jrnl_amt,
            voucher_title: voucherInfo || `${j.jrnl_panel || "Journal"}`,
            account_names: lines.map((l) => l.acc_name).join(" "),
            lines,
            dr_lines: drLines,
            cr_lines: crLines,
            display_lines: displayLines,
            total_dr: totalDr,
            total_cr: totalCr,
            jrtr_dr_amt: totalDr,
            jrtr_cr_amt: totalCr,
          };
        });
    
  }
}

module.exports = new JournalBookService();
