import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';
import { signAdminToken, verifyAdminToken } from '../../../../lib/admin';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!email || !password) {
      return NextResponse.json({ error: 'Ingresá email y contraseña' }, { status: 400 });
    }

    const db = getDb();
    const result = await db.execute({
      sql: 'SELECT id, email, password_hash, role FROM admin_users WHERE lower(email) = lower(?) LIMIT 1',
      args: [email],
    });

    const user = result.rows[0];
    const incomingHash = hashPassword(password);

    // If user exists in DB, compare hash
    let isValid = false;
    let userId = 'admin';

    if (user) {
      isValid = user.password_hash === incomingHash;
      userId = String(user.id);
    } else {
      // Fallback check against env var ADMIN_PASSWORD
      const envPass = process.env.ADMIN_PASSWORD;
      if (envPass && password === envPass) {
        isValid = true;
      }
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const token = signAdminToken(userId);

    const response = NextResponse.json({
      ok: true,
      token,
      user: { id: userId, email },
    });

    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Error al iniciar sesión' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const cookieToken = request.cookies.get('admin_session')?.value;
  const token = authHeader || cookieToken;

  if (!token) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const check = verifyAdminToken(token);
  if (!check.valid) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json({ ok: true, user: { id: check.userId, role: 'admin' } });
}
