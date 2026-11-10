import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8080";

    return [
      // Direct v1 mapping: /api/v1/:path* -> ${BACKEND_API_URL}/api/v1/:path* or ${BACKEND_API_URL}/:path*
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
      // Fallback for general /api/:path* calls
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
