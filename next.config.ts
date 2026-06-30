import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lint is run separately; do not fail production builds on lint errors
  // (demo mock data uses Math.random, recharts tooltip pattern, etc.)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
