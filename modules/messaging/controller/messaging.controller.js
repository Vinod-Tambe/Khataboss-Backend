"use strict";

const messagingService = require("../service/messaging.service");
const messageDispatchService = require("../../../common/service/message-dispatch.service");
const ownerMailService = require("../../../common/service/owner-mail.service");
const emailService = require("../../../common/service/email.service");
const whatsappService = require("../../../common/service/whatsapp.service");
const messageFormat = require("../../../common/service/message-format.service");
const { getTenantPrisma } = require("../../../utils/tenantPrisma");
const { BASE_URL } = require("../../../config/db");

const DEFAULT_TEST_VARS = {
  1: "Jane Doe",
  2: "7890",
  3: "4,500.00",
  4: () => new Date().toLocaleDateString("en-IN"),
};

class MessagingController {
  getDbUrl(dbName) {
    return `${BASE_URL}/${dbName}`;
  }

  async _resolveFirm(dbUrl, firmId) {
    const prisma = getTenantPrisma(dbUrl);
    return prisma.firm.findFirst({
      where: { firm_id: parseInt(firmId, 10), firm_is_deleted: false },
      select: { firm_id: true, firm_own_id: true, firm_name: true },
    });
  }

  _renderTemplate(text, vars = {}) {
    let out = String(text || "");
    for (const [key, val] of Object.entries(vars)) {
      const safe = val == null ? "" : String(typeof val === "function" ? val() : val);
      if (key === "firm_name") {
        out = out.replace(/\{\{firm_name\}\}/g, safe);
      } else {
        out = out.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), safe);
      }
    }
    return out;
  }

  _buildTestVars(firmName = "", customVars = {}) {
    const base = {};
    for (const [key, val] of Object.entries(DEFAULT_TEST_VARS)) {
      base[key] = typeof val === "function" ? val() : val;
    }
    base.firm_name = firmName;
    return { ...base, ...(customVars && typeof customVars === "object" ? customVars : {}) };
  }

  _defaultTestEmail(req) {
    return req.user.staff_email || req.user.own_email || "";
  }

  _defaultTestPhone(req) {
    return (
      req.user.ownerProfile?.own_mobile_no ||
      req.user.staffProfile?.staff_mobile_no ||
      ""
    );
  }

  async _logTestMessage(dbUrl, payload) {
    try {
      const prisma = getTenantPrisma(dbUrl);
      await messageDispatchService.logMessage(prisma, payload);
    } catch {
      /* non-blocking */
    }
  }

  async getTemplates(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const { firmId, channel } = req.query;

      if (!firmId || firmId === "all") {
        return res.status(400).json({
          success: false,
          message: "Please select a firm to manage message templates.",
        });
      }

      const firm = await this._resolveFirm(dbUrl, firmId);
      if (!firm) {
        return res.status(404).json({ success: false, message: "Firm not found" });
      }

      const templates = await messagingService.getTemplates(dbUrl, {
        firmId: firm.firm_id,
        channel: channel || undefined,
        ownId: firm.firm_own_id || req.user.own_id,
        firmName: firm.firm_name,
      });

      return res.status(200).json({
        success: true,
        message: "Templates fetched successfully",
        data: templates,
      });
    } catch (error) {
      console.error("Get Templates Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch templates",
        error: error.message,
      });
    }
  }

  async createTemplate(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const firmId = req.body.firmId || req.body.mt_firm_id;
      if (!firmId) {
        return res.status(400).json({ success: false, message: "firmId is required" });
      }

      const firm = await this._resolveFirm(dbUrl, firmId);
      if (!firm) {
        return res.status(404).json({ success: false, message: "Firm not found" });
      }

      let variables = req.body.variables || req.body.mt_variables || [];
      if (typeof variables === "string") {
        try {
          variables = JSON.parse(variables);
        } catch {
          variables = [];
        }
      }

      const files = req.files || (req.file ? [req.file] : []);
      const template = await messagingService.createTemplate(
        dbUrl,
        {
          mt_own_id: firm.firm_own_id || req.user.own_id,
          mt_firm_id: firm.firm_id,
          mt_channel: req.body.channel || req.body.mt_channel,
          mt_name: req.body.name || req.body.mt_name,
          mt_category: req.body.category || req.body.mt_category,
          mt_language: req.body.language || req.body.mt_language,
          mt_subject: req.body.subject || req.body.mt_subject,
          mt_body: req.body.body || req.body.mt_body,
          mt_variables: variables,
          mt_has_attachment:
            req.body.hasAttachment === true ||
            req.body.hasAttachment === "true" ||
            req.body.mt_has_attachment === true ||
            req.body.mt_has_attachment === "true" ||
            files.length > 0,
          mt_status: req.body.status || "Active",
          mt_created_by: req.user?.user_name || req.user?.own_login_id || "owner",
        },
        files
      );

      return res.status(201).json({
        success: true,
        message: "Template created successfully",
        data: template,
      });
    } catch (error) {
      console.error("Create Template Error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to create template",
      });
    }
  }

  async updateTemplate(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const { uuid } = req.params;

      let variables = req.body.variables || req.body.mt_variables;
      if (typeof variables === "string") {
        try {
          variables = JSON.parse(variables);
        } catch {
          variables = undefined;
        }
      }

      const files = req.files || (req.file ? [req.file] : []);
      const template = await messagingService.updateTemplate(
        dbUrl,
        uuid,
        {
          mt_name: req.body.name || req.body.mt_name,
          mt_category: req.body.category || req.body.mt_category,
          mt_language: req.body.language || req.body.mt_language,
          mt_subject: req.body.subject !== undefined ? req.body.subject : req.body.mt_subject,
          mt_channel: req.body.channel || req.body.mt_channel,
          mt_body: req.body.body || req.body.mt_body,
          mt_variables: variables,
          mt_has_attachment: req.body.hasAttachment ?? req.body.mt_has_attachment,
          mt_status: req.body.status || req.body.mt_status,
          clear_attachments: req.body.clearAttachments || req.body.clear_attachments,
          mt_attachments: req.body.attachments || req.body.mt_attachments,
          mt_updated_by: req.user?.user_name || req.user?.own_login_id || "owner",
        },
        files
      );

      return res.status(200).json({
        success: true,
        message: "Template updated successfully",
        data: template,
      });
    } catch (error) {
      console.error("Update Template Error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to update template",
      });
    }
  }

  async deleteTemplate(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      await messagingService.deleteTemplate(
        dbUrl,
        req.params.uuid,
        req.user?.user_name || req.user?.own_login_id || "owner"
      );
      return res.status(200).json({
        success: true,
        message: "Template deleted successfully",
      });
    } catch (error) {
      console.error("Delete Template Error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to delete template",
      });
    }
  }

  async getWhatsAppSettings(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const { firmId } = req.query;
      if (!firmId || firmId === "all") {
        return res.status(400).json({
          success: false,
          message: "Please select a firm for WhatsApp settings.",
        });
      }

      const instance = await messagingService.getWhatsAppInstance(dbUrl, firmId);
      return res.status(200).json({
        success: true,
        data: instance,
        autoCreateAvailable: whatsappService.isAutoCreateAvailable(),
      });
    } catch (error) {
      console.error("Get WhatsApp Settings Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch WhatsApp settings",
      });
    }
  }

  async saveWhatsAppSettings(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const firmId = req.body.firmId;
      if (!firmId) {
        return res.status(400).json({ success: false, message: "firmId is required" });
      }

      const firm = await this._resolveFirm(dbUrl, firmId);
      if (!firm) {
        return res.status(404).json({ success: false, message: "Firm not found" });
      }

      const instance = await messagingService.saveWhatsAppInstance(dbUrl, {
        wa_firm_id: firm.firm_id,
        wa_own_id: firm.firm_own_id || req.user.own_id,
        wa_provider: req.body.provider || "ultramsg",
        wa_instance_id: req.body.instanceId,
        wa_token: req.body.token,
        wa_api_url: req.body.apiUrl,
        wa_phone_number: req.body.phoneNumber,
        wa_status: req.body.status || "Pending",
        wa_created_by: req.user?.user_name || req.user?.own_login_id || "owner",
        wa_updated_by: req.user?.user_name || req.user?.own_login_id || "owner",
      });

      return res.status(200).json({
        success: true,
        message: "WhatsApp settings saved",
        data: instance,
      });
    } catch (error) {
      console.error("Save WhatsApp Settings Error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to save WhatsApp settings",
      });
    }
  }

  async makeWhatsAppInstance(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const firmId = req.body.firmId;
      const phoneNumber = req.body.phoneNumber || req.body.mobileNo || req.body.mobile;
      if (!firmId) {
        return res.status(400).json({ success: false, message: "firmId is required" });
      }
      if (!phoneNumber) {
        return res.status(400).json({
          success: false,
          message: "Mobile number is required to create WhatsApp instance",
        });
      }

      const firm = await this._resolveFirm(dbUrl, firmId);
      if (!firm) {
        return res.status(404).json({ success: false, message: "Firm not found" });
      }

      const result = await messagingService.makeWhatsAppInstance(dbUrl, {
        firmId: firm.firm_id,
        ownId: firm.firm_own_id || req.user.own_id,
        firmName: firm.firm_name,
        actor: req.user?.user_name || req.user?.own_login_id || "owner",
        phoneNumber,
        reset: req.body.reset === true || req.body.reset === "true",
      });

      if (!result.success) {
        return res.status(200).json({
          success: false,
          code: result.code,
          message: result.message,
          data: result.instance,
        });
      }

      return res.status(201).json({
        success: true,
        message: result.message,
        data: result.instance,
      });
    } catch (error) {
      console.error("Make WhatsApp Instance Error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to create WhatsApp instance",
      });
    }
  }

  async refreshWhatsAppStatus(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const firmId = req.query.firmId || req.body.firmId;
      if (!firmId) {
        return res.status(400).json({ success: false, message: "firmId is required" });
      }

      const result = await messagingService.refreshWhatsAppStatus(dbUrl, firmId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Refresh WhatsApp Status Error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to refresh WhatsApp status",
      });
    }
  }

  async disconnectWhatsApp(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const firmId = req.body.firmId;
      if (!firmId) {
        return res.status(400).json({ success: false, message: "firmId is required" });
      }

      const instance = await messagingService.disconnectWhatsApp(
        dbUrl,
        firmId,
        req.user?.user_name || req.user?.own_login_id || "owner"
      );

      return res.status(200).json({
        success: true,
        message: "WhatsApp instance marked disconnected",
        data: instance,
      });
    } catch (error) {
      console.error("Disconnect WhatsApp Error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to disconnect WhatsApp",
      });
    }
  }

  /**
   * Optional send helpers — never used as hard blockers in UI.
   */
  async sendTestEmail(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const { to, subject, body, attachments } = req.body;
      if (!to || !subject || !body) {
        return res.status(400).json({
          success: false,
          message: "to, subject and body are required",
        });
      }

      const configured = await ownerMailService.isConfigured(dbUrl, req.user.own_id);
      if (!configured) {
        return res.status(400).json({
          success: false,
          message: "Configure Email Settings first (Gmail address + app password).",
        });
      }

      const info = await emailService.sendHtmlEmail(to, subject, body, attachments || [], {
        ownId: req.user.own_id,
        dbUrl,
        firmName: req.body.firmName || "",
      });
      return res.status(200).json({
        success: true,
        message: "Email sent",
        data: { messageId: info.messageId },
      });
    } catch (error) {
      console.error("Send Test Email Error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to send email",
      });
    }
  }

  async getEmailSettings(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const settings = await ownerMailService.getSettings(dbUrl, req.user.own_id);
      return res.status(200).json({
        success: true,
        data: settings,
      });
    } catch (error) {
      console.error("Get Email Settings Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to load email settings",
      });
    }
  }

  async saveEmailSettings(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const { email, password, fromName, provider } = req.body;
      const settings = await ownerMailService.saveSettings(
        dbUrl,
        req.user.own_id,
        { email, password, fromName, provider },
        req.user?.user_name || req.user?.own_login_id || "owner"
      );
      const verify = await ownerMailService.verifySettings(dbUrl, req.user.own_id);
      return res.status(200).json({
        success: verify.success,
        message: verify.success
          ? "Email settings saved and verified"
          : verify.message || "Saved but verification failed — check app password",
        data: settings,
        verified: verify.success,
      });
    } catch (error) {
      console.error("Save Email Settings Error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to save email settings",
      });
    }
  }

  async testEmailSettings(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const to = req.body.to || req.user.own_email;
      if (!to) {
        return res.status(400).json({
          success: false,
          message: "Recipient email (to) is required",
        });
      }

      const configured = await ownerMailService.isConfigured(dbUrl, req.user.own_id);
      if (!configured) {
        return res.status(400).json({
          success: false,
          message: "Save Gmail credentials in Email Settings first.",
        });
      }

      const firm = await this._resolveFirm(dbUrl, req.query.firmId || req.body.firmId);
      const firmName = firm?.firm_name || "";

      const info = await emailService.sendHtmlEmail(
        to,
        "KhataBoss — test email",
        "<p>Hello,</p><p>This is a <strong>test email</strong> from your KhataBoss account. Email settings are working correctly.</p>",
        [],
        { ownId: req.user.own_id, dbUrl, firmName }
      );

      return res.status(200).json({
        success: true,
        message: `Test email sent to ${to}`,
        data: { messageId: info.messageId },
      });
    } catch (error) {
      console.error("Test Email Settings Error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to send test email",
      });
    }
  }

  async clearEmailSettings(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const settings = await ownerMailService.clearSettings(
        dbUrl,
        req.user.own_id,
        req.user?.user_name || req.user?.own_login_id || "owner"
      );
      return res.status(200).json({
        success: true,
        message: "Email settings cleared",
        data: settings,
      });
    } catch (error) {
      console.error("Clear Email Settings Error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to clear email settings",
      });
    }
  }

  async sendWhatsApp(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const { firmId, to, body, documentUrl, filename } = req.body;
      if (!firmId || !to || !body) {
        return res.status(400).json({
          success: false,
          message: "firmId, to and body are required",
        });
      }

      const refresh = await messagingService.refreshWhatsAppStatus(dbUrl, firmId);
      const instance = refresh.instance || (await messagingService.getWhatsAppInstance(dbUrl, firmId, {
        includeSecrets: true,
      }));
      if (!instance || !instance.instanceId) {
        return res.status(400).json({
          success: false,
          message: "Configure WhatsApp instance for this firm first",
        });
      }
      if (instance.status !== "Connected") {
        return res.status(400).json({
          success: false,
          message: "WhatsApp is not connected yet. Scan QR from WhatsApp Settings.",
        });
      }

      const result = await whatsappService.sendChat({
        instanceId: instance.instanceId,
        ownDb: req.user.own_db,
        firmId,
        to,
        body: messageFormat.formatWhatsAppBody(body, {
          firmName: (await this._resolveFirm(dbUrl, firmId))?.firm_name || "",
        }),
        documentUrl,
        filename,
      });

      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error("Send WhatsApp Error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to send WhatsApp message",
      });
    }
  }

  async dispatchMessage(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const firmId = req.body.firmId || req.body.mt_firm_id;
      const templateKey = req.body.templateKey || req.body.template_key;
      const toPhone = req.body.toPhone || req.body.to || req.body.mobile;
      const toEmail = req.body.toEmail || req.body.email;

      if (!firmId || !templateKey) {
        return res.status(400).json({
          success: false,
          message: "firmId and templateKey are required",
        });
      }
      if (!toPhone && !toEmail) {
        return res.status(400).json({
          success: false,
          message: "toPhone or toEmail is required",
        });
      }

      const firm = await this._resolveFirm(dbUrl, firmId);
      if (!firm) {
        return res.status(404).json({ success: false, message: "Firm not found" });
      }

      let vars = req.body.vars || {};
      if (typeof vars === "string") {
        try {
          vars = JSON.parse(vars);
        } catch {
          vars = {};
        }
      }

      const sendWhatsApp =
        req.body.sendWhatsApp !== false &&
        req.body.sendWhatsApp !== "false" &&
        Boolean(toPhone);
      const sendEmail =
        req.body.sendEmail !== false &&
        req.body.sendEmail !== "false" &&
        Boolean(toEmail);

      const documentFile =
        req.file ||
        (Array.isArray(req.files) && req.files[0]) ||
        req.files?.document?.[0];

      let documentPath;
      let documentFilename;
      if (documentFile) {
        documentPath = documentFile.path;
        documentFilename = documentFile.originalname;
      }

      const results = await messageDispatchService.dispatchMessage({
        dbUrl,
        ownDb: req.user.own_db,
        firmId: firm.firm_id,
        templateKey,
        toPhone,
        toEmail,
        vars,
        documentPath,
        documentFilename,
        actor: req.user?.user_name || req.user?.own_login_id || "user",
        sendWhatsApp,
        sendEmail,
      });

      const sent =
        results.whatsapp?.success === true || results.email?.success === true;

      return res.status(sent ? 200 : 200).json({
        success: sent,
        message: sent
          ? "Message dispatched"
          : results.whatsapp?.message ||
            results.email?.message ||
            "Message could not be sent",
        data: results,
      });
    } catch (error) {
      console.error("Dispatch Message Error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to dispatch message",
      });
    }
  }

  /**
   * Send a test message using the current draft template body (before or after save).
   */
  async testTemplateSend(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const {
        firmId,
        channel,
        to,
        subject,
        body,
        templateName,
        templateKey,
      } = req.body;

      let customVars = req.body.vars || {};
      if (typeof customVars === "string") {
        try {
          customVars = JSON.parse(customVars);
        } catch {
          customVars = {};
        }
      }

      if (!firmId || !channel) {
        return res.status(400).json({
          success: false,
          message: "firmId and channel are required",
        });
      }
      if (!String(body || "").trim()) {
        return res.status(400).json({
          success: false,
          message: "Message body is required",
        });
      }

      const firm = await this._resolveFirm(dbUrl, firmId);
      if (!firm) {
        return res.status(404).json({ success: false, message: "Firm not found" });
      }

      const vars = this._buildTestVars(firm.firm_name, customVars);
      const safeBody = messageFormat.sanitizeTemplateBody(body, channel);
      const renderedBody = this._renderTemplate(safeBody, vars);
      const label = templateName || templateKey || "template";
      const actor = req.user?.staff_login_id
        ? `${req.user.own_login_id}+${req.user.staff_login_id}`
        : req.user?.own_login_id || "user";

      const templateUuid = req.body.templateUuid || req.body.template_uuid;
      const uploadFiles = req.files || (req.file ? [req.file] : []);
      const sendAttachments = await messagingService.collectSendAttachments(dbUrl, {
        templateUuid,
        templateKey,
        firmId: firm.firm_id,
        channel,
        uploadFiles,
      });
      const emailAttachments = sendAttachments.map((a) => ({
        filename: a.filename,
        content: a.content,
        contentType: a.contentType,
      }));

      if (channel === "email") {
        const recipient = String(to || this._defaultTestEmail(req)).trim();
        if (!recipient || !recipient.includes("@")) {
          return res.status(400).json({
            success: false,
            message: "Enter a valid recipient email for test send",
          });
        }
        const renderedSubject = this._renderTemplate(
          subject || `[Test] ${label} — {{firm_name}}`,
          vars
        );
        if (!renderedSubject.trim()) {
          return res.status(400).json({
            success: false,
            message: "Email subject is required",
          });
        }

        const configured = await ownerMailService.isConfigured(dbUrl, req.user.own_id);
        if (!configured) {
          return res.status(400).json({
            success: false,
            message: "Configure Email Settings first (Gmail address + app password).",
          });
        }

        const info = await emailService.sendHtmlEmail(
          recipient,
          renderedSubject,
          renderedBody,
          emailAttachments,
          {
            ownId: req.user.own_id,
            dbUrl,
            firmName: firm.firm_name,
            preheader: `[Test] ${label}`,
          }
        );

        await this._logTestMessage(dbUrl, {
          ml_own_id: firm.firm_own_id,
          ml_firm_id: firm.firm_id,
          ml_channel: "email",
          ml_template_key: templateKey || label,
          ml_to: recipient,
          ml_status: "sent",
          ml_error: null,
          ml_meta: { actor, test: true, messageId: info.messageId },
        });

        return res.status(200).json({
          success: true,
          message: `Test email sent to ${recipient}${
            emailAttachments.length ? ` with ${emailAttachments.length} attachment(s)` : ""
          }`,
          data: {
            messageId: info.messageId,
            preview: renderedBody,
            attachmentCount: emailAttachments.length,
          },
        });
      }

      if (channel === "whatsapp") {
        const recipient = String(to || this._defaultTestPhone(req)).trim();
        if (!recipient) {
          return res.status(400).json({
            success: false,
            message: "Enter a recipient mobile number for WhatsApp test",
          });
        }

        const refresh = await messagingService.refreshWhatsAppStatus(dbUrl, firmId);
        const instance =
          refresh.instance ||
          (await messagingService.getWhatsAppInstance(dbUrl, firmId, {
            includeSecrets: true,
          }));
        if (!instance?.instanceId) {
          return res.status(400).json({
            success: false,
            message: "Configure WhatsApp for this firm first (WhatsApp Settings).",
          });
        }
        if (instance.status !== "Connected") {
          return res.status(400).json({
            success: false,
            message: "WhatsApp is not connected. Scan QR from WhatsApp Settings.",
          });
        }

        const waBody = messageFormat.formatWhatsAppBody(renderedBody, {
          firmName: firm.firm_name,
        });

        const result = sendAttachments.length
          ? await whatsappService.sendChatWithAttachments({
              instanceId: instance.instanceId,
              ownDb: req.user.own_db,
              firmId: firm.firm_id,
              to: recipient,
              body: waBody,
              attachments: sendAttachments,
            })
          : await whatsappService.sendChat({
              instanceId: instance.instanceId,
              ownDb: req.user.own_db,
              firmId: firm.firm_id,
              to: recipient,
              body: waBody,
            });

        await this._logTestMessage(dbUrl, {
          ml_own_id: firm.firm_own_id,
          ml_firm_id: firm.firm_id,
          ml_channel: "whatsapp",
          ml_template_key: templateKey || label,
          ml_to: recipient,
          ml_status: result.success ? "sent" : "failed",
          ml_error: result.success ? null : result.message || "send failed",
          ml_meta: { actor, test: true, attachmentCount: sendAttachments.length },
        });

        if (!result.success) {
          return res.status(400).json({
            success: false,
            message: result.message || "Failed to send WhatsApp test message",
            data: { preview: waBody },
          });
        }

        return res.status(200).json({
          success: true,
          message: `Test WhatsApp sent to ${recipient}${
            sendAttachments.length ? ` with ${sendAttachments.length} attachment(s)` : ""
          }`,
          data: { preview: waBody, attachmentCount: sendAttachments.length },
        });
      }

      if (channel === "sms") {
        const recipient = String(to || this._defaultTestPhone(req)).trim();
        if (!recipient) {
          return res.status(400).json({
            success: false,
            message: "Enter a recipient mobile number for SMS test",
          });
        }

        const hasHtml = /<[a-z][\s\S]*>/i.test(renderedBody);
        const smsBody = hasHtml
          ? messageFormat.htmlToPlainText(renderedBody)
          : renderedBody.trim();
        const parts = Math.max(1, Math.ceil(smsBody.length / 160));

        await this._logTestMessage(dbUrl, {
          ml_own_id: firm.firm_own_id,
          ml_firm_id: firm.firm_id,
          ml_channel: "sms",
          ml_template_key: templateKey || label,
          ml_to: recipient,
          ml_status: "preview",
          ml_error: "SMS gateway not configured",
          ml_meta: { actor, test: true, parts, preview: smsBody },
        });

        return res.status(200).json({
          success: true,
          preview: true,
          message:
            "SMS formatted successfully. SMS gateway is not connected — delivery preview only.",
          data: {
            to: recipient,
            formattedBody: smsBody,
            parts,
            characters: smsBody.length,
          },
        });
      }

      return res.status(400).json({
        success: false,
        message: "Invalid channel. Use email, whatsapp, or sms.",
      });
    } catch (error) {
      console.error("Test Template Send Error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to send test message",
      });
    }
  }
}

module.exports = new MessagingController();
