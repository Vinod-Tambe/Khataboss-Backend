"use strict";

const express = require("express");
const router = express.Router();
const messagingController = require("../controller/messaging.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");
const uploadMessage = require("../../../middlewares/uploadMessage.middleware");

// Templates — list + update only (seeded system templates; no create/delete)
router.get("/templates", authenticateOwner, (req, res) =>
  messagingController.getTemplates(req, res)
);
router.put(
  "/templates/:uuid",
  authenticateOwner,
  uploadMessage.array("attachments", 5),
  (req, res) => messagingController.updateTemplate(req, res)
);

// WhatsApp instance settings
router.get("/whatsapp/settings", authenticateOwner, (req, res) =>
  messagingController.getWhatsAppSettings(req, res)
);
router.post("/whatsapp/settings", authenticateOwner, (req, res) =>
  messagingController.saveWhatsAppSettings(req, res)
);
router.post("/whatsapp/make-instance", authenticateOwner, (req, res) =>
  messagingController.makeWhatsAppInstance(req, res)
);
router.get("/whatsapp/status", authenticateOwner, (req, res) =>
  messagingController.refreshWhatsAppStatus(req, res)
);
router.post("/whatsapp/disconnect", authenticateOwner, (req, res) =>
  messagingController.disconnectWhatsApp(req, res)
);

// Optional send helpers
router.post("/email/send", authenticateOwner, (req, res) =>
  messagingController.sendTestEmail(req, res)
);
router.get("/email/settings", authenticateOwner, (req, res) =>
  messagingController.getEmailSettings(req, res)
);
router.put("/email/settings", authenticateOwner, (req, res) =>
  messagingController.saveEmailSettings(req, res)
);
router.post("/email/settings/test", authenticateOwner, (req, res) =>
  messagingController.testEmailSettings(req, res)
);
router.delete("/email/settings", authenticateOwner, (req, res) =>
  messagingController.clearEmailSettings(req, res)
);
router.post("/whatsapp/send", authenticateOwner, (req, res) =>
  messagingController.sendWhatsApp(req, res)
);
router.post(
  "/dispatch",
  authenticateOwner,
  uploadMessage.single("document"),
  (req, res) => messagingController.dispatchMessage(req, res)
);

module.exports = router;
