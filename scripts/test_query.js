const { Client } = require("pg");
const { BASE_URL } = require("../config/db");

async function run() {
  const masterUrl = `${BASE_URL}/master`;
  console.log("Connecting to master database:", masterUrl);
  const client = new Client({ connectionString: masterUrl });
  try {
    await client.connect();
    
    // 1. Get owners
    const ownersRes = await client.query('SELECT * FROM "Owner"');
    console.log("Owners in master database:");
    console.log(ownersRes.rows);

    for (const owner of ownersRes.rows) {
      const ownDbUrl = `${BASE_URL}/${owner.own_db}`;
      console.log(`\nConnecting to owner database: ${owner.own_db} (${ownDbUrl})`);
      const ownerClient = new Client({ connectionString: ownDbUrl });
      try {
        await ownerClient.connect();
        
        // Count finances, girvis, journals
        const financesCount = await ownerClient.query('SELECT COUNT(*) FROM "finance"');
        const girviCount = await ownerClient.query('SELECT COUNT(*) FROM "girvi"');
        const journalCount = await ownerClient.query('SELECT COUNT(*) FROM "journal"');
        console.log(`Counts: Finance=${financesCount.rows[0].count}, Girvi=${girviCount.rows[0].count}, Journal=${journalCount.rows[0].count}`);

        // Fetch last 10 journals
        const journals = await ownerClient.query('SELECT * FROM "journal" ORDER BY jrnl_created_at DESC LIMIT 10');
        console.log("Latest 10 Journal entries:");
        console.log(journals.rows);

        // Fetch some girvis
        const girvis = await ownerClient.query('SELECT girv_id, girv_loan_no, girv_prin_amt, girv_status, girv_other_info, girv_created_at FROM "girvi" LIMIT 5');
        console.log("Girvi loans:");
        console.log(girvis.rows);

      } catch (err) {
        console.error(`Error querying owner DB ${owner.own_db}:`, err.message);
      } finally {
        await ownerClient.end();
      }
    }

  } catch (err) {
    console.error("Error connecting to master:", err.message);
  } finally {
    await client.end();
  }
}

run();
