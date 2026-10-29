// @ts-check
import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['immonova.kinde.com', 'cdn.pixabay.com', 'images.unsplash.com', 'source.unsplash.com', 'unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // ... autres configurations existantes
};

export default withSentryConfig(nextConfig, {}); 