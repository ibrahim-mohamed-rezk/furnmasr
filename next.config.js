/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a self-contained server bundle in .next/standalone so the VPS only
  // receives the traced runtime deps, not the full node_modules tree.
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mediumseagreen-woodcock-810460.hostingersite.com",
        port: "",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "ghoran.test-domain-devunity.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "furnmasr.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.furnmasr.com",
        port: "",
        pathname: "/**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Bypass the built-in next/image optimizer. Sharp runs inside the cPanel
    // CageFS jail on the VPS and intermittently emits corrupt/empty variants
    // (observed a 222-byte AVIF), which cache and show as broken images. Serving
    // originals directly is fully reliable; product images already arrive
    // pre-sized from the API CDN, so there's little to gain from re-optimizing.
    unoptimized: true,
    minimumCacheTTL: 60,
    formats: ["image/webp", "image/avif"],
  },

  experimental: {
    // Raised for future server actions; the app does not use any yet.
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  // Redirect www → non-www to enforce a single canonical origin and eliminate CORS issues
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.furnmasr.com" }],
        destination: "https://furnmasr.com/:path*",
        permanent: true, // 308 permanent redirect
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://furnmasr.com",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
