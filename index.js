"use strict";

require("dotenv").config();

const app = require("./server");
const { bootstrapDatabase } = require("./config/db");

const PORT = process.env.APP_PORT || 3000;

const startServer = async () => {
  try {
    // Step 1: Ensure DB exists, run migrations, seed admin
    await bootstrapDatabase();

    // Step 2: Start Express server
    app.listen(PORT, () => {
      console.log(`🚀  Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌  Failed to start server:", error.message);
    process.exit(1);
  }
};


startServer();


