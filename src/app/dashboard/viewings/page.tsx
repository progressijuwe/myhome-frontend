import type { Metadata } from 'next';
import { Suspense } from 'react';

import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { Section } from '@/components/shared/Section';
import { Text } from '@/components/shared/Text';
import { Spinner } from '@/components/ui/Spinner';
import { RequireAuth } from '@/features/auth';
import { IncomingBookingsList } from '@/features/bookings';

export const metadata: Metadata = {
    title: 'Viewing requests',
    robots: { index: false, follow: false },
};

export default function CompanyViewingsPage() {
    return (
        <Section spacing="lg">
            <Container>
                <div className="mb-8 flex flex-col gap-2">
                    <Heading as="h1" size="h2">
                        Viewing requests
                    </Heading>
                    <Text size="small" muted className="max-w-[60ch]">
                        People asking to see your properties. Confirm a time, offer another, or
                        decline.
                    </Text>
                </div>

                <RequireAuth roles={['real_estate_company', 'property_owner']}>
                    <Suspense
                        fallback={
                            <div className="flex justify-center py-20">
                                <Spinner />
                                <span className="sr-only">Loading viewing requests</span>
                            </div>
                        }
                    >
                        <IncomingBookingsList />
                    </Suspense>
                </RequireAuth>
            </Container>
        </Section>
    );
}
