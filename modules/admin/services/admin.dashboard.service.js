"use strict";

const { getMasterPrisma } = require("../../../utils/masterPrisma");

const masterPrisma = getMasterPrisma();

class AdminDashboardService {
  async getDashboardStats() {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalOwners, activeOwners, inactiveOwners, newOwnersThisMonth, recentOwners] =
      await Promise.all([
        masterPrisma.owner.count({ where: { own_is_deleted: false } }),
        masterPrisma.owner.count({
          where: { own_is_deleted: false, own_status: "Active" },
        }),
        masterPrisma.owner.count({
          where: { own_is_deleted: false, own_status: "Inactive" },
        }),
        masterPrisma.owner.count({
          where: {
            own_is_deleted: false,
            own_created_at: { gte: monthStart },
          },
        }),
        masterPrisma.owner.findMany({
          where: { own_is_deleted: false },
          orderBy: { own_created_at: "desc" },
          take: 5,
          select: {
            own_uuid: true,
            own_first_name: true,
            own_middle_name: true,
            own_last_name: true,
            own_login_id: true,
            own_email: true,
            own_mobile_no: true,
            own_db: true,
            own_status: true,
            own_created_at: true,
          },
        }),
      ]);

    return {
      totalOwners,
      activeOwners,
      inactiveOwners,
      newOwnersThisMonth,
      recentOwners,
    };
  }
}

module.exports = new AdminDashboardService();
