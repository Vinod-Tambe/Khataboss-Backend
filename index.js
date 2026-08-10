"use strict";

require("dotenv").config();

const app = require("./server");
const { bootstrapDatabase } = require("./config/db");
const whatsappService = require("./common/service/whatsapp.service");

const PORT = process.env.APP_PORT || 3000;

const startServer = async () => {
  try {
    // Step 1: Ensure DB exists, run migrations, seed admin
    await bootstrapDatabase();

    // Step 2: Restore WhatsApp Web sessions from disk
    whatsappService
      .restorePersistedSessions()
      .then(({ restored }) => {
        if (restored > 0) {
          console.log(`📱  Restoring ${restored} WhatsApp session(s) from disk…`);
        }
      })
      .catch((err) => {
        console.warn("⚠️  WhatsApp session restore skipped:", err.message);
      });

    // Step 3: Start Express server
    app.listen(PORT, () => {
      console.log(`🚀  Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌  Failed to start server:", error.message);
    process.exit(1);
  }
};


startServer();


