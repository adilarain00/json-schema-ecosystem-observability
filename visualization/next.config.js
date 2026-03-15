/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   turbo: false, // Disable Turbopack for stability
  // },
  reactStrictMode: true,
  images: {
    unoptimized: true, // For Vercel static export compatibility
  },
};

module.exports = nextConfig;
