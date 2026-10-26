const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const crypto = require('crypto');

let dbUrl = '';
try {
  const envText = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
  for (const line of envText.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('DATABASE_URL=')) {
      dbUrl = trimmed.substring('DATABASE_URL='.length).trim().replace(/^["']|["']$/g, '');
    }
  }
} catch (e) {
  console.log('Could not read .env.local, using fallback');
}

if (!dbUrl) {
  dbUrl = 'postgres://postgres.wgyscapdywroefsjenno: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@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres';
}

const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

const ACCOUNTS = [
  {
    email: 'test@edworld.co.in',
    password: 'TestPassword@2026',
    name: 'EdWorld Test User',
    targetRole: 'Full-Stack Software Engineer',
    careerStage: 'college',
  },
  {
    email: 'kolluruadarsh06@gmail.com',
    password: 'AdarshPassword@2026',
    name: 'Adarsh Kolluru',
    targetRole: 'Full-Stack Software Engineer',
    careerStage: 'working_professional',
  }
];

async function seedUser(client, account) {
  console.log(`\n--- Provisioning: ${account.email} ---`);
  
  // 1. Check if user already exists
  const userCheck = await client.query(
    'SELECT id, email FROM auth.users WHERE LOWER(email) = LOWER($1)',
    [account.email]
  );

  let userId;
  if (userCheck.rows.length === 0) {
    userId = crypto.randomUUID();
    console.log(`Creating new user with ID: ${userId}...`);
    await client.query(
      `INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at
      ) VALUES (
        '00000000-0000-4000-a000-000000000000',
        $1,
        'authenticated',
        'authenticated',
        $2,
        crypt($3, gen_salt('bf', 10)),
        NOW(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        json_build_object('name', $4::text, 'full_name', $4::text),
        NOW(),
        NOW()
      )`,
      [userId, account.email, account.password, account.name]
    );
    console.log(`[PASS] Created user in auth.users.`);
  } else {
    userId = userCheck.rows[0].id;
    console.log(`User exists with ID: ${userId}. Updating password...`);
    await client.query(
      `UPDATE auth.users
       SET encrypted_password = crypt($1, gen_salt('bf', 10)),
           email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
           raw_user_meta_data = json_build_object('name', $2::text, 'full_name', $2::text),
           updated_at = NOW()
       WHERE id = $3`,
      [account.password, account.name, userId]
    );
    console.log(`[PASS] Password updated successfully.`);
  }

  // 2. Ensure profile exists in public.profiles
  await client.query(
    `INSERT INTO public.profiles (
      id, email, name, target_role, career_stage, created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      name = EXCLUDED.name,
      target_role = EXCLUDED.target_role,
      career_stage = EXCLUDED.career_stage,
      updated_at = NOW()`,
    [userId, account.email, account.name, account.targetRole, account.careerStage]
  );
  console.log(`[PASS] Profile synced in public.profiles.`);

  return userId;
}

async function main() {
  const client = await pool.connect();
  console.log('Connected to Supabase PostgreSQL database.');

  try {
    for (const acc of ACCOUNTS) {
      await seedUser(client, acc);
    }
    console.log('\n=================================================');
    console.log('ALL TEST USER ACCOUNTS SUCCESSFULLY CONFIGURED!');
    console.log('=================================================');
  } catch (err) {
    console.error('Account seeding error:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
