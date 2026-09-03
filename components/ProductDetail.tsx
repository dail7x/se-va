'use client';

import { Check, Maximize2, Share2 } from 'lucide-react';
import { useState } from 'react';
import { Product, formatPrice, statusLabel } from './data';
import { useSelection } from './SelectionProvider';
import ImageLightbox from './ImageLightbox';

export default function ProductDetail({ product }: { product: Product }) {
  const { add, has } = useSelection();
  const images = product.images?.length ? product.images : [product.image];
  const [activeImage, setActiveImage] = useState(images[0]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const saved = has(product.id);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const currentIdx = images.indexOf(activeImage) >= 0 ? images.indexOf(activeImage) : 0;

  return (
    <article className="detail" id={`product-${product.id}`} data-product-id={product.id}>
      <div className="detail-gallery">
        <div
          className="detail-image clickable"
          onClick={() => openLightbox(currentIdx)}
          title="Toca para ampliar la foto"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') openLightbox(currentIdx);
          }}
        >
          <img src={activeImage} alt={product.title} />
          <span className={'status ' + product.status}>{statusLabel[product.status]}</span>
          <span className="gallery-zoom-badge" aria-hidden="true">
            <Maximize2 size={14} /> Ampliar
          </span>
        </div>
        {images.length > 1 && (
          <div className="detail-thumbs" aria-label={`Galería de ${product.title}`}>
            {images.map((image, index) => (
              <button
                key={image}
                className={image === activeImage ? 'active' : ''}
                onClick={() => {
                  setActiveImage(image);
                }}
                onDoubleClick={() => openLightbox(index)}
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
          <span>Armá tu selección y después hacé la consulta por WhatsApp.</span>
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
