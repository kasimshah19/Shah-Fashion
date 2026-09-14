import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../frontend/.env') });

const connectionString = 'postgresql://postgres.nhcydyrfriweficewdtc:P$ssw0rd!123@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';

async function test() {
  const client = new Client({ connectionString });
  await client.connect();
  const res = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'orders';
  `);
  console.log(res.rows);
  await client.end();
}
test();
