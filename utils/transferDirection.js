"use strict";

const VALID_TRANSFER_DIRECTIONS = new Set([
  "CR_TO_DR",
  "DR_TO_CR",
  "CR_TO_CR",
  "DR_TO_DR",
]);

function normalizeTransferDirection(raw) {
  const d = String(raw || "CR_TO_DR").toUpperCase();
  return VALID_TRANSFER_DIRECTIONS.has(d) ? d : "CR_TO_DR";
}

/**
 * Account balance types (from/to) and journal CR/DR sides per direction.
 */
function getTransferDirectionConfig(direction) {
  const d = normalizeTransferDirection(direction);
  const byDirection = {
    CR_TO_DR: { fromType: "CR", toType: "DR", fromJournal: "CR", toJournal: "DR" },
    DR_TO_CR: { fromType: "DR", toType: "CR", fromJournal: "DR", toJournal: "CR" },
    CR_TO_CR: { fromType: "CR", toType: "CR", fromJournal: "DR", toJournal: "CR" },
    DR_TO_DR: { fromType: "DR", toType: "DR", fromJournal: "CR", toJournal: "DR" },
  };
  return { direction: d, ...byDirection[d] };
}

function formatTransferDirectionLabel(direction) {
  return normalizeTransferDirection(direction).split("_").join(" → ");
}

module.exports = {
  VALID_TRANSFER_DIRECTIONS,
  normalizeTransferDirection,
  getTransferDirectionConfig,
  formatTransferDirectionLabel,
};
