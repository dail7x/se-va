'use client';

import { Check, ChevronLeft, ChevronRight, Maximize2, MessageCircle, Share2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { Product, formatPrice, statusLabel } from './data';
import { useSelection } from './SelectionProvider';
import ImageLightbox from './ImageLightbox';
import { whatsappPhone } from '../lib/site';

export default function ProductDetail({ product }: { product: Product }) {
  const { add, has } = useSelection();
  const images = product.images?.length ? product.images : [product.image];
  const [activeImage, setActiveImage] = useState(images[0]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const saved = has(product.id);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const currentIdx = images.indexOf(activeImage) >= 0 ? images.indexOf(activeImage) : 0;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const nextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (images.length > 1) {
      setActiveImage(images[(currentIdx + 1) % images.length]);
    }
  };

  const prevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (images.length > 1) {
      setActiveImage(images[(currentIdx - 1 + images.length) % images.length]);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy) * 1.1) {
      if (dx < 0) {
        nextPhoto();
      } else {
        prevPhoto();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const singleWhatsAppUrl = `https://wa.me/${whatsappPhone}?text=Hola%2C%20quiero%20consultar%20por%20este%20art%C3%ADculo%3A%20${encodeURIComponent(product.title)}%20(${encodeURIComponent(formatPrice(product.price))})%0A%0A%C2%BFSigue%20disponible%3F%20%C2%BFC%C3%B3mo%20podemos%20coordinar%3F`;

  return (
    <article className="detail" id={`product-${product.id}`} data-product-id={product.id}>
      <div className="detail-gallery">
        <div
          className={`detail-image ${product.status === 'sold' ? 'sold-product' : ''}`}
          onClick={() => openLightbox(currentIdx)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          title="Deslizá para ver más fotos"
        >
          <img src={activeImage} alt={product.title} />
          <span className={'status ' + product.status}>{statusLabel[product.status]}</span>

          {product.status === 'sold' && (
            <div className="catalog-sold-overlay" aria-hidden="true">
              <span className="catalog-sold-stamp">Ya se fue!</span>
            </div>
          )}

          {images.length > 1 && (
            <>
              <button
                type="button"
                className="gallery-nav left"
                onClick={prevPhoto}
                aria-label="Foto anterior"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                className="gallery-nav right"
                onClick={nextPhoto}
                aria-label="Foto siguiente"
              >
                <ChevronRight size={22} />
              </button>
              <div className="gallery-dots" aria-hidden="true">
                {images.map((img, idx) => (
                  <span
                    key={img + idx}
                    className={`gallery-dot ${idx === currentIdx ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImage(images[idx]);
                    }}
                  />
                ))}
              </div>
            </>
          )}

          <button
            type="button"
            className="gallery-zoom-badge"
            onClick={(e) => {
              e.stopPropagation();
              openLightbox(currentIdx);
            }}
            aria-label="Ampliar foto"
          >
            <Maximize2 size={13} /> Ampliar
          </button>
        </div>
        {images.length > 1 && (
          <div className="detail-thumbs" aria-label={`Galería de ${product.title}`}>
            {images.map((image, index) => (
              <button
                key={image}
                className={image === activeImage ? 'active' : ''}
                onClick={() => setActiveImage(image)}
                aria-label={`Ver foto ${index + 1}`}
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="detail-copy">
        <p className="category">{product.category}</p>
        <h1>{product.title}</h1>
        <div className="detail-price">{formatPrice(product.price)}</div>
        <div className="detail-note">
          <b>Retiro o envío</b>
          <span>Armá tu selección o hacé la consulta directa por WhatsApp.</span>
        </div>
        {product.status === 'available' ? (
          <div className="detail-actions">
            <button className={'primary-action ' + (saved ? 'saved' : '')} onClick={() => add(product)}>
              {saved ? (
                <>
                  <Check size={18} /> En tu selección
                </>
              ) : (
                <>
                  Me lo llevo <span>→</span>
                </>
              )}
            </button>
            <a
              href={singleWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp"
            >
              <MessageCircle size={18} /> Consultar por WhatsApp
            </a>
          </div>
        ) : (
          <p className="gone">
            Esta cosa ya encontró nueva casa. <span>👋</span>
          </p>
        )}
        <p className="description">{product.description}</p>
        <button
          className="share"
          onClick={() =>
            navigator.share
              ? navigator.share({ title: product.title, url: `${window.location.origin}/producto/${product.id}` })
              : navigator.clipboard.writeText(`${window.location.origin}/producto/${product.id}`)
          }
        >
          <Share2 size={16} /> Compartir esta cosa
        </button>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          images={images}
          initialIndex={lightboxIndex}
          title={product.title}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </article>
  );
}
