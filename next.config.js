/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true, // This helps with Netlify deployment
    domains: [],
  },
  trailingSlash: true, // This helps with routing on Netlify
  // Make sure to handle rewrites for Netlify properly
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
      },
      {
        source: '/',
        destination: '/',
      },
    ];
  },
  // Static optimization for faster Netlify builds
  output: 'standalone',
};

module.exports = nextConfig; 