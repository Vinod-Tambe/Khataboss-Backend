/**
 * @swagger
 * components:
 *   schemas:
 *     Owner:
 *       type: object
 *       required:
 *         - own_first_name
 *         - own_last_name
 *         - own_email
 *         - own_login_id
 *         - own_mobile_no
 *         - own_password
 *         - own_confirm_password
 *       properties:
 *         own_first_name: { type: string }
 *         own_middle_name: { type: string }
 *         own_last_name: { type: string }
 *         own_phone_no: { type: string }
 *         own_mobile_no: { type: string }
 *         own_email: { type: string, format: email }
 *         own_login_id: { type: string }
 *         own_password: { type: string, format: password }
 *         own_confirm_password: { type: string, format: password }
 *         own_address: { type: string }
 *         own_village: { type: string }
 *         own_city: { type: string }
 *         own_state: { type: string }
 *         own_pincode: { type: string }
 *         own_created_by: { type: string }
 *         own_profile_img: { type: string, format: binary, description: "Profile image file" }
 *         own_db: { type: string, readOnly: true, description: "Database name (System generated)" }
 *
 * /owner:
 *   get:
 *     summary: Fetch a list of all owners from the master database
 *     tags: [Owner]
 *     responses:
 *       200:
 *         description: Owners fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: "string" }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Owner'
 *       500:
 *         description: Internal Server Error
 *
 * /owner/{uuid}:
 *   patch:
 *     summary: Update an existing owner's details
 *     tags: [Owner]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: The UUID of the owner to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               own_first_name: { type: string }
 *               own_last_name: { type: string }
 *               own_email: { type: string }
 *               own_phone_no: { type: string }
 *               own_mobile_no: { type: string }
 *               own_address: { type: string }
 *               own_village: { type: string }
 *               own_city: { type: string }
 *               own_state: { type: string }
 *               own_pincode: { type: string }
 *               own_profile_img: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Owner updated successfully
 *       404:
 *         description: Owner not found
 *       500:
 *         description: Internal Server Error
 *
 *   delete:
 *     summary: Soft delete an existing owner
 *     tags: [Owner]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: The UUID of the owner to delete
 *     responses:
 *       200:
 *         description: Owner deleted successfully
 *       404:
 *         description: Owner not found
 *       500:
 *         description: Internal Server Error
 */
