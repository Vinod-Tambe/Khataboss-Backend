"use strict";

const express = require("express");
const router = express.Router();
const mediaController = require("../controller/media.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");

router.get(
  "/data-url",
  authenticateOwner,
  (req, res) => mediaController.getImageDataUrl(req, res)
);

module.exports = router;
