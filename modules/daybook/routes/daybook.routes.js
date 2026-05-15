"use strict";

const express = require("express");
const router = express.Router();
const daybookController = require("../controller/daybook.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Daybook
 *   description: Daybook management APIs
 */

router.get("/", authenticateOwner, (req, res) => daybookController.get_all_daybook_entries(req, res));

module.exports = router;
