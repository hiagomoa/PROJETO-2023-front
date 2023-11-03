/** @type {import('next').NextConfig} */
module.exports = {
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    API_SIMILARITY: process.env.API_SIMILARITY,
  },
  reactStrictMode: false,
};
