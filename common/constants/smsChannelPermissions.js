"use strict";

const SMS_CHANNEL_VIEW = {
  whatsapp: "sms.whatsappView",
  sms: "sms.textView",
  email: "sms.emailView",
};

const SMS_CHANNEL_MANAGE = {
  whatsapp: "sms.whatsappManage",
  sms: "sms.textManage",
  email: "sms.emailManage",
};

const normalizeChannel = (channel) => {
  const id = String(channel || "whatsapp").toLowerCase();
  if (id === "text") return "sms";
  return SMS_CHANNEL_VIEW[id] ? id : "whatsapp";
};

const viewKeysForChannel = (channel) => {
  const id = normalizeChannel(channel);
  return [SMS_CHANNEL_VIEW[id], "sms.view"];
};

const manageKeysForChannel = (channel) => {
  const id = normalizeChannel(channel);
  return [SMS_CHANNEL_MANAGE[id], "sms.manage"];
};

const ALL_SMS_VIEW_KEYS = [
  "sms.view",
  "sms.whatsappView",
  "sms.textView",
  "sms.emailView",
];

const ALL_SMS_MANAGE_KEYS = [
  "sms.manage",
  "sms.whatsappManage",
  "sms.textManage",
  "sms.emailManage",
];

module.exports = {
  SMS_CHANNEL_VIEW,
  SMS_CHANNEL_MANAGE,
  normalizeChannel,
  viewKeysForChannel,
  manageKeysForChannel,
  ALL_SMS_VIEW_KEYS,
  ALL_SMS_MANAGE_KEYS,
};
