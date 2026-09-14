/** Where the rewrite in next.config.ts exposes the API's public disk. */
const MEDIA_PREFIX = '/media';

/**
 * Rewrites an API storage URL to this app's own origin.
 *
 * The API hands back absolute URLs built from its APP_URL
 * (`http://localhost:8000/storage/properties/1/photo.jpg`). Serving those
 * directly would mean allow-listing the API's host with `next/image` and
 * letting the optimiser fetch across origins — which in development means
 * fetching a loopback address, something Next blocks by default as an SSRF
 * risk. Proxying instead keeps every image same-origin.
 *
 * Anything that isn't a recognisable storage URL is returned untouched, so a
 * CDN URL or an already-relative path still works.
 */
export function toMediaUrl(url: string): string {
    if (!url) return url;

    /* Already relative, or already proxied. */
    if (url.startsWith(MEDIA_PREFIX)) return url;

    const marker = '/storage/';
    const index = url.indexOf(marker);

    if (index === -1) return url;

    return `${MEDIA_PREFIX}/${url.slice(index + marker.length)}`;
}
