/** @type {import('next').NextConfig} */
const isNetlify = process.env.DEPLOY_TARGET === 'netlify';

const nextConfig = {
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    unoptimized: isNetlify,
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
  ...(isNetlify && {
    output: 'export',
    trailingSlash: true,
    distDir: 'out',
  }),
}

module.exports = nextConfig
