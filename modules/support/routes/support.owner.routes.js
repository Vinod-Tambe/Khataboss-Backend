"use strict";

const express = require("express");
const authenticateOwner = require("../../../middlewares/auth.middleware");
const upload = require("../../../middlewares/upload.middleware");
const supportController = require("../controller/support.controller");

const router = express.Router();

router.use(authenticateOwner);

router.get("/tickets", supportController.listOwnerTickets.bind(supportController));
router.get("/tickets/:uuid", supportController.getOwnerTicket.bind(supportController));
router.patch("/tickets/:uuid", supportController.updateOwnerTicket.bind(supportController));
const uploadTicketImages = upload.array("images", 5);
const uploadCommentImages = upload.array("images", 3);

const maybeUploadCommentImages = (req, res, next) => {
  const contentType = String(req.headers["content-type"] || "");
  if (contentType.includes("multipart/form-data")) {
    return uploadCommentImages(req, res, next);
  }
  return next();
};

const maybeUploadTicketImages = (req, res, next) => {
  const contentType = String(req.headers["content-type"] || "");
  if (contentType.includes("multipart/form-data")) {
    return uploadTicketImages(req, res, next);
  }
  return next();
};

router.post(
  "/tickets",
  maybeUploadTicketImages,
  supportController.createOwnerTicket.bind(supportController)
);
router.post(
  "/tickets/:uuid/images",
  uploadTicketImages,
  supportController.addOwnerTicketImages.bind(supportController)
);
router.delete(
  "/tickets/:uuid/images",
  supportController.removeOwnerTicketImage.bind(supportController)
);
router.post(
  "/tickets/:uuid/comments",
  maybeUploadCommentImages,
  supportController.addOwnerComment.bind(supportController)
);
router.patch(
  "/tickets/:uuid/comments/:commentUuid",
  maybeUploadCommentImages,
  supportController.updateOwnerComment.bind(supportController)
);

module.exports = router;
