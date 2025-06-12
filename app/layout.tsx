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
