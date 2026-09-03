'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowUp, Sparkles } from 'lucide-react';
import ProductDetail from './ProductDetail';
import { Product, formatPrice } from './data';

type ProductContinuousFeedProps = {
  initialProduct: Product;
  allProducts: Product[];
};

export default function ProductContinuousFeed({
  initialProduct,
  allProducts,
}: ProductContinuousFeedProps) {
  // Compute ordered queue of next products: starting after initialProduct, wrapping around
  const queue = useMemo(() => {
    const list = allProducts.filter((p) => p.status !== 'sold' || p.id === initialProduct.id);
    const initialIndex = list.findIndex((p) => p.id === initialProduct.id);
    if (initialIndex === -1) {
      return list.filter((p) => p.id !== initialProduct.id);
    }
    // Items after current index, then items before current index
    const after = list.slice(initialIndex + 1);
    const before = list.slice(0, initialIndex);
    return [...after, ...before];
  }, [allProducts, initialProduct.id]);

  const [feed, setFeed] = useState<Product[]>([initialProduct]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isLoadingNext, setIsLoadingNext] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const activeProductId = useRef<string>(initialProduct.id);

  const hasMore = queueIndex < queue.length;

  const loadNext = useCallback(() => {
    if (isLoadingNext || !hasMore) return;
    setIsLoadingNext(true);

    // Subtle natural delay for smooth lazy loading effect
    setTimeout(() => {
      setFeed((prev) => {
        const nextItem = queue[queueIndex];
        if (!nextItem || prev.some((p) => p.id === nextItem.id)) return prev;
        return [...prev, nextItem];
      });
      setQueueIndex((prev) => prev + 1);
      setIsLoadingNext(false);
    }, 250);
  }, [isLoadingNext, hasMore, queue, queueIndex]);

  // Observer for triggering next product loading
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          loadNext();
        }
      },
      { rootMargin: '300px 0px 0px 0px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadNext, hasMore]);

  // Observer for updating URL and Title to current visible product
  useEffect(() => {
    const articles = document.querySelectorAll<HTMLElement>('.continuous-feed article.detail');
    if (!articles.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-product-id');
            if (id && id !== activeProductId.current) {
              activeProductId.current = id;
              const product = feed.find((p) => p.id === id);
              if (product) {
                window.history.replaceState(null, '', `/producto/${id}`);
                document.title = `${product.title} — ${formatPrice(product.price)} | SE VA!`;
              }
            }
          }
        }
      },
      { threshold: 0.35 }
    );

    articles.forEach((art) => observer.observe(art));
    return () => observer.disconnect();
  }, [feed]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="continuous-feed">
      {feed.map((product, index) => (
        <div key={product.id} className="feed-item">
          {index > 0 && (
            <div className="feed-divider">
              <span className="feed-divider-line" />
              <span className="feed-divider-badge">
                <Sparkles size={14} /> Siguiente objeto en SE VA! ↓
              </span>
              <span className="feed-divider-line" />
            </div>
          )}
          <ProductDetail product={product} />
        </div>
      ))}

      {hasMore && (
        <div ref={sentinelRef} className="feed-loading-sentinel">
          {isLoadingNext && (
            <div className="feed-spinner">
              <span className="dot dot-1" />
              <span className="dot dot-2" />
              <span className="dot dot-3" />
              <small>Cargando el siguiente artículo...</small>
            </div>
          )}
        </div>
      )}

      {!hasMore && (
        <footer className="feed-end-banner">
          <div className="feed-end-content">
            <span className="feed-end-icon">✦</span>
            <h3>Llegaste al final de las cosas.</h3>
            <p>Viste todos los objetos disponibles en esta venta de garaje.</p>
            <div className="feed-end-actions">
              <button onClick={scrollToTop} className="feed-top-btn">
                <ArrowUp size={16} /> Volver arriba
              </button>
              <Link href="/" className="primary-action" style={{ padding: '10px 22px', borderRadius: '100px' }}>
                Ir al catálogo
              </Link>
              <Link href="/descubrir" className="whatsapp" style={{ padding: '10px 22px', borderRadius: '100px' }}>
                Probar Modo Swipe 🔥
              </Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
