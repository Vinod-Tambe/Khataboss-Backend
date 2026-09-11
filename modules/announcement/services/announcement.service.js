"use strict";

const { getMasterPrisma } = require("../../../utils/masterPrisma");

const masterPrisma = getMasterPrisma();

const ANNOUNCEMENT_TYPES = new Set([
  "Notice",
  "Alert",
  "Warning",
  "Celebration",
  "Congratulation",
]);

class AnnouncementService {
  parseType(value) {
    const type = String(value || "Notice").trim();
    if (!ANNOUNCEMENT_TYPES.has(type)) {
      const error = new Error("Invalid announcement type.");
      error.statusCode = 400;
      throw error;
    }
    return type;
  }

  serialize(row) {
    if (!row) return null;
    return {
      ann_uuid: row.ann_uuid,
      ann_title: row.ann_title,
      ann_body: row.ann_body,
      ann_type: row.ann_type || "Notice",
      ann_status: row.ann_status,
      ann_is_pinned: row.ann_is_pinned,
      ann_sort_order: row.ann_sort_order,
      ann_publish_at: row.ann_publish_at,
      ann_expires_at: row.ann_expires_at,
      ann_created_by: row.ann_created_by,
      ann_created_at: row.ann_created_at,
      ann_updated_at: row.ann_updated_at,
    };
  }

  formatPublisherName(admin) {
    if (!admin) return "";
    const companyName = String(admin.admin_company_name || "").trim();
    if (companyName) return companyName;
    return "KhataBoss";
  }

  async enrichWithPublisher(rows = []) {
    if (!rows.length) return [];

    const loginIds = [
      ...new Set(rows.map((row) => row.ann_created_by).filter(Boolean)),
    ];

    const admins = loginIds.length
      ? await masterPrisma.admin.findMany({
          where: {
            admin_login_id: { in: loginIds },
            admin_is_deleted: false,
          },
          select: {
            admin_login_id: true,
            admin_company_name: true,
          },
        })
      : [];

    const nameByLogin = new Map(
      admins.map((admin) => [admin.admin_login_id, this.formatPublisherName(admin)])
    );

    return rows.map((row) => ({
      ...this.serialize(row),
      ann_published_by:
        nameByLogin.get(row.ann_created_by) || "KhataBoss",
    }));
  }

  parseDate(value) {
    if (!value || value === "") return null;

    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) {
        const error = new Error("Invalid date value.");
        error.statusCode = 400;
        throw error;
      }
      return value;
    }

    const str = String(value).trim();
    const dateOnly = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (dateOnly) {
      const local = new Date(
        Number(dateOnly[1]),
        Number(dateOnly[2]) - 1,
        Number(dateOnly[3]),
        0,
        0,
        0,
        0
      );
      if (Number.isNaN(local.getTime())) {
        const error = new Error("Invalid date value.");
        error.statusCode = 400;
        throw error;
      }
      return local;
    }

    const date = new Date(str);
    if (Number.isNaN(date.getTime())) {
      const error = new Error("Invalid date value.");
      error.statusCode = 400;
      throw error;
    }
    return date;
  }

  assertSchedule(publishAt, expiresAt) {
    if (!publishAt) {
      const error = new Error("ann_publish_at is required.");
      error.statusCode = 400;
      throw error;
    }
    if (expiresAt && expiresAt <= publishAt) {
      const error = new Error("Expiry date/time must be after publish date/time.");
      error.statusCode = 400;
      throw error;
    }
  }

  mapCreateData(body = {}, adminLoginId = "Admin") {
    if (!body.ann_title?.trim()) {
      const error = new Error("ann_title is required.");
      error.statusCode = 400;
      throw error;
    }
    if (!body.ann_body?.trim()) {
      const error = new Error("ann_body is required.");
      error.statusCode = 400;
      throw error;
    }

    const ann_publish_at = body.ann_publish_at
      ? this.parseDate(body.ann_publish_at)
      : new Date();
    const ann_expires_at = body.ann_expires_at ? this.parseDate(body.ann_expires_at) : null;
    this.assertSchedule(ann_publish_at, ann_expires_at);

    return {
      ann_title: String(body.ann_title).trim(),
      ann_body: String(body.ann_body).trim(),
      ann_type: this.parseType(body.ann_type),
      ann_status: body.ann_status === "Inactive" ? "Inactive" : "Active",
      ann_is_pinned: body.ann_is_pinned === true || body.ann_is_pinned === "true",
      ann_sort_order: parseInt(body.ann_sort_order ?? 0, 10) || 0,
      ann_publish_at,
      ann_expires_at,
      ann_created_by: adminLoginId,
      ann_updated_by: adminLoginId,
    };
  }

  mapUpdateData(body = {}, adminLoginId = "Admin", existing = null) {
    const data = { ann_updated_by: adminLoginId };
    if (body.ann_title !== undefined) data.ann_title = String(body.ann_title).trim();
    if (body.ann_body !== undefined) data.ann_body = String(body.ann_body).trim();
    if (body.ann_type !== undefined) data.ann_type = this.parseType(body.ann_type);
    if (body.ann_status !== undefined) {
      data.ann_status = body.ann_status === "Inactive" ? "Inactive" : "Active";
    }
    if (body.ann_is_pinned !== undefined) {
      data.ann_is_pinned = body.ann_is_pinned === true || body.ann_is_pinned === "true";
    }
    if (body.ann_sort_order !== undefined) {
      data.ann_sort_order = parseInt(body.ann_sort_order, 10) || 0;
    }
    if (body.ann_publish_at !== undefined) {
      data.ann_publish_at = body.ann_publish_at ? this.parseDate(body.ann_publish_at) : new Date();
    }
    if (body.ann_expires_at !== undefined) {
      data.ann_expires_at = body.ann_expires_at ? this.parseDate(body.ann_expires_at) : null;
    }

    const publishAt =
      data.ann_publish_at !== undefined
        ? data.ann_publish_at
        : undefined;
    const expiresAt =
      data.ann_expires_at !== undefined
        ? data.ann_expires_at
        : undefined;

    if (publishAt !== undefined || expiresAt !== undefined) {
      this.assertSchedule(
        publishAt !== undefined ? publishAt : existing?.ann_publish_at,
        expiresAt !== undefined ? expiresAt : existing?.ann_expires_at
      );
    }

    return data;
  }

  async getAll() {
    const rows = await masterPrisma.announcement.findMany({
      where: { ann_is_deleted: false },
      orderBy: [
        { ann_is_pinned: "desc" },
        { ann_sort_order: "asc" },
        { ann_publish_at: "desc" },
      ],
    });
    return this.enrichWithPublisher(rows);
  }

  async getActiveFeed() {
    const now = new Date();
    const rows = await masterPrisma.announcement.findMany({
      where: {
        ann_is_deleted: false,
        ann_status: "Active",
        ann_publish_at: { lte: now },
        OR: [{ ann_expires_at: null }, { ann_expires_at: { gt: now } }],
      },
      orderBy: [
        { ann_is_pinned: "desc" },
        { ann_sort_order: "asc" },
        { ann_publish_at: "desc" },
      ],
      take: 20,
    });
    return this.enrichWithPublisher(rows);
  }

  async getByUuid(uuid) {
    const row = await masterPrisma.announcement.findFirst({
      where: { ann_uuid: uuid, ann_is_deleted: false },
    });
    return this.serialize(row);
  }

  async create(body, adminLoginId) {
    const created = await masterPrisma.announcement.create({
      data: this.mapCreateData(body, adminLoginId),
    });
    return this.serialize(created);
  }

  async update(uuid, body, adminLoginId) {
    const existing = await masterPrisma.announcement.findFirst({
      where: { ann_uuid: uuid, ann_is_deleted: false },
    });
    if (!existing) {
      const error = new Error("Announcement not found.");
      error.statusCode = 404;
      throw error;
    }

    const updated = await masterPrisma.announcement.update({
      where: { ann_id: existing.ann_id },
      data: this.mapUpdateData(body, adminLoginId, existing),
    });
    return this.serialize(updated);
  }

  async delete(uuid, adminLoginId) {
    const existing = await masterPrisma.announcement.findFirst({
      where: { ann_uuid: uuid, ann_is_deleted: false },
    });
    if (!existing) {
      const error = new Error("Announcement not found.");
      error.statusCode = 404;
      throw error;
    }

    await masterPrisma.announcement.update({
      where: { ann_id: existing.ann_id },
      data: {
        ann_is_deleted: true,
        ann_deleted_at: new Date(),
        ann_deleted_by: adminLoginId,
        ann_status: "Inactive",
      },
    });
  }
}

module.exports = new AnnouncementService();
