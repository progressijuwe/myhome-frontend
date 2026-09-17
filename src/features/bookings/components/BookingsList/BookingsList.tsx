'use client';

import { useQuery } from '@tanstack/react-query';
import { CalendarXIcon } from 'lucide-react';
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
import { bookingsService } from '@/services/bookings';

import { BookingCard } from '../BookingCard';

/**
 * The signed-in individual's viewing requests.
 *
 * Client-fetched rather than server-rendered because the token lives in
 * localStorage, so the server has no session to fetch with. Paging stays in the
 * URL even so, which keeps the back button working and matches how every other
 * list in the app pages.
 */
export function BookingsList() {
    const searchParams = useSearchParams();
    const requested = Number(searchParams.get('page'));
    const page = Number.isInteger(requested) && requested > 0 ? requested : 1;

    const { data, isPending, isError, error } = useQuery({
        queryKey: ['bookings', page],
        queryFn: () => bookingsService.list(page),
    });

    if (isPending) {
        return (
            <div className="flex justify-center py-20">
                <Spinner />
                <span className="sr-only">Loading your bookings</span>
            </div>
        );
    }

    if (isError) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Couldn&apos;t load your bookings</AlertTitle>
                <AlertDescription>{getErrorMessage(error)}</AlertDescription>
            </Alert>
        );
    }

    if (data.data.length === 0) {
        /* An out-of-range page is a different thing from having none at all,
           and telling someone they have no bookings when they do is worse than
           saying nothing. */
        const isOutOfRange = data.meta.total > 0;

        return (
            <div className="border-border flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center">
                <CalendarXIcon aria-hidden="true" className="text-muted-foreground size-8" />

                {isOutOfRange ? (
                    <>
                        <Heading as="h2" size="h4">
                            That page doesn&apos;t exist
                        </Heading>
                        <Button variant="outline" asChild>
                            <Link href={ROUTES.bookings}>Back to the first page</Link>
                        </Button>
                    </>
                ) : (
                    <>
                        <Heading as="h2" size="h4">
                            No viewings booked yet
                        </Heading>
                        <Text size="small" muted className="max-w-[44ch]">
                            When you request a viewing on a listing, it shows up here with whatever
                            the agent says back.
                        </Text>
                        <Link
                            href={ROUTES.properties}
                            className="text-small text-brand font-semibold underline underline-offset-4"
                        >
                            Browse properties
                        </Link>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <Text size="small" muted>
                {data.meta.total} {data.meta.total === 1 ? 'viewing' : 'viewings'} requested
            </Text>

            <ul className="flex flex-col gap-4">
                {data.data.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                ))}
            </ul>

            <Pagination
                meta={data.meta}
                label="Booking pagination"
                hrefFor={(next) => `${ROUTES.bookings}?page=${next}`}
            />
        </div>
    );
}
