"use strict";

const parseDateInput = (value) => {
  if (value === undefined || value === null || value === "") return null;

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      const error = new Error("Invalid date value.");
      error.statusCode = 400;
      throw error;
    }
    return value;
  }

  const str = String(value).trim();
  const dateOnly = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnly) {
    const year = Number(dateOnly[1]);
    const month = Number(dateOnly[2]) - 1;
    const day = Number(dateOnly[3]);
    const local = new Date(year, month, day, 12, 0, 0, 0);
    if (Number.isNaN(local.getTime())) {
      const error = new Error("Invalid date value.");
      error.statusCode = 400;
      throw error;
    }
    return local;
  }

  const date = new Date(str);
  if (Number.isNaN(date.getTime())) {
    const error = new Error("Invalid date value.");
    error.statusCode = 400;
    throw error;
  }
  return date;
};

const computeExpiryFromPlan = (startDate, plan = {}) => {
  const start = parseDateInput(startDate) || new Date();
  const durationDays = parseInt(plan.plan_duration_days, 10);
  if (!Number.isNaN(durationDays) && durationDays > 0) {
    return new Date(start.getTime() + durationDays * 24 * 60 * 60 * 1000);
  }

  const expiry = new Date(start);
  switch (plan.plan_billing_cycle) {
    case "Monthly":
      expiry.setMonth(expiry.getMonth() + 1);
      break;
    case "Quarterly":
      expiry.setMonth(expiry.getMonth() + 3);
      break;
    case "Lifetime":
      return null;
    case "Yearly":
    default:
      expiry.setFullYear(expiry.getFullYear() + 1);
      break;
  }
  return expiry;
};

const resolveOwnerSubscriptionDates = (body = {}, { existing = {}, plan = null } = {}) => {
  const hasStart = body.own_start_date !== undefined && body.own_start_date !== "";
  const hasExpiry = body.own_expiry_date !== undefined && body.own_expiry_date !== "";

  const own_start_date = hasStart
    ? parseDateInput(body.own_start_date)
    : existing.own_start_date
      ? parseDateInput(existing.own_start_date)
      : parseDateInput(new Date());

  let own_expiry_date = hasExpiry
    ? parseDateInput(body.own_expiry_date)
    : existing.own_expiry_date
      ? parseDateInput(existing.own_expiry_date)
      : null;

  if (!hasExpiry && plan) {
    own_expiry_date = computeExpiryFromPlan(own_start_date, plan);
  }

  if (own_expiry_date && own_start_date && own_expiry_date < own_start_date) {
    const error = new Error("Expiry date cannot be before start date.");
    error.statusCode = 400;
    throw error;
  }

  return { own_start_date, own_expiry_date };
};

module.exports = {
  parseDateInput,
  computeExpiryFromPlan,
  resolveOwnerSubscriptionDates,
};
