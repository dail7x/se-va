'use client';

import { Check, Share2 } from 'lucide-react';
import { useState } from 'react';
import { Product,formatPrice,statusLabel } from './data';
import {useSelection} from './SelectionProvider';

export default function ProductDetail({product}:{product:Product}) {
  const { add, has } = useSelection();
  const images = product.images?.length ? product.images : [product.image];
  const [activeImage, setActiveImage] = useState(images[0]);
  const saved = has(product.id);

  return (
    <main className="detail">
      <div className="detail-gallery">
        <div className="detail-image">
          <img src={activeImage} alt={product.title}/>
          <span className={'status '+product.status}>{statusLabel[product.status]}</span>
        </div>
        {images.length > 1 && (
          <div className="detail-thumbs" aria-label={`Galería de ${product.title}`}>
            {images.map((image, index) => (
              <button key={image} className={image===activeImage?'active':''} onClick={()=>setActiveImage(image)} aria-label={`Ver foto ${index + 1}`}>
                <img src={image} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="detail-copy">
        <p className="category">{product.category}</p>
        <h1>{product.title}</h1>
        <div className="detail-price">{formatPrice(product.price)}</div>
        <div className="detail-note"><b>Retiro o envío</b><span>Armá tu selección y después hacé la consulta por WhatsApp.</span></div>
        {product.status==='available'
          ? <div className="detail-actions"><button className={'primary-action '+(saved?'saved':'')} onClick={()=>add(product)}>{saved?<><Check size={18}/> En tu selección</>:<>Me lo llevo <span>→</span></>}</button></div>
          : <p className="gone">Esta cosa ya encontró nueva casa. <span>👋</span></p>}
        <p className="description">{product.description}</p>
        <button className="share" onClick={()=>navigator.share?.({title:product.title,url:location.href})}><Share2 size={16}/> Compartir esta cosa</button>
      </div>
    </main>
  );
}
