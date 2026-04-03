import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Node.js v25+ exposes a global `localStorage` object, but without
// `--localstorage-file` its methods (getItem, setItem, etc.) are undefined.
// This causes SSR crashes. Patch it with a no-op in-memory implementation.
if (
  typeof globalThis.localStorage !== "undefined" &&
  typeof globalThis.localStorage.getItem !== "function"
) {
  const store = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
    get length() { return store.size; },
    key: (index: number) => [...store.keys()][index] ?? null,
  } as Storage;
}

const nextConfig: NextConfig = {
  trailingSlash: true,
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:locale(en|tr)/docs/0.1.5/:path*",
        destination: "/docs/0.1.5/:path*",
        permanent: false,
      },
      {
        source: "/:locale(en|tr)/docs/0.1-alpha/:path*",
        destination: "/docs/0.1-alpha/:path*",
        permanent: false,
      },
      {
        source: "/docs/0.1.5",
        destination: "/docs/0.1.5/index.html",
        permanent: false,
      },
      {
        source: "/docs/0.1-alpha",
        destination: "/docs/0.1-alpha/index.html",
        permanent: false,
      },
      {
        source: "/docs",
        destination: "/docs/0.1.5/index.html",
        permanent: false,
      },
      {
        source: "/docs/",
        destination: "/docs/0.1.5/index.html",
        permanent: false,
      },
      {
        source: "/:locale(en|tr)/docs",
        destination: "/docs/0.1.5/index.html",
        permanent: false,
      },
      {
        source: "/:locale(en|tr)/docs/",
        destination: "/docs/0.1.5/index.html",
        permanent: false,
      },
      {
        source: "/:locale(en|tr)/docs/:path((?!0\\.1\\.5|0\\.1-alpha).*)",
        destination: "/docs/0.1.5/:path*",
        permanent: false,
      },
    ];
  },
};


export default withNextIntl(nextConfig);
