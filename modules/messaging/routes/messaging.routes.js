"use strict";

const express = require("express");
const router = express.Router();
const messagingController = require("../controller/messaging.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");
const requirePermission = require("../../../middlewares/permission.middleware");
const uploadMessage = require("../../../middlewares/uploadMessage.middleware");

// Templates — list + update only (seeded system templates; no create/delete)
router.get(
  "/templates",
  authenticateOwner,
  requirePermission("sms.view"),
  (req, res) => messagingController.getTemplates(req, res)
);
router.put(
  "/templates/:uuid",
  authenticateOwner,
  requirePermission("sms.manage"),
  uploadMessage.array("attachments", 5),
  (req, res) => messagingController.updateTemplate(req, res)
);

// WhatsApp instance settings
router.get(
  "/whatsapp/settings",
  authenticateOwner,
  requirePermission("sms.view"),
  (req, res) => messagingController.getWhatsAppSettings(req, res)
);
router.post(
  "/whatsapp/settings",
  authenticateOwner,
  requirePermission("sms.manage"),
  (req, res) => messagingController.saveWhatsAppSettings(req, res)
);
router.post(
  "/whatsapp/make-instance",
  authenticateOwner,
  requirePermission("sms.manage"),
  (req, res) => messagingController.makeWhatsAppInstance(req, res)
);
router.get(
  "/whatsapp/status",
  authenticateOwner,
  requirePermission("sms.view"),
  (req, res) => messagingController.refreshWhatsAppStatus(req, res)
);
router.post(
  "/whatsapp/disconnect",
  authenticateOwner,
  requirePermission("sms.manage"),
  (req, res) => messagingController.disconnectWhatsApp(req, res)
);

// Optional send helpers
router.post(
  "/email/send",
  authenticateOwner,
  requirePermission("sms.manage"),
  (req, res) => messagingController.sendTestEmail(req, res)
);
router.get(
  "/email/settings",
  authenticateOwner,
  requirePermission("sms.view"),
  (req, res) => messagingController.getEmailSettings(req, res)
);
router.put(
  "/email/settings",
  authenticateOwner,
  requirePermission("sms.manage"),
  (req, res) => messagingController.saveEmailSettings(req, res)
);
router.post(
  "/email/settings/test",
  authenticateOwner,
  requirePermission("sms.manage"),
  (req, res) => messagingController.testEmailSettings(req, res)
);
router.delete(
  "/email/settings",
  authenticateOwner,
  requirePermission("sms.manage"),
  (req, res) => messagingController.clearEmailSettings(req, res)
);
router.post(
  "/whatsapp/send",
  authenticateOwner,
  requirePermission("sms.manage"),
  (req, res) => messagingController.sendWhatsApp(req, res)
);
router.post(
  "/dispatch",
  authenticateOwner,
  requirePermission("sms.manage"),
  uploadMessage.single("document"),
  (req, res) => messagingController.dispatchMessage(req, res)
);

module.exports = router;
