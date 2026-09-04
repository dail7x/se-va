'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, LayoutGrid, Search, ShoppingBag } from 'lucide-react';
import { useSelection } from './SelectionProvider';

export default function Header({ onSearch }: { onSearch?: () => void }) {
  const { selected } = useSelection();
  const pathname = usePathname();
  const isCatalog = pathname === '/catalogo';

  return (
    <header className="site-header">
      <Link href="/" className="logo">
        SE VA<span>!</span>
        <small>Cosas que buscan nueva casa.</small>
      </Link>
      <nav>
        {onSearch && (
          <button aria-label="Buscar" onClick={onSearch} className="search-btn-header">
            <Search size={20} />
          </button>
        )}
        {isCatalog ? (
          <Link href="/" className="swipe-header-link" title="Descubrir objetos deslizando">
            <Flame size={17} />
            <span>Modo Swipe</span>
          </Link>
        ) : (
          <Link href="/catalogo" className="header-catalog-btn" title="Ver artículos en Modo catálogo">
            <LayoutGrid size={16} />
            <span>Modo catálogo</span>
          </Link>
        )}
        <Link href="/seleccion" className="selection-link">
          <ShoppingBag size={19} />
          <span>Mi selección</span>
          {selected.length > 0 && <i>{selected.length}</i>}
        </Link>
      </nav>
    </header>
  );
}
