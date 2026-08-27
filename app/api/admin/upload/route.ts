import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { requireAdmin } from '../../../../lib/admin';

const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'product-images';
const maxSize = 5 * 1024 * 1024;
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

function extensionFor(type: string) {
  if (type === 'image/png') return 'png';
  if (type === 'image/webp') return 'webp';
  if (type === 'image/gif') return 'gif';
  return 'jpg';
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return NextResponse.json({ error: admin.error }, { status: admin.status });

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
  }

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json({ error: 'Usá JPG, PNG, WebP o GIF.' }, { status: 400 });
  }

  if (file.size > maxSize) {
    return NextResponse.json({ error: 'La imagen no puede superar 5 MB.' }, { status: 400 });
  }

  const path = `products/${crypto.randomUUID()}.${extensionFor(file.type)}`;
  const { error } = await admin.supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const { data } = admin.supabase.storage.from(bucket).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl, path });
}
