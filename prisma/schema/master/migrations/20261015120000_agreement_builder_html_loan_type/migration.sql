-- Agreement template columns (at_loan_type, at_html) live on tenant databases only.
-- Tenant schema is synced via prisma db push (main schema) — run: npm run sync
-- This migration is a no-op on the master database.

SELECT 1;
