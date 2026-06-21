/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.watchOptions = { ignored: /.*/ };
    return config;
  },
  // إضافة هذا السطر يحل تعارض Turbopack
  experimental: {
    turbopack: {}
  }
};

module.exports = nextConfig;
