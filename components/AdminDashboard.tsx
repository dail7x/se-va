'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Edit3, Eye, LogOut, Plus, Save, Trash2, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '../lib/supabase/client';
import { categories as defaultCategories, formatPrice, statusLabel, type Status } from './data';

type AdminProduct = {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: Status;
  price_cents: number;
  is_featured: boolean;
  is_public: boolean;
  categories: { name: string } | null;
  product_images: { id: string; storage_path: string; sort_order?: number | null }[];
};

const blank = {
  id: '',
  title: '',
  slug: '',
  description: '',
  status: 'available' as Status,
  price: '',
  category: 'Casa',
  images: [] as string[],
  is_featured: false,
  is_public: true,
};

function sortedImages(product: AdminProduct) {
  return [...(product.product_images || [])].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
}

export default function AdminDashboard() {
  const router = useRouter();
  const [sessionToken, setSessionToken] = useState('');
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [form, setForm] = useState(blank);
  const [manualImage, setManualImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const metrics = useMemo(() => ({
    total: products.length,
    available: products.filter(product => product.status === 'available').length,
    reserved: products.filter(product => product.status === 'reserved').length,
    sold: products.filter(product => product.status === 'sold').length,
  }), [products]);

  useEffect(() => {
    async function boot() {
      const supabase = createBrowserSupabaseClient();
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace('/admin/login');
        return;
      }
      setSessionToken(data.session.access_token);
    }
    boot();
  }, [router]);

  useEffect(() => {
    if (sessionToken) loadProducts(sessionToken);
  }, [sessionToken]);

  async function loadProducts(token = sessionToken) {
    setLoading(true);
    setError('');
    const response = await fetch('/api/admin/products', { headers: { Authorization: `Bearer ${token}` } });
    if (response.status === 401 || response.status === 403) {
      router.replace('/admin/login');
      return;
    }
    const data = await response.json();
    if (!response.ok) setError(data.error || 'No pudimos cargar los artículos.');
    else setProducts(data.products || []);
    setLoading(false);
  }

  function resetForm() {
    setForm(blank);
    setManualImage('');
  }

  function editProduct(product: AdminProduct) {
    setForm({
      id: product.id,
      title: product.title,
      slug: product.slug,
      description: product.description,
      status: product.status,
      price: String(Math.round(product.price_cents / 100)),
      category: product.categories?.name || 'Varios',
      images: sortedImages(product).map((image) => image.storage_path),
      is_featured: product.is_featured,
      is_public: product.is_public,
    });
    setManualImage('');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function addImage(url: string) {
    const cleanUrl = url.trim();
    if (!cleanUrl) return;
    setForm((current) => current.images.includes(cleanUrl) ? current : { ...current, images: [...current.images, cleanUrl] });
    setManualImage('');
  }

  function removeImage(url: string) {
    setForm((current) => ({ ...current, images: current.images.filter((image) => image !== url) }));
  }

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');

    const response = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionToken}` },
      body: JSON.stringify({ ...form, price: Number(form.price) }),
    });
    const data = await response.json();
    if (!response.ok) setError(data.error || 'No pudimos guardar el artículo.');
    else {
      resetForm();
      await loadProducts();
    }
    setSaving(false);
  }

  async function uploadImages(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError('');

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${sessionToken}` },
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'No pudimos subir una imagen.');
        setUploading(false);
        return;
      }
      addImage(data.url);
    }

    setUploading(false);
  }

  async function removeProduct(id: string) {
    if (!confirm('¿Eliminar este artículo?')) return;
    const response = await fetch(`/api/admin/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${sessionToken}` } });
    if (!response.ok) {
      const data = await response.json();
      setError(data.error || 'No pudimos eliminar el artículo.');
      return;
    }
    await loadProducts();
  }

  async function signOut() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.replace('/admin/login');
  }

  return (
    <main className="admin">
      <header className="admin-header">
        <Link className="logo" href="/">SE VA<span>!</span></Link>
        <span>Panel de casa</span>
        <Link href="/catalogo">Ver catálogo →</Link>
        <button className="icon-button" onClick={signOut} aria-label="Salir"><LogOut size={17}/></button>
      </header>
      <div className="admin-inner">
        <div className="admin-title">
          <div><p className="eyebrow">Mi inventario</p><h1>Todo en su lugar.</h1></div>
          <button className="primary-action" onClick={resetForm}><Plus size={17}/> Nueva cosa</button>
        </div>
        <div className="metrics">
          <div><b>{metrics.total}</b><span>Cosas en total</span></div>
          <div><b>{metrics.available}</b><span>Todavía están</span></div>
          <div><b>{metrics.reserved}</b><span>Casi se van</span></div>
          <div><b>{metrics.sold}</b><span>Se fueron</span></div>
        </div>
        {error&&<p className="form-error">{error}</p>}
        <section className="admin-grid">
          <form className="product-form" onSubmit={saveProduct}>
            <div className="form-title">
              <h2>{form.id?'Editar cosa':'Nueva cosa'}</h2>
              {form.id&&<button type="button" onClick={resetForm}><X size={17}/> Cancelar</button>}
            </div>
            <label>Título<input value={form.title} onChange={event=>setForm({...form,title:event.target.value})} required/></label>
            <label>Slug<input value={form.slug} onChange={event=>setForm({...form,slug:event.target.value})} placeholder="se-genera-si-lo-dejas-vacio"/></label>
            <label>Precio ARS<input type="number" min="0" value={form.price} onChange={event=>setForm({...form,price:event.target.value})} required/></label>
            <label>Categoría<select value={form.category} onChange={event=>setForm({...form,category:event.target.value})}>{defaultCategories.filter(category=>category!=='Todo').map(category=><option key={category}>{category}</option>)}</select></label>
            <label>Estado<select value={form.status} onChange={event=>setForm({...form,status:event.target.value as Status})}><option value="available">Todavía está</option><option value="reserved">Casi se va</option><option value="sold">Se fue</option></select></label>
            <div className="image-field">
              <span className="field-label">Fotos</span>
              <label className="upload-control"><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple onChange={event=>uploadImages(event.target.files)}/><Upload size={17}/>{uploading?'Subiendo...':'Subir fotos'}</label>
              <div className="manual-image">
                <input value={manualImage} onChange={event=>setManualImage(event.target.value)} placeholder="O pegá una URL de imagen"/>
                <button type="button" onClick={()=>addImage(manualImage)}>Agregar URL</button>
              </div>
              {form.images.length > 0 && (
                <div className="image-previews">
                  {form.images.map((image, index) => (
                    <div key={image} className="image-preview-item">
                      <img src={image} alt={`Foto ${index + 1}`} />
                      <span>{index === 0 ? 'Principal' : `Foto ${index + 1}`}</span>
                      <button type="button" onClick={()=>removeImage(image)} aria-label="Quitar foto"><X size={15}/></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <label>Descripción<textarea value={form.description} onChange={event=>setForm({...form,description:event.target.value})} rows={5}/></label>
            <div className="switches">
              <label><input type="checkbox" checked={form.is_public} onChange={event=>setForm({...form,is_public:event.target.checked})}/> Publicado</label>
              <label><input type="checkbox" checked={form.is_featured} onChange={event=>setForm({...form,is_featured:event.target.checked})}/> Destacado</label>
            </div>
            <button className="primary-action" disabled={saving||uploading}><Save size={17}/>{saving?'Guardando...':'Guardar cosa'}</button>
          </form>
          <div className="admin-table">
            <div className="table-head"><span>Cosa</span><span>Estado</span><span>Precio</span><span>Acción</span></div>
            {loading?<p className="table-note">Cargando inventario...</p>:products.map(product=>{
              const images = sortedImages(product);
              return <div className="table-row" key={product.id}><div className="admin-product"><img src={images[0]?.storage_path || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=85'} alt=""/><div><b>{product.title}</b><small>{product.categories?.name || 'Varios'} · {images.length} foto{images.length === 1 ? '' : 's'}{!product.is_public?' · oculto':''}</small></div></div><span className={'status '+product.status}>{statusLabel[product.status]}</span><span>{formatPrice(Math.round(product.price_cents/100))}</span><div className="row-actions"><Link href={'/producto/'+product.slug} aria-label="Ver"><Eye size={16}/></Link><button onClick={()=>editProduct(product)} aria-label="Editar"><Edit3 size={16}/></button><button onClick={()=>removeProduct(product.id)} aria-label="Eliminar"><Trash2 size={16}/></button></div></div>
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
