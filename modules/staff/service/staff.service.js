"use strict";

const { getTenantPrisma } = require("../../../utils/tenantPrisma");
const { hashPassword } = require("../../../common/service/bcrypt.service");
const {
  emptyPermissionMatrix,
  keysToPermissionMatrix,
  permissionMatrixToKeys,
} = require("../../../prisma/seeder/permission-seeder");

class StaffService {
  getPrisma(dbUrl) {
    return getTenantPrisma(dbUrl);
  }

  toPublicStaff(staff, ownerLoginId = null) {
    if (!staff) return null;
    const { staff_password, staff_jwt_token, staff_refresh_token, staff_otp, ...safe } = staff;
    return {
      ...safe,
      full_login_id:
        ownerLoginId && staff.staff_login_id
          ? `${ownerLoginId}+${staff.staff_login_id}`
          : staff.staff_login_id,
    };
  }

  async checkUniqueFields(dbUrl, data, excludeUuid = null) {
    const prisma = this.getPrisma(dbUrl);
    const or = [];
    if (data.staff_login_id) or.push({ staff_login_id: data.staff_login_id });
    if (data.staff_mobile_no) or.push({ staff_mobile_no: data.staff_mobile_no });
    if (data.staff_email_id) or.push({ staff_email_id: data.staff_email_id });
    if (or.length === 0) return null;

    const existing = await prisma.staff.findFirst({
      where: {
        OR: or,
        staff_is_deleted: false,
        ...(excludeUuid ? { NOT: { staff_uuid: excludeUuid } } : {}),
      },
    });

    if (!existing) return null;

    if (data.staff_login_id && existing.staff_login_id === data.staff_login_id) {
      return { error: "Staff login ID already exists." };
    }
    if (data.staff_mobile_no && existing.staff_mobile_no === data.staff_mobile_no) {
      return { error: "Staff mobile number already exists." };
    }
    if (data.staff_email_id && existing.staff_email_id === data.staff_email_id) {
      return { error: "Staff email already exists." };
    }
    return { error: "Staff details already exist." };
  }

  async createStaff(dbUrl, staffData, permissionKeys = []) {
    const prisma = this.getPrisma(dbUrl);
    const hashed = await hashPassword(staffData.staff_password);
    const created = await prisma.staff.create({
      data: {
        ...staffData,
        staff_password: hashed,
      },
    });

    if (permissionKeys.length > 0) {
      await this.setStaffPermissions(dbUrl, created.staff_id, permissionKeys);
    }

    return created;
  }

  async getStaffList(dbUrl, { search = "" } = {}) {
    const prisma = this.getPrisma(dbUrl);
    const where = { staff_is_deleted: false };
    if (search && String(search).trim()) {
      const q = String(search).trim();
      where.OR = [
        { staff_first_name: { contains: q, mode: "insensitive" } },
        { staff_last_name: { contains: q, mode: "insensitive" } },
        { staff_mobile_no: { contains: q, mode: "insensitive" } },
        { staff_email_id: { contains: q, mode: "insensitive" } },
        { staff_login_id: { contains: q, mode: "insensitive" } },
      ];
    }

    return prisma.staff.findMany({
      where,
      orderBy: { staff_id: "desc" },
      select: {
        staff_id: true,
        staff_uuid: true,
        staff_first_name: true,
        staff_last_name: true,
        staff_father_name: true,
        staff_mobile_no: true,
        staff_phone_no: true,
        staff_email_id: true,
        staff_login_id: true,
        staff_status: true,
        staff_profile_img: true,
        staff_curr_address: true,
        staff_city: true,
        staff_pincode: true,
        staff_add_date: true,
        staff_created_at: true,
      },
    });
  }

  async getStaffByUuid(dbUrl, staffUuid) {
    const prisma = this.getPrisma(dbUrl);
    return prisma.staff.findFirst({
      where: { staff_uuid: staffUuid, staff_is_deleted: false },
    });
  }

  async getStaffByLoginId(dbUrl, staffLoginId) {
    const prisma = this.getPrisma(dbUrl);
    return prisma.staff.findFirst({
      where: {
        staff_login_id: staffLoginId,
        staff_is_deleted: false,
      },
    });
  }

  async updateStaff(dbUrl, staffUuid, updateData) {
    const prisma = this.getPrisma(dbUrl);
    const data = { ...updateData };
    if (data.staff_password) {
      data.staff_password = await hashPassword(data.staff_password);
    }
    return prisma.staff.update({
      where: { staff_uuid: staffUuid },
      data,
    });
  }

  async softDeleteStaff(dbUrl, staffUuid, deletedBy = null) {
    const prisma = this.getPrisma(dbUrl);
    return prisma.staff.update({
      where: { staff_uuid: staffUuid },
      data: {
        staff_is_deleted: true,
        staff_deleted_at: new Date(),
        staff_deleted_by: deletedBy,
        staff_status: "Inactive",
        staff_login_status: false,
        staff_jwt_token: null,
        staff_refresh_token: null,
      },
    });
  }

  async getPermissionCatalog(dbUrl) {
    const prisma = this.getPrisma(dbUrl);
    return prisma.permission.findMany({
      orderBy: [{ perm_sort_order: "asc" }, { perm_key: "asc" }],
    });
  }

  async getStaffPermissionKeys(dbUrl, staffId) {
    const prisma = this.getPrisma(dbUrl);
    const rows = await prisma.staffPermission.findMany({
      where: { sp_staff_id: staffId, sp_granted: true },
      include: { permission: { select: { perm_key: true } } },
    });
    return rows.map((r) => r.permission.perm_key);
  }

  async getStaffPermissionMatrix(dbUrl, staffId) {
    const keys = await this.getStaffPermissionKeys(dbUrl, staffId);
    const matrix = emptyPermissionMatrix();
    const granted = keysToPermissionMatrix(keys);
    for (const [module, actions] of Object.entries(granted)) {
      if (!matrix[module]) matrix[module] = {};
      for (const [action, val] of Object.entries(actions)) {
        matrix[module][action] = val;
      }
    }
    return { keys, matrix };
  }

  async setStaffPermissions(dbUrl, staffId, permissionKeys = []) {
    const prisma = this.getPrisma(dbUrl);
    const uniqueKeys = [...new Set(permissionKeys.filter(Boolean))];
    const permissions = await prisma.permission.findMany({
      where: { perm_key: { in: uniqueKeys } },
    });

    const foundKeys = new Set(permissions.map((p) => p.perm_key));
    const missing = uniqueKeys.filter((k) => !foundKeys.has(k));
    if (missing.length > 0) {
      const error = new Error(`Unknown permission keys: ${missing.join(", ")}`);
      error.statusCode = 400;
      throw error;
    }

    await prisma.$transaction(async (tx) => {
      await tx.staffPermission.deleteMany({ where: { sp_staff_id: staffId } });
      if (permissions.length > 0) {
        await tx.staffPermission.createMany({
          data: permissions.map((p) => ({
            sp_staff_id: staffId,
            sp_perm_id: p.perm_id,
            sp_granted: true,
          })),
        });
      }
    });

    return uniqueKeys;
  }

  async setStaffPermissionsFromMatrix(dbUrl, staffId, matrix) {
    const keys = permissionMatrixToKeys(matrix);
    return this.setStaffPermissions(dbUrl, staffId, keys);
  }
}

module.exports = new StaffService();
