'use client';

import Link from 'next/link';
import { MessageCircle, Trash2 } from 'lucide-react';
import Header from './Header';
import { formatPrice } from './data';
import { useSelection } from './SelectionProvider';
import { whatsappPhone } from '../lib/site';

export default function SelectionPage() {
  const { selected, toggle, clear } = useSelection();
  const total = selected.reduce((sum, product) => sum + product.price, 0);
  const lines = selected.map((product) => `• ${product.title} — ${formatPrice(product.price)}`).join('%0A');
  const offerUrl = `https://wa.me/${whatsappPhone}?text=Hola%2C%20quiero%20hacer%20una%20oferta%20por%3A%0A${lines}%0A%0AMi%20oferta%20es%3A%20%24`;
  const availabilityUrl = `https://wa.me/${whatsappPhone}?text=Hola%2C%20me%20interesan%20estas%20cosas%3A%0A${lines}%0A%0A%C2%BFSiguen%20disponibles%3F`;

  return (
    <>
      <Header />
      <main className="selection-page">
        <p className="eyebrow">Tu selección</p>
        <h1>Me interesan<br /><em>varias cosas.</em></h1>
        {selected.length ? (
          <>
            <div className="selection-list">
              {selected.map((product) => (
                <div className="selected-item" key={product.id}>
                  <img src={product.image} alt="" />
                  <div>
                    <b>{product.title}</b>
                    <span>{formatPrice(product.price)}</span>
                  </div>
                  <button onClick={() => toggle(product)} aria-label={`Quitar ${product.title}`}>
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>
            <div className="selection-total">
              <span>Total publicado</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <div className="selection-actions">
              <a href={offerUrl} className="primary-action">
                <MessageCircle size={18} /> Hacer oferta por WhatsApp
              </a>
              <a href={availabilityUrl} className="offer-link">Preguntar disponibilidad</a>
              <button className="clear-link" onClick={clear}>Vaciar selección</button>
            </div>
          </>
        ) : (
          <div className="selection-empty">
            <div>✦</div>
            <h2>Acá van tus cosas favoritas.</h2>
            <p>Guardá objetos mientras recorrés el catálogo. Esta selección vive solo en este navegador.</p>
            <Link href="/">Ver el catálogo →</Link>
          </div>
        )}
      </main>
    </>
  );
}
