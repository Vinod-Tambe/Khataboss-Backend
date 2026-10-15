-- Run against each tenant DB if not using `npm run sync` / prisma db push.
-- Adds agreement builder columns and updates unique constraint.

ALTER TABLE "agreement_templates" ADD COLUMN IF NOT EXISTS "at_loan_type" "FormTemplateLoanType" NOT NULL DEFAULT 'secured';
ALTER TABLE "agreement_templates" ADD COLUMN IF NOT EXISTS "at_html" TEXT;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'agreement_templates_at_firm_id_at_type_key'
  ) THEN
    ALTER TABLE "agreement_templates" DROP CONSTRAINT "agreement_templates_at_firm_id_at_type_key";
  END IF;
END $$;

DROP INDEX IF EXISTS "agreement_templates_at_firm_id_at_type_at_loan_type_key";
CREATE UNIQUE INDEX "agreement_templates_at_firm_id_at_type_at_loan_type_key"
  ON "agreement_templates" ("at_firm_id", "at_type", "at_loan_type");
