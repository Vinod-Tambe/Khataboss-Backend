"use strict";

const express = require("express");
const router = express.Router();
const staffController = require("../controller/staff.controller");
const upload = require("../../../middlewares/upload.middleware");
const authenticateOwner = require("../../../middlewares/auth.middleware");
const requirePermission = require("../../../middlewares/permission.middleware");

const staffUploadFields = [
  { name: "photo", maxCount: 1 },
  { name: "adhaarFront", maxCount: 1 },
  { name: "adhaarBack", maxCount: 1 },
  { name: "panCard", maxCount: 1 },
  { name: "signature", maxCount: 1 },
];

router.get(
  "/permissions/catalog",
  authenticateOwner,
  requirePermission("staff.view"),
  (req, res) => staffController.getPermissionCatalog(req, res)
);

router.post(
  "/",
  authenticateOwner,
  requirePermission("staff.create"),
  upload.fields(staffUploadFields),
  (req, res) => staffController.createStaff(req, res)
);

router.get(
  "/",
  authenticateOwner,
  requirePermission("staff.view"),
  (req, res) => staffController.getStaffList(req, res)
);

router.get(
  "/:uuid",
  authenticateOwner,
  requirePermission("staff.view"),
  (req, res) => staffController.getStaffByUuid(req, res)
);

router.put(
  "/:uuid",
  authenticateOwner,
  requirePermission("staff.edit"),
  upload.fields(staffUploadFields),
  (req, res) => staffController.updateStaff(req, res)
);

router.patch(
  "/:uuid/password",
  authenticateOwner,
  requirePermission("staff.edit"),
  (req, res) => staffController.updateStaffPassword(req, res)
);

router.patch(
  "/:uuid/permissions",
  authenticateOwner,
  requirePermission("staff.edit"),
  (req, res) => staffController.updateStaffPermissions(req, res)
);

router.delete(
  "/:uuid",
  authenticateOwner,
  requirePermission("staff.delete"),
  (req, res) => staffController.deleteStaff(req, res)
);

module.exports = router;
