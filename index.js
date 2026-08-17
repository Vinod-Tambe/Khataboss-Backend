"use strict";

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
require("./config/db");

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
    const { isR2Configured } = require("./config/r2");
    const { isCloudflareAccessEnabled } = require("./config/storage");
    app.listen(PORT, () => {
      console.log(`🚀  Server running on port ${PORT}`);
      if (!isCloudflareAccessEnabled()) {
        console.log("🚫  Image storage: disabled (CLOUDFLARE_ACCESS=false)");
      } else if (isR2Configured()) {
        console.log("☁️  Image storage: Cloudflare R2 (owner-scoped paths)");
      } else {
        console.log("⚠️  Image storage: CLOUDFLARE_ACCESS=true but R2 credentials missing");
      }
    });
  } catch (error) {
    console.error("❌  Failed to start server:", error.message);
    process.exit(1);
  }
};


startServer();


