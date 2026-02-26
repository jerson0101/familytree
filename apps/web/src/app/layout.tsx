import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'KinTree - Family Operating System',
    template: '%s | KinTree',
  },
  description: 'Connect, protect, and celebrate your family with genealogy, real-time safety, and social features.',
  keywords: ['family tree', 'genealogy', 'family safety', 'family social'],
  authors: [{ name: 'KinTree' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'KinTree',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0ea5e9',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} font-sans h-full bg-neutral-50 text-neutral-900`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
