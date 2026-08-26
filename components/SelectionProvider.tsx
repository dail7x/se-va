'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { Product } from './data';
type Context = { selected: Product[]; toggle:(p:Product)=>void; has:(id:string)=>boolean; clear:()=>void };
const SelectionContext = createContext<Context>({selected:[],toggle:()=>{},has:()=>false,clear:()=>{}});
export function SelectionProvider({children}:{children:React.ReactNode}) { const [selected,setSelected]=useState<Product[]>([]); useEffect(()=>{try{setSelected(JSON.parse(localStorage.getItem('se-va-selection')||'[]'))}catch{}},[]); useEffect(()=>{localStorage.setItem('se-va-selection',JSON.stringify(selected))},[selected]); const toggle=(p:Product)=>setSelected(s=>s.some(x=>x.id===p.id)?s.filter(x=>x.id!==p.id):[...s,p]); return <SelectionContext.Provider value={{selected,toggle,has:id=>selected.some(p=>p.id===id),clear:()=>setSelected([])}}>{children}</SelectionContext.Provider> }
export const useSelection=()=>useContext(SelectionContext);
