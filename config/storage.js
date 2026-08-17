"use strict";

/**
 * Central image storage switch — keep in sync with frontend appConfig.cloudflareAccess.
 * CLOUDFLARE_ACCESS=true  → upload/read/delete via Cloudflare R2 only
 * CLOUDFLARE_ACCESS=false → block image operations (403 Access denied)
 */

function parseBool(value) {
  if (value === true || value === 1) return true;
  const normalized = String(value || "").trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes";
}

const CLOUDFLARE_ACCESS = parseBool(process.env.CLOUDFLARE_ACCESS);

const IMAGE_ACCESS_DENIED =
  "Access denied. Cloudflare image storage is not enabled.";

const R2_NOT_CONFIGURED =
  "Cloudflare R2 credentials are missing. Set R2_* variables in .env.";

function isCloudflareAccessEnabled() {
  return CLOUDFLARE_ACCESS;
}

function assertCloudflareImageAccess() {
  if (!isCloudflareAccessEnabled()) {
    const error = new Error(IMAGE_ACCESS_DENIED);
    error.statusCode = 403;
    throw error;
  }
}

function createImageAccessError(message, statusCode = 403) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

module.exports = {
  CLOUDFLARE_ACCESS,
  IMAGE_ACCESS_DENIED,
  R2_NOT_CONFIGURED,
  isCloudflareAccessEnabled,
  assertCloudflareImageAccess,
  createImageAccessError,
};
