# SE VA!

Catálogo mobile-first para una venta de garaje. El frontend funciona con datos demo mientras se conectan Supabase y el panel de administración.

## Desarrollo

```bash
npm install
npm run dev
```

## Supabase

Por ahora alcanza con Supabase Free. Para conectar la app hacen falta estas variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_WHATSAPP_PHONE=
NEXT_PUBLIC_SITE_URL=
```

La migración inicial está en `supabase/migrations/001_initial.sql`.

El panel de administración vive en `/admin/login` y usa Supabase Auth. Los usuarios autorizados deben existir en `profiles` con `role='admin'`.

## Coolify

El proyecto incluye `Dockerfile` y expone el puerto `3000`. En Coolify configurar las variables de Supabase y `NEXT_PUBLIC_SITE_URL` con el dominio final.
