/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['ordinals.com', 'magiceden.io', 'api.coinmarketcap.com', 'api.ordiscan.com'],
    unoptimized: true,
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@tremor/react', 'recharts'],
    // Isso ajuda a evitar erros 500 em produção
    serverComponentsExternalPackages: ['axios', '@supabase/supabase-js'],
  },
  // Configuração para o App Router
  output: 'standalone',
  // Ignorar erros durante o build
  typescript: {
    ignoreBuildErrors: true,
    tsconfigPath: './tsconfig.json',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configuração para lidar com erros
  onDemandEntries: {
    // Período em ms em que uma página deve permanecer no buffer
    maxInactiveAge: 25 * 1000,
    // Número de páginas que devem ser mantidas em buffer
    pagesBufferLength: 4,
  },
  // Configuração para lidar com timeouts
  serverRuntimeConfig: {
    // Configurações disponíveis apenas no servidor
    apiTimeout: 10000, // 10 segundos
  },
  publicRuntimeConfig: {
    // Configurações disponíveis no cliente e no servidor
    apiBaseUrl: process.env.API_BASE_URL || 'https://api.example.com',
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
      buffer: false,
    };

    // Ignorar módulos não encontrados durante o build
    config.ignoreWarnings = [
      { module: /node_modules/ },
      { message: /Can't resolve/ },
    ];

    return config;
  },

  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig