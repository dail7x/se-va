import { createClient, type Client } from '@libsql/client';

let client: Client | null = null;

export function getDb(): Client {
  if (!client) {
    const url = process.env.DATABASE_URL || 'https://db-seva.116.203.118.1.sslip.io';
    const authToken = process.env.DATABASE_AUTH_TOKEN;

    client = createClient({
      url,
      authToken: authToken || undefined,
    });
  }
  return client;
}

export async function initSchema(): Promise<void> {
  const db = getDb();

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
}
