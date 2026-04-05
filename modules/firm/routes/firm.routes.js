"use strict";

const express = require("express");
const router = express.Router();
const firmController = require("../controller/firm.controller");
const upload = require("../../../middlewares/upload.middleware");
const authenticateOwner = require("../../../middlewares/auth.middleware");

// Define fields for uploading multiple image files
const firmUploadFields = [
  { name: "firm_own_sign_img", maxCount: 1 },
  { name: "firm_left_logo_img", maxCount: 1 },
  { name: "firm_right_logo", maxCount: 1 },
];

/**
 * @swagger
 * tags:
 *   name: Firm
 *   description: Firm management APIs for tenant databases
 */

router.get("/", authenticateOwner, (req, res) => firmController.getFirms(req, res));
router.get("/:id", authenticateOwner, (req, res) => firmController.getFirmById(req, res));
router.post(
  "/",
  authenticateOwner,
  upload.fields(firmUploadFields),
  (req, res) => firmController.createFirm(req, res)
);
router.put(
  "/:id",
  authenticateOwner,
  upload.fields(firmUploadFields),
  (req, res) => firmController.updateFirm(req, res)
);
router.delete("/:id", authenticateOwner, (req, res) => firmController.deleteFirm(req, res));

module.exports = router;
