const { Client } = require('pg');
const fs = require('fs');

let connStr = 'postgresql://postgres.cjhplbhyhhfvsvapgczz:Edworld_2026_Secure%21@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres';
try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  for (const line of envContent.split('\n')) {
    if (line.startsWith('DATABASE_URL=')) {
      connStr = line.split('=')[1].trim().replace(/^["']|["']$/g, '');
    }
  }
} catch (e) {}

async function main() {
  const client = new Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } });
  await client.connect();
  const res = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles' ORDER BY column_name");
  console.log(res.rows.map(r => `${r.column_name}: ${r.data_type}`));
  await client.end();
}

main().catch(console.error);
