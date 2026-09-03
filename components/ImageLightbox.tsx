'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';

type ImageLightboxProps = {
  images: string[];
  initialIndex?: number;
  title: string;
  onClose: () => void;
};

export default function ImageLightbox({
  images,
  initialIndex = 0,
  title,
  onClose,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);

  const total = images.length;

  const goToPrev = useCallback(() => {
    setIsZoomed(false);
    setDragOffset(0);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  }, [total]);

  const goToNext = useCallback(() => {
    setIsZoomed(false);
    setDragOffset(0);
    setCurrentIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  }, [total]);

  // Lock body scroll while open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') goToPrev();
      else if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrev, goToNext, onClose]);

  // Pointer / Touch gestures for swipe
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isZoomed) return; // Allow normal pan when zoomed
    dragStartX.current = e.clientX;
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || dragStartX.current === null || isZoomed) return;
    const diff = e.clientX - dragStartX.current;
    setDragOffset(diff);
  };

  const handlePointerUp = () => {
    if (!isDragging || dragStartX.current === null) return;
    const threshold = 50;
    if (dragOffset > threshold) {
      goToPrev();
    } else if (dragOffset < -threshold) {
      goToNext();
    }
    setDragOffset(0);
    setIsDragging(false);
    dragStartX.current = null;
  };

  const handlePointerCancel = () => {
    setDragOffset(0);
    setIsDragging(false);
    dragStartX.current = null;
  };

  return (
    <div
      className="lightbox-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`Galería ampliada de ${title}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <header className="lightbox-header">
        <div className="lightbox-info">
          <span className="lightbox-counter">{currentIndex + 1} / {total}</span>
          <span className="lightbox-title">{title}</span>
        </div>
        <div className="lightbox-tools">
          <button
            type="button"
            className="lightbox-tool-btn"
            onClick={() => setIsZoomed(!isZoomed)}
            aria-label={isZoomed ? 'Alejar zoom' : 'Acercar zoom'}
            title={isZoomed ? 'Alejar zoom' : 'Acercar zoom'}
          >
            {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
          </button>
          <button
            type="button"
            className="lightbox-tool-btn lightbox-close"
            onClick={onClose}
            aria-label="Cerrar visor"
            title="Cerrar (Esc)"
          >
            <X size={22} />
          </button>
        </div>
      </header>

      <div
        className="lightbox-stage"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {total > 1 && (
          <button
            type="button"
            className="lightbox-nav-btn prev"
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
            aria-label="Foto anterior"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        <div
          className={`lightbox-img-wrapper ${isZoomed ? 'zoomed' : ''} ${isDragging ? 'dragging' : ''}`}
          style={{
            transform: !isZoomed ? `translateX(${dragOffset}px)` : undefined,
            transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
          onClick={() => !isDragging && setIsZoomed(!isZoomed)}
        >
          <img
            src={images[currentIndex]}
            alt={`${title} - Foto ${currentIndex + 1}`}
            className="lightbox-img"
            draggable={false}
          />
        </div>

        {total > 1 && (
          <button
            type="button"
            className="lightbox-nav-btn next"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="Foto siguiente"
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>

      {total > 1 && (
        <footer className="lightbox-footer">
          <div className="lightbox-thumbs">
            {images.map((img, idx) => (
              <button
                key={img + idx}
                type="button"
                className={`lightbox-thumb ${idx === currentIndex ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(false);
                  setCurrentIndex(idx);
                }}
                aria-label={`Ir a foto ${idx + 1}`}
              >
                <img src={img} alt="" />
              </button>
            ))}
          </div>
        </footer>
      )}
    </div>
  );
}
