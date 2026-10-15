"use strict";

const express = require("express");
const router = express.Router();
const messagingController = require("../controller/messaging.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");
const requirePermission = require("../../../middlewares/permission.middleware");
const { requireSmsChannelPermission } = require("../../../middlewares/smsChannelPermission.middleware");
const {
  viewKeysForChannel,
  manageKeysForChannel,
} = require("../../../common/constants/smsChannelPermissions");
const uploadMessage = require("../../../middlewares/uploadMessage.middleware");

// Templates — list + update only (seeded system templates; no create/delete)
router.get(
  "/templates",
  authenticateOwner,
  requireSmsChannelPermission("view"),
  (req, res) => messagingController.getTemplates(req, res)
);
router.put(
  "/templates/:uuid",
  authenticateOwner,
  requireSmsChannelPermission("manage"),
  uploadMessage.array("attachments", 5),
  (req, res) => messagingController.updateTemplate(req, res)
);
router.post(
  "/templates/test",
  authenticateOwner,
  requireSmsChannelPermission("manage"),
  uploadMessage.array("attachments", 5),
  (req, res) => messagingController.testTemplateSend(req, res)
);

// WhatsApp instance settings
router.get(
  "/whatsapp/settings",
  authenticateOwner,
  requirePermission(viewKeysForChannel("whatsapp"), { mode: "any" }),
  (req, res) => messagingController.getWhatsAppSettings(req, res)
);
router.post(
  "/whatsapp/settings",
  authenticateOwner,
  requirePermission(manageKeysForChannel("whatsapp"), { mode: "any" }),
  (req, res) => messagingController.saveWhatsAppSettings(req, res)
);
router.post(
  "/whatsapp/make-instance",
  authenticateOwner,
  requirePermission(manageKeysForChannel("whatsapp"), { mode: "any" }),
  (req, res) => messagingController.makeWhatsAppInstance(req, res)
);
router.get(
  "/whatsapp/status",
  authenticateOwner,
  requirePermission(viewKeysForChannel("whatsapp"), { mode: "any" }),
  (req, res) => messagingController.refreshWhatsAppStatus(req, res)
);
router.post(
  "/whatsapp/disconnect",
  authenticateOwner,
  requirePermission(manageKeysForChannel("whatsapp"), { mode: "any" }),
  (req, res) => messagingController.disconnectWhatsApp(req, res)
);

// Optional send helpers
router.post(
  "/email/send",
  authenticateOwner,
  requirePermission(manageKeysForChannel("email"), { mode: "any" }),
  (req, res) => messagingController.sendTestEmail(req, res)
);
router.get(
  "/email/settings",
  authenticateOwner,
  requirePermission(viewKeysForChannel("email"), { mode: "any" }),
  (req, res) => messagingController.getEmailSettings(req, res)
);
router.put(
  "/email/settings",
  authenticateOwner,
  requirePermission(manageKeysForChannel("email"), { mode: "any" }),
  (req, res) => messagingController.saveEmailSettings(req, res)
);
router.post(
  "/email/settings/test",
  authenticateOwner,
  requirePermission(manageKeysForChannel("email"), { mode: "any" }),
  (req, res) => messagingController.testEmailSettings(req, res)
);
router.delete(
  "/email/settings",
  authenticateOwner,
  requirePermission(manageKeysForChannel("email"), { mode: "any" }),
  (req, res) => messagingController.clearEmailSettings(req, res)
);
router.post(
  "/whatsapp/send",
  authenticateOwner,
  requirePermission(manageKeysForChannel("whatsapp"), { mode: "any" }),
  (req, res) => messagingController.sendWhatsApp(req, res)
);
router.post(
  "/dispatch",
  authenticateOwner,
  requireSmsChannelPermission("manage"),
  uploadMessage.single("document"),
  (req, res) => messagingController.dispatchMessage(req, res)
);

module.exports = router;
