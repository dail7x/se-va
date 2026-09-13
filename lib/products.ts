import { unstable_noStore as noStore } from 'next/cache';
import { products as demoProducts, type Product } from '../components/data';
import { getDb } from './db';

type ImageRow = {
  id: string;
  storage_path: string;
  sort_order: number;
};

export async function getPublicProducts(): Promise<Product[]> {
  noStore();

  try {
    const db = getDb();
    const productsRes = await db.execute(`
      SELECT 
        p.id, p.title, p.slug, p.description, p.status, p.price_cents, 
        p.is_featured, p.is_public, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_public = 1 AND p.status NOT IN ('draft', 'archived')
      ORDER BY p.created_at DESC
    `);

    if (!productsRes.rows.length) {
      return demoProducts;
    }

    const productIds = productsRes.rows.map((row) => String(row.id));
    const placeholders = productIds.map(() => '?').join(',');

    const imagesRes = await db.execute({
      sql: `
        SELECT id, product_id, storage_path, sort_order 
        FROM product_images 
        WHERE product_id IN (${placeholders})
        ORDER BY sort_order ASC
      `,
      args: productIds,
    });

    const imageMap = new Map<string, string[]>();
    for (const imgRow of imagesRes.rows) {
      const prodId = String(imgRow.product_id);
      const list = imageMap.get(prodId) || [];
      list.push(String(imgRow.storage_path));
      imageMap.set(prodId, list);
    }

    const fallbackImage = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=85';

    return productsRes.rows.map((row) => {
      const prodId = String(row.id);
      const images = imageMap.get(prodId) || [];

      return {
        id: String(row.slug),
        title: String(row.title),
        category: String(row.category_name || 'Varios'),
        price: Math.round(Number(row.price_cents) / 100),
        status: (String(row.status) as Product['status']) || 'available',
        image: images[0] || fallbackImage,
        images: images.length ? images : [fallbackImage],
        description: String(row.description || ''),
        featured: Boolean(row.is_featured),
        isPublic: Boolean(row.is_public),
      };
    });
  } catch (err) {
    console.error('Error fetching products from SQLite:', err);
    return demoProducts;
  }
}

export async function getPublicProduct(slug: string): Promise<Product | null> {
  const all = await getPublicProducts();
  return all.find((product) => product.id === slug) || null;
}

export async function getAdminProducts() {
  const db = getDb();
  const productsRes = await db.execute(`
    SELECT 
      p.id, p.title, p.slug, p.description, p.status, p.price_cents, 
      p.is_featured, p.is_public, p.category_id, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `);

  const productIds = productsRes.rows.map((row) => String(row.id));
  const imageMap = new Map<string, { id: string; storage_path: string; sort_order: number }[]>();

  if (productIds.length > 0) {
    const placeholders = productIds.map(() => '?').join(',');
    const imagesRes = await db.execute({
      sql: `
        SELECT id, product_id, storage_path, sort_order 
        FROM product_images 
        WHERE product_id IN (${placeholders})
        ORDER BY sort_order ASC
      `,
      args: productIds,
    });

    for (const imgRow of imagesRes.rows) {
      const prodId = String(imgRow.product_id);
      const list = imageMap.get(prodId) || [];
      list.push({
        id: String(imgRow.id),
        storage_path: String(imgRow.storage_path),
        sort_order: Number(imgRow.sort_order || 0),
      });
      imageMap.set(prodId, list);
    }
  }

  return productsRes.rows.map((row) => {
    const prodId = String(row.id);
    return {
      id: prodId,
      title: String(row.title),
      slug: String(row.slug),
      description: String(row.description || ''),
      status: String(row.status),
      price_cents: Number(row.price_cents),
      is_featured: Boolean(row.is_featured),
      is_public: Boolean(row.is_public),
      category_id: row.category_id ? String(row.category_id) : null,
      categories: row.category_name ? { name: String(row.category_name) } : null,
      product_images: imageMap.get(prodId) || [],
    };
  });
}
