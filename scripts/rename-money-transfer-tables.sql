-- Optional manual migration if money_transaction / money_transaction_item already exist.
-- Run on tenant DB only when upgrading from the old table names.
-- Fresh installs: use prisma db push only.

-- ALTER TABLE money_transaction RENAME TO money_from_transaction;
-- ALTER TABLE money_transaction_item RENAME TO money_to_transaction;
-- ALTER TABLE money_to_transaction RENAME COLUMN mti_mt_id TO mtt_mtf_id;
-- (Then rename all mt_* / mti_* columns to mtf_* / mtt_* via Prisma db push or manual ALTER.)
