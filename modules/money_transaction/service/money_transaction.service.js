"use strict";

const { getTenantPrisma } = require("../../../utils/tenantPrisma");
const journalService = require("../../journal/service/journal.service");
const {
  buildTransferChannelDeltas,
  buildTransferChannelDeltasLegacy,
  formatAccountDisplayName,
} = require("../../../utils/accountChannel");

const PANEL_NAME = "Inter-Account Transfer";
const MAX_VOUCHER_NARRATION_LENGTH = 200;

function balanceType(acc) {
  return String(acc?.acc_balance_type || "DR").toUpperCase() === "CR" ? "CR" : "DR";
}

/** Accept legacy mt_* or new mtf_* from API / UI. */
function pickPayload(payload = {}) {
  return {
    firmId: payload.mtf_firm_id ?? payload.mt_firm_id,
    ownId: payload.mtf_own_id ?? payload.mt_own_id,
    fromAccId: payload.mtf_from_acc_id ?? payload.mt_from_acc_id,
    transDate: payload.mtf_trans_date ?? payload.mt_trans_date,
    mode: payload.mtf_mode ?? payload.mt_mode,
    direction: payload.mtf_direction ?? payload.mt_direction ?? "CR_TO_DR",
    narration: payload.mtf_narration ?? payload.mt_narration,
    otherInfo: payload.mtf_other_info ?? payload.mt_other_info,
    fromItems:
      payload.from_rows ??
      payload.from_items ??
      payload.cr_rows ??
      payload.dr_rows ??
      [],
    toItems: payload.to_rows ?? payload.to_items ?? payload.items ?? payload.destinations ?? [],
  };
}

class MoneyTransactionService {
  getPrisma(dbUrl) {
    return getTenantPrisma(dbUrl);
  }

  formatVoucherNarration(fromLabels, toLabels, transDate, narration) {
    const fromRoute = fromLabels.filter(Boolean).join(", ");
    const toRoute = toLabels.filter(Boolean).join(", ");
    const base = `${PANEL_NAME}: ${fromRoute} → ${toRoute} (${transDate})`;
    if (narration && String(narration).trim()) {
      return `${base}. ${String(narration).trim()}`;
    }
    return base;
  }

  normalizeLineRows(rawItems = [], accField = "acc_id") {
    return rawItems
      .map((row) => {
        const accId = parseInt(
          row.mfl_acc_id ??
            row.mtt_to_acc_id ??
            row[accField] ??
            row.to_acc_id ??
            row.from_acc_id,
          10
        );
        return {
          acc_id: accId,
          amt: parseFloat(row.mfl_amt ?? row.mtt_amt ?? row.amt),
          remarks: row.mfl_remarks ?? row.mtt_remarks ?? row.remarks ?? "",
        };
      })
      .filter((row) => row.acc_id > 0 && row.amt > 0);
  }

  resolveFromAndToItems(picked) {
    let fromItems = this.normalizeLineRows(picked.fromItems);
    const toItems = this.normalizeLineRows(picked.toItems);

    const legacyFromId = parseInt(picked.fromAccId, 10);
    if (fromItems.length < 1 && legacyFromId > 0 && toItems.length > 0) {
      const total = parseFloat(
        toItems.reduce((sum, row) => sum + row.amt, 0).toFixed(2)
      );
      fromItems = [{ acc_id: legacyFromId, amt: total, remarks: "" }];
    }

    return { fromItems, toItems };
  }

  async validateTransferLines(prisma, firmId, fromItems, toItems, direction) {
    if (fromItems.length < 1) {
      throw new Error("Add at least one account on the first section with amount.");
    }
    if (toItems.length < 1) {
      throw new Error("Add at least one account on the second section with amount.");
    }

    const isCrToDr = String(direction).toUpperCase() !== "DR_TO_CR";
    const fromType = isCrToDr ? "CR" : "DR";
    const toType = isCrToDr ? "DR" : "CR";

    const fromTotal = parseFloat(
      fromItems.reduce((sum, row) => sum + row.amt, 0).toFixed(2)
    );
    const toTotal = parseFloat(
      toItems.reduce((sum, row) => sum + row.amt, 0).toFixed(2)
    );

    if (!(fromTotal > 0) || !(toTotal > 0)) {
      throw new Error("Transfer amount must be greater than zero.");
    }
    if (fromTotal !== toTotal) {
      throw new Error(
        `${fromType} total (₹${fromTotal}) and ${toType} total (₹${toTotal}) must match.`
      );
    }

    const allIds = [
      ...fromItems.map((i) => i.acc_id),
      ...toItems.map((i) => i.acc_id),
    ];
    const uniqueIds = [...new Set(allIds)];
    const accounts = await prisma.account.findMany({
      where: {
        acc_id: { in: uniqueIds },
        acc_firm_id: firmId,
        acc_is_deleted: false,
      },
    });
    if (accounts.length !== uniqueIds.length) {
      throw new Error("One or more accounts are invalid for this firm.");
    }

    const accountById = Object.fromEntries(accounts.map((a) => [a.acc_id, a]));

    const assertSide = (items, expectedType, label) => {
      const ids = items.map((i) => i.acc_id);
      if (new Set(ids).size !== ids.length) {
        throw new Error(`Each ${label} account can only be used once per transfer.`);
      }
      for (const item of items) {
        const acc = accountById[item.acc_id];
        if (balanceType(acc) !== expectedType) {
          throw new Error(`Each ${label} row must be a ${expectedType} balance type account.`);
        }
      }
    };

    assertSide(fromItems, fromType, fromType);
    assertSide(toItems, toType, toType);

    const fromIdSet = new Set(fromItems.map((i) => i.acc_id));
    for (const item of toItems) {
      if (fromIdSet.has(item.acc_id)) {
        throw new Error("The same account cannot appear in both sections.");
      }
    }

    return { accountById, fromTotal, toTotal, fromType, toType };
  }

  buildJournalLines(fromItems, toItems, direction, transDate, accountById, voucherInfo) {
    const isCrToDr = String(direction).toUpperCase() !== "DR_TO_CR";

    const fromLines = fromItems.map((item) => {
      const acc = accountById[item.acc_id];
      const name = formatAccountDisplayName(acc);
      if (isCrToDr) {
        return {
          jrtr_crdr: "CR",
          jrtr_date: transDate,
          jrtr_cr_acc_id: item.acc_id,
          jrtr_cr_amt: item.amt,
          jrtr_acc_info: name,
          jrtr_other_info: item.remarks || voucherInfo,
        };
      }
      return {
        jrtr_crdr: "DR",
        jrtr_date: transDate,
        jrtr_dr_acc_id: item.acc_id,
        jrtr_dr_amt: item.amt,
        jrtr_acc_info: name,
        jrtr_other_info: item.remarks || voucherInfo,
      };
    });

    const toLines = toItems.map((item) => {
      const acc = accountById[item.acc_id];
      const name = formatAccountDisplayName(acc);
      if (isCrToDr) {
        return {
          jrtr_crdr: "DR",
          jrtr_date: transDate,
          jrtr_dr_acc_id: item.acc_id,
          jrtr_dr_amt: item.amt,
          jrtr_acc_info: name,
          jrtr_other_info: item.remarks || voucherInfo,
        };
      }
      return {
        jrtr_crdr: "CR",
        jrtr_date: transDate,
        jrtr_cr_acc_id: item.acc_id,
        jrtr_cr_amt: item.amt,
        jrtr_acc_info: name,
        jrtr_other_info: item.remarks || voucherInfo,
      };
    });

    return [...fromLines, ...toLines];
  }

  async createTransfer(dbUrl, reqUser, payload) {
    const prisma = this.getPrisma(dbUrl);
    const picked = pickPayload(payload);
    const firmId = parseInt(picked.firmId, 10);
    const ownId = parseInt(reqUser?.own_id || picked.ownId, 10);
    const transDate = picked.transDate;

    if (!firmId || !transDate) {
      throw new Error("Firm and transaction date are required.");
    }

    const narration = String(picked.narration || "").trim();
    if (!narration) {
      throw new Error("Voucher narration is required.");
    }
    if (narration.length > MAX_VOUCHER_NARRATION_LENGTH) {
      throw new Error(
        `Voucher narration must be at most ${MAX_VOUCHER_NARRATION_LENGTH} characters.`
      );
    }

    const direction =
      String(picked.direction || "CR_TO_DR").toUpperCase() === "DR_TO_CR"
        ? "DR_TO_CR"
        : "CR_TO_DR";

    const { fromItems, toItems } = this.resolveFromAndToItems(picked);

    const { accountById, fromTotal, fromType, toType } = await this.validateTransferLines(
      prisma,
      firmId,
      fromItems,
      toItems,
      direction
    );

    const mode =
      fromItems.length === 1 && toItems.length === 1 ? "ONE_TO_ONE" : "ONE_TO_MANY";

    const fromLabels = fromItems.map(
      (i) => formatAccountDisplayName(accountById[i.acc_id]) || `A/c #${i.acc_id}`
    );
    const toLabels = toItems.map(
      (i) => formatAccountDisplayName(accountById[i.acc_id]) || `A/c #${i.acc_id}`
    );
    const voucherInfo = this.formatVoucherNarration(
      fromLabels,
      toLabels,
      transDate,
      narration
    );

    const journalLines = this.buildJournalLines(
      fromItems,
      toItems,
      direction,
      transDate,
      accountById,
      voucherInfo
    );

    const jrnlId = await journalService.create_journal_entry(dbUrl, {
      journal_date: {
        jrnl_date: transDate,
        jrnl_firm_id: firmId,
        jrnl_own_id: ownId,
        jrnl_user_id: null,
        jrnl_amt: fromTotal,
        jrnl_panel: PANEL_NAME,
        jrnl_other_info: voucherInfo,
      },
      joural_trans_data: journalLines,
    });

    const createdBy =
      reqUser?.staff_login_id || reqUser?.own_login_id || reqUser?.own_id || "system";

    const headerFromAccId = fromItems[0].acc_id;

    const record = await prisma.money_From_Transaction.create({
      data: {
        mtf_firm_id: firmId,
        mtf_own_id: ownId,
        mtf_jrnl_id: jrnlId,
        mtf_from_acc_id: headerFromAccId,
        mtf_trans_date: transDate,
        mtf_mode: mode,
        mtf_direction: direction,
        mtf_total_amt: fromTotal,
        mtf_panel: PANEL_NAME,
        mtf_narration: narration,
        mtf_other_info: picked.otherInfo || null,
        mtf_created_by: String(createdBy),
        fromLines: {
          create: fromItems.map((item) => ({
            mfl_acc_id: item.acc_id,
            mfl_amt: item.amt,
            mfl_remarks: item.remarks || null,
          })),
        },
        toRows: {
          create: toItems.map((item) => ({
            mtt_to_acc_id: item.acc_id,
            mtt_amt: item.amt,
            mtt_remarks: item.remarks || null,
          })),
        },
      },
      include: this.includeShape(),
    });

    return this.formatListRow(record);
  }

  includeShape() {
    return {
      firm: { select: { firm_id: true, firm_name: true } },
      fromAccount: { select: { acc_id: true, acc_uuid: true, acc_name: true, acc_pre_acc: true } },
      fromLines: {
        include: {
          account: {
            select: { acc_id: true, acc_uuid: true, acc_name: true, acc_pre_acc: true, acc_balance_type: true },
          },
        },
      },
      toRows: {
        include: {
          toAccount: {
            select: { acc_id: true, acc_uuid: true, acc_name: true, acc_pre_acc: true, acc_balance_type: true },
          },
        },
      },
      journal: { select: { jrnl_id: true, jrnl_uuid: true } },
    };
  }

  formatListRow(row) {
    if (!row) return null;
    const from_rows = (row.fromLines || []).map((item) => ({
      mfl_id: item.mfl_id,
      mfl_uuid: item.mfl_uuid,
      mfl_acc_id: item.mfl_acc_id,
      account: item.account,
      mfl_amt: item.mfl_amt,
      mfl_remarks: item.mfl_remarks,
    }));
    const to_rows = (row.toRows || []).map((item) => ({
      mtt_id: item.mtt_id,
      mtt_uuid: item.mtt_uuid,
      mtt_to_acc_id: item.mtt_to_acc_id,
      to_account: item.toAccount,
      mtt_amt: item.mtt_amt,
      mtt_remarks: item.mtt_remarks,
    }));

    const fromLabel =
      from_rows.length > 0
        ? from_rows.map((d) => formatAccountDisplayName(d.account)).filter((n) => n && n !== "-").join(", ")
        : formatAccountDisplayName(row.fromAccount);

    return {
      mtf_id: row.mtf_id,
      mtf_uuid: row.mtf_uuid,
      mtf_trans_date: row.mtf_trans_date,
      mtf_mode: row.mtf_mode,
      mtf_direction: row.mtf_direction || "CR_TO_DR",
      mtf_total_amt: row.mtf_total_amt,
      mtf_panel: row.mtf_panel,
      mtf_narration: row.mtf_narration,
      mtf_jrnl_id: row.mtf_jrnl_id,
      firm: row.firm,
      from_account: row.fromAccount,
      from_rows,
      from_label: fromLabel,
      to_rows,
      destination_label: to_rows
        .map((d) => formatAccountDisplayName(d.to_account))
        .filter((n) => n && n !== "-")
        .join(", "),
      mtf_created_at: row.mtf_created_at,
      journal: row.journal,
    };
  }

  async listTransfers(dbUrl, filters = {}) {
    const prisma = this.getPrisma(dbUrl);
    const where = { mtf_is_deleted: false };
    if (filters.firmId) {
      where.mtf_firm_id = parseInt(filters.firmId, 10);
    }
    if (filters.startDate || filters.endDate) {
      where.mtf_trans_date = {};
      if (filters.startDate) where.mtf_trans_date.gte = filters.startDate;
      if (filters.endDate) where.mtf_trans_date.lte = filters.endDate;
    }

    const rows = await prisma.money_From_Transaction.findMany({
      where,
      orderBy: [{ mtf_trans_date: "desc" }, { mtf_id: "desc" }],
      include: this.includeShape(),
    });

    return rows.map((row) => this.formatListRow(row));
  }

  async getByUuid(dbUrl, uuid) {
    const prisma = this.getPrisma(dbUrl);
    const row = await prisma.money_From_Transaction.findFirst({
      where: { mtf_uuid: uuid, mtf_is_deleted: false },
      include: this.includeShape(),
    });
    if (!row) return null;
    return this.formatListRow(row);
  }

  async deleteTransfer(dbUrl, reqUser, mtfId) {
    const prisma = this.getPrisma(dbUrl);
    const id = parseInt(mtfId, 10);
    const existing = await prisma.money_From_Transaction.findFirst({
      where: { mtf_id: id, mtf_is_deleted: false },
    });
    if (!existing) {
      throw new Error("Transfer record not found.");
    }

    if (existing.mtf_jrnl_id) {
      await journalService.delete_journal_entry(
        dbUrl,
        existing.mtf_jrnl_id,
        existing.mtf_own_id,
        existing.mtf_firm_id
      );
    }

    const deletedBy =
      reqUser?.staff_login_id || reqUser?.own_login_id || reqUser?.own_id || "system";

    await prisma.money_From_Transaction.update({
      where: { mtf_id: id },
      data: {
        mtf_is_deleted: true,
        mtf_deleted_at: new Date(),
        mtf_deleted_by: String(deletedBy),
        mtf_jrnl_id: null,
      },
    });

    return existing;
  }

  buildDaybookChannels(record) {
    const direction = record.mtf_direction || "CR_TO_DR";
    if (record.fromLines?.length) {
      return buildTransferChannelDeltas(
        record.fromLines.map((item) => ({
          account: item.account,
          amt: item.mfl_amt,
        })),
        (record.toRows || []).map((item) => ({
          account: item.toAccount,
          amt: item.mtt_amt,
        })),
        direction
      );
    }
    return buildTransferChannelDeltasLegacy(
      record.fromAccount,
      (record.toRows || []).map((item) => ({
        amt: item.mtt_amt,
        account: item.toAccount,
      })),
      direction
    );
  }
}

module.exports = new MoneyTransactionService();
