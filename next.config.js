/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Simplified configuration that works well with Vercel
  webpack: (config) => {
    config.resolve.extensions.push('.ts', '.tsx', '.js', '.json');
    return config;
  }
};

module.exports = nextConfig; 