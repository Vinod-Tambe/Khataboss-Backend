"use strict";

const {
  hasPermission,
  hasAnyPermission,
} = require("../common/service/permission.helper");

/**
 * Require permission key(s). Owners and staff are checked against req.user.permissions.
 * @param {string|string[]} required
 * @param {{ mode?: "all"|"any" }} options - default "all"
 */
const requirePermission = (required, options = {}) => {
  const requiredKeys = Array.isArray(required) ? required : [required];
  const mode = options.mode === "any" ? "any" : "all";

  return (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const ok =
      mode === "any"
        ? hasAnyPermission(user, requiredKeys)
        : requiredKeys.every((key) => hasPermission(user, key));

    if (!ok) {
      const message = "You do not have permission to perform this action.";
      return res.status(403).json({
        success: false,
        message,
        error: message,
        required: requiredKeys,
        mode,
      });
    }

    return next();
  };
};

module.exports = requirePermission;
