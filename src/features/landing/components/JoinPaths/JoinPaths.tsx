import { CheckIcon } from 'lucide-react';
import Link from 'next/link';

import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { Section } from '@/components/shared/Section';
import { Text } from '@/components/shared/Text';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

const PATHS = [
    {
        heading: 'For estate agencies',
        body: 'Post properties to an audience that came here to buy, and manage every viewing request in one inbox.',
        points: [
            'Up to five photos per listing',
            'Approve, reschedule or decline each tour',
            'Followers notified when you post',
        ],
        cta: { label: 'Register your agency', href: ROUTES.registerCompany, primary: true },
    },
    {
        heading: 'For artisans and tradespeople',
        body: 'Reach people who need your trade all year round, not just when they move. Publish what you do, where you cover and what it costs.',
        points: [
            'List each service with its own price',
            'Mark yourself unavailable when full',
            'Build a rating from customers who hired you',
        ],
        cta: { label: 'Register your trade', href: ROUTES.registerProvider, primary: false },
    },
];

export function JoinPaths() {
    return (
        <Section spacing="2xl" surface="muted" aria-labelledby="join-paths">
            <Container>
                <p className="text-caption text-brand font-bold tracking-[0.1em] uppercase">
                    Work with us
                </p>
                <Heading as="h2" id="join-paths" size="h2" className="mt-2 mb-10">
                    Two ways to list on Myhome
                </Heading>

                <div className="grid gap-6 md:grid-cols-2">
                    {PATHS.map((path) => (
                        <div
                            key={path.heading}
                            className="border-border bg-card flex flex-col items-start gap-4 rounded-xl border p-8"
                        >
                            <Heading as="h3" size="h4">
                                {path.heading}
                            </Heading>

                            <Text size="small" muted>
                                {path.body}
                            </Text>

                            <ul className="flex flex-col gap-2">
                                {path.points.map((point) => (
                                    <li
                                        key={point}
                                        className="text-small text-muted-foreground flex items-start gap-2.5"
                                    >
                                        <CheckIcon
                                            aria-hidden="true"
                                            className="text-brand mt-1 size-4 shrink-0"
                                        />
                                        {point}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                size="lg"
                                asChild
                                variant={path.cta.primary ? 'default' : 'outline'}
                                className={
                                    path.cta.primary
                                        ? 'bg-brand text-brand-foreground hover:bg-brand-hover mt-2'
                                        : 'mt-2'
                                }
                            >
                                <Link href={path.cta.href}>{path.cta.label}</Link>
                            </Button>
                        </div>
                    ))}
                </div>
            </Container>
        </Section>
    );
}
