"use strict";

const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const upload = require("../../../middlewares/upload.middleware");
const authenticateOwner = require("../../../middlewares/auth.middleware");

// Define fields for uploading multiple image files
const userUploadFields = [
  { name: "photo", maxCount: 1 },
  { name: "adhaarFront", maxCount: 1 },
  { name: "adhaarBack", maxCount: 1 },
  { name: "panCard", maxCount: 1 },
  { name: "signature", maxCount: 1 },
];

router.post(
  "/",
  authenticateOwner,
  upload.fields(userUploadFields),
  (req, res) => userController.createUser(req, res)
);

router.get(
  "/",
  authenticateOwner,
  (req, res) => userController.getUsers(req, res)
);

// Must be registered before /:uuid
router.get(
  "/search",
  authenticateOwner,
  (req, res) => userController.searchUsers(req, res)
);

router.delete(
  "/:uuid",
  authenticateOwner,
  (req, res) => userController.deleteUser(req, res)
);

router.get(
  "/:uuid",
  authenticateOwner,
  (req, res) => userController.getUserByUuid(req, res)
);

router.put(
  "/:uuid",
  authenticateOwner,
  upload.fields(userUploadFields),
  (req, res) => userController.updateUser(req, res)
);

module.exports = router;
