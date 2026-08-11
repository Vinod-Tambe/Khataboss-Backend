"use strict";

/**
 * Ensure a girvi loan exists and is ACTIVE before deposit/release/auction/add-principal.
 */
function assertActiveLoan(girvi, operation = "perform this operation") {
  if (!girvi) {
    throw new Error("Girvi (Loan) record not found");
  }
  if (girvi.girv_status !== "ACTIVE") {
    throw new Error(
      `Loan is ${girvi.girv_status}. Only ACTIVE loans can ${operation}.`
    );
  }
}

module.exports = {
  assertActiveLoan,
};
