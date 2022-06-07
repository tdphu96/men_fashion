/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://graph.facebook.com/v14.0/:path*',
      },
    ]
  },
}

module.exports = nextConfig
