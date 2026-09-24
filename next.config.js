/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    "/[...slug]": ["./legacy-pages/**"],
  },
};

module.exports = nextConfig;
