"use strict";

const express = require("express");
const router = express.Router();
const announcementController = require("../controller/announcement.controller");
const authenticateAdmin = require("../../../middlewares/admin.middleware");
const authenticateToken = require("../../../middlewares/auth.middleware");

router.get("/public/feed", announcementController.getPublicFeed);
router.get("/feed", authenticateToken, announcementController.getFeed);

router.post("/templates/seed", authenticateAdmin, announcementController.seedTemplates);

router.use(authenticateAdmin);
router.get("/", announcementController.getAnnouncements);
router.get("/:uuid", announcementController.getAnnouncementByUuid);
router.post("/", announcementController.createAnnouncement);
router.patch("/:uuid", announcementController.updateAnnouncement);
router.delete("/:uuid", announcementController.deleteAnnouncement);

module.exports = router;
