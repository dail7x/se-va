'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Flame,
  Heart,
  HelpCircle,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';
import Header from './Header';
import { Product, formatPrice, statusLabel } from './data';
import { useSelection } from './SelectionProvider';

type SwipeAction = 'like' | 'pass' | 'maybe';

type HistoryItem = {
  product: Product;
  action: SwipeAction;
};

export default function TinderView({ products }: { products: Product[] }) {
  const { add, addInterest, selected, interests } = useSelection();

  // Filter available products
  const activeProducts = products.filter((p) => p.status !== 'sold');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Drag physics state
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [flyingAction, setFlyingAction] = useState<SwipeAction | null>(null);

  const dragStart = useRef<{ x: number; y: number } | null>(null);

  const currentProduct = activeProducts[currentIndex];
  const nextProduct = activeProducts[currentIndex + 1];
  const nextNextProduct = activeProducts[currentIndex + 2];

  const currentImages = currentProduct
    ? currentProduct.images?.length
      ? currentProduct.images
      : [currentProduct.image]
    : [];

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
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStart.current || flyingAction) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setDrag({ x: dx, y: dy });
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || flyingAction) return;
    setIsDragging(false);

    const threshold = 110;
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
                  <Link
                    href={`/producto/${currentProduct.id}`}
                    className="tinder-detail-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Ver detalles y fotos ampliadas <ExternalLink size={12} />
                  </Link>
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
                <Link href="/" className="finished-catalog-link">
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
      </main>
    </>
  );
}
