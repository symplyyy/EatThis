/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
    ],
    // Optimisation pour Vercel
    formats: ['image/avif', 'image/webp'],
  },
  // Optimisation pour Vercel
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig

