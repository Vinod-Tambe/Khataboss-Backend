
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
  own_mail_user: 'own_mail_user',
  own_mail_pass_enc: 'own_mail_pass_enc',
  own_mail_from_name: 'own_mail_from_name',
  own_mail_provider: 'own_mail_provider',
  own_mail_status: 'own_mail_status',
  own_mail_updated_at: 'own_mail_updated_at',
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
  firm_unique_code: 'firm_unique_code',
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
  acc_is_system: 'acc_is_system',
  acc_is_deleted: 'acc_is_deleted'
};

exports.Prisma.UserScalarFieldEnum = {
  user_id: 'user_id',
  user_uuid: 'user_uuid',
  user_unique_code: 'user_unique_code',
  user_own_id: 'user_own_id',
  user_firm_id: 'user_firm_id',
  user_add_date: 'user_add_date',
  user_first_name: 'user_first_name',
  user_father_name: 'user_father_name',
  user_last_name: 'user_last_name',
  user_mother_name: 'user_mother_name',
  user_mobile_no: 'user_mobile_no',
  user_phone_no: 'user_phone_no',
  user_email_id: 'user_email_id',
  user_gender: 'user_gender',
  user_cast: 'user_cast',
  user_marital_status: 'user_marital_status',
  user_occupation: 'user_occupation',
  user_birth_date: 'user_birth_date',
  user_gstin: 'user_gstin',
  user_tax_no: 'user_tax_no',
  user_pan_no: 'user_pan_no',
  user_adhaar_no: 'user_adhaar_no',
  user_profile_img: 'user_profile_img',
  user_per_address: 'user_per_address',
  user_curr_address: 'user_curr_address',
  user_village: 'user_village',
  user_ward_no: 'user_ward_no',
  user_tehsil: 'user_tehsil',
  user_city: 'user_city',
  user_state: 'user_state',
  user_country: 'user_country',
  user_pincode: 'user_pincode',
  user_bank_name: 'user_bank_name',
  user_bank_acc_no: 'user_bank_acc_no',
  user_ifsc_code: 'user_ifsc_code',
  user_other_images: 'user_other_images',
  user_other_info: 'user_other_info',
  user_created_at: 'user_created_at',
  user_created_by: 'user_created_by',
  user_updated_at: 'user_updated_at',
  user_updated_by: 'user_updated_by',
  user_deleted_at: 'user_deleted_at',
  user_deleted_by: 'user_deleted_by',
  user_is_deleted: 'user_is_deleted'
};

exports.Prisma.FinanceScalarFieldEnum = {
  fin_id: 'fin_id',
  fin_uuid: 'fin_uuid',
  fin_unique_code: 'fin_unique_code',
  fin_add_date: 'fin_add_date',
  fin_own_id: 'fin_own_id',
  fin_firm_id: 'fin_firm_id',
  fin_user_id: 'fin_user_id',
  fin_jrnl_id: 'fin_jrnl_id',
  fin_staff_id: 'fin_staff_id',
  fin_prin_amt: 'fin_prin_amt',
  fin_no_of_emi: 'fin_no_of_emi',
  fin_start_date: 'fin_start_date',
  fin_time_period: 'fin_time_period',
  fin_sms_period: 'fin_sms_period',
  fin_freq_type: 'fin_freq_type',
  fin_freq: 'fin_freq',
  fin_roi: 'fin_roi',
  fin_status: 'fin_status',
  fin_collec_amt: 'fin_collec_amt',
  fin_proccess_amt: 'fin_proccess_amt',
  fin_fine_amt: 'fin_fine_amt',
  fin_fine_emi_no: 'fin_fine_emi_no',
  fin_emi_amt: 'fin_emi_amt',
  fin_final_amt: 'fin_final_amt',
  fin_cash_amt: 'fin_cash_amt',
  fin_bank_amt: 'fin_bank_amt',
  fin_online_amt: 'fin_online_amt',
  fin_card_amt: 'fin_card_amt',
  fin_cash_acc_id: 'fin_cash_acc_id',
  fin_bank_acc_id: 'fin_bank_acc_id',
  fin_online_acc_id: 'fin_online_acc_id',
  fin_card_acc_id: 'fin_card_acc_id',
  fin_cash_info: 'fin_cash_info',
  fin_bank_info: 'fin_bank_info',
  fin_online_info: 'fin_online_info',
  fin_card_info: 'fin_card_info',
  fin_dr_acc_id: 'fin_dr_acc_id',
  fin_pay_info: 'fin_pay_info',
  fin_other_info: 'fin_other_info',
  fin_created_at: 'fin_created_at',
  fin_created_by: 'fin_created_by',
  fin_updated_at: 'fin_updated_at',
  fin_updated_by: 'fin_updated_by',
  fin_deleted_at: 'fin_deleted_at',
  fin_deleted_by: 'fin_deleted_by',
  fin_is_deleted: 'fin_is_deleted'
};

exports.Prisma.Finance_TransactionScalarFieldEnum = {
  ft_id: 'ft_id',
  ft_uuid: 'ft_uuid',
  ft_firm_id: 'ft_firm_id',
  ft_own_id: 'ft_own_id',
  ft_user_id: 'ft_user_id',
  ft_fin_id: 'ft_fin_id',
  ft_cash_acc_id: 'ft_cash_acc_id',
  ft_bank_acc_id: 'ft_bank_acc_id',
  ft_online_acc_id: 'ft_online_acc_id',
  ft_card_acc_id: 'ft_card_acc_id',
  ft_emi_no: 'ft_emi_no',
  ft_add_date: 'ft_add_date',
  ft_start_date: 'ft_start_date',
  ft_due_date: 'ft_due_date',
  ft_paid_date: 'ft_paid_date',
  ft_emi_amt: 'ft_emi_amt',
  ft_fine_amt: 'ft_fine_amt',
  ft_paid_amt: 'ft_paid_amt',
  ft_pending_amt: 'ft_pending_amt',
  ft_emi_status: 'ft_emi_status',
  ft_created_at: 'ft_created_at',
  ft_created_by: 'ft_created_by',
  ft_updated_at: 'ft_updated_at',
  ft_updated_by: 'ft_updated_by',
  ft_deleted_at: 'ft_deleted_at',
  ft_deleted_by: 'ft_deleted_by',
  ft_is_deleted: 'ft_is_deleted'
};

exports.Prisma.Finance_Money_TransactionScalarFieldEnum = {
  fm_id: 'fm_id',
  fm_uuid: 'fm_uuid',
  fm_firm_id: 'fm_firm_id',
  fm_own_id: 'fm_own_id',
  fm_user_id: 'fm_user_id',
  fm_fin_id: 'fm_fin_id',
  fm_jrnl_id: 'fm_jrnl_id',
  fm_cash_acc_id: 'fm_cash_acc_id',
  fm_bank_acc_id: 'fm_bank_acc_id',
  fm_online_acc_id: 'fm_online_acc_id',
  fm_card_acc_id: 'fm_card_acc_id',
  fm_dr_acc_id: 'fm_dr_acc_id',
  fm_add_date: 'fm_add_date',
  fm_trans_crdr: 'fm_trans_crdr',
  fm_trans_date: 'fm_trans_date',
  fm_trans_panel: 'fm_trans_panel',
  fm_trans_type: 'fm_trans_type',
  fm_trans_amt: 'fm_trans_amt',
  fm_cash_amt: 'fm_cash_amt',
  fm_bank_amt: 'fm_bank_amt',
  fm_online_amt: 'fm_online_amt',
  fm_card_amt: 'fm_card_amt',
  fm_cash_info: 'fm_cash_info',
  fm_bank_info: 'fm_bank_info',
  fm_online_info: 'fm_online_info',
  fm_card_info: 'fm_card_info',
  fm_pay_info: 'fm_pay_info',
  fm_other_info: 'fm_other_info',
  fm_created_at: 'fm_created_at',
  fm_created_by: 'fm_created_by',
  fm_updated_by: 'fm_updated_by',
  fm_updated_at: 'fm_updated_at',
  fm_deleted_at: 'fm_deleted_at',
  fm_deleted_by: 'fm_deleted_by',
  fm_is_deleted: 'fm_is_deleted'
};

exports.Prisma.JournalScalarFieldEnum = {
  jrnl_id: 'jrnl_id',
  jrnl_uuid: 'jrnl_uuid',
  jrnl_firm_id: 'jrnl_firm_id',
  jrnl_own_id: 'jrnl_own_id',
  jrnl_user_id: 'jrnl_user_id',
  jrnl_add_date: 'jrnl_add_date',
  jrnl_date: 'jrnl_date',
  jrnl_amt: 'jrnl_amt',
  jrnl_panel: 'jrnl_panel',
  jrnl_other_info: 'jrnl_other_info',
  jrnl_created_at: 'jrnl_created_at',
  jrnl_created_by: 'jrnl_created_by',
  jrnl_updated_by: 'jrnl_updated_by',
  jrnl_updated_at: 'jrnl_updated_at',
  jrnl_deleted_at: 'jrnl_deleted_at',
  jrnl_deleted_by: 'jrnl_deleted_by',
  jrnl_is_deleted: 'jrnl_is_deleted'
};

exports.Prisma.JournalTransactionScalarFieldEnum = {
  jrtr_id: 'jrtr_id',
  jrtr_uuid: 'jrtr_uuid',
  jrtr_jrnl_id: 'jrtr_jrnl_id',
  jrtr_firm_id: 'jrtr_firm_id',
  jrtr_own_id: 'jrtr_own_id',
  jrtr_user_id: 'jrtr_user_id',
  jrtr_cr_acc_id: 'jrtr_cr_acc_id',
  jrtr_dr_acc_id: 'jrtr_dr_acc_id',
  jrtr_add_date: 'jrtr_add_date',
  jrtr_date: 'jrtr_date',
  jrtr_panel: 'jrtr_panel',
  jrtr_crdr: 'jrtr_crdr',
  jrtr_cr_amt: 'jrtr_cr_amt',
  jrtr_dr_amt: 'jrtr_dr_amt',
  jrtr_acc_info: 'jrtr_acc_info',
  jrtr_other_info: 'jrtr_other_info',
  jrtr_created_at: 'jrtr_created_at',
  jrtr_created_by: 'jrtr_created_by',
  jrtr_updated_by: 'jrtr_updated_by',
  jrtr_updated_at: 'jrtr_updated_at',
  jrtr_deleted_at: 'jrtr_deleted_at',
  jrtr_deleted_by: 'jrtr_deleted_by',
  jrtr_is_deleted: 'jrtr_is_deleted'
};

exports.Prisma.GirviScalarFieldEnum = {
  girv_id: 'girv_id',
  girv_uuid: 'girv_uuid',
  girv_unique_code: 'girv_unique_code',
  girv_add_date: 'girv_add_date',
  girv_firm_id: 'girv_firm_id',
  girv_own_id: 'girv_own_id',
  girv_user_id: 'girv_user_id',
  girv_staff_id: 'girv_staff_id',
  girv_start_date: 'girv_start_date',
  girv_loan_no: 'girv_loan_no',
  girv_loan_pre_no: 'girv_loan_pre_no',
  girv_prin_amt: 'girv_prin_amt',
  girv_process_per: 'girv_process_per',
  girv_process_amt: 'girv_process_amt',
  girv_packet_no: 'girv_packet_no',
  girv_locker_no: 'girv_locker_no',
  girv_charge_per: 'girv_charge_per',
  girv_charge_amt: 'girv_charge_amt',
  girv_roi: 'girv_roi',
  girv_roi_type: 'girv_roi_type',
  girv_type: 'girv_type',
  girv_interest_method: 'girv_interest_method',
  girv_compound_freq: 'girv_compound_freq',
  girv_final_amt: 'girv_final_amt',
  girv_status: 'girv_status',
  girv_first_int: 'girv_first_int',
  girv_first_int_cr_acc_id: 'girv_first_int_cr_acc_id',
  girv_first_int_dr_acc_id: 'girv_first_int_dr_acc_id',
  girv_cash_amt: 'girv_cash_amt',
  girv_bank_amt: 'girv_bank_amt',
  girv_online_amt: 'girv_online_amt',
  girv_card_amt: 'girv_card_amt',
  girv_cash_acc_id: 'girv_cash_acc_id',
  girv_bank_acc_id: 'girv_bank_acc_id',
  girv_online_acc_id: 'girv_online_acc_id',
  girv_card_acc_id: 'girv_card_acc_id',
  girv_cash_info: 'girv_cash_info',
  girv_bank_info: 'girv_bank_info',
  girv_online_info: 'girv_online_info',
  girv_card_info: 'girv_card_info',
  girv_dr_acc_id: 'girv_dr_acc_id',
  girv_other_info: 'girv_other_info',
  girv_pay_info: 'girv_pay_info',
  girv_transfer_firm_id: 'girv_transfer_firm_id',
  girv_transfer_girv_id: 'girv_transfer_girv_id',
  girv_transfer_ml_id: 'girv_transfer_ml_id',
  girv_is_transferred_in: 'girv_is_transferred_in',
  girv_transfer_from_girv_id: 'girv_transfer_from_girv_id',
  girv_transfer_from_firm_id: 'girv_transfer_from_firm_id',
  girv_created_at: 'girv_created_at',
  girv_created_by: 'girv_created_by',
  girv_updated_at: 'girv_updated_at',
  girv_updated_by: 'girv_updated_by',
  girv_deleted_at: 'girv_deleted_at',
  girv_deleted_by: 'girv_deleted_by',
  girv_is_deleted: 'girv_is_deleted'
};

exports.Prisma.StockScalarFieldEnum = {
  st_id: 'st_id',
  st_uuid: 'st_uuid',
  st_add_date: 'st_add_date',
  st_own_id: 'st_own_id',
  st_firm_id: 'st_firm_id',
  st_user_id: 'st_user_id',
  st_staff_id: 'st_staff_id',
  st_image_id: 'st_image_id',
  st_image: 'st_image',
  st_referance_panel: 'st_referance_panel',
  st_referance_id: 'st_referance_id',
  st_metal_type: 'st_metal_type',
  st_item_name: 'st_item_name',
  st_quantity: 'st_quantity',
  st_rate: 'st_rate',
  st_gs_weight: 'st_gs_weight',
  st_gs_type: 'st_gs_type',
  st_nt_weight: 'st_nt_weight',
  st_nt_type: 'st_nt_type',
  st_purity: 'st_purity',
  st_fine_weight: 'st_fine_weight',
  st_valuation: 'st_valuation',
  st_final_valuation: 'st_final_valuation',
  st_status: 'st_status',
  st_created_at: 'st_created_at',
  st_created_by: 'st_created_by',
  st_updated_at: 'st_updated_at',
  st_updated_by: 'st_updated_by',
  st_deleted_at: 'st_deleted_at',
  st_deleted_by: 'st_deleted_by',
  st_is_deleted: 'st_is_deleted'
};

exports.Prisma.AdditionalPrincipalScalarFieldEnum = {
  ap_id: 'ap_id',
  ap_uuid: 'ap_uuid',
  ap_own_id: 'ap_own_id',
  ap_firm_id: 'ap_firm_id',
  ap_user_id: 'ap_user_id',
  ap_girv_id: 'ap_girv_id',
  ap_staff_id: 'ap_staff_id',
  ap_trans_date: 'ap_trans_date',
  ap_prin_amt: 'ap_prin_amt',
  ap_roi: 'ap_roi',
  ap_payable_amt: 'ap_payable_amt',
  ap_cash_amt: 'ap_cash_amt',
  ap_cash_acc_id: 'ap_cash_acc_id',
  ap_cash_info: 'ap_cash_info',
  ap_bank_amt: 'ap_bank_amt',
  ap_bank_acc_id: 'ap_bank_acc_id',
  ap_bank_info: 'ap_bank_info',
  ap_online_amt: 'ap_online_amt',
  ap_online_acc_id: 'ap_online_acc_id',
  ap_online_info: 'ap_online_info',
  ap_card_amt: 'ap_card_amt',
  ap_card_acc_id: 'ap_card_acc_id',
  ap_card_info: 'ap_card_info',
  ap_pay_info: 'ap_pay_info',
  ap_other_info: 'ap_other_info',
  ap_created_at: 'ap_created_at',
  ap_created_by: 'ap_created_by',
  ap_updated_at: 'ap_updated_at',
  ap_updated_by: 'ap_updated_by',
  ap_deleted_at: 'ap_deleted_at',
  ap_deleted_by: 'ap_deleted_by',
  ap_is_deleted: 'ap_is_deleted'
};

exports.Prisma.GirviDepositScalarFieldEnum = {
  dep_id: 'dep_id',
  dep_uuid: 'dep_uuid',
  dep_own_id: 'dep_own_id',
  dep_firm_id: 'dep_firm_id',
  dep_user_id: 'dep_user_id',
  dep_girv_id: 'dep_girv_id',
  dep_staff_id: 'dep_staff_id',
  dep_trans_date: 'dep_trans_date',
  dep_prin_amt: 'dep_prin_amt',
  dep_int_amt: 'dep_int_amt',
  dep_disc_amt: 'dep_disc_amt',
  dep_extra_amt: 'dep_extra_amt',
  dep_payable_amt: 'dep_payable_amt',
  dep_prin_acc_id: 'dep_prin_acc_id',
  dep_int_acc_id: 'dep_int_acc_id',
  dep_disc_acc_id: 'dep_disc_acc_id',
  dep_extra_acc_id: 'dep_extra_acc_id',
  dep_cash_amt: 'dep_cash_amt',
  dep_cash_acc_id: 'dep_cash_acc_id',
  dep_cash_info: 'dep_cash_info',
  dep_bank_amt: 'dep_bank_amt',
  dep_bank_acc_id: 'dep_bank_acc_id',
  dep_bank_info: 'dep_bank_info',
  dep_online_amt: 'dep_online_amt',
  dep_online_acc_id: 'dep_online_acc_id',
  dep_online_info: 'dep_online_info',
  dep_card_amt: 'dep_card_amt',
  dep_card_acc_id: 'dep_card_acc_id',
  dep_card_info: 'dep_card_info',
  dep_pay_info: 'dep_pay_info',
  dep_other_info: 'dep_other_info',
  dep_created_at: 'dep_created_at',
  dep_created_by: 'dep_created_by',
  dep_updated_at: 'dep_updated_at',
  dep_updated_by: 'dep_updated_by',
  dep_deleted_at: 'dep_deleted_at',
  dep_deleted_by: 'dep_deleted_by',
  dep_is_deleted: 'dep_is_deleted'
};

exports.Prisma.GirviReleaseScalarFieldEnum = {
  rel_id: 'rel_id',
  rel_uuid: 'rel_uuid',
  rel_own_id: 'rel_own_id',
  rel_firm_id: 'rel_firm_id',
  rel_user_id: 'rel_user_id',
  rel_girv_id: 'rel_girv_id',
  rel_staff_id: 'rel_staff_id',
  rel_trans_date: 'rel_trans_date',
  rel_prin_amt: 'rel_prin_amt',
  rel_int_amt: 'rel_int_amt',
  rel_disc_amt: 'rel_disc_amt',
  rel_extra_amt: 'rel_extra_amt',
  rel_payable_amt: 'rel_payable_amt',
  rel_prin_acc_id: 'rel_prin_acc_id',
  rel_int_acc_id: 'rel_int_acc_id',
  rel_disc_acc_id: 'rel_disc_acc_id',
  rel_extra_acc_id: 'rel_extra_acc_id',
  rel_cash_amt: 'rel_cash_amt',
  rel_cash_acc_id: 'rel_cash_acc_id',
  rel_cash_info: 'rel_cash_info',
  rel_bank_amt: 'rel_bank_amt',
  rel_bank_acc_id: 'rel_bank_acc_id',
  rel_bank_info: 'rel_bank_info',
  rel_online_amt: 'rel_online_amt',
  rel_online_acc_id: 'rel_online_acc_id',
  rel_online_info: 'rel_online_info',
  rel_card_amt: 'rel_card_amt',
  rel_card_acc_id: 'rel_card_acc_id',
  rel_card_info: 'rel_card_info',
  rel_pay_info: 'rel_pay_info',
  rel_other_info: 'rel_other_info',
  rel_remark: 'rel_remark',
  rel_item_images: 'rel_item_images',
  rel_is_other_user: 'rel_is_other_user',
  rel_pickup_user_id: 'rel_pickup_user_id',
  rel_created_at: 'rel_created_at',
  rel_created_by: 'rel_created_by',
  rel_updated_at: 'rel_updated_at',
  rel_updated_by: 'rel_updated_by',
  rel_deleted_at: 'rel_deleted_at',
  rel_deleted_by: 'rel_deleted_by',
  rel_is_deleted: 'rel_is_deleted'
};

exports.Prisma.ReleaseUserScalarFieldEnum = {
  ru_id: 'ru_id',
  ru_uuid: 'ru_uuid',
  ru_unique_code: 'ru_unique_code',
  ru_date: 'ru_date',
  ru_firm_id: 'ru_firm_id',
  ru_full_name: 'ru_full_name',
  ru_mobile: 'ru_mobile',
  ru_email: 'ru_email',
  ru_aadhaar: 'ru_aadhaar',
  ru_gender: 'ru_gender',
  ru_pan: 'ru_pan',
  ru_address: 'ru_address',
  ru_state: 'ru_state',
  ru_city: 'ru_city',
  ru_country: 'ru_country',
  ru_village: 'ru_village',
  ru_pincode: 'ru_pincode',
  ru_other_images: 'ru_other_images'
};

exports.Prisma.RateScalarFieldEnum = {
  rate_id: 'rate_id',
  rate_uuid: 'rate_uuid',
  rate_own_id: 'rate_own_id',
  rate_firm_id: 'rate_firm_id',
  rate_metal: 'rate_metal',
  rate_purity: 'rate_purity',
  rate_amount: 'rate_amount',
  rate_unit: 'rate_unit',
  rate_date: 'rate_date',
  rate_time: 'rate_time',
  rate_desc: 'rate_desc',
  rate_created_at: 'rate_created_at',
  rate_created_by: 'rate_created_by',
  rate_updated_at: 'rate_updated_at',
  rate_updated_by: 'rate_updated_by',
  rate_deleted_at: 'rate_deleted_at',
  rate_deleted_by: 'rate_deleted_by',
  rate_is_deleted: 'rate_is_deleted'
};

exports.Prisma.PurityScalarFieldEnum = {
  purity_id: 'purity_id',
  purity_uuid: 'purity_uuid',
  purity_own_id: 'purity_own_id',
  purity_metal: 'purity_metal',
  purity_name: 'purity_name',
  purity_value: 'purity_value',
  purity_desc: 'purity_desc',
  purity_is_deleted: 'purity_is_deleted',
  purity_created_by: 'purity_created_by',
  purity_updated_by: 'purity_updated_by',
  purity_created_at: 'purity_created_at',
  purity_updated_at: 'purity_updated_at'
};

exports.Prisma.MoneyLenderScalarFieldEnum = {
  ml_id: 'ml_id',
  ml_uuid: 'ml_uuid',
  ml_unique_code: 'ml_unique_code',
  ml_own_id: 'ml_own_id',
  ml_first_name: 'ml_first_name',
  ml_last_name: 'ml_last_name',
  ml_father_name: 'ml_father_name',
  ml_gender: 'ml_gender',
  ml_dob: 'ml_dob',
  ml_firm_id: 'ml_firm_id',
  ml_phone: 'ml_phone',
  ml_email: 'ml_email',
  ml_aadhaar: 'ml_aadhaar',
  ml_pan: 'ml_pan',
  ml_gstin: 'ml_gstin',
  ml_tax_no: 'ml_tax_no',
  ml_bank_name: 'ml_bank_name',
  ml_account_number: 'ml_account_number',
  ml_ifsc: 'ml_ifsc',
  ml_branch: 'ml_branch',
  ml_village: 'ml_village',
  ml_city: 'ml_city',
  ml_state: 'ml_state',
  ml_country: 'ml_country',
  ml_pincode: 'ml_pincode',
  ml_address: 'ml_address',
  ml_notes: 'ml_notes',
  ml_profile_img: 'ml_profile_img',
  ml_other_images: 'ml_other_images',
  is_active: 'is_active',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.AuctionUserScalarFieldEnum = {
  au_id: 'au_id',
  au_uuid: 'au_uuid',
  au_unique_code: 'au_unique_code',
  au_date: 'au_date',
  au_firm_id: 'au_firm_id',
  au_full_name: 'au_full_name',
  au_mobile: 'au_mobile',
  au_email: 'au_email',
  au_aadhaar: 'au_aadhaar',
  au_gender: 'au_gender',
  au_pan: 'au_pan',
  au_address: 'au_address',
  au_state: 'au_state',
  au_city: 'au_city',
  au_country: 'au_country',
  au_village: 'au_village',
  au_pincode: 'au_pincode',
  au_profile_img: 'au_profile_img',
  au_other_images: 'au_other_images'
};

exports.Prisma.AuctionLoanScalarFieldEnum = {
  al_id: 'al_id',
  al_uuid: 'al_uuid',
  al_date: 'al_date',
  al_girv_id: 'al_girv_id',
  al_firm_id: 'al_firm_id',
  al_buyer_id: 'al_buyer_id',
  al_prin_amt: 'al_prin_amt',
  al_int_amt: 'al_int_amt',
  al_dep_amt: 'al_dep_amt',
  al_payable_amt: 'al_payable_amt',
  al_cash_acc_id: 'al_cash_acc_id',
  al_cash_info: 'al_cash_info',
  al_cash_amt: 'al_cash_amt',
  al_bank_acc_id: 'al_bank_acc_id',
  al_bank_info: 'al_bank_info',
  al_bank_amt: 'al_bank_amt',
  al_online_acc_id: 'al_online_acc_id',
  al_online_info: 'al_online_info',
  al_online_amt: 'al_online_amt',
  al_card_acc_id: 'al_card_acc_id',
  al_card_info: 'al_card_info',
  al_card_amt: 'al_card_amt',
  al_pay_info: 'al_pay_info',
  al_other_info: 'al_other_info'
};

exports.Prisma.StaffScalarFieldEnum = {
  staff_id: 'staff_id',
  staff_uuid: 'staff_uuid',
  staff_unique_code: 'staff_unique_code',
  staff_own_id: 'staff_own_id',
  staff_add_date: 'staff_add_date',
  staff_first_name: 'staff_first_name',
  staff_last_name: 'staff_last_name',
  staff_father_name: 'staff_father_name',
  staff_mother_name: 'staff_mother_name',
  staff_mobile_no: 'staff_mobile_no',
  staff_phone_no: 'staff_phone_no',
  staff_email_id: 'staff_email_id',
  staff_gender: 'staff_gender',
  staff_cast: 'staff_cast',
  staff_marital_status: 'staff_marital_status',
  staff_occupation: 'staff_occupation',
  staff_birth_date: 'staff_birth_date',
  staff_gstin: 'staff_gstin',
  staff_tax_no: 'staff_tax_no',
  staff_pan_no: 'staff_pan_no',
  staff_adhaar_no: 'staff_adhaar_no',
  staff_login_id: 'staff_login_id',
  staff_password: 'staff_password',
  staff_status: 'staff_status',
  staff_profile_img: 'staff_profile_img',
  staff_other_images: 'staff_other_images',
  staff_per_address: 'staff_per_address',
  staff_curr_address: 'staff_curr_address',
  staff_village: 'staff_village',
  staff_ward_no: 'staff_ward_no',
  staff_tehsil: 'staff_tehsil',
  staff_city: 'staff_city',
  staff_state: 'staff_state',
  staff_country: 'staff_country',
  staff_pincode: 'staff_pincode',
  staff_bank_name: 'staff_bank_name',
  staff_bank_acc_no: 'staff_bank_acc_no',
  staff_ifsc_code: 'staff_ifsc_code',
  staff_other_info: 'staff_other_info',
  staff_refresh_token: 'staff_refresh_token',
  staff_jwt_token: 'staff_jwt_token',
  staff_login_status: 'staff_login_status',
  staff_last_login_system: 'staff_last_login_system',
  staff_otp: 'staff_otp',
  staff_otp_expiry: 'staff_otp_expiry',
  staff_created_at: 'staff_created_at',
  staff_created_by: 'staff_created_by',
  staff_updated_at: 'staff_updated_at',
  staff_updated_by: 'staff_updated_by',
  staff_deleted_at: 'staff_deleted_at',
  staff_deleted_by: 'staff_deleted_by',
  staff_is_deleted: 'staff_is_deleted'
};

exports.Prisma.PermissionScalarFieldEnum = {
  perm_id: 'perm_id',
  perm_key: 'perm_key',
  perm_module: 'perm_module',
  perm_action: 'perm_action',
  perm_label: 'perm_label',
  perm_sort_order: 'perm_sort_order',
  perm_created_at: 'perm_created_at',
  perm_updated_at: 'perm_updated_at'
};

exports.Prisma.StaffPermissionScalarFieldEnum = {
  sp_id: 'sp_id',
  sp_staff_id: 'sp_staff_id',
  sp_perm_id: 'sp_perm_id',
  sp_granted: 'sp_granted',
  sp_created_at: 'sp_created_at',
  sp_updated_at: 'sp_updated_at'
};

exports.Prisma.SerialNumberScalarFieldEnum = {
  sn_id: 'sn_id',
  entity_type: 'entity_type',
  start_number: 'start_number',
  current_number: 'current_number',
  number_prefix: 'number_prefix',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.MessageTemplateScalarFieldEnum = {
  mt_id: 'mt_id',
  mt_uuid: 'mt_uuid',
  mt_own_id: 'mt_own_id',
  mt_firm_id: 'mt_firm_id',
  mt_channel: 'mt_channel',
  mt_key: 'mt_key',
  mt_name: 'mt_name',
  mt_category: 'mt_category',
  mt_language: 'mt_language',
  mt_subject: 'mt_subject',
  mt_body: 'mt_body',
  mt_variables: 'mt_variables',
  mt_attachments: 'mt_attachments',
  mt_has_attachment: 'mt_has_attachment',
  mt_is_system: 'mt_is_system',
  mt_status: 'mt_status',
  mt_created_at: 'mt_created_at',
  mt_created_by: 'mt_created_by',
  mt_updated_at: 'mt_updated_at',
  mt_updated_by: 'mt_updated_by',
  mt_deleted_at: 'mt_deleted_at',
  mt_deleted_by: 'mt_deleted_by',
  mt_is_deleted: 'mt_is_deleted'
};

exports.Prisma.WhatsAppInstanceScalarFieldEnum = {
  wa_id: 'wa_id',
  wa_uuid: 'wa_uuid',
  wa_own_id: 'wa_own_id',
  wa_firm_id: 'wa_firm_id',
  wa_provider: 'wa_provider',
  wa_instance_id: 'wa_instance_id',
  wa_token: 'wa_token',
  wa_api_url: 'wa_api_url',
  wa_phone_number: 'wa_phone_number',
  wa_status: 'wa_status',
  wa_qr_code: 'wa_qr_code',
  wa_last_checked: 'wa_last_checked',
  wa_meta: 'wa_meta',
  wa_created_at: 'wa_created_at',
  wa_created_by: 'wa_created_by',
  wa_updated_at: 'wa_updated_at',
  wa_updated_by: 'wa_updated_by',
  wa_deleted_at: 'wa_deleted_at',
  wa_deleted_by: 'wa_deleted_by',
  wa_is_deleted: 'wa_is_deleted'
};

exports.Prisma.MessageLogScalarFieldEnum = {
  ml_id: 'ml_id',
  ml_uuid: 'ml_uuid',
  ml_own_id: 'ml_own_id',
  ml_firm_id: 'ml_firm_id',
  ml_channel: 'ml_channel',
  ml_template_key: 'ml_template_key',
  ml_to: 'ml_to',
  ml_status: 'ml_status',
  ml_error: 'ml_error',
  ml_meta: 'ml_meta',
  ml_created_at: 'ml_created_at'
};

exports.Prisma.ActivityLogScalarFieldEnum = {
  al_id: 'al_id',
  al_uuid: 'al_uuid',
  al_own_id: 'al_own_id',
  al_firm_id: 'al_firm_id',
  al_module: 'al_module',
  al_action: 'al_action',
  al_subject: 'al_subject',
  al_description: 'al_description',
  al_entity_type: 'al_entity_type',
  al_entity_id: 'al_entity_id',
  al_ref_no: 'al_ref_no',
  al_amount: 'al_amount',
  al_login_id: 'al_login_id',
  al_meta: 'al_meta',
  al_created_at: 'al_created_at'
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

exports.UserGender = exports.$Enums.UserGender = {
  Male: 'Male',
  Female: 'Female',
  Other: 'Other'
};

exports.UserMaritalStatus = exports.$Enums.UserMaritalStatus = {
  Single: 'Single',
  Married: 'Married',
  Divorced: 'Divorced',
  Widowed: 'Widowed',
  Other: 'Other'
};

exports.FrequencyType = exports.$Enums.FrequencyType = {
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
  WEEKLY: 'WEEKLY',
  DAILY: 'DAILY'
};

exports.FinanceStatus = exports.$Enums.FinanceStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PARTIAL: 'PARTIAL',
  CLOSED: 'CLOSED',
  COMPLETED: 'COMPLETED'
};

exports.EmiStatus = exports.$Enums.EmiStatus = {
  PAID: 'PAID',
  PENDING: 'PENDING',
  PARTIAL: 'PARTIAL',
  DUE: 'DUE'
};

exports.BalanceType = exports.$Enums.BalanceType = {
  CR: 'CR',
  DR: 'DR'
};

exports.BalanceAmtType = exports.$Enums.BalanceAmtType = {
  CR: 'CR',
  DR: 'DR'
};

exports.GirviRoiType = exports.$Enums.GirviRoiType = {
  monthly: 'monthly',
  annually: 'annually'
};

exports.GirviType = exports.$Enums.GirviType = {
  unsecured: 'unsecured',
  secured: 'secured'
};

exports.GirviInterestMethod = exports.$Enums.GirviInterestMethod = {
  simple: 'simple',
  compound: 'compound'
};

exports.GirviCompoundFreq = exports.$Enums.GirviCompoundFreq = {
  monthly: 'monthly',
  quarterly: 'quarterly',
  half_yearly: 'half_yearly',
  yearly: 'yearly'
};

exports.GirviStatus = exports.$Enums.GirviStatus = {
  ACTIVE: 'ACTIVE',
  RELEASED: 'RELEASED',
  CLOSED: 'CLOSED',
  TRANSFERRED: 'TRANSFERRED',
  AUCTION: 'AUCTION'
};

exports.StockMetalType = exports.$Enums.StockMetalType = {
  gold: 'gold',
  silver: 'silver',
  platinum: 'platinum'
};

exports.StockWeightType = exports.$Enums.StockWeightType = {
  GM: 'GM',
  KG: 'KG'
};

exports.StockStatus = exports.$Enums.StockStatus = {
  active: 'active',
  inactive: 'inactive',
  sold: 'sold',
  returned: 'returned'
};

exports.StaffGender = exports.$Enums.StaffGender = {
  Male: 'Male',
  Female: 'Female',
  Other: 'Other'
};

exports.StaffMaritalStatus = exports.$Enums.StaffMaritalStatus = {
  Single: 'Single',
  Married: 'Married',
  Divorced: 'Divorced',
  Widowed: 'Widowed',
  Other: 'Other'
};

exports.StaffStatus = exports.$Enums.StaffStatus = {
  Active: 'Active',
  Inactive: 'Inactive'
};

exports.MessageChannel = exports.$Enums.MessageChannel = {
  whatsapp: 'whatsapp',
  sms: 'sms',
  email: 'email'
};

exports.MessageTemplateStatus = exports.$Enums.MessageTemplateStatus = {
  Active: 'Active',
  Inactive: 'Inactive'
};

exports.WhatsAppInstanceStatus = exports.$Enums.WhatsAppInstanceStatus = {
  Pending: 'Pending',
  Connected: 'Connected',
  Disconnected: 'Disconnected',
  Error: 'Error'
};

exports.Prisma.ModelName = {
  Owner: 'Owner',
  Firm: 'Firm',
  Account: 'Account',
  User: 'User',
  Finance: 'Finance',
  Finance_Transaction: 'Finance_Transaction',
  Finance_Money_Transaction: 'Finance_Money_Transaction',
  Journal: 'Journal',
  JournalTransaction: 'JournalTransaction',
  Girvi: 'Girvi',
  Stock: 'Stock',
  AdditionalPrincipal: 'AdditionalPrincipal',
  GirviDeposit: 'GirviDeposit',
  GirviRelease: 'GirviRelease',
  ReleaseUser: 'ReleaseUser',
  Rate: 'Rate',
  Purity: 'Purity',
  MoneyLender: 'MoneyLender',
  AuctionUser: 'AuctionUser',
  AuctionLoan: 'AuctionLoan',
  Staff: 'Staff',
  Permission: 'Permission',
  StaffPermission: 'StaffPermission',
  SerialNumber: 'SerialNumber',
  MessageTemplate: 'MessageTemplate',
  WhatsAppInstance: 'WhatsAppInstance',
  MessageLog: 'MessageLog',
  ActivityLog: 'ActivityLog'
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
