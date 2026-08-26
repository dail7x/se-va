import Link from 'next/link'; import { notFound } from 'next/navigation'; import ProductDetail from '../../../components/ProductDetail'; import { getPublicProduct } from '../../../lib/products';
export const dynamic = 'force-dynamic';
export default async function Page({params}:{params:{slug:string}}){const product=await getPublicProduct(params.slug);if(!product)return notFound();return <><div className="detail-top"><Link href="/">← Volver al catálogo</Link><span>SE VA<span>!</span></span><Link href="/seleccion">Mi selección →</Link></div><ProductDetail product={product}/></>}
