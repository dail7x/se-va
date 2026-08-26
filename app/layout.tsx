import type { Metadata } from 'next';
import './globals.css';
import { SelectionProvider } from '../components/SelectionProvider';

export const metadata: Metadata = { title: 'SE VA! — Cosas que buscan nueva casa', description: 'Objetos con historia buscando su próximo hogar.' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es"><body><SelectionProvider>{children}</SelectionProvider></body></html>;
}
