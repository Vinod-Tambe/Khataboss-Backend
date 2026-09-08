"use strict";

const fs = require("fs");
const path = require("path");
const ownerMailService = require("./owner-mail.service");
const messageFormat = require("./message-format.service");

/**
 * Service to handle email sending (tenant Owner credentials first, env fallback).
 */
class EmailService {
  async _resolveCreds(options = {}) {
    const { dbUrl, ownId } = options;
    if (dbUrl && ownId) {
      const creds = await ownerMailService.getCredentials(dbUrl, ownId);
      if (creds) return creds;
    }
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      return {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        fromName: "Khataboss",
        provider: "gmail",
        source: "env",
      };
    }
    return null;
  }

  async isConfigured(dbUrl, ownId) {
    const creds = await this._resolveCreds({ dbUrl, ownId });
    return Boolean(creds?.user && creds?.pass);
  }

  async sendEmail(to, subject, templateName, replacements = {}, options = {}) {
    const creds = await this._resolveCreds(options);
    if (!creds) {
      throw new Error("Email is not configured. Set up Email Settings first.");
    }

    const templatePath = path.join(__dirname, "..", "template", templateName);
    let htmlContent = fs.readFileSync(templatePath, "utf-8");

    for (const [key, value] of Object.entries(replacements)) {
      const regex = new RegExp(`{{${key}}}`, "g");
      htmlContent = htmlContent.replace(regex, value == null ? "" : String(value));
    }

    const firmName = replacements.firm_name || replacements.firmName || "";
    if (templateName === "otp.html") {
      htmlContent = messageFormat.buildOtpEmailContent({
        username: replacements.username,
        otp: replacements.otp,
        firmName,
      });
    }

    const wrappedHtml = messageFormat.wrapEmailContent(htmlContent, {
      subject,
      firmName,
      preheader: `Your OTP is ${replacements.otp || ""}`.trim(),
    });
    const textPlain = messageFormat.htmlToPlainText(htmlContent);

    const transporter = ownerMailService.createTransporter(creds);
    const mailOptions = {
      from: ownerMailService.formatFrom(creds),
      to,
      subject,
      html: wrappedHtml,
      text: textPlain,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  }

  async sendHtmlEmail(to, subject, html, attachments = [], options = {}) {
    const creds = await this._resolveCreds(options);
    if (!creds) {
      throw new Error("Email is not configured. Set up Email Settings first.");
    }

    const firmName = options.firmName || "";
    const wrappedHtml = messageFormat.wrapEmailContent(html, {
      subject,
      firmName,
      preheader: options.preheader || messageFormat.htmlToPlainText(html).slice(0, 120),
    });
    const textPlain = options.textPlain || messageFormat.htmlToPlainText(html);

    const transporter = ownerMailService.createTransporter(creds);
    const mailOptions = {
      from: ownerMailService.formatFrom(creds),
      to,
      subject,
      html: wrappedHtml,
      text: textPlain,
      attachments: Array.isArray(attachments) ? attachments : [],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("HTML email sent: " + info.response);
    return info;
  }
}

module.exports = new EmailService();
