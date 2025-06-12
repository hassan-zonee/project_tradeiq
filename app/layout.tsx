import '@fontsource/pacifico';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: {
    default: 'TradeIQ - AI-Powered Trading Platform',
    template: '%s | TradeIQ',
  },
  description: 'Transform your trading with AI-powered market intelligence',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
    other: {
      rel: 'icon',
      url: '/favicon.ico',
    },
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
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
} 