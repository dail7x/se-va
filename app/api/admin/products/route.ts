import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/admin';
import { getAdminProducts } from '../../../../lib/products';

function slugify(value: string) {
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

  const products = await getAdminProducts();
  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return NextResponse.json({ error: admin.error }, { status: admin.status });

  const body = await request.json();
  const title = String(body.title || '').trim();
  const categoryName = String(body.category || 'Varios').trim();
  const image = String(body.image || '').trim();
  const price = Number(body.price || 0);

  if (!title || !Number.isFinite(price) || price < 0) {
    return NextResponse.json({ error: 'Title and valid price are required' }, { status: 400 });
  }

  const { data: category, error: categoryError } = await admin.supabase
    .from('categories')
    .upsert({ name: categoryName, slug: slugify(categoryName), is_active: true }, { onConflict: 'slug' })
    .select('id')
    .single();

  if (categoryError) return NextResponse.json({ error: categoryError.message }, { status: 400 });

  const payload = {
    title,
    slug: slugify(body.slug || title),
    description: String(body.description || ''),
    status: body.status || 'available',
    price_cents: Math.round(price * 100),
    category_id: category.id,
    is_featured: Boolean(body.is_featured),
    is_public: body.is_public ?? true,
    published_at: body.is_public === false ? null : new Date().toISOString(),
  };

  const query = body.id
    ? admin.supabase.from('products').update(payload).eq('id', body.id).select('id').single()
    : admin.supabase.from('products').insert(payload).select('id').single();

  const { data: product, error: productError } = await query;
  if (productError) return NextResponse.json({ error: productError.message }, { status: 400 });

  if (image) {
    const { data: existing } = await admin.supabase
      .from('product_images')
      .select('id')
      .eq('product_id', product.id)
      .order('sort_order', { ascending: true })
      .limit(1)
      .maybeSingle();

    const imagePayload = { product_id: product.id, storage_path: image, alt_text: title, sort_order: 0 };
    if (existing?.id) {
      await admin.supabase.from('product_images').update(imagePayload).eq('id', existing.id);
    } else {
      await admin.supabase.from('product_images').insert(imagePayload);
    }
  }

  return NextResponse.json({ ok: true });
}
