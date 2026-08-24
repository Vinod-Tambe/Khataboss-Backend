"use strict";

const { getTenantPrisma } = require("../../utils/tenantPrisma");
const { ensureIncomeAccount } = require("../../utils/incomeAccounts");

const INCOME_TYPE_KEYS = ["PROCESSING", "COLLECT", "EXTRA", "FINE", "INTEREST"];

/**
 * Ensure split P&L income accounts exist for every firm in a tenant DB.
 */
async function seedIncomeAccountsForTenant(dbUrl) {
  const prisma = getTenantPrisma(dbUrl);
  try {
    const firms = await prisma.firm.findMany({
      where: { firm_is_deleted: false },
      select: { firm_id: true, firm_own_id: true },
    });

    for (const firm of firms) {
      for (const typeKey of INCOME_TYPE_KEYS) {
        await ensureIncomeAccount(
          prisma,
          firm.firm_id,
          firm.firm_own_id || 1,
          typeKey
        );
      }
    }

    return firms.length;
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = { seedIncomeAccountsForTenant };
