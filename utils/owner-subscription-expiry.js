"use strict";

const WARNING_DAYS = 3;

const parseExpiryDate = (value) => {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : new Date(value.getTime());
  }

  const str = String(value).trim();
  const datePrefix = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (datePrefix) {
    const year = Number(datePrefix[1]);
    const month = Number(datePrefix[2]) - 1;
    const day = Number(datePrefix[3]);
    const local = new Date(year, month, day, 12, 0, 0, 0);
    return Number.isNaN(local.getTime()) ? null : local;
  }

  const parsed = new Date(str);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

/** End of the expiry calendar day (local server time). */
const getExpiryEnd = (expiryDate) => {
  const date = parseExpiryDate(expiryDate);
  if (!date) return null;
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
};

const isSubscriptionExpired = (expiryDate, now = new Date()) => {
  const end = getExpiryEnd(expiryDate);
  if (!end) return false;
  return now.getTime() > end.getTime();
};

const getSubscriptionStatus = (expiryDate, now = new Date()) => {
  const end = getExpiryEnd(expiryDate);
  if (!end) {
    return {
      expired: false,
      show_warning: false,
      days_remaining: null,
      hours_remaining: null,
      expiry_date: null,
    };
  }

  const msRemaining = end.getTime() - now.getTime();
  if (msRemaining <= 0) {
    return {
      expired: true,
      show_warning: false,
      days_remaining: 0,
      hours_remaining: 0,
      expiry_date: end.toISOString(),
    };
  }

  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const daysRemaining = Math.floor(msRemaining / MS_PER_DAY);
  const hoursRemaining = Math.floor(msRemaining / (60 * 60 * 1000));

  return {
    expired: false,
    show_warning: msRemaining <= WARNING_DAYS * MS_PER_DAY,
    days_remaining: daysRemaining,
    hours_remaining: hoursRemaining,
    expiry_date: end.toISOString(),
  };
};

const buildSubscriptionPayload = (owner = {}) => ({
  own_start_date: owner.own_start_date || null,
  own_expiry_date: owner.own_expiry_date || null,
  subscription: getSubscriptionStatus(owner.own_expiry_date),
});

const assertSubscriptionActive = (owner = {}) => {
  if (!isSubscriptionExpired(owner.own_expiry_date)) return;

  const error = new Error(
    "Your KhataBoss subscription has expired. Please contact your administrator to renew."
  );
  error.statusCode = 403;
  error.code = "SUBSCRIPTION_EXPIRED";
  throw error;
};

module.exports = {
  WARNING_DAYS,
  getExpiryEnd,
  isSubscriptionExpired,
  getSubscriptionStatus,
  buildSubscriptionPayload,
  assertSubscriptionActive,
};
