"use strict";

const express = require("express");
const router = express.Router();
const ownerController = require("../controller/owner.controller");
const upload = require("../../../middlewares/upload.middleware");

/**
 * @swagger
 * /owner:
 *   post:
 *     summary: Create a new owner and initialize their database
 *     tags: [Owner]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Owner'
 *     responses:
 *       201:
 *         description: Owner created and database initialized successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: "string", example: "Owner created and database initialized successfully." }
 *                 data:
 *                   type: object
 *                   properties:
 *                     uuid: { type: "string" }
 *                     db: { type: "string", description: "The dynamic database name generated" }
 *                     email: { type: "string" }
 *       400:
 *         description: Bad Request (missing fields or password mismatch)
 *       500:
 *         description: Internal Server Error
 */
router.get("/", ownerController.getOwners);
router.post("/", upload.single("own_profile_img"), ownerController.createOwner);
router.patch("/:uuid", upload.single("own_profile_img"), ownerController.updateOwner);
router.delete("/:uuid", ownerController.deleteOwner);

module.exports = router;
