"use strict";

const path = require("path");
const { getTenantPrisma } = require("../../../utils/tenantPrisma");
const imageService = require("../../../utils/image.service");
const whatsappService = require("../../../common/service/whatsapp.service");
const {
  seedMessageTemplatesForFirm,
} = require("../../../prisma/seeder/message-template-seeder");

const mapTemplate = (row) => {
  if (!row) return null;
  return {
    id: row.mt_uuid,
    uuid: row.mt_uuid,
    firmId: row.mt_firm_id,
    ownId: row.mt_own_id,
    channel: row.mt_channel,
    key: row.mt_key,
    name: row.mt_name,
    category: row.mt_category,
    language: row.mt_language,
    subject: row.mt_subject || "",
    body: row.mt_body,
    variables: row.mt_variables || [],
    attachments: row.mt_attachments || [],
    hasAttachment: Boolean(row.mt_has_attachment),
    isSystem: Boolean(row.mt_is_system),
    status: row.mt_status,
    updatedAt: row.mt_updated_at,
    createdAt: row.mt_created_at,
  };
};

const mapInstance = (row, { includeSecrets = false } = {}) => {
  if (!row) return null;
  const mapped = {
    id: row.wa_uuid,
    uuid: row.wa_uuid,
    firmId: row.wa_firm_id,
    ownId: row.wa_own_id,
    provider: row.wa_provider,
    instanceId: row.wa_instance_id || "",
    hasCredentials: Boolean(row.wa_instance_id && row.wa_token),
    apiUrl: row.wa_api_url || "",
    phoneNumber: row.wa_phone_number || "",
    status: row.wa_status,
    qrCode: row.wa_status === "Connected" ? "" : row.wa_qr_code || "",
    lastChecked: row.wa_last_checked,
    updatedAt: row.wa_updated_at,
  };
  if (includeSecrets) {
    mapped.token = row.wa_token || "";
    mapped.meta = row.wa_meta || {};
  }
  return mapped;
};

class MessagingService {
  async ensureFirmTemplates(dbUrl, { ownId, firmId, firmName }) {
    return seedMessageTemplatesForFirm(dbUrl, { ownId, firmId, firmName });
  }

  async getTemplates(dbUrl, { firmId, channel, ownId, firmName }) {
    const prisma = getTenantPrisma(dbUrl);
    const firmIdInt = parseInt(firmId, 10);

    await this.ensureFirmTemplates(dbUrl, {
      ownId: parseInt(ownId, 10),
      firmId: firmIdInt,
      firmName: firmName || "",
    });

    const where = {
      mt_firm_id: firmIdInt,
      mt_is_deleted: false,
    };
    if (channel) where.mt_channel = channel;

    const rows = await prisma.messageTemplate.findMany({
      where,
      orderBy: { mt_updated_at: "desc" },
    });
    return rows.map(mapTemplate);
  }

  async getTemplateByUuid(dbUrl, uuid) {
    const prisma = getTenantPrisma(dbUrl);
    const row = await prisma.messageTemplate.findFirst({
      where: { mt_uuid: uuid, mt_is_deleted: false },
    });
    return mapTemplate(row);
  }

  async createTemplate(dbUrl, data, files = []) {
    const prisma = getTenantPrisma(dbUrl);
    const firmId = parseInt(data.mt_firm_id, 10);
    const name = String(data.mt_name || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");

    if (!name) throw new Error("Template name is required");
    if (!data.mt_body || !String(data.mt_body).trim()) {
      throw new Error("Message body is required");
    }
    if (data.mt_channel === "email" && !String(data.mt_subject || "").trim()) {
      throw new Error("Email subject is required");
    }

    const duplicate = await prisma.messageTemplate.findFirst({
      where: {
        mt_firm_id: firmId,
        mt_channel: data.mt_channel,
        mt_name: name,
        mt_is_deleted: false,
      },
    });
    if (duplicate) throw new Error("A template with this name already exists");

    const created = await prisma.messageTemplate.create({
      data: {
        mt_own_id: parseInt(data.mt_own_id, 10),
        mt_firm_id: firmId,
        mt_channel: data.mt_channel,
        mt_key: data.mt_key || name,
        mt_name: name,
        mt_category: data.mt_category || "Transactional",
        mt_language: data.mt_language || "English (US)",
        mt_subject: data.mt_subject || null,
        mt_body: data.mt_body,
        mt_variables: data.mt_variables || [],
        mt_attachments: [],
        mt_has_attachment: Boolean(data.mt_has_attachment),
        mt_is_system: false,
        mt_status: data.mt_status || "Active",
        mt_created_by: data.mt_created_by || null,
      },
    });

    if (files && files.length) {
      return this._attachFiles(dbUrl, created.mt_uuid, files, data.mt_updated_by || data.mt_created_by);
    }

    return mapTemplate(created);
  }

  async updateTemplate(dbUrl, uuid, data, files = []) {
    const prisma = getTenantPrisma(dbUrl);
    const existing = await prisma.messageTemplate.findFirst({
      where: { mt_uuid: uuid, mt_is_deleted: false },
    });
    if (!existing) throw new Error("Template not found");

    // System templates keep fixed key/name so triggers (loan_created, staff_created, etc.) work
    const name = existing.mt_is_system
      ? existing.mt_name
      : data.mt_name
        ? String(data.mt_name).trim().toLowerCase().replace(/\s+/g, "_")
        : existing.mt_name;

    if (!existing.mt_is_system && name !== existing.mt_name) {
      const duplicate = await prisma.messageTemplate.findFirst({
        where: {
          mt_firm_id: existing.mt_firm_id,
          mt_channel: data.mt_channel || existing.mt_channel,
          mt_name: name,
          mt_is_deleted: false,
          NOT: { mt_uuid: uuid },
        },
      });
      if (duplicate) throw new Error("A template with this name already exists");
    }

    let attachments = existing.mt_attachments || [];
    if (data.clear_attachments === true || data.clear_attachments === "true") {
      attachments = [];
    } else if (data.mt_attachments) {
      try {
        attachments =
          typeof data.mt_attachments === "string"
            ? JSON.parse(data.mt_attachments)
            : data.mt_attachments;
      } catch {
        attachments = existing.mt_attachments || [];
      }
    }

    const updated = await prisma.messageTemplate.update({
      where: { mt_uuid: uuid },
      data: {
        mt_name: name,
        mt_category: data.mt_category ?? existing.mt_category,
        mt_language: data.mt_language ?? existing.mt_language,
        mt_subject: data.mt_subject !== undefined ? data.mt_subject || null : existing.mt_subject,
        mt_body: data.mt_body ?? existing.mt_body,
        mt_variables: data.mt_variables ?? existing.mt_variables,
        mt_attachments: attachments,
        mt_has_attachment:
          data.mt_has_attachment !== undefined
            ? Boolean(data.mt_has_attachment) || (Array.isArray(attachments) && attachments.length > 0)
            : Array.isArray(attachments) && attachments.length > 0
              ? true
              : existing.mt_has_attachment,
        mt_status: data.mt_status || existing.mt_status,
        mt_updated_by: data.mt_updated_by || null,
      },
    });

    if (files && files.length) {
      return this._attachFiles(dbUrl, uuid, files, data.mt_updated_by);
    }

    return mapTemplate(updated);
  }

  async _attachFiles(dbUrl, uuid, files, updatedBy) {
    const prisma = getTenantPrisma(dbUrl);
    const existing = await prisma.messageTemplate.findFirst({
      where: { mt_uuid: uuid, mt_is_deleted: false },
    });
    if (!existing) throw new Error("Template not found");

    const current = Array.isArray(existing.mt_attachments) ? [...existing.mt_attachments] : [];

    for (const file of files) {
      const meta = await imageService.moveSingleFile(
        existing.mt_own_id,
        "message-templates",
        existing.mt_id,
        file,
        "mt_attachment"
      );
      if (meta) current.push(meta);
    }

    const updated = await prisma.messageTemplate.update({
      where: { mt_uuid: uuid },
      data: {
        mt_attachments: current,
        mt_has_attachment: current.length > 0 || existing.mt_has_attachment,
        mt_updated_by: updatedBy || null,
      },
    });

    return mapTemplate(updated);
  }

  async deleteTemplate(dbUrl, uuid, deletedBy) {
    const prisma = getTenantPrisma(dbUrl);
    const existing = await prisma.messageTemplate.findFirst({
      where: { mt_uuid: uuid, mt_is_deleted: false },
    });
    if (!existing) throw new Error("Template not found");
    if (existing.mt_is_system) {
      throw new Error("System templates cannot be deleted. You can edit the message content only.");
    }

    await prisma.messageTemplate.update({
      where: { mt_uuid: uuid },
      data: {
        mt_is_deleted: true,
        mt_deleted_at: new Date(),
        mt_deleted_by: deletedBy || null,
        mt_status: "Inactive",
      },
    });

    return true;
  }

  async getWhatsAppInstance(dbUrl, firmId, { includeSecrets = false } = {}) {
    const prisma = getTenantPrisma(dbUrl);
    const row = await prisma.whatsAppInstance.findFirst({
      where: {
        wa_firm_id: parseInt(firmId, 10),
        wa_is_deleted: false,
      },
    });
    return mapInstance(row, { includeSecrets });
  }

  async saveWhatsAppInstance(dbUrl, data) {
    const prisma = getTenantPrisma(dbUrl);
    const firmId = parseInt(data.wa_firm_id, 10);
    const ownId = parseInt(data.wa_own_id, 10);

    const payload = {
      wa_own_id: ownId,
      wa_firm_id: firmId,
      wa_provider: data.wa_provider || "baileys",
      wa_instance_id: data.wa_instance_id || null,
      wa_token: data.wa_token || null,
      wa_api_url: data.wa_api_url || null,
      wa_phone_number: data.wa_phone_number || null,
      wa_status: data.wa_status || "Pending",
      wa_qr_code: data.wa_qr_code || null,
      wa_meta: data.wa_meta || {},
      wa_updated_by: data.wa_updated_by || null,
      wa_is_deleted: false,
      wa_deleted_at: null,
      wa_deleted_by: null,
    };

    const existing = await prisma.whatsAppInstance.findFirst({
      where: { wa_firm_id: firmId },
    });

    let row;
    if (existing) {
      row = await prisma.whatsAppInstance.update({
        where: { wa_id: existing.wa_id },
        data: payload,
      });
    } else {
      row = await prisma.whatsAppInstance.create({
        data: {
          ...payload,
          wa_created_by: data.wa_created_by || null,
        },
      });
    }

    return mapInstance(row);
  }

  _ownDbFromUrl(dbUrl) {
    try {
      return String(dbUrl || "").split("/").filter(Boolean).pop() || "tenant";
    } catch {
      return "tenant";
    }
  }

  /**
   * Mobile-number flow (local Baileys — no UltraMsg token):
   * 1) validate phone
   * 2) start local WhatsApp Web session for this firm
   * 3) return QR for scanning
   * 4) after scan, session is ready to send
   */
  async makeWhatsAppInstance(dbUrl, { firmId, ownId, firmName, actor, phoneNumber, reset = false }) {
    const phone = whatsappService.normalizePhone(phoneNumber);
    if (!phone || phone.length < 10) {
      return {
        success: false,
        code: "INVALID_PHONE",
        message: "Enter a valid WhatsApp mobile number (with country code, e.g. 9198XXXXXXXX).",
        instance: await this.getWhatsAppInstance(dbUrl, firmId),
      };
    }

    const ownDb = this._ownDbFromUrl(dbUrl);
    const existing = await this.getWhatsAppInstance(dbUrl, firmId);
    const shouldReset = Boolean(reset) || existing?.status === "Disconnected" || existing?.status === "Error";

    const createResult = await whatsappService.startSession({
      ownDb,
      firmId,
      phoneNumber: phone,
      reset: shouldReset,
    });

    if (!createResult.success) {
      return {
        success: false,
        code: createResult.code,
        message: createResult.message,
        instance: await this.getWhatsAppInstance(dbUrl, firmId),
      };
    }

    const saved = await this.saveWhatsAppInstance(dbUrl, {
      wa_firm_id: firmId,
      wa_own_id: ownId,
      wa_provider: "baileys",
      wa_instance_id: createResult.instanceId,
      wa_token: createResult.token || "local",
      wa_phone_number: phone,
      wa_status: createResult.status || "Pending",
      wa_qr_code: createResult.qrCode || null,
      wa_meta: {
        provider: "baileys",
        linkedPhone: phone,
        firmName: firmName || null,
        connectedPhone: createResult.connectedPhone || null,
      },
      wa_created_by: actor,
      wa_updated_by: actor,
    });

    const prisma = getTenantPrisma(dbUrl);
    const live = whatsappService.getSessionState(createResult.instanceId);
    const updated = await prisma.whatsAppInstance.update({
      where: { wa_uuid: saved.uuid },
      data: {
        wa_status: live.status || saved.status || "Pending",
        wa_qr_code: live.status === "Connected" ? null : live.qrCode || createResult.qrCode || null,
        wa_phone_number: phone,
        wa_last_checked: new Date(),
      },
    });

    return {
      success: true,
      message:
        live.status === "Connected"
          ? `WhatsApp already connected for ${phone}.`
          : `Scan the QR with WhatsApp on ${phone} to connect this firm.`,
      instance: mapInstance(updated),
      autoCreate: true,
    };
  }

  async refreshWhatsAppStatus(dbUrl, firmId) {
    const prisma = getTenantPrisma(dbUrl);
    const row = await prisma.whatsAppInstance.findFirst({
      where: { wa_firm_id: parseInt(firmId, 10), wa_is_deleted: false },
    });
    if (!row) {
      return { success: false, message: "No WhatsApp instance configured for this firm" };
    }

    const ownDb = this._ownDbFromUrl(dbUrl);
    const instanceId = row.wa_instance_id || whatsappService.sessionKey(ownDb, firmId);

    await whatsappService.getStatus({ instanceId, ownDb, firmId });
    const live = whatsappService.getSessionState(instanceId);
    const status = live.status || "Pending";
    const qrCode = status === "Connected" ? null : live.qrCode || null;

    const updated = await prisma.whatsAppInstance.update({
      where: { wa_uuid: row.wa_uuid },
      data: {
        wa_instance_id: instanceId,
        wa_token: row.wa_token || "local",
        wa_provider: "baileys",
        wa_status: status,
        wa_qr_code: qrCode,
        wa_phone_number: live.connectedPhone || row.wa_phone_number,
        wa_last_checked: new Date(),
        wa_meta: {
          ...(row.wa_meta || {}),
          connectedPhone: live.connectedPhone || null,
          lastStatusRaw: status,
        },
      },
    });

    return {
      success: true,
      instance: mapInstance(updated),
      providerMessage: live.lastError || null,
    };
  }

  async disconnectWhatsApp(dbUrl, firmId, actor) {
    const prisma = getTenantPrisma(dbUrl);
    const existing = await prisma.whatsAppInstance.findFirst({
      where: { wa_firm_id: parseInt(firmId, 10), wa_is_deleted: false },
    });
    if (!existing) throw new Error("No WhatsApp instance found");

    const ownDb = this._ownDbFromUrl(dbUrl);
    await whatsappService.logout({
      instanceId: existing.wa_instance_id,
      ownDb,
      firmId,
    });

    const updated = await prisma.whatsAppInstance.update({
      where: { wa_id: existing.wa_id },
      data: {
        wa_status: "Disconnected",
        wa_qr_code: null,
        wa_updated_by: actor || null,
        wa_last_checked: new Date(),
      },
    });

    return mapInstance(updated);
  }

  resolveAttachmentPaths(attachments = []) {
    const root = path.join(__dirname, "../../../");
    return (attachments || [])
      .filter((a) => a && a.path)
      .map((a) => ({
        filename: a.originalName || a.filename,
        path: path.join(root, a.path),
        contentType: a.mimetype,
      }));
  }
}

module.exports = new MessagingService();
