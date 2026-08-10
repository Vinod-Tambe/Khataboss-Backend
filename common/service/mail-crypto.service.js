"use strict";

const crypto = require("crypto");

const ALGO = "aes-256-gcm";

function getKey() {
  const secret = process.env.MAIL_ENC_KEY || process.env.JWT_SECRET || "khataboss-mail-key";
  return crypto.scryptSync(secret, "khataboss-mail-salt", 32);
}

function encrypt(plainText) {
  if (!plainText) return null;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(String(plainText), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64")}:${tag.toString("base64")}:${encrypted.toString("base64")}`;
}

function decrypt(payload) {
  if (!payload) return null;
  const parts = String(payload).split(":");
  if (parts.length !== 3) return null;
  const iv = Buffer.from(parts[0], "base64");
  const tag = Buffer.from(parts[1], "base64");
  const data = Buffer.from(parts[2], "base64");
  const decipher = crypto.createDecipheriv(ALGO, getKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}

module.exports = { encrypt, decrypt };
