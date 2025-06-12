import '@fontsource/pacifico';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'TradeIQ',
  },
  description: 'TradeIQ is an AI-powered trading platform',
  icons: {
    icon: '/favicon.ico',
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
      <body>{children}</body>
    </html>
  );
} 