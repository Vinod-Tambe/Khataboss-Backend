"use strict";

const { getTenantPrisma } = require("../../utils/tenantPrisma");
const serialNumberService = require("../../common/service/serialNumber.service");

const DEMO_CUSTOMER_MOBILE = "9876500101";

function buildDemoCustomerUserData({ user_own_id, user_firm_id, user_unique_code }) {
  return {
    user_own_id,
    user_firm_id,
    user_unique_code,
    user_created_by: "system-demo-seed",
    user_first_name: "Rajesh",
    user_last_name: "Patil",
    user_father_name: "Ramesh Patil",
    user_mother_name: "Sunita Patil",
    user_spouse_name: "Priya Patil",
    user_mobile_no: DEMO_CUSTOMER_MOBILE,
    user_phone_no: "02025678901",
    user_whatsapp_no: DEMO_CUSTOMER_MOBILE,
    user_email_id: "rajesh.patil.demo@example.com",
    user_gender: "Male",
    user_cast: "Maratha",
    user_marital_status: "Married",
    user_occupation: "Retail shopkeeper (grocery)",
    user_birth_date: new Date("1985-06-15T00:00:00.000Z"),
    user_gstin: "27ABCPR1234D1Z5",
    user_tax_no: "TAX-DEMO-2026",
    user_pan_no: "ABCPR1234D",
    user_adhaar_no: "234567890123",
    user_bank_name: "State Bank of India",
    user_bank_acc_no: "38475612901",
    user_ifsc_code: "SBIN0001234",
    user_per_address: "Shop No. 12, Main Market Road, Near Bus Stand, Wagholi",
    user_curr_address: "Shop No. 12, Main Market Road, Near Bus Stand, Wagholi",
    user_village: "Wagholi",
    user_ward_no: "5",
    user_tehsil: "Haveli",
    user_city: "Pune",
    user_state: "Maharashtra",
    user_country: "India",
    user_pincode: "412207",
    user_nominee_name: "Priya Patil",
    user_nominee_relation: "Spouse",
    user_nominee_mobile: "9876500102",
    user_nominee_address: "Same as customer current address, Wagholi, Pune",
    user_other_info:
      "Demo customer for Khataboss training and header search testing. " +
      "Includes full KYC-style fields (address, bank, nominee). Safe to delete after demo.",
  };
}

/**
 * Create one fully detailed demo customer per tenant (idempotent by mobile).
 */
async function seedDemoCustomerForTenant(dbUrl) {
  const prisma = getTenantPrisma(dbUrl);
  try {
    const existing = await prisma.user.findFirst({
      where: {
        user_mobile_no: DEMO_CUSTOMER_MOBILE,
        user_is_deleted: false,
      },
      select: { user_id: true, user_unique_code: true },
    });

    if (existing) {
      return {
        action: "skipped",
        reason: "Demo customer already exists",
        user_id: existing.user_id,
        user_unique_code: existing.user_unique_code,
      };
    }

    const firm = await prisma.firm.findFirst({
      where: { firm_is_deleted: false },
      orderBy: { firm_id: "asc" },
      select: { firm_id: true, firm_own_id: true, firm_name: true },
    });

    if (!firm) {
      return { action: "skipped", reason: "No active firm in tenant" };
    }

    const user_unique_code = await serialNumberService.getNextSerialNumber(prisma, "USER");
    const userData = buildDemoCustomerUserData({
      user_own_id: firm.firm_own_id,
      user_firm_id: firm.firm_id,
      user_unique_code,
    });

    const created = await prisma.user.create({ data: userData });

    return {
      action: "created",
      user_id: created.user_id,
      user_unique_code: created.user_unique_code,
      firm_name: firm.firm_name,
      customer_name: `${created.user_first_name} ${created.user_last_name}`,
    };
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = { seedDemoCustomerForTenant };
