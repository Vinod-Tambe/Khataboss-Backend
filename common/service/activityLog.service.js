"use strict";

const { getTenantPrisma } = require("../../utils/tenantPrisma");
const { formatLoanNo, formatFinNo } = require("../../utils/journalNarration");

const GLOBAL_FIRM_ID = 0;

const MODULE = Object.freeze({
  LOAN: "LOAN",
  FINANCE: "FINANCE",
  ACCOUNT: "ACCOUNT",
  STOCK: "STOCK",
  AUCTION: "AUCTION",
  AUTH: "AUTH",
  USER: "USER",
  STAFF: "STAFF",
  FIRM: "FIRM",
  SETTINGS: "SETTINGS",
  JOURNAL: "JOURNAL",
});

const ACTION = Object.freeze({
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  PAYMENT: "PAYMENT",
  DEPOSIT: "DEPOSIT",
  RELEASE: "RELEASE",
  ADD_PRINCIPAL: "ADD_PRINCIPAL",
  TRANSFER: "TRANSFER",
  ROLLBACK: "ROLLBACK",
  AUCTION: "AUCTION",
  LOGIN: "LOGIN",
  PASSWORD: "PASSWORD",
  PROFILE: "PROFILE",
});

function getActorLoginId(user) {
  if (!user) return "system";
  if (user.staff_login_id && user.own_login_id) {
    return `${user.own_login_id}+${user.staff_login_id}`;
  }
  return user.staff_login_id || user.own_login_id || "system";
}

function formatPersonName(first, middle, last) {
  return [first, middle, last].filter(Boolean).join(" ").trim();
}

function getActorDisplayName(user) {
  if (!user) return "System";
  if (user.staffProfile) {
    const name = formatPersonName(
      user.staffProfile.staff_first_name,
      null,
      user.staffProfile.staff_last_name
    );
    if (name) return name;
  }
  if (user.ownerProfile) {
    const name = formatPersonName(
      user.ownerProfile.own_first_name,
      user.ownerProfile.own_middle_name,
      user.ownerProfile.own_last_name
    );
    if (name) return name;
  }
  if (user.staff_first_name || user.staff_last_name) {
    const name = formatPersonName(user.staff_first_name, null, user.staff_last_name);
    if (name) return name;
  }
  if (user.own_first_name || user.own_last_name) {
    const name = formatPersonName(user.own_first_name, user.own_middle_name, user.own_last_name);
    if (name) return name;
  }
  return getActorLoginId(user);
}

function fmtAmt(value) {
  const num = parseFloat(value);
  if (!Number.isFinite(num)) return "0.00";
  return num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function fmtDate(value) {
  if (!value) return "";
  const raw = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const [y, m, d] = raw.split("-").map(Number);
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return `${String(d).padStart(2, "0")} ${months[m - 1]} ${y}`;
  }
  const dt = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(dt.getTime())) return raw;
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return `${String(dt.getDate()).padStart(2, "0")} ${months[dt.getMonth()]} ${dt.getFullYear()}`;
}

function fmtDateTime(value) {
  if (!value) return "";
  const dt = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(dt.getTime())) return String(value);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(dt);
  const get = (type) => parts.find((p) => p.type === type)?.value || "";
  return `${get("day")} ${get("month").toUpperCase()} ${get("year")} ${get("hour")}:${get("minute")}:${get("second")}`;
}

function appendLoggedAt(description, loggedAt) {
  const text = String(description || "").trim();
  if (!text) return `Logged At: ${fmtDateTime(loggedAt)}.`;
  if (/logged at:/i.test(text)) return text;
  const sep = text.endsWith(".") ? " " : ". ";
  return `${text}${sep}Logged At: ${fmtDateTime(loggedAt)}.`;
}

function baseLine(refNo, amount, transDate, loggedAt) {
  const parts = [];
  if (refNo) parts.push(`Reference: ${refNo}`);
  if (amount != null) parts.push(`Amount: ${fmtAmt(amount)}`);
  if (transDate) parts.push(`Transaction Date: ${fmtDate(transDate)}`);
  if (loggedAt) parts.push(`Logged At: ${fmtDateTime(loggedAt)}`);
  return parts.join(", ");
}

const descriptions = {
  loanCreated(girvi, loggedAt) {
    const ref = formatLoanNo(girvi);
    return `New ${girvi?.girv_type === "unsecured" ? "unsecured" : "secured"} loan created. ${baseLine(ref, girvi?.girv_prin_amt, girvi?.girv_start_date, loggedAt)}`;
  },

  loanUpdated(girvi, loggedAt) {
    const ref = formatLoanNo(girvi);
    return `Loan details updated. ${baseLine(ref, girvi?.girv_prin_amt, girvi?.girv_start_date || girvi?.girv_updated_at, loggedAt)}`;
  },

  loanTransferOut(sourceGirvi, targetGirvi, loggedAt) {
    const sourceRef = formatLoanNo(sourceGirvi);
    const targetRef = formatLoanNo(targetGirvi);
    return `Loan transferred out to ${targetRef || "new loan"}. ${baseLine(sourceRef, sourceGirvi?.girv_prin_amt || targetGirvi?.girv_prin_amt, targetGirvi?.girv_start_date, loggedAt)}`;
  },

  loanTransferIn(targetGirvi, sourceGirvi, loggedAt) {
    const targetRef = formatLoanNo(targetGirvi);
    const sourceRef = formatLoanNo(sourceGirvi);
    return `Loan transferred in from ${sourceRef || "previous loan"}. ${baseLine(targetRef, targetGirvi?.girv_prin_amt, targetGirvi?.girv_start_date, loggedAt)}`;
  },

  loanDeposit(girvi, deposit, loggedAt) {
    const ref = formatLoanNo(girvi);
    const amt = deposit?.dep_payable_amt ?? deposit?.dep_prin_amt;
    return `Deposit received on loan. Principal: ${fmtAmt(deposit?.dep_prin_amt)}, Interest: ${fmtAmt(deposit?.dep_int_amt)}, Total: ${fmtAmt(amt)}. ${baseLine(ref, amt, deposit?.dep_trans_date, loggedAt)}`;
  },

  loanRelease(girvi, release, loggedAt) {
    const ref = formatLoanNo(girvi);
    const amt = release?.rel_payable_amt ?? release?.rel_prin_amt;
    return `Loan released. Principal: ${fmtAmt(release?.rel_prin_amt)}, Interest: ${fmtAmt(release?.rel_int_amt)}, Total: ${fmtAmt(amt)}. ${baseLine(ref, amt, release?.rel_trans_date, loggedAt)}`;
  },

  loanReleaseRevert(girvi, release, loggedAt) {
    const ref = formatLoanNo(girvi);
    const amt = release?.rel_payable_amt ?? release?.rel_prin_amt;
    return `Loan release reverted. ${baseLine(ref, amt, release?.rel_trans_date, loggedAt)}`;
  },

  loanAddPrincipal(girvi, ap, loggedAt) {
    const ref = formatLoanNo(girvi);
    return `Additional principal added. Principal: ${fmtAmt(ap?.ap_prin_amt)}, Payable: ${fmtAmt(ap?.ap_payable_amt)}. ${baseLine(ref, ap?.ap_payable_amt, ap?.ap_trans_date, loggedAt)}`;
  },

  loanDepositRevert(girvi, deposit, loggedAt) {
    const ref = formatLoanNo(girvi);
    const amt = deposit?.dep_payable_amt ?? deposit?.dep_prin_amt;
    return `Deposit reverted on loan. Total: ${fmtAmt(amt)}. ${baseLine(ref, amt, deposit?.dep_trans_date, loggedAt)}`;
  },

  loanAddPrincipalRevert(girvi, ap, loggedAt) {
    const ref = formatLoanNo(girvi);
    return `Additional principal reverted. Principal: ${fmtAmt(ap?.ap_prin_amt)}. ${baseLine(ref, ap?.ap_payable_amt, ap?.ap_trans_date, loggedAt)}`;
  },

  loanDeleted(girvi, loggedAt) {
    const ref = formatLoanNo(girvi);
    return `Loan deleted. ${baseLine(ref, girvi?.girv_prin_amt, girvi?.girv_start_date, loggedAt)}`;
  },

  financeCreated(finance, loggedAt) {
    const ref = formatFinNo(finance);
    return `New finance record created. Principal: ${fmtAmt(finance?.fin_prin_amt)}, ROI: ${finance?.fin_roi}%. ${baseLine(ref, finance?.fin_prin_amt, finance?.fin_start_date, loggedAt)}`;
  },

  financeUpdated(finance, loggedAt) {
    const ref = formatFinNo(finance);
    return `Finance record updated. ${baseLine(ref, finance?.fin_prin_amt, finance?.fin_start_date, loggedAt)}`;
  },

  financeDeleted(finance, loggedAt) {
    const ref = formatFinNo(finance);
    return `Finance record deleted. ${baseLine(ref, finance?.fin_prin_amt, finance?.fin_start_date, loggedAt)}`;
  },

  financePayment(finance, paymentBody, moneyTrans, loggedAt) {
    const ref = formatFinNo(finance);
    const transType = paymentBody?.fm_trans_type || moneyTrans?.fm_trans_type;
    const amount = paymentBody?.fm_trans_amt ?? moneyTrans?.fm_trans_amt;
    const transDate = paymentBody?.fm_trans_date ?? moneyTrans?.fm_trans_date;

    let label = "Finance Payment";
    if (transType === "PAID") label = "EMI Payment";
    else if (transType === "CLOSE") label = "Finance Closed";
    else if (transType === "INTEREST") label = "Interest Payment";
    else if (transType === "FINE") label = "Fine / Collect Payment";
    else if (transType === "ROLLBACK") {
      const rb = String(paymentBody?.fm_rollback_type || "EMI").toUpperCase();
      label = `Rollback — ${rb === "INTEREST" ? "Interest" : rb === "FINE" ? "Fine" : "EMI"}`;
    }

    return `${label} recorded. ${baseLine(ref, amount, transDate, loggedAt)}`;
  },

  accountCreated(account, loggedAt) {
    return appendLoggedAt(
      `Account "${account?.acc_name || ""}" created under ${account?.acc_pre_acc || "primary account"}. Opening balance: ${fmtAmt(account?.acc_cash_balance)}. Opening date: ${fmtDate(account?.acc_opening_date)}.`,
      loggedAt
    );
  },

  accountUpdated(account, loggedAt) {
    return appendLoggedAt(
      `Account "${account?.acc_name || ""}" updated. Balance: ${fmtAmt(account?.acc_cash_balance)}.`,
      loggedAt
    );
  },

  accountDeleted(account, loggedAt) {
    return appendLoggedAt(`Account "${account?.acc_name || ""}" deleted.`, loggedAt);
  },

  stockCreated(stock, loggedAt) {
    return appendLoggedAt(
      `Stock item "${stock?.st_item_name || ""}" added. Quantity: ${stock?.st_quantity || 0}, Valuation: ${fmtAmt(stock?.st_valuation)}.`,
      loggedAt
    );
  },

  auctionCreated(girvi, auction, loggedAt) {
    const ref = formatLoanNo(girvi);
    const amt = auction?.auc_payable_amt ?? auction?.auc_prin_amt;
    const transDate = auction?.auc_trans_date ?? auction?.al_date;
    return `Auction settlement recorded. ${baseLine(ref, amt, transDate, loggedAt)}`;
  },

  authLogin(loginUser, roleLabel, systemInfo, loggedAt) {
    const ip = systemInfo?.ip ? `IP: ${systemInfo.ip}` : "";
    const agent = systemInfo?.agent ? `Device: ${String(systemInfo.agent).slice(0, 80)}` : "";
    const extra = [ip, agent].filter(Boolean).join(", ");
    return appendLoggedAt(
      `${roleLabel} "${loginUser}" logged in successfully${extra ? `. ${extra}` : ""}.`,
      loggedAt
    );
  },

  authPasswordChanged(loginUser, loggedAt) {
    return appendLoggedAt(`Password changed for user "${loginUser}".`, loggedAt);
  },

  authProfileUpdated(loginUser, loggedAt) {
    return appendLoggedAt(`Profile updated for user "${loginUser}".`, loggedAt);
  },

  customerCreated(user, loggedAt) {
    const name = `${user?.user_first_name || ""} ${user?.user_last_name || ""}`.trim();
    return appendLoggedAt(
      `Customer "${name || user?.user_unique_code || ""}" added. Mobile: ${user?.user_mobile_no || "—"}.`,
      loggedAt
    );
  },

  customerUpdated(user, loggedAt) {
    const name = `${user?.user_first_name || ""} ${user?.user_last_name || ""}`.trim();
    return appendLoggedAt(`Customer "${name || user?.user_unique_code || ""}" updated.`, loggedAt);
  },

  customerDeleted(user, loggedAt) {
    const name = `${user?.user_first_name || ""} ${user?.user_last_name || ""}`.trim();
    return appendLoggedAt(`Customer "${name || user?.user_unique_code || ""}" deleted.`, loggedAt);
  },

  staffCreated(staff, fullLogin, loggedAt) {
    const name = `${staff?.staff_first_name || ""} ${staff?.staff_last_name || ""}`.trim();
    return appendLoggedAt(
      `Staff "${name}" created. Login: ${fullLogin || staff?.staff_login_id || "—"}.`,
      loggedAt
    );
  },

  staffUpdated(staff, fullLogin, loggedAt) {
    const name = `${staff?.staff_first_name || ""} ${staff?.staff_last_name || ""}`.trim();
    return appendLoggedAt(
      `Staff "${name}" updated. Login: ${fullLogin || staff?.staff_login_id || "—"}.`,
      loggedAt
    );
  },

  staffDeleted(staff, fullLogin, loggedAt) {
    const name = `${staff?.staff_first_name || ""} ${staff?.staff_last_name || ""}`.trim();
    return appendLoggedAt(
      `Staff "${name}" deleted. Login: ${fullLogin || staff?.staff_login_id || "—"}.`,
      loggedAt
    );
  },

  staffPasswordChanged(targetLogin, actorLogin, loggedAt) {
    return appendLoggedAt(
      `Staff password reset for "${targetLogin}" by "${actorLogin}".`,
      loggedAt
    );
  },

  firmCreated(firm, loggedAt) {
    return appendLoggedAt(
      `Firm "${firm?.firm_name || ""}" created. Firm ID: ${firm?.firm_unique_id || firm?.firm_id || "—"}.`,
      loggedAt
    );
  },

  firmUpdated(firm, loggedAt) {
    return appendLoggedAt(`Firm "${firm?.firm_name || ""}" updated.`, loggedAt);
  },

  firmDeleted(firm, loggedAt) {
    return appendLoggedAt(`Firm "${firm?.firm_name || ""}" deleted.`, loggedAt);
  },

  rateSaved(rate, loggedAt) {
    return appendLoggedAt(
      `${rate?.rate_metal || "Metal"} rate saved: ${fmtAmt(rate?.rate_amount)} (${rate?.rate_unit || "per unit"}).`,
      loggedAt
    );
  },

  rateDeleted(rate, loggedAt) {
    return appendLoggedAt(
      `${rate?.rate_metal || "Metal"} rate deleted: ${fmtAmt(rate?.rate_amount)}.`,
      loggedAt
    );
  },

  puritySaved(purity, loggedAt) {
    return appendLoggedAt(
      `Purity "${purity?.purity_name || ""}" (${purity?.purity_metal || ""}) saved: ${purity?.purity_value || 0}.`,
      loggedAt
    );
  },

  purityDeleted(purity, loggedAt) {
    return appendLoggedAt(`Purity "${purity?.purity_name || ""}" deleted.`, loggedAt);
  },

  journalCreated(body, jrnlId, loggedAt) {
    return appendLoggedAt(
      `Manual journal entry #${jrnlId || "—"} created. Panel: ${body?.jrnl_panel || "General"}.`,
      loggedAt
    );
  },

  journalDeleted(jrnlId, loggedAt) {
    return appendLoggedAt(`Journal entry #${jrnlId || "—"} deleted.`, loggedAt);
  },
};

function writeActivityLog(dbUrl, payload) {
  const loggedAt = payload.loggedAt instanceof Date ? payload.loggedAt : new Date();
  setImmediate(async () => {
    try {
      const prisma = getTenantPrisma(dbUrl);
      await prisma.activityLog.create({
        data: {
          al_own_id: payload.ownId,
          al_firm_id: payload.firmId,
          al_module: payload.module,
          al_action: payload.action,
          al_subject: payload.subject,
          al_description: payload.description,
          al_entity_type: payload.entityType || null,
          al_entity_id:
            payload.entityId != null ? parseInt(payload.entityId, 10) : null,
          al_ref_no: payload.refNo || null,
          al_amount:
            payload.amount != null && payload.amount !== ""
              ? String(payload.amount)
              : null,
          al_login_id: payload.loginId,
          al_meta: {
            ...(payload.meta || {}),
            logged_at: loggedAt.toISOString(),
            trans_date: payload.transDate || null,
            login_name: payload.loginName || null,
          },
          al_created_at: loggedAt,
        },
      });
    } catch (err) {
      console.error("Activity log write failed:", err.message);
    }
  });
}

function logSystemActivity(dbUrl, opts) {
  if (!dbUrl || opts?.ownId == null) return;
  const loggedAt = opts.loggedAt instanceof Date ? opts.loggedAt : new Date();
  let description = opts.description;
  if (typeof description === "function") {
    description = description(loggedAt);
  } else if (description && !/logged at:/i.test(description)) {
    description = appendLoggedAt(description, loggedAt);
  }

  writeActivityLog(dbUrl, {
    ownId: opts.ownId,
    firmId: opts.firmId != null ? parseInt(opts.firmId, 10) : GLOBAL_FIRM_ID,
    module: opts.module,
    action: opts.action,
    subject: opts.subject,
    description,
    entityType: opts.entityType,
    entityId: opts.entityId,
    refNo: opts.refNo,
    amount: opts.amount,
    loginId: opts.loginId || "system",
    loginName: opts.loginName || opts.loginId || "System",
    meta: opts.meta,
    transDate: opts.transDate || null,
    loggedAt,
  });
}

function logActivity(dbUrl, user, opts) {
  if (opts?.firmId == null || opts?.firmId === "") return;
  const loggedAt = opts.loggedAt instanceof Date ? opts.loggedAt : new Date();
  let description = opts.description;
  if (typeof description === "function") {
    description = description(loggedAt);
  } else if (description && !/logged at:/i.test(description)) {
    description = appendLoggedAt(description, loggedAt);
  }

  writeActivityLog(dbUrl, {
    ownId: user.own_id,
    firmId: parseInt(opts.firmId, 10),
    module: opts.module,
    action: opts.action,
    subject: opts.subject,
    description,
    entityType: opts.entityType,
    entityId: opts.entityId,
    refNo: opts.refNo,
    amount: opts.amount,
    loginId: getActorLoginId(user),
    loginName: opts.loginName || getActorDisplayName(user),
    meta: opts.meta,
    transDate: opts.transDate || null,
    loggedAt,
  });
}

/** Build description with captured timestamp — use in controllers. */
function describe(builder, ...args) {
  const loggedAt = new Date();
  return { description: builder(...args, loggedAt), loggedAt };
}

function mapLogRow(log, firmName = null, loginUserOverride = null) {
  const createdAt = log.al_created_at ? new Date(log.al_created_at) : null;
  const meta =
    log.al_meta && typeof log.al_meta === "object" && !Array.isArray(log.al_meta)
      ? log.al_meta
      : {};
  const loginUser = loginUserOverride ?? meta.login_name ?? log.al_login_id ?? "System";
  const istDate = createdAt
    ? new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(createdAt)
    : "";

  return {
    id: log.al_id,
    sno: log.al_id,
    log_date: istDate,
    date: fmtDateTime(log.al_created_at),
    time: createdAt
      ? fmtDateTime(log.al_created_at).split(" ").slice(-1)[0]
      : "",
    login_id: log.al_login_id,
    login_user: loginUser,
    firm_name: firmName || "",
    subject: log.al_subject,
    description: log.al_description,
    module: log.al_module,
    action: log.al_action,
    entity_type: log.al_entity_type,
    entity_id: log.al_entity_id,
    ref_no: log.al_ref_no,
    amount: log.al_amount != null ? parseFloat(log.al_amount) : null,
  };
}

async function listActivityLogs(dbUrl, filters) {
  const prisma = getTenantPrisma(dbUrl);
  const isAllFirms = !filters.firmId || String(filters.firmId).toLowerCase() === "all";
  const firmId = !isAllFirms ? parseInt(filters.firmId, 10) : null;

  if (!isAllFirms && !firmId) {
    throw new Error("Invalid firm ID.");
  }

  const where = {};

  if (filters.entityType && filters.entityId) {
    where.al_entity_type = String(filters.entityType);
    where.al_entity_id = parseInt(filters.entityId, 10);
    if (!isAllFirms) {
      where.al_firm_id = firmId;
    }
  } else if (!isAllFirms) {
    where.OR = [{ al_firm_id: firmId }, { al_firm_id: GLOBAL_FIRM_ID }];
  }

  if (filters.module) {
    where.al_module = String(filters.module).toUpperCase();
  }
  if (filters.startDate || filters.endDate) {
    where.al_created_at = {};
    if (filters.startDate) {
      where.al_created_at.gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      where.al_created_at.lte = end;
    }
  }

  if (filters.loginId) {
    where.al_login_id = String(filters.loginId);
  }

  const limit = Math.min(Math.max(parseInt(filters.limit, 10) || 200, 1), 500);
  const page = Math.max(parseInt(filters.page, 10) || 1, 1);
  const skip = (page - 1) * limit;

  const [rows, total] = await prisma.$transaction([
    prisma.activityLog.findMany({
      where,
      orderBy: { al_created_at: "desc" },
      take: limit,
      skip,
    }),
    prisma.activityLog.count({ where }),
  ]);

  let firmMap = {};
  if (isAllFirms && rows.length) {
    const firmIds = [...new Set(rows.map((r) => r.al_firm_id).filter((id) => id > 0))];
    if (firmIds.length) {
      const firms = await prisma.firm.findMany({
        where: { firm_id: { in: firmIds } },
        select: { firm_id: true, firm_name: true },
      });
      firmMap = Object.fromEntries(firms.map((f) => [f.firm_id, f.firm_name]));
    }
  }

  const resolveFirmName = (log) => {
    if (log.al_firm_id === GLOBAL_FIRM_ID) return "All Firms";
    if (isAllFirms) return firmMap[log.al_firm_id] || `Firm #${log.al_firm_id}`;
    return firmMap[log.al_firm_id] || null;
  };

  const staffLoginIds = [
    ...new Set(
      rows
        .filter((r) => {
          const meta = r.al_meta && typeof r.al_meta === "object" ? r.al_meta : {};
          return !meta.login_name && String(r.al_login_id || "").includes("+");
        })
        .map((r) => String(r.al_login_id).split("+").pop())
        .filter(Boolean)
    ),
  ];

  let staffNameMap = {};
  if (staffLoginIds.length) {
    const staffRows = await prisma.staff.findMany({
      where: { staff_login_id: { in: staffLoginIds }, staff_is_deleted: false },
      select: { staff_login_id: true, staff_first_name: true, staff_last_name: true },
    });
    staffNameMap = Object.fromEntries(
      staffRows.map((s) => [
        s.staff_login_id,
        `${s.staff_first_name || ""} ${s.staff_last_name || ""}`.trim() || s.staff_login_id,
      ])
    );
  }

  const resolveLoginUser = (log) => {
    const meta = log.al_meta && typeof log.al_meta === "object" ? log.al_meta : {};
    if (meta.login_name) return meta.login_name;
    const loginId = log.al_login_id || "";
    if (loginId.includes("+")) {
      const staffPart = loginId.split("+").pop();
      if (staffNameMap[staffPart]) return staffNameMap[staffPart];
    }
    return loginId || "System";
  };

  return {
    rows: rows.map((log) => mapLogRow(log, resolveFirmName(log), resolveLoginUser(log))),
    total,
    page,
    limit,
    allFirms: isAllFirms,
  };
}

module.exports = {
  GLOBAL_FIRM_ID,
  MODULE,
  ACTION,
  descriptions,
  describe,
  getActorLoginId,
  getActorDisplayName,
  logActivity,
  logSystemActivity,
  listActivityLogs,
  mapLogRow,
  fmtDateTime,
};
