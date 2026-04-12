"use strict";

/**
 * @swagger
 * components:
 *   schemas:
 *     Journal:
 *       type: object
 *       properties:
 *         jrnl_id:
 *           type: integer
 *         jrnl_uuid:
 *           type: string
 *         jrnl_date:
 *           type: string
 *         jrnl_amt:
 *           type: number
 *         jrnl_panel:
 *           type: string
 *         jrnl_other_info:
 *           type: string
 *
 * /journal:
 *   post:
 *     summary: Create a journal entry
 *     tags: [Journal]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Created
 *
 * /journal/{id}:
 *   delete:
 *     summary: Delete a journal entry
 *     tags: [Journal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: own_id
 *         required: true
 *       - in: query
 *         name: firm_id
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted
 */
