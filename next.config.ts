import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: '*.xx.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'scontent**.fna.fbcdn.net',
      }
    ],
  },
  // Optional: This helps Netlify handle the image optimization overhead
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;