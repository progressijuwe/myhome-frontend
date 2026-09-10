import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { Section } from '@/components/shared/Section';
import { Text } from '@/components/shared/Text';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { ROUTES } from '@/constants/routes';

import { FEATURED_LISTINGS } from '../../data';
import type { Tenure } from '../../types';
import { PropertyCard } from '../PropertyCard';

const TENURES: readonly { value: Tenure; label: string }[] = [
    { value: 'sale', label: 'Buy' },
    { value: 'rent', label: 'Rent' },
];

/**
 * Recently approved listings, split by tenure.
 *
 * Stays a Server Component: `Tabs` is the only client boundary, and the cards
 * it wraps are passed as children, so they render on the server and never reach
 * the client bundle.
 */
export function FreshListings() {
    return (
        <Section spacing="2xl" surface="muted" aria-labelledby="fresh-listings">
            <Container>
                <Tabs defaultValue="sale">
                    <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
                        <div>
                            <p className="text-caption text-brand font-bold tracking-[0.1em] uppercase">
                                Newly approved
                            </p>
                            <Heading as="h2" id="fresh-listings" size="h2" className="mt-2">
                                Fresh on the market
                            </Heading>
                            <Text size="body" muted className="mt-2.5">
                                Listings that cleared review in the last seven days.
                            </Text>
                        </div>

                        <TabsList aria-label="Buy or rent">
                            {TENURES.map((tenure) => (
                                <TabsTrigger key={tenure.value} value={tenure.value}>
                                    {tenure.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    {TENURES.map((tenure) => (
                        <TabsContent key={tenure.value} value={tenure.value}>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {FEATURED_LISTINGS[tenure.value].map((listing) => (
                                    <PropertyCard key={listing.id} listing={listing} />
                                ))}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>

                <div className="mt-10">
                    <Button variant="outline" size="lg" asChild rightIcon={<ArrowRightIcon />}>
                        <Link href={ROUTES.properties}>Browse all properties</Link>
                    </Button>
                </div>
            </Container>
        </Section>
    );
}
