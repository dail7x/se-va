'use client';

import Link from 'next/link';
import { Check, ShoppingBag } from 'lucide-react';
import { Product, formatPrice, statusLabel } from './data';
import { useSelection } from './SelectionProvider';

export default function ProductCard({product}:{product:Product}) {
  const { add, has } = useSelection();
  const saved = has(product.id);
  const images = product.images?.length ? product.images : [product.image];
  const thumbs = images.slice(1, 4);

  return (
    <article className="product-card">
      <Link href={'/producto/'+product.id} className="product-image">
        <img src={product.image} alt="" />
        <span className={'status '+product.status}>{statusLabel[product.status]}</span>
      </Link>
      {thumbs.length > 0 && (
        <div className="product-thumbs" aria-label={`Más fotos de ${product.title}`}>
          {thumbs.map((image, index) => <img key={image} src={image} alt={`${product.title} foto ${index + 2}`} />)}
        </div>
      )}
      <div className="product-copy">
        <div>
          <p className="category">{product.category}</p>
          <Link href={'/producto/'+product.id}><h3>{product.title}</h3></Link>
          <strong>{formatPrice(product.price)}</strong>
        </div>
        {product.status==='available'&&(
          <button className={'want-button '+(saved?'saved':'')} onClick={()=>add(product)}>
            {saved ? <Check size={17}/> : <ShoppingBag size={17}/>}
            {saved ? 'En selección' : 'Lo quiero'}
          </button>
        )}
      </div>
    </article>
  );
}
