"use strict";

const SESSION_SUPERSEDED_CODE = "SESSION_SUPERSEDED";

const SESSION_SUPERSEDED_MESSAGE =
  "This login ID signed in on another device or browser. Please log in again.";

function isActiveAccessToken(storedToken, bearerToken) {
  if (!storedToken || !bearerToken) return false;
  return String(storedToken) === String(bearerToken);
}

function respondSessionSuperseded(res) {
  return res.status(401).json({
    success: false,
    code: SESSION_SUPERSEDED_CODE,
    error: "Session superseded.",
    message: SESSION_SUPERSEDED_MESSAGE,
  });
}

module.exports = {
  SESSION_SUPERSEDED_CODE,
  SESSION_SUPERSEDED_MESSAGE,
  isActiveAccessToken,
  respondSessionSuperseded,
};
