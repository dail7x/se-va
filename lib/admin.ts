import { NextRequest } from 'next/server';
import { createServiceSupabaseClient } from './supabase/server';

export async function requireAdmin(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

  if (!token) {
    return { ok: false as const, status: 401, error: 'No session token provided' };
  }

  const supabase = createServiceSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser(token);

  if (userError || !userData.user) {
    return { ok: false as const, status: 401, error: 'Invalid session' };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userData.user.id)
    .single();

  if (profileError || profile?.role !== 'admin') {
    return { ok: false as const, status: 403, error: 'Admin access required' };
  }

  return { ok: true as const, supabase, user: userData.user };
}
