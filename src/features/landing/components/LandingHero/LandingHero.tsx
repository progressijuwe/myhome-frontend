import { SearchIcon, ShieldCheckIcon } from 'lucide-react';
import Image from 'next/image';

import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { Section } from '@/components/shared/Section';
import { Text } from '@/components/shared/Text';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { formatNaira, formatNumber } from '@/utils/format';

import { HERO_LISTING, PROPERTY_TYPES } from '../../data';

/* Example figures — replace with `GET /admin/stats` or a public counterpart. */
const FACTS = [
    { value: 2_480, label: 'Approved listings' },
    { value: 310, label: 'Verified agencies' },
    { value: 1_150, label: 'Tours booked this month' },
];

export function LandingHero() {
    return (
        <Section spacing="2xl" className="relative overflow-hidden">
            {/* Full-bleed photograph, desktop only. `inset-y-0` ties it to the
                section's own height, so it always matches the hero exactly. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 hidden w-[56%] lg:block xl:w-[52%]"
            >
                <Image
                    src={HERO_LISTING.image}
                    alt=""
                    fill
                    priority
                    sizes="56vw"
                    placeholder="blur"
                    className="mask-[linear-gradient(to_right,transparent_0%,black_38%,black_100%)] object-cover"
                />
            </div>

            <Container className="relative">
                <div className="flex flex-col gap-6 lg:max-w-[46%]">
                    <Heading as="h1" size="display">
                        Discover your <span className="text-brand">next</span> property.
                    </Heading>

                    <Text size="body" muted balance className="max-w-[52ch]">
                        Every listing on Myhome is reviewed and approved before it reaches you — so
                        the duplex you found this morning is one that actually exists.
                    </Text>

                    <form
                        action={ROUTES.properties}
                        method="get"
                        role="search"
                        className="border-border bg-card grid gap-2 rounded-xl border p-2 shadow-sm sm:grid-cols-[1fr_auto_auto]"
                    >
                        <div className="flex items-center gap-2 px-3">
                            <SearchIcon
                                aria-hidden="true"
                                className="text-muted-foreground size-4 shrink-0"
                            />
                            <input
                                type="search"
                                /* The browse page filters on `location`; `q`
                                   belongs to the unified search endpoint and
                                   means nothing to the property feed. */
                                name="location"
                                maxLength={80}
                                aria-label="Area or landmark"
                                placeholder="Lekki, Maitama, GRA Enugu…"
                                className="text-small placeholder:text-muted-foreground h-11 w-full min-w-0 bg-transparent outline-none"
                            />
                        </div>

                        <select
                            name="type"
                            aria-label="Property type"
                            className="text-small text-foreground h-11 cursor-pointer rounded-lg bg-transparent px-3 outline-none sm:border-l"
                            defaultValue=""
                        >
                            <option value="">Any type</option>
                            {PROPERTY_TYPES.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>

                        <Button
                            type="submit"
                            size="lg"
                            className="bg-brand text-brand-foreground hover:bg-brand-hover h-11 px-6"
                        >
                            Search
                        </Button>
                    </form>

                    <dl className="flex flex-wrap gap-x-10 gap-y-4 pt-2">
                        {FACTS.map((fact) => (
                            <div key={fact.label}>
                                <dt className="sr-only">{fact.label}</dt>
                                <dd>
                                    <span className="font-heading text-h3 text-foreground block tabular-nums">
                                        {formatNumber(fact.value)}
                                    </span>
                                    <span className="text-caption text-muted-foreground">
                                        {fact.label}
                                    </span>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>

                {/* Mobile: the same photograph in normal flow, dissolving upward
                    into the copy above it rather than sideways. */}
                <div className="relative mt-12 aspect-4/3 overflow-hidden rounded-2xl lg:hidden">
                    <Image
                        src={HERO_LISTING.image}
                        alt={HERO_LISTING.imageAlt}
                        fill
                        sizes="100vw"
                        placeholder="blur"
                        className="mask-[linear-gradient(to_bottom,transparent_0%,black_22%,black_100%)] object-cover"
                    />
                </div>

                {/* The listing the photograph actually shows. Sits over the
                    opaque part of the image on desktop, below it on mobile. */}
                <div className="border-border bg-card mt-6 max-w-sm rounded-xl border p-5 shadow-md lg:absolute lg:right-8 lg:bottom-0 lg:mt-0 xl:right-12">
                    <p className="text-small text-brand inline-flex items-center gap-1.5 font-semibold">
                        <ShieldCheckIcon aria-hidden="true" className="size-4" />
                        Reviewed by Myhome
                    </p>

                    <p className="font-heading text-h4 text-foreground mt-2 tabular-nums">
                        {formatNaira(HERO_LISTING.price)}
                    </p>

                    <h2 className="text-small text-foreground mt-1 font-semibold">
                        {HERO_LISTING.title}
                    </h2>
                    <p className="text-small text-muted-foreground">{HERO_LISTING.address}</p>

                    <div className="text-caption text-muted-foreground mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t pt-3">
                        <span>
                            <b className="text-foreground font-semibold tabular-nums">
                                {HERO_LISTING.bedrooms}
                            </b>{' '}
                            beds
                        </span>
                        <span>
                            <b className="text-foreground font-semibold tabular-nums">
                                {HERO_LISTING.bathrooms}
                            </b>{' '}
                            baths
                        </span>
                        <span className="text-foreground font-semibold">{HERO_LISTING.detail}</span>
                    </div>
                </div>
            </Container>
        </Section>
    );
}
