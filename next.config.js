/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "crowdr.netlify.app",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      // Redirect all /explore-campaigns/donate-or-volunteer/* to /explore/c/*
      {
        source: "/explore-campaigns/donate-or-volunteer/:path*",
        destination: "/explore/c/:path*",
        permanent: true,
      },
      // Redirect all /explore-campaigns/* to /explore/*
      {
        source: "/explore-campaigns/:path*",
        destination: "/explore/:path*",
        permanent: true,
      },
      // Redirect all /campaigns/* to /dashboard/campaigns/*
      {
        source: "/campaigns/:path*",
        destination: "/dashboard/campaigns/:path*",
        permanent: true,
      },
      // Redirect all /donations/* to /dashboard/donations/*
      {
        source: "/donations/:path*",
        destination: "/dashboard/donations/:path*",
        permanent: true,
      },
      // Redirect all /settings/* to /dashboard/settings/*
      {
        source: "/settings/:path*",
        destination: "/dashboard/settings/:path*",
        permanent: true,
      },
      // Redirect partial to complete
      {
        source: "/admin",
        destination: "/admin/dashboard",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "/dashboard/campaigns",
        permanent: true,
      },
      {
        source: "/dashboard/settings",
        destination: "/dashboard/settings/profile",
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
