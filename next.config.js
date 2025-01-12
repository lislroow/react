/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  productionBrowserSourceMaps: process.env.NODE_ENV === 'production',
  compiler: {
    styledComponents: true,
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
};

module.exports = nextConfig;
