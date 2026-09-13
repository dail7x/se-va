import crypto from 'node:crypto';
import { NextRequest } from 'next/server';

const ADMIN_SECRET = process.env.ADMIN_SESSION_SECRET || process.env.DATABASE_AUTH_TOKEN || 'se-va-admin-secret-key-change-in-prod';

export function signAdminToken(userId: string): string {
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
  const payload = `${userId}:${expiresAt}`;
  const hmac = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('hex');
  return `${payload}:${hmac}`;
}

export function verifyAdminToken(token: string): { valid: boolean; userId?: string } {
  if (!token) return { valid: false };

  const parts = token.split(':');
  if (parts.length !== 3) return { valid: false };

  const [userId, expiresAtStr, receivedHmac] = parts;
  const expiresAt = Number(expiresAtStr);

  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
    return { valid: false };
  }

  const payload = `${userId}:${expiresAtStr}`;
  const expectedHmac = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('hex');

  try {
    const isMatch = crypto.timingSafeEqual(
      Buffer.from(receivedHmac, 'hex'),
      Buffer.from(expectedHmac, 'hex')
    );
    return isMatch ? { valid: true, userId } : { valid: false };
  } catch {
    return { valid: false };
  }
}

export async function requireAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const cookieToken = request.cookies.get('admin_session')?.value;
  const token = authHeader || cookieToken;

  if (!token) {
    return { ok: false as const, status: 401, error: 'No session token provided' };
  }

  const check = verifyAdminToken(token);
  if (!check.valid) {
    return { ok: false as const, status: 401, error: 'Invalid or expired session' };
  }

  return {
    ok: true as const,
    user: { id: check.userId || 'admin', role: 'admin' },
  };
}
