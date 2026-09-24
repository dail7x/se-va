import { createClient } from '@libsql/client';
import crypto from 'node:crypto';
import { products, categories as rawCategories } from '../components/data.ts';

const TURSO_URL = 'libsql://venezuelajuntos-dail7x.aws-us-east-2.turso.io';
const TURSO_AUTH_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODIzNjc1ODQsImlkIjoiMDE5ZWZkNjItZTEwMS03Y2E3LWE5NmUtOWE3N2QwZmZiZGMzIiwicmlkIjoiYjQ4NDZmYjUtNDEwYS00MzI1LTkwODEtZTQ0ZWIxMGNlNGEwIn0.6ksJDCYQ4iN5NLl6_pgg3vY3QIpxmbBcWgIludA5iALZyDQ69DdfvivBIus0M92MMBH2SnTZBOCUPeypgsvlBg';

const db = createClient({
  url: TURSO_URL,
  authToken: TURSO_AUTH_TOKEN,
});

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('Connecting to Turso...');

  console.log('Creating schema for SE VA!...');
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL DEFAULT '',
      category_id TEXT REFERENCES categories(id),
      status TEXT NOT NULL DEFAULT 'available',
      price_cents INTEGER NOT NULL CHECK(price_cents >= 0),
      previous_price_cents INTEGER,
      show_previous_price INTEGER NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'ARS',
      quantity INTEGER NOT NULL DEFAULT 1,
      fulfillment TEXT NOT NULL DEFAULT 'pickup',
      pickup_notes TEXT,
      shipping_notes TEXT,
      condition TEXT,
      location_label TEXT,
      is_featured INTEGER NOT NULL DEFAULT 0,
      is_public INTEGER NOT NULL DEFAULT 1,
      published_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      storage_path TEXT NOT NULL,
      image_data TEXT,
      mime_type TEXT DEFAULT 'image/webp',
      alt_text TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY CHECK(id = 1),
      whatsapp_phone TEXT NOT NULL,
      whatsapp_default_message TEXT,
      pickup_policy TEXT,
      shipping_policy TEXT,
      site_name TEXT DEFAULT 'SE VA!',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('Schema created.');

  // Site settings
  console.log('Upserting site settings...');
  await db.execute({
    sql: `INSERT INTO site_settings (id, whatsapp_phone, whatsapp_default_message, pickup_policy, site_name)
          VALUES (1, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET whatsapp_phone = excluded.whatsapp_phone`,
    args: ['5491133147770', 'Hola, me interesa esto de SE VA!', 'Coordinamos retiro o envío por WhatsApp.', 'SE VA!'],
  });

  // Admin user
  console.log('Upserting admin user...');
  const adminEmail = process.env.ADMIN_EMAIL || 'dailmarin@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || '20827286';
  const adminHash = hashPassword(adminPassword);
  await db.execute({
    sql: `INSERT INTO admin_users (id, email, password_hash, role)
          VALUES (?, ?, ?, 'admin')
          ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash`,
    args: [crypto.randomUUID(), adminEmail, adminHash],
  });

  // Categories
  console.log('Upserting categories...');
  const categoryNames = ['Casa', 'Muebles', 'Cocina', 'Decoración', 'Varios'];
  const categoryMap = new Map();
  for (let i = 0; i < categoryNames.length; i++) {
    const name = categoryNames[i];
    const slug = slugify(name);
    const existing = await db.execute({ sql: `SELECT id FROM categories WHERE slug = ?`, args: [slug] });
    let catId;
    if (existing.rows.length > 0) {
      catId = String(existing.rows[0].id);
    } else {
      catId = crypto.randomUUID();
      await db.execute({
        sql: `INSERT INTO categories (id, name, slug, sort_order) VALUES (?, ?, ?, ?)`,
        args: [catId, name, slug, i],
      });
    }
    categoryMap.set(name, catId);
  }

  // Ensure upload_stage placeholder exists in products
  await db.execute({
    sql: `INSERT OR IGNORE INTO products (id, title, slug, description, price_cents, status, is_public)
          VALUES ('upload_stage', 'Upload Stage', 'upload-stage-internal', '', 0, 'draft', 0)`,
    args: [],
  });

  // Seed 39 products
  console.log(`Seeding ${products.length} products...`);
  for (const p of products) {
    const slug = p.id;
    const catId = categoryMap.get(p.category) || categoryMap.get('Varios');
    const priceCents = Math.round((p.price || 0) * 100);
    const productId = crypto.randomUUID();

    // Check if product exists by slug
    const prodRow = await db.execute({ sql: `SELECT id FROM products WHERE slug = ?`, args: [slug] });
    let currentProdId = productId;
    if (prodRow.rows.length > 0) {
      currentProdId = String(prodRow.rows[0].id);
      await db.execute({
        sql: `UPDATE products SET 
                title = ?, description = ?, category_id = ?, status = ?, 
                price_cents = ?, is_featured = ?, is_public = ?
              WHERE id = ?`,
        args: [
          p.title,
          p.description || '',
          catId,
          p.status || 'available',
          priceCents,
          p.featured ? 1 : 0,
          p.isPublic !== false ? 1 : 0,
          currentProdId,
        ],
      });
    } else {
      await db.execute({
        sql: `INSERT INTO products (
                id, title, slug, description, category_id, status, price_cents, 
                currency, quantity, fulfillment, is_featured, is_public
              ) VALUES (?, ?, ?, ?, ?, ?, ?, 'ARS', 1, 'pickup', ?, ?)`,
        args: [
          currentProdId,
          p.title,
          slug,
          p.description || '',
          catId,
          p.status || 'available',
          priceCents,
          p.featured ? 1 : 0,
          p.isPublic !== false ? 1 : 0,
        ],
      });
    }

    // Insert image records
    const imgs = p.images && p.images.length > 0 ? p.images : (p.image ? [p.image] : []);
    for (let sortOrder = 0; sortOrder < imgs.length; sortOrder++) {
      const imgPath = imgs[sortOrder];
      // imgPath might be "/api/images/<uuid>" or external URL
      let imageId = crypto.randomUUID();
      const match = imgPath.match(/\/api\/images\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        imageId = match[1];
      }

      await db.execute({
        sql: `INSERT INTO product_images (id, product_id, storage_path, sort_order)
              VALUES (?, ?, ?, ?)
              ON CONFLICT(id) DO UPDATE SET sort_order = excluded.sort_order`,
        args: [imageId, currentProdId, imgPath, sortOrder],
      });
    }
  }

  const finalCount = await db.execute('SELECT count(*) as c FROM products WHERE id != "upload_stage"');
  const imageCount = await db.execute('SELECT count(*) as c FROM product_images');
  console.log(`\n========================================`);
  console.log(`Turso database successfully initialized!`);
  console.log(`Products: ${finalCount.rows[0].c}`);
  console.log(`Images registered: ${imageCount.rows[0].c}`);
  console.log(`========================================\n`);
}

main().catch(console.error);
