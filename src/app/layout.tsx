import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'DESPERTA - Lázaro, vem pra fora! | Inscrições',
  description:
    'Inscrição para o encontro DESPERTA da Renovação Carismática Católica na Paróquia São Francisco de Assis em Queimados. Dia 29/11 a partir das 07:30.',
  openGraph: {
    title: 'DESPERTA - Lázaro, vem pra fora!',
    description: 'Inscrição para o evento de jovens e fiéis em Queimados. Garanta sua vaga!',
    images: ['/cartaz-desperta.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
