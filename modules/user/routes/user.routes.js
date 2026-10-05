"use strict";

const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const upload = require("../../../middlewares/upload.middleware");
const authenticateOwner = require("../../../middlewares/auth.middleware");
const requirePermission = require("../../../middlewares/permission.middleware");

const userUploadFields = [
  { name: "photo", maxCount: 1 },
  { name: "other_images", maxCount: 10 },
];

router.post(
  "/",
  authenticateOwner,
  requirePermission("user.create"),
  upload.fields(userUploadFields),
  (req, res) => userController.createUser(req, res)
);

router.get(
  "/",
  authenticateOwner,
  requirePermission("user.view"),
  (req, res) => userController.getUsers(req, res)
);

router.get(
  "/deleted/list",
  authenticateOwner,
  requirePermission("user.view"),
  (req, res) => userController.getDeletedUsers(req, res)
);

// Search used by loan/finance — allow if user can view OR create loans/finance
router.get(
  "/search",
  authenticateOwner,
  requirePermission(["user.view", "loan.view", "finance.view", "loan.create", "finance.create"], { mode: "any" }),
  (req, res) => userController.searchUsers(req, res)
);

router.get(
  "/global-search",
  authenticateOwner,
  requirePermission(["user.view", "loan.view", "finance.view", "loan.create", "finance.create"], { mode: "any" }),
  (req, res) => userController.globalSearch(req, res)
);

router.post(
  "/:uuid/restore",
  authenticateOwner,
  requirePermission("user.delete"),
  (req, res) => userController.restoreUser(req, res)
);

router.delete(
  "/:uuid",
  authenticateOwner,
  requirePermission("user.delete"),
  (req, res) => userController.deleteUser(req, res)
);

router.get(
  "/:uuid",
  authenticateOwner,
  requirePermission("user.view"),
  (req, res) => userController.getUserByUuid(req, res)
);

router.put(
  "/:uuid",
  authenticateOwner,
  requirePermission("user.edit"),
  upload.fields(userUploadFields),
  (req, res) => userController.updateUser(req, res)
);

module.exports = router;
