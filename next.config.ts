import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The After hours poster page was retired. Send old links home instead
      // of to a 404; temporary, so nothing is cached if the page ever returns.
      { source: "/after-hours", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
