'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Check, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { Product, formatPrice, statusLabel } from './data';
import { useSelection } from './SelectionProvider';

export default function ProductCard({ product }: { product: Product }) {
  const { add, has } = useSelection();
  const saved = has(product.id);
  const images = product.images?.length ? product.images : [product.image];
  const [activeIdx, setActiveIdx] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const hasSwiped = useRef(false);

  const nextPhoto = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (images.length > 1) {
      setActiveIdx((prev) => (prev + 1) % images.length);
    }
  };

  const prevPhoto = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (images.length > 1) {
      setActiveIdx((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    hasSwiped.current = false;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy) * 1.1) {
      hasSwiped.current = true;
      if (dx < 0) {
        nextPhoto();
      } else {
        prevPhoto();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleImageClick = (e: React.MouseEvent) => {
    if (hasSwiped.current) {
      e.preventDefault();
      hasSwiped.current = false;
    }
  };

  return (
    <article className="product-card">
      <div
        className="product-image-container"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Link
          href={'/producto/' + product.id}
          className="product-image"
          onClick={handleImageClick}
        >
          <img src={images[activeIdx] || product.image} alt={product.title} />
          <span className={'status ' + product.status}>{statusLabel[product.status]}</span>
        </Link>

        {images.length > 1 && (
          <>
            <button
              type="button"
              className="card-photo-nav left"
              onClick={prevPhoto}
              aria-label="Foto anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="card-photo-nav right"
              onClick={nextPhoto}
              aria-label="Foto siguiente"
            >
              <ChevronRight size={18} />
            </button>
            <div className="card-photo-dots" aria-hidden="true">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`card-photo-dot ${idx === activeIdx ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveIdx(idx);
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="product-thumbs" aria-label={`Fotos de ${product.title}`}>
          {images.slice(0, 4).map((image, index) => (
            <button
              key={image + index}
              type="button"
              className={`product-thumb-btn ${index === activeIdx ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveIdx(index);
              }}
              aria-label={`Ver foto ${index + 1}`}
            >
              <img src={image} alt={`${product.title} foto ${index + 1}`} />
            </button>
          ))}
        </div>
      )}

      <div className="product-copy">
        <div>
          <p className="category">{product.category}</p>
          <Link href={'/producto/' + product.id}>
            <h3>{product.title}</h3>
          </Link>
          <strong>{formatPrice(product.price)}</strong>
        </div>
        {product.status === 'available' && (
          <button
            className={'want-button ' + (saved ? 'saved' : '')}
            onClick={() => add(product)}
          >
            {saved ? <Check size={17} /> : <ShoppingBag size={17} />}
            {saved ? 'En selección' : 'Lo quiero'}
          </button>
        )}
      </div>
    </article>
  );
}
