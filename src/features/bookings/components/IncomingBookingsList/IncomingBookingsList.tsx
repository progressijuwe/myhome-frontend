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

import { IncomingBookingCard } from '../IncomingBookingCard';

/**
 * The signed-in individual's viewing requests.
 *
 * Client-fetched rather than server-rendered because the token lives in
 * localStorage, so the server has no session to fetch with. Paging stays in the
 * URL even so, which keeps the back button working and matches how every other
 * list in the app pages.
 */
export function IncomingBookingsList() {
    const searchParams = useSearchParams();
    const requested = Number(searchParams.get('page'));
    const page = Number.isInteger(requested) && requested > 0 ? requested : 1;

    const { data, isPending, isError, error } = useQuery({
        queryKey: ['company-bookings', page],
        queryFn: () => bookingsService.companyList(page),
    });

    if (isPending) {
        return (
            <div className="flex justify-center py-20">
                <Spinner />
                <span className="sr-only">Loading viewing requests</span>
            </div>
        );
    }

    if (isError) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Couldn&apos;t load viewing requests</AlertTitle>
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
                            <Link href={ROUTES.companyBookings}>Back to the first page</Link>
                        </Button>
                    </>
                ) : (
                    <>
                        <Heading as="h2" size="h4">
                            No viewing requests yet
                        </Heading>
                        <Text size="small" muted className="max-w-[46ch]">
                            When someone asks to see one of your properties, it appears here for you
                            to confirm, move or decline.
                        </Text>
                        <Link
                            href={ROUTES.myListings}
                            className="text-small text-brand font-semibold underline underline-offset-4"
                        >
                            See your listings
                        </Link>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <Text size="small" muted>
                {data.meta.total} {data.meta.total === 1 ? 'request' : 'requests'}
            </Text>

            <ul className="flex flex-col gap-4">
                {data.data.map((booking) => (
                    <IncomingBookingCard key={booking.id} booking={booking} />
                ))}
            </ul>

            <Pagination
                meta={data.meta}
                label="Booking pagination"
                hrefFor={(next) => `${ROUTES.companyBookings}?page=${next}`}
            />
        </div>
    );
}
