"use strict";

function getCustomerWhatsAppNo(user) {
  if (!user) return null;
  const whatsapp = String(user.user_whatsapp_no || "").trim();
  const mobile = String(user.user_mobile_no || "").trim();
  return whatsapp || mobile || null;
}

module.exports = { getCustomerWhatsAppNo };
