const accountController = require('../modules/account/controller/account.controller');
const { BASE_URL } = require('../config/db');
const { Client } = require('pg');

async function verify() {
  const masterClient = new Client({ connectionString: `${BASE_URL}/master` });
  await masterClient.connect();
  const res = await masterClient.query('SELECT own_db, own_id FROM "Owner" LIMIT 1');
  const user = res.rows[0];
  await masterClient.end();

  const req = {
    user: { own_db: user.own_db, own_id: user.own_id, own_login_id: 'Admin' },
    params: { uuid: '' }
  };

  const resMock = {
    status: function(code) { this.statusCode = code; return this; },
    json: function(data) { this.data = data; return this; }
  };

  // 1. Find a system account
  const tenantClient = new Client({ connectionString: `${BASE_URL}/${user.own_db}` });
  await tenantClient.connect();
  const sysAccRes = await tenantClient.query('SELECT acc_uuid, acc_name FROM "Account" WHERE acc_is_system = true AND acc_is_deleted = false LIMIT 1');
  const sysAcc = sysAccRes.rows[0];
  
  if (sysAcc) {
     console.log(`Testing deletion of system account: ${sysAcc.acc_name}`);
     req.params.uuid = sysAcc.acc_uuid;
     await accountController.deleteAccount(req, resMock);
     console.log(`Status: ${resMock.statusCode}, Message: ${JSON.stringify(resMock.data)}`);
  } else {
     console.log('No system account found for testing.');
  }

  // 2. Test manual account deletion
  const manualAccRes = await tenantClient.query('SELECT acc_uuid, acc_name FROM "Account" WHERE acc_is_system = false AND acc_is_deleted = false LIMIT 1');
  const manualAcc = manualAccRes.rows[0];
  if (manualAcc) {
      console.log(`Testing deletion of manual account: ${manualAcc.acc_name}`);
      req.params.uuid = manualAcc.acc_uuid;
      await accountController.deleteAccount(req, resMock);
      console.log(`Status: ${resMock.statusCode}, Message: ${JSON.stringify(resMock.data)}`);
  }

  await tenantClient.end();
}

verify().catch(console.error);
