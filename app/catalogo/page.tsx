import Catalog from '../../components/Catalog';
import { getPublicProducts } from '../../lib/products';

export const dynamic = 'force-dynamic';

export default async function CatalogoPage() {
  const products = await getPublicProducts();
  return <Catalog products={products} />;
}
