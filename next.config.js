/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.watchOptions = { ignored: /.*/ };
    return config;
  },
  // هذا السطر يخبر Next.js 16 أننا نعرف وجود Turbopack
  experimental: {
    turbopack: {}
  }
};

module.exports = nextConfig;
