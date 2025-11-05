// Arquivo: next.config.ts (Corrigido)

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // 1. O código 'domains: [...]' (que deve estar aqui) está obsoleto.
    
    // 2. Substitua pelo novo formato 'remotePatterns':
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.mdsaude.com',
        port: '', // Deixe vazio
        pathname: '/wp-content/uploads/**', // Permite todas as imagens dessa pasta
      },
    ],
  },
};

export default nextConfig;