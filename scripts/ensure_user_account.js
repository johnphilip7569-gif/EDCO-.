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

async function main() {
  const client = await pool.connect();
  console.log('Connected to PostgreSQL database.');

  try {
    const emailToEnsure = 'kolluruadarsh06@gmail.com';
    const name = 'Adarsh Kolluru';

    // 1. Check if user exists in auth.users
    const userRes = await client.query(
      'SELECT id, email FROM auth.users WHERE LOWER(email) = LOWER($1)',
      [emailToEnsure]
    );

    let userId;
    if (userRes.rows.length === 0) {
      console.log(`User ${emailToEnsure} not found in auth.users. Creating user record...`);
      userId = crypto.randomUUID();

      // Insert into auth.users with crypt password placeholder
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
          crypt('TemporaryPassword123!', gen_salt('bf', 10)),
          NOW(),
          '{"provider":"email","providers":["email"]}'::jsonb,
          json_build_object('name', $3::text, 'full_name', $3::text),
          NOW(),
          NOW()
        )`,
        [userId, emailToEnsure, name]
      );
      console.log(`[OK] Created user in auth.users with ID: ${userId}`);
    } else {
      userId = userRes.rows[0].id;
      console.log(`[OK] User ${emailToEnsure} already exists in auth.users with ID: ${userId}`);
    }

    // 2. Ensure profile exists in public.profiles
    const profRes = await client.query(
      'SELECT id, name FROM public.profiles WHERE id = $1',
      [userId]
    );

    if (profRes.rows.length === 0) {
      console.log(`Profile not found for ID ${userId}. Inserting profile...`);
      await client.query(
        `INSERT INTO public.profiles (
          id, email, name, target_role, career_stage, created_at, updated_at
        ) VALUES ($1, $2, $3, 'Full-Stack Software Engineer', 'PROFESSIONAL', NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
          email = EXCLUDED.email,
          name = EXCLUDED.name`,
        [userId, emailToEnsure, name]
      );
      console.log(`[OK] Created profile for ${emailToEnsure}`);
    } else {
      console.log(`[OK] Profile already exists for ${emailToEnsure}`);
    }

    // Verify token table exists
    const tokenTableCheck = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'password_reset_tokens'"
    );
    console.log('[OK] password_reset_tokens table status:', tokenTableCheck.rows.length > 0 ? 'Ready' : 'Missing');

    console.log('\nAll user accounts successfully ensured and ready for password reset.');
  } catch (err) {
    console.error('Error ensuring user accounts:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
