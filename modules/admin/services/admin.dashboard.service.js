"use strict";

const { getMasterPrisma } = require("../../../utils/masterPrisma");
const {
  ADMIN_STATUS_LABELS,
  OWNER_STATUS_LABELS,
} = require("../../support/constants/support.constants");

const masterPrisma = getMasterPrisma();

const ADMIN_STATUS_ORDER = [
  "Backlog",
  "Todo",
  "InProgress",
  "DoneOnLocal",
  "ReadyForTesting",
  "Done",
  "Delivered",
  "Cancelled",
];

const OWNER_STATUS_ORDER = [
  "Sent",
  "Review",
  "InDiscussion",
  "Development",
  "Testing",
  "Done",
  "Delivered",
];

class AdminDashboardService {
  formatOwnerName(owner) {
    if (!owner) return "Owner";
    const parts = [owner.own_first_name, owner.own_middle_name, owner.own_last_name].filter(Boolean);
    if (parts.length) return parts.join(" ");
    return owner.own_login_id || owner.own_email || "Owner";
  }

  buildMonthlyCountSeries(rows, dateField, months = 12) {
    const buckets = [];
    const now = new Date();
    const indexByKey = new Map();
    const span = Math.max(1, months) - 1;

    for (let i = span; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleString("en-IN", { month: "short", year: "2-digit" });
      indexByKey.set(key, buckets.length);
      buckets.push({ key, label, count: 0 });
    }

    (rows || []).forEach((row) => {
      const raw = row?.[dateField];
      if (!raw) return;
      const created = raw instanceof Date ? raw : new Date(raw);
      if (Number.isNaN(created.getTime())) return;
      const key = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, "0")}`;
      const idx = indexByKey.get(key);
      if (idx !== undefined) buckets[idx].count += 1;
    });

    return buckets;
  }

  mapStatusCounts(groupRows, order, labels, statusField) {
    const countMap = new Map();
    (groupRows || []).forEach((row) => {
      const status = row[statusField];
      if (!status) return;
      countMap.set(status, row._count?.st_id ?? 0);
    });
    return order.map((status) => ({
      status,
      label: labels[status] || status,
      count: countMap.get(status) || 0,
    }));
  }

  async getSupportTicketAudit() {
    const baseWhere = { st_is_deleted: false };

    const [
      totalTickets,
      adminGroups,
      ownerGroups,
      ticketsForTimeline,
      ownerIdGroups,
    ] = await Promise.all([
      masterPrisma.supportTicket.count({ where: baseWhere }),
      masterPrisma.supportTicket.groupBy({
        by: ["st_admin_status"],
        where: baseWhere,
        _count: { st_id: true },
      }),
      masterPrisma.supportTicket.groupBy({
        by: ["st_owner_status"],
        where: baseWhere,
        _count: { st_id: true },
      }),
      masterPrisma.supportTicket.findMany({
        where: baseWhere,
        select: { st_created_at: true, st_admin_status: true },
      }),
      masterPrisma.supportTicket.groupBy({
        by: ["st_own_id"],
        where: baseWhere,
        _count: { st_id: true },
      }),
    ]);

    const openTickets = ticketsForTimeline.filter(
      (t) => t.st_admin_status !== "Delivered" && t.st_admin_status !== "Cancelled"
    ).length;

    const deliveredTickets =
      adminGroups.find((g) => g.st_admin_status === "Delivered")?._count?.st_id || 0;
    const cancelledTickets =
      adminGroups.find((g) => g.st_admin_status === "Cancelled")?._count?.st_id || 0;

    const ownerIds = ownerIdGroups.map((g) => g.st_own_id).filter(Boolean);
    const owners = ownerIds.length
      ? await masterPrisma.owner.findMany({
          where: { own_id: { in: ownerIds } },
          select: {
            own_id: true,
            own_uuid: true,
            own_login_id: true,
            own_first_name: true,
            own_middle_name: true,
            own_last_name: true,
          },
        })
      : [];
    const ownerById = new Map(owners.map((o) => [o.own_id, o]));

    const ticketsByOwner = ownerIdGroups
      .map((row) => {
        const owner = ownerById.get(row.st_own_id);
        return {
          own_uuid: owner?.own_uuid || null,
          own_login_id: owner?.own_login_id || null,
          name: this.formatOwnerName(owner),
          count: row._count?.st_id ?? 0,
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);

    return {
      summary: {
        totalTickets,
        openTickets,
        deliveredTickets,
        cancelledTickets,
      },
      ticketsByAdminStatus: this.mapStatusCounts(
        adminGroups,
        ADMIN_STATUS_ORDER,
        ADMIN_STATUS_LABELS,
        "st_admin_status"
      ),
      ticketsByOwnerStatus: this.mapStatusCounts(
        ownerGroups,
        OWNER_STATUS_ORDER,
        OWNER_STATUS_LABELS,
        "st_owner_status"
      ),
      ticketsCreatedByMonth: this.buildMonthlyCountSeries(ticketsForTimeline, "st_created_at"),
      ticketsByOwner,
    };
  }

  async getDashboardStats() {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalOwners,
      activeOwners,
      inactiveOwners,
      newOwnersThisMonth,
      recentOwners,
      ownersCreated,
      totalPlans,
      activePlans,
    ] = await Promise.all([
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
        masterPrisma.owner.findMany({
          where: { own_is_deleted: false },
          select: { own_created_at: true },
        }),
        masterPrisma.plan.count({ where: { plan_is_deleted: false } }),
        masterPrisma.plan.count({
          where: { plan_is_deleted: false, plan_status: "Active" },
        }),
      ]);

    const supportAudit = await this.getSupportTicketAudit();
    const delivered = supportAudit.summary.deliveredTickets || 0;
    const totalTickets = supportAudit.summary.totalTickets || 0;

    return {
      totalOwners,
      activeOwners,
      inactiveOwners,
      totalPlans,
      activePlans,
      newOwnersThisMonth,
      recentOwners,
      supportAudit,
      charts: {
        ticketsByStatus: supportAudit.ticketsByAdminStatus,
        ownersAddedByMonth: this.buildMonthlyCountSeries(ownersCreated, "own_created_at"),
        ownersActiveInactive: {
          total: totalOwners,
          active: activeOwners,
          inactive: inactiveOwners,
        },
        ticketDelivery: {
          total: totalTickets,
          delivered,
          other: Math.max(0, totalTickets - delivered),
        },
      },
    };
  }
}

module.exports = new AdminDashboardService();
