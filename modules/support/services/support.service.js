"use strict";

const { getMasterPrisma } = require("../../../utils/masterPrisma");
const imageService = require("../../../utils/image.service");
const {
  OWNER_STATUSES,
  ADMIN_STATUSES,
  PRIORITIES,
  TITLE_MIN,
  TITLE_MAX,
  BODY_MIN,
  BODY_MAX,
  MAX_COMMENT_IMAGES,
  OWNER_STATUS_LABELS,
  ADMIN_STATUS_LABELS,
  PRIORITY_LABELS,
} = require("../constants/support.constants");
const { ROLE_OWNER } = require("../../../common/service/permission.helper");

const masterPrisma = getMasterPrisma();

class SupportService {
  parsePriority(value) {
    const priority = String(value || "Medium").trim();
    if (!PRIORITIES.has(priority)) {
      const error = new Error("Invalid ticket priority.");
      error.statusCode = 400;
      throw error;
    }
    return priority;
  }

  parseOwnerStatus(value) {
    const status = String(value || "").trim();
    if (!OWNER_STATUSES.has(status)) {
      const error = new Error("Invalid owner ticket status.");
      error.statusCode = 400;
      throw error;
    }
    return status;
  }

  parseAdminStatus(value) {
    const status = String(value || "").trim();
    if (!ADMIN_STATUSES.has(status)) {
      const error = new Error("Invalid admin ticket status.");
      error.statusCode = 400;
      throw error;
    }
    return status;
  }

  formatPersonName(profile) {
    if (!profile) return "User";
    return [profile.own_first_name, profile.own_middle_name, profile.own_last_name]
      .filter(Boolean)
      .join(" ")
      .trim() || profile.own_login_id || "Owner";
  }

  formatAdminName(admin) {
    if (!admin) return "Super Admin";
    return [admin.admin_first_name, admin.admin_middle_name, admin.admin_last_name]
      .filter(Boolean)
      .join(" ")
      .trim() || admin.admin_login_id || "Super Admin";
  }

  serializeImages(images) {
    if (!images) return [];
    const list = Array.isArray(images) ? images : [];
    return list.map((img) => ({
      ...img,
      url: imageService.getPublicUrl(img?.path || img),
    }));
  }

  serializeComment(row) {
    if (!row) return null;
    return {
      stc_uuid: row.stc_uuid,
      stc_author_role: row.stc_author_role,
      stc_author_uuid: row.stc_author_uuid,
      stc_author_name: row.stc_author_name,
      stc_kind: row.stc_kind || "Message",
      stc_audience: row.stc_audience || "Both",
      stc_body: row.stc_body,
      stc_images: this.serializeImages(row.stc_images),
      stc_created_at: row.stc_created_at,
      stc_updated_at: row.stc_updated_at,
    };
  }

  /** Owner ticket activity — hide super-admin board moves and internal admin notes. */
  commentVisibleToOwner(row) {
    if (!row) return false;
    const audience = row.stc_audience || "Both";
    const body = String(row.stc_body || "");
    const isHistory = (row.stc_kind || "Message") === "History";
    const isExpectedDeliveryHistory = isHistory && /Expected delivery:/.test(body);

    if (audience === "Admin") {
      return isExpectedDeliveryHistory;
    }

    if (row.stc_author_role === "Admin") {
      if (!isHistory) return false;
      if (/Support progress:|Board column:/.test(body)) return false;
      if (/Priority changed:|Title updated|Description updated/.test(body)) return false;
    }
    return true;
  }

  filterCommentsForOwner(comments) {
    return (comments || []).filter((c) => this.commentVisibleToOwner(c));
  }

  formatHistoryDelivery(value) {
    if (!value) return "Not set";
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return "Not set";
    return d.toISOString().slice(0, 16).replace("T", " ");
  }

  collectTicketUpdateHistory(ticket, data, { authorRole = "Owner" } = {}) {
    const entries = [];
    const adminHistoryOnly = authorRole === "Admin";

    if (data.st_priority !== undefined && data.st_priority !== ticket.st_priority) {
      const from = PRIORITY_LABELS[ticket.st_priority] || ticket.st_priority;
      const to = PRIORITY_LABELS[data.st_priority] || data.st_priority;
      entries.push({
        line: `Priority changed: ${from} → ${to}`,
        audience: adminHistoryOnly ? "Admin" : "Both",
      });
    }
    if (data.st_owner_status !== undefined && data.st_owner_status !== ticket.st_owner_status) {
      const from = OWNER_STATUS_LABELS[ticket.st_owner_status] || ticket.st_owner_status;
      const to = OWNER_STATUS_LABELS[data.st_owner_status] || data.st_owner_status;
      entries.push({
        line: `Status: ${from} → ${to}`,
        audience: "Both",
      });
    }
    if (data.st_admin_status !== undefined && data.st_admin_status !== ticket.st_admin_status) {
      const from = ADMIN_STATUS_LABELS[ticket.st_admin_status] || ticket.st_admin_status;
      const to = ADMIN_STATUS_LABELS[data.st_admin_status] || data.st_admin_status;
      entries.push({
        line: `Support progress: ${from} → ${to}`,
        audience: "Admin",
      });
    }
    if (data.st_title !== undefined && data.st_title !== ticket.st_title) {
      entries.push({
        line: "Title updated",
        audience: adminHistoryOnly ? "Admin" : "Both",
      });
    }
    if (data.st_body !== undefined && data.st_body !== ticket.st_body) {
      entries.push({
        line: "Description updated",
        audience: adminHistoryOnly ? "Admin" : "Both",
      });
    }
    if (data.st_expected_delivery_at !== undefined) {
      const prev = ticket.st_expected_delivery_at
        ? this.formatHistoryDelivery(ticket.st_expected_delivery_at)
        : "Not set";
      const next = data.st_expected_delivery_at
        ? this.formatHistoryDelivery(data.st_expected_delivery_at)
        : "Not set";
      if (prev !== next) {
        entries.push({
          line: `Expected delivery: ${prev} → ${next}`,
          audience: "Both",
        });
      }
    }
    return entries;
  }

  async appendTicketHistoryComment(ticket, author, line, audience = "Both") {
    const text = String(line || "").trim();
    if (!text) return;
    const body = `• ${text}`;
    const audienceValue = audience === "Admin" ? "Admin" : "Both";
    try {
      await masterPrisma.supportTicketComment.create({
        data: {
          st_st_id: ticket.st_id,
          stc_kind: "History",
          stc_audience: audienceValue,
          stc_author_role: author.role,
          stc_author_uuid: author.uuid,
          stc_author_name: author.name,
          stc_body: body,
        },
      });
    } catch (error) {
      console.error("❌ appendTicketHistoryComment (History kind):", error.message);
      await masterPrisma.supportTicketComment.create({
        data: {
          st_st_id: ticket.st_id,
          stc_author_role: author.role,
          stc_author_uuid: author.uuid,
          stc_author_name: author.name,
          stc_body: `[Ticket update]\n${body}`,
        },
      });
    }
  }

  async appendTicketHistoryLines(ticket, author, lines) {
    const list = Array.isArray(lines) ? lines : [lines];
    for (const item of list) {
      if (typeof item === "string") {
        await this.appendTicketHistoryComment(ticket, author, item, "Both");
      } else {
        await this.appendTicketHistoryComment(
          ticket,
          author,
          item.line,
          item.audience || "Both"
        );
      }
    }
  }

  imageRecordPath(img) {
    if (!img) return null;
    if (typeof img === "string") return img.trim() || null;
    return img.path || null;
  }

  parseRemoveImagePaths(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) {
      return raw.map((p) => String(p || "").trim()).filter(Boolean);
    }
    const text = String(raw).trim();
    if (!text) return [];
    if (text.startsWith("[")) {
      try {
        const parsed = JSON.parse(text);
        return Array.isArray(parsed)
          ? parsed.map((p) => String(p || "").trim()).filter(Boolean)
          : [];
      } catch {
        return [text];
      }
    }
    return [text];
  }

  async removeImagesByPaths(imageList, pathsToRemove) {
    const paths = new Set(this.parseRemoveImagePaths(pathsToRemove));
    const list = Array.isArray(imageList) ? [...imageList] : [];
    if (!paths.size) return list;

    const kept = [];
    for (const img of list) {
      const p = this.imageRecordPath(img);
      if (p && paths.has(p)) {
        await imageService.deleteStoredFile(img);
      } else {
        kept.push(img);
      }
    }
    return kept;
  }

  async attachImagesToComment(ownId, commentId, files = []) {
    if (!files?.length) return [];
    if (files.length > MAX_COMMENT_IMAGES) {
      const error = new Error(`Maximum ${MAX_COMMENT_IMAGES} images per comment.`);
      error.statusCode = 400;
      throw error;
    }
    return imageService.appendArrayFiles(
      ownId,
      "support-comment",
      commentId,
      files,
      "attachment"
    );
  }

  pickLatestMessageComment(comments, { forOwner = false } = {}) {
    const list = forOwner ? this.filterCommentsForOwner(comments) : comments;
    if (!list?.length) return null;
    return list.find((c) => (c.stc_kind || "Message") === "Message") || null;
  }

  serializeTicket(row, { includeComments = false, owner = null, forOwner = false } = {}) {
    if (!row) return null;
    const commentRows = forOwner
      ? this.filterCommentsForOwner(row.comments)
      : row.comments;
    const latestRow = this.pickLatestMessageComment(row.comments, { forOwner });
    const latestComment = latestRow ? this.serializeComment(latestRow) : null;
    const payload = {
      st_uuid: row.st_uuid,
      st_id: row.st_id,
      ticket_no: row.st_id,
      st_title: row.st_title,
      st_body: row.st_body,
      st_priority: row.st_priority,
      st_images: this.serializeImages(row.st_images),
      st_owner_status: row.st_owner_status,
      st_admin_status: row.st_admin_status,
      st_expected_delivery_at: row.st_expected_delivery_at,
      st_created_at: row.st_created_at,
      st_updated_at: row.st_updated_at,
      owner: owner
        ? {
            own_uuid: owner.own_uuid,
            own_login_id: owner.own_login_id,
            name: this.formatPersonName(owner),
            own_mobile_no: owner.own_mobile_no,
            own_email: owner.own_email,
          }
        : undefined,
      latest_comment: latestComment,
    };

    if (includeComments) {
      payload.comments = (commentRows || []).map((c) => this.serializeComment(c));
    }

    return payload;
  }

  assertOwnerUser(req) {
    if (req.user?.role !== ROLE_OWNER) {
      const error = new Error("Only the shop owner can manage support tickets.");
      error.statusCode = 403;
      throw error;
    }
  }

  async getTicketForOwner(ownId, uuid) {
    const row = await masterPrisma.supportTicket.findFirst({
      where: { st_uuid: uuid, st_own_id: ownId, st_is_deleted: false },
      include: {
        comments: { orderBy: { stc_created_at: "desc" } },
      },
    });
    if (!row) {
      const error = new Error("Support ticket not found.");
      error.statusCode = 404;
      throw error;
    }
    return this.serializeTicket(row, { includeComments: true, forOwner: true });
  }

  buildTicketSearchFilter(search) {
    const q = String(search || "").trim();
    if (!q) return null;
    const or = [
      { st_title: { contains: q, mode: "insensitive" } },
      { st_body: { contains: q, mode: "insensitive" } },
    ];
    const numPart = q.replace(/^t-?/i, "").trim();
    if (/^\d+$/.test(numPart)) {
      const id = parseInt(numPart, 10);
      if (Number.isFinite(id) && id > 0) {
        or.push({ st_id: id });
      }
    }
    return { OR: or };
  }

  buildOwnerSearchFilter(search) {
    return this.buildTicketSearchFilter(search);
  }

  buildAdminSearchFilter(search) {
    const ticketClause = this.buildTicketSearchFilter(search);
    if (!ticketClause) return null;
    const q = String(search || "").trim();
    const ownerFields = [
      "own_login_id",
      "own_first_name",
      "own_middle_name",
      "own_last_name",
      "own_email",
      "own_mobile_no",
    ];
    const ownerOr = ownerFields.map((field) => ({
      owner: { [field]: { contains: q, mode: "insensitive" } },
    }));
    return { OR: [...ticketClause.OR, ...ownerOr] };
  }

  assertOwnerCanEditTicket(ticket) {
    if (ticket.st_owner_status === "Delivered") {
      const error = new Error("Delivered tickets cannot be edited.");
      error.statusCode = 400;
      throw error;
    }
    if (ticket.st_admin_status === "Cancelled") {
      const error = new Error("This ticket was cancelled and cannot be edited.");
      error.statusCode = 400;
      throw error;
    }
  }

  async listTicketsForOwner(ownId, filters = {}) {
    const where = { st_own_id: ownId, st_is_deleted: false };
    if (filters.owner_status) {
      where.st_owner_status = this.parseOwnerStatus(filters.owner_status);
    }
    const searchClause = this.buildOwnerSearchFilter(filters.search);
    if (searchClause) {
      where.AND = [searchClause];
    }

    const rows = await masterPrisma.supportTicket.findMany({
      where,
      orderBy: { st_updated_at: "desc" },
      include: {
        comments: {
          orderBy: { stc_created_at: "desc" },
          take: 15,
        },
      },
    });
    return rows.map((row) => this.serializeTicket(row, { forOwner: true }));
  }

  async createTicketForOwner(req, files = []) {
    this.assertOwnerUser(req);
    const ownId = req.user.own_id;
    const title = String(req.body?.st_title || req.body?.title || "").trim();
    const body = String(req.body?.st_body || req.body?.body || "").trim();
    const priority = this.parsePriority(req.body?.st_priority || req.body?.priority);

    if (!title || title.length < TITLE_MIN) {
      const error = new Error(`Ticket title must be at least ${TITLE_MIN} characters.`);
      error.statusCode = 400;
      throw error;
    }
    if (title.length > TITLE_MAX) {
      const error = new Error(`Ticket title must be at most ${TITLE_MAX} characters.`);
      error.statusCode = 400;
      throw error;
    }
    if (!body || body.length < BODY_MIN) {
      const error = new Error(`Please describe the issue in at least ${BODY_MIN} characters.`);
      error.statusCode = 400;
      throw error;
    }
    if (body.length > BODY_MAX) {
      const error = new Error(`Description must be at most ${BODY_MAX} characters.`);
      error.statusCode = 400;
      throw error;
    }

    const created = await masterPrisma.supportTicket.create({
      data: {
        st_own_id: ownId,
        st_title: title.slice(0, TITLE_MAX),
        st_body: body.slice(0, BODY_MAX),
        st_priority: priority,
        st_owner_status: "Sent",
        st_admin_status: "Todo",
        st_created_by: req.user.own_login_id,
        st_updated_by: req.user.own_login_id,
      },
    });

    let images = [];
    if (files?.length) {
      images = await imageService.appendArrayFiles(
        ownId,
        "support",
        created.st_id,
        files,
        "screenshot"
      );
      await masterPrisma.supportTicket.update({
        where: { st_id: created.st_id },
        data: { st_images: images },
      });
    }

    const profile = req.user.ownerProfile;
    await this.appendTicketHistoryLines(created, {
      role: "Owner",
      uuid: req.user.own_uuid,
      name: this.formatPersonName(profile),
    }, [
      `Ticket created · Status: ${OWNER_STATUS_LABELS.Sent} · Priority: ${PRIORITY_LABELS[priority] || priority}`,
      ...(images.length ? [`Screenshots added: ${images.length}`] : []),
    ]);

    return this.getTicketForOwner(ownId, created.st_uuid);
  }

  async appendImagesToOwnerTicket(req, ticketUuid, files = []) {
    this.assertOwnerUser(req);
    const ownId = req.user.own_id;
    const MAX_TICKET_IMAGES = 5;

    if (!files?.length) {
      const error = new Error("No images provided.");
      error.statusCode = 400;
      throw error;
    }

    const ticket = await masterPrisma.supportTicket.findFirst({
      where: { st_uuid: ticketUuid, st_own_id: ownId, st_is_deleted: false },
    });
    if (!ticket) {
      const error = new Error("Support ticket not found.");
      error.statusCode = 404;
      throw error;
    }

    const existing = Array.isArray(ticket.st_images) ? ticket.st_images : [];
    if (existing.length + files.length > MAX_TICKET_IMAGES) {
      const error = new Error(`Maximum ${MAX_TICKET_IMAGES} screenshots per ticket.`);
      error.statusCode = 400;
      throw error;
    }

    const added = await imageService.appendArrayFiles(
      ownId,
      "support",
      ticket.st_id,
      files,
      "screenshot"
    );
    const merged = [...existing, ...added];

    await masterPrisma.supportTicket.update({
      where: { st_id: ticket.st_id },
      data: {
        st_images: merged,
        st_updated_by: req.user.own_login_id,
      },
    });

    const profile = req.user.ownerProfile;
    await this.appendTicketHistoryLines(ticket, {
      role: "Owner",
      uuid: req.user.own_uuid,
      name: this.formatPersonName(profile),
    }, [`Screenshots added: ${files.length}`]);

    return this.getTicketForOwner(ownId, ticketUuid);
  }

  async addOwnerComment(req, ticketUuid, bodyText, files = []) {
    this.assertOwnerUser(req);
    const ownId = req.user.own_id;
    const text = String(bodyText || "").trim();
    const uploadFiles = Array.isArray(files) ? files.filter(Boolean) : [];
    if (!text && !uploadFiles.length) {
      const error = new Error("Add a message or attach at least one image.");
      error.statusCode = 400;
      throw error;
    }

    const ticket = await masterPrisma.supportTicket.findFirst({
      where: { st_uuid: ticketUuid, st_own_id: ownId, st_is_deleted: false },
    });
    if (!ticket) {
      const error = new Error("Support ticket not found.");
      error.statusCode = 404;
      throw error;
    }

    const profile = req.user.ownerProfile;
    const comment = await masterPrisma.supportTicketComment.create({
      data: {
        st_st_id: ticket.st_id,
        stc_kind: "Message",
        stc_author_role: "Owner",
        stc_author_uuid: req.user.own_uuid,
        stc_author_name: this.formatPersonName(profile),
        stc_body: text || "Shared image(s)",
      },
    });

    if (uploadFiles.length) {
      const images = await this.attachImagesToComment(ownId, comment.stc_id, uploadFiles);
      await masterPrisma.supportTicketComment.update({
        where: { stc_id: comment.stc_id },
        data: { stc_images: images },
      });
    }

    await masterPrisma.supportTicket.update({
      where: { st_id: ticket.st_id },
      data: { st_updated_by: req.user.own_login_id },
    });

    return this.getTicketForOwner(ownId, ticketUuid);
  }

  async removeOwnerTicketImage(req, ticketUuid, imagePath) {
    this.assertOwnerUser(req);
    const ownId = req.user.own_id;
    const path = String(imagePath || "").trim();
    if (!path) {
      const error = new Error("Image path is required.");
      error.statusCode = 400;
      throw error;
    }

    const ticket = await masterPrisma.supportTicket.findFirst({
      where: { st_uuid: ticketUuid, st_own_id: ownId, st_is_deleted: false },
    });
    if (!ticket) {
      const error = new Error("Support ticket not found.");
      error.statusCode = 404;
      throw error;
    }

    this.assertOwnerCanEditTicket(ticket);

    const nextImages = await this.removeImagesByPaths(ticket.st_images, [path]);
    const before = Array.isArray(ticket.st_images) ? ticket.st_images.length : 0;
    if (nextImages.length === before) {
      const error = new Error("Screenshot not found.");
      error.statusCode = 404;
      throw error;
    }

    await masterPrisma.supportTicket.update({
      where: { st_id: ticket.st_id },
      data: {
        st_images: nextImages.length ? nextImages : null,
        st_updated_by: req.user.own_login_id,
      },
    });

    const profile = req.user.ownerProfile;
    await this.appendTicketHistoryLines(ticket, {
      role: "Owner",
      uuid: req.user.own_uuid,
      name: this.formatPersonName(profile),
    }, ["Screenshot removed"]);

    return this.getTicketForOwner(ownId, ticketUuid);
  }

  async updateOwnerComment(req, ticketUuid, commentUuid, bodyText, files = [], removePaths = []) {
    this.assertOwnerUser(req);
    const ownId = req.user.own_id;
    const uploadFiles = Array.isArray(files) ? files.filter(Boolean) : [];
    const pathsToRemove = this.parseRemoveImagePaths(removePaths);

    const ticket = await masterPrisma.supportTicket.findFirst({
      where: { st_uuid: ticketUuid, st_own_id: ownId, st_is_deleted: false },
    });
    if (!ticket) {
      const error = new Error("Support ticket not found.");
      error.statusCode = 404;
      throw error;
    }

    const comment = await masterPrisma.supportTicketComment.findFirst({
      where: {
        stc_uuid: commentUuid,
        st_st_id: ticket.st_id,
        stc_author_role: "Owner",
        stc_author_uuid: req.user.own_uuid,
      },
    });
    if (!comment) {
      const error = new Error("Comment not found or you cannot edit it.");
      error.statusCode = 404;
      throw error;
    }
    if (comment.stc_kind === "History") {
      const error = new Error("This activity entry cannot be edited.");
      error.statusCode = 400;
      throw error;
    }

    let images = await this.removeImagesByPaths(comment.stc_images, pathsToRemove);
    const existingCount = images.length;

    if (uploadFiles.length) {
      if (existingCount + uploadFiles.length > MAX_COMMENT_IMAGES) {
        const error = new Error(`Maximum ${MAX_COMMENT_IMAGES} images per comment.`);
        error.statusCode = 400;
        throw error;
      }
      const added = await this.attachImagesToComment(ownId, comment.stc_id, uploadFiles);
      images = [...images, ...added];
    }

    const text =
      bodyText !== undefined && bodyText !== null
        ? String(bodyText).trim()
        : String(comment.stc_body || "").trim();

    if (!text && !images.length) {
      const error = new Error("Comment must include text or at least one image.");
      error.statusCode = 400;
      throw error;
    }

    await masterPrisma.supportTicketComment.update({
      where: { stc_id: comment.stc_id },
      data: {
        stc_body: text || "Shared image(s)",
        stc_images: images.length ? images : null,
      },
    });

    await masterPrisma.supportTicket.update({
      where: { st_id: ticket.st_id },
      data: { st_updated_by: req.user.own_login_id },
    });

    return this.getTicketForOwner(ownId, ticketUuid);
  }

  async updateTicketForOwner(req, uuid, payload) {
    this.assertOwnerUser(req);
    const ownId = req.user.own_id;

    const ticket = await masterPrisma.supportTicket.findFirst({
      where: { st_uuid: uuid, st_own_id: ownId, st_is_deleted: false },
    });
    if (!ticket) {
      const error = new Error("Support ticket not found.");
      error.statusCode = 404;
      throw error;
    }

    this.assertOwnerCanEditTicket(ticket);

    const data = { st_updated_by: req.user.own_login_id };

    if (payload.st_priority !== undefined) {
      data.st_priority = this.parsePriority(payload.st_priority);
    }
    if (payload.st_title !== undefined) {
      const title = String(payload.st_title || "").trim();
      if (!title || title.length < TITLE_MIN) {
        const error = new Error(`Ticket title must be at least ${TITLE_MIN} characters.`);
        error.statusCode = 400;
        throw error;
      }
      if (title.length > TITLE_MAX) {
        const error = new Error(`Ticket title must be at most ${TITLE_MAX} characters.`);
        error.statusCode = 400;
        throw error;
      }
      data.st_title = title.slice(0, TITLE_MAX);
    }
    if (payload.st_body !== undefined) {
      const body = String(payload.st_body || "").trim();
      if (!body || body.length < BODY_MIN) {
        const error = new Error(`Description must be at least ${BODY_MIN} characters.`);
        error.statusCode = 400;
        throw error;
      }
      if (body.length > BODY_MAX) {
        const error = new Error(`Description must be at most ${BODY_MAX} characters.`);
        error.statusCode = 400;
        throw error;
      }
      data.st_body = body.slice(0, BODY_MAX);
    }

    if (
      data.st_title === undefined &&
      data.st_body === undefined &&
      data.st_priority === undefined
    ) {
      const error = new Error("No valid fields to update.");
      error.statusCode = 400;
      throw error;
    }

    const historyLines = this.collectTicketUpdateHistory(ticket, data, { authorRole: "Owner" });
    const profile = req.user.ownerProfile;

    await masterPrisma.supportTicket.update({
      where: { st_id: ticket.st_id },
      data,
    });

    if (historyLines.length) {
      await this.appendTicketHistoryLines(ticket, {
        role: "Owner",
        uuid: req.user.own_uuid,
        name: this.formatPersonName(profile),
      }, historyLines);
    }

    return this.getTicketForOwner(ownId, uuid);
  }

  async listTicketsForAdmin(filters = {}) {
    const where = { st_is_deleted: false };
    if (filters.admin_status) where.st_admin_status = filters.admin_status;
    if (filters.owner_status) where.st_owner_status = filters.owner_status;
    if (filters.priority) where.st_priority = filters.priority;
    const searchClause = this.buildAdminSearchFilter(filters.search);
    if (searchClause) {
      where.AND = [...(where.AND || []), searchClause];
    }

    const rows = await masterPrisma.supportTicket.findMany({
      where,
      orderBy: { st_updated_at: "desc" },
      include: {
        owner: {
          select: {
            own_uuid: true,
            own_login_id: true,
            own_first_name: true,
            own_middle_name: true,
            own_last_name: true,
            own_mobile_no: true,
            own_email: true,
          },
        },
        comments: {
          orderBy: { stc_created_at: "desc" },
          take: 15,
        },
      },
    });

    return rows.map((row) =>
      this.serializeTicket(row, { owner: row.owner })
    );
  }

  async getTicketForAdmin(uuid) {
    const row = await masterPrisma.supportTicket.findFirst({
      where: { st_uuid: uuid, st_is_deleted: false },
      include: {
        owner: {
          select: {
            own_uuid: true,
            own_login_id: true,
            own_first_name: true,
            own_middle_name: true,
            own_last_name: true,
            own_mobile_no: true,
            own_email: true,
          },
        },
        comments: { orderBy: { stc_created_at: "desc" } },
      },
    });
    if (!row) {
      const error = new Error("Support ticket not found.");
      error.statusCode = 404;
      throw error;
    }
    return this.serializeTicket(row, { includeComments: true, owner: row.owner });
  }

  async updateTicketForAdmin(uuid, payload, admin) {
    const ticket = await masterPrisma.supportTicket.findFirst({
      where: { st_uuid: uuid, st_is_deleted: false },
    });
    if (!ticket) {
      const error = new Error("Support ticket not found.");
      error.statusCode = 404;
      throw error;
    }

    const data = { st_updated_by: admin.admin_login_id };

    if (payload.st_owner_status !== undefined) {
      data.st_owner_status = this.parseOwnerStatus(payload.st_owner_status);
    }
    if (payload.st_admin_status !== undefined) {
      data.st_admin_status = this.parseAdminStatus(payload.st_admin_status);
    }
    if (payload.st_priority !== undefined) {
      data.st_priority = this.parsePriority(payload.st_priority);
    }
    if (payload.st_expected_delivery_at !== undefined) {
      const raw = payload.st_expected_delivery_at;
      data.st_expected_delivery_at = raw ? new Date(raw) : null;
      if (raw && Number.isNaN(data.st_expected_delivery_at.getTime())) {
        const error = new Error("Invalid expected delivery date.");
        error.statusCode = 400;
        throw error;
      }
    }
    if (payload.st_title !== undefined) {
      const title = String(payload.st_title || "").trim();
      if (!title || title.length < TITLE_MIN) {
        const error = new Error(`Ticket title must be at least ${TITLE_MIN} characters.`);
        error.statusCode = 400;
        throw error;
      }
      if (title.length > TITLE_MAX) {
        const error = new Error(`Ticket title must be at most ${TITLE_MAX} characters.`);
        error.statusCode = 400;
        throw error;
      }
      data.st_title = title.slice(0, TITLE_MAX);
    }
    if (payload.st_body !== undefined) {
      const body = String(payload.st_body || "").trim();
      if (!body || body.length < BODY_MIN) {
        const error = new Error(`Description must be at least ${BODY_MIN} characters.`);
        error.statusCode = 400;
        throw error;
      }
      if (body.length > BODY_MAX) {
        const error = new Error(`Description must be at most ${BODY_MAX} characters.`);
        error.statusCode = 400;
        throw error;
      }
      data.st_body = body.slice(0, BODY_MAX);
    }

    const hasFieldUpdates =
      data.st_title !== undefined ||
      data.st_body !== undefined ||
      data.st_priority !== undefined ||
      data.st_owner_status !== undefined ||
      data.st_admin_status !== undefined ||
      data.st_expected_delivery_at !== undefined;

    if (!hasFieldUpdates) {
      const error = new Error("No valid fields to update.");
      error.statusCode = 400;
      throw error;
    }

    const historyLines = this.collectTicketUpdateHistory(ticket, data, { authorRole: "Admin" });

    await masterPrisma.supportTicket.update({
      where: { st_id: ticket.st_id },
      data,
    });

    if (historyLines.length) {
      await this.appendTicketHistoryLines(ticket, {
        role: "Admin",
        uuid: admin.admin_uuid,
        name: this.formatAdminName(admin),
      }, historyLines);
    }

    return this.getTicketForAdmin(uuid);
  }

  async addAdminComment(admin, ticketUuid, bodyText, files = []) {
    const text = String(bodyText || "").trim();
    const uploadFiles = Array.isArray(files) ? files.filter(Boolean) : [];
    if (!text && !uploadFiles.length) {
      const error = new Error("Add a message or attach at least one image.");
      error.statusCode = 400;
      throw error;
    }

    const ticket = await masterPrisma.supportTicket.findFirst({
      where: { st_uuid: ticketUuid, st_is_deleted: false },
    });
    if (!ticket) {
      const error = new Error("Support ticket not found.");
      error.statusCode = 404;
      throw error;
    }

    const comment = await masterPrisma.supportTicketComment.create({
      data: {
        st_st_id: ticket.st_id,
        stc_kind: "Message",
        stc_audience: "Admin",
        stc_author_role: "Admin",
        stc_author_uuid: admin.admin_uuid,
        stc_author_name: this.formatAdminName(admin),
        stc_body: text || "Shared image(s)",
      },
    });

    if (uploadFiles.length) {
      const images = await this.attachImagesToComment(
        ticket.st_own_id,
        comment.stc_id,
        uploadFiles
      );
      await masterPrisma.supportTicketComment.update({
        where: { stc_id: comment.stc_id },
        data: { stc_images: images },
      });
    }

    await masterPrisma.supportTicket.update({
      where: { st_id: ticket.st_id },
      data: { st_updated_by: admin.admin_login_id },
    });

    return this.getTicketForAdmin(ticketUuid);
  }

  async updateAdminComment(
    admin,
    ticketUuid,
    commentUuid,
    bodyText,
    files = [],
    removePaths = []
  ) {
    const uploadFiles = Array.isArray(files) ? files.filter(Boolean) : [];
    const pathsToRemove = this.parseRemoveImagePaths(removePaths);

    const ticket = await masterPrisma.supportTicket.findFirst({
      where: { st_uuid: ticketUuid, st_is_deleted: false },
    });
    if (!ticket) {
      const error = new Error("Support ticket not found.");
      error.statusCode = 404;
      throw error;
    }

    const comment = await masterPrisma.supportTicketComment.findFirst({
      where: {
        stc_uuid: commentUuid,
        st_st_id: ticket.st_id,
        stc_author_role: "Admin",
        stc_author_uuid: admin.admin_uuid,
      },
    });
    if (!comment) {
      const error = new Error("Comment not found or you cannot edit it.");
      error.statusCode = 404;
      throw error;
    }
    if (comment.stc_kind === "History") {
      const error = new Error("This activity entry cannot be edited.");
      error.statusCode = 400;
      throw error;
    }

    let images = await this.removeImagesByPaths(comment.stc_images, pathsToRemove);
    const existingCount = images.length;

    if (uploadFiles.length) {
      if (existingCount + uploadFiles.length > MAX_COMMENT_IMAGES) {
        const error = new Error(`Maximum ${MAX_COMMENT_IMAGES} images per comment.`);
        error.statusCode = 400;
        throw error;
      }
      const added = await this.attachImagesToComment(
        ticket.st_own_id,
        comment.stc_id,
        uploadFiles
      );
      images = [...images, ...added];
    }

    const text =
      bodyText !== undefined && bodyText !== null
        ? String(bodyText).trim()
        : String(comment.stc_body || "").trim();

    if (!text && !images.length) {
      const error = new Error("Comment must include text or at least one image.");
      error.statusCode = 400;
      throw error;
    }

    await masterPrisma.supportTicketComment.update({
      where: { stc_id: comment.stc_id },
      data: {
        stc_body: text || "Shared image(s)",
        stc_images: images.length ? images : null,
      },
    });

    await masterPrisma.supportTicket.update({
      where: { st_id: ticket.st_id },
      data: { st_updated_by: admin.admin_login_id },
    });

    return this.getTicketForAdmin(ticketUuid);
  }
}

module.exports = new SupportService();
