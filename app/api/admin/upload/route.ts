import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/admin';
import { getDb } from '../../../../lib/db';

const maxSize = 8 * 1024 * 1024; // 8MB safety limit (frontend will compress to ~100KB)

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No se subió ningún archivo' }, { status: 400 });
    }

    if (file.size > maxSize) {
      return NextResponse.json({ error: 'La imagen no puede superar 8 MB' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const mimeType = file.type || 'image/webp';

    const imageId = crypto.randomUUID();
    const storagePath = `/api/images/${imageId}`;

    const db = getDb();

    // Ensure upload_stage placeholder exists in products to satisfy foreign key constraint
    await db.execute({
      sql: `
        INSERT OR IGNORE INTO products (id, title, slug, description, price_cents, status, is_public)
        VALUES ('upload_stage', 'Upload Stage', 'upload-stage-internal', '', 0, 'draft', 0)
      `,
      args: [],
    });

    // Insert with temporary product_id = 'upload_stage' until assigned to a product
    await db.execute({
      sql: `
        INSERT INTO product_images (id, product_id, storage_path, image_data, mime_type, sort_order)
        VALUES (?, 'upload_stage', ?, ?, ?, 0)
      `,
      args: [imageId, storagePath, base64, mimeType],
    });

    return NextResponse.json({
      url: storagePath,
      path: storagePath,
      id: imageId,
      size: buffer.length,
    });
  } catch (err) {
    console.error('Upload error:', err);
    const message = err instanceof Error ? err.message : 'Error al procesar la imagen';
    return NextResponse.json({ error: `Error al procesar la imagen: ${message}` }, { status: 500 });
  }
}
