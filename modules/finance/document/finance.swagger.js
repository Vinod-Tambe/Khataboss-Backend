"use strict";

/**
 * @swagger
 * components:
 *   schemas:
 *     Finance:
 *       type: object
 *       required:
 *         - fin_prin_amt
 *         - fin_no_of_emi
 *         - fin_start_date
 *       properties:
 *         fin_id:
 *           type: integer
 *         fin_uuid:
 *           type: string
 *         fin_own_id:
 *           type: integer
 *         fin_firm_id:
 *           type: integer
 *         fin_user_id:
 *           type: integer
 *         fin_prin_amt:
 *           type: number
 *         fin_no_of_emi:
 *           type: integer
 *         fin_start_date:
 *           type: string
 *         fin_freq:
 *           type: string
 *           enum: [MONTHLY, WEEKLY, YEARLY]
 *         fin_roi:
 *           type: string
 *         fin_emi_amt:
 *           type: number
 *         fin_final_amt:
 *           type: number
 *         fin_status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, PARTIAL, CLOSED, COMPLETED]
 *
 * /finance:
 *   get:
 *     summary: Get all finance records
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: firmId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create a new finance record
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Finance'
 *     responses:
 *       201:
 *         description: Created
 *
 * /finance/{id}:
 *   delete:
 *     summary: Delete a finance record
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */
