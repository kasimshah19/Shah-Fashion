const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.nhcydyrfriweficewdtc:UCt6ra1KXahARBj1@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres' });
client.connect().then(async () => {
  const enumRes = await client.query("SELECT enum_range(NULL::product_image_type)");
  console.log(enumRes.rows);
  const idRes = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'id'");
  console.log(idRes.rows);
  client.end();
});
