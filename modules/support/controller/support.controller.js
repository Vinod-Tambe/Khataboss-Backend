"use strict";

const supportService = require("../services/support.service");

class SupportController {
  async listOwnerTickets(req, res) {
    try {
      supportService.assertOwnerUser(req);
      const data = await supportService.listTicketsForOwner(req.user.own_id, {
        search: req.query.search,
        owner_status: req.query.owner_status,
      });
      return res.status(200).json({ message: "Support tickets fetched.", data });
    } catch (error) {
      const status = error.statusCode || 500;
      if (status >= 500) console.error("❌ listOwnerTickets:", error.message);
      return res.status(status).json({ error: error.message });
    }
  }

  async getOwnerTicket(req, res) {
    try {
      supportService.assertOwnerUser(req);
      const data = await supportService.getTicketForOwner(req.user.own_id, req.params.uuid);
      return res.status(200).json({ message: "Support ticket fetched.", data });
    } catch (error) {
      const status = error.statusCode || 500;
      if (status >= 500) console.error("❌ getOwnerTicket:", error.message);
      return res.status(status).json({ error: error.message });
    }
  }

  async createOwnerTicket(req, res) {
    try {
      const files = req.files || [];
      const data = await supportService.createTicketForOwner(req, files);
      return res.status(201).json({ message: "Support ticket created.", data });
    } catch (error) {
      const status = error.statusCode || 500;
      if (status >= 500) console.error("❌ createOwnerTicket:", error.message);
      return res.status(status).json({ error: error.message });
    }
  }

  async updateOwnerTicket(req, res) {
    try {
      const data = await supportService.updateTicketForOwner(
        req,
        req.params.uuid,
        req.body || {}
      );
      return res.status(200).json({ message: "Support ticket updated.", data });
    } catch (error) {
      const status = error.statusCode || 500;
      if (status >= 500) console.error("❌ updateOwnerTicket:", error.message);
      return res.status(status).json({ error: error.message });
    }
  }

  async addOwnerTicketImages(req, res) {
    try {
      const files = req.files || [];
      const data = await supportService.appendImagesToOwnerTicket(
        req,
        req.params.uuid,
        files
      );
      return res.status(200).json({ message: "Screenshots uploaded.", data });
    } catch (error) {
      const status = error.statusCode || 500;
      if (status >= 500) console.error("❌ addOwnerTicketImages:", error.message);
      return res.status(status).json({ error: error.message });
    }
  }

  async addOwnerComment(req, res) {
    try {
      const files = req.files || [];
      const data = await supportService.addOwnerComment(
        req,
        req.params.uuid,
        req.body?.stc_body || req.body?.body,
        files
      );
      return res.status(200).json({ message: "Comment added.", data });
    } catch (error) {
      const status = error.statusCode || 500;
      if (status >= 500) console.error("❌ addOwnerComment:", error.message);
      return res.status(status).json({ error: error.message });
    }
  }

  async updateOwnerComment(req, res) {
    try {
      const files = req.files || [];
      const removePaths =
        req.body?.stc_remove_paths ?? req.body?.remove_paths ?? req.body?.paths;
      const data = await supportService.updateOwnerComment(
        req,
        req.params.uuid,
        req.params.commentUuid,
        req.body?.stc_body ?? req.body?.body,
        files,
        removePaths
      );
      return res.status(200).json({ message: "Comment updated.", data });
    } catch (error) {
      const status = error.statusCode || 500;
      if (status >= 500) console.error("❌ updateOwnerComment:", error.message);
      return res.status(status).json({ error: error.message });
    }
  }

  async removeOwnerTicketImage(req, res) {
    try {
      const data = await supportService.removeOwnerTicketImage(
        req,
        req.params.uuid,
        req.body?.path || req.body?.image_path
      );
      return res.status(200).json({ message: "Screenshot removed.", data });
    } catch (error) {
      const status = error.statusCode || 500;
      if (status >= 500) console.error("❌ removeOwnerTicketImage:", error.message);
      return res.status(status).json({ error: error.message });
    }
  }

  async listAdminTickets(req, res) {
    try {
      const data = await supportService.listTicketsForAdmin({
        admin_status: req.query.admin_status,
        owner_status: req.query.owner_status,
        priority: req.query.priority,
        search: req.query.search,
      });
      return res.status(200).json({ message: "Support tickets fetched.", data });
    } catch (error) {
      const status = error.statusCode || 500;
      if (status >= 500) console.error("❌ listAdminTickets:", error.message);
      return res.status(status).json({ error: error.message });
    }
  }

  async getAdminTicket(req, res) {
    try {
      const data = await supportService.getTicketForAdmin(req.params.uuid);
      return res.status(200).json({ message: "Support ticket fetched.", data });
    } catch (error) {
      const status = error.statusCode || 500;
      if (status >= 500) console.error("❌ getAdminTicket:", error.message);
      return res.status(status).json({ error: error.message });
    }
  }

  async updateAdminTicket(req, res) {
    try {
      const data = await supportService.updateTicketForAdmin(
        req.params.uuid,
        req.body || {},
        req.admin
      );
      return res.status(200).json({ message: "Support ticket updated.", data });
    } catch (error) {
      const status = error.statusCode || 500;
      if (status >= 500) console.error("❌ updateAdminTicket:", error.message);
      return res.status(status).json({ error: error.message });
    }
  }

  async addAdminComment(req, res) {
    try {
      const files = req.files || [];
      const data = await supportService.addAdminComment(
        req.admin,
        req.params.uuid,
        req.body?.stc_body || req.body?.body,
        files
      );
      return res.status(200).json({ message: "Comment added.", data });
    } catch (error) {
      const status = error.statusCode || 500;
      if (status >= 500) console.error("❌ addAdminComment:", error.message);
      return res.status(status).json({ error: error.message });
    }
  }

  async updateAdminComment(req, res) {
    try {
      const files = req.files || [];
      const removePaths =
        req.body?.stc_remove_paths ?? req.body?.remove_paths ?? req.body?.paths;
      const data = await supportService.updateAdminComment(
        req.admin,
        req.params.uuid,
        req.params.commentUuid,
        req.body?.stc_body ?? req.body?.body,
        files,
        removePaths
      );
      return res.status(200).json({ message: "Comment updated.", data });
    } catch (error) {
      const status = error.statusCode || 500;
      if (status >= 500) console.error("❌ updateAdminComment:", error.message);
      return res.status(status).json({ error: error.message });
    }
  }
}

module.exports = new SupportController();
