import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Your existing config
  /* cacheComponents: true, */ 
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.clerk.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.img.clerk.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;