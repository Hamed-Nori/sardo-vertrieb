import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // 60 = Kontakt-Hintergrund (docs/09 D), 75 = Standard
    qualities: [60, 75],
  },
};

export default nextConfig;
