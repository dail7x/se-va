import type { Metadata } from 'next';
import Catalog from '../components/Catalog';
import { getPublicProducts } from '../lib/products';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'SE VA! — Cosas que buscan nueva casa',
  description: 'Venta de garaje · Objetos con historia buscando su próximo hogar en Buenos Aires.',
};

export default async function Home() {
  const products = await getPublicProducts();
  return <Catalog products={products} />;
}

