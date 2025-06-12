import '@fontsource/pacifico';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "TradeIQ - AI-Powered Trading Platform",
  description: 'TradeIQ is an AI-powered trading platform that uses machine learning to analyze market data and make trading decisions.',

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
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
} 