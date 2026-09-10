import Image from 'next/image';
import Link from 'next/link';

import { ROUTES } from '@/constants/routes';
import { formatNaira } from '@/utils/format';

import type { FeaturedListing } from '../../types';

export interface PropertyCardProps {
    listing: FeaturedListing;
}

/**
 * One property in the feed.
 *
 * The whole card is a single link rather than a card with a link inside it —
 * one stop in the tab order, and the entire surface is clickable.
 */
export function PropertyCard({ listing }: PropertyCardProps) {
    const specs = listing.bedrooms
        ? [
              { value: listing.bedrooms, label: 'beds' },
              { value: listing.bathrooms, label: 'baths' },
          ]
        : [];

    return (
        <Link
            href={ROUTES.property(listing.id)}
            className="group border-border bg-card hover:border-brand focus-visible:ring-ring flex flex-col overflow-hidden rounded-xl border transition-all outline-none hover:-translate-y-0.5 focus-visible:ring-[3px]"
        >
            <div className="bg-muted relative aspect-3/2 overflow-hidden">
                <Image
                    src={listing.image}
                    alt={listing.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    placeholder="blur"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
            </div>

            <div className="flex flex-col gap-1.5 p-5">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-small text-brand font-semibold">
                        {listing.tenure === 'sale' ? 'For sale' : 'For rent'}
                    </span>
                    {listing.isDistressSale ? (
                        <span className="text-small text-distress font-semibold">
                            Distress sale
                        </span>
                    ) : null}
                </div>

                <p className="font-heading text-h4 text-foreground tabular-nums">
                    {formatNaira(listing.price)}
                    {listing.period ? (
                        <span className="text-small text-muted-foreground ml-1.5 font-medium">
                            {listing.period}
                        </span>
                    ) : null}
                </p>

                <h3 className="text-small text-foreground font-semibold">{listing.title}</h3>
                <p className="text-small text-muted-foreground">{listing.address}</p>

                <div className="text-caption text-muted-foreground mt-2 flex gap-4 border-t pt-3">
                    {specs.map((spec) => (
                        <span key={spec.label}>
                            <b className="text-foreground font-semibold tabular-nums">
                                {spec.value}
                            </b>{' '}
                            {spec.label}
                        </span>
                    ))}
                    <span>{listing.detail}</span>
                </div>
            </div>
        </Link>
    );
}
