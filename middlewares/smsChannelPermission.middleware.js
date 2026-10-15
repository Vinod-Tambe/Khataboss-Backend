"use strict";

const requirePermission = require("./permission.middleware");
const {
  viewKeysForChannel,
  manageKeysForChannel,
  normalizeChannel,
} = require("../common/constants/smsChannelPermissions");

const channelFromRequest = (req) =>
  normalizeChannel(
    req.query?.channel ||
      req.body?.channel ||
      req.params?.channel
  );

/** Require view or manage permission for the message channel on the request. */
const requireSmsChannelPermission = (level) => (req, res, next) => {
  const channel = channelFromRequest(req);
  const keys =
    level === "manage"
      ? manageKeysForChannel(channel)
      : viewKeysForChannel(channel);
  return requirePermission(keys, { mode: "any" })(req, res, next);
};

module.exports = {
  requireSmsChannelPermission,
  channelFromRequest,
};
