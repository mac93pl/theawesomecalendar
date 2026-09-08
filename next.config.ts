import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // PL and EN have separate root layouts; route misses need their own document.
  experimental: { globalNotFound: true },
};

export default nextConfig;
