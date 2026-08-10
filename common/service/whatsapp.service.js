"use strict";

const fs = require("fs");
const path = require("path");
const pino = require("pino");
const QRCode = require("qrcode");

/**
 * Local WhatsApp Web sessions via Baileys.
 * No UltraMsg / third-party token — only mobile number + QR scan.
 */
class WhatsAppService {
  constructor() {
    /** @type {Map<string, object>} */
    this.sessions = new Map();
    this.authRoot = path.join(__dirname, "../../uploads/whatsapp-sessions");
    this.logger = pino({ level: "silent" });
  }

  isAutoCreateAvailable() {
    return true;
  }

  normalizePhone(input) {
    let digits = String(input || "").replace(/\D/g, "");
    if (!digits) return "";
    if (digits.length === 10) digits = `91${digits}`;
    if (digits.startsWith("0") && digits.length === 11) {
      digits = `91${digits.slice(1)}`;
    }
    return digits;
  }

  sessionKey(ownDb, firmId) {
    return `${String(ownDb || "tenant")}_${String(firmId)}`;
  }

  authDir(key) {
    return path.join(this.authRoot, key);
  }

  ensureSessionRecord(key, patch = {}) {
    const prev = this.sessions.get(key) || {
      key,
      status: "Pending",
      qrCode: null,
      phoneNumber: null,
      sock: null,
      lastError: null,
      connectedPhone: null,
    };
    const next = { ...prev, ...patch };
    this.sessions.set(key, next);
    return next;
  }

  getSessionState(key) {
    const s = this.sessions.get(key);
    if (!s) {
      const authExists = fs.existsSync(this.authDir(key));
      return {
        success: true,
        status: authExists ? "Disconnected" : "Pending",
        qrCode: null,
        phoneNumber: null,
        connectedPhone: null,
        hasSession: authExists,
      };
    }
    return {
      success: true,
      status: s.status || "Pending",
      qrCode: s.status === "Connected" ? null : s.qrCode || null,
      phoneNumber: s.phoneNumber || null,
      connectedPhone: s.connectedPhone || null,
      hasSession: true,
      lastError: s.lastError || null,
    };
  }

  async clearAuth(key) {
    const dir = this.authDir(key);
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }

  async stopSocket(key) {
    const s = this.sessions.get(key);
    if (s?.sock) {
      try {
        s.sock.ev.removeAllListeners();
        await s.sock.end(undefined);
      } catch {
        // ignore
      }
    }
  }

  async loadBaileys() {
    const baileys = require("@whiskeysockets/baileys");
    return {
      makeWASocket: baileys.default || baileys.makeWASocket,
      useMultiFileAuthState: baileys.useMultiFileAuthState,
      DisconnectReason: baileys.DisconnectReason,
      fetchLatestBaileysVersion: baileys.fetchLatestBaileysVersion,
    };
  }

  async startSession({ ownDb, firmId, phoneNumber, reset = false } = {}) {
    const phone = this.normalizePhone(phoneNumber);
    if (!phone || phone.length < 10) {
      return {
        success: false,
        code: "INVALID_PHONE",
        message: "Enter a valid WhatsApp mobile number (e.g. 9198XXXXXXXX).",
      };
    }

    const key = this.sessionKey(ownDb, firmId);
    const current = this.sessions.get(key);

    if (!reset && current?.status === "Connected" && current.sock) {
      return {
        success: true,
        instanceId: key,
        token: "local",
        status: "Connected",
        qrCode: null,
        phoneNumber: phone,
        connectedPhone: current.connectedPhone || phone,
      };
    }

    if (reset) {
      await this.stopSocket(key);
      await this.clearAuth(key);
      this.sessions.delete(key);
    }

    this.ensureSessionRecord(key, {
      status: "Pending",
      qrCode: null,
      phoneNumber: phone,
      lastError: null,
      connectedPhone: null,
    });

    try {
      await this._bootSocket(key, phone);
    } catch (err) {
      this.ensureSessionRecord(key, {
        status: "Error",
        lastError: err.message,
      });
      return {
        success: false,
        code: "BOOT_FAILED",
        message: err.message || "Failed to start WhatsApp session",
        instanceId: key,
        token: "local",
      };
    }

    // Wait briefly for QR or connection
    const started = Date.now();
    while (Date.now() - started < 20000) {
      const state = this.getSessionState(key);
      if (state.status === "Connected" || state.qrCode) break;
      await new Promise((r) => setTimeout(r, 400));
    }

    const state = this.getSessionState(key);
    return {
      success: true,
      instanceId: key,
      token: "local",
      status: state.status,
      qrCode: state.qrCode,
      phoneNumber: phone,
      connectedPhone: state.connectedPhone,
      message:
        state.status === "Connected"
          ? `WhatsApp already connected for ${phone}.`
          : state.qrCode
            ? `Scan the QR with WhatsApp on ${phone}.`
            : "Waiting for QR… tap Refresh in a moment.",
    };
  }

  async _bootSocket(key, phoneNumber) {
    const { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } =
      await this.loadBaileys();

    const dir = this.authDir(key);
    fs.mkdirSync(dir, { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState(dir);
    let version;
    try {
      const latest = await fetchLatestBaileysVersion();
      version = latest.version;
    } catch {
      version = undefined;
    }

    // Close previous socket if any
    await this.stopSocket(key);

    const sock = makeWASocket({
      version,
      auth: state,
      logger: this.logger,
      printQRInTerminal: false,
      browser: ["Khataboss", "Chrome", "1.0.0"],
      syncFullHistory: false,
      markOnlineOnConnect: false,
    });

    this.ensureSessionRecord(key, {
      sock,
      phoneNumber,
      status: "Pending",
      qrCode: null,
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        try {
          const qrCode = await QRCode.toDataURL(qr, {
            margin: 1,
            width: 280,
            errorCorrectionLevel: "M",
          });
          this.ensureSessionRecord(key, {
            status: "Pending",
            qrCode,
            lastError: null,
          });
        } catch (err) {
          this.ensureSessionRecord(key, {
            lastError: err.message,
          });
        }
      }

      if (connection === "open") {
        const userId = sock.user?.id || "";
        const connectedPhone = String(userId).split(":")[0].replace(/\D/g, "") || phoneNumber;
        this.ensureSessionRecord(key, {
          status: "Connected",
          qrCode: null,
          connectedPhone,
          lastError: null,
        });
      }

      if (connection === "close") {
        const code = lastDisconnect?.error?.output?.statusCode;
        const loggedOut = code === DisconnectReason.loggedOut;
        this.ensureSessionRecord(key, {
          status: "Disconnected",
          qrCode: null,
          sock: null,
          lastError: loggedOut ? "Logged out from phone" : lastDisconnect?.error?.message || null,
        });

        // Auto-reconnect unless user logged out
        if (!loggedOut) {
          setTimeout(() => {
            const rec = this.sessions.get(key);
            if (rec && rec.status !== "Connected") {
              this._bootSocket(key, rec.phoneNumber || phoneNumber).catch(() => {});
            }
          }, 2500);
        } else {
          this.clearAuth(key).catch(() => {});
        }
      }
    });
  }

  async createInstance({ ownDb, firmId, phoneNumber, reset = false } = {}) {
    return this.startSession({ ownDb, firmId, phoneNumber, reset });
  }

  async getStatus({ instanceId, ownDb, firmId }) {
    const key = instanceId || this.sessionKey(ownDb, firmId);
    const state = this.getSessionState(key);

    // If auth exists but socket not running, try restore (non-blocking)
    if (
      state.hasSession &&
      state.status !== "Connected" &&
      !this.sessions.get(key)?.sock
    ) {
      const phone = this.sessions.get(key)?.phoneNumber || null;
      this._bootSocket(key, phone || "0").catch(() => {});
    }

    return {
      success: true,
      status: state.status,
      rawStatus: state.status,
      connectedPhone: state.connectedPhone,
    };
  }

  async getQr({ instanceId, ownDb, firmId }) {
    const key = instanceId || this.sessionKey(ownDb, firmId);
    const state = this.getSessionState(key);
    if (state.qrCode) {
      return { success: true, qrCode: state.qrCode };
    }
    return {
      success: false,
      message: "QR code not ready yet. Generate again or wait a moment.",
    };
  }

  /**
   * Restore Baileys sessions from disk after server restart (non-blocking).
   */
  async restorePersistedSessions() {
    if (!fs.existsSync(this.authRoot)) return { restored: 0 };
    const dirs = fs
      .readdirSync(this.authRoot, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    let restored = 0;
    for (const key of dirs) {
      if (this.sessions.get(key)?.sock) continue;
      const credsFile = path.join(this.authDir(key), "creds.json");
      if (!fs.existsSync(credsFile)) continue;
      this.ensureSessionRecord(key, { status: "Disconnected" });
      this._bootSocket(key, "0").catch(() => {});
      restored += 1;
    }
    return { restored };
  }

  async logout({ instanceId, ownDb, firmId }) {
    const key = instanceId || this.sessionKey(ownDb, firmId);
    const s = this.sessions.get(key);
    try {
      if (s?.sock?.logout) {
        await s.sock.logout();
      }
    } catch {
      // ignore
    }
    await this.stopSocket(key);
    await this.clearAuth(key);
    this.sessions.delete(key);
    return { success: true };
  }

  async sendChat({ instanceId, ownDb, firmId, to, body, filename, documentPath, documentUrl }) {
    const key = instanceId || this.sessionKey(ownDb, firmId);
    let s = this.sessions.get(key);

    if (!s?.sock || s.status !== "Connected") {
      // try resume
      await this._bootSocket(key, s?.phoneNumber || to);
      const started = Date.now();
      while (Date.now() - started < 12000) {
        s = this.sessions.get(key);
        if (s?.status === "Connected" && s.sock) break;
        await new Promise((r) => setTimeout(r, 400));
      }
    }

    s = this.sessions.get(key);
    if (!s?.sock || s.status !== "Connected") {
      return {
        success: false,
        message: "WhatsApp is not connected. Open Settings, generate QR, and scan again.",
      };
    }

    const phone = this.normalizePhone(to);
    if (!phone) {
      return { success: false, message: "Invalid recipient number" };
    }

    const jid = `${phone}@s.whatsapp.net`;

    try {
      let result;
      if (documentPath && fs.existsSync(documentPath)) {
        result = await s.sock.sendMessage(jid, {
          document: fs.readFileSync(documentPath),
          mimetype: "application/pdf",
          fileName: filename || path.basename(documentPath),
          caption: body || undefined,
        });
      } else if (documentUrl) {
        result = await s.sock.sendMessage(jid, {
          document: { url: documentUrl },
          mimetype: "application/pdf",
          fileName: filename || "attachment.pdf",
          caption: body || undefined,
        });
      } else {
        result = await s.sock.sendMessage(jid, { text: body });
      }
      return { success: true, data: result };
    } catch (err) {
      return { success: false, message: err.message || "Failed to send WhatsApp message" };
    }
  }
}

module.exports = new WhatsAppService();
