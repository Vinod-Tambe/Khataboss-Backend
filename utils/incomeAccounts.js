"use strict";

/** Chart-of-accounts income types used for P&L split lines */
const INCOME_ACCOUNT_TYPES = {
  PROCESSING: {
    acc_name: "Processing Fees",
    acc_pre_acc: "Indirect Incomes",
    pnl_label: "Processing Amount",
  },
  COLLECT: {
    acc_name: "Collect Amount",
    acc_pre_acc: "Indirect Incomes",
    pnl_label: "Collect Amount",
  },
  EXTRA: {
    acc_name: "Extra Income",
    acc_pre_acc: "Indirect Incomes",
    pnl_label: "Extra Amount",
  },
  FINE: {
    acc_name: "Fine Income",
    acc_pre_acc: "Indirect Incomes",
    pnl_label: "Fine Amount",
  },
  INTEREST: {
    acc_name: "Interest Rec",
    acc_pre_acc: "Indirect Incomes",
    pnl_label: "Interest Received",
  },
};

const PNL_INCOME_ORDER = [
  "Processing Amount",
  "Collect Amount",
  "Extra Amount",
  "Fine Amount",
  "Interest Received",
];

const PNL_LABEL_BY_ACC_NAME = Object.fromEntries(
  Object.values(INCOME_ACCOUNT_TYPES).map((t) => [t.acc_name, t.pnl_label])
);

const PNL_LABEL_BY_ACC_NAME_LOWER = Object.fromEntries(
  Object.entries(PNL_LABEL_BY_ACC_NAME).map(([name, label]) => [
    name.toLowerCase(),
    label,
  ])
);

/** Map ledger account name → P&L display label (case-insensitive). */
function getPnlIncomeLabel(accName) {
  const trimmed = String(accName || "").trim();
  if (!trimmed) return trimmed;
  if (PNL_LABEL_BY_ACC_NAME[trimmed]) return PNL_LABEL_BY_ACC_NAME[trimmed];
  return PNL_LABEL_BY_ACC_NAME_LOWER[trimmed.toLowerCase()] || trimmed;
}

/** Classify legacy Interest Rec journal line by narration text. */
function classifyIncomeNarration(narration, netAmount) {
  const text = String(narration || "").trim();
  const amount = Number(netAmount) || 0;
  if (!text) return { type: "INTEREST", amount };

  if (
    /Process Charge|Process Fee|Other Charge|Finance Process Fee|Processing Fee/i.test(
      text
    )
  ) {
    return { type: "PROCESSING", amount };
  }

  const fineCollectMatch = text.match(
    /Fine\s+([\d.]+)\s*\+\s*Collect\s+([\d.]+)/i
  );
  if (fineCollectMatch) {
    const sign = amount >= 0 ? 1 : -1;
    return {
      type: "FINE_COLLECT",
      fine: (parseFloat(fineCollectMatch[1]) || 0) * sign,
      collect: (parseFloat(fineCollectMatch[2]) || 0) * sign,
    };
  }

  if (/Fine|Overdue/i.test(text) && !/Interest/i.test(text)) {
    return { type: "FINE", amount };
  }
  if (
    /Collect Amount|Collect Payment|Collect Rollback|\bCollect\b/i.test(text) &&
    !/Fine/i.test(text)
  ) {
    return { type: "COLLECT", amount };
  }
  if (/Extra|Discount/i.test(text)) {
    return { type: "EXTRA", amount };
  }

  return { type: "INTEREST", amount };
}

/**
 * Split Interest Rec journal lines into P&L income buckets (legacy postings).
 */
function splitInterestRecJournalLines(lines = [], interestRecAccId) {
  const accId = Number(interestRecAccId);
  const splits = {
    processing: 0,
    collect: 0,
    fine: 0,
    extra: 0,
    interest: 0,
  };

  if (!accId) return splits;

  for (const line of lines) {
    let net = 0;
    if (Number(line.jrtr_cr_acc_id) === accId) {
      net += parseFloat(line.jrtr_cr_amt) || 0;
    }
    if (Number(line.jrtr_dr_acc_id) === accId) {
      net -= parseFloat(line.jrtr_dr_amt) || 0;
    }
    if (!net) continue;

    const classified = classifyIncomeNarration(line.jrtr_acc_info, net);
    if (classified.type === "FINE_COLLECT") {
      splits.fine += classified.fine || 0;
      splits.collect += classified.collect || 0;
      continue;
    }

    switch (classified.type) {
      case "PROCESSING":
        splits.processing += classified.amount;
        break;
      case "COLLECT":
        splits.collect += classified.amount;
        break;
      case "FINE":
        splits.fine += classified.amount;
        break;
      case "EXTRA":
        splits.extra += classified.amount;
        break;
      default:
        splits.interest += classified.amount;
        break;
    }
  }

  for (const key of Object.keys(splits)) {
    splits[key] = parseFloat(splits[key].toFixed(2));
  }

  return splits;
}

/**
 * Re-allocate legacy Interest Rec totals into separate income account rows for P&L.
 */
function applyLegacyInterestRecSplit(rows = [], splits = {}) {
  const list = (rows || []).map((row) => ({
    item: row.item,
    amount: Number(row.amount || 0),
  }));

  const hasSplit =
    splits.processing ||
    splits.collect ||
    splits.fine ||
    splits.extra ||
    splits.interest;

  if (!hasSplit) return list;

  const bump = (accName, amt) => {
    const value = Number(amt || 0);
    if (!value) return;
    const idx = list.findIndex(
      (row) => String(row.item || "").toLowerCase() === accName.toLowerCase()
    );
    if (idx >= 0) list[idx].amount = parseFloat((list[idx].amount + value).toFixed(2));
    else list.push({ item: accName, amount: value });
  };

  const interestRecIdx = list.findIndex(
    (row) => getPnlIncomeLabel(row.item) === "Interest Received"
  );

  if (interestRecIdx >= 0) {
    if (splits.interest) {
      list[interestRecIdx].amount = splits.interest;
    } else {
      list.splice(interestRecIdx, 1);
    }
  } else if (splits.interest) {
    list.push({ item: "Interest Rec", amount: splits.interest });
  }

  bump("Processing Fees", splits.processing);
  bump("Collect Amount", splits.collect);
  bump("Fine Income", splits.fine);
  bump("Extra Income", splits.extra);

  return list.filter((row) => row.amount !== 0);
}

/**
 * Find or create a firm income account by type key.
 * @param {import('@prisma/client').PrismaClient} prisma
 * @param {number|string} firmId
 * @param {number|string} ownId
 * @param {'PROCESSING'|'COLLECT'|'EXTRA'|'FINE'|'INTEREST'} typeKey
 */
async function ensureIncomeAccount(prisma, firmId, ownId, typeKey) {
  const config = INCOME_ACCOUNT_TYPES[typeKey];
  if (!config) {
    throw new Error(`Unknown income account type: ${typeKey}`);
  }

  const parsedFirmId = parseInt(firmId, 10);
  const parsedOwnId = parseInt(ownId, 10) || 1;

  let acc = await prisma.account.findFirst({
    where: {
      acc_firm_id: parsedFirmId,
      acc_is_deleted: false,
      acc_name: {
        equals: config.acc_name,
        mode: "insensitive",
      },
    },
  });

  if (acc) return acc.acc_id;

  acc = await prisma.account.create({
    data: {
      acc_name: config.acc_name,
      acc_pre_acc: config.acc_pre_acc,
      acc_firm_id: parsedFirmId,
      acc_own_id: parsedOwnId,
      acc_is_system: true,
      acc_balance_type: "CR",
      acc_opening_date: new Date(),
      acc_cash_balance: "0",
    },
  });

  return acc.acc_id;
}

/**
 * Resolve income account; creates system account if missing (existing firms).
 */
async function resolveIncomeAccount(prisma, firmId, ownId, typeKey) {
  return ensureIncomeAccount(prisma, firmId, ownId, typeKey);
}

/**
 * Map indirect income rows to P&L display labels and fixed order.
 * Merges duplicate labels; hides raw "Interest Rec" name.
 */
function formatIndirectIncomesForPnl(rows = []) {
  const merged = new Map();

  for (const row of rows) {
    const rawName = (row.item || "").trim();
    const label = getPnlIncomeLabel(rawName);
    const amount = Number(row.amount || 0);
    if (!amount) continue;
    merged.set(label, (merged.get(label) || 0) + amount);
  }

  const ordered = [];
  for (const label of PNL_INCOME_ORDER) {
    const amount = merged.get(label);
    if (amount != null && amount !== 0) {
      ordered.push({ item: label, amount });
      merged.delete(label);
    }
  }

  for (const [item, amount] of merged.entries()) {
    if (amount !== 0) {
      ordered.push({ item, amount });
    }
  }

  return ordered;
}

/**
 * Build CR (or DR for rollback) lines for fine + collect split posting.
 */
function buildFineCollectIncomeLines({
  isRollback,
  transDate,
  finePortion,
  collectPortion,
  fineAccId,
  collectAccId,
  narration,
}) {
  const lines = [];
  const side = isRollback ? "DR" : "CR";
  const accField = isRollback ? "jrtr_dr_acc_id" : "jrtr_cr_acc_id";
  const amtField = isRollback ? "jrtr_dr_amt" : "jrtr_cr_amt";

  const fine = parseFloat(finePortion) || 0;
  const collect = parseFloat(collectPortion) || 0;

  if (fine > 0) {
    lines.push({
      jrtr_crdr: side,
      jrtr_date: transDate,
      [accField]: fineAccId,
      [amtField]: fine,
      jrtr_acc_info: narration,
    });
  }
  if (collect > 0) {
    lines.push({
      jrtr_crdr: side,
      jrtr_date: transDate,
      [accField]: collectAccId,
      [amtField]: collect,
      jrtr_acc_info: narration,
    });
  }

  return lines;
}

/**
 * Build income-side journal lines for finance collection payments.
 */
function buildFinanceIncomeCreditLines({
  isRollback,
  transDate,
  isFine,
  isFineRollback,
  isInterest,
  isInterestRollback,
  finePortion,
  collectPortion,
  paymentAmt,
  fineAccId,
  collectAccId,
  interestAccId,
  loanAccId,
  narrationFineCollect,
  narrationInterest,
  narrationEmi,
}) {
  if (isFine || isFineRollback) {
    return buildFineCollectIncomeLines({
      isRollback,
      transDate,
      finePortion,
      collectPortion,
      fineAccId,
      collectAccId,
      narration: narrationFineCollect,
    });
  }

  const side = isRollback ? "DR" : "CR";
  const accField = isRollback ? "jrtr_dr_acc_id" : "jrtr_cr_acc_id";
  const amtField = isRollback ? "jrtr_dr_amt" : "jrtr_cr_amt";

  if (isInterest || isInterestRollback) {
    return [
      {
        jrtr_crdr: side,
        jrtr_date: transDate,
        [accField]: interestAccId,
        [amtField]: paymentAmt,
        jrtr_acc_info: narrationInterest,
      },
    ];
  }

  return [
    {
      jrtr_crdr: side,
      jrtr_date: transDate,
      [accField]: loanAccId,
      [amtField]: paymentAmt,
      jrtr_acc_info: narrationEmi,
    },
  ];
}

module.exports = {
  INCOME_ACCOUNT_TYPES,
  PNL_INCOME_ORDER,
  ensureIncomeAccount,
  resolveIncomeAccount,
  getPnlIncomeLabel,
  classifyIncomeNarration,
  splitInterestRecJournalLines,
  applyLegacyInterestRecSplit,
  formatIndirectIncomesForPnl,
  buildFineCollectIncomeLines,
  buildFinanceIncomeCreditLines,
};
