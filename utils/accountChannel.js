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

/**
 * Build signed channel deltas for an inter-account transfer.
 * fromItems / toItems: [{ account, amt }]
 * CR_TO_DR: from side credited (out), to side debited (in) — legacy channel signs.
 * DR_TO_CR: reversed.
 */
function buildTransferChannelDeltas(fromItems = [], toItems = [], direction = "CR_TO_DR") {
  const channels = { cash: 0, bank: 0, online: 0, card: 0 };
  const reverse = String(direction).toUpperCase() === "DR_TO_CR";

  const normalizeList = (items) =>
    (Array.isArray(items) ? items : [])
      .map((row) => ({
        account: row.account || row.fromAccount || row.toAccount,
        amt: parseFloat(row.amt ?? row.mtt_amt) || 0,
      }))
      .filter((row) => row.amt > 0);

  const fromList = normalizeList(fromItems);
  const toList = normalizeList(toItems);

  for (const item of fromList) {
    const key = resolveAccountChannel(item.account);
    channels[key] = roundChannel(channels[key] + (reverse ? item.amt : -item.amt));
  }
  for (const item of toList) {
    const key = resolveAccountChannel(item.account);
    channels[key] = roundChannel(channels[key] + (reverse ? -item.amt : item.amt));
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
};
