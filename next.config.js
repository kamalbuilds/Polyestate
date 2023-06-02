/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['cloudflare-ipfs.com'],
  },
};

module.exports = nextConfig;
