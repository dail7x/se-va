export type Status = 'available' | 'reserved' | 'sold';
export type Product = { id:string; title:string; category:string; price:number; status:Status; image:string; images:string[]; description:string; featured?:boolean; isPublic?:boolean };
export const products: Product[] = [];
export const categories = ['Todo','Casa','Muebles','Cocina','Decoración','Varios'];
export const formatPrice = (value:number) => new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(value);
export const statusLabel = { available:'Todavía está', reserved:'Casi se va', sold:'Se fue' };
