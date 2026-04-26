/**
 * @swagger
 * tags:
 *   name: Finance
 *   description: Finance management, EMI tracking and payments
 */

/**
 * @swagger
 * /finance:
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
 *             type: object
 *             required:
 *               - fin_firm_id
 *               - fin_prin_amt
 *               - fin_no_of_emi
 *               - fin_start_date
 *             properties:
 *               fin_firm_id:
 *                 type: integer
 *               fin_user_id:
 *                 type: integer
 *               fin_prin_amt:
 *                 type: number
 *               fin_no_of_emi:
 *                 type: integer
 *               fin_start_date:
 *                 type: string
 *                 format: date
 *               fin_emi_amt:
 *                 type: number
 *     responses:
 *       201:
 *         description: Finance record created successfully
 *       500:
 *         description: Server error
 *
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
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of finance records
 *
 * /finance/{id}:
 *   get:
 *     summary: Get finance details (including EMIs and History)
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Finance details fetched successfully
 *       404:
 *         description: Finance record not found
 *
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
 *           type: integer
 *     responses:
 *       200:
 *         description: Finance record deleted successfully
 *
 * /finance/payment:
 *   post:
 *     summary: Process a finance EMI payment
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fm_fin_id
 *               - fm_trans_amt
 *               - fm_trans_date
 *             properties:
 *               fm_fin_id:
 *                 type: integer
 *               fm_trans_amt:
 *                 type: number
 *               fm_trans_date:
 *                 type: string
 *                 format: date
 *               fm_cash_amt:
 *                 type: number
 *               fm_bank_amt:
 *                 type: number
 *               fm_online_amt:
 *                 type: number
 *               fm_card_amt:
 *                 type: number
 *     responses:
 *       201:
 *         description: Payment processed successfully
 *       500:
 *         description: Server error
 */
