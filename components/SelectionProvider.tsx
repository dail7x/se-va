'use client';

import Link from 'next/link';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { MessageCircle, ShoppingBag, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Product, formatPrice } from './data';
import { whatsappPhone } from '../lib/site';

type Context = {
  selected: Product[];
  toggle: (product: Product) => void;
  add: (product: Product) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
};

const SelectionContext = createContext<Context>({
  selected: [],
  toggle: () => {},
  add: () => {},
  remove: () => {},
  has: () => false,
  clear: () => {},
});

function buildOfferUrl(selected: Product[]) {
  const lines = selected.map((product) => `• ${product.title} — ${formatPrice(product.price)}`).join('%0A');
  return `https://wa.me/${whatsappPhone}?text=Hola%2C%20quiero%20hacer%20una%20oferta%20por%3A%0A${lines}%0A%0AMi%20oferta%20es%3A%20%24`;
}

function SelectionDock({ selected, clear }: { selected: Product[]; clear: () => void }) {
  const pathname = usePathname();
  const total = useMemo(() => selected.reduce((sum, product) => sum + product.price, 0), [selected]);

  if (!selected.length || pathname.startsWith('/admin') || pathname === '/seleccion') return null;

  return (
    <aside className="selection-dock" aria-label="Resumen de selección">
      <div className="dock-items">
        <ShoppingBag size={18} />
        <div>
          <b>{selected.length} {selected.length === 1 ? 'cosa elegida' : 'cosas elegidas'}</b>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="dock-thumbs" aria-hidden="true">
          {selected.slice(0, 3).map((product) => <img key={product.id} src={product.image} alt="" />)}
        </div>
      </div>
      <a className="dock-cta" href={buildOfferUrl(selected)}><MessageCircle size={17} /> Hacer oferta</a>
      <Link className="dock-secondary" href="/seleccion">Ver selección</Link>
      <button className="dock-clear" onClick={clear} aria-label="Vaciar selección"><X size={16} /></button>
    </aside>
  );
}

export function SelectionProvider({children}:{children:React.ReactNode}) {
  const [selected, setSelected] = useState<Product[]>([]);
  const [toast, setToast] = useState('');

  useEffect(() => {
    try {
      setSelected(JSON.parse(localStorage.getItem('se-va-selection') || '[]'));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('se-va-selection', JSON.stringify(selected));
  }, [selected]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const add = (product: Product) => setSelected((current) => {
    if (current.some((item) => item.id === product.id)) return current;
    setToast(`${product.title} se agregó a tu selección.`);
    return [...current, product];
  });

  const remove = (id: string) => setSelected((current) => current.filter((product) => product.id !== id));

  const toggle = (product: Product) => setSelected((current) => {
    if (current.some((item) => item.id === product.id)) return current.filter((item) => item.id !== product.id);
    setToast(`${product.title} se agregó a tu selección.`);
    return [...current, product];
  });

  return (
    <SelectionContext.Provider value={{ selected, toggle, add, remove, has: id => selected.some(product => product.id === id), clear: () => setSelected([]) }}>
      {children}
      {toast && <div className="selection-toast" role="status">{toast}</div>}
      <SelectionDock selected={selected} clear={() => setSelected([])} />
    </SelectionContext.Provider>
  );
}

export const useSelection = () => useContext(SelectionContext);
