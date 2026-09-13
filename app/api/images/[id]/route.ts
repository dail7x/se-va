import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return new NextResponse('Image ID required', { status: 400 });
    }

    const db = getDb();
    const result = await db.execute({
      sql: `SELECT id, storage_path, image_data, mime_type FROM product_images WHERE id = ? OR storage_path = ? OR storage_path = ? LIMIT 1`,
      args: [id, id, `/api/images/${id}`],
    });

    const row = result.rows[0];
    if (!row) {
      return new NextResponse('Image not found', { status: 404 });
    }

    if (row.image_data) {
      const base64Data = String(row.image_data).replace(/^data:image\/[a-z]+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const mimeType = String(row.mime_type || 'image/webp');

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': mimeType,
          'Content-Length': String(buffer.length),
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // If storage_path is an external URL, redirect to it
    const storagePath = String(row.storage_path);
    if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
      return NextResponse.redirect(storagePath);
    }

    return new NextResponse('No image content found', { status: 404 });
  } catch (err) {
    console.error('Error serving image:', err);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
