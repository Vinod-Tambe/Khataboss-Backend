"use strict";

const nodemailer = require("nodemailer");
const { getTenantPrisma } = require("../../utils/tenantPrisma");
const { encrypt, decrypt } = require("./mail-crypto.service");

const ownerMailSelect = {
  own_mail_user: true,
  own_mail_pass_enc: true,
  own_mail_from_name: true,
  own_mail_provider: true,
  own_mail_status: true,
  own_mail_updated_at: true,
  own_updated_at: true,
};

const mapSettings = (owner) => {
  if (!owner) {
    return {
      email: "",
      fromName: "Khataboss",
      provider: "gmail",
      status: "NotConfigured",
      configured: false,
      hasPassword: false,
      updatedAt: null,
    };
  }

  const hasPassword = Boolean(owner.own_mail_pass_enc);
  const hasUser = Boolean(owner.own_mail_user);
  const configured = hasUser && hasPassword;

  return {
    email: owner.own_mail_user || "",
    fromName: owner.own_mail_from_name || "Khataboss",
    provider: owner.own_mail_provider || "gmail",
    status: owner.own_mail_status || (configured ? "Configured" : "NotConfigured"),
    configured,
    hasPassword,
    updatedAt: owner.own_mail_updated_at || owner.own_updated_at || null,
  };
};

class OwnerMailService {
  _prisma(dbUrl) {
    if (!dbUrl) throw new Error("Tenant database URL is required");
    return getTenantPrisma(dbUrl);
  }

  async getSettings(dbUrl, ownId) {
    const prisma = this._prisma(dbUrl);
    const owner = await prisma.owner.findFirst({
      where: { own_id: parseInt(ownId, 10), own_is_deleted: false },
      select: ownerMailSelect,
    });
    return mapSettings(owner);
  }

  async getCredentials(dbUrl, ownId) {
    if (!dbUrl) {
      return this._envFallback();
    }

    const prisma = this._prisma(dbUrl);
    const owner = await prisma.owner.findFirst({
      where: { own_id: parseInt(ownId, 10), own_is_deleted: false },
      select: {
        own_mail_user: true,
        own_mail_pass_enc: true,
        own_mail_from_name: true,
        own_mail_provider: true,
      },
    });

    if (!owner?.own_mail_user || !owner?.own_mail_pass_enc) {
      return this._envFallback();
    }

    const pass = decrypt(owner.own_mail_pass_enc);
    if (!pass) return this._envFallback();

    return {
      user: owner.own_mail_user,
      pass,
      fromName: owner.own_mail_from_name || "Khataboss",
      provider: owner.own_mail_provider || "gmail",
      source: "tenant_owner",
    };
  }

  _envFallback() {
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
    const creds = await this.getCredentials(dbUrl, ownId);
    return Boolean(creds?.user && creds?.pass);
  }

  createTransporter(creds) {
    if (!creds?.user || !creds?.pass) {
      throw new Error("Email credentials are not configured");
    }

    const provider = creds.provider || "gmail";
    if (provider === "gmail") {
      return nodemailer.createTransport({
        service: "gmail",
        auth: { user: creds.user, pass: creds.pass },
      });
    }

    return nodemailer.createTransport({
      host: creds.host || "smtp.gmail.com",
      port: creds.port || 587,
      secure: false,
      auth: { user: creds.user, pass: creds.pass },
    });
  }

  async saveSettings(dbUrl, ownId, { email, password, fromName, provider }, updatedBy) {
    const ownIdInt = parseInt(ownId, 10);
    const mailUser = String(email || "").trim().toLowerCase();
    if (!mailUser || !mailUser.includes("@")) {
      throw new Error("Enter a valid sender email address");
    }

    const prisma = this._prisma(dbUrl);
    const existing = await prisma.owner.findFirst({
      where: { own_id: ownIdInt, own_is_deleted: false },
      select: { own_id: true, own_mail_pass_enc: true },
    });
    if (!existing) throw new Error("Owner not found in tenant database");

    const data = {
      own_mail_user: mailUser,
      own_mail_from_name: String(fromName || "Khataboss").trim() || "Khataboss",
      own_mail_provider: provider || "gmail",
      own_mail_status: "Configured",
      own_mail_updated_at: new Date(),
      own_updated_by: updatedBy || null,
    };

    if (password && String(password).trim()) {
      data.own_mail_pass_enc = encrypt(String(password).trim());
    } else if (!existing.own_mail_pass_enc) {
      throw new Error("App password is required for first-time email setup");
    }

    await prisma.owner.update({
      where: { own_id: existing.own_id },
      data,
    });

    return this.getSettings(dbUrl, ownIdInt);
  }

  async clearSettings(dbUrl, ownId, updatedBy) {
    const prisma = this._prisma(dbUrl);
    const existing = await prisma.owner.findFirst({
      where: { own_id: parseInt(ownId, 10), own_is_deleted: false },
      select: { own_id: true },
    });
    if (!existing) throw new Error("Owner not found in tenant database");

    await prisma.owner.update({
      where: { own_id: existing.own_id },
      data: {
        own_mail_user: null,
        own_mail_pass_enc: null,
        own_mail_from_name: "Khataboss",
        own_mail_provider: "gmail",
        own_mail_status: "NotConfigured",
        own_mail_updated_at: new Date(),
        own_updated_by: updatedBy || null,
      },
    });
    return this.getSettings(dbUrl, ownId);
  }

  async verifySettings(dbUrl, ownId) {
    const creds = await this.getCredentials(dbUrl, ownId);
    if (!creds || creds.source === "env") {
      return { success: false, message: "Save tenant email settings first" };
    }

    const prisma = this._prisma(dbUrl);
    const existing = await prisma.owner.findFirst({
      where: { own_id: parseInt(ownId, 10), own_is_deleted: false },
      select: { own_id: true },
    });
    if (!existing) throw new Error("Owner not found in tenant database");

    try {
      const transporter = this.createTransporter(creds);
      await transporter.verify();
      await prisma.owner.update({
        where: { own_id: existing.own_id },
        data: { own_mail_status: "Configured", own_mail_updated_at: new Date() },
      });
      return { success: true, message: "Email credentials verified" };
    } catch (err) {
      await prisma.owner.update({
        where: { own_id: existing.own_id },
        data: { own_mail_status: "Error", own_mail_updated_at: new Date() },
      });
      return {
        success: false,
        message: err.message || "Could not verify email credentials",
      };
    }
  }

  formatFrom(creds) {
    const name = creds?.fromName || "Khataboss";
    const user = creds?.user || process.env.EMAIL_USER || "";
    return user ? `${name} <${user}>` : name;
  }
}

module.exports = new OwnerMailService();
