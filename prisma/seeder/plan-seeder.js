"use strict";

const { PrismaClient } = require("../../prisma/generated/master");
const plansData = require("../core-data/plans.json");
const { ownerModuleMapFromKeys } = require("./owner-module-seeder");

const prisma = new PrismaClient();

const mapPlanRow = (plan) => ({
  plan_name: plan.plan_name,
  plan_code: plan.plan_code,
  plan_description: plan.plan_description || null,
  plan_price: plan.plan_price,
  plan_offer_price: plan.plan_offer_price ?? null,
  plan_currency: plan.plan_currency || "INR",
  plan_billing_cycle: plan.plan_billing_cycle || "Yearly",
  plan_duration_days: plan.plan_duration_days ?? null,
  plan_max_firms: plan.plan_max_firms ?? 1,
  plan_max_staff: plan.plan_max_staff ?? 10,
  plan_modules: ownerModuleMapFromKeys(plan.plan_module_keys || []),
  plan_features: plan.plan_features || [],
  plan_is_popular: !!plan.plan_is_popular,
  plan_sort_order: plan.plan_sort_order ?? 0,
  plan_status: plan.plan_status === "Inactive" ? "Inactive" : "Active",
  plan_created_by: "system",
  plan_updated_by: "system",
});

/**
 * Seed default subscription plans into the master database.
 * Skips plans whose plan_code already exists (not soft-deleted).
 */
const seedPlans = async () => {
  try {
    console.log("🌱  Seeding plans...");

    let created = 0;
    let skipped = 0;

    for (const plan of plansData) {
      const existing = await prisma.plan.findFirst({
        where: {
          plan_code: plan.plan_code,
          plan_is_deleted: false,
        },
      });

      if (existing) {
        console.log(`⏭️   Plan "${plan.plan_code}" already exists — skipping.`);
        skipped += 1;
        continue;
      }

      const row = await prisma.plan.create({
        data: mapPlanRow(plan),
      });

      console.log(
        `✅  Plan seeded → ${row.plan_name} (${row.plan_code}) · ₹${row.plan_offer_price || row.plan_price}/yr`
      );
      created += 1;
    }

    console.log(`✅  Plans seed complete (${created} created, ${skipped} skipped).`);
  } catch (error) {
    console.error("❌  Error seeding plans:", error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = { seedPlans };
