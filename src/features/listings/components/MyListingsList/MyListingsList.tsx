'use client';

import { useQuery } from '@tanstack/react-query';
import { HouseIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Heading } from '@/components/shared/Heading';
import { Pagination } from '@/components/shared/Pagination';
import { Text } from '@/components/shared/Text';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ROUTES } from '@/constants/routes';
import { getErrorMessage } from '@/lib/api-error';
import { propertiesService } from '@/services/properties';

import { ListingCard } from '../ListingCard';

/**
 * The signed-in lister's own properties — every status, including sold.
 *
 * Client-fetched because the token lives in localStorage, so the server has no
 * session to fetch with.
 */
export function MyListingsList() {
    const searchParams = useSearchParams();
    const requested = Number(searchParams.get('page'));
    const page = Number.isInteger(requested) && requested > 0 ? requested : 1;

    const { data, isPending, isError, error } = useQuery({
        queryKey: ['my-listings', page],
        queryFn: () => propertiesService.myListings(page),
    });

    if (isPending) {
        return (
            <div className="flex justify-center py-20">
                <Spinner />
                <span className="sr-only">Loading your listings</span>
            </div>
        );
    }

    if (isError) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Couldn&apos;t load your listings</AlertTitle>
                <AlertDescription>{getErrorMessage(error)}</AlertDescription>
            </Alert>
        );
    }

    if (data.data.length === 0) {
        const isOutOfRange = data.meta.total > 0;

        return (
            <div className="border-border flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center">
                <HouseIcon aria-hidden="true" className="text-muted-foreground size-8" />

                {isOutOfRange ? (
                    <>
                        <Heading as="h2" size="h4">
                            That page doesn&apos;t exist
                        </Heading>
                        <Button variant="outline" asChild>
                            <Link href={ROUTES.myListings}>Back to the first page</Link>
                        </Button>
                    </>
                ) : (
                    <>
                        <Heading as="h2" size="h4">
                            No listings yet
                        </Heading>
                        <Text size="small" muted className="max-w-[46ch]">
                            Publish your first property. An admin reviews it before it goes live,
                            which usually takes a day.
                        </Text>
                        <Button
                            asChild
                            className="bg-brand text-brand-foreground hover:bg-brand-hover mt-1"
                        >
                            <Link href={ROUTES.newListing}>
                                <PlusIcon aria-hidden="true" />
                                Publish a listing
                            </Link>
                        </Button>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <Text size="small" muted>
                {data.meta.total} {data.meta.total === 1 ? 'listing' : 'listings'}
            </Text>

            <ul className="flex flex-col gap-4">
                {data.data.map((property) => (
                    <ListingCard key={property.id} property={property} />
                ))}
            </ul>

            <Pagination
                meta={data.meta}
                label="Listing pagination"
                hrefFor={(next) => `${ROUTES.myListings}?page=${next}`}
            />
        </div>
    );
}
