"use strict";

const path = require("path");
const { PrismaClient } = require("../../prisma/generated/master");
const { hashPassword } = require("../../common/service/bcrypt.service");
const adminData = require("../core-data/admin.json");

const prisma = new PrismaClient();

/**
 * Seed the default admin record into the master database.
 * Skips seeding if an admin with the same login_id already exists.
 */
const seedAdmin = async () => {
  try {
    console.log("🌱  Seeding admin data...");

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { admin_login_id: adminData.admin_login_id },
    });

    if (existingAdmin) {
      console.log(
        `⏭️   Admin "${adminData.admin_login_id}" already exists — skipping seed.`
      );
      return;
    }

    // Hash the plain-text password from admin.json
    const hashedPassword = await hashPassword(adminData.admin_password);

    // Insert admin record
    const admin = await prisma.admin.create({
      data: {
        admin_first_name:   adminData.admin_first_name,
        admin_middle_name:  adminData.admin_middle_name ?? null,
        admin_last_name:    adminData.admin_last_name,
        admin_phone_no:     adminData.admin_phone_no ?? null,
        admin_mobile_no:    adminData.admin_mobile_no ?? null,
        admin_email:        adminData.admin_email,
        admin_login_id:     adminData.admin_login_id,
        admin_password:     hashedPassword,
        admin_login_status: adminData.admin_login_status ?? false,
        admin_address:      adminData.admin_address ?? null,
        admin_village:      adminData.admin_village ?? null,
        admin_city:         adminData.admin_city ?? null,
        admin_state:        adminData.admin_state ?? null,
        admin_pincode:      adminData.admin_pincode ?? null,
        admin_created_by:   adminData.admin_created_by ?? "system",
      },
    });

    console.log(
      `✅  Admin seeded successfully → ID: ${admin.admin_id}, Login: ${admin.admin_login_id}`
    );
  } catch (error) {
    console.error("❌  Error seeding admin:", error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

const seedDbSeries = async () => {
  try {
    const dbSeriesData = require("../core-data/db-series.json");
    console.log("🌱  Seeding DbSeries data...");

    // Check if series already exists
    const existingSeries = await prisma.dbSeries.findUnique({
      where: { series_name: dbSeriesData.series_name },
    });

    if (existingSeries) {
      console.log(
        `⏭️   Series "${dbSeriesData.series_name}" already exists — skipping seed.`
      );
      return;
    }

    // Insert series record
    const series = await prisma.dbSeries.create({
      data: {
        series_name: dbSeriesData.series_name,
        last_number: dbSeriesData.last_number,
      },
    });

    console.log(
      `✅  DbSeries seeded successfully → ID: ${series.id}, Name: ${series.series_name}`
    );
  } catch (error) {
    console.error("❌  Error seeding DbSeries:", error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = { seedAdmin, seedDbSeries };
