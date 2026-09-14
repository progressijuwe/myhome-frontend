import { ArrowRightIcon, StarIcon } from 'lucide-react';
import Link from 'next/link';

import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { Section } from '@/components/shared/Section';
import { Text } from '@/components/shared/Text';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

import { FEATURED_PROVIDERS } from '../../data';

export function ServiceProviders() {
    return (
        <Section spacing="2xl" aria-labelledby="service-providers">
            <Container>
                <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <p className="text-caption text-brand font-bold tracking-widest uppercase">
                            Artisans, whenever you need them
                        </p>
                        <Heading as="h2" id="service-providers" size="h2" className="mt-2">
                            Good artisans, already vetted and rated
                        </Heading>
                        <Text size="body" muted className="mt-2.5 max-w-[60ch]">
                            Plumbers, electricians, carpenters, painters and more, across Nigeria.
                            Book one for a leaking tap today or a full refit next year
                        </Text>
                    </div>

                    <Button variant="outline" size="lg" asChild rightIcon={<ArrowRightIcon />}>
                        <Link href={ROUTES.serviceProviders}>Browse artisans</Link>
                    </Button>
                </div>

                <ul className="flex flex-col gap-3">
                    {FEATURED_PROVIDERS.map((provider) => (
                        <li key={provider.id}>
                            <Link
                                href={ROUTES.serviceProvider(provider.id)}
                                className="border-border bg-card hover:border-brand focus-visible:ring-ring grid grid-cols-[44px_1fr_auto] items-center gap-4 rounded-xl border p-4 transition-colors outline-none focus-visible:ring-[3px]"
                            >
                                <span
                                    aria-hidden="true"
                                    className="bg-muted text-brand font-heading grid size-11 place-items-center rounded-full text-sm font-bold"
                                >
                                    {provider.initials}
                                </span>

                                <span className="min-w-0">
                                    <span className="text-small text-foreground block font-semibold">
                                        {provider.businessName}
                                    </span>
                                    <span className="text-caption text-muted-foreground block">
                                        {provider.trade} · {provider.coverage} ·{' '}
                                        {provider.yearsOfExperience} years
                                    </span>
                                </span>

                                <span className="text-right">
                                    <span className="text-small text-foreground inline-flex items-center gap-1 font-semibold">
                                        <StarIcon
                                            aria-hidden="true"
                                            className="fill-brand-accent text-brand-accent size-3.5"
                                        />
                                        <span className="font-heading tabular-nums">
                                            {provider.averageRating.toFixed(1)}
                                        </span>
                                    </span>
                                    <span className="text-caption text-muted-foreground block tabular-nums">
                                        {provider.reviewsCount} reviews
                                    </span>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </Container>
        </Section>
    );
}
