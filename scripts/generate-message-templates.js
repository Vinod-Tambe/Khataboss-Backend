"use strict";

const fs = require("fs");
const path = require("path");

const V = {
  name: { key: "{{1}}", label: "Person Name" },
  ref: { key: "{{2}}", label: "Reference / Code / Login ID" },
  amount: { key: "{{3}}", label: "Amount / Password / Detail" },
  date: { key: "{{4}}", label: "Date / Extra" },
  firm: { key: "{{firm_name}}", label: "Firm Name" },
};

const vars = (...keys) => keys.map((k) => V[k]);

const ops = [
  {
    module: "owner",
    category: "OTP",
    key: "owner_otp_login",
    name: "owner_otp_login",
    has_attachment: false,
    wa: "Hello {{1}}, your owner login OTP is {{2}}. Valid for a short time. Do not share. — {{firm_name}}",
    sms: "OTP {{2}} for owner login {{1}}. Do not share. - {{firm_name}}",
    email_subject: "Owner login OTP — {{firm_name}}",
    email:
      "<p>Hello {{1}},</p><p>Your owner login OTP is <strong>{{2}}</strong>.</p><p>Do not share this code. — {{firm_name}}</p>",
    variables: vars("name", "ref", "firm"),
  },
  {
    module: "owner",
    category: "Transactional",
    key: "owner_password_updated",
    name: "owner_password_updated",
    has_attachment: false,
    wa: "Hello {{1}}, your owner password for {{firm_name}} was updated successfully on {{4}}. If this was not you, contact support.",
    sms: "Owner password updated for {{1}} at {{firm_name}} on {{4}}.",
    email_subject: "Owner password updated — {{firm_name}}",
    email:
      "<p>Hello {{1}},</p><p>Your owner password for <strong>{{firm_name}}</strong> was updated on {{4}}.</p><p>If you did not request this, contact support immediately.</p>",
    variables: vars("name", "date", "firm"),
  },
  {
    module: "owner",
    category: "Transactional",
    key: "owner_password_reset",
    name: "owner_password_reset",
    has_attachment: false,
    wa: "Hello {{1}}, your temporary owner password for {{firm_name}} is {{3}}. Please login and change it immediately.",
    sms: "Temp owner password for {{1}}: {{3}}. Change after login. - {{firm_name}}",
    email_subject: "Owner password reset — {{firm_name}}",
    email:
      "<p>Hello {{1}},</p><p>Your temporary owner password for <strong>{{firm_name}}</strong> is: <strong>{{3}}</strong></p><p>Please login and change it immediately.</p>",
    variables: vars("name", "amount", "firm"),
  },
  {
    module: "staff",
    category: "Transactional",
    key: "staff_created",
    name: "staff_created",
    has_attachment: false,
    wa: "Hello {{1}}, your staff account is created at {{firm_name}}.\nLogin ID: {{2}}\nPassword: {{3}}\nPlease login and change your password.",
    sms: "Staff account created at {{firm_name}}. Login: {{2}} Pass: {{3}} - {{1}}",
    email_subject: "Staff account created — {{firm_name}}",
    email:
      "<p>Hello {{1}},</p><p>Your staff account is created at <strong>{{firm_name}}</strong>.</p><p>Login ID: <strong>{{2}}</strong><br/>Password: <strong>{{3}}</strong></p><p>Please login and change your password.</p>",
    variables: vars("name", "ref", "amount", "firm"),
  },
  {
    module: "staff",
    category: "Transactional",
    key: "staff_updated",
    name: "staff_updated",
    has_attachment: false,
    wa: "Hello {{1}}, your staff profile at {{firm_name}} was updated on {{4}}.",
    sms: "Staff profile updated for {{1}} at {{firm_name}} on {{4}}.",
    email_subject: "Staff profile updated — {{firm_name}}",
    email:
      "<p>Hello {{1}},</p><p>Your staff profile at <strong>{{firm_name}}</strong> was updated on {{4}}.</p>",
    variables: vars("name", "date", "firm"),
  },
  {
    module: "staff",
    category: "Transactional",
    key: "staff_password_updated",
    name: "staff_password_updated",
    has_attachment: false,
    wa: "Hello {{1}}, your staff password for {{firm_name}} was updated successfully on {{4}}.",
    sms: "Staff password updated for {{1}} at {{firm_name}} on {{4}}.",
    email_subject: "Staff password updated — {{firm_name}}",
    email:
      "<p>Hello {{1}},</p><p>Your staff password for <strong>{{firm_name}}</strong> was updated on {{4}}.</p><p>If this was not you, contact your owner immediately.</p>",
    variables: vars("name", "date", "firm"),
  },
  {
    module: "staff",
    category: "Transactional",
    key: "staff_password_reset",
    name: "staff_password_reset",
    has_attachment: false,
    wa: "Hello {{1}}, your temporary staff password for {{firm_name}} is {{3}}. Login ID: {{2}}. Please change it after login.",
    sms: "Temp staff pass {{3}} for {{2}} at {{firm_name}}. Change after login.",
    email_subject: "Staff password reset — {{firm_name}}",
    email:
      "<p>Hello {{1}},</p><p>Temporary staff password for <strong>{{firm_name}}</strong>:</p><p>Login ID: <strong>{{2}}</strong><br/>Password: <strong>{{3}}</strong></p><p>Please change it after login.</p>",
    variables: vars("name", "ref", "amount", "firm"),
  },
  {
    module: "staff",
    category: "OTP",
    key: "staff_otp_login",
    name: "staff_otp_login",
    has_attachment: false,
    wa: "Hello {{1}}, your staff login OTP is {{2}}. Do not share. — {{firm_name}}",
    sms: "Staff OTP {{2}} for {{1}}. Do not share. - {{firm_name}}",
    email_subject: "Staff login OTP — {{firm_name}}",
    email:
      "<p>Hello {{1}},</p><p>Your staff login OTP is <strong>{{2}}</strong>.</p><p>Do not share this code. — {{firm_name}}</p>",
    variables: vars("name", "ref", "firm"),
  },
  {
    module: "customer",
    category: "Marketing",
    key: "customer_created",
    name: "customer_created",
    has_attachment: false,
    wa: "Hello {{1}}, welcome to {{firm_name}}! Your customer profile is created.\nCustomer ID: {{2}}\nWe are happy to serve you.",
    sms: "Welcome {{1}} to {{firm_name}}. Customer ID: {{2}}",
    email_subject: "Welcome to {{firm_name}}",
    email:
      "<p>Hello {{1}},</p><p>Welcome to <strong>{{firm_name}}</strong>! Your customer profile is created.</p><p>Customer ID: <strong>{{2}}</strong></p><p>We are happy to serve you.</p>",
    variables: vars("name", "ref", "firm"),
  },
  {
    module: "customer",
    category: "Transactional",
    key: "customer_updated",
    name: "customer_updated",
    has_attachment: false,
    wa: "Hello {{1}}, your customer details at {{firm_name}} were updated on {{4}}. Customer ID: {{2}}",
    sms: "Customer details updated for {{1}} ({{2}}) at {{firm_name}} on {{4}}.",
    email_subject: "Customer details updated — {{firm_name}}",
    email:
      "<p>Hello {{1}},</p><p>Your customer details at <strong>{{firm_name}}</strong> were updated on {{4}}.</p><p>Customer ID: <strong>{{2}}</strong></p>",
    variables: vars("name", "ref", "date", "firm"),
  },
  {
    module: "customer",
    category: "Customer Care",
    key: "customer_welcome",
    name: "customer_welcome",
    has_attachment: false,
    wa: "Hello {{1}}, thank you for choosing {{firm_name}}. For any help contact us. Ref: {{2}}",
    sms: "Thanks {{1}} for choosing {{firm_name}}. Ref: {{2}}",
    email_subject: "Thank you — {{firm_name}}",
    email:
      "<p>Hello {{1}},</p><p>Thank you for choosing <strong>{{firm_name}}</strong>.</p><p>Reference: <strong>{{2}}</strong></p><p>For any help, please contact us.</p>",
    variables: vars("name", "ref", "firm"),
  },
  {
    module: "loan",
    category: "Transactional",
    key: "loan_created",
    name: "loan_created",
    has_attachment: true,
    attachment_hint: "loan_receipt",
    wa: "Hi {{1}}, your loan is created at {{firm_name}}.\nLoan No: {{2}}\nAmount: {{3}}\nDate: {{4}}\nPlease keep this for records.",
    sms: "Loan created {{2}} for {{1}}. Amt {{3}} at {{firm_name}} on {{4}}.",
    email_subject: "Loan created {{2}} — {{firm_name}}",
    email:
      "<p>Hi {{1}},</p><p>Your loan is created at <strong>{{firm_name}}</strong>.</p><p>Loan No: <strong>{{2}}</strong><br/>Amount: <strong>{{3}}</strong><br/>Date: {{4}}</p><p>Please find the receipt attached.</p>",
    variables: vars("name", "ref", "amount", "date", "firm"),
  },
  {
    module: "loan",
    category: "Transactional",
    key: "loan_updated",
    name: "loan_updated",
    has_attachment: false,
    wa: "Hi {{1}}, loan {{2}} at {{firm_name}} was updated on {{4}}. Current amount: {{3}}.",
    sms: "Loan {{2}} updated for {{1}}. Amt {{3}} - {{firm_name}}",
    email_subject: "Loan updated {{2}} — {{firm_name}}",
    email:
      "<p>Hi {{1}},</p><p>Loan <strong>{{2}}</strong> at {{firm_name}} was updated on {{4}}.</p><p>Current amount: <strong>{{3}}</strong></p>",
    variables: vars("name", "ref", "amount", "date", "firm"),
  },
  {
    module: "loan",
    category: "Transactional",
    key: "loan_deposit",
    name: "loan_deposit",
    has_attachment: true,
    attachment_hint: "deposit_receipt",
    wa: "Hello {{1}}, deposit received for loan {{2}} at {{firm_name}}.\nAmount: {{3}}\nDate: {{4}}\nThank you!",
    sms: "Deposit {{3}} for loan {{2}} received. {{1}} - {{firm_name}}",
    email_subject: "Loan deposit {{2}} — {{firm_name}}",
    email:
      "<p>Hello {{1}},</p><p>Deposit received for loan <strong>{{2}}</strong> at {{firm_name}}.</p><p>Amount: <strong>{{3}}</strong><br/>Date: {{4}}</p><p>Receipt attached.</p>",
    variables: vars("name", "ref", "amount", "date", "firm"),
  },
  {
    module: "loan",
    category: "Transactional",
    key: "loan_add_principal",
    name: "loan_add_principal",
    has_attachment: true,
    attachment_hint: "principal_receipt",
    wa: "Hello {{1}}, additional principal added to loan {{2}} at {{firm_name}}.\nAdded amount: {{3}}\nDate: {{4}}",
    sms: "Add principal {{3}} on loan {{2}} for {{1}} - {{firm_name}}",
    email_subject: "Additional principal {{2}} — {{firm_name}}",
    email:
      "<p>Hello {{1}},</p><p>Additional principal added to loan <strong>{{2}}</strong> at {{firm_name}}.</p><p>Added amount: <strong>{{3}}</strong><br/>Date: {{4}}</p>",
    variables: vars("name", "ref", "amount", "date", "firm"),
  },
  {
    module: "loan",
    category: "Transactional",
    key: "loan_release",
    name: "loan_release",
    has_attachment: true,
    attachment_hint: "release_receipt",
    wa: "Hello {{1}}, loan {{2}} is released at {{firm_name}}.\nFinal amount: {{3}}\nDate: {{4}}\nThank you for your business.",
    sms: "Loan {{2}} released for {{1}}. Final {{3}} - {{firm_name}}",
    email_subject: "Loan released {{2}} — {{firm_name}}",
    email:
      "<p>Hello {{1}},</p><p>Loan <strong>{{2}}</strong> is released at {{firm_name}}.</p><p>Final amount: <strong>{{3}}</strong><br/>Date: {{4}}</p><p>Release receipt attached.</p>",
    variables: vars("name", "ref", "amount", "date", "firm"),
  },
  {
    module: "loan",
    category: "Transactional",
    key: "loan_transfer",
    name: "loan_transfer",
    has_attachment: false,
    wa: "Hello {{1}}, loan {{2}} transfer is completed at {{firm_name}} on {{4}}. Amount: {{3}}.",
    sms: "Loan {{2}} transferred for {{1}}. Amt {{3}} - {{firm_name}}",
    email_subject: "Loan transfer {{2}} — {{firm_name}}",
    email:
      "<p>Hello {{1}},</p><p>Loan <strong>{{2}}</strong> transfer is completed at {{firm_name}} on {{4}}.</p><p>Amount: <strong>{{3}}</strong></p>",
    variables: vars("name", "ref", "amount", "date", "firm"),
  },
  {
    module: "loan",
    category: "Customer Care",
    key: "loan_due_reminder",
    name: "loan_due_reminder",
    has_attachment: false,
    wa: "Dear {{1}}, reminder from {{firm_name}}: loan {{2}} has due amount {{3}}. Due date: {{4}}. Please pay on time.",
    sms: "Reminder: loan {{2}} due {{3}} for {{1}} by {{4}} - {{firm_name}}",
    email_subject: "Loan due reminder {{2}} — {{firm_name}}",
    email:
      "<p>Dear {{1}},</p><p>Reminder from <strong>{{firm_name}}</strong>: loan <strong>{{2}}</strong> has due amount <strong>{{3}}</strong>.</p><p>Due date: {{4}}</p><p>Please pay on time.</p>",
    variables: vars("name", "ref", "amount", "date", "firm"),
  },
  {
    module: "loan",
    category: "Customer Care",
    key: "loan_notice",
    name: "loan_notice",
    has_attachment: true,
    attachment_hint: "loan_notice",
    wa: "Dear {{1}}, notice for loan {{2}} at {{firm_name}}. Outstanding: {{3}}. Date: {{4}}. Please contact us.",
    sms: "Notice: loan {{2}} outstanding {{3}} for {{1}} - {{firm_name}}",
    email_subject: "Loan notice {{2}} — {{firm_name}}",
    email:
      "<p>Dear {{1}},</p><p>This is a notice regarding loan <strong>{{2}}</strong> at {{firm_name}}.</p><p>Outstanding amount: <strong>{{3}}</strong><br/>Date: {{4}}</p><p>Please review the attached notice.</p>",
    variables: vars("name", "ref", "amount", "date", "firm"),
  },
  {
    module: "loan",
    category: "Transactional",
    key: "loan_auction",
    name: "loan_auction",
    has_attachment: true,
    attachment_hint: "auction_notice",
    wa: "Hello {{1}}, loan {{2}} is moved to auction process at {{firm_name}}.\nAmount: {{3}}\nDate: {{4}}",
    sms: "Loan {{2}} auction process for {{1}}. Amt {{3}} - {{firm_name}}",
    email_subject: "Loan auction notice {{2}} — {{firm_name}}",
    email:
      "<p>Hello {{1}},</p><p>Loan <strong>{{2}}</strong> is moved to auction process at {{firm_name}}.</p><p>Amount: <strong>{{3}}</strong><br/>Date: {{4}}</p><p>Please see attached notice.</p>",
    variables: vars("name", "ref", "amount", "date", "firm"),
  },
  {
    module: "finance",
    category: "Transactional",
    key: "finance_created",
    name: "finance_created",
    has_attachment: true,
    attachment_hint: "finance_agreement",
    wa: "Hello {{1}}, your finance account is created at {{firm_name}}.\nFinance No: {{2}}\nAmount: {{3}}\nStart date: {{4}}",
    sms: "Finance {{2}} created for {{1}}. Amt {{3}} - {{firm_name}}",
    email_subject: "Finance created {{2}} — {{firm_name}}",
    email:
      "<p>Hello {{1}},</p><p>Your finance account is created at <strong>{{firm_name}}</strong>.</p><p>Finance No: <strong>{{2}}</strong><br/>Amount: <strong>{{3}}</strong><br/>Start date: {{4}}</p>",
    variables: vars("name", "ref", "amount", "date", "firm"),
  },
  {
    module: "finance",
    category: "Transactional",
    key: "finance_emi_reminder",
    name: "finance_emi_reminder",
    has_attachment: false,
    wa: "Dear {{1}}, EMI reminder from {{firm_name}}.\nFinance No: {{2}}\nEMI amount: {{3}}\nDue date: {{4}}",
    sms: "EMI due {{3}} for finance {{2}} by {{4}}. {{1}} - {{firm_name}}",
    email_subject: "EMI reminder {{2}} — {{firm_name}}",
    email:
      "<p>Dear {{1}},</p><p>EMI reminder from <strong>{{firm_name}}</strong>.</p><p>Finance No: <strong>{{2}}</strong><br/>EMI amount: <strong>{{3}}</strong><br/>Due date: {{4}}</p>",
    variables: vars("name", "ref", "amount", "date", "firm"),
  },
  {
    module: "finance",
    category: "Transactional",
    key: "finance_payment_received",
    name: "finance_payment_received",
    has_attachment: true,
    attachment_hint: "emi_receipt",
    wa: "Hello {{1}}, payment received for finance {{2}} at {{firm_name}}.\nAmount: {{3}}\nDate: {{4}}\nThank you!",
    sms: "Payment {{3}} received for finance {{2}}. {{1}} - {{firm_name}}",
    email_subject: "Finance payment receipt {{2}} — {{firm_name}}",
    email:
      "<p>Hello {{1}},</p><p>Payment received for finance <strong>{{2}}</strong> at {{firm_name}}.</p><p>Amount: <strong>{{3}}</strong><br/>Date: {{4}}</p><p>Receipt attached.</p>",
    variables: vars("name", "ref", "amount", "date", "firm"),
  },
  {
    module: "finance",
    category: "Transactional",
    key: "finance_collection_receipt",
    name: "finance_collection_receipt",
    has_attachment: true,
    attachment_hint: "collection_receipt",
    wa: "Hello {{1}}, collection receipt for finance {{2}} at {{firm_name}}.\nCollected: {{3}}\nDate: {{4}}",
    sms: "Collection {{3}} for finance {{2}} on {{4}}. {{1}} - {{firm_name}}",
    email_subject: "Collection receipt {{2}} — {{firm_name}}",
    email:
      "<p>Hello {{1}},</p><p>Collection receipt for finance <strong>{{2}}</strong> at {{firm_name}}.</p><p>Collected: <strong>{{3}}</strong><br/>Date: {{4}}</p><p>Please find receipt attached.</p>",
    variables: vars("name", "ref", "amount", "date", "firm"),
  },
  {
    module: "finance",
    category: "Transactional",
    key: "finance_closed",
    name: "finance_closed",
    has_attachment: true,
    attachment_hint: "finance_closure",
    wa: "Hello {{1}}, finance {{2}} is closed at {{firm_name}}.\nFinal settlement: {{3}}\nDate: {{4}}\nThank you!",
    sms: "Finance {{2}} closed for {{1}}. Final {{3}} - {{firm_name}}",
    email_subject: "Finance closed {{2}} — {{firm_name}}",
    email:
      "<p>Hello {{1}},</p><p>Finance <strong>{{2}}</strong> is closed at {{firm_name}}.</p><p>Final settlement: <strong>{{3}}</strong><br/>Date: {{4}}</p><p>Closure document attached.</p>",
    variables: vars("name", "ref", "amount", "date", "firm"),
  },
];

const root = path.join(__dirname, "../common/template");

const channels = [
  {
    folder: "whatsapp",
    channel: "whatsapp",
    map: (o) => ({
      key: o.key,
      name: o.name,
      channel: "whatsapp",
      module: o.module,
      category: o.category,
      language: "English (US)",
      subject: "",
      body: o.wa,
      has_attachment: o.has_attachment,
      attachment_hint: o.attachment_hint || null,
      status: "Active",
      variables: o.variables,
    }),
  },
  {
    folder: "text",
    channel: "sms",
    map: (o) => ({
      key: o.key,
      name: o.name,
      channel: "sms",
      module: o.module,
      category: o.category,
      language: "English (US)",
      subject: "",
      body: o.sms,
      has_attachment: false,
      attachment_hint: null,
      status: "Active",
      variables: o.variables,
    }),
  },
  {
    folder: "email",
    channel: "email",
    map: (o) => ({
      key: o.key,
      name: o.name,
      channel: "email",
      module: o.module,
      category: o.category,
      language: "English (US)",
      subject: o.email_subject,
      body: o.email,
      has_attachment: o.has_attachment,
      attachment_hint: o.attachment_hint || null,
      status: "Active",
      variables: o.variables,
    }),
  },
];

for (const ch of channels) {
  const dir = path.join(root, ch.folder);
  fs.mkdirSync(dir, { recursive: true });

  for (const f of fs.readdirSync(dir)) {
    if (f.endsWith(".json")) fs.unlinkSync(path.join(dir, f));
  }

  const templates = ops.map(ch.map);
  const payload = {
    channel: ch.channel,
    version: 1,
    description: `${ch.channel} templates for owner, staff, customer, loan, finance`,
    modules: ["owner", "staff", "customer", "loan", "finance"],
    templates,
  };

  fs.writeFileSync(path.join(dir, "templates.json"), JSON.stringify(payload, null, 2));
  console.log(`✅ ${ch.folder}/templates.json -> ${templates.length} templates`);
}

console.log("Done.");
