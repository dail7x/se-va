'use client';

import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Flame,
  HelpCircle,
  LayoutGrid,
  MessageCircle,
  Package,
  ShoppingBag,
  Sparkles,
  Zap,
} from 'lucide-react';
import Header from './Header';
import { Product, formatPrice } from './data';
import { useSelection } from './SelectionProvider';

export default function HomeGateway({ products }: { products: Product[] }) {
  const { selected } = useSelection();
  const availableCount = products.filter((p) => p.status !== 'sold').length;

  // Sample preview photos for the visual cards
  const previewProducts = products.slice(0, 4);

  return (
    <>
      <Header />
      <main className="home-gateway">
        <section className="gateway-hero">
          <div className="gateway-hero-content">
            <span className="gateway-eyebrow">
              <Sparkles size={13} /> VENTA DE GARAJE & MUDANZA · BUENOS AIRES
            </span>
            <h1>
              Cosas que buscan<br />
              <em>nueva casa.</em>
            </h1>
            <p className="gateway-subtitle">
              Nos mudamos y dejamos ir muebles, vajilla, deco, tecnología y objetos con historia.
              Elegí cómo querés descubrirlas antes de ingresar:
            </p>
          </div>

          <div className="gateway-hero-doodle" aria-hidden="true">
            ✳<small>cosas con<br />historia</small>
          </div>
        </section>

        {/* The Two Choice Modes */}
        <section className="gateway-modes" aria-label="Elegí tu modo de navegación">
          {/* Option 1: Modo Catálogo */}
          <article className="gateway-card catalog-card">
            <div className="card-top-tag">
              <LayoutGrid size={15} />
              <span>VISTA CLÁSICA & ORGANIZADA</span>
            </div>

            <div className="card-body">
              <h2>Modo Catálogo</h2>
              <p className="card-desc">
                Ideal si querés ver todo junto, buscar algo puntual o filtrar por categorías (Casa, Deco, Muebles, Varios).
              </p>

              <ul className="card-features">
                <li>
                  <CheckCircle2 size={16} />
                  <span>Cuadrícula completa con precios y estados</span>
                </li>
                <li>
                  <CheckCircle2 size={16} />
                  <span>Buscador y filtros por categoría</span>
                </li>
                <li>
                  <CheckCircle2 size={16} />
                  <span>Deslizá las fotos de cada cosa sin abrirlas</span>
                </li>
              </ul>

              <div className="card-previews" aria-hidden="true">
                {previewProducts.slice(0, 3).map((p) => (
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
                <ArrowRight size={18} />
              </Link>
            </div>
          </article>

          {/* Option 2: Modo Swipe */}
          <article className="gateway-card swipe-card">
            <div className="card-top-tag tag-fire">
              <Flame size={16} />
              <span>INTERACTIVO ESTILO TINDER</span>
            </div>

            <div className="card-body">
              <div className="card-title-wrap">
                <h2>Modo Swipe</h2>
                <span className="card-badge-hot">🔥 Muy divertido</span>
              </div>
              <p className="card-desc">
                Un objeto a la vez en pantalla completa. Al ritmo de tu pulgar: derecha si te gusta, izquierda si pasás.
              </p>

              <ul className="card-features">
                <li>
                  <Zap size={16} />
                  <span><b>👉 Deslizá a la derecha:</b> sumás a tu selección</span>
                </li>
                <li>
                  <Compass size={16} />
                  <span><b>👈 Deslizá a la izquierda:</b> pasás al siguiente</span>
                </li>
                <li>
                  <Sparkles size={16} />
                  <span><b>⭐ Tocá el centro:</b> abrís fotos y descripción completa</span>
                </li>
              </ul>

              <div className="swipe-demo-pill" aria-hidden="true">
                <span className="demo-left">👈 Paso</span>
                <span className="demo-center">👆 Toca para ver</span>
                <span className="demo-right">👉 Lo quiero</span>
              </div>
            </div>

            <div className="card-footer">
              <Link href="/descubrir" className="mode-btn mode-btn-swipe">
                <Flame size={19} />
                <span>Entrar al Modo Swipe</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </article>
        </section>

        {/* Quick Highlights Bar */}
        <section className="gateway-stats-bar">
          <div className="stat-item">
            <Package size={20} />
            <div>
              <b>{availableCount} objetos</b>
              <span>Disponibles para llevar</span>
            </div>
          </div>
          <div className="stat-item">
            <ShoppingBag size={20} />
            <div>
              <b>Precios transparentes</b>
              <span>Sin vueltas, en pesos ARS</span>
            </div>
          </div>
          <div className="stat-item">
            <MessageCircle size={20} />
            <div>
              <b>WhatsApp directo</b>
              <span>Consultá y coordinamos entrega</span>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="gateway-steps">
          <p className="eyebrow">Pasos simples</p>
          <h3>¿Cómo conseguir tus cosas favoritas?</h3>
          <div className="steps-grid">
            <div className="step-card">
              <span className="step-num">01</span>
              <h4>Elegí tu modo</h4>
              <p>Mirá en el catálogo tradicional o divertite deslizando en el modo Swipe.</p>
            </div>
            <div className="step-card">
              <span className="step-num">02</span>
              <h4>Armá tu selección</h4>
              <p>Guardá las cosas que te gusten en tu selección para tenerlas a mano con el total.</p>
            </div>
            <div className="step-card">
              <span className="step-num">03</span>
              <h4>Consultá por WhatsApp</h4>
              <p>Tocá un botón y se abre una charla con la lista lista para coordinar el retiro o envío.</p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <span>
          SE VA<span>!</span>
        </span>
        <p>Hecho para que las cosas sigan circulando.</p>
        <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
          <Link href="/catalogo">Catálogo →</Link>
          <Link href="/descubrir">Modo Swipe 🔥 →</Link>
          <Link href="/como-comprar">Cómo comprar →</Link>
        </div>
      </footer>
    </>
  );
}
