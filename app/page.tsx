import HomeGateway from '../components/HomeGateway';
import { getPublicProducts } from '../lib/products';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await getPublicProducts();
  return <HomeGateway products={products} />;
}
