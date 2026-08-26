'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '../lib/supabase/client';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createBrowserSupabaseClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos iniciar sesión.');
    } finally {
      setLoading(false);
    }
  }

  return <main className="admin-login"><Link className="logo" href="/">SE VA<span>!</span><small>Cosas que buscan nueva casa.</small></Link><div className="login-box"><p className="eyebrow">Espacio de casa</p><h1>Hola de nuevo.</h1><p>Entrá para ordenar las cosas que están buscando hogar.</p><form onSubmit={onSubmit}><label>Email<input type="email" value={email} onChange={event=>setEmail(event.target.value)} placeholder="vos@ejemplo.com" required/></label><label>Contraseña<input type="password" value={password} onChange={event=>setPassword(event.target.value)} placeholder="Contraseña" required/></label>{error&&<p className="form-error">{error}</p>}<button className="primary-action" disabled={loading}>{loading?'Entrando...':'Entrar →'}</button></form></div></main>
}
