import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '../../../../../lib/admin';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin(request);
  if (!admin.ok) return NextResponse.json({ error: admin.error }, { status: admin.status });

  const { error } = await admin.supabase.from('products').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
