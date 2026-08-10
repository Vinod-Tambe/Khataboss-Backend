"use strict";

const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("../generated/main");

const TEMPLATE_ROOT = path.join(__dirname, "../../common/template");
const CHANNEL_FOLDERS = [
  { folder: "whatsapp", channel: "whatsapp" },
  { folder: "text", channel: "sms" },
  { folder: "email", channel: "email" },
];

const normalizeTemplate = (data, channel, fallbackKey) => ({
  key: data.key || fallbackKey,
  name: String(data.name || data.key || fallbackKey)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_"),
  channel: data.channel || channel,
  module: data.module || "general",
  category: data.category || "Transactional",
  language: data.language || "English (US)",
  subject: data.subject || "",
  body: data.body || "",
  has_attachment: Boolean(data.has_attachment),
  attachment_hint: data.attachment_hint || null,
  status: data.status === "Inactive" ? "Inactive" : "Active",
  variables: data.variables || [],
});

/**
 * Load templates from common/template/{whatsapp,text,email}/templates.json
 * (also supports template.json and legacy single *.json files).
 */
const loadSeedTemplates = () => {
  const templates = [];
  const seen = new Set();

  const pushTemplate = (item, channel, fallbackKey) => {
    const normalized = normalizeTemplate(item, channel, fallbackKey);
    const dedupeKey = `${normalized.channel}:${normalized.name}`;
    if (seen.has(dedupeKey)) return;
    seen.add(dedupeKey);
    templates.push(normalized);
  };

  for (const { folder, channel } of CHANNEL_FOLDERS) {
    const dir = path.join(TEMPLATE_ROOT, folder);
    if (!fs.existsSync(dir)) continue;

    const bundleNames = ["templates.json", "template.json"];
    let loadedBundle = false;

    for (const bundleName of bundleNames) {
      const bundlePath = path.join(dir, bundleName);
      if (!fs.existsSync(bundlePath)) continue;

      try {
        const raw = fs.readFileSync(bundlePath, "utf8");
        const parsed = JSON.parse(raw);
        const list = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed?.templates)
            ? parsed.templates
            : [];

        list.forEach((item, index) => {
          pushTemplate(item, channel, item?.key || `${folder}_${index + 1}`);
        });
        loadedBundle = true;
      } catch (err) {
        console.warn(`⚠️  Skipping invalid ${folder}/${bundleName}: ${err.message}`);
      }
    }

    // Legacy fallback: individual JSON files (ignored if templates.json exists)
    if (!loadedBundle) {
      const files = fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".json") && !bundleNames.includes(f));
      for (const file of files) {
        try {
          const raw = fs.readFileSync(path.join(dir, file), "utf8");
          const data = JSON.parse(raw);
          pushTemplate(data, channel, path.basename(file, ".json"));
        } catch (err) {
          console.warn(`⚠️  Skipping invalid template ${folder}/${file}: ${err.message}`);
        }
      }
    }
  }

  return templates;
};

/**
 * Seed default message templates for one firm (idempotent by firm + channel + name).
 */
const seedMessageTemplatesForFirm = async (target, { ownId, firmId, firmName = "" }) => {
  if (!ownId || !firmId) {
    throw new Error("ownId and firmId are required to seed message templates");
  }

  let prisma = target;
  let shouldDisconnect = false;

  if (typeof target === "string") {
    prisma = new PrismaClient({
      datasources: { db: { url: target } },
    });
    shouldDisconnect = true;
  }

  const seeds = loadSeedTemplates();
  let created = 0;
  let updated = 0;
  let skipped = 0;

  try {
    for (const seed of seeds) {
      const body = String(seed.body || "").replace(/\{\{firm_name\}\}/g, firmName || "{{firm_name}}");
      const subject = String(seed.subject || "").replace(
        /\{\{firm_name\}\}/g,
        firmName || "{{firm_name}}"
      );

      const existing = await prisma.messageTemplate.findFirst({
        where: {
          mt_firm_id: firmId,
          mt_channel: seed.channel,
          mt_name: seed.name,
          mt_is_deleted: false,
        },
      });

      if (existing) {
        // Keep custom (non-system) edits; refresh system seed content
        if (!existing.mt_is_system) {
          skipped += 1;
          continue;
        }

        await prisma.messageTemplate.update({
          where: { mt_uuid: existing.mt_uuid },
          data: {
            mt_key: seed.key,
            mt_category: seed.category,
            mt_language: seed.language,
            mt_subject: subject || null,
            mt_body: body,
            mt_variables: seed.variables,
            mt_has_attachment: seed.has_attachment,
            mt_status: seed.status,
            mt_updated_by: "system",
          },
        });
        updated += 1;
        continue;
      }

      await prisma.messageTemplate.create({
        data: {
          mt_own_id: ownId,
          mt_firm_id: firmId,
          mt_channel: seed.channel,
          mt_key: seed.key,
          mt_name: seed.name,
          mt_category: seed.category,
          mt_language: seed.language,
          mt_subject: subject || null,
          mt_body: body,
          mt_variables: seed.variables,
          mt_attachments: [],
          mt_has_attachment: seed.has_attachment,
          mt_is_system: true,
          mt_status: seed.status,
          mt_created_by: "system",
        },
      });
      created += 1;
    }

    return { created, updated, skipped, total: seeds.length };
  } finally {
    if (shouldDisconnect) await prisma.$disconnect();
  }
};

/**
 * Seed templates for every non-deleted firm in a tenant DB.
 */
const seedMessageTemplatesForTenant = async (dbUrl) => {
  const prisma = new PrismaClient({
    datasources: { db: { url: dbUrl } },
  });

  try {
    const firms = await prisma.firm.findMany({
      where: { firm_is_deleted: false },
      select: { firm_id: true, firm_own_id: true, firm_name: true },
    });

    let totalCreated = 0;
    for (const firm of firms) {
      const result = await seedMessageTemplatesForFirm(prisma, {
        ownId: firm.firm_own_id,
        firmId: firm.firm_id,
        firmName: firm.firm_name,
      });
      totalCreated += result.created;
    }

    console.log(
      `✅  Seeded message templates for ${firms.length} firm(s) (${totalCreated} new).`
    );
    return { firms: firms.length, created: totalCreated };
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = {
  loadSeedTemplates,
  seedMessageTemplatesForFirm,
  seedMessageTemplatesForTenant,
};
