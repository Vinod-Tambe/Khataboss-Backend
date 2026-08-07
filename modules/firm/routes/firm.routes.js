"use strict";

const express = require("express");
const router = express.Router();
const firmController = require("../controller/firm.controller");
const upload = require("../../../middlewares/upload.middleware");
const authenticateOwner = require("../../../middlewares/auth.middleware");
const requirePermission = require("../../../middlewares/permission.middleware");

const firmUploadFields = [
  { name: "firm_own_sign_img", maxCount: 1 },
  { name: "firm_left_logo_img", maxCount: 1 },
  { name: "firm_right_logo_img", maxCount: 1 },
  { name: "firm_qr_code_img", maxCount: 1 },
  { name: "firm_pan_no_img", maxCount: 1 },
];

router.get("/", authenticateOwner, requirePermission("firm.view"), (req, res) => firmController.getFirms(req, res));
// Dropdown used across modules — authenticated users only
router.get("/dropdown", authenticateOwner, (req, res) => firmController.getFirmsDropdown(req, res));
router.get("/:uuid", authenticateOwner, requirePermission("firm.view"), (req, res) => firmController.getFirmByUuid(req, res));
router.post(
  "/",
  authenticateOwner,
  requirePermission("firm.create"),
  upload.fields(firmUploadFields),
  (req, res) => firmController.createFirm(req, res)
);
router.put(
  "/:uuid",
  authenticateOwner,
  requirePermission("firm.edit"),
  upload.fields(firmUploadFields),
  (req, res) => firmController.updateFirm(req, res)
);
router.delete("/:uuid", authenticateOwner, requirePermission("firm.delete"), (req, res) => firmController.deleteFirm(req, res));

module.exports = router;
