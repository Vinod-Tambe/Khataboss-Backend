
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.OwnerScalarFieldEnum = {
  own_id: 'own_id',
  own_uuid: 'own_uuid',
  own_product_key: 'own_product_key',
  own_db: 'own_db',
  own_add_date: 'own_add_date',
  own_first_name: 'own_first_name',
  own_middle_name: 'own_middle_name',
  own_last_name: 'own_last_name',
  own_phone_no: 'own_phone_no',
  own_mobile_no: 'own_mobile_no',
  own_email: 'own_email',
  own_login_id: 'own_login_id',
  own_password: 'own_password',
  own_status: 'own_status',
  own_profile_img: 'own_profile_img',
  own_refresh_token: 'own_refresh_token',
  own_refresh_expiry: 'own_refresh_expiry',
  own_jwt_token: 'own_jwt_token',
  own_jwt_expiry: 'own_jwt_expiry',
  own_login_status: 'own_login_status',
  own_last_login_system: 'own_last_login_system',
  own_otp: 'own_otp',
  own_otp_expiry: 'own_otp_expiry',
  own_address: 'own_address',
  own_village: 'own_village',
  own_city: 'own_city',
  own_state: 'own_state',
  own_pincode: 'own_pincode',
  own_created_at: 'own_created_at',
  own_created_by: 'own_created_by',
  own_updated_at: 'own_updated_at',
  own_updated_by: 'own_updated_by',
  own_deleted_at: 'own_deleted_at',
  own_deleted_by: 'own_deleted_by',
  own_is_deleted: 'own_is_deleted'
};

exports.Prisma.FirmScalarFieldEnum = {
  firm_id: 'firm_id',
  firm_uuid: 'firm_uuid',
  firm_add_date: 'firm_add_date',
  firm_own_id: 'firm_own_id',
  firm_name: 'firm_name',
  firm_reg_no: 'firm_reg_no',
  firm_shop_name: 'firm_shop_name',
  firm_desc: 'firm_desc',
  firm_address: 'firm_address',
  firm_city: 'firm_city',
  firm_pincode: 'firm_pincode',
  firm_phone_no: 'firm_phone_no',
  firm_email_id: 'firm_email_id',
  firm_website_link: 'firm_website_link',
  firm_type: 'firm_type',
  firm_owner: 'firm_owner',
  firm_other_info: 'firm_other_info',
  firm_geo_latitude: 'firm_geo_latitude',
  firm_geo_longitude: 'firm_geo_longitude',
  firm_whatsapp_link: 'firm_whatsapp_link',
  firm_facebook_link: 'firm_facebook_link',
  firm_insta_link: 'firm_insta_link',
  firm_bank_name: 'firm_bank_name',
  firm_bank_acc_no: 'firm_bank_acc_no',
  firm_bank_branch: 'firm_bank_branch',
  firm_bank_address: 'firm_bank_address',
  firm_acc_holder: 'firm_acc_holder',
  firm_acc_type: 'firm_acc_type',
  firm_ifsc_code: 'firm_ifsc_code',
  firm_start_date: 'firm_start_date',
  firm_balance: 'firm_balance',
  firm_balance_type: 'firm_balance_type',
  firm_gstin_no: 'firm_gstin_no',
  firm_pan_no: 'firm_pan_no',
  firm_adhaar_no: 'firm_adhaar_no',
  firm_form_header: 'firm_form_header',
  firm_form_footer: 'firm_form_footer',
  firm_own_sign_img: 'firm_own_sign_img',
  firm_left_logo_img: 'firm_left_logo_img',
  firm_right_logo_img: 'firm_right_logo_img',
  firm_qr_code_img: 'firm_qr_code_img',
  firm_pan_no_img: 'firm_pan_no_img',
  firm_created_at: 'firm_created_at',
  firm_created_by: 'firm_created_by',
  firm_updated_at: 'firm_updated_at',
  firm_updated_by: 'firm_updated_by',
  firm_deleted_at: 'firm_deleted_at',
  firm_deleted_by: 'firm_deleted_by',
  firm_is_deleted: 'firm_is_deleted'
};

exports.Prisma.AccountScalarFieldEnum = {
  acc_id: 'acc_id',
  acc_uuid: 'acc_uuid',
  acc_add_date: 'acc_add_date',
  acc_own_id: 'acc_own_id',
  acc_firm_id: 'acc_firm_id',
  acc_pan_no: 'acc_pan_no',
  acc_name: 'acc_name',
  acc_desc: 'acc_desc',
  acc_pre_acc: 'acc_pre_acc',
  acc_bank_no: 'acc_bank_no',
  acc_bsr_no: 'acc_bsr_no',
  acc_ifsc_code: 'acc_ifsc_code',
  acc_branch_name: 'acc_branch_name',
  acc_opening_date: 'acc_opening_date',
  acc_address: 'acc_address',
  acc_country: 'acc_country',
  acc_state: 'acc_state',
  acc_city: 'acc_city',
  acc_pincode: 'acc_pincode',
  acc_cash_balance: 'acc_cash_balance',
  acc_balance_type: 'acc_balance_type',
  acc_other_info: 'acc_other_info',
  acc_created_at: 'acc_created_at',
  acc_created_by: 'acc_created_by',
  acc_updated_by: 'acc_updated_by',
  acc_deleted_at: 'acc_deleted_at',
  acc_deleted_by: 'acc_deleted_by',
  acc_is_deleted: 'acc_is_deleted'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.OwnerStatus = exports.$Enums.OwnerStatus = {
  Active: 'Active',
  Inactive: 'Inactive'
};

exports.FirmType = exports.$Enums.FirmType = {
  Sole_Proprietorship: 'Sole_Proprietorship',
  Partnership: 'Partnership',
  LLP: 'LLP',
  Private_Ltd: 'Private_Ltd',
  Other: 'Other'
};

exports.FirmBalanceType = exports.$Enums.FirmBalanceType = {
  DR: 'DR',
  CR: 'CR'
};

exports.AccountBalanceType = exports.$Enums.AccountBalanceType = {
  CR: 'CR',
  DR: 'DR'
};

exports.Prisma.ModelName = {
  Owner: 'Owner',
  Firm: 'Firm',
  Account: 'Account'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
