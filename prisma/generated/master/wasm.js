
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

exports.Prisma.AdminScalarFieldEnum = {
  admin_id: 'admin_id',
  admin_uuid: 'admin_uuid',
  admin_add_date: 'admin_add_date',
  admin_first_name: 'admin_first_name',
  admin_middle_name: 'admin_middle_name',
  admin_last_name: 'admin_last_name',
  admin_phone_no: 'admin_phone_no',
  admin_mobile_no: 'admin_mobile_no',
  admin_email: 'admin_email',
  admin_login_id: 'admin_login_id',
  admin_password: 'admin_password',
  admin_refresh_token: 'admin_refresh_token',
  admin_refresh_expiry: 'admin_refresh_expiry',
  admin_jwt_token: 'admin_jwt_token',
  admin_jwt_expiry: 'admin_jwt_expiry',
  admin_login_status: 'admin_login_status',
  admin_last_login_system: 'admin_last_login_system',
  admin_otp: 'admin_otp',
  admin_otp_expiry: 'admin_otp_expiry',
  admin_address: 'admin_address',
  admin_village: 'admin_village',
  admin_city: 'admin_city',
  admin_state: 'admin_state',
  admin_pincode: 'admin_pincode',
  admin_created_at: 'admin_created_at',
  admin_created_by: 'admin_created_by',
  admin_updated_at: 'admin_updated_at',
  admin_updated_by: 'admin_updated_by',
  admin_deleted_at: 'admin_deleted_at',
  admin_deleted_by: 'admin_deleted_by',
  admin_is_deleted: 'admin_is_deleted'
};

exports.Prisma.DbSeriesScalarFieldEnum = {
  id: 'id',
  series_name: 'series_name',
  last_number: 'last_number',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

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

exports.Prisma.ModelName = {
  Admin: 'Admin',
  DbSeries: 'DbSeries',
  Owner: 'Owner'
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
