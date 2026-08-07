"use strict";

const PASSWORD_MIN_LENGTH = 10;
const PASSWORD_MAX_LENGTH = 24;

const COMMON_PASSWORDS = [
  "password",
  "password1",
  "password123",
  "1234567890",
  "123456789",
  "qwertyuiop",
  "qwerty123",
  "abcdefghij",
  "admin12345",
  "welcome123",
  "letmein123",
  "iloveyou12",
  "changeme12",
  "passw0rd12",
];

const SEQUENCES = [
  "0123456789",
  "9876543210",
  "abcdefghijklmnopqrstuvwxyz",
  "zyxwvutsrqponmlkjihgfedcba",
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm",
];

const normalizeToken = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const hasPredictableSequence = (value) => {
  const lower = String(value || "").toLowerCase();
  return SEQUENCES.some((seq) => {
    for (let i = 0; i <= seq.length - 4; i += 1) {
      if (lower.includes(seq.slice(i, i + 4))) return true;
    }
    return false;
  });
};

const containsPersonalInfo = (password, owner = {}) => {
  const lowerPwd = String(password || "").toLowerCase();
  const tokens = [
    owner.own_first_name,
    owner.own_last_name,
    owner.own_middle_name,
    owner.own_login_id,
    owner.own_email ? String(owner.own_email).split("@")[0] : "",
    owner.own_mobile_no,
  ]
    .map(normalizeToken)
    .filter((t) => t && t.length >= 3);

  return tokens.some((token) => lowerPwd.includes(token));
};

/**
 * Validate strong password policy.
 * @returns {{ ok: boolean, message?: string }}
 */
const validateStrongPassword = (password, options = {}) => {
  const value = String(password || "");
  const { oldPassword = "", owner = {} } = options;

  if (!value) {
    return { ok: false, message: "New password is required." };
  }
  if (value.length < PASSWORD_MIN_LENGTH || value.length > PASSWORD_MAX_LENGTH) {
    return {
      ok: false,
      message: `Password must be ${PASSWORD_MIN_LENGTH}–${PASSWORD_MAX_LENGTH} characters.`,
    };
  }
  if (!/[A-Z]/.test(value)) {
    return { ok: false, message: "Password must include at least one uppercase letter (A–Z)." };
  }
  if (!/[a-z]/.test(value)) {
    return { ok: false, message: "Password must include at least one lowercase letter (a–z)." };
  }
  if (!/[0-9]/.test(value)) {
    return { ok: false, message: "Password must include at least one number (0–9)." };
  }
  if (!/[!@#$%^&*\-_+=?]/.test(value)) {
    return {
      ok: false,
      message: "Password must include at least one special character (!@#$%^&*-_+=?).",
    };
  }
  if (/(.)\1{2,}/.test(value)) {
    return { ok: false, message: "Password must not contain repeated characters (e.g. aaa, 111)." };
  }
  if (hasPredictableSequence(value)) {
    return {
      ok: false,
      message: "Password must not contain predictable patterns (e.g. 1234, qwerty).",
    };
  }

  const lower = value.toLowerCase();
  if (COMMON_PASSWORDS.some((item) => lower.includes(item) || lower === item)) {
    return { ok: false, message: "Password is too common. Please choose a stronger password." };
  }
  if (containsPersonalInfo(value, owner)) {
    return {
      ok: false,
      message: "Password must not contain personal information (name, email, mobile).",
    };
  }
  if (oldPassword && value === oldPassword) {
    return { ok: false, message: "New password must be different from old password." };
  }

  return { ok: true };
};

module.exports = {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  validateStrongPassword,
};
