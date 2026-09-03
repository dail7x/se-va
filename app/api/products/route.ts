import { NextResponse } from 'next/server';
import { getPublicProducts } from '../../../lib/products';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await getPublicProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching public products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
