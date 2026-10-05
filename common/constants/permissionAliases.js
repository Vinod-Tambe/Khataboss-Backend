"use strict";

/** Legacy keys that still grant newer module permissions (staff rows / old assignments). */
const PERMISSION_ALIASES = {
  "expense.view": ["account.view", "account.transfer"],
  "expense.create": ["account.transfer"],
  "stock.view": ["loan.view"],
};

const expandPermissionKey = (permissionKey) => {
  const aliases = PERMISSION_ALIASES[permissionKey] || [];
  return [permissionKey, ...aliases];
};

module.exports = {
  PERMISSION_ALIASES,
  expandPermissionKey,
};
