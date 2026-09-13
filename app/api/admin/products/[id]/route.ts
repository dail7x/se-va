import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../../../../../lib/admin';
import { getDb } from '../../../../../lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return NextResponse.json({ error: admin.error }, { status: admin.status });

  try {
    const { id } = await params;
    const db = getDb();

    // Delete product (cascades to images in SQLite)
    await db.execute({
      sql: 'DELETE FROM product_images WHERE product_id = ?',
      args: [id],
    });

    await db.execute({
      sql: 'DELETE FROM products WHERE id = ?',
      args: [id],
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Delete product error:', err);
    return NextResponse.json({ error: 'Error al eliminar el producto' }, { status: 500 });
  }
}
