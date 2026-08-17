"use strict";

const { getTenantPrisma } = require("../../../utils/tenantPrisma");
const serialNumberService = require("../../../common/service/serialNumber.service");

class UserService {
  /**
   * Get the prisma client for the given tenant database URL.
   * @param {string} dbUrl 
   */
  getPrisma(dbUrl) {
    return getTenantPrisma(dbUrl);
  }

  /**
   * Create a new user.
   * @param {string} dbUrl 
   * @param {object} userData 
   */
  async createUser(dbUrl, userData) {
    const prisma = this.getPrisma(dbUrl);

      if (!userData.user_unique_code) {
        userData.user_unique_code = await serialNumberService.getNextSerialNumber(prisma, "USER");
      }
      return await prisma.user.create({
        data: userData,
      });
    
  }

  /**
   * Get a user by UUID.
   * @param {string} dbUrl 
   * @param {string} user_uuid 
   */
  async getUserByUuid(dbUrl, user_uuid) {
    const prisma = this.getPrisma(dbUrl);

      return await prisma.user.findUnique({
        where: { user_uuid: user_uuid },
        include: {
          firm: {
            select: {
              firm_name: true,
              firm_id: true,
            },
          },
        },
      });
    
  }

  /**
   * Update a user by UUID.
   * @param {string} dbUrl 
   * @param {string} user_uuid 
   * @param {object} updateData 
   */
  async updateUserByUuid(dbUrl, user_uuid, updateData) {
    const prisma = this.getPrisma(dbUrl);

      return await prisma.user.update({
        where: { user_uuid: user_uuid },
        data: updateData,
      });
    
  }

  async checkUniqueFields(dbUrl, userData, excludeUuid = null) {
    const prisma = this.getPrisma(dbUrl);

      // 5-field combined duplicate check
      const matchingUser = await prisma.user.findFirst({
        where: {
          user_firm_id: userData.user_firm_id,
          user_first_name: userData.user_first_name,
          user_last_name: userData.user_last_name,
          user_father_name: userData.user_father_name,
          user_mobile_no: userData.user_mobile_no,
          NOT: excludeUuid ? { user_uuid: excludeUuid } : undefined,
        },
      });

      if (matchingUser) {
        if (matchingUser.user_is_deleted) {
          return { error: "user already exists in deleted list" };
        }
        return { error: "user already exists" };
      }

      return null;
    
  }
  /**
   * Fast autocomplete search for header suggestions.
   * Lean select + limit for large datasets.
   */
  async searchUsers(dbUrl, firmId, q = "", limit = 12) {
    const prisma = this.getPrisma(dbUrl);

      const search = String(q || "").trim();
      if (search.length < 1) return [];

      const digitsOnly = search.replace(/\D/g, "");

      const take = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 20);
      const where = {
        user_is_deleted: false,
      };

      if (firmId && firmId !== "all" && firmId !== "undefined") {
        where.user_firm_id = parseInt(firmId, 10);
      }

      const or = [
        { user_unique_code: { contains: search, mode: "insensitive" } },
        { user_mobile_no: { contains: search, mode: "insensitive" } },
        { user_phone_no: { contains: search, mode: "insensitive" } },
        { user_email_id: { contains: search, mode: "insensitive" } },
        { user_first_name: { contains: search, mode: "insensitive" } },
        { user_last_name: { contains: search, mode: "insensitive" } },
        { user_father_name: { contains: search, mode: "insensitive" } },
        { user_curr_address: { contains: search, mode: "insensitive" } },
        { user_per_address: { contains: search, mode: "insensitive" } },
        { user_city: { contains: search, mode: "insensitive" } },
        { user_state: { contains: search, mode: "insensitive" } },
        { user_country: { contains: search, mode: "insensitive" } },
        { user_pincode: { contains: search, mode: "insensitive" } },
      ];

      if (digitsOnly.length >= 3 && digitsOnly !== search) {
        or.unshift({ user_mobile_no: { contains: digitsOnly } });
        or.unshift({ user_phone_no: { contains: digitsOnly } });
      }

      if (/^\d+$/.test(search)) {
        const id = parseInt(search, 10);
        if (!Number.isNaN(id) && id <= 2147483647) {
          or.unshift({ user_id: id });
        }
      }

      where.OR = or;

      return await prisma.user.findMany({
        where,
        take,
        orderBy: [{ user_id: "desc" }],
        select: {
          user_id: true,
          user_uuid: true,
          user_unique_code: true,
          user_first_name: true,
          user_last_name: true,
          user_father_name: true,
          user_mobile_no: true,
          user_email_id: true,
          user_firm_id: true,
          user_profile_img: true,
          user_other_info: true,
          user_curr_address: true,
          user_per_address: true,
          user_city: true,
          user_state: true,
          user_country: true,
          user_pincode: true,
        },
      });
    
  }

  /**
   * Get all users.
   * @param {string} dbUrl 
   * @param {number|string} firmId 
   * @param {string} search
   */
  async getUsers(dbUrl, firmId, search = "") {
    const prisma = this.getPrisma(dbUrl);

      const where = {
        user_is_deleted: false,
      };

      if (firmId) {
        where.user_firm_id = parseInt(firmId);
      }

      if (search) {
        const cleanSearch = String(search).trim();
        const digitsOnly = cleanSearch.replace(/\D/g, "");

        const or = [
          { user_unique_code: { contains: cleanSearch, mode: "insensitive" } },
          { user_first_name: { contains: cleanSearch, mode: "insensitive" } },
          { user_last_name: { contains: cleanSearch, mode: "insensitive" } },
          { user_father_name: { contains: cleanSearch, mode: "insensitive" } },
          { user_mobile_no: { contains: cleanSearch, mode: "insensitive" } },
          { user_phone_no: { contains: cleanSearch, mode: "insensitive" } },
          { user_email_id: { contains: cleanSearch, mode: "insensitive" } },
          { user_city: { contains: cleanSearch, mode: "insensitive" } },
          { user_state: { contains: cleanSearch, mode: "insensitive" } },
          { user_country: { contains: cleanSearch, mode: "insensitive" } },
          { user_per_address: { contains: cleanSearch, mode: "insensitive" } },
          { user_curr_address: { contains: cleanSearch, mode: "insensitive" } },
        ];

        if (digitsOnly.length >= 3 && digitsOnly !== cleanSearch) {
          or.unshift({ user_mobile_no: { contains: digitsOnly } });
          or.unshift({ user_phone_no: { contains: digitsOnly } });
        }

        where.OR = or;
      }

      return await prisma.user.findMany({
        where,
        orderBy: {
          user_created_at: "desc",
        },
      });
    
  }

  /**
   * Soft delete a user by UUID.
   * @param {string} dbUrl 
   * @param {string} user_uuid 
   * @param {string} deletedBy 
   */
  async deleteUserByUuid(dbUrl, user_uuid, deletedBy) {
    const prisma = this.getPrisma(dbUrl);

      return await prisma.user.update({
        where: { user_uuid: user_uuid },
        data: {
          user_is_deleted: true,
          user_deleted_at: new Date(),
          user_deleted_by: deletedBy,
        },
      });
    
  }
  /**
   * Get user full name by ID.
   * @param {string} dbUrl 
   * @param {number|string} userId 
   */
  async get_user_full_name(dbUrl, userId) {
    const prisma = this.getPrisma(dbUrl);

      const user = await prisma.user.findUnique({
        where: { user_id: parseInt(userId) },
        select: { user_first_name: true, user_last_name: true },
      });
      return user ? `${user.user_first_name} ${user.user_last_name || ""}`.trim() : null;
    
  }
}

module.exports = new UserService();
