import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <title>TradeIQ</title>
        <meta name="description" content="Transform your trading with AI-powered market intelligence" />
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph */}
        <meta property="og:title" content="TradeIQ" />
        <meta property="og:description" content="Transform your trading with AI-powered market intelligence" />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TradeIQ" />
        <meta name="twitter:description" content="Transform your trading with AI-powered market intelligence" />
        <meta name="twitter:image" content="/og-image.png" />
      </Head>
      <Component {...pageProps} />
      <Toaster />
    </AuthProvider>
  );
}

export default MyApp;
