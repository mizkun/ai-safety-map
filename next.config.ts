import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/ai-safety-map',
  trailingSlash: true,
  images: { unoptimized: true },
};
export default nextConfig;
