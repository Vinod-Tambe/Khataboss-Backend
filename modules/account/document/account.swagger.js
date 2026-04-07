"use strict";

/**
 * @swagger
 * components:
 *   schemas:
 *     Account:
 *       type: object
 *       required:
 *         - acc_name
 *         - acc_opening_date
 *       properties:
 *         acc_id:
 *           type: integer
 *         acc_uuid:
 *           type: string
 *         acc_add_date:
 *           type: string
 *           format: date-time
 *         acc_own_id:
 *           type: integer
 *         acc_firm_id:
 *           type: integer
 *         acc_pan_no:
 *           type: string
 *           maxLength: 10
 *         acc_name:
 *           type: string
 *         acc_desc:
 *           type: string
 *         acc_pre_acc:
 *           type: string
 *         acc_bank_no:
 *           type: string
 *         acc_bsr_no:
 *           type: string
 *         acc_ifsc_code:
 *           type: string
 *           maxLength: 11
 *         acc_branch_name:
 *           type: string
 *         acc_opening_date:
 *           type: string
 *           format: date-time
 *         acc_address:
 *           type: string
 *         acc_country:
 *           type: string
 *         acc_state:
 *           type: string
 *         acc_city:
 *           type: string
 *         acc_pincode:
 *           type: string
 *           maxLength: 6
 *         acc_cash_balance:
 *           type: string
 *         acc_balance_type:
 *           type: string
 *           enum: [CR, DR]
 *         acc_other_info:
 *           type: string
 *
 * /account:
 *   get:
 *     summary: Get all accounts for the authenticated owner
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: firmId
 *         required: false
 *         description: Filter accounts by firm ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Account'
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a new account
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Account'
 *     responses:
 *       201:
 *         description: Account created successfully
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Conflict - Duplicate account name within the firm
 *
 * /account/dropdown:
 *   get:
 *     summary: Get all accounts for dropdown (id and name only)
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: firmId
 *         required: false
 *         description: Filter accounts by firm ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of accounts for dropdown
 *       401:
 *         description: Unauthorized
 *
 * /account/{uuid}:
 *   get:
 *     summary: Get account by UUID
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Account not found
 *   put:
 *     summary: Update an existing account by UUID
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Account'
 *     responses:
 *       200:
 *         description: Account updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Account not found
 *       409:
 *         description: Conflict - Duplicate account name within the firm
 *   delete:
 *     summary: Soft delete an account by UUID
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       401:
 *         description: Unauthorized
 */
