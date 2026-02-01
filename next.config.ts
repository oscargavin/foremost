import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable Cache Components for Partial Prerendering (PPR)
  // Allows mixing static, cached, and dynamic content in a single route
  cacheComponents: true,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
