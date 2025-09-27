/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse'],
  },
  // Configuration for static export (Netlify deployment)
  output: process.env.NODE_ENV === 'production' && process.env.DEPLOY_TARGET === 'netlify' ? 'export' : undefined,
  trailingSlash: true,
  // Disable server-side features for static export
  ...(process.env.DEPLOY_TARGET === 'netlify' && {
    distDir: 'out',
    images: {
      unoptimized: true,
    },
  }),
}

module.exports = nextConfig
