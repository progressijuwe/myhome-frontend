import type { NextConfig } from 'next';

/**
 * Listing photographs come from one of two places, depending on where the API
 * is running.
 *
 * In development the API writes to its own local disk and serves them from
 * `/storage`. Those are proxied through this app under `/media`, so the browser
 * only ever sees a same-origin URL. That avoids a `remotePatterns` entry for a
 * loopback address, which Next's SSRF protection blocks from optimising
 * outright — pointing straight at `localhost:8000` needed
 * `dangerouslyAllowLocalIP`, and this removes the need for it.
 *
 * In production the API writes to object storage and hands back absolute URLs
 * on the bucket. Those cannot be proxied — there is no `/storage` path to
 * rewrite — so the bucket's host is allow-listed below instead. `toMediaUrl`
 * passes such URLs through untouched.
 */
const apiOrigin = new URL(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api').origin;

/**
 * The public base URL of the media bucket, when one is configured. Must match
 * the API's own AWS_URL, since that is what builds the links this app receives.
 */
const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL;

function mediaPattern() {
    if (!mediaUrl) return [];

    try {
        const { protocol, hostname, port } = new URL(mediaUrl);

        return [
            {
                protocol: protocol.replace(':', '') as 'http' | 'https',
                hostname,
                ...(port ? { port } : {}),
            },
        ];
    } catch {
        /* A malformed value would otherwise fail the build with a stack trace
           rather than a usable message. */
        throw new Error(`NEXT_PUBLIC_MEDIA_URL is not a valid URL: ${JSON.stringify(mediaUrl)}`);
    }
}

const nextConfig: NextConfig = {
    images: {
        remotePatterns: mediaPattern(),
    },

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
