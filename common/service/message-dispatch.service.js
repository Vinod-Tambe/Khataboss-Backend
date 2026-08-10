"use strict";

const fs = require("fs");
const path = require("path");
const { getTenantPrisma } = require("../../utils/tenantPrisma");
const whatsappService = require("./whatsapp.service");
const emailService = require("./email.service");

function stripHtml(html) {
  return String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function renderTemplate(text, vars = {}) {
  let out = String(text || "");
  for (const [key, val] of Object.entries(vars)) {
    const safe = val == null ? "" : String(val);
    if (key === "firm_name") {
      out = out.replace(/\{\{firm_name\}\}/g, safe);
    } else {
      out = out.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), safe);
    }
  }
  return out;
}

function isEmailConfiguredForOwner(dbUrl, ownId) {
  return emailService.isConfigured(dbUrl, ownId);
}

class MessageDispatchService {
  ownDbFromUrl(dbUrl) {
    try {
      return String(dbUrl || "")
        .split("/")
        .filter(Boolean)
        .pop() || "tenant";
    } catch {
      return "tenant";
    }
  }

  async getTemplate(prisma, firmId, channel, templateKey) {
    return prisma.messageTemplate.findFirst({
      where: {
        mt_firm_id: parseInt(firmId, 10),
        mt_channel: channel,
        mt_key: templateKey,
        mt_is_deleted: false,
        mt_status: "Active",
      },
    });
  }

  async logMessage(prisma, data) {
    try {
      if (!prisma.messageLog) return;
      await prisma.messageLog.create({ data });
    } catch (err) {
      console.warn("[messaging] log skipped:", err.message);
    }
  }

  async syncWhatsAppInstance(prisma, firmId, ownDb) {
    const firmIdInt = parseInt(firmId, 10);
    const row = await prisma.whatsAppInstance.findFirst({
      where: { wa_firm_id: firmIdInt, wa_is_deleted: false },
    });
    if (!row) {
      return { connected: false, instanceId: whatsappService.sessionKey(ownDb, firmIdInt) };
    }

    const instanceId = row.wa_instance_id || whatsappService.sessionKey(ownDb, firmIdInt);
    await whatsappService.getStatus({ instanceId, ownDb, firmId: firmIdInt });

    const started = Date.now();
    while (Date.now() - started < 8000) {
      const live = whatsappService.getSessionState(instanceId);
      if (live.status === "Connected") break;
      await new Promise((r) => setTimeout(r, 400));
    }

    const live = whatsappService.getSessionState(instanceId);
    const status = live.status || "Pending";

    if (status !== row.wa_status || (status === "Connected" && row.wa_qr_code)) {
      await prisma.whatsAppInstance.update({
        where: { wa_id: row.wa_id },
        data: {
          wa_status: status,
          wa_qr_code: status === "Connected" ? null : live.qrCode || row.wa_qr_code,
          wa_phone_number: live.connectedPhone || row.wa_phone_number,
          wa_last_checked: new Date(),
        },
      });
    }

    return {
      connected: status === "Connected",
      instanceId,
      phone: row.wa_phone_number,
    };
  }

  async dispatchMessage({
    dbUrl,
    ownDb,
    firmId,
    templateKey,
    toPhone,
    toEmail,
    vars = {},
    documentPath,
    documentFilename,
    actor,
    sendWhatsApp = true,
    sendEmail = true,
  }) {
    const prisma = getTenantPrisma(dbUrl);
    const ownDbName = ownDb || this.ownDbFromUrl(dbUrl);
    const firmIdInt = parseInt(firmId, 10);

    const firm = await prisma.firm.findFirst({
      where: { firm_id: firmIdInt, firm_is_deleted: false },
      select: { firm_id: true, firm_own_id: true, firm_name: true },
    });

    const firmName = firm?.firm_name || vars.firm_name || "";
    const mergedVars = { ...vars, firm_name: firmName };
    const ownId = firm?.firm_own_id || vars.own_id || 0;

    const results = { whatsapp: null, email: null };

    if (sendWhatsApp && toPhone) {
      const tpl = await this.getTemplate(prisma, firmIdInt, "whatsapp", templateKey);
      if (!tpl) {
        results.whatsapp = {
          success: false,
          skipped: true,
          message: `WhatsApp template "${templateKey}" not found`,
        };
      } else {
        const wa = await this.syncWhatsAppInstance(prisma, firmIdInt, ownDbName);
        if (!wa.connected) {
          results.whatsapp = {
            success: false,
            skipped: true,
            message: "WhatsApp is not connected. Scan QR from WhatsApp Settings.",
          };
          await this.logMessage(prisma, {
            ml_own_id: ownId,
            ml_firm_id: firmIdInt,
            ml_channel: "whatsapp",
            ml_template_key: templateKey,
            ml_to: String(toPhone),
            ml_status: "skipped",
            ml_error: results.whatsapp.message,
            ml_meta: { actor: actor || null },
          });
        } else {
          const body = renderTemplate(tpl.mt_body, mergedVars);
          const plainBody = stripHtml(body);
          try {
            const r = await whatsappService.sendChat({
              instanceId: wa.instanceId,
              ownDb: ownDbName,
              firmId: firmIdInt,
              to: toPhone,
              body: plainBody,
              documentPath,
              filename: documentFilename,
            });
            results.whatsapp = r;
            await this.logMessage(prisma, {
              ml_own_id: ownId,
              ml_firm_id: firmIdInt,
              ml_channel: "whatsapp",
              ml_template_key: templateKey,
              ml_to: String(toPhone),
              ml_status: r.success ? "sent" : "failed",
              ml_error: r.success ? null : r.message || "send failed",
              ml_meta: { actor: actor || null, hasDocument: Boolean(documentPath) },
            });
          } catch (err) {
            results.whatsapp = { success: false, message: err.message };
            await this.logMessage(prisma, {
              ml_own_id: ownId,
              ml_firm_id: firmIdInt,
              ml_channel: "whatsapp",
              ml_template_key: templateKey,
              ml_to: String(toPhone),
              ml_status: "failed",
              ml_error: err.message,
              ml_meta: { actor: actor || null },
            });
          }
        }
      }
    }

    if (sendEmail && toEmail) {
      const emailReady = await isEmailConfiguredForOwner(dbUrl, ownId);
      if (!emailReady) {
        results.email = {
          success: false,
          skipped: true,
          message: "Email is not configured. Open Email Settings and save Gmail credentials.",
        };
      } else {
      const tpl = await this.getTemplate(prisma, firmIdInt, "email", templateKey);
      if (!tpl) {
        results.email = {
          success: false,
          skipped: true,
          message: `Email template "${templateKey}" not found`,
        };
      } else {
        const subject = renderTemplate(tpl.mt_subject || "Notification", mergedVars);
        const html = renderTemplate(tpl.mt_body, mergedVars);
        const attachments = [];
        if (documentPath && fs.existsSync(documentPath)) {
          attachments.push({
            filename: documentFilename || path.basename(documentPath),
            path: documentPath,
          });
        }
        try {
          const info = await emailService.sendHtmlEmail(toEmail, subject, html, attachments, {
            ownId,
            dbUrl,
          });
          results.email = { success: true, messageId: info.messageId };
          await this.logMessage(prisma, {
            ml_own_id: ownId,
            ml_firm_id: firmIdInt,
            ml_channel: "email",
            ml_template_key: templateKey,
            ml_to: String(toEmail),
            ml_status: "sent",
            ml_error: null,
            ml_meta: { actor: actor || null, messageId: info.messageId },
          });
        } catch (err) {
          results.email = { success: false, message: err.message };
          await this.logMessage(prisma, {
            ml_own_id: ownId,
            ml_firm_id: firmIdInt,
            ml_channel: "email",
            ml_template_key: templateKey,
            ml_to: String(toEmail),
            ml_status: "failed",
            ml_error: err.message,
            ml_meta: { actor: actor || null },
          });
        }
      }
      }
    }

    return results;
  }

  dispatchSafe(opts) {
    return this.dispatchMessage(opts).catch((err) => {
      console.warn(`[messaging] dispatch ${opts.templateKey} failed:`, err.message);
      return { error: err.message };
    });
  }
}

module.exports = new MessageDispatchService();
