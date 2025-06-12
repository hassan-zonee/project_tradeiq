import '@fontsource/pacifico';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TradeIQ - AI-Powered Trading Platform',
  description: 'Transform your trading with AI-powered market intelligence',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' }
    ],
    shortcut: ['/favicon.ico'],
    apple: ['/favicon.ico'],
  },
  openGraph: {
    title: 'TradeIQ - AI-Powered Trading Platform',
    description: 'Transform your trading with AI-powered market intelligence',
    images: [{
      url: '/logo.png',
      width: 1200,
      height: 630,
      alt: 'TradeIQ Logo'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TradeIQ - AI-Powered Trading Platform',
    description: 'Transform your trading with AI-powered market intelligence',
    images: ['/logo.png'],
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico" />
      <title>TradeIQ - AI Powered Trading Platform</title>
      <body>{children}</body>
    </html>
  );
} 