const { Client } = require('pg');

async function checkDb() {
  const masterUrl = 'postgresql://postgres:Sai@5166@localhost:5432/master';
  const masterClient = new Client({ connectionString: masterUrl });
  await masterClient.connect();
  const masterOwners = await masterClient.query('SELECT own_id, own_uuid, own_db FROM "Owner"');
  console.log('Master Owners:', masterOwners.rows);
  await masterClient.end();

  for (const owner of masterOwners.rows) {
    const tenantUrl = `postgresql://postgres:Sai@5166@localhost:5432/${owner.own_db}`;
    console.log(`Checking Tenant DB: ${owner.own_db}...`);
    try {
      const tenantClient = new Client({ connectionString: tenantUrl });
      await tenantClient.connect();
      const tenantOwners = await tenantClient.query('SELECT own_id, own_uuid, own_db FROM "Owner"');
      console.log(`Tenant ${owner.own_db} Owners:`, tenantOwners.rows);
      await tenantClient.end();
    } catch (e) {
      console.error(`Error checking ${owner.own_db}:`, e.message);
    }
  }
}

checkDb();
