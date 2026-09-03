"use strict";

const {
  getAllPermissionKeys,
  keysToPermissionMatrix,
  emptyPermissionMatrix,
} = require("../../prisma/seeder/permission-seeder");

const ROLE_OWNER = "OWNER";
const ROLE_STAFF = "STAFF";
const ROLE_SUPER_ADMIN = "SUPER_ADMIN";

const isOwner = (user) => user?.role === ROLE_OWNER;

const hasPermission = (user, permissionKey) => {
  if (!user) return false;
  if (isOwner(user)) return true;
  if (!permissionKey) return false;
  const perms = user.permissions || [];
  return perms.includes(permissionKey);
};

const hasAnyPermission = (user, permissionKeys = []) => {
  if (isOwner(user)) return true;
  return permissionKeys.some((key) => hasPermission(user, key));
};

const resolveUserPermissions = (user) => {
  if (isOwner(user)) return getAllPermissionKeys();
  return Array.isArray(user?.permissions) ? user.permissions : [];
};

const buildPermissionPayload = (user) => {
  const keys = resolveUserPermissions(user);
  const matrix = {
    ...emptyPermissionMatrix(),
    ...keysToPermissionMatrix(keys),
  };
  // ensure granted keys are true even if empty matrix already had false
  for (const key of keys) {
    const [module, action] = key.split(".");
    if (!matrix[module]) matrix[module] = {};
    matrix[module][action] = true;
  }
  return { keys, matrix };
};

module.exports = {
  ROLE_OWNER,
  ROLE_STAFF,
  ROLE_SUPER_ADMIN,
  isOwner,
  hasPermission,
  hasAnyPermission,
  resolveUserPermissions,
  buildPermissionPayload,
  getAllPermissionKeys,
};
