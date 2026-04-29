/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"]
  },
  experimental: {
    optimizePackageImports: ["gsap", "three", "@react-three/fiber", "@react-three/drei"]
  }
};

module.exports = nextConfig;

