import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Your existing config
  /* cacheComponents: true, */ 
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hgsmamluwdfiluoqpvsy.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;