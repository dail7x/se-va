'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Flame,
  LayoutGrid,
  MessageCircle,
  Package,
  Sparkles,
} from 'lucide-react';
import Header from './Header';
import { Product, formatPrice } from './data';
import { useSelection } from './SelectionProvider';

export default function HomeGateway({ products }: { products: Product[] }) {
  const { selected } = useSelection();
  const availableCount = products.filter((p) => p.status !== 'sold').length;
  const previewProducts = products.slice(0, 3);

  return (
    <div className="gateway-viewport-wrapper">
      <Header />
      <main className="home-gateway">
        {/* Compact Hero Section */}
        <section className="gateway-hero">
          <div className="gateway-hero-content">
            <span className="gateway-eyebrow">
              <Sparkles size={12} /> Venta de garaje · Buenos Aires
            </span>
            <h1>
              Cosas que buscan <em>nueva casa.</em>
            </h1>
            <p className="gateway-subtitle">
              Nos mudamos y dejamos ir muebles, deco y cosas con historia. Elegí cómo descubrirlas:
            </p>
          </div>
          <div className="gateway-hero-doodle" aria-hidden="true">
            ✳<small>cosas con<br />historia</small>
          </div>
        </section>

        {/* The Two Choice Modes: Modo Swipe FIRST */}
        <section className="gateway-modes" aria-label="Elegí tu modo de navegación">
          {/* Option 1: Modo Swipe (PRIMERA OPCIÓN) */}
          <article className="gateway-card swipe-card">
            <div className="card-top-tag tag-fire">
              <Flame size={15} />
              <span>INTERACTIVO ESTILO TINDER</span>
              <span className="card-badge-hot">🔥 Recomendado</span>
            </div>

            <div className="card-body">
              <h2>Modo Swipe</h2>
              <p className="card-desc">
                Un objeto a la vez a pantalla completa. Deslizá a la derecha lo que te gusta y a la izquierda lo que pasás.
              </p>

              <div className="swipe-demo-pill" aria-hidden="true">
                <span className="demo-left">👈 Paso</span>
                <span className="demo-center">👆 Toca para ver</span>
                <span className="demo-right">👉 Lo quiero</span>
              </div>
            </div>

            <div className="card-footer">
              <Link href="/descubrir" className="mode-btn mode-btn-swipe">
                <Flame size={18} />
                <span>Entrar al Modo Swipe</span>
                <ArrowRight size={17} />
              </Link>
            </div>
          </article>

          {/* Option 2: Modo Catálogo (SEGUNDA OPCIÓN) */}
          <article className="gateway-card catalog-card">
            <div className="card-top-tag">
              <LayoutGrid size={15} />
              <span>VISTA CLÁSICA & ORGANIZADA</span>
            </div>

            <div className="card-body">
              <h2>Modo Catálogo</h2>
              <p className="card-desc">
                Mirá todos los artículos en cuadrícula, filtrá por categorías (Casa, Deco, Muebles, Varios) y usá el buscador.
              </p>

              <div className="card-previews" aria-hidden="true">
                {previewProducts.map((p) => (
                  <div key={p.id} className="preview-thumb">
                    <img src={p.image} alt="" />
                    <span>{formatPrice(p.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-footer">
              <Link href="/catalogo" className="mode-btn mode-btn-catalog">
                <span>Entrar al Catálogo</span>
                <ArrowRight size={17} />
              </Link>
            </div>
          </article>
        </section>

        {/* Bottom Bar: Compact stats & footer links */}
        <footer className="gateway-bottom-bar">
          <div className="gateway-stat-chip">
            <Package size={14} />
            <span><b>{availableCount}</b> objetos disponibles</span>
          </div>
          <div className="gateway-stat-chip desktop-only">
            <MessageCircle size={14} />
            <span>Consultas directas por WhatsApp</span>
          </div>
          <Link href="/como-comprar" className="gateway-help-link">
            ¿Cómo comprar? →
          </Link>
        </footer>
      </main>
    </div>
  );
}
