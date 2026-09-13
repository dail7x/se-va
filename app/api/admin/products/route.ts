import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/admin';
import { getAdminProducts } from '../../../../lib/products';
import { getDb } from '../../../../lib/db';

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return NextResponse.json({ error: admin.error }, { status: admin.status });

  try {
    const products = await getAdminProducts();
    return NextResponse.json({ products });
  } catch (err) {
    console.error('Admin products GET error:', err);
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return NextResponse.json({ error: admin.error }, { status: admin.status });

  try {
    const body = await request.json();
    const title = String(body.title || '').trim();
    const categoryName = String(body.category || 'Varios').trim();
    const images: string[] = Array.isArray(body.images)
      ? body.images.map((img: unknown) => String(img || '').trim()).filter(Boolean)
      : [String(body.image || '').trim()].filter(Boolean);
    const price = Number(body.price || 0);

    if (!title || !Number.isFinite(price) || price < 0) {
      return NextResponse.json({ error: 'Título y precio válido son requeridos' }, { status: 400 });
    }

    const db = getDb();
    const catSlug = slugify(categoryName);

    // Upsert category
    let categoryRes = await db.execute({
      sql: 'SELECT id FROM categories WHERE slug = ? LIMIT 1',
      args: [catSlug],
    });

    let categoryId = categoryRes.rows[0]?.id ? String(categoryRes.rows[0].id) : null;
    if (!categoryId) {
      categoryId = crypto.randomUUID();
      await db.execute({
        sql: 'INSERT INTO categories (id, name, slug) VALUES (?, ?, ?)',
        args: [categoryId, categoryName, catSlug],
      });
    }

    const productId = body.id ? String(body.id) : crypto.randomUUID();
    const slug = slugify(body.slug || title);
    const status = String(body.status || 'available');
    const priceCents = Math.round(price * 100);
    const description = String(body.description || '');
    const isFeatured = body.is_featured ? 1 : 0;
    const isPublic = body.is_public !== false ? 1 : 0;
    const publishedAt = isPublic ? new Date().toISOString() : null;

    if (body.id) {
      // Update
      await db.execute({
        sql: `
          UPDATE products
          SET title = ?, slug = ?, description = ?, status = ?, price_cents = ?,
              category_id = ?, is_featured = ?, is_public = ?, published_at = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
        args: [title, slug, description, status, priceCents, categoryId, isFeatured, isPublic, publishedAt, productId],
      });

      // Remove previous images that are not retained or delete and re-insert
      await db.execute({
        sql: 'DELETE FROM product_images WHERE product_id = ?',
        args: [productId],
      });
    } else {
      // Insert
      await db.execute({
        sql: `
          INSERT INTO products (id, title, slug, description, status, price_cents, category_id, is_featured, is_public, published_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [productId, title, slug, description, status, priceCents, categoryId, isFeatured, isPublic, publishedAt],
      });
    }

    // Insert or associate images
    for (const [index, imgPath] of images.entries()) {
      const imgId = crypto.randomUUID();

      // Check if this image was uploaded in stage (via /api/images/[uuid])
      const match = imgPath.match(/\/api\/images\/([a-f0-9-]+)/i);
      if (match && match[1]) {
        const uploadedId = match[1];
        // Update product_id of the staged image
        const updateRes = await db.execute({
          sql: 'UPDATE product_images SET product_id = ?, sort_order = ? WHERE id = ?',
          args: [productId, index, uploadedId],
        });
        if (updateRes.rowsAffected === 0) {
          // If not in stage, insert as reference
          await db.execute({
            sql: 'INSERT INTO product_images (id, product_id, storage_path, sort_order) VALUES (?, ?, ?, ?)',
            args: [imgId, productId, imgPath, index],
          });
        }
      } else {
        // External URL (e.g. unsplash)
        await db.execute({
          sql: 'INSERT INTO product_images (id, product_id, storage_path, sort_order) VALUES (?, ?, ?, ?)',
          args: [imgId, productId, imgPath, index],
        });
      }
    }

    return NextResponse.json({ ok: true, id: productId });
  } catch (err) {
    console.error('Admin products save error:', err);
    return NextResponse.json({ error: 'Error al guardar el producto' }, { status: 500 });
  }
}
