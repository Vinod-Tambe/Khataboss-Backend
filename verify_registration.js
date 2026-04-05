"use strict";

const ownerController = require("./modules/owner/controller/owner.controller");
const { PrismaClient } = require("./prisma/generated/master");
require("dotenv").config();

const masterPrisma = new PrismaClient();

async function verifyRegistration() {
  console.log("🧪  Starting verification test for Owner Registration...");

  // Mock request and response
  const req = {
    body: {
      own_first_name: "Test",
      own_last_name: "Owner",
      own_email: `test${Date.now()}@example.com`,
      own_login_id: `testowner${Date.now()}`,
      own_password: "password123",
      own_confirm_password: "password123",
    },
    file: null,
  };

  const res = {
    status: (code) => {
      console.log(`HTTP Status: ${code}`);
      return res;
    },
    json: (data) => {
      console.log("Response Data:", JSON.stringify(data, null, 2));
      return res;
    },
  };

  try {
    // Check initial DbSeries number
    const initialSeries = await masterPrisma.dbSeries.findUnique({
      where: { series_name: "kboss" },
    });
    console.log(`📊  Initial kboss number: ${initialSeries.last_number}`);

    // Call the controller method
    await ownerController.createOwner(req, res);

    // Check final DbSeries number
    const finalSeries = await masterPrisma.dbSeries.findUnique({
      where: { series_name: "kboss" },
    });
    console.log(`📊  Final kboss number: ${finalSeries.last_number}`);

    if (finalSeries.last_number === initialSeries.last_number + 1) {
      console.log("✅  DbSeries incremented correctly!");
    } else {
      console.log("❌  DbSeries did not increment correctly.");
    }

  } catch (error) {
    console.error("❌  Verification test failed:", error.message);
  } finally {
    await masterPrisma.$disconnect();
  }
}

verifyRegistration();
