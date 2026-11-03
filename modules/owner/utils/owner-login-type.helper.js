"use strict";

const LOGIN_TYPE_ONLINE = "Online";
const LOGIN_TYPE_OFFLINE = "Offline";

function parseOwnerLoginType(value) {
  const raw = String(value ?? LOGIN_TYPE_ONLINE).trim();
  if (raw === LOGIN_TYPE_ONLINE) return LOGIN_TYPE_ONLINE;
  if (raw === LOGIN_TYPE_OFFLINE) return LOGIN_TYPE_OFFLINE;
  return null;
}

function isOfflineOwnerRecord(owner) {
  if (!owner) return false;
  if (owner.own_login_type === LOGIN_TYPE_OFFLINE) return true;
  return String(owner.own_db || "").startsWith("offline_");
}

/** Cloud/server tenant sync, migrate, and seed — skip offline (local-only) owners. */
function isOnlineTenantForServerSync(owner) {
  if (!owner?.own_db) return false;
  return !isOfflineOwnerRecord(owner);
}

function filterOnlineTenantOwners(owners = []) {
  return owners.filter(isOnlineTenantForServerSync);
}

async function fetchOnlineTenantOwnersFromMaster(masterPrisma) {
  const owners = await masterPrisma.owner.findMany({
    where: { own_is_deleted: false },
    select: {
      own_db: true,
      own_login_id: true,
      own_login_type: true,
    },
  });
  return filterOnlineTenantOwners(owners);
}

function buildOfflineDbPlaceholder(loginId) {
  const slug =
    String(loginId || "owner")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_]+/g, "_")
      .replace(/^_+|_+$/g, "") || "owner";
  return `offline_${slug}`;
}

module.exports = {
  LOGIN_TYPE_ONLINE,
  LOGIN_TYPE_OFFLINE,
  parseOwnerLoginType,
  isOfflineOwnerRecord,
  isOnlineTenantForServerSync,
  filterOnlineTenantOwners,
  fetchOnlineTenantOwnersFromMaster,
  buildOfflineDbPlaceholder,
};
