import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security Headers A+
  async headers() {
    return [
      {
        source: "/(.*)",
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
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // Permanent 308 Redirects from legacy Vietnamese URLs to English URLs
  async redirects() {
    return [
      {
        source: "/khu-vuc-quan-tri",
        destination: "/admin",
        permanent: true,
      },
      {
        source: "/khu-vuc-quan-tri/:path*",
        destination: "/admin/:path*",
        permanent: true,
      },
      {
        source: "/tuyen-tap",
        destination: "/collections",
        permanent: true,
      },
      {
        source: "/tuyen-tap/:slug",
        destination: "/collections/:slug",
        permanent: true,
      },
      {
        source: "/tho",
        destination: "/poems",
        permanent: true,
      },
      {
        source: "/tho/:slug",
        destination: "/poems/:slug",
        permanent: true,
      },
      {
        source: "/tac-gia",
        destination: "/authors",
        permanent: true,
      },
      {
        source: "/dien-dan",
        destination: "/forum",
        permanent: true,
      },
      {
        source: "/yeu-thich",
        destination: "/saved",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
