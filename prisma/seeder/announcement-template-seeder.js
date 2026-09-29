"use strict";

const templates = require("../core-data/announcement-templates.json");

/** Placeholder schedule until admin sets start/end dates. */
const PLACEHOLDER_PUBLISH = new Date("2000-01-01T00:00:00.000+05:30");
const PLACEHOLDER_EXPIRY = new Date("2000-01-02T23:59:59.999+05:30");

function resolvePrisma(externalPrisma) {
  if (externalPrisma) return externalPrisma;
  try {
    const { getMasterPrisma } = require("../../utils/masterPrisma");
    return getMasterPrisma();
  } catch {
    const { PrismaClient } = require("../generated/master");
    return new PrismaClient();
  }
}

/**
 * Upsert via SQL so sync works even when the Node process still holds an older
 * Prisma client (before restart after `prisma generate`).
 */
const seedAnnouncementTemplates = async (externalPrisma) => {
  const prisma = resolvePrisma(externalPrisma);

    console.log("🌱  Seeding announcement templates (festivals, national days, software)...");

  let created = 0;
  let updated = 0;

  for (const tpl of templates) {
    const key = String(tpl.key || "").trim();
    if (!key) continue;

    const title = String(tpl.title || key).trim();
    const body = String(tpl.body || "").trim();
    const type = tpl.type || "Notice";
    const sortOrder = parseInt(tpl.sort_order, 10) || 0;

    const existingRows = await prisma.$queryRaw`
      SELECT ann_id
      FROM "Announcement"
      WHERE ann_template_key = ${key}
        AND ann_is_deleted = false
      LIMIT 1
    `;

    const existingId = existingRows?.[0]?.ann_id;

    if (existingId) {
      await prisma.$executeRaw`
        UPDATE "Announcement"
        SET
          ann_title = ${title},
          ann_body = ${body},
          ann_type = ${type}::"AnnouncementType",
          ann_sort_order = ${sortOrder},
          ann_is_pinned = false,
          ann_updated_by = 'system',
          ann_updated_at = NOW()
        WHERE ann_id = ${existingId}
      `;
      updated += 1;
      continue;
    }

    await prisma.$executeRaw`
      INSERT INTO "Announcement" (
        ann_uuid,
        ann_template_key,
        ann_title,
        ann_body,
        ann_type,
        ann_status,
        ann_is_pinned,
        ann_sort_order,
        ann_publish_at,
        ann_expires_at,
        ann_created_by,
        ann_updated_by,
        ann_updated_at,
        ann_is_deleted
      ) VALUES (
        gen_random_uuid()::text,
        ${key},
        ${title},
        ${body},
        ${type}::"AnnouncementType",
        'Inactive'::"AnnouncementStatus",
        false,
        ${sortOrder},
        ${PLACEHOLDER_PUBLISH},
        ${PLACEHOLDER_EXPIRY},
        'system',
        'system',
        NOW(),
        false
      )
    `;
    created += 1;
  }

  console.log(
    `✅  Announcement templates: ${created} created, ${updated} updated (${templates.length} total).`
  );
  return { created, updated, total: templates.length };
};

module.exports = { seedAnnouncementTemplates };

if (require.main === module) {
  require("../../config/db");
  const prisma = resolvePrisma();
  seedAnnouncementTemplates(prisma)
    .catch((err) => {
      console.error("❌  Announcement template seed failed:", err.message);
      if (/ann_template_key/.test(err.message)) {
        console.error(
          "   Run: npm run migrate — then restart the backend and npm run generate if needed."
        );
      }
      process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
}
