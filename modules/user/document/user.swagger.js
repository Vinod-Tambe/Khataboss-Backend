"use strict";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - user_first_name
 *         - user_last_name
 *         - user_mobile_no
 *         - user_firm_id
 *       properties:
 *         user_id:
 *           type: integer
 *         user_uuid:
 *           type: string
 *         user_own_id:
 *           type: integer
 *         user_firm_id:
 *           type: integer
 *         user_first_name:
 *           type: string
 *         user_last_name:
 *           type: string
 *         user_father_name:
 *           type: string
 *         user_mother_name:
 *           type: string
 *         user_mobile_no:
 *           type: string
 *         user_phone_no:
 *           type: string
 *         user_email_id:
 *           type: string
 *         user_gender:
 *           type: string
 *           enum: [Male, Female, Other]
 *         user_marital_status:
 *           type: string
 *           enum: [Married, Unmarried, Other]
 *         user_birth_date:
 *           type: string
 *           format: date
 *         user_gstin:
 *           type: string
 *         user_tax_no:
 *           type: string
 *         user_pan_no:
 *           type: string
 *           maxLength: 10
 *         user_adhaar_no:
 *           type: string
 *           maxLength: 12
 *         user_per_address:
 *           type: string
 *         user_curr_address:
 *           type: string
 *         user_village:
 *           type: string
 *         user_ward_no:
 *           type: string
 *         user_tehsil:
 *           type: string
 *         user_city:
 *           type: string
 *         user_state:
 *           type: string
 *         user_country:
 *           type: string
 *         user_pincode:
 *           type: string
 *           maxLength: 6
 *
 * /user:
 *   post:
 *     summary: Create a new user with document uploads (using DB column names)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               user_firm_id:
 *                 type: integer
 *                 description: ID of the firm the user belongs to
 *               user_first_name:
 *                 type: string
 *               user_last_name:
 *                 type: string
 *               user_father_name:
 *                 type: string
 *               user_mother_name:
 *                 type: string
 *               user_mobile_no:
 *                 type: string
 *               user_phone_no:
 *                 type: string
 *                 description: Optional phone number
 *               user_email_id:
 *                 type: string
 *               user_gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *               user_marital_status:
 *                 type: string
 *                 enum: [Single, Married, Divorced, Widowed]
 *               user_birth_date:
 *                 type: string
 *                 format: date
 *               user_gstin:
 *                 type: string
 *               user_tax_no:
 *                 type: string
 *               user_pan_no:
 *                 type: string
 *               user_adhaar_no:
 *                 type: string
 *               user_per_address:
 *                 type: string
 *               user_curr_address:
 *                 type: string
 *               user_village:
 *                 type: string
 *               user_ward_no:
 *                 type: string
 *               user_tehsil:
 *                 type: string
 *               user_city:
 *                 type: string
 *               user_state:
 *                 type: string
 *               user_country:
 *                 type: string
 *               user_pincode:
 *                 type: string
 *               user_bank_name:
 *                 type: string
 *               user_bank_acc_no:
 *                 type: string
 *               user_ifsc_code:
 *                 type: string
 *               user_other_info:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Profile Photo
 *               adhaarFront:
 *                 type: string
 *                 format: binary
 *                 description: Aadhaar Card Front
 *               adhaarBack:
 *                 type: string
 *                 format: binary
 *                 description: Aadhaar Card Back
 *               panCard:
 *                 type: string
 *                 format: binary
 *                 description: PAN Card Photo
 *               signature:
 *                 type: string
 *                 format: binary
 *                 description: User Signature Image
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/User' }
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Conflict - Mobile or Email already exists
 *       500:
 *         description: Internal server error
 *   get:
 *     summary: Get all users for the authenticated owner
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: firmId
 *         required: false
 *         description: Filter users by firm ID
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         required: false
 *         description: Search users by multiple fields (name, mobile, address, etc.)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *
 * /user/{uuid}:
 *   delete:
 *     summary: Soft delete a user by UUID
 *     tags: [User]
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
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *   get:
 *     summary: Get user details by UUID
 *     tags: [User]
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
 *         description: User details fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *   put:
 *     summary: Update user details by UUID (supporting file uploads)
 *     tags: [User]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               user_firm_id:
 *                 type: integer
 *               user_first_name:
 *                 type: string
 *               user_last_name:
 *                 type: string
 *               user_father_name:
 *                 type: string
 *               user_mother_name:
 *                 type: string
 *               user_mobile_no:
 *                 type: string
 *               user_phone_no:
 *                 type: string
 *               user_email_id:
 *                 type: string
 *               user_gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *               user_marital_status:
 *                 type: string
 *                 enum: [Single, Married, Divorced, Widowed]
 *               user_birth_date:
 *                 type: string
 *                 format: date
 *               user_gstin:
 *                 type: string
 *               user_tax_no:
 *                 type: string
 *               user_pan_no:
 *                 type: string
 *               user_adhaar_no:
 *                 type: string
 *               user_per_address:
 *                 type: string
 *               user_curr_address:
 *                 type: string
 *               user_village:
 *                 type: string
 *               user_ward_no:
 *                 type: string
 *               user_tehsil:
 *                 type: string
 *               user_city:
 *                 type: string
 *               user_state:
 *                 type: string
 *               user_country:
 *                 type: string
 *               user_pincode:
 *                 type: string
 *               user_bank_name:
 *                 type: string
 *               user_bank_acc_no:
 *                 type: string
 *               user_ifsc_code:
 *                 type: string
 *               user_other_info:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *               adhaarFront:
 *                 type: string
 *                 format: binary
 *               adhaarBack:
 *                 type: string
 *                 format: binary
 *               panCard:
 *                 type: string
 *                 format: binary
 *               signature:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
