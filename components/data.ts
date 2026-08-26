export type Status = 'available' | 'reserved' | 'sold';
export type Product = { id:string; title:string; category:string; price:number; status:Status; image:string; description:string; featured?:boolean; isPublic?:boolean };
export const products: Product[] = [
 {id:'lampara-luna',title:'Lámpara Luna',category:'Casa',price:30000,status:'available',image:'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85',description:'Una luz suave para noches de lectura y sobremesas largas.',featured:true},
 {id:'sillon-mostaza',title:'Sillón mostaza',category:'Muebles',price:85000,status:'available',image:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85',description:'Cómodo, con personalidad y listo para una nueva casa.',featured:true},
 {id:'camara-analogica',title:'Cámara analógica',category:'Varios',price:45000,status:'reserved',image:'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85',description:'Para guardar momentos que no necesitan filtro.'},
 {id:'vajilla-floreada',title:'Vajilla floreada',category:'Cocina',price:22000,status:'available',image:'https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=900&q=85',description:'Seis platos que hacen que cualquier mesa se sienta especial.'},
 {id:'radio-madera',title:'Radio de madera',category:'Varios',price:18000,status:'sold',image:'https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?auto=format&fit=crop&w=900&q=85',description:'Todavía no sabemos si suena mejor o se ve mejor.'},
 {id:'espejo-sol',title:'Espejo sol',category:'Decoración',price:38000,status:'available',image:'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=85',description:'Un pequeño sol para iluminar una pared vacía.'},
];
export const categories = ['Todo','Casa','Muebles','Cocina','Decoración','Varios'];
export const formatPrice = (value:number) => new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(value);
export const statusLabel = { available:'Todavía está', reserved:'Casi se va', sold:'Se fue' };
