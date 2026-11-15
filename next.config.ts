import type { NextConfig } from "next";

/** Headers every response carries. The CSP is added per request by proxy.ts. */
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Emailed links carry single-use tokens in the query, so nothing may reach
  // another site. Not "no-referrer": it makes browsers send `Origin: null`
  // on form posts, which Server Actions rightly reject.
  { key: "Referrer-Policy", value: "same-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  // End-to-end tests build into their own folder, leaving a dev server alone.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  // No Partial Prerendering: a nonce-based CSP needs every page rendered per
  // request, because a prerendered shell cannot carry the request's nonce.
  poweredByHeader: false,
  // The shared UI kit ships TypeScript source.
  transpilePackages: ["@zellapay/ui", "@zellapay/app-kit"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
