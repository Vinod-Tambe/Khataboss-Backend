"use strict";

const { PrismaClient } = require("../../../prisma/generated/main");

class UserService {
  /**
   * Get the prisma client for the given tenant database URL.
   * @param {string} dbUrl 
   */
  getPrisma(dbUrl) {
    return new PrismaClient({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
  }

  /**
   * Create a new user.
   * @param {string} dbUrl 
   * @param {object} userData 
   */
  async createUser(dbUrl, userData) {
    const prisma = this.getPrisma(dbUrl);
    try {
      return await prisma.user.create({
        data: userData,
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Get a user by UUID.
   * @param {string} dbUrl 
   * @param {string} user_uuid 
   */
  async getUserByUuid(dbUrl, user_uuid) {
    const prisma = this.getPrisma(dbUrl);
    try {
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
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Update a user by UUID.
   * @param {string} dbUrl 
   * @param {string} user_uuid 
   * @param {object} updateData 
   */
  async updateUserByUuid(dbUrl, user_uuid, updateData) {
    const prisma = this.getPrisma(dbUrl);
    try {
      return await prisma.user.update({
        where: { user_uuid: user_uuid },
        data: updateData,
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  async checkUniqueFields(dbUrl, userData, excludeUuid = null) {
    const prisma = this.getPrisma(dbUrl);
    try {
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
    } finally {
      await prisma.$disconnect();
    }
  }
  /**
   * Get all users.
   * @param {string} dbUrl 
   * @param {number|string} firmId 
   * @param {string} search
   */
  async getUsers(dbUrl, firmId, search = "") {
    const prisma = this.getPrisma(dbUrl);
    try {
      const where = {
        user_is_deleted: false,
      };

      if (firmId) {
        where.user_firm_id = parseInt(firmId);
      }

      if (search) {
        where.OR = [
          { user_first_name: { contains: search, mode: "insensitive" } },
          { user_last_name: { contains: search, mode: "insensitive" } },
          { user_father_name: { contains: search, mode: "insensitive" } },
          { user_mobile_no: { contains: search, mode: "insensitive" } },
          { user_phone_no: { contains: search, mode: "insensitive" } },
          { user_email_id: { contains: search, mode: "insensitive" } },
          { user_city: { contains: search, mode: "insensitive" } },
          { user_state: { contains: search, mode: "insensitive" } },
          { user_country: { contains: search, mode: "insensitive" } },
          { user_per_address: { contains: search, mode: "insensitive" } },
          { user_curr_address: { contains: search, mode: "insensitive" } },
        ];
      }

      return await prisma.user.findMany({
        where,
        orderBy: {
          user_created_at: "desc",
        },
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Soft delete a user by UUID.
   * @param {string} dbUrl 
   * @param {string} user_uuid 
   * @param {string} deletedBy 
   */
  async deleteUserByUuid(dbUrl, user_uuid, deletedBy) {
    const prisma = this.getPrisma(dbUrl);
    try {
      return await prisma.user.update({
        where: { user_uuid: user_uuid },
        data: {
          user_is_deleted: true,
          user_deleted_at: new Date(),
          user_deleted_by: deletedBy,
        },
      });
    } finally {
      await prisma.$disconnect();
    }
  }
  /**
   * Get user full name by ID.
   * @param {string} dbUrl 
   * @param {number|string} userId 
   */
  async get_user_full_name(dbUrl, userId) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const user = await prisma.user.findUnique({
        where: { user_id: parseInt(userId) },
        select: { user_first_name: true, user_last_name: true },
      });
      return user ? `${user.user_first_name} ${user.user_last_name || ""}`.trim() : null;
    } finally {
      await prisma.$disconnect();
    }
  }
}

module.exports = new UserService();
