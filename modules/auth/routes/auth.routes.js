"use strict";

const express = require("express");
const authController = require("../controller/auth.controller");

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate an owner and receive session tokens
 *     description: Validates user credentials (email, mobile, or login ID) against the owner database and returns access and refresh tokens along with personal profile details.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login_id
 *               - password
 *             properties:
 *               login_id:
 *                 type: string
 *                 description: Can be email, mobile number, or alphanumeric login ID.
 *                 example: owner@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's account password.
 *                 example: password123
 *     responses:
 *       200:
 *         description: login successful. Returns tokens and personal profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: login successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT access token for authenticated requests.
 *                     refreshToken:
 *                       type: string
 *                       description: Token used to refresh the access token.
 *                     owner:
 *                       type: object
 *                       description: Filtered personal details of the authenticated owner.
 *                       properties:
 *                         own_uuid:
 *                           type: string
 *                           format: uuid
 *                         own_first_name:
 *                           type: string
 *                         own_middle_name:
 *                           type: string
 *                         own_last_name:
 *                           type: string
 *                         own_email:
 *                           type: string
 *                         own_mobile_no:
 *                           type: string
 *                         own_phone_no:
 *                           type: string
 *                         own_profile_img:
 *                           type: object
 *                           nullable: true
 *                         own_address:
 *                           type: string
 *                         own_village:
 *                           type: string
 *                         own_city:
 *                           type: string
 *                         own_state:
 *                           type: string
 *                         own_pincode:
 *                           type: string
 *       400:
 *         description: Bad Request. Missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: please enter login id and password.
 *       401:
 *         description: Unauthorized. Incorrect password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: incorrect password.
 *       403:
 *         description: Forbidden. Account is inactive.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: account is inactive.
 *       404:
 *         description: Not Found. Login ID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: account not found.
 */
router.post("/login", (req, res) => authController.login(req, res));

/**
 * @swagger
 * /auth/send-otp:
 *   post:
 *     summary: Send OTP to the owner's email
 *     description: Finds the owner by login_id (email, mobile, or login ID) and sends a 6-digit OTP to their registered email address.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - own_login_id
 *             properties:
 *               own_login_id:
 *                 type: string
 *                 description: Can be email, mobile number, or login ID.
 *                 example: owner@example.com
 *     responses:
 *       200:
 *         description: otp send your register email
 *       400:
 *         description: bad request
 *       404:
 *         description: account not found
 */
router.post("/send-otp", (req, res) => authController.sendOtp(req, res));

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP and log in
 *     description: Verifies the OTP sent to the user and returns session tokens upon successful validation.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - own_login_id
 *               - otp
 *             properties:
 *               own_login_id:
 *                 type: string
 *                 description: Can be email, mobile number, or login ID.
 *                 example: owner@example.com
 *               otp:
 *                 type: string
 *                 description: The 6-digit OTP received via email.
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: login successful
 *       401:
 *         description: invalid or expired otp
 */
router.post("/verify-otp", (req, res) => authController.verifyOtp(req, res));

module.exports = router;
