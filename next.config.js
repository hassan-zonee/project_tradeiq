/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/binance-api/:path*',
        destination: 'https://api.binance.com/:path*',
      },
    ]
  },
};

export default nextConfig;
