"use strict";

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;
const PASSWORD_SPECIAL_CHARS = "$!@%&";

const hasEdgeWhitespace = (value) => {
  if (!value) return false;
  return value !== String(value).trim();
};

/**
 * Validate password policy for owner and staff.
 * @returns {{ ok: boolean, message?: string }}
 */
const validateStrongPassword = (password, options = {}) => {
  const value = String(password || "");
  const { oldPassword = "" } = options;

  if (!value) {
    return { ok: false, message: "Password is required." };
  }

  if (hasEdgeWhitespace(value)) {
    return {
      ok: false,
      message: "Password must not have leading or trailing whitespace.",
    };
  }

  if (value.length < PASSWORD_MIN_LENGTH || value.length > PASSWORD_MAX_LENGTH) {
    return {
      ok: false,
      message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
    };
  }

  if (!/\d/.test(value)) {
    return { ok: false, message: "Password must include at least one number (0–9)." };
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(value)) {
    return {
      ok: false,
      message: `Password must include at least one special character (e.g. ${PASSWORD_SPECIAL_CHARS}).`,
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
  PASSWORD_SPECIAL_CHARS,
  validateStrongPassword,
};
