import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import process from 'node:process';
import pg from 'pg';
import { createClient } from '@supabase/supabase-js';

const { Client } = pg;

const required = [
  'SUPABASE_DB_HOST',
  'SUPABASE_DB_PASSWORD',
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing ${key}`);
    process.exit(1);
  }
}

const client = new Client({
  host: process.env.SUPABASE_DB_HOST,
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: process.env.SUPABASE_DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

await client.connect();
const migration = await fs.readFile('supabase/migrations/001_initial.sql', 'utf8');
await client.query(migration);
await client.end();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
if (listError) throw listError;

const existingUser = existingUsers.users.find((user) => user.email === process.env.ADMIN_EMAIL);
let userId = existingUser?.id;

if (existingUser) {
  const { data, error } = await supabase.auth.admin.updateUserById(existingUser.id, {
    password: process.env.ADMIN_PASSWORD,
    email_confirm: true,
  });
  if (error) throw error;
  userId = data.user.id;
} else {
  const { data, error } = await supabase.auth.admin.createUser({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    email_confirm: true,
  });
  if (error) throw error;
  userId = data.user.id;
}

if (!userId) throw new Error('Admin user id was not returned');

const { error: profileError } = await supabase
  .from('profiles')
  .upsert({
    id: userId,
    display_name: process.env.ADMIN_EMAIL,
    role: 'admin',
  });

if (profileError) throw profileError;

const baseCategories = ['Casa', 'Muebles', 'Cocina', 'Decoración', 'Varios'];
for (const [index, name] of baseCategories.entries()) {
  const slug = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const { error } = await supabase
    .from('categories')
    .upsert({ name, slug, sort_order: index, is_active: true }, { onConflict: 'slug' });
  if (error) throw error;
}

await supabase
  .from('site_settings')
  .upsert({
    id: 1,
    whatsapp_phone: process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '',
    whatsapp_default_message: 'Hola, me interesa esto de SE VA!',
    pickup_policy: 'Coordinamos retiro o envío por WhatsApp.',
    site_name: 'SE VA!',
  });

console.log(JSON.stringify({
  ok: true,
  adminEmail: process.env.ADMIN_EMAIL,
  passwordFingerprint: crypto.createHash('sha256').update(process.env.ADMIN_PASSWORD).digest('hex').slice(0, 10),
}, null, 2));
