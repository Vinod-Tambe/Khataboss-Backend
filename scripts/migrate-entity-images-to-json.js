"use strict";

/**
 * Migrates legacy per-column image fields into *_other_images JSON arrays.
 * Run BEFORE prisma db push when dropping dedicated document columns.
 *
 * Usage: node scripts/migrate-entity-images-to-json.js
 */
const { Client } = require("pg");
const { BASE_URL } = require("../config/db");

function parseJsonArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return value && typeof value === "object" ? [value] : [];
}

function withLabel(img, label) {
  if (!img || typeof img !== "object") return null;
  if (!img.path && !img.filename) return null;
  return { ...img, label: img.label || label, note: img.note || "" };
}

function mergeImages(existing, additions) {
  const result = [...parseJsonArray(existing)];
  additions.forEach((item) => {
    if (!item) return;
    const duplicate = result.some((r) => r.path && item.path && r.path === item.path);
    if (!duplicate) result.push(item);
  });
  return result.length ? result : null;
}

async function migrateUsers(client) {
  const colCheck = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'user_adhaar_front_img'
  `);
  if (!colCheck.rows.length) {
    console.log("  users: legacy columns already removed");
    return;
  }

  const res = await client.query(`
    SELECT user_id,
           user_other_images,
           user_adhaar_front_img,
           user_adhaar_back_img,
           user_pan_card_img,
           user_sign_img
    FROM users
    WHERE user_adhaar_front_img IS NOT NULL
       OR user_adhaar_back_img IS NOT NULL
       OR user_pan_card_img IS NOT NULL
       OR user_sign_img IS NOT NULL
  `);

  for (const row of res.rows) {
    const merged = mergeImages(row.user_other_images, [
      withLabel(row.user_adhaar_front_img, "Aadhaar Front"),
      withLabel(row.user_adhaar_back_img, "Aadhaar Back"),
      withLabel(row.user_pan_card_img, "PAN Card"),
      withLabel(row.user_sign_img, "Signature"),
    ].filter(Boolean));

    if (merged) {
      await client.query(
        `UPDATE users SET user_other_images = $1::jsonb WHERE user_id = $2`,
        [JSON.stringify(merged), row.user_id]
      );
    }
  }
  console.log(`  users: migrated ${res.rows.length} row(s)`);
}

async function migrateStaff(client) {
  const colCheck = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'staff' AND column_name = 'staff_adhaar_front_img'
  `);
  if (!colCheck.rows.length) {
    console.log("  staff: legacy columns already removed");
    return;
  }

  const res = await client.query(`
    SELECT staff_id,
           staff_other_images,
           staff_adhaar_front_img,
           staff_adhaar_back_img,
           staff_pan_card_img,
           staff_sign_img
    FROM staff
    WHERE staff_adhaar_front_img IS NOT NULL
       OR staff_adhaar_back_img IS NOT NULL
       OR staff_pan_card_img IS NOT NULL
       OR staff_sign_img IS NOT NULL
  `);

  for (const row of res.rows) {
    const merged = mergeImages(row.staff_other_images, [
      withLabel(row.staff_adhaar_front_img, "Aadhaar Front"),
      withLabel(row.staff_adhaar_back_img, "Aadhaar Back"),
      withLabel(row.staff_pan_card_img, "PAN Card"),
      withLabel(row.staff_sign_img, "Signature"),
    ].filter(Boolean));

    if (merged) {
      await client.query(
        `UPDATE staff SET staff_other_images = $1::jsonb WHERE staff_id = $2`,
        [JSON.stringify(merged), row.staff_id]
      );
    }
  }
  console.log(`  staff: migrated ${res.rows.length} row(s)`);
}

async function migrateReleaseUsers(client) {
  const colCheck = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'release_users' AND column_name = 'ru_adhaar_front_img'
  `);
  if (!colCheck.rows.length) {
    console.log("  release_users: legacy columns already removed");
    return;
  }

  const res = await client.query(`
    SELECT ru_id,
           ru_other_images,
           ru_adhaar_front_img,
           ru_adhaar_back_img
    FROM release_users
    WHERE ru_adhaar_front_img IS NOT NULL
       OR ru_adhaar_back_img IS NOT NULL
  `);

  for (const row of res.rows) {
    const merged = mergeImages(row.ru_other_images, [
      withLabel(row.ru_adhaar_front_img, "Aadhaar Front"),
      withLabel(row.ru_adhaar_back_img, "Aadhaar Back"),
    ].filter(Boolean));

    if (merged) {
      await client.query(
        `UPDATE release_users SET ru_other_images = $1::jsonb WHERE ru_id = $2`,
        [JSON.stringify(merged), row.ru_id]
      );
    }
  }
  console.log(`  release_users: migrated ${res.rows.length} row(s)`);
}

async function migrateAuctionUsers(client) {
  const hasAuImage = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'auction_users' AND column_name = 'au_image'
  `);
  if (!hasAuImage.rows.length) {
    console.log("  auction_users: au_image column already removed");
    return;
  }

  const res = await client.query(`
    SELECT au_id, au_other_images, au_image
    FROM auction_users
    WHERE au_image IS NOT NULL AND au_image <> ''
  `);

  for (const row of res.rows) {
    const profileEntry = {
      path: String(row.au_image).startsWith("uploads/")
        ? row.au_image
        : `uploads/auction/${row.au_id}/${row.au_image}`,
      filename: String(row.au_image).split("/").pop(),
      label: "Profile Photo",
      note: "",
    };
    const merged = mergeImages(row.au_other_images, [profileEntry]);
    if (merged) {
      await client.query(
        `UPDATE auction_users SET au_other_images = $1::jsonb WHERE au_id = $2`,
        [JSON.stringify(merged), row.au_id]
      );
    }
  }
  console.log(`  auction_users (au_image): migrated ${res.rows.length} row(s)`);
}

async function migrateMoneyLenders(client) {
  const colCheck = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'money_lenders' AND column_name = 'ml_adhaar_front_img'
  `);
  if (!colCheck.rows.length) {
    console.log("  money_lenders: legacy columns already removed");
    return;
  }

  const hasOther = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'money_lenders' AND column_name = 'ml_other_images'
  `);
  if (!hasOther.rows.length) {
    console.log("  money_lenders: ml_other_images column missing — run schema sync first");
    return;
  }

  const res = await client.query(`
    SELECT ml_id,
           ml_other_images,
           ml_adhaar_front_img,
           ml_adhaar_back_img,
           ml_pan_img
    FROM money_lenders
    WHERE ml_adhaar_front_img IS NOT NULL
       OR ml_adhaar_back_img IS NOT NULL
       OR ml_pan_img IS NOT NULL
  `);

  for (const row of res.rows) {
    const merged = mergeImages(row.ml_other_images, [
      withLabel(row.ml_adhaar_front_img, "Aadhaar Front"),
      withLabel(row.ml_adhaar_back_img, "Aadhaar Back"),
      withLabel(row.ml_pan_img, "PAN Card"),
    ].filter(Boolean));

    if (merged) {
      await client.query(
        `UPDATE money_lenders SET ml_other_images = $1::jsonb WHERE ml_id = $2`,
        [JSON.stringify(merged), row.ml_id]
      );
    }
  }
  console.log(`  money_lenders: migrated ${res.rows.length} row(s)`);
}

async function migrateTenant(dbName) {
  const client = new Client({ connectionString: `${BASE_URL}/${dbName}` });
  await client.connect();
  try {
    console.log(`\nMigrating "${dbName}"...`);
    await migrateUsers(client);
    await migrateStaff(client);
    await migrateReleaseUsers(client);
    await migrateAuctionUsers(client);
    await migrateMoneyLenders(client);
  } finally {
    await client.end();
  }
}

async function main() {
  const masterClient = new Client({ connectionString: `${BASE_URL}/master` });
  await masterClient.connect();
  try {
    const res = await masterClient.query(
      'SELECT own_db FROM "Owner" WHERE own_db IS NOT NULL'
    );
    const dbs = res.rows.map((r) => r.own_db);
    for (const dbName of dbs) {
      await migrateTenant(dbName);
    }
    console.log("\n✅ Image migration complete for all tenants.");
  } finally {
    await masterClient.end();
  }
}

main().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
