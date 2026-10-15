"use strict";

/** Legacy keys that still grant newer module permissions (staff rows / old assignments). */
const PERMISSION_ALIASES = {
  "expense.view": ["account.view", "account.transfer"],
  "expense.create": ["account.transfer"],
  "stock.view": ["loan.view"],
  "sms.whatsappView": ["sms.view"],
  "sms.textView": ["sms.view"],
  "sms.emailView": ["sms.view"],
  "sms.whatsappManage": ["sms.manage"],
  "sms.textManage": ["sms.manage"],
  "sms.emailManage": ["sms.manage"],
  "formBuilder.view": ["settings.manage"],
  "formBuilder.edit": ["settings.manage"],
  "agreementBuilder.view": ["settings.manage"],
  "agreementBuilder.edit": ["settings.manage"],
};

const expandPermissionKey = (permissionKey) => {
  const aliases = PERMISSION_ALIASES[permissionKey] || [];
  return [permissionKey, ...aliases];
};

module.exports = {
  PERMISSION_ALIASES,
  expandPermissionKey,
};
