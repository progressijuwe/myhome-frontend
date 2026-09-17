import { BriefcaseIcon, CalendarIcon, MapPinIcon, ShieldCheckIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { Section } from '@/components/shared/Section';
import { Text } from '@/components/shared/Text';
import { ROUTES } from '@/constants/routes';
import {
    EnquiryPanel,
    ProviderAvatar,
    ProviderPortfolio,
    ProviderRating,
    ProviderReviews,
    coverageLabel,
} from '@/features/service-providers';
import { ApiError } from '@/lib/api-error';
import { serviceProvidersService } from '@/services/service-providers';
import type { ServiceProvider } from '@/types';
import { formatDate, formatNaira } from '@/utils/format';

type Props = { params: Promise<{ id: string }> };

/**
 * The API 404s anyone who is not an approved service provider, so a missing
 * artisan and an unapproved one are indistinguishable here — which is the
 * intended behaviour rather than a gap.
 */
async function findProvider(id: string): Promise<ServiceProvider | null> {
    try {
        return await serviceProvidersService.getById(id);
    } catch (error) {
        if (error instanceof ApiError && error.isNotFound) return null;
        throw error;
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const provider = await findProvider((await params).id);

    if (!provider) return { title: 'Artisan not found' };

    const profile = provider.profile;
    const name = profile ? profile.business_name : provider.name;

    return {
        title: profile ? `${name} — ${profile.trade_specialty}` : name,
        description: profile
            ? `${profile.trade_specialty} covering ${coverageLabel(profile)}. Book through Myhome.`
            : undefined,
    };
}

export default async function ServiceProviderPage({ params }: Props) {
    const provider = await findProvider((await params).id);

    if (!provider) notFound();

    const profile = provider.profile;
    /* The API already limits this to available listings on the detail route. */
    const listings = provider.listings ?? [];
    const portfolio = provider.portfolio ?? [];
    const reviews = provider.reviews ?? [];

    return (
        <Section spacing="lg">
            <Container>
                <Text size="small" muted className="mb-6">
                    <Link
                        href={ROUTES.serviceProviders}
                        className="hover:text-brand underline underline-offset-4"
                    >
                        Artisans
                    </Link>{' '}
                    / {profile ? profile.business_name : provider.name}
                </Text>

                <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-wrap items-start gap-5">
                            <ProviderAvatar
                                name={provider.name}
                                photo={provider.profile_photo}
                                className="size-20 text-xl"
                                sizes="80px"
                            />

                            <div className="min-w-0 flex-1">
                                {profile ? (
                                    <p className="text-small text-brand font-semibold">
                                        {profile.trade_specialty}
                                    </p>
                                ) : null}

                                <Heading as="h1" size="h2" className="mt-1">
                                    {profile ? profile.business_name : provider.name}
                                </Heading>

                                {profile ? (
                                    <Text size="small" muted className="mt-1">
                                        {provider.name}
                                    </Text>
                                ) : null}

                                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                                    <ProviderRating
                                        rating={provider.average_rating}
                                        count={provider.reviews_count}
                                    />

                                    {/* The same admin review that gates a
                                        property listing gates an artisan, so it
                                        earns the same badge. */}
                                    {provider.is_verified ? (
                                        <span className="text-caption text-brand inline-flex items-center gap-1.5 font-semibold">
                                            <ShieldCheckIcon
                                                aria-hidden="true"
                                                className="size-3.5"
                                            />
                                            Reviewed by Myhome
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        {profile ? (
                            <dl className="border-border grid grid-cols-2 gap-4 rounded-xl border p-5">
                                <div className="flex flex-col gap-1">
                                    <dt className="text-caption text-muted-foreground inline-flex items-center gap-1.5">
                                        <MapPinIcon aria-hidden="true" className="size-4" />
                                        Covers
                                    </dt>
                                    <dd className="text-body text-foreground font-semibold">
                                        {coverageLabel(profile)}
                                    </dd>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <dt className="text-caption text-muted-foreground inline-flex items-center gap-1.5">
                                        <CalendarIcon aria-hidden="true" className="size-4" />
                                        On Myhome since
                                    </dt>
                                    <dd className="text-body text-foreground font-semibold">
                                        {formatDate(provider.member_since, {
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </dd>
                                </div>

                                {profile.years_of_experience > 0 ? (
                                    <div className="flex flex-col gap-1">
                                        <dt className="text-caption text-muted-foreground inline-flex items-center gap-1.5">
                                            <BriefcaseIcon aria-hidden="true" className="size-4" />
                                            Experience
                                        </dt>
                                        <dd className="text-body text-foreground font-semibold tabular-nums">
                                            {profile.years_of_experience} years
                                        </dd>
                                    </div>
                                ) : null}
                            </dl>
                        ) : null}

                        <div className="flex flex-col gap-4">
                            <Heading as="h2" size="h4">
                                What they do
                            </Heading>

                            {listings.length > 0 ? (
                                <ul className="flex flex-col gap-3">
                                    {listings.map((listing) => (
                                        <li
                                            key={listing.id}
                                            className="border-border flex flex-col gap-1.5 rounded-xl border p-5"
                                        >
                                            <div className="flex flex-wrap items-baseline justify-between gap-3">
                                                <h3 className="text-body text-foreground font-semibold">
                                                    {listing.title}
                                                </h3>
                                                <p className="text-body text-foreground font-semibold tabular-nums">
                                                    {formatNaira(listing.price)}
                                                </p>
                                            </div>

                                            <Text size="small" muted>
                                                {listing.description}
                                            </Text>

                                            <p className="text-caption text-muted-foreground mt-1 inline-flex items-center gap-1.5">
                                                <MapPinIcon
                                                    aria-hidden="true"
                                                    className="size-3.5 shrink-0"
                                                />
                                                {listing.coverage_area}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <Text size="small" muted>
                                    This artisan hasn&apos;t listed specific jobs yet. Send an
                                    enquiry describing what you need.
                                </Text>
                            )}
                        </div>

                        {portfolio.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                <Heading as="h2" size="h4">
                                    Recent work
                                </Heading>
                                <ProviderPortfolio photos={portfolio} name={provider.name} />
                            </div>
                        ) : null}

                        <div className="flex flex-col gap-4">
                            <Heading as="h2" size="h4">
                                Reviews
                            </Heading>
                            <ProviderReviews reviews={reviews} />
                        </div>
                    </div>

                    <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
                        <EnquiryPanel providerId={provider.id} listings={listings} />

                        <div className="border-border bg-card flex flex-col gap-3 rounded-xl border p-6">
                            <p className="text-body text-foreground font-semibold">
                                Prices are a guide
                            </p>
                            <Text size="small" muted>
                                Every job is different. Treat these as a starting point and agree
                                the final price with the artisan before work begins.
                            </Text>
                        </div>
                    </aside>
                </div>
            </Container>
        </Section>
    );
}
