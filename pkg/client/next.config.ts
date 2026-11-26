import type { NextConfig } from "next"

import { apiBaseUrl } from "@/utils/environment"

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@gorth/primitive"],

  devIndicators: false,
  images: {
    // domains: ["qwxybvmklbhsvpmwthfn.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "qwxybvmklbhsvpmwthfn.supabase.co",
        // pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/proxy/social/:path*",
        destination: `${apiBaseUrl}/:path*`,
      },
    ]
  },
}

export default nextConfig
