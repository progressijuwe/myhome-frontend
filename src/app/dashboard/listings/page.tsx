import { PlusIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { Section } from '@/components/shared/Section';
import { Text } from '@/components/shared/Text';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ROUTES } from '@/constants/routes';
import { RequireAuth } from '@/features/auth';
import { MyListingsList } from '@/features/listings';

export const metadata: Metadata = {
    title: 'Your listings',
    robots: { index: false, follow: false },
};

export default function MyListingsPage() {
    return (
        <Section spacing="lg">
            <Container>
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <Heading as="h1" size="h2">
                            Your listings
                        </Heading>
                        <Text size="small" muted className="max-w-[60ch]">
                            Everything you have published, and where each one stands.
                        </Text>
                    </div>

                    <Button asChild className="bg-brand text-brand-foreground hover:bg-brand-hover">
                        <Link href={ROUTES.newListing}>
                            <PlusIcon aria-hidden="true" />
                            Publish a listing
                        </Link>
                    </Button>
                </div>

                {/* Only agencies and private owners can list; the API refuses
                    everyone else, so the guard says so rather than letting the
                    list load and fail. */}
                <RequireAuth roles={['real_estate_company', 'property_owner']}>
                    <Suspense
                        fallback={
                            <div className="flex justify-center py-20">
                                <Spinner />
                                <span className="sr-only">Loading your listings</span>
                            </div>
                        }
                    >
                        <MyListingsList />
                    </Suspense>
                </RequireAuth>
            </Container>
        </Section>
    );
}
