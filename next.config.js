/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  experimental: {
    esmExternals: 'loose',
    serverComponentsExternalPackages: [],
  },
  webpack: (config) => {
    config.resolve.extensions.push('.ts', '.tsx', '.js', '.json');
    
    // Add .json handling explicitly
    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
    });
    
    return config;
  },
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  },
  serverActions: {
    bodySizeLimit: '2mb',
  },
};

module.exports = nextConfig; 