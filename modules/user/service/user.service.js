"use strict";

const { getTenantPrisma } = require("../../../utils/tenantPrisma");
const serialNumberService = require("../../../common/service/serialNumber.service");
const financeTransactionService = require("../../finance/service/finance_transaction.service");
const financeMoneyTransService = require("../../finance/service/finance_money_trans.service");
const journalService = require("../../journal/service/journal.service");

const USER_HEADER_SELECT = {
  user_id: true,
  user_uuid: true,
  user_unique_code: true,
  user_first_name: true,
  user_last_name: true,
  user_father_name: true,
  user_mobile_no: true,
  user_phone_no: true,
  user_whatsapp_no: true,
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
  firm: {
    select: {
      firm_name: true,
      firm_phone_no: true,
      firm_city: true,
    },
  },
};

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
        { user_unique_code: { equals: search, mode: "insensitive" } },
        { user_unique_code: { contains: search, mode: "insensitive" } },
        { user_mobile_no: { contains: search, mode: "insensitive" } },
        { user_phone_no: { contains: search, mode: "insensitive" } },
        { user_whatsapp_no: { contains: search, mode: "insensitive" } },
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
        or.unshift({ user_whatsapp_no: { contains: digitsOnly } });
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
        select: USER_HEADER_SELECT,
      });
    
  }

  /**
   * Header search: customers + exact/partial loan & finance IDs.
   */
  async globalSearch(dbUrl, firmId, q = "", limit = 15) {
    const prisma = this.getPrisma(dbUrl);
    const search = String(q || "").trim();
    if (search.length < 1) {
      return { users: [], loans: [], finances: [] };
    }

    const firmFilter = {};
    if (firmId && firmId !== "all" && firmId !== "undefined") {
      firmFilter.user_firm_id = parseInt(firmId, 10);
    }

    const users = await this.searchUsers(dbUrl, firmId, q, Math.min(limit, 12));

    const loanFirmFilter = {};
    const financeFirmFilter = {};
    if (firmId && firmId !== "all" && firmId !== "undefined") {
      const firmIdInt = parseInt(firmId, 10);
      loanFirmFilter.girv_firm_id = firmIdInt;
      financeFirmFilter.fin_firm_id = firmIdInt;
    }

    const loanOr = [
      { girv_unique_code: { equals: search, mode: "insensitive" } },
      { girv_loan_no: { equals: search, mode: "insensitive" } },
    ];
    const financeOr = [{ fin_unique_code: { equals: search, mode: "insensitive" } }];

    if (/^\d+$/.test(search)) {
      const numericId = parseInt(search, 10);
      if (!Number.isNaN(numericId) && numericId <= 2147483647) {
        loanOr.unshift({ girv_id: numericId });
        financeOr.unshift({ fin_id: numericId });
      }
    }

    if (search.length >= 2) {
      loanOr.push(
        { girv_unique_code: { contains: search, mode: "insensitive" } },
        { girv_loan_no: { contains: search, mode: "insensitive" } }
      );
      financeOr.push({ fin_unique_code: { contains: search, mode: "insensitive" } });
    }

    const [loans, finances] = await Promise.all([
      prisma.girvi.findMany({
        where: {
          girv_is_deleted: false,
          ...loanFirmFilter,
          OR: loanOr,
        },
        take: 8,
        orderBy: [{ girv_id: "desc" }],
        select: {
          girv_id: true,
          girv_uuid: true,
          girv_unique_code: true,
          girv_loan_no: true,
          girv_status: true,
          girv_prin_amt: true,
          girv_start_date: true,
          girv_firm_id: true,
          user: { select: USER_HEADER_SELECT },
          firm: { select: { firm_name: true } },
        },
      }),
      prisma.finance.findMany({
        where: {
          fin_is_deleted: false,
          ...financeFirmFilter,
          OR: financeOr,
        },
        take: 8,
        orderBy: [{ fin_id: "desc" }],
        select: {
          fin_id: true,
          fin_uuid: true,
          fin_unique_code: true,
          fin_status: true,
          fin_prin_amt: true,
          fin_start_date: true,
          fin_firm_id: true,
          user: { select: USER_HEADER_SELECT },
          firm: { select: { firm_name: true } },
        },
      }),
    ]);

    return { users, loans, finances };
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
          { user_whatsapp_no: { contains: cleanSearch, mode: "insensitive" } },
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
          or.unshift({ user_whatsapp_no: { contains: digitsOnly } });
        }

        where.OR = or;
      }

      return await prisma.user.findMany({
        where,
        orderBy: {
          user_created_at: "desc",
        },
        include: {
          firm: {
            select: {
              firm_name: true,
              firm_phone_no: true,
              firm_city: true,
            },
          },
        },
      });
    
  }

  async deleteJournalSafe(dbUrl, journal) {
    if (!journal?.jrnl_id) return;
    try {
      await journalService.delete_journal_entry(
        dbUrl,
        journal.jrnl_id,
        journal.jrnl_own_id,
        journal.jrnl_firm_id
      );
    } catch (err) {
      // Journal may already be removed by a child delete helper.
    }
  }

  /**
   * Delete all finance records and related EMIs, payments, and journals for a customer.
   */
  async deleteUserFinances(dbUrl, userId, deletedBy) {
    const prisma = this.getPrisma(dbUrl);
    const deletedAt = new Date();

    const finances = await prisma.finance.findMany({
      where: { fin_user_id: userId, fin_is_deleted: false },
    });

    for (const finance of finances) {
      await financeMoneyTransService.delete_finance_money_entries(dbUrl, finance.fin_id);
      await financeTransactionService.delete_finance_transaction(dbUrl, finance.fin_id);

      if (finance.fin_jrnl_id) {
        await this.deleteJournalSafe(dbUrl, {
          jrnl_id: finance.fin_jrnl_id,
          jrnl_own_id: finance.fin_own_id,
          jrnl_firm_id: finance.fin_firm_id,
        });
      }

      await prisma.finance.update({
        where: { fin_id: finance.fin_id },
        data: {
          fin_is_deleted: true,
          fin_deleted_at: deletedAt,
          fin_deleted_by: deletedBy,
        },
      });
    }

    return finances.length;
  }

  /**
   * Delete all loan-related child records for a customer (deposits, releases, principal, auction, stock).
   */
  async deleteUserLoanChildren(dbUrl, userId, deletedBy) {
    const prisma = this.getPrisma(dbUrl);
    const deletedAt = new Date();

    const girvis = await prisma.girvi.findMany({
      where: { girv_user_id: userId, girv_is_deleted: false },
      select: { girv_id: true },
    });
    const girvIds = girvis.map((g) => g.girv_id);

    if (girvIds.length > 0) {
      await prisma.girviDeposit.updateMany({
        where: { dep_girv_id: { in: girvIds }, dep_is_deleted: false },
        data: {
          dep_is_deleted: true,
          dep_deleted_at: deletedAt,
          dep_deleted_by: deletedBy,
        },
      });

      await prisma.girviRelease.updateMany({
        where: { rel_girv_id: { in: girvIds }, rel_is_deleted: false },
        data: {
          rel_is_deleted: true,
          rel_deleted_at: deletedAt,
          rel_deleted_by: deletedBy,
        },
      });

      await prisma.additionalPrincipal.updateMany({
        where: { ap_girv_id: { in: girvIds }, ap_is_deleted: false },
        data: {
          ap_is_deleted: true,
          ap_deleted_at: deletedAt,
          ap_deleted_by: deletedBy,
        },
      });

      await prisma.auctionLoan.deleteMany({
        where: { al_girv_id: { in: girvIds } },
      });

      await prisma.stock.updateMany({
        where: {
          st_referance_panel: "girvi",
          st_referance_id: { in: girvIds },
          st_is_deleted: false,
        },
        data: {
          st_is_deleted: true,
          st_deleted_at: deletedAt,
        },
      });
    }

    await prisma.girviDeposit.updateMany({
      where: { dep_user_id: userId, dep_is_deleted: false },
      data: {
        dep_is_deleted: true,
        dep_deleted_at: deletedAt,
        dep_deleted_by: deletedBy,
      },
    });

    await prisma.girviRelease.updateMany({
      where: { rel_user_id: userId, rel_is_deleted: false },
      data: {
        rel_is_deleted: true,
        rel_deleted_at: deletedAt,
        rel_deleted_by: deletedBy,
      },
    });

    await prisma.additionalPrincipal.updateMany({
      where: { ap_user_id: userId, ap_is_deleted: false },
      data: {
        ap_is_deleted: true,
        ap_deleted_at: deletedAt,
        ap_deleted_by: deletedBy,
      },
    });

    await prisma.stock.updateMany({
      where: { st_user_id: userId, st_is_deleted: false },
      data: {
        st_is_deleted: true,
        st_deleted_at: deletedAt,
      },
    });

    return girvIds.length;
  }

  /**
   * Delete all journals linked to a customer (loans, finance, deposits, collections, auction, etc.).
   */
  async deleteUserJournals(dbUrl, userId) {
    const prisma = this.getPrisma(dbUrl);

    const journals = await prisma.journal.findMany({
      where: { jrnl_user_id: userId, jrnl_is_deleted: false },
      select: {
        jrnl_id: true,
        jrnl_own_id: true,
        jrnl_firm_id: true,
      },
    });

    for (const journal of journals) {
      await this.deleteJournalSafe(dbUrl, journal);
    }

    return journals.length;
  }

  /**
   * Soft delete all loans for a customer.
   */
  async deleteUserLoans(dbUrl, userId, deletedBy) {
    const prisma = this.getPrisma(dbUrl);
    const deletedAt = new Date();

    const result = await prisma.girvi.updateMany({
      where: { girv_user_id: userId, girv_is_deleted: false },
      data: {
        girv_is_deleted: true,
        girv_deleted_at: deletedAt,
        girv_deleted_by: deletedBy,
      },
    });

    return result.count;
  }

  /**
   * Soft delete a user and cascade-delete all related transactions.
   * @param {string} dbUrl
   * @param {string} user_uuid
   * @param {string} deletedBy
   */
  async deleteUserByUuid(dbUrl, user_uuid, deletedBy) {
    const prisma = this.getPrisma(dbUrl);

    const user = await prisma.user.findUnique({
      where: { user_uuid },
      select: { user_id: true, user_is_deleted: true },
    });

    if (!user) {
      throw new Error("User not found.");
    }
    if (user.user_is_deleted) {
      throw new Error("User is already deleted.");
    }

    const userId = user.user_id;
    const deletedFinances = await this.deleteUserFinances(dbUrl, userId, deletedBy);
    await this.deleteUserLoanChildren(dbUrl, userId, deletedBy);
    const deletedJournals = await this.deleteUserJournals(dbUrl, userId);
    const deletedLoans = await this.deleteUserLoans(dbUrl, userId, deletedBy);

    const deletedUser = await prisma.user.update({
      where: { user_uuid },
      data: {
        user_is_deleted: true,
        user_deleted_at: new Date(),
        user_deleted_by: deletedBy,
      },
    });

    return {
      user: deletedUser,
      summary: {
        finances: deletedFinances,
        loans: deletedLoans,
        journals: deletedJournals,
      },
    };
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
