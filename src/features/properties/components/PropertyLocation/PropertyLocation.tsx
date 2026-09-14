'use client';

import { useQuery } from '@tanstack/react-query';
import { LockIcon, MapPinIcon } from 'lucide-react';
import Link from 'next/link';

import { Text } from '@/components/shared/Text';
import { Spinner } from '@/components/ui/Spinner';
import { ROUTES } from '@/constants/routes';
import { useSession } from '@/features/auth';
import { propertiesService } from '@/services/properties';

const BOX = 'border-border flex flex-col gap-3 rounded-xl border p-6';

export interface PropertyLocationProps {
    propertyId: number;
    /** Shown to everyone — the neighbourhood is public, the pin is not. */
    address: string;
}

/**
 * The map link for a listing.
 *
 * Exact co-ordinates are withheld from guests by the API itself, not merely
 * hidden here: the public listing payload omits `latitude`, `longitude` and
 * `maps_url`, and they come from a separate authenticated endpoint. That is why
 * this is a client component — the server render has no session to fetch with.
 */
export function PropertyLocation({ propertyId, address }: PropertyLocationProps) {
    const { isAuthenticated, isLoading: isCheckingSession } = useSession();

    const { data, isPending, isError } = useQuery({
        queryKey: ['property-location', propertyId],
        queryFn: () => propertiesService.getLocation(propertyId),
        enabled: isAuthenticated,
        staleTime: Infinity,
    });

    if (isCheckingSession) {
        return (
            <div className={`${BOX} items-center`}>
                <Spinner />
                <span className="sr-only">Checking your session</span>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className={BOX}>
                <p className="text-body text-foreground inline-flex items-center gap-2 font-semibold">
                    <LockIcon aria-hidden="true" className="size-4" />
                    Exact location
                </p>
                <Text size="small" muted>
                    {address}. Log in to open the precise spot in Maps.
                </Text>
                <Link
                    href={`${ROUTES.login}?next=${encodeURIComponent(ROUTES.property(propertyId))}`}
                    className="text-small text-brand font-semibold underline underline-offset-4"
                >
                    Log in to see it on the map
                </Link>
            </div>
        );
    }

    if (isPending) {
        return (
            <div className={`${BOX} items-center`}>
                <Spinner />
                <span className="sr-only">Loading the location</span>
            </div>
        );
    }

    /* A failure here costs the map link and nothing else, so it reports itself
       quietly rather than taking over the page. */
    if (isError) {
        return (
            <div className={BOX}>
                <Text size="small" muted>
                    The map link couldn&apos;t be loaded just now.
                </Text>
            </div>
        );
    }

    return (
        <a
            href={data.maps_url}
            target="_blank"
            rel="noreferrer noopener"
            className="border-border text-small hover:border-brand hover:text-brand focus-visible:ring-ring inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-medium transition-colors outline-none focus-visible:ring-[3px]"
        >
            <MapPinIcon aria-hidden="true" className="size-4" />
            Open in Maps
        </a>
    );
}
