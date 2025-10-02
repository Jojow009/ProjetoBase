/** @type {import('next').NextConfig} */

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/contato',
        destination: '/contacts',
      },
    ]
  },
};

export default nextConfig;
