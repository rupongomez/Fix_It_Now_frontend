import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "adagio.com",
      },
      {
        hostname: "i.ibb.co.com", // ← add this line
      },
      {
        hostname: "example.com",
      },
    ],
  },
}

export default nextConfig
