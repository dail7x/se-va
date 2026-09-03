import type { Metadata } from 'next';
import TinderView from '../../components/TinderView';
import { getPublicProducts } from '../../lib/products';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Modo Swipe · Descubrí objetos — SE VA!',
  description: 'Deslizá para descubrir cosas de venta de garaje. Derecha te lo llevás, izquierda pasás, o guardalo en Puede ser.',
};

export default async function DescubrirPage() {
  const products = await getPublicProducts();
  return <TinderView products={products} />;
}
