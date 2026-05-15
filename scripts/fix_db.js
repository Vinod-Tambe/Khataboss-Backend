const { Client } = require('pg');

async function fixDb() {
  const masterUrl = 'postgresql://postgres:Sai@5166@localhost:5432/master';
  const masterClient = new Client({ connectionString: masterUrl });
  await masterClient.connect();
  const masterOwners = await masterClient.query('SELECT own_id, own_uuid, own_db FROM "Owner"');
  console.log('Master Owners:', masterOwners.rows);
  await masterClient.end();

  for (const owner of masterOwners.rows) {
    const tenantUrl = `postgresql://postgres:Sai@5166@localhost:5432/${owner.own_db}`;
    console.log(`Processing Tenant DB: ${owner.own_db}...`);
    try {
      const tenantClient = new Client({ connectionString: tenantUrl });
      await tenantClient.connect();
      
      const tenantOwners = await tenantClient.query('SELECT own_id, own_uuid FROM "Owner"');
      if (tenantOwners.rows.length === 0) {
        console.warn(`No owner in ${owner.own_db}!`);
      } else {
        const tenantOwner = tenantOwners.rows[0];
        if (tenantOwner.own_id !== owner.own_id) {
          console.log(`Mismatch in ${owner.own_db}: Master ID ${owner.own_id} vs Tenant ID ${tenantOwner.own_id}. Fixing...`);
          
          // Disable constraints temporarily if needed, but since it's just one owner and potentially no firms, we can just update.
          // However, if there are firms/accounts, we need to update them too.
          
          await tenantClient.query('BEGIN');
          try {
            // Update all tables that reference own_id
            const tables = ['Firm', 'Account', 'User', 'finance', 'finance_trans', 'finance_money_trans', 'journal', 'journal_trans'];
            for (const table of tables) {
              const idField = (table === 'Owner') ? 'own_id' : 
                              (table === 'Firm') ? 'firm_own_id' :
                              (table === 'Account') ? 'acc_own_id' :
                              (table === 'User') ? 'user_own_id' :
                              (table === 'finance') ? 'fin_own_id' :
                              (table === 'finance_trans') ? 'ft_own_id' :
                              (table === 'finance_money_trans') ? 'fm_own_id' :
                              (table === 'journal') ? 'jrnl_own_id' :
                              (table === 'journal_trans') ? 'jrtr_own_id' : null;
              
              if (idField) {
                 await tenantClient.query(`UPDATE "${table}" SET "${idField}" = $1 WHERE "${idField}" = $2`, [owner.own_id, tenantOwner.own_id]);
              }
            }
            
            // Finally update the Owner table itself
            await tenantClient.query('UPDATE "Owner" SET "own_id" = $1 WHERE "own_id" = $2', [owner.own_id, tenantOwner.own_id]);
            
            await tenantClient.query('COMMIT');
            console.log(`✅  Fixed ${owner.own_db}`);
          } catch (err) {
            await tenantClient.query('ROLLBACK');
            console.error(`❌  Failed to fix ${owner.own_db}:`, err.message);
          }
        } else {
          console.log(`✅  ${owner.own_db} is consistent.`);
        }
      }
      
      await tenantClient.end();
    } catch (e) {
      console.error(`Error processing ${owner.own_db}:`, e.message);
    }
  }
}

fixDb();
