import '@fontsource/pacifico';
import './globals.css'; // Import your global styles here if any
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
    url: 'https://yourdomain.com', // Replace with your actual domain
    siteName: 'TradeIQ',
    images: [{
      url: 'https://yourdomain.com/og-image.png', // ✅ Absolute path required
      width: 1200,
      height: 630,
      alt: 'TradeIQ OG Image',
    }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TradeIQ - AI-Powered Trading Platform',
    description: 'Transform your trading with AI-powered market intelligence',
    images: ['https://yourdomain.com/og-image.png'], // ✅ Absolute URL
  },
};

import Head from 'next/head';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <meta property="og:title" content="TradeIQ - AI-Powered Trading Platform" />
        <meta property="og:description" content="Transform your trading with AI-powered market intelligence" />
        <meta property="og:image" content="https://yourdomain.com/og-image.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TradeIQ - AI-Powered Trading Platform" />
        <meta name="twitter:description" content="Transform your trading with AI-powered market intelligence" />
        <meta name="twitter:image" content="https://yourdomain.com/og-image.png" />
      </Head>
      <body>{children}</body>
    </html>
  );
}
