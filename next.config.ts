import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a fully static site (HTML/CSS/JS) for GitHub Pages.
  output: "export",
  // This is a user site served from the domain root, so no basePath/assetPrefix.
  images: {
    // GitHub Pages has no server-side image optimiser endpoint.
    unoptimized: true,
  },
  // Emit deterministic trailing slashes so relative asset and anchor paths
  // resolve correctly on static hosting.
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
