"use strict";

const announcementService = require("../services/announcement.service");

class AnnouncementController {
  async getFeed(req, res) {
    try {
      const data = await announcementService.getActiveFeed();
      return res.status(200).json({ message: "Announcements fetched.", data });
    } catch (error) {
      console.error("❌  getFeed:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  async getAnnouncements(req, res) {
    try {
      const data = await announcementService.getAll();
      return res.status(200).json({ message: "Announcements fetched.", data });
    } catch (error) {
      console.error("❌  getAnnouncements:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  async getAnnouncementByUuid(req, res) {
    try {
      const data = await announcementService.getByUuid(req.params.uuid);
      if (!data) return res.status(404).json({ error: "Announcement not found." });
      return res.status(200).json({ message: "Announcement fetched.", data });
    } catch (error) {
      console.error("❌  getAnnouncementByUuid:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  async createAnnouncement(req, res) {
    try {
      const data = await announcementService.create(
        req.body,
        req.admin?.admin_login_id || "Admin"
      );
      return res.status(201).json({ message: "Announcement created.", data });
    } catch (error) {
      console.error("❌  createAnnouncement:", error.message);
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async updateAnnouncement(req, res) {
    try {
      const data = await announcementService.update(
        req.params.uuid,
        req.body,
        req.admin?.admin_login_id || "Admin"
      );
      return res.status(200).json({ message: "Announcement updated.", data });
    } catch (error) {
      console.error("❌  updateAnnouncement:", error.message);
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async deleteAnnouncement(req, res) {
    try {
      await announcementService.delete(
        req.params.uuid,
        req.admin?.admin_login_id || "Admin"
      );
      return res.status(200).json({ message: "Announcement deleted." });
    } catch (error) {
      console.error("❌  deleteAnnouncement:", error.message);
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}

module.exports = new AnnouncementController();
