import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable Turbopack configuration to avoid mixed config error
  turbopack: {},
  webpack(config, { dev }) {
    if (dev) {
      // Avoid crashing on invalid third-party source maps during dev
      config.devtool = false;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (config as any).ignoreWarnings = [
        /Failed to parse source map/i,
        /Invalid source map/i,
        /Could not parse source map/i,
      ];
    }
    return config;
  },

};

export default nextConfig;
