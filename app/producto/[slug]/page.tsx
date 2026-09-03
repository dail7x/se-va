import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductContinuousFeed from '../../../components/ProductContinuousFeed';
import { formatPrice } from '../../../components/data';
import { getPublicProduct, getPublicProducts } from '../../../lib/products';
import { siteUrl } from '../../../lib/site';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ slug: string }>;
};

function absoluteUrl(value: string) {
  try {
    return new URL(value).toString();
  } catch {
    return new URL(value.startsWith('/') ? value : `/${value}`, siteUrl).toString();
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicProduct(slug);

  if (!product) {
    return {
      title: 'Esta cosa ya no está — SE VA!',
      description: 'El artículo no está disponible en el catálogo.',
    };
  }

  const title = `${product.title} — ${formatPrice(product.price)} | SE VA!`;
  const description = product.description || `${product.title} busca nueva casa.`;
  const url = `${siteUrl}/producto/${product.id}`;
  const image = absoluteUrl(product.image);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'SE VA!',
      type: 'website',
      locale: 'es_AR',
      images: [
        {
          url: image,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([
    getPublicProduct(slug),
    getPublicProducts(),
  ]);

  if (!product) return notFound();

  return (
    <>
      <div className="detail-top">
        <Link href="/">← Catálogo</Link>
        <Link href="/" className="logo-text">SE VA<span>!</span></Link>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link href="/descubrir" className="swipe-link">Modo Swipe 🔥</Link>
          <Link href="/seleccion">Selección →</Link>
        </div>
      </div>
      <ProductContinuousFeed initialProduct={product} allProducts={allProducts} />
    </>
  );
}
