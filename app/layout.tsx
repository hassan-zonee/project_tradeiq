import '@fontsource/pacifico';
import './globals.css';

export const metadata = {
  title: "TradeIQ",
  description: 'Transform your trading with AI-powered market intelligence',
  openGraph: {
    title: 'TradeIQ',
    description: 'Transform your trading with AI-powered market intelligence',
    images: [
      {
        url: '/og-image.png',
        width: 512,
        height: 512,
        alt: 'TradeIQ - AI-Powered Trading Platform',
      },
    ],
  },
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
      <body>
        {children}
      </body>
    </html>
  );
}
