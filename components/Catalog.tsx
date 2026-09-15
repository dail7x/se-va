'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, Flame, Search } from 'lucide-react';
import Header from './Header';
import ProductCard from './ProductCard';
import { categories as baseCategories, type Product } from './data';

export default function Catalog({ products }: { products: Product[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todo');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const categories = useMemo(
    () => Array.from(new Set([...baseCategories, ...products.map((p) => p.category)])),
    [products]
  );

  const availableCount = useMemo(
    () => products.filter((p) => p.status === 'available').length,
    [products]
  );

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (!onlyAvailable || p.status === 'available') &&
          (category === 'Todo' || p.category === category) &&
          (!query || `${p.title} ${p.category}`.toLowerCase().includes(query.toLowerCase()))
      ),
    [query, category, onlyAvailable, products]
  );

  return (
    <>
      <Header onSearch={() => document.getElementById('search')?.focus()} />
      <main className="catalog">
        <section className="hero">
          <div>
            <p className="eyebrow">Venta de garaje · Buenos Aires</p>
            <h1>
              Cosas que buscan<br />
              <em>nueva casa.</em>
            </h1>
            <p className="hero-note">
              Objetos lindos, usados y listos para volver a ser parte de una historia.
            </p>
            <div className="hero-actions">
              <Link href="/descubrir" className="hero-swipe-btn">
                <Flame size={17} /> Explorar en Modo Swipe
              </Link>
            </div>
          </div>
          <div className="hero-doodle">
            ✳<small>cosas con<br />historia</small>
          </div>
        </section>

        <section className="toolbar">
          <div className="search-wrap">
            <Search size={19} />
            <input
              id="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="¿Qué estás buscando?"
            />
          </div>
          <div className="filter-available-wrapper">
            <button
              type="button"
              className={`chip-available-toggle ${onlyAvailable ? 'active' : ''}`}
              onClick={() => setOnlyAvailable(!onlyAvailable)}
              aria-pressed={onlyAvailable}
              title={onlyAvailable ? 'Mostrar todos los artículos' : 'Ver únicamente artículos disponibles'}
            >
              <span className="available-status-dot" />
              <span>Solo disponibles</span>
              <span className="available-badge-count">{availableCount}</span>
            </button>
          </div>
          <div className="chips">
            {categories.map((c) => (
              <button
                key={c}
                className={category === c ? 'active' : ''}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        <div className="catalog-heading">
          <p>
            <b>{filtered.length}</b> {onlyAvailable ? 'cosas disponibles' : 'cosas esperando que las encuentres'}
            {onlyAvailable && (
              <button
                type="button"
                className="clear-available-filter-link"
                onClick={() => setOnlyAvailable(false)}
              >
                (Mostrar todas)
              </button>
            )}
          </p>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <Link href="/descubrir" className="swipe-inline-cue">
              <Flame size={15} /> Modo Swipe
            </Link>
            <button className="sort">
              Más recientes <ArrowDown size={15} />
            </button>
          </div>
        </div>

        {filtered.length ? (
          <div className="product-grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <span>⌂</span>
            <h2>No encontramos esa cosa</h2>
            <p>
              {onlyAvailable
                ? 'Probá desactivando el filtro "Solo disponibles" o cambiando de categoría.'
                : 'Probá con otra palabra o mirá todo lo que todavía está.'}
            </p>
            {onlyAvailable && (
              <button
                type="button"
                className="clear-filter-btn"
                onClick={() => {
                  setOnlyAvailable(false);
                  setCategory('Todo');
                  setQuery('');
                }}
              >
                Mostrar todos los artículos
              </button>
            )}
          </div>
        )}
      </main>

      <footer>
        <span>
          SE VA<span>!</span>
        </span>
        <p>Hecho para que las cosas sigan circulando.</p>
        <div style={{ display: 'flex', gap: '18px' }}>
          <Link href="/descubrir">Modo Swipe →</Link>
          <a href="/como-comprar">Cómo comprar →</a>
        </div>
      </footer>
    </>
  );
}
