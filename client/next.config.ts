import type { NextConfig } from "next";

/**
 * ELYSE DEV — Next.js configuration.
 *
 * Notes:
 *  • `transpilePackages` compiles the local `@elyse/database` workspace (only
 *    its dependency-free type module is ever imported by the client).
 *  • `allowedDevOrigins` permits the sandboxed preview host to load the dev
 *    server without Next's cross-origin dev warning.
 *  • Security headers deliberately omit `X-Frame-Options` / `frame-ancestors`
 *    so the site can be embedded in preview panes; add a CSP at your hosting
 *    layer if you need to restrict embedding in production.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["@elyse/database"],
  allowedDevOrigins: ["*.e2b.app", "*.arena.ai", "localhost", "127.0.0.1"],
  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
