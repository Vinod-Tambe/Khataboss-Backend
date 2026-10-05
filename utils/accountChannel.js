"use strict";

/**
 * Map a ledger account to daybook cash / bank / online / card column.
 */
function resolveAccountChannel(account = null) {
  const name = String(account?.acc_name || account?.acc_pre_acc || "").toLowerCase();
  if (name.includes("bank")) return "bank";
  if (name.includes("online") || name.includes("upi") || name.includes("paytm")) return "online";
  if (name.includes("card") || name.includes("pos")) return "card";
  return "cash";
}

function roundChannel(value) {
  return parseFloat((parseFloat(value) || 0).toFixed(2));
}

function isCreditBalanceAccount(account) {
  return String(account?.acc_balance_type || "DR").toUpperCase() === "CR";
}

/**
 * Daybook columns track liquid DR payment accounts (cash / bank / online / card).
 * CR ledger legs (e.g. Bank OD) are skipped so transfers do not show negative bank.
 */
function applyDrLiquidChannelDelta(account, amt, sign, channels) {
  const amount = parseFloat(amt) || 0;
  if (!(amount > 0) || !account || isCreditBalanceAccount(account)) return;
  const key = resolveAccountChannel(account);
  channels[key] = roundChannel(channels[key] + sign * amount);
}

/** Ledger label: main account name with primary account in parentheses. */
function formatAccountDisplayName(account) {
  if (!account) return "-";
  const main = String(account.acc_name || "").trim();
  const primary = String(account.acc_pre_acc || "").trim();
  if (!main && !primary) return "-";
  if (!main) return primary;
  if (!primary) return main;
  return `${main} (${primary})`;
}

const { normalizeTransferDirection } = require("./transferDirection");

/**
 * Build signed channel deltas for an inter-account transfer.
 * fromItems / toItems: [{ account, amt }]
 * Liquid DR accounts (cash/bank/online/card) only; CR legs skipped.
 */
function buildTransferChannelDeltas(fromItems = [], toItems = [], direction = "CR_TO_DR") {
  const channels = { cash: 0, bank: 0, online: 0, card: 0 };
  const d = normalizeTransferDirection(direction);

  const normalizeList = (items) =>
    (Array.isArray(items) ? items : [])
      .map((row) => ({
        account: row.account || row.fromAccount || row.toAccount,
        amt: parseFloat(row.amt ?? row.mtt_amt) || 0,
      }))
      .filter((row) => row.amt > 0);

  const fromList = normalizeList(fromItems);
  const toList = normalizeList(toItems);

  if (d === "CR_TO_DR") {
    for (const item of toList) {
      applyDrLiquidChannelDelta(item.account, item.amt, 1, channels);
    }
  } else if (d === "DR_TO_CR") {
    for (const item of fromList) {
      applyDrLiquidChannelDelta(item.account, item.amt, -1, channels);
    }
  } else if (d === "DR_TO_DR") {
    for (const item of fromList) {
      applyDrLiquidChannelDelta(item.account, item.amt, -1, channels);
    }
    for (const item of toList) {
      applyDrLiquidChannelDelta(item.account, item.amt, 1, channels);
    }
  }
  // CR_TO_CR: no DR liquid legs; daybook uses gross fallback on from account when net is zero.

  return channels;
}

/** Sum master opening balances for DR liquid accounts grouped by daybook channel. */
function sumDrLiquidOpeningByChannel(accounts = []) {
  const channels = { cash: 0, bank: 0, online: 0, card: 0 };
  for (const acc of accounts) {
    if (isCreditBalanceAccount(acc)) continue;
    const bal = parseFloat(acc.acc_cash_balance || 0);
    if (!(bal > 0)) continue;
    const key = resolveAccountChannel(acc);
    channels[key] = roundChannel(channels[key] + bal);
  }
  return channels;
}

/** Legacy: single from account + target lines (total from = sum of targets). */
function buildTransferChannelDeltasLegacy(fromAccount, targetItems = [], direction = "CR_TO_DR") {
  const totalOut = targetItems.reduce((s, i) => s + (parseFloat(i.amt) || 0), 0);
  return buildTransferChannelDeltas(
    [{ account: fromAccount, amt: totalOut }],
    targetItems,
    direction
  );
}

module.exports = {
  resolveAccountChannel,
  buildTransferChannelDeltas,
  buildTransferChannelDeltasLegacy,
  formatAccountDisplayName,
  sumDrLiquidOpeningByChannel,
};
