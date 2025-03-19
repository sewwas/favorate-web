/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['syrohqvdgkvlejrtsfms.supabase.co'],
  },
  compiler: {
    styledComponents: true
  },
  transpilePackages: [],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self'"
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig 