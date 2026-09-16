"use strict";

const express = require("express");
const authenticateAdmin = require("../../../middlewares/admin.middleware");
const upload = require("../../../middlewares/upload.middleware");
const supportController = require("../controller/support.controller");

const router = express.Router();

const uploadCommentImages = upload.array("images", 3);

const maybeUploadCommentImages = (req, res, next) => {
  const contentType = String(req.headers["content-type"] || "");
  if (contentType.includes("multipart/form-data")) {
    return uploadCommentImages(req, res, next);
  }
  return next();
};

router.use(authenticateAdmin);

router.get("/tickets", supportController.listAdminTickets.bind(supportController));
router.get("/tickets/:uuid", supportController.getAdminTicket.bind(supportController));
router.patch("/tickets/:uuid", supportController.updateAdminTicket.bind(supportController));
router.post(
  "/tickets/:uuid/comments",
  maybeUploadCommentImages,
  supportController.addAdminComment.bind(supportController)
);
router.patch(
  "/tickets/:uuid/comments/:commentUuid",
  maybeUploadCommentImages,
  supportController.updateAdminComment.bind(supportController)
);

module.exports = router;
