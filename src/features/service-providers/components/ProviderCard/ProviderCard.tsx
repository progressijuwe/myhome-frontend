import { MapPinIcon } from 'lucide-react';
import Link from 'next/link';

import { ROUTES } from '@/constants/routes';
import type { ServiceProvider } from '@/types';
import { formatNaira } from '@/utils/format';

import { coverageLabel } from '../../lib/coverage-label';
import { ProviderAvatar } from '../ProviderAvatar';
import { ProviderRating } from '../ProviderRating';

export interface ProviderCardProps {
    provider: ServiceProvider;
}

/**
 * One artisan in the list.
 *
 * The whole card is a single link rather than a card containing one: one stop
 * in the tab order, and the entire surface is clickable.
 */
export function ProviderCard({ provider }: ProviderCardProps) {
    const profile = provider.profile;
    const listings = provider.listings ?? [];

    /* The cheapest available job is the most useful single number here — it
       answers "can I afford to start" without implying a fixed quote. */
    const from = listings.filter((listing) => listing.is_available).map((listing) => listing.price);
    const cheapest = from.length > 0 ? Math.min(...from) : null;

    return (
        <Link
            href={ROUTES.serviceProvider(provider.id)}
            className="group border-border bg-card hover:border-brand focus-visible:ring-ring flex flex-col gap-4 rounded-xl border p-5 transition-all outline-none hover:-translate-y-0.5 focus-visible:ring-[3px]"
        >
            <div className="flex items-start gap-4">
                <ProviderAvatar
                    name={provider.name}
                    photo={provider.profile_photo}
                    className="size-12 text-sm"
                />

                <div className="min-w-0 flex-1">
                    {profile ? (
                        <p className="text-small text-brand font-semibold">
                            {profile.trade_specialty}
                        </p>
                    ) : null}

                    <h3 className="text-body text-foreground font-semibold">
                        {profile ? profile.business_name : provider.name}
                    </h3>

                    {/* The business name leads, but the person behind it still
                        deserves crediting. */}
                    {profile ? (
                        <p className="text-caption text-muted-foreground">{provider.name}</p>
                    ) : null}
                </div>
            </div>

            <div className="text-caption text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1.5">
                {profile ? (
                    <span className="inline-flex items-center gap-1.5">
                        <MapPinIcon aria-hidden="true" className="size-3.5 shrink-0" />
                        {coverageLabel(profile)}
                    </span>
                ) : null}

                {/* 0 is a legitimate value — someone just starting out — but
                    "0 years experience" reads as a fault rather than a fact, so
                    it is omitted rather than shown. */}
                {profile && profile.years_of_experience > 0 ? (
                    <span>
                        <b className="text-foreground font-semibold tabular-nums">
                            {profile.years_of_experience}
                        </b>{' '}
                        years experience
                    </span>
                ) : null}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
                <ProviderRating rating={provider.average_rating} count={provider.reviews_count} />

                {cheapest !== null ? (
                    <span className="text-small text-foreground font-semibold tabular-nums">
                        From {formatNaira(cheapest)}
                    </span>
                ) : (
                    <span className="text-caption text-muted-foreground">Ask for a quote</span>
                )}
            </div>
        </Link>
    );
}
