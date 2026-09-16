import fs from 'fs';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://se-va.vercel.app';

async function syncFallback() {
  console.log(`Fetching latest products from ${SITE_URL}/api/products ...`);
  const res = await fetch(`${SITE_URL}/api/products`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
  }

  const products = await res.json();
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error('Received empty or invalid products array');
  }

  const content = `export type Status = 'available' | 'reserved' | 'sold';

export type Product = {
  id: string;
  title: string;
  category: string;
  price: number;
  status: Status;
  image: string;
  images: string[];
  description: string;
  featured?: boolean;
  isPublic?: boolean;
};

// Fallback snapshot of actual products (used if SQLite connection is interrupted)
export const products: Product[] = ${JSON.stringify(products, null, 2)};

export const categories = ['Todo', 'Casa', 'Muebles', 'Cocina', 'Decoración', 'Varios'];

export const formatPrice = (value: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value);

export const statusLabel = {
  available: 'Todavía está',
  reserved: 'Casi se va',
  sold: 'Ya se fue!',
};
`;

  fs.writeFileSync('components/data.ts', content, 'utf8');
  console.log(`Successfully synced ${products.length} products to components/data.ts!`);
}

syncFallback().catch((err) => {
  console.error('Error syncing fallback:', err);
  process.exit(1);
});
