import Catalog from '../components/Catalog';
import { getPublicProducts } from '../lib/products';

export default async function Home() { const products = await getPublicProducts(); return <Catalog products={products} />; }
