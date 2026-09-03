export type Status = 'available' | 'reserved' | 'sold';
export type Product = { id:string; title:string; category:string; price:number; status:Status; image:string; images:string[]; description:string; featured?:boolean; isPublic?:boolean };
export const products: Product[] = [
  {
    id: 'lampara-luna',
    title: 'Lámpara Luna',
    category: 'Casa',
    price: 30000,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=85',
    ],
    description: 'Una luz suave y cálida para noches de lectura y sobremesas largas. Estructura de cerámica esmaltada con tulipa opalina intacta.',
    featured: true,
  },
  {
    id: 'sillon-mostaza',
    title: 'Sillón mostaza',
    category: 'Muebles',
    price: 85000,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=85',
    ],
    description: 'Cómodo, con personalidad y listo para una nueva casa. Tapizado en pana aterciopelada color mostaza en excelente estado.',
    featured: true,
  },
  {
    id: 'camara-analogica',
    title: 'Cámara analógica',
    category: 'Varios',
    price: 45000,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=85',
    ],
    description: 'Para guardar momentos que no necesitan filtro. Mecánica pura de los años 70 con lente 50mm f/1.8 limpio.',
    featured: true,
  },
  {
    id: 'vajilla-floreada',
    title: 'Vajilla floreada',
    category: 'Cocina',
    price: 22000,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=85',
    ],
    description: 'Seis platos hondos y seis playos que hacen que cualquier mesa se sienta especial y de domingo en familia.',
  },
  {
    id: 'espejo-sol',
    title: 'Espejo sol vintage',
    category: 'Decoración',
    price: 38000,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=85',
    ],
    description: 'Un pequeño sol dorado para iluminar una pared vacía. Marco de metal dorado envejecido con pátina original.',
  },
  {
    id: 'radio-madera',
    title: 'Radio de madera',
    category: 'Varios',
    price: 18000,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=85',
    ],
    description: 'Todavía no sabemos si suena mejor o se ve mejor. Gabinete de nogal pulido con dial iluminado.',
  },
  {
    id: 'mesa-ratona',
    title: 'Mesa ratona de petiribí',
    category: 'Muebles',
    price: 52000,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=1200&q=85',
    ],
    description: 'Líneas limpias, madera maciza de petiribí recuperada con acabado al aceite natural.',
  },
  {
    id: 'cafetera-italiana',
    title: 'Cafetera italiana esmaltada',
    category: 'Cocina',
    price: 16000,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85',
    ],
    description: 'Para arrancar las mañanas con aroma a café de verdad. Esmaltado retro color crema con pomo de madera.',
  },
];
export const categories = ['Todo','Casa','Muebles','Cocina','Decoración','Varios'];
export const formatPrice = (value:number) => new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(value);
export const statusLabel = { available:'Todavía está', reserved:'Casi se va', sold:'Se fue' };
