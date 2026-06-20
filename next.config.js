/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.watchOptions = { ignored: /.*/ };
    return config;
  },
};
module.exports = nextConfig;
