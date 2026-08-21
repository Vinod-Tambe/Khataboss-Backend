"use strict";

/**
 * Indian statutory accounting helpers — GST (inclusive fee split), Schedule III
 * P&L labels, financial year (Apr–Mar), and compliance account seeding.
 *
 * GST: When firm has GSTIN, taxable service fees (processing, collect, loan
 * process/charge) are split into taxable value + CGST/SGST (intra-state default).
 * Interest on loans is treated as exempt — no GST lines posted.
 */

const DEFAULT_GST_RATE = 18;

const TAX_ACCOUNT_TYPES = {
  CGST: { acc_name: "CGST Payable", acc_pre_acc: "Duties & Taxes" },
  SGST: { acc_name: "SGST Payable", acc_pre_acc: "Duties & Taxes" },
  IGST: { acc_name: "IGST Payable", acc_pre_acc: "Duties & Taxes" },
  TDS: { acc_name: "TDS Payable", acc_pre_acc: "Duties & Taxes" },
};

/** P&L display label → Schedule III / ITR-style particulars */
const SCHEDULE_III_LABELS = {
  "Processing Amount": "Processing / documentation charges",
  "Collect Amount": "Collection charges",
  "Extra Amount": "Other receipts",
  "Fine Amount": "Penal / late payment charges",
  "Interest Received": "Interest on loans and advances",
};

/** Income types that attract GST when firm is registered (not interest). */
const GST_TAXABLE_INCOME_KEYS = new Set(["PROCESSING", "COLLECT"]);

const round2 = (n) => parseFloat(Number(n || 0).toFixed(2));

function isGstRegistered(firm) {
  const gstin = String(firm?.firm_gstin_no || "").trim();
  return gstin.length >= 15;
}

function getGstRate(firm) {
  const custom = parseFloat(firm?.firm_gst_rate);
  return custom > 0 ? custom : DEFAULT_GST_RATE;
}

/**
 * Split GST-inclusive gross amount into taxable value + tax components.
 * gross = taxable + tax (taxable * rate / 100)
 */
function splitGstInclusive(grossAmount, ratePercent = DEFAULT_GST_RATE) {
  const gross = round2(grossAmount);
  if (!(gross > 0) || !(ratePercent > 0)) {
    return { taxableValue: gross, totalTax: 0, cgst: 0, sgst: 0, igst: 0, useIgst: false };
  }
  const taxableValue = round2(gross / (1 + ratePercent / 100));
  const totalTax = round2(gross - taxableValue);
  const useIgst = false;
  const cgst = useIgst ? 0 : round2(totalTax / 2);
  const sgst = useIgst ? 0 : round2(totalTax - cgst);
  const igst = useIgst ? totalTax : 0;
  return { taxableValue, totalTax, cgst, sgst, igst, useIgst };
}

function getIndianFinancialYear(dateInput = new Date()) {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  const month = d.getMonth();
  const year = d.getFullYear();
  const startYear = month >= 3 ? year : year - 1;
  return {
    startYear,
    endYear: startYear + 1,
    label: `${startYear}-${String(startYear + 1).slice(-2)}`,
    startDate: `${startYear}-04-01`,
    endDate: `${startYear + 1}-03-31`,
  };
}

function fyLabelForRange(startDate, endDate) {
  if (!startDate || !endDate) return getIndianFinancialYear().label;
  const end = new Date(endDate);
  const fy = getIndianFinancialYear(end);
  return fy.label;
}

async function ensureTaxAccount(prisma, firmId, ownId, typeKey) {
  const config = TAX_ACCOUNT_TYPES[typeKey];
  if (!config) throw new Error(`Unknown tax account: ${typeKey}`);

  const parsedFirmId = parseInt(firmId, 10);
  const parsedOwnId = parseInt(ownId, 10) || 1;

  let acc = await prisma.account.findFirst({
    where: {
      acc_firm_id: parsedFirmId,
      acc_is_deleted: false,
      acc_name: { equals: config.acc_name, mode: "insensitive" },
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

async function ensureComplianceAccounts(prisma, firmId, ownId) {
  const ids = {};
  for (const key of Object.keys(TAX_ACCOUNT_TYPES)) {
    ids[key] = await ensureTaxAccount(prisma, firmId, ownId, key);
  }
  return ids;
}

/**
 * Build journal CR lines for a GST-inclusive service fee.
 * When not GST registered, posts full gross to income account.
 */
async function buildGstInclusiveCreditLines({
  prisma,
  firm,
  firmId,
  ownId,
  grossAmount,
  incomeAccId,
  transDate,
  narration,
  isRollback = false,
}) {
  const gross = round2(grossAmount);
  if (!(gross > 0) || !incomeAccId) return [];

  const side = isRollback ? "DR" : "CR";
  const accField = isRollback ? "jrtr_dr_acc_id" : "jrtr_cr_acc_id";
  const amtField = isRollback ? "jrtr_dr_amt" : "jrtr_cr_amt";

  if (!isGstRegistered(firm)) {
    return [
      {
        jrtr_crdr: side,
        jrtr_date: transDate,
        [accField]: incomeAccId,
        [amtField]: gross,
        jrtr_acc_info: narration,
      },
    ];
  }

  const rate = getGstRate(firm);
  const { taxableValue, cgst, sgst, igst, useIgst } = splitGstInclusive(gross, rate);
  const lines = [
    {
      jrtr_crdr: side,
      jrtr_date: transDate,
      [accField]: incomeAccId,
      [amtField]: taxableValue,
      jrtr_acc_info: `${narration} (Taxable value)`,
    },
  ];

  if (useIgst && igst > 0) {
    const igstAccId = await ensureTaxAccount(prisma, firmId, ownId, "IGST");
    lines.push({
      jrtr_crdr: side,
      jrtr_date: transDate,
      [accField]: igstAccId,
      [amtField]: igst,
      jrtr_acc_info: `${narration} (IGST @${rate}%)`,
    });
  } else {
    if (cgst > 0) {
      const cgstAccId = await ensureTaxAccount(prisma, firmId, ownId, "CGST");
      lines.push({
        jrtr_crdr: side,
        jrtr_date: transDate,
        [accField]: cgstAccId,
        [amtField]: cgst,
        jrtr_acc_info: `${narration} (CGST @${rate / 2}%)`,
      });
    }
    if (sgst > 0) {
      const sgstAccId = await ensureTaxAccount(prisma, firmId, ownId, "SGST");
      lines.push({
        jrtr_crdr: side,
        jrtr_date: transDate,
        [accField]: sgstAccId,
        [amtField]: sgst,
        jrtr_acc_info: `${narration} (SGST @${rate / 2}%)`,
      });
    }
  }

  return lines;
}

/**
 * Fine (no GST) + Collect (GST-inclusive split when registered).
 */
async function buildFineCollectCreditLinesWithGst({
  prisma,
  firm,
  firmId,
  ownId,
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
  const fine = round2(finePortion);
  const collect = round2(collectPortion);

  if (fine > 0 && fineAccId) {
    lines.push({
      jrtr_crdr: side,
      jrtr_date: transDate,
      [accField]: fineAccId,
      [amtField]: fine,
      jrtr_acc_info: `${narration} (Fine)`,
    });
  }

  if (collect > 0 && collectAccId) {
    const collectLines = await buildGstInclusiveCreditLines({
      prisma,
      firm,
      firmId,
      ownId,
      grossAmount: collect,
      incomeAccId: collectAccId,
      transDate,
      narration: `${narration} (Collect)`,
      isRollback,
    });
    lines.push(...collectLines);
  }

  return lines;
}

function buildScheduleIIIOtherIncome(revenueRows = []) {
  const otherIncome = (revenueRows || [])
    .filter((row) => {
      const item = String(row.item || "");
      return (
        item.includes("Processing") ||
        item.includes("Collect") ||
        item.includes("Extra") ||
        item.includes("Fine") ||
        item.includes("Interest")
      );
    })
    .map((row) => ({
      particulars: SCHEDULE_III_LABELS[row.item] || row.item,
      amount: round2(row.amount),
      internalKey: row.item,
    }));

  const totalOtherIncome = round2(
    otherIncome.reduce((sum, row) => sum + row.amount, 0)
  );

  return {
    title: "Other Income (Schedule III — by nature)",
    otherIncome,
    totalOtherIncome,
  };
}

function buildComplianceMeta({ firm, startDate, endDate, gstSummary = null }) {
  const fy = fyLabelForRange(startDate, endDate);
  return {
    booksMaintainedUnder: "Income Tax Act, 1961 — Section 44AA (where applicable)",
    financialYear: fy,
    periodStart: startDate,
    periodEnd: endDate,
    gstRegistered: isGstRegistered(firm),
    gstin: firm?.firm_gstin_no || null,
    pan: firm?.firm_pan_no || null,
    gstRatePercent: isGstRegistered(firm) ? getGstRate(firm) : null,
    gstNote: isGstRegistered(firm)
      ? "Taxable service fees are recorded exclusive of GST; CGST/SGST credited to Duties & Taxes. Interest on loans is treated as exempt."
      : "GST not applicable — firm GSTIN not configured.",
    gstSummary,
    scheduleIIIDisclaimer:
      "Schedule III extract for management / CA review. Final ITR and audit formats must be prepared by a qualified professional.",
  };
}

/**
 * Summarise GST payable accounts for the P&L period from trial balance entries.
 */
function summariseGstPayables(trialBalanceMap, accountMap) {
  const keys = ["CGST Payable", "SGST Payable", "IGST Payable"];
  const summary = [];
  let total = 0;

  for (const [accId, entry] of trialBalanceMap.entries()) {
    const accName = entry.acc_name || accountMap.get(Number(accId))?.acc_name || "";
    if (!keys.some((k) => accName.toLowerCase() === k.toLowerCase())) continue;
    const periodMovement = round2(
      (entry.total_cr_amt || 0) - (entry.total_dr_amt || 0)
    );
    if (periodMovement === 0) continue;
    summary.push({ account: accName, amount: periodMovement });
    total += periodMovement;
  }

  return {
    lines: summary,
    totalOutputGst: round2(total),
  };
}

module.exports = {
  DEFAULT_GST_RATE,
  SCHEDULE_III_LABELS,
  GST_TAXABLE_INCOME_KEYS,
  isGstRegistered,
  getGstRate,
  splitGstInclusive,
  getIndianFinancialYear,
  fyLabelForRange,
  ensureTaxAccount,
  ensureComplianceAccounts,
  buildGstInclusiveCreditLines,
  buildFineCollectCreditLinesWithGst,
  buildScheduleIIIOtherIncome,
  buildComplianceMeta,
  summariseGstPayables,
};
