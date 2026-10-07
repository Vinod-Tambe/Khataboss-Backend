"use strict";

/** Max rows returned per entity type in header global search. */
const GLOBAL_USER_TAKE_MAX = 20;
const GLOBAL_LOAN_TAKE = 8;
const GLOBAL_FINANCE_TAKE = 8;

/**
 * Build user OR conditions for autocomplete (same rules as legacy searchUsers).
 * @param {string} search trimmed query
 * @returns {object[]}
 */
function buildUserSearchOrConditions(search) {
  const digitsOnly = search.replace(/\D/g, "");

  const or = [
    { user_unique_code: { equals: search, mode: "insensitive" } },
    { user_unique_code: { contains: search, mode: "insensitive" } },
    { user_mobile_no: { contains: search, mode: "insensitive" } },
    { user_phone_no: { contains: search, mode: "insensitive" } },
    { user_whatsapp_no: { contains: search, mode: "insensitive" } },
    { user_email_id: { contains: search, mode: "insensitive" } },
    { user_first_name: { contains: search, mode: "insensitive" } },
    { user_last_name: { contains: search, mode: "insensitive" } },
    { user_father_name: { contains: search, mode: "insensitive" } },
    { user_curr_address: { contains: search, mode: "insensitive" } },
    { user_per_address: { contains: search, mode: "insensitive" } },
    { user_city: { contains: search, mode: "insensitive" } },
    { user_state: { contains: search, mode: "insensitive" } },
    { user_country: { contains: search, mode: "insensitive" } },
    { user_pincode: { contains: search, mode: "insensitive" } },
  ];

  if (digitsOnly.length >= 3 && digitsOnly !== search) {
    or.unshift({ user_mobile_no: { contains: digitsOnly } });
    or.unshift({ user_phone_no: { contains: digitsOnly } });
    or.unshift({ user_whatsapp_no: { contains: digitsOnly } });
  }

  if (/^\d+$/.test(search)) {
    const id = parseInt(search, 10);
    if (!Number.isNaN(id) && id <= 2147483647) {
      or.unshift({ user_id: id });
    }
  }

  return or;
}

function buildUserSearchWhere(firmId, search) {
  const where = {
    user_is_deleted: false,
    OR: buildUserSearchOrConditions(search),
  };

  if (firmId && firmId !== "all" && firmId !== "undefined") {
    where.user_firm_id = parseInt(firmId, 10);
  }

  return where;
}

function parseFirmIdInt(firmId) {
  if (!firmId || firmId === "all" || firmId === "undefined") return null;
  const firmIdInt = parseInt(firmId, 10);
  return Number.isNaN(firmIdInt) ? null : firmIdInt;
}

function buildGlobalLoanOrConditions(search) {
  const loanOr = [
    { girv_unique_code: { equals: search, mode: "insensitive" } },
    { girv_loan_no: { equals: search, mode: "insensitive" } },
  ];

  if (/^\d+$/.test(search)) {
    const numericId = parseInt(search, 10);
    if (!Number.isNaN(numericId) && numericId <= 2147483647) {
      loanOr.unshift({ girv_id: numericId });
    }
  }

  if (search.length >= 2) {
    loanOr.push(
      { girv_unique_code: { contains: search, mode: "insensitive" } },
      { girv_loan_no: { contains: search, mode: "insensitive" } }
    );
  }

  return loanOr;
}

function buildGlobalFinanceOrConditions(search) {
  const financeOr = [{ fin_unique_code: { equals: search, mode: "insensitive" } }];

  if (/^\d+$/.test(search)) {
    const numericId = parseInt(search, 10);
    if (!Number.isNaN(numericId) && numericId <= 2147483647) {
      financeOr.unshift({ fin_id: numericId });
    }
  }

  if (search.length >= 2) {
    financeOr.push({ fin_unique_code: { contains: search, mode: "insensitive" } });
  }

  return financeOr;
}

function clampUserTake(limit) {
  return Math.min(Math.max(parseInt(limit, 10) || 12, 1), GLOBAL_USER_TAKE_MAX);
}

module.exports = {
  GLOBAL_USER_TAKE_MAX,
  GLOBAL_LOAN_TAKE,
  GLOBAL_FINANCE_TAKE,
  buildUserSearchOrConditions,
  buildUserSearchWhere,
  parseFirmIdInt,
  buildGlobalLoanOrConditions,
  buildGlobalFinanceOrConditions,
  clampUserTake,
};
