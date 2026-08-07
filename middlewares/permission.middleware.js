"use strict";

const {
  hasPermission,
  hasAnyPermission,
  isOwner,
} = require("../common/service/permission.helper");

/**
 * Require permission key(s). Owners always pass.
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

    if (isOwner(user)) {
      return next();
    }

    const ok =
      mode === "any"
        ? hasAnyPermission(user, requiredKeys)
        : requiredKeys.every((key) => hasPermission(user, key));

    if (!ok) {
      return res.status(403).json({
        error: "You do not have permission to perform this action.",
        required: requiredKeys,
        mode,
      });
    }

    return next();
  };
};

module.exports = requirePermission;
