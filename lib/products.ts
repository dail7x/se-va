import { createClient } from '@supabase/supabase-js';
import { unstable_noStore as noStore } from 'next/cache';
import { products as demoProducts, type Product } from '../components/data';
import { createServiceSupabaseClient } from './supabase/server';

type ProductRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: Product['status'];
  price_cents: number;
  is_featured: boolean;
  is_public: boolean;
  categories: { name: string } | { name: string }[] | null;
  product_images: { storage_path: string }[];
};

export function mapProduct(row: ProductRow): Product {
  const category = Array.isArray(row.categories) ? row.categories[0] : row.categories;

  return {
    id: row.slug,
    title: row.title,
    category: category?.name || 'Varios',
    price: Math.round(row.price_cents / 100),
    status: row.status,
    image: row.product_images?.[0]?.storage_path || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=85',
    description: row.description,
    featured: row.is_featured,
    isPublic: row.is_public,
  };
}

function hasSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function getPublicProducts(): Promise<Product[]> {
  noStore();

  if (!hasSupabaseEnv()) return demoProducts;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { data, error } = await supabase
    .from('products')
    .select('id,title,slug,description,status,price_cents,is_featured,is_public,categories(name),product_images(storage_path)')
    .eq('is_public', true)
    .not('status', 'in', '("draft","archived")')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data?.map((row) => mapProduct(row as unknown as ProductRow)) || [];
}

export async function getPublicProduct(slug: string): Promise<Product | null> {
  const all = await getPublicProducts();
  return all.find((product) => product.id === slug) || null;
}

export async function getAdminProducts() {
  const supabase = createServiceSupabaseClient();
  const { data, error } = await supabase
    .from('products')
    .select('id,title,slug,description,status,price_cents,is_featured,is_public,category_id,categories(name),product_images(id,storage_path)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
