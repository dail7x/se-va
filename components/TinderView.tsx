'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Flame,
  Heart,
  HelpCircle,
  Maximize2,
  MessageCircle,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';
import Header from './Header';
import { Product, formatPrice, statusLabel } from './data';
import { useSelection } from './SelectionProvider';
import { whatsappPhone } from '../lib/site';

type SwipeAction = 'like' | 'pass' | 'maybe';

type HistoryItem = {
  product: Product;
  action: SwipeAction;
};

export default function TinderView({ products }: { products: Product[] }) {
  const { add, addInterest, selected, interests, has } = useSelection();

  // Filter available products
  const activeProducts = products.filter((p) => p.status !== 'sold');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Cart toast & pop animation
  const [cartToast, setCartToast] = useState<{ title: string; price: number } | null>(null);
  const [likeParticle, setLikeParticle] = useState(false);

  // Detail modal state
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [detailPhotoIndex, setDetailPhotoIndex] = useState(0);

  // Drag physics state
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [flyingAction, setFlyingAction] = useState<SwipeAction | null>(null);

  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const pointerDownTime = useRef<number>(0);
  const movedRef = useRef<boolean>(false);

  const currentProduct = activeProducts[currentIndex];
  const nextProduct = activeProducts[currentIndex + 1];
  const nextNextProduct = activeProducts[currentIndex + 2];

  const currentImages = currentProduct
    ? currentProduct.images?.length
      ? currentProduct.images
      : [currentProduct.image]
    : [];

  useEffect(() => {
    if (!cartToast) return;
    const timer = setTimeout(() => setCartToast(null), 2500);
    return () => clearTimeout(timer);
  }, [cartToast]);

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImages.length > 1) {
      setPhotoIndex((prev) => (prev + 1) % currentImages.length);
    }
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImages.length > 1) {
      setPhotoIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length);
    }
  };

  const executeSwipe = useCallback(
    (action: SwipeAction) => {
      if (!currentProduct || flyingAction) return;

      setFlyingAction(action);

      if (action === 'like') {
        add(currentProduct);
        setCartToast({ title: currentProduct.title, price: currentProduct.price });
        setLikeParticle(true);
        setTimeout(() => setLikeParticle(false), 900);
      } else if (action === 'maybe') {
        addInterest(currentProduct);
      }

      setHistory((prev) => [...prev, { product: currentProduct, action }]);

      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setPhotoIndex(0);
        setDrag({ x: 0, y: 0 });
        setFlyingAction(null);
      }, 320);
    },
    [currentProduct, flyingAction, add, addInterest]
  );

  const handleUndo = () => {
    if (!history.length || flyingAction) return;
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setCurrentIndex((prev) => Math.max(0, prev - 1));
    setPhotoIndex(0);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setPhotoIndex(0);
    setHistory([]);
    setDrag({ x: 0, y: 0 });
    setFlyingAction(null);
  };

  // Pointer drag events
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (flyingAction) return;
    dragStart.current = { x: e.clientX, y: e.clientY };
    pointerDownTime.current = Date.now();
    movedRef.current = false;
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStart.current || flyingAction) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.hypot(dx, dy) > 8) {
      movedRef.current = true;
    }
    setDrag({ x: dx, y: dy });
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || flyingAction) return;
    setIsDragging(false);

    const dx = drag.x;
    const dy = drag.y;
    const distance = Math.hypot(dx, dy);

    // If it was a clean tap (minimal distance and short duration), open product details!
    if (!movedRef.current && distance < 12 && Date.now() - pointerDownTime.current < 450) {
      setDrag({ x: 0, y: 0 });
      dragStart.current = null;
      if (currentProduct) {
        setDetailProduct(currentProduct);
        setDetailPhotoIndex(photoIndex);
      }
      return;
    }

    const threshold = 100;
    if (drag.x > threshold) {
      executeSwipe('like');
    } else if (drag.x < -threshold) {
      executeSwipe('pass');
    } else if (drag.y < -threshold) {
      executeSwipe('maybe');
    } else {
      // Spring back to center
      setDrag({ x: 0, y: 0 });
    }
    dragStart.current = null;
  };

  const onPointerCancel = () => {
    setIsDragging(false);
    setDrag({ x: 0, y: 0 });
    dragStart.current = null;
  };

  // Stamp opacity and tilt
  const likeOpacity = Math.min(1, Math.max(0, drag.x / 80));
  const passOpacity = Math.min(1, Math.max(0, -drag.x / 80));
  const maybeOpacity = Math.min(1, Math.max(0, -drag.y / 70));

  const isFinished = currentIndex >= activeProducts.length;

  return (
    <>
      <Header />
      <main className="tinder-page">
        <div className="tinder-header">
          <h1>
            ¿Va con vos? <em>Deslizá para elegir.</em>
          </h1>
          <p className="tinder-hint">
            <span>👉 <b>Me lo llevo</b></span>
            <span className="sep">·</span>
            <span>👈 <b>Paso</b></span>
            <span className="sep">·</span>
            <span className="hint-maybe">⭐ <b>Puede ser</b></span>
          </p>
        </div>

        <div className="tinder-card-area">
          {!isFinished && currentProduct ? (
            <div className="tinder-deck">
              {/* Background Card 2 */}
              {nextNextProduct && (
                <div className="tinder-card background-card-2" aria-hidden="true">
                  <div className="tinder-card-img-wrap">
                    <img src={nextNextProduct.image} alt="" />
                  </div>
                </div>
              )}

              {/* Background Card 1 */}
              {nextProduct && (
                <div className="tinder-card background-card-1" aria-hidden="true">
                  <div className="tinder-card-img-wrap">
                    <img src={nextProduct.image} alt="" />
                  </div>
                  <div className="tinder-card-copy-overlay">
                    <div className="tinder-identity">
                      <h2>
                        <span className="item-name">{nextProduct.title}</span>
                        <span className="item-comma">, </span>
                        <span className="item-price">{formatPrice(nextProduct.price)}</span>
                      </h2>
                    </div>
                  </div>
                </div>
              )}

              {/* Active Top Card */}
              <div
                className={`tinder-card active-card ${flyingAction ? `flying-${flyingAction}` : ''} ${
                  isDragging ? 'dragging' : ''
                }`}
                style={{
                  transform: !flyingAction
                    ? `translate3d(${drag.x}px, ${drag.y}px, 0) rotate(${drag.x * 0.08}deg)`
                    : undefined,
                  transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerCancel}
              >
                {/* Visual Feedback Stamps */}
                <div
                  className="tinder-stamp stamp-like"
                  style={{ opacity: flyingAction === 'like' ? 1 : likeOpacity }}
                >
                  ¡LO QUIERO!
                </div>
                <div
                  className="tinder-stamp stamp-pass"
                  style={{ opacity: flyingAction === 'pass' ? 1 : passOpacity }}
                >
                  PASO
                </div>
                <div
                  className="tinder-stamp stamp-maybe"
                  style={{ opacity: flyingAction === 'maybe' ? 1 : maybeOpacity }}
                >
                  PUEDE SER
                </div>

                {/* Multi-photo Story Indicators */}
                {currentImages.length > 1 && (
                  <div className="tinder-photo-bars">
                    {currentImages.map((_, idx) => (
                      <span
                        key={idx}
                        className={`tinder-photo-bar ${idx === photoIndex ? 'active' : ''}`}
                      />
                    ))}
                  </div>
                )}

                {/* Card Image */}
                <div className="tinder-card-img-wrap">
                  <img
                    src={currentImages[photoIndex] || currentProduct.image}
                    alt={currentProduct.title}
                    draggable={false}
                  />

                  {/* Badges on Top of Image */}
                  <div className="tinder-card-badges">
                    <span className="tinder-cat-badge">{currentProduct.category}</span>
                    <span className={'status ' + currentProduct.status}>
                      {statusLabel[currentProduct.status]}
                    </span>
                  </div>

                  {/* Left / Right tap zones for multiple photos */}
                  {currentImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        className="tinder-photo-nav left"
                        onClick={handlePrevPhoto}
                        aria-label="Foto anterior"
                      >
                        <ChevronLeft size={22} />
                      </button>
                      <button
                        type="button"
                        className="tinder-photo-nav right"
                        onClick={handleNextPhoto}
                        aria-label="Foto siguiente"
                      >
                        <ChevronRight size={22} />
                      </button>
                    </>
                  )}
                </div>

                {/* Card Editorial Copy as Gradient Overlay */}
                <div className="tinder-card-copy-overlay">
                  <div className="tinder-identity">
                    <h2>
                      <span className="item-name">{currentProduct.title}</span>
                      <span className="item-comma">, </span>
                      <span className="item-price">{formatPrice(currentProduct.price)}</span>
                    </h2>
                  </div>
                  {currentProduct.description && (
                    <p className="tinder-desc">{currentProduct.description}</p>
                  )}
                  <button
                    type="button"
                    className="tinder-detail-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDetailProduct(currentProduct);
                      setDetailPhotoIndex(photoIndex);
                    }}
                  >
                    Ver detalles y fotos completas <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Finished All Cards State */
            <div className="tinder-finished-card">
              <div className="finished-icon">✦</div>
              <h2>¡Llegaste al final de las cosas!</h2>
              <p>
                Recorriste todas las opciones disponibles. Elegiste objetos geniales para darles una nueva
                vida.
              </p>

              <div className="finished-stats">
                <div className="stat-box">
                  <ShoppingBag size={20} />
                  <b>{selected.length}</b>
                  <span>En mi selección</span>
                </div>
                <div className="stat-box">
                  <HelpCircle size={20} />
                  <b>{interests.length}</b>
                  <span>En Puede ser</span>
                </div>
              </div>

              <div className="finished-actions">
                <Link href="/seleccion" className="primary-action">
                  Ver mi selección ({selected.length}) →
                </Link>
                <button onClick={handleReset} className="tinder-btn-reset">
                  <RotateCcw size={16} /> Empezar a deslizar de nuevo
                </button>
                <Link href="/catalogo" className="finished-catalog-link">
                  Volver al catálogo tradicional
                </Link>
              </div>
            </div>
          )}

          {/* Action Buttons Toolbar */}
          {!isFinished && currentProduct && (
            <div className="tinder-controls">
              <button
                type="button"
                className="tinder-btn btn-undo"
                onClick={handleUndo}
                disabled={!history.length}
                title="Deshacer último swipe"
                aria-label="Deshacer"
              >
                <RotateCcw size={20} />
              </button>

              <button
                type="button"
                className="tinder-btn btn-pass"
                onClick={() => executeSwipe('pass')}
                title="Paso (Swipe Izquierda)"
                aria-label="Paso"
              >
                <X size={28} />
              </button>

              <button
                type="button"
                className="tinder-btn btn-maybe"
                onClick={() => executeSwipe('maybe')}
                title="Puede ser (Guardar en intereses)"
                aria-label="Puede ser"
              >
                <Sparkles size={24} />
                <span className="btn-label">Puede ser</span>
              </button>

              <button
                type="button"
                className="tinder-btn btn-like"
                onClick={() => executeSwipe('like')}
                title="Lo quiero (Swipe Derecha)"
                aria-label="Lo quiero"
              >
                <Heart size={28} />
              </button>
            </div>
          )}
        </div>

        {/* Live Cart Toast on Right Swipe */}
        {cartToast && (
          <div className="tinder-cart-toast" role="status">
            <div className="tinder-toast-badge">
              <Check size={16} />
            </div>
            <div className="tinder-toast-text">
              <strong>¡Agregado a tu selección!</strong>
              <span>{cartToast.title} · {formatPrice(cartToast.price)}</span>
            </div>
            <ShoppingBag size={18} className="tinder-toast-bag" />
          </div>
        )}

        {/* Celebratory like particle animation */}
        {likeParticle && (
          <div className="tinder-like-particle" aria-hidden="true">
            <Heart size={36} fill="#ed7d56" color="#ed7d56" />
            <span>+1 al carrito</span>
          </div>
        )}

        {/* Product Detail Modal Sheet */}
        {detailProduct && (
          <div
            className="tinder-detail-modal-backdrop"
            onClick={() => setDetailProduct(null)}
          >
            <div
              className="tinder-detail-modal-sheet"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={detailProduct.title}
            >
              {/* Modal Sticky Top Header */}
              <div className="tinder-modal-header">
                <button
                  type="button"
                  className="tinder-modal-back-btn"
                  onClick={() => setDetailProduct(null)}
                >
                  <ArrowLeft size={18} />
                  <span>Volver al modo swipe</span>
                </button>
                <button
                  type="button"
                  className="tinder-modal-close-icon"
                  onClick={() => setDetailProduct(null)}
                  aria-label="Cerrar y volver al modo swipe"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="tinder-modal-body">
                {/* Image Gallery */}
                <div className="tinder-modal-gallery">
                  <div className="tinder-modal-main-img">
                    <img
                      src={
                        detailProduct.images?.[detailPhotoIndex] ||
                        detailProduct.images?.[0] ||
                        detailProduct.image
                      }
                      alt={detailProduct.title}
                    />
                    <span className={'status ' + detailProduct.status}>
                      {statusLabel[detailProduct.status]}
                    </span>
                  </div>
                  {detailProduct.images && detailProduct.images.length > 1 && (
                    <div className="tinder-modal-thumbs">
                      {detailProduct.images.map((img, idx) => (
                        <button
                          key={img + idx}
                          type="button"
                          className={`tinder-modal-thumb ${idx === detailPhotoIndex ? 'active' : ''}`}
                          onClick={() => setDetailPhotoIndex(idx)}
                          aria-label={`Ver foto ${idx + 1}`}
                        >
                          <img src={img} alt="" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Copy and Actions */}
                <div className="tinder-modal-info">
                  <p className="category">{detailProduct.category}</p>
                  <h2>{detailProduct.title}</h2>
                  <div className="detail-price">{formatPrice(detailProduct.price)}</div>

                  {detailProduct.description && (
                    <p className="description">{detailProduct.description}</p>
                  )}

                  <div className="detail-note">
                    <b>Retiro o envío</b>
                    <span>Armá tu selección o consultanos directamente por WhatsApp.</span>
                  </div>

                  <div className="tinder-modal-actions">
                    <button
                      type="button"
                      className={'primary-action ' + (has(detailProduct.id) ? 'saved' : '')}
                      onClick={() => {
                        add(detailProduct);
                        setCartToast({ title: detailProduct.title, price: detailProduct.price });
                      }}
                    >
                      {has(detailProduct.id) ? (
                        <>
                          <Check size={18} /> En tu selección
                        </>
                      ) : (
                        <>
                          <Heart size={18} /> Lo quiero (sumar a selección)
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="tinder-modal-maybe-btn"
                      onClick={() => {
                        addInterest(detailProduct);
                        setDetailProduct(null);
                      }}
                    >
                      <Sparkles size={16} /> Guardar en "Puede ser"
                    </button>

                    <a
                      href={`https://wa.me/${whatsappPhone}?text=Hola%2C%20quiero%20consultar%20por%20este%20art%C3%ADculo%3A%20${encodeURIComponent(detailProduct.title)}%20(${encodeURIComponent(formatPrice(detailProduct.price))})%0A%0A%C2%BFSigue%20disponible%3F%20%C2%BFC%C3%B3mo%20podemos%20coordinar%3F`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whatsapp"
                    >
                      <MessageCircle size={18} /> Consultar por WhatsApp
                    </a>

                    <button
                      type="button"
                      className="tinder-modal-bottom-back"
                      onClick={() => setDetailProduct(null)}
                    >
                      <ArrowLeft size={16} /> Cerrar y seguir deslizando
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
