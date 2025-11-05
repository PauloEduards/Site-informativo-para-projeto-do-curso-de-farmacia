import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // O formato antigo 'domains: [...]' foi removido

    // Este é o novo formato correto:
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.mdsaude.com',
        port: '', 
        pathname: '/wp-content/uploads/**', 
      },
    ],
  },
};

export default nextConfig;