"use strict";

const express = require("express");
const releaseController = require("../controller/release.controller");
const verifyToken = require("../../../middlewares/auth.middleware");

const router = express.Router();

router.use(verifyToken);

router.post("/", (req, res) => releaseController.addRelease(req, res));

module.exports = router;
