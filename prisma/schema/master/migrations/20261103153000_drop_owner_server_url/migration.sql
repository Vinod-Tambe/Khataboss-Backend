-- Remove legacy deploy URL fields (replaced by own_login_type Online | Offline).

ALTER TABLE "Owner" DROP COLUMN IF EXISTS "own_server_url";
ALTER TABLE "Owner" DROP COLUMN IF EXISTS "own_deploy_mode";

DROP TYPE IF EXISTS "OwnerDeployMode";
