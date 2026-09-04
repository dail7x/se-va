'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Flame, MessageCircle, Plus, Trash2 } from 'lucide-react';
import Header from './Header';
import { formatPrice } from './data';
import { useSelection } from './SelectionProvider';
import { whatsappPhone } from '../lib/site';

export default function SelectionPage() {
  const [activeTab, setActiveTab] = useState<'selected' | 'interests'>('selected');
  const { selected, interests, toggle, removeInterest, moveToSelected, clear, clearInterests } = useSelection();

  const total = selected.reduce((sum, product) => sum + product.price, 0);
  const lines = selected.map((product) => `• ${product.title} — ${formatPrice(product.price)}`).join('%0A');
  const consultUrl = `https://wa.me/${whatsappPhone}?text=Hola%2C%20quiero%20consultar%20por%20estas%20cosas%3A%0A${lines}%0A%0A%C2%BFSiguen%20disponibles%3F%20%C2%BFC%C3%B3mo%20podemos%20coordinar%3F`;

  const interestLines = interests.map((product) => `• ${product.title} — ${formatPrice(product.price)}`).join('%0A');
  const interestUrl = `https://wa.me/${whatsappPhone}?text=Hola%2C%20estuve%20viendo%20estas%20cosas%20que%20me%20interesan%20(Puede%20ser)%3A%0A${interestLines}%0A%0A%C2%BFSiguen%20disponibles%3F`;

  return (
    <>
      <Header />
      <main className="selection-page">
        <p className="eyebrow">Tus objetos guardados</p>
        <h1>Me interesan<br /><em>varias cosas.</em></h1>

        <div className="selection-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'selected'}
            className={'tab-button ' + (activeTab === 'selected' ? 'active' : '')}
            onClick={() => setActiveTab('selected')}
          >
            Mi selección <span>{selected.length}</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'interests'}
            className={'tab-button ' + (activeTab === 'interests' ? 'active' : '')}
            onClick={() => setActiveTab('interests')}
          >
            Puede ser <span>{interests.length}</span>
          </button>
        </div>

        {activeTab === 'selected' ? (
          selected.length ? (
            <>
              <div className="selection-list">
                {selected.map((product) => (
                  <div className="selected-item" key={product.id}>
                    <img src={product.image} alt={product.title} />
                    <div>
                      <Link href={`/producto/${product.id}`}><b>{product.title}</b></Link>
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
                <a href={consultUrl} className="primary-action">
                  <MessageCircle size={18} /> Consultar por WhatsApp
                </a>
                <button className="clear-link" onClick={clear}>Vaciar selección</button>
              </div>
            </>
          ) : (
            <div className="selection-empty">
              <div>✦</div>
              <h2>Acá van tus cosas favoritas.</h2>
              <p>Guardá objetos mientras recorrés el catálogo o deslizás en el modo Swipe.</p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '18px' }}>
                <Link href="/catalogo" className="primary-action" style={{ padding: '10px 20px', borderRadius: '100px' }}>Ver el catálogo →</Link>
                <Link href="/descubrir" className="whatsapp" style={{ padding: '10px 20px', borderRadius: '100px' }}>Modo Swipe 🔥</Link>
              </div>
            </div>
          )
        ) : (
          interests.length ? (
            <>
              <div className="selection-list">
                {interests.map((product) => (
                  <div className="selected-item" key={product.id}>
                    <img src={product.image} alt={product.title} />
                    <div>
                      <Link href={`/producto/${product.id}`}><b>{product.title}</b></Link>
                      <span>{formatPrice(product.price)}</span>
                    </div>
                    <div className="item-interest-actions">
                      <button
                        className="move-btn"
                        onClick={() => moveToSelected(product)}
                        title="Pasar a mi selección"
                        aria-label={`Mover ${product.title} a selección`}
                      >
                        <Plus size={15} /> Lo quiero
                      </button>
                      <button onClick={() => removeInterest(product.id)} aria-label={`Quitar ${product.title}`}>
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="selection-actions" style={{ marginTop: '28px' }}>
                <a href={interestUrl} className="primary-action" style={{ background: '#4c5243' }}>
                  <MessageCircle size={18} /> Consultar por estos objetos
                </a>
                <button className="clear-link" onClick={clearInterests}>Vaciar lista de Puede ser</button>
              </div>
            </>
          ) : (
            <div className="selection-empty">
              <div>⭐</div>
              <h2>Nada en "Puede ser" todavía.</h2>
              <p>Cuando pruebes el <strong>Modo Swipe</strong>, podés tocar "Puede ser" en los objetos que te gusten para verlos más tarde.</p>
              <Link href="/descubrir" className="primary-action" style={{ display: 'inline-flex', padding: '12px 24px', borderRadius: '100px', marginTop: '20px' }}>
                <Flame size={18} /> Ir al Modo Swipe
              </Link>
            </div>
          )
        )}
      </main>
    </>
  );
}
