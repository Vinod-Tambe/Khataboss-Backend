"use strict";

/** Shared branding for email + WhatsApp footers */
const BRAND = {
  name: "KhataBoss",
  siteUrl: process.env.KHATABOSS_SITE_URL || "https://khataboss.com",
  logoUrl: process.env.KHATABOSS_LOGO_URL || "https://khataboss.com/khataboss-icon.svg",
  supportPhone: process.env.KHATABOSS_SUPPORT_PHONE || "9579082528",
  accent: "#70016e",
  accentMid: "#a1005b",
};

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isFullHtmlDocument(html) {
  return /<!DOCTYPE/i.test(html) || /<html[\s>]/i.test(html);
}

function stripHtml(html) {
  return String(html || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function htmlToPlainText(html) {
  return stripHtml(html)
    .replace(/\n\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Convert simple HTML (from template editor) to WhatsApp markdown. */
function htmlToWhatsAppMarkdown(html) {
  let text = String(html || "");
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/p>\s*<p[^>]*>/gi, "\n\n");
  text = text.replace(/<\/p>/gi, "\n\n");
  text = text.replace(/<p[^>]*>/gi, "");
  text = text.replace(/<strong>([\s\S]*?)<\/strong>/gi, "*$1*");
  text = text.replace(/<b>([\s\S]*?)<\/b>/gi, "*$1*");
  text = text.replace(/<em>([\s\S]*?)<\/em>/gi, "_$1_");
  text = text.replace(/<i>([\s\S]*?)<\/i>/gi, "_$1_");
  text = text.replace(/<li[^>]*>/gi, "\n• ");
  text = text.replace(/<\/li>/gi, "");
  text = text.replace(/<[^>]+>/g, "");
  text = text.replace(/&nbsp;/g, " ");
  text = text.replace(/&amp;/g, "&");
  text = text.replace(/&lt;/g, "<");
  text = text.replace(/&gt;/g, ">");
  text = text.replace(/\n{3,}/g, "\n\n");
  return text.trim();
}

/** Single-width divider — must fit one line on WhatsApp mobile (avoid heavy ━ wrap). */
const WHATSAPP_HORIZONTAL_LINE = "──────────────────";

function isHorizontalLineText(line = "") {
  return /^[\s━─\-_=~•·.]{4,}$/.test(String(line || "").trim());
}

function stripTrailingHorizontalLines(text = "") {
  const lines = String(text || "").split("\n");
  while (lines.length) {
    const last = lines[lines.length - 1];
    if (last.trim() === "") {
      lines.pop();
      continue;
    }
    if (isHorizontalLineText(last)) {
      lines.pop();
      while (lines.length && lines[lines.length - 1].trim() === "") {
        lines.pop();
      }
      break;
    }
    break;
  }
  return lines.join("\n").trimEnd();
}

function formatWhatsAppFooter(firmName = "") {
  const parts = [
    WHATSAPP_HORIZONTAL_LINE,
    firmName ? `*${firmName}*` : null,
    `🌐 ${BRAND.siteUrl}`,
    `📞 Help: ${BRAND.supportPhone}`,
    `Powered by *${BRAND.name}*`,
  ].filter((line) => line != null && line !== "");
  return `\n\n${parts.join("\n")}`;
}

function formatWhatsAppBody(body, { firmName = "" } = {}) {
  const raw = String(body || "").trim();
  if (!raw) return formatWhatsAppFooter(firmName).trimStart();

  const hasHtml = /<[a-z][\s\S]*>/i.test(raw);
  let text = hasHtml ? htmlToWhatsAppMarkdown(raw) : raw;

  if (hasHtmlTags(text)) {
    text = htmlToWhatsAppMarkdown(text);
  }

  text = text.trimEnd();

  if (!text.includes(BRAND.siteUrl)) {
    text = stripTrailingHorizontalLines(text);
    text += formatWhatsAppFooter(firmName);
  }
  return text;
}

function hasHtmlTags(text = "") {
  return /<[a-z][\s\S]*>/i.test(String(text || ""));
}

/** Sanitize template body on save by channel. */
function sanitizeTemplateBody(body, channel = "email") {
  const raw = String(body || "").trim();
  if (!raw) return "";

  if (channel === "email" || channel === "Email") {
    return hasHtmlTags(raw) ? raw : raw.replace(/\n/g, "<br>");
  }

  if (channel === "whatsapp") {
    let md = hasHtmlTags(raw) ? htmlToWhatsAppMarkdown(raw) : raw;
    if (hasHtmlTags(md)) {
      throw new Error("WhatsApp templates cannot contain HTML. Use *bold* and _italic_ only.");
    }
    md = md
      .split("\n")
      .map((line) => (isHorizontalLineText(line) ? WHATSAPP_HORIZONTAL_LINE : line))
      .join("\n");
    return md;
  }

  if (channel === "sms") {
    let plain = hasHtmlTags(raw) ? htmlToPlainText(raw) : raw;
    plain = plain.replace(/\*([^*]+)\*/g, "$1").replace(/_([^_]+)_/g, "$1");
    if (hasHtmlTags(plain)) {
      throw new Error("SMS templates must be plain text only.");
    }
    return plain.trim();
  }

  return raw;
}

function formatEmailFooterHtml(firmName = "") {
  const year = new Date().getFullYear();
  const firm = firmName
    ? `<p style="margin:0 0 10px;font-size:14px;color:#24292f;font-weight:700;line-height:1.4;">${escapeHtml(firmName)}</p>`
    : "";
  const siteLabel = BRAND.siteUrl.replace(/^https?:\/\//, "");

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;">
      <tr>
        <td style="padding:0 0 14px;">
          <div style="height:0;border:none;border-top:1px solid #d0d7de;font-size:0;line-height:0;">&nbsp;</div>
        </td>
      </tr>
      <tr>
        <td style="text-align:center;">
          ${firm}
          <p style="margin:0 0 6px;font-size:13px;color:#57606a;line-height:1.5;">
            <a href="${BRAND.siteUrl}" style="color:${BRAND.accent};text-decoration:none;font-weight:600;">🌐 ${siteLabel}</a>
          </p>
          <p style="margin:0 0 10px;font-size:13px;color:#57606a;line-height:1.5;">
            📞 Help: <a href="tel:${BRAND.supportPhone}" style="color:${BRAND.accent};text-decoration:none;font-weight:600;">${BRAND.supportPhone}</a>
          </p>
          <p style="margin:0;font-size:11px;color:#8b949e;line-height:1.5;">
            Powered by <strong style="color:${BRAND.accent};">${BRAND.name}</strong>
            &nbsp;·&nbsp;© ${year} ${BRAND.name}
          </p>
        </td>
      </tr>
    </table>`;
}

/**
 * GitHub-style responsive email wrapper (inline CSS for client compatibility).
 */
function wrapEmailLayout({ subject = "", bodyHtml = "", firmName = "", preheader = "" } = {}) {
  const pre = escapeHtml(preheader || subject);
  const inner = String(bodyHtml || "").trim();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${escapeHtml(subject || BRAND.name)}</title>
  <!--[if mso]><style>table{border-collapse:collapse;}td{font-family:Arial,sans-serif;}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f6f8fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${pre}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f6f8fa;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background-color:#ffffff;border:1px solid #d0d7de;border-radius:8px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:24px 32px 16px;border-bottom:1px solid #d0d7de;background:linear-gradient(135deg,#fdf4ff 0%,#fff5f7 100%);">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="vertical-align:middle;">
                    <a href="${BRAND.siteUrl}" style="text-decoration:none;display:inline-block;">
                      <img src="${BRAND.logoUrl}" alt="${BRAND.name}" width="40" height="40" style="display:inline-block;vertical-align:middle;border:0;border-radius:8px;" />
                      <span style="display:inline-block;vertical-align:middle;margin-left:10px;font-size:22px;font-weight:700;color:${BRAND.accent};letter-spacing:-0.3px;">${BRAND.name}</span>
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:28px 32px;color:#24292f;font-size:15px;line-height:1.6;">
              ${inner}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background-color:#f6f8fa;border-top:1px solid #d0d7de;text-align:center;">
              ${formatEmailFooterHtml(firmName)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function wrapEmailContent(bodyHtml, options = {}) {
  const html = String(bodyHtml || "").trim();
  if (!html) return wrapEmailLayout({ ...options, bodyHtml: "<p></p>" });
  if (isFullHtmlDocument(html)) return html;
  return wrapEmailLayout({ ...options, bodyHtml: html });
}

/** Styled OTP block for login emails */
function buildOtpEmailContent({ username = "", otp = "", firmName = "" } = {}) {
  const name = escapeHtml(username || "there");
  const code = escapeHtml(otp);
  const firm = firmName ? `<p style="margin:16px 0 0;font-size:14px;color:#57606a;">— <strong>${escapeHtml(firmName)}</strong></p>` : "";

  return `
    <p style="margin:0 0 8px;font-size:16px;color:#24292f;">Hello <strong>${name}</strong>,</p>
    <p style="margin:0 0 20px;font-size:15px;color:#57606a;">Use this one-time password (OTP) to sign in to your ${BRAND.name} account:</p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 24px;">
      <tr>
        <td style="background-color:#f6f8fa;border:1px solid #d0d7de;border-radius:8px;padding:18px 32px;text-align:center;">
          <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:${BRAND.accent};font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;">${code}</span>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 8px;font-size:14px;color:#57606a;">This code expires in <strong>1 minute</strong>. Never share it with anyone.</p>
    <p style="margin:0;font-size:13px;color:#8b949e;">If you did not request this OTP, you can safely ignore this email.</p>
    ${firm}`;
}

function buildOtpWhatsAppContent({ username = "", otp = "", firmName = "" } = {}) {
  const name = username || "there";
  const lines = [
    `*${BRAND.name}* — Owner Login OTP`,
    "",
    `Hello *${name}*,`,
    "",
    "Your login OTP is:",
    `*${otp}*`,
    "",
    "Valid for *1 minute*. Do not share this code.",
  ];
  return lines.join("\n") + formatWhatsAppFooter(firmName);
}

module.exports = {
  BRAND,
  WHATSAPP_HORIZONTAL_LINE,
  escapeHtml,
  stripHtml,
  htmlToPlainText,
  htmlToWhatsAppMarkdown,
  isHorizontalLineText,
  stripTrailingHorizontalLines,
  formatWhatsAppFooter,
  formatWhatsAppBody,
  wrapEmailLayout,
  wrapEmailContent,
  buildOtpEmailContent,
  buildOtpWhatsAppContent,
  isFullHtmlDocument,
  hasHtmlTags,
  sanitizeTemplateBody,
};
