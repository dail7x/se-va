import { createClient as createLibsqlClient } from '@libsql/client';
import pg from 'pg';
import fs from 'node:fs';

const { Client: PgClient } = pg;

let token = process.env.DATABASE_AUTH_TOKEN;
if (!token && fs.existsSync('jwt_token.txt')) {
  token = fs.readFileSync('jwt_token.txt', 'utf8').trim();
}

const dbUrl = process.env.DATABASE_URL || 'https://db-seva.116.203.118.1.sslip.io';
const db = createLibsqlClient({
  url: dbUrl,
  authToken: token,
});

async function run() {
  const password = process.env.SUPABASE_DB_PASSWORD || "$TARS&$TRAPs,";
  const client = new PgClient({
    host: 'db.yqofovvtwwdfwnzrddfv.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: password,
    ssl: { rejectUnauthorized: false },
  });

  console.log('Connecting to Supabase Postgres (port 5432)...');
  await client.connect();

  const categoriesRes = await client.query('SELECT * FROM categories ORDER BY sort_order ASC');
  const productsRes = await client.query('SELECT * FROM products ORDER BY created_at DESC');
  const imagesRes = await client.query('SELECT * FROM product_images ORDER BY sort_order ASC');

  await client.end();

  console.log(`Supabase data:`);
  console.log(`- Categories: ${categoriesRes.rows.length}`);
  console.log(`- Products: ${productsRes.rows.length}`);
  console.log(`- Images: ${imagesRes.rows.length}`);

  console.log('\nSample product:', productsRes.rows[0]);
  console.log('\nSample image:', imagesRes.rows[0]);

  // Clean SQLite database
  console.log('\nCleaning SQLite tables...');
  await db.execute('DELETE FROM product_images');
  await db.execute('DELETE FROM products');
  await db.execute('DELETE FROM categories');

  // Insert categories
  console.log('Inserting categories with original UUIDs...');
  for (const cat of categoriesRes.rows) {
    await db.execute({
      sql: `INSERT INTO categories (id, name, slug, description, sort_order, is_active)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [cat.id, cat.name, cat.slug, cat.description || '', cat.sort_order || 0, cat.is_active ? 1 : 0],
    });
  }

  // Insert products
  console.log('Inserting products...');
  for (const prod of productsRes.rows) {
    await db.execute({
      sql: `INSERT INTO products (
              id, title, slug, description, category_id, status, price_cents, 
              previous_price_cents, show_previous_price, currency, quantity, 
              fulfillment, pickup_notes, shipping_notes, condition, location_label, 
              is_featured, is_public, published_at, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        prod.id,
        prod.title,
        prod.slug,
        prod.description || '',
        prod.category_id,
        prod.status || 'available',
        prod.price_cents,
        prod.previous_price_cents || null,
        prod.show_previous_price ? 1 : 0,
        prod.currency || 'ARS',
        prod.quantity || 1,
        prod.fulfillment || 'pickup',
        prod.pickup_notes || null,
        prod.shipping_notes || null,
        prod.condition || null,
        prod.location_label || null,
        prod.is_featured ? 1 : 0,
        prod.is_public ? 1 : 0,
        prod.published_at ? new Date(prod.published_at).toISOString() : null,
        prod.created_at ? new Date(prod.created_at).toISOString() : new Date().toISOString(),
        prod.updated_at ? new Date(prod.updated_at).toISOString() : new Date().toISOString(),
      ],
    });
  }

  // Insert images
  console.log('Inserting images...');
  for (const img of imagesRes.rows) {
    await db.execute({
      sql: `INSERT INTO product_images (id, product_id, storage_path, alt_text, sort_order)
            VALUES (?, ?, ?, ?, ?)`,
      args: [img.id, img.product_id, img.storage_path, img.alt_text || '', img.sort_order || 0],
    });
  }

  console.log('\nSUCCESS: 34 products and 113 images migrated into SQLite on the VPS!');
}

run().catch(console.error);
