import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",  // For optimizing Docker builds
};

export default nextConfig;
