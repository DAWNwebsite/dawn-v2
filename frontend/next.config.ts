/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  serverExternalPackages: ['@prisma/client'],
  eslint: {
    // Disable ESLint during builds for faster deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript checking during builds for faster deployment
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost'],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        // pathname: '/my-bucket/**',
        search: "",
      },
    ],
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://dawn_user:dawn_password@postgres:5432/dawn_lms_dev',
    REDIS_URL: process.env.REDIS_URL || 'redis://redis:6379',
    API_BASE_URL: process.env.API_BASE_URL || 'http://backend:8080',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'dev-nextauth-secret',
  },
}

module.exports = nextConfig
