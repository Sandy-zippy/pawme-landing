/** @type {import('next').NextConfig} */
// Set NEXT_PUBLIC_BASE_PATH at build time:
//   - "" (empty) for serving at root (e.g., custom domain pawmebot.com)
//   - "/pawme-landing" for the github.io preview URL
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
};
export default nextConfig;
