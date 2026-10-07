"use strict";

const { getTenantPrisma } = require("../../../utils/tenantPrisma");
const serialNumberService = require("../../../common/service/serialNumber.service");
const journalService = require("../../journal/service/journal.service");
const {
  GLOBAL_LOAN_TAKE,
  GLOBAL_FINANCE_TAKE,
  buildUserSearchWhere,
  parseFirmIdInt,
  buildGlobalLoanOrConditions,
  buildGlobalFinanceOrConditions,
  clampUserTake,
} = require("./userSearch.helpers");

const USER_HEADER_SELECT = {
  user_id: true,
  user_uuid: true,
  user_unique_code: true,
  user_first_name: true,
  user_last_name: true,
  user_father_name: true,
  user_spouse_name: true,
  user_village: true,
  user_adhaar_no: true,
  user_is_deleted: true,
  user_created_by: true,
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

      const take = clampUserTake(limit);

      return await prisma.user.findMany({
        where: buildUserSearchWhere(firmId, search),
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

    const firmIdInt = parseFirmIdInt(firmId);
    const loanFirmFilter = firmIdInt != null ? { girv_firm_id: firmIdInt } : {};
    const financeFirmFilter = firmIdInt != null ? { fin_firm_id: firmIdInt } : {};
    const userTake = clampUserTake(limit);

    const [users, loans, finances] = await Promise.all([
      prisma.user.findMany({
        where: buildUserSearchWhere(firmId, search),
        take: userTake,
        orderBy: [{ user_id: "desc" }],
        select: USER_HEADER_SELECT,
      }),
      prisma.girvi.findMany({
        where: {
          girv_is_deleted: false,
          ...loanFirmFilter,
          OR: buildGlobalLoanOrConditions(search),
        },
        take: GLOBAL_LOAN_TAKE,
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
          OR: buildGlobalFinanceOrConditions(search),
        },
        take: GLOBAL_FINANCE_TAKE,
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
  _deletedAtWindow(userDeletedAt) {
    if (!userDeletedAt) return null;
    const t = new Date(userDeletedAt).getTime();
    return {
      gte: new Date(t - 2 * 60 * 1000),
      lte: new Date(t + 15 * 60 * 1000),
    };
  }

  _buildUserSearchWhere(search = "") {
    const cleanSearch = String(search).trim();
    if (!cleanSearch) return null;

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

    return { OR: or };
  }

  async getUsers(dbUrl, firmId, search = "") {
    const prisma = this.getPrisma(dbUrl);

      const where = {
        user_is_deleted: false,
      };

      if (firmId) {
        where.user_firm_id = parseInt(firmId);
      }

      const searchWhere = this._buildUserSearchWhere(search);
      if (searchWhere) {
        Object.assign(where, searchWhere);
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

  /**
   * List soft-deleted customers (for restore screen).
   */
  async getDeletedUsers(dbUrl, firmId, search = "") {
    const prisma = this.getPrisma(dbUrl);

    const where = { user_is_deleted: true };

    if (firmId) {
      where.user_firm_id = parseInt(firmId, 10);
    }

    const searchWhere = this._buildUserSearchWhere(search);
    if (searchWhere) {
      Object.assign(where, searchWhere);
    }

    return await prisma.user.findMany({
      where,
      orderBy: { user_deleted_at: "desc" },
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

  _clearSoftDeleteFields(prefix) {
    const map = {
      girv: { girv_is_deleted: false, girv_deleted_at: null, girv_deleted_by: null },
      fin: { fin_is_deleted: false, fin_deleted_at: null, fin_deleted_by: null },
      dep: { dep_is_deleted: false, dep_deleted_at: null, dep_deleted_by: null },
      rel: { rel_is_deleted: false, rel_deleted_at: null, rel_deleted_by: null },
      ap: { ap_is_deleted: false, ap_deleted_at: null, ap_deleted_by: null },
      stock: { st_is_deleted: false, st_deleted_at: null },
      ft: { ft_is_deleted: false, ft_deleted_at: null, ft_deleted_by: null },
      fm: { fm_is_deleted: false, fm_deleted_at: null, fm_deleted_by: null },
      jrnl: { jrnl_is_deleted: false, jrnl_deleted_at: null, jrnl_deleted_by: null },
      jrtr: { jrtr_is_deleted: false, jrtr_deleted_at: null, jrtr_deleted_by: null },
      al: { al_is_deleted: false, al_deleted_at: null, al_deleted_by: null },
    };
    return map[prefix];
  }

  /**
   * Restore customer and all related records soft-deleted in the same customer-delete batch.
   */
  async restoreUserByUuid(dbUrl, user_uuid) {
    const prisma = this.getPrisma(dbUrl);

    const user = await prisma.user.findUnique({
      where: { user_uuid },
      select: {
        user_id: true,
        user_is_deleted: true,
        user_deleted_at: true,
      },
    });

    if (!user) {
      throw new Error("User not found.");
    }
    if (!user.user_is_deleted) {
      throw new Error("User is not deleted.");
    }

    const deletedWindow = this._deletedAtWindow(user.user_deleted_at);
    const withDeletedWindow = (field) =>
      deletedWindow ? { [field]: deletedWindow } : {};

    const summary = await prisma.$transaction(async (tx) => {
      const journalLines = await tx.journalTransaction.updateMany({
        where: {
          jrtr_user_id: user.user_id,
          jrtr_is_deleted: true,
          ...withDeletedWindow("jrtr_deleted_at"),
        },
        data: this._clearSoftDeleteFields("jrtr"),
      });

      const journals = await tx.journal.updateMany({
        where: {
          jrnl_user_id: user.user_id,
          jrnl_is_deleted: true,
          ...withDeletedWindow("jrnl_deleted_at"),
        },
        data: this._clearSoftDeleteFields("jrnl"),
      });

      const financeEmis = await tx.finance_Transaction.updateMany({
        where: {
          ft_user_id: user.user_id,
          ft_is_deleted: true,
          ...withDeletedWindow("ft_deleted_at"),
        },
        data: this._clearSoftDeleteFields("ft"),
      });

      const financePayments = await tx.finance_Money_Transaction.updateMany({
        where: {
          fm_user_id: user.user_id,
          fm_is_deleted: true,
          ...withDeletedWindow("fm_deleted_at"),
        },
        data: this._clearSoftDeleteFields("fm"),
      });

      const loans = await tx.girvi.updateMany({
        where: {
          girv_user_id: user.user_id,
          girv_is_deleted: true,
          ...withDeletedWindow("girv_deleted_at"),
        },
        data: this._clearSoftDeleteFields("girv"),
      });

      const finances = await tx.finance.updateMany({
        where: {
          fin_user_id: user.user_id,
          fin_is_deleted: true,
          ...withDeletedWindow("fin_deleted_at"),
        },
        data: this._clearSoftDeleteFields("fin"),
      });

      const girvis = await tx.girvi.findMany({
        where: { girv_user_id: user.user_id },
        select: { girv_id: true },
      });
      const girvIds = girvis.map((g) => g.girv_id);

      let deposits = { count: 0 };
      let releases = { count: 0 };
      let principals = { count: 0 };
      let stockByLoan = { count: 0 };

      if (girvIds.length > 0) {
        deposits = await tx.girviDeposit.updateMany({
          where: {
            dep_girv_id: { in: girvIds },
            dep_is_deleted: true,
            ...withDeletedWindow("dep_deleted_at"),
          },
          data: this._clearSoftDeleteFields("dep"),
        });

        releases = await tx.girviRelease.updateMany({
          where: {
            rel_girv_id: { in: girvIds },
            rel_is_deleted: true,
            ...withDeletedWindow("rel_deleted_at"),
          },
          data: this._clearSoftDeleteFields("rel"),
        });

        principals = await tx.additionalPrincipal.updateMany({
          where: {
            ap_girv_id: { in: girvIds },
            ap_is_deleted: true,
            ...withDeletedWindow("ap_deleted_at"),
          },
          data: this._clearSoftDeleteFields("ap"),
        });

        stockByLoan = await tx.stock.updateMany({
          where: {
            st_referance_panel: "girvi",
            st_referance_id: { in: girvIds },
            st_is_deleted: true,
            ...withDeletedWindow("st_deleted_at"),
          },
          data: this._clearSoftDeleteFields("stock"),
        });

        await tx.auctionLoan.updateMany({
          where: {
            al_girv_id: { in: girvIds },
            al_is_deleted: true,
            ...withDeletedWindow("al_deleted_at"),
          },
          data: this._clearSoftDeleteFields("al"),
        });
      }

      const stockByUser = await tx.stock.updateMany({
        where: {
          st_user_id: user.user_id,
          st_is_deleted: true,
          ...withDeletedWindow("st_deleted_at"),
        },
        data: this._clearSoftDeleteFields("stock"),
      });

      await tx.girviDeposit.updateMany({
        where: {
          dep_user_id: user.user_id,
          dep_is_deleted: true,
          ...withDeletedWindow("dep_deleted_at"),
        },
        data: this._clearSoftDeleteFields("dep"),
      });

      await tx.girviRelease.updateMany({
        where: {
          rel_user_id: user.user_id,
          rel_is_deleted: true,
          ...withDeletedWindow("rel_deleted_at"),
        },
        data: this._clearSoftDeleteFields("rel"),
      });

      await tx.additionalPrincipal.updateMany({
        where: {
          ap_user_id: user.user_id,
          ap_is_deleted: true,
          ...withDeletedWindow("ap_deleted_at"),
        },
        data: this._clearSoftDeleteFields("ap"),
      });

      const restoredUser = await tx.user.update({
        where: { user_uuid },
        data: {
          user_is_deleted: false,
          user_deleted_at: null,
          user_deleted_by: null,
        },
        include: {
          firm: {
            select: { firm_name: true, firm_id: true },
          },
        },
      });

      return {
        user: restoredUser,
        summary: {
          loans: loans.count,
          finances: finances.count,
          financeEmis: financeEmis.count,
          financePayments: financePayments.count,
          journals: journals.count,
          journalLines: journalLines.count,
          deposits: deposits.count,
          releases: releases.count,
          principals: principals.count,
          stock: stockByLoan.count + stockByUser.count,
        },
      };
    });

    return summary;
  }

  async softDeleteJournalSafe(dbUrl, journal, deletedBy) {
    if (!journal?.jrnl_id) return;
    try {
      await journalService.soft_delete_journal_entry(
        dbUrl,
        journal.jrnl_id,
        journal.jrnl_own_id,
        journal.jrnl_firm_id,
        deletedBy
      );
    } catch (err) {
      // Journal may already be soft-deleted by another helper.
    }
  }

  /**
   * Soft-delete all finance records, EMIs, collections, and linked journals for a customer.
   */
  async deleteUserFinances(dbUrl, userId, deletedBy, deletedAt = new Date()) {
    const prisma = this.getPrisma(dbUrl);

    const finances = await prisma.finance.findMany({
      where: { fin_user_id: userId, fin_is_deleted: false },
    });

    for (const finance of finances) {
      const moneyEntries = await prisma.finance_Money_Transaction.findMany({
        where: { fm_fin_id: finance.fin_id, fm_is_deleted: false },
        select: { fm_jrnl_id: true, fm_own_id: true, fm_firm_id: true },
      });

      await prisma.finance_Transaction.updateMany({
        where: { ft_fin_id: finance.fin_id, ft_is_deleted: false },
        data: {
          ft_is_deleted: true,
          ft_deleted_at: deletedAt,
          ft_deleted_by: deletedBy,
        },
      });

      await prisma.finance_Money_Transaction.updateMany({
        where: { fm_fin_id: finance.fin_id, fm_is_deleted: false },
        data: {
          fm_is_deleted: true,
          fm_deleted_at: deletedAt,
          fm_deleted_by: deletedBy,
        },
      });

      for (const entry of moneyEntries) {
        if (entry.fm_jrnl_id) {
          await this.softDeleteJournalSafe(
            dbUrl,
            {
              jrnl_id: entry.fm_jrnl_id,
              jrnl_own_id: entry.fm_own_id,
              jrnl_firm_id: entry.fm_firm_id,
            },
            deletedBy
          );
        }
      }

      if (finance.fin_jrnl_id) {
        await this.softDeleteJournalSafe(
          dbUrl,
          {
            jrnl_id: finance.fin_jrnl_id,
            jrnl_own_id: finance.fin_own_id,
            jrnl_firm_id: finance.fin_firm_id,
          },
          deletedBy
        );
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
  async deleteUserLoanChildren(dbUrl, userId, deletedBy, deletedAt = new Date()) {
    const prisma = this.getPrisma(dbUrl);

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

      await prisma.auctionLoan.updateMany({
        where: { al_girv_id: { in: girvIds }, al_is_deleted: false },
        data: {
          al_is_deleted: true,
          al_deleted_at: deletedAt,
          al_deleted_by: deletedBy,
        },
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
  async deleteUserJournals(dbUrl, userId, deletedBy) {
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
      await this.softDeleteJournalSafe(dbUrl, journal, deletedBy);
    }

    return journals.length;
  }

  /**
   * Soft delete all loans for a customer.
   */
  async deleteUserLoans(dbUrl, userId, deletedBy, deletedAt = new Date()) {
    const prisma = this.getPrisma(dbUrl);

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
    const deletedAt = new Date();
    const deletedFinances = await this.deleteUserFinances(dbUrl, userId, deletedBy, deletedAt);
    await this.deleteUserLoanChildren(dbUrl, userId, deletedBy, deletedAt);
    const deletedJournals = await this.deleteUserJournals(dbUrl, userId, deletedBy);
    const deletedLoans = await this.deleteUserLoans(dbUrl, userId, deletedBy, deletedAt);

    const deletedUser = await prisma.user.update({
      where: { user_uuid },
      data: {
        user_is_deleted: true,
        user_deleted_at: deletedAt,
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
