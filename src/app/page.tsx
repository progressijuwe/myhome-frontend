import {
    FreshListings,
    JoinPaths,
    LandingHero,
    PropertyTypeRail,
    ReviewPromise,
    ServiceProviders,
    ViewingNegotiation,
} from '@/features/landing';

/**
 * A Server Component by default — no `'use client'` here, so this page's markup
 * is rendered on the server and only the interactive leaves ship JavaScript.
 *
 * The page composes bands and defines none of them; each lives in the landing
 * feature.
 */
export default function HomePage() {
    return (
        <>
            <LandingHero />
            <PropertyTypeRail />
            <FreshListings />
            <ViewingNegotiation />
            <ReviewPromise />
            <ServiceProviders />
            <JoinPaths />
        </>
    );
}
