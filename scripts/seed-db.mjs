import { createClient } from '@libsql/client';
import fs from 'node:fs';
import crypto from 'node:crypto';

// Read token
let token = process.env.DATABASE_AUTH_TOKEN;
if (!token && fs.existsSync('jwt_token.txt')) {
  token = fs.readFileSync('jwt_token.txt', 'utf8').trim();
}

const dbUrl = process.env.DATABASE_URL || 'https://db-seva.116.203.118.1.sslip.io';
console.log('Connecting to database:', dbUrl);

const db = createClient({
  url: dbUrl,
  authToken: token,
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
  console.log('Initializing schema...');
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

  console.log('Schema created successfully.');

  // Seed site settings
  await db.execute({
    sql: `INSERT INTO site_settings (id, whatsapp_phone, whatsapp_default_message, pickup_policy, site_name)
          VALUES (1, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET whatsapp_phone = excluded.whatsapp_phone`,
    args: ['5491133147770', 'Hola, me interesa esto de SE VA!', 'Coordinamos retiro o envío por WhatsApp.', 'SE VA!'],
  });

  // Seed categories
  const baseCategories = ['Casa', 'Muebles', 'Cocina', 'Decoración', 'Varios'];
  const categoryMap = new Map();
  for (const [index, name] of baseCategories.entries()) {
    const slug = slugify(name);
    const id = crypto.randomUUID();
    await db.execute({
      sql: `INSERT INTO categories (id, name, slug, sort_order)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(slug) DO UPDATE SET name = excluded.name, sort_order = excluded.sort_order`,
      args: [id, name, slug, index],
    });
    const row = await db.execute({ sql: `SELECT id FROM categories WHERE slug = ?`, args: [slug] });
    categoryMap.set(name, row.rows[0].id);
  }

  // Seed default admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'dailmarin@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin1234';
  const adminHash = hashPassword(adminPassword);
  await db.execute({
    sql: `INSERT INTO admin_users (id, email, password_hash, role)
          VALUES (?, ?, ?, 'admin')
          ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash`,
    args: [crypto.randomUUID(), adminEmail, adminHash],
  });
  console.log('Admin user seeded:', adminEmail);

  // Seed demo products if empty
  const countRes = await db.execute('SELECT count(*) as count FROM products');
  const count = Number(countRes.rows[0].count);
  console.log(`Current products count in DB: ${count}`);

  if (count === 0) {
    console.log('Seeding initial products...');
    const demo = [
      {
        id: 'lampara-luna',
        title: 'Lámpara Luna',
        category: 'Casa',
        price: 30000,
        status: 'available',
        images: [
          'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85',
          'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=85',
          'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=85',
        ],
        description: 'Una luz suave y cálida para noches de lectura y sobremesas largas. Estructura de cerámica esmaltada con tulipa opalina intacta.',
        featured: 1,
      },
      {
        id: 'sillon-mostaza',
        title: 'Sillón mostaza',
        category: 'Muebles',
        price: 85000,
        status: 'available',
        images: [
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85',
          'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=85',
        ],
        description: 'Cómodo, con personalidad y listo para una nueva casa. Tapizado en pana aterciopelada color mostaza en excelente estado.',
        featured: 1,
      },
      {
        id: 'camara-analogica',
        title: 'Cámara analógica',
        category: 'Varios',
        price: 45000,
        status: 'available',
        images: [
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=85',
          'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=85',
        ],
        description: 'Para guardar momentos que no necesitan filtro. Mecánica pura de los años 70 con lente 50mm f/1.8 limpio.',
        featured: 1,
      },
      {
        id: 'vajilla-floreada',
        title: 'Vajilla floreada',
        category: 'Cocina',
        price: 22000,
        status: 'available',
        images: [
          'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=1200&q=85',
          'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=85',
        ],
        description: 'Seis platos hondos y seis playos que hacen que cualquier mesa se sienta especial y de domingo en familia.',
        featured: 0,
      },
      {
        id: 'espejo-sol',
        title: 'Espejo sol vintage',
        category: 'Decoración',
        price: 38000,
        status: 'available',
        images: [
          'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=85',
          'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=85',
        ],
        description: 'Un pequeño sol dorado para iluminar una pared vacía. Marco de metal dorado envejecido con pátina original.',
        featured: 0,
      },
      {
        id: 'radio-madera',
        title: 'Radio de madera',
        category: 'Varios',
        price: 18000,
        status: 'sold',
        images: [
          'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?auto=format&fit=crop&w=1200&q=85',
          'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=85',
        ],
        description: 'Todavía no sabemos si suena mejor o se ve mejor. Gabinete de nogal pulido con dial iluminado.',
        featured: 0,
      },
      {
        id: 'mesa-ratona',
        title: 'Mesa ratona de petiribí',
        category: 'Muebles',
        price: 52000,
        status: 'available',
        images: [
          'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=85',
          'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=1200&q=85',
        ],
        description: 'Líneas limpias, madera maciza de petiribí recuperada con acabado al aceite natural.',
        featured: 0,
      },
      {
        id: 'cafetera-italiana',
        title: 'Cafetera italiana esmaltada',
        category: 'Cocina',
        price: 16000,
        status: 'available',
        images: [
          'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85',
          'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85',
        ],
        description: 'Para arrancar las mañanas con aroma a café de verdad. Esmaltado retro color crema con pomo de madera.',
        featured: 0,
      },
    ];

    for (const item of demo) {
      const prodId = crypto.randomUUID();
      const catId = categoryMap.get(item.category) || categoryMap.get('Varios');

      await db.execute({
        sql: `INSERT INTO products (id, title, slug, description, category_id, status, price_cents, is_featured, is_public)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        args: [prodId, item.title, item.id, item.description, catId, item.status, item.price * 100, item.featured],
      });

      for (const [idx, img] of item.images.entries()) {
        await db.execute({
          sql: `INSERT INTO product_images (id, product_id, storage_path, sort_order)
                VALUES (?, ?, ?, ?)`,
          args: [crypto.randomUUID(), prodId, img, idx],
        });
      }
    }
    console.log(`Seeded ${demo.length} products with images.`);
  }

  console.log('Seeding complete!');
}

main().catch(console.error);
