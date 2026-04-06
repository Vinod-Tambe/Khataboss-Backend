"use strict";

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Image:
 *       type: object
 *       properties:
 *         filename: { type: string }
 *         originalName: { type: string }
 *         path: { type: string }
 *         mimetype: { type: string }
 *         size: { type: integer }
 *     Firm:
 *       type: object
 *       required:
 *         - firm_name
 *         - firm_reg_no
 *         - firm_shop_name
 *         - firm_phone_no
 *         - firm_email_id
 *         - firm_start_date
 *       properties:
 *         firm_id:
 *           type: integer
 *         firm_uuid:
 *           type: string
 *         firm_add_date:
 *           type: string
 *           format: date-time
 *         firm_name:
 *           type: string
 *         firm_reg_no:
 *           type: string
 *         firm_shop_name:
 *           type: string
 *         firm_desc:
 *           type: string
 *         firm_address:
 *           type: string
 *         firm_city:
 *           type: string
 *         firm_pincode:
 *           type: string
 *         firm_phone_no:
 *           type: string
 *         firm_email_id:
 *           type: string
 *         firm_website_link:
 *           type: string
 *         firm_type:
 *           type: string
 *           enum: [Sole_Proprietorship, Partnership, LLP, Private_Ltd, Other]
 *         firm_owner:
 *           type: string
 *         firm_other_info:
 *           type: string
 *         firm_geo_latitude:
 *           type: string
 *         firm_geo_longitude:
 *           type: string
 *         firm_whatsapp_link:
 *           type: string
 *         firm_facebook_link:
 *           type: string
 *         firm_insta_link:
 *           type: string
 *         firm_bank_name:
 *           type: string
 *         firm_bank_acc_no:
 *           type: string
 *         firm_bank_branch:
 *           type: string
 *         firm_bank_address:
 *           type: string
 *         firm_acc_holder:
 *           type: string
 *         firm_acc_type: { type: string }
 *         firm_ifsc_code: { type: string }
 *         firm_start_date:
 *           type: string
 *           format: date
 *         firm_balance:
 *           type: string
 *         firm_balance_type:
 *           type: string
 *           enum: [DR, CR]
 *         firm_gstin_no:
 *           type: string
 *         firm_pan_no:
 *           type: string
 *         firm_adhaar_no:
 *           type: string
 *         firm_form_header:
 *           type: string
 *         firm_form_footer:
 *           type: string
 *         firm_own_sign_img:
 *           $ref: '#/components/schemas/Image'
 *         firm_left_logo_img:
 *           $ref: '#/components/schemas/Image'
 *         firm_right_logo_img:
 *           $ref: '#/components/schemas/Image'
 *         firm_qr_code_img:
 *           $ref: '#/components/schemas/Image'
 *         firm_pan_no_img:
 *           $ref: '#/components/schemas/Image'
 *
 * /firm:
 *   get:
 *     summary: Get all firms for the authenticated owner
 *     tags: [Firm]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of firms
 *       401:
 *         description: Unauthorized
 *
 * /firm/dropdown:
 *   get:
 *     summary: Get all firms for dropdown (id and name only)
 *     tags: [Firm]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of firms for dropdown
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a new firm with optional image uploads
 *     tags: [Firm]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firm_add_date: { type: string, format: date-time }
 *               firm_name: { type: string }
 *               firm_reg_no: { type: string }
 *               firm_shop_name: { type: string }
 *               firm_desc: { type: string }
 *               firm_address: { type: string }
 *               firm_city: { type: string }
 *               firm_pincode: { type: string }
 *               firm_phone_no: { type: string }
 *               firm_email_id: { type: string }
 *               firm_website_link: { type: string }
 *               firm_type: { type: string, enum: [Sole_Proprietorship, Partnership, LLP, Private_Ltd, Other] }
 *               firm_owner: { type: string }
 *               firm_other_info: { type: string }
 *               firm_geo_latitude: { type: string }
 *               firm_geo_longitude: { type: string }
 *               firm_whatsapp_link: { type: string }
 *               firm_facebook_link: { type: string }
 *               firm_insta_link: { type: string }
 *               firm_bank_name: { type: string }
 *               firm_bank_acc_no: { type: string }
 *               firm_bank_branch: { type: string }
 *               firm_bank_address: { type: string }
 *               firm_acc_holder: { type: string }
 *               firm_acc_type: { type: string }
 *               firm_ifsc_code: { type: string }
 *               firm_start_date: { type: string, format: date }
 *               firm_balance: { type: string }
 *               firm_balance_type: { type: string, enum: [DR, CR] }
 *               firm_gstin_no: { type: string }
 *               firm_pan_no: { type: string }
 *               firm_adhaar_no: { type: string }
 *               firm_form_header: { type: string }
 *               firm_form_footer: { type: string }
 *               firm_own_sign_img: { type: string, format: binary }
 *               firm_left_logo_img: { type: string, format: binary }
 *               firm_right_logo_img: { type: string, format: binary }
 *               firm_qr_code_img: { type: string, format: binary }
 *               firm_pan_no_img: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Firm created successfully
 *       401:
 *         description: Unauthorized
 *
 * /firm/{uuid}:
 *   get:
 *     summary: Get firm by UUID
 *     tags: [Firm]
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
 *         description: Firm details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Firm not found
 *   put:
 *     summary: Update an existing firm by UUID
 *     tags: [Firm]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firm_add_date: { type: string, format: date-time }
 *               firm_name: { type: string }
 *               firm_reg_no: { type: string }
 *               firm_shop_name: { type: string }
 *               firm_desc: { type: string }
 *               firm_address: { type: string }
 *               firm_city: { type: string }
 *               firm_pincode: { type: string }
 *               firm_phone_no: { type: string }
 *               firm_email_id: { type: string }
 *               firm_website_link: { type: string }
 *               firm_type: { type: string, enum: [Sole_Proprietorship, Partnership, LLP, Private_Ltd, Other] }
 *               firm_owner: { type: string }
 *               firm_other_info: { type: string }
 *               firm_geo_latitude: { type: string }
 *               firm_geo_longitude: { type: string }
 *               firm_whatsapp_link: { type: string }
 *               firm_facebook_link: { type: string }
 *               firm_insta_link: { type: string }
 *               firm_bank_name: { type: string }
 *               firm_bank_acc_no: { type: string }
 *               firm_bank_branch: { type: string }
 *               firm_bank_address: { type: string }
 *               firm_acc_holder: { type: string }
 *               firm_acc_type: { type: string }
 *               firm_ifsc_code: { type: string }
 *               firm_start_date: { type: string, format: date }
 *               firm_balance: { type: string }
 *               firm_balance_type: { type: string, enum: [DR, CR] }
 *               firm_gstin_no: { type: string }
 *               firm_pan_no: { type: string }
 *               firm_adhaar_no: { type: string }
 *               firm_form_header: { type: string }
 *               firm_form_footer: { type: string }
 *               firm_own_sign_img: { type: string, format: binary }
 *               firm_left_logo_img: { type: string, format: binary }
 *               firm_right_logo_img: { type: string, format: binary }
 *               firm_qr_code_img: { type: string, format: binary }
 *               firm_pan_no_img: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Firm updated successfully
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Soft delete a firm by UUID
 *     tags: [Firm]
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
 *         description: Firm deleted successfully
 *       401:
 *         description: Unauthorized
 */
