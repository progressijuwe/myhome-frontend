import type { NextConfig } from 'next';

/**
 * The API serves listing photographs from its own `/storage` directory. Rather
 * than pointing `next/image` at that host directly, they are proxied through
 * this app under `/media`, so every image URL the browser sees is same-origin.
 *
 * That buys three things:
 *
 *  - No `remotePatterns` allow-list to maintain.
 *  - No server-side fetch to a foreign host, so Next's SSRF protection (which
 *    blocks optimising anything resolving to a private or loopback IP) never
 *    has cause to fire. Pointing straight at `localhost:8000` required
 *    `dangerouslyAllowLocalIP`; this removes the need for it.
 *  - The API's hostname stays out of the markup, so it can move without
 *    invalidating any cached HTML.
 */
const apiOrigin = new URL(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api').origin;

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: '/media/:path*',
                destination: `${apiOrigin}/storage/:path*`,
            },
        ];
    },
};

export default nextConfig;
