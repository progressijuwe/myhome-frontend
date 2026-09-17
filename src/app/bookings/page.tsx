import type { Metadata } from 'next';
import { Suspense } from 'react';

import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { Section } from '@/components/shared/Section';
import { Text } from '@/components/shared/Text';
import { Spinner } from '@/components/ui/Spinner';
import { RequireAuth } from '@/features/auth';
import { BookingsList } from '@/features/bookings';

export const metadata: Metadata = {
    title: 'Your viewings',
    /* A private page: there is nothing here for a crawler, and the listings it
       links to are already indexed on their own. */
    robots: { index: false, follow: false },
};

export default function BookingsPage() {
    return (
        <Section spacing="lg">
            <Container>
                <div className="mb-8 flex flex-col gap-2">
                    <Heading as="h1" size="h2">
                        Your viewings
                    </Heading>
                    <Text size="small" muted className="max-w-[60ch]">
                        Every viewing you&apos;ve asked for, and where each one stands.
                    </Text>
                </div>

                {/* Only individuals book viewings — the API refuses everyone
                    else, so the guard says so rather than letting the list load
                    and fail. */}
                <RequireAuth roles={['individual']}>
                    {/* BookingsList reads the page number from the URL, which
                        Next requires a Suspense boundary for. */}
                    <Suspense
                        fallback={
                            <div className="flex justify-center py-20">
                                <Spinner />
                                <span className="sr-only">Loading your bookings</span>
                            </div>
                        }
                    >
                        <BookingsList />
                    </Suspense>
                </RequireAuth>
            </Container>
        </Section>
    );
}
