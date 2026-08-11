"use strict";

/** User-facing loan code (never raw girv_id in narrations). */
function formatLoanNo(girvi) {
  if (girvi == null) return null;
  if (typeof girvi === "string" || typeof girvi === "number") return String(girvi);
  return (
    girvi.girv_unique_code ||
    girvi.girv_loan_no ||
    (girvi.girv_id != null ? `LN-${girvi.girv_id}` : null)
  );
}

/** User-facing finance code (never raw fin_id in narrations). */
function formatFinNo(finance) {
  if (finance == null) return null;
  if (typeof finance === "string" || typeof finance === "number") return String(finance);
  return (
    finance.fin_unique_code ||
    (finance.fin_id != null ? `FIN-${finance.fin_id}` : null)
  );
}

function loanRef(girvi) {
  const code = formatLoanNo(girvi);
  return code ? `Loan No - ${code}` : "";
}

function finRef(finance) {
  const code = formatFinNo(finance);
  return code ? `Fin No - ${code}` : "";
}

function addLoanVoucher(girvi) {
  return `Add New Loan | ${loanRef(girvi)}`;
}

function firstMonthInterestVoucher(girvi) {
  return `First Month Interest | ${loanRef(girvi)}`;
}

function depositVoucher(girvi, transDate) {
  const datePart = transDate ? ` | Date - ${transDate}` : "";
  return `Deposit Received | ${loanRef(girvi)}${datePart}`;
}

function releaseVoucher(girvi, transDate) {
  const datePart = transDate ? ` | Date - ${transDate}` : "";
  return `Loan Released | ${loanRef(girvi)}${datePart}`;
}

function addPrincipalVoucher(girvi, transDate) {
  const datePart = transDate ? ` | Date - ${transDate}` : "";
  return `Additional Principal | ${loanRef(girvi)}${datePart}`;
}

function addFinanceVoucher(finance) {
  return `Add New Finance | ${finRef(finance)}`;
}

function financeCollectionVoucher(finance, label, transDate) {
  const datePart = transDate ? ` | Date - ${transDate}` : "";
  return `${label} | ${finRef(finance)}${datePart}`;
}

function transferOutVoucher(sourceGirvi, targetGirvi) {
  return `Transfer Loan OUT | ${loanRef(sourceGirvi)} | New Loan - ${formatLoanNo(targetGirvi)}`;
}

function transferInVoucher(targetGirvi, sourceGirvi) {
  return `Transfer Loan IN | ${loanRef(targetGirvi)} | From Loan - ${formatLoanNo(sourceGirvi)}`;
}

function auctionVoucher(girvi, transDate) {
  const datePart = transDate ? ` | Date - ${transDate}` : "";
  return `Auction Payment | ${loanRef(girvi)}${datePart}`;
}

function loanLine(prefix, girvi) {
  return `${prefix} : ${loanRef(girvi)}`;
}

function finLine(prefix, finance) {
  return `${prefix} : ${finRef(finance)}`;
}

/** Patterns for resolving legacy numeric IDs in stored narrations. */
const GIRVI_ID_REGEXES = [
  /Girvi No\s*-\s*(\d+)/gi,
  /Loan No\s*-\s*(\d+)(?!\w)/gi,
  /From Loan\s*-\s*(\d+)/gi,
  /New Loan\s*-\s*(\d+)/gi,
];

const FIN_ID_REGEXES = [/Fin No\s*-\s*(\d+)/gi];

const INTERNAL_ID_SUFFIX_REGEXES = [
  /\s*\|\s*Dep No\s*-\s*\d+/gi,
  /\s*\|\s*Release No\s*-\s*\d+/gi,
  /\s*\|\s*Add No\s*-\s*\d+/gi,
  /\s*\|\s*Money Trans\s*-\s*\d+/gi,
  /\s*\|\s*Auc No\s*-\s*\d+/gi,
];

function collectReferenceIds(texts = []) {
  const girviIds = new Set();
  const finIds = new Set();

  for (const text of texts) {
    if (!text) continue;
    for (const re of GIRVI_ID_REGEXES) {
      re.lastIndex = 0;
      let match;
      while ((match = re.exec(text)) !== null) {
        girviIds.add(parseInt(match[1], 10));
      }
    }
    for (const re of FIN_ID_REGEXES) {
      re.lastIndex = 0;
      let match;
      while ((match = re.exec(text)) !== null) {
        finIds.add(parseInt(match[1], 10));
      }
    }
  }

  return { girviIds: [...girviIds], finIds: [...finIds] };
}

async function loadReferenceMaps(prisma, girviIds = [], finIds = []) {
  const girviById = new Map();
  const financeById = new Map();

  if (girviIds.length) {
    const rows = await prisma.girvi.findMany({
      where: { girv_id: { in: girviIds } },
      select: { girv_id: true, girv_unique_code: true, girv_loan_no: true },
    });
    rows.forEach((row) => girviById.set(row.girv_id, row));
  }

  if (finIds.length) {
    const rows = await prisma.finance.findMany({
      where: { fin_id: { in: finIds } },
      select: { fin_id: true, fin_unique_code: true },
    });
    rows.forEach((row) => financeById.set(row.fin_id, row));
  }

  return { girviById, financeById };
}

/** Convert stored narration text to user-friendly loan/fin codes (for old + new rows). */
function humanizeJournalNarration(
  text,
  { girviById = new Map(), financeById = new Map() } = {}
) {
  if (!text) return "";

  let result = String(text);

  result = result.replace(/Girvi No\s*-\s*(\d+)/gi, (_, id) => {
    const girvi = girviById.get(parseInt(id, 10));
    return `Loan No - ${formatLoanNo(girvi) || id}`;
  });

  result = result.replace(/Loan No\s*-\s*(\d+)(?!\w)/gi, (_, id) => {
    const girvi = girviById.get(parseInt(id, 10));
    return `Loan No - ${formatLoanNo(girvi) || id}`;
  });

  result = result.replace(/From Loan\s*-\s*(\d+)/gi, (_, id) => {
    const girvi = girviById.get(parseInt(id, 10));
    return `From Loan - ${formatLoanNo(girvi) || id}`;
  });

  result = result.replace(/New Loan\s*-\s*(\d+)/gi, (_, id) => {
    const girvi = girviById.get(parseInt(id, 10));
    return `New Loan - ${formatLoanNo(girvi) || id}`;
  });

  result = result.replace(/Fin No\s*-\s*(\d+)/gi, (_, id) => {
    const finance = financeById.get(parseInt(id, 10));
    return `Fin No - ${formatFinNo(finance) || id}`;
  });

  for (const re of INTERNAL_ID_SUFFIX_REGEXES) {
    result = result.replace(re, "");
  }

  result = result.replace(/Add New Girvi/gi, "Add New Loan");

  return result.replace(/\s{2,}/g, " ").trim();
}

/** Delete markers for loan journals (new + legacy formats). */
function loanJournalDeletePatterns(girvi, kinds = []) {
  const patterns = new Set();
  const loanNo = formatLoanNo(girvi);
  const id = girvi?.girv_id;

  if (kinds.includes("add")) {
    patterns.add(`Add New Loan | Loan No - ${loanNo}`);
    if (id != null) {
      patterns.add(`Add New Girvi | Girvi No - ${id}`);
      patterns.add(`Add New Girvi | Loan No - ${loanNo}`);
    }
  }

  if (kinds.includes("firstMonth")) {
    patterns.add(`First Month Interest | Loan No - ${loanNo}`);
    if (id != null) {
      patterns.add(`First Month Interest | Girvi No - ${id}`);
    }
  }

  if (kinds.includes("transferOut") && id != null) {
    patterns.add(`Transfer Loan OUT | Loan No - ${id}`);
    patterns.add(`Transfer Loan OUT | Loan No - ${loanNo}`);
  }

  if (kinds.includes("transferIn") && id != null) {
    patterns.add(`Transfer Loan IN | Loan No - ${id}`);
    patterns.add(`Transfer Loan IN | Loan No - ${loanNo}`);
  }

  return [...patterns];
}

function financeJournalDeletePatterns(finance) {
  const patterns = new Set();
  const finNo = formatFinNo(finance);
  const id = finance?.fin_id;

  patterns.add(`Add New Finance | Fin No - ${finNo}`);
  if (id != null) {
    patterns.add(`Add New Finance | Fin No - ${id}`);
  }

  return [...patterns];
}

module.exports = {
  formatLoanNo,
  formatFinNo,
  loanRef,
  finRef,
  addLoanVoucher,
  firstMonthInterestVoucher,
  depositVoucher,
  releaseVoucher,
  addPrincipalVoucher,
  addFinanceVoucher,
  financeCollectionVoucher,
  transferOutVoucher,
  transferInVoucher,
  auctionVoucher,
  loanLine,
  finLine,
  collectReferenceIds,
  loadReferenceMaps,
  humanizeJournalNarration,
  loanJournalDeletePatterns,
  financeJournalDeletePatterns,
};
