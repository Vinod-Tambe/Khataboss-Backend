"use strict";

const express = require("express");
const router = express.Router();
const ownerController = require("../controller/owner.controller");
const upload = require("../../../middlewares/upload.middleware");
const authenticateAdmin = require("../../../middlewares/admin.middleware");

router.use(authenticateAdmin);

router.get("/", ownerController.getOwners);
router.get("/:uuid", ownerController.getOwnerByUuid);
router.post("/", upload.single("own_profile_img"), ownerController.createOwner);
router.patch("/:uuid/status", ownerController.updateOwnerStatus);
router.post("/:uuid/reset-password", ownerController.resetOwnerPassword);
router.patch("/:uuid", upload.single("own_profile_img"), ownerController.updateOwner);
router.delete("/:uuid", ownerController.deleteOwner);

module.exports = router;
