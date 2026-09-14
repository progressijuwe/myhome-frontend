import Link from 'next/link';

import { LISTING_TYPE_LABELS } from '@/constants/properties';
import { ROUTES } from '@/constants/routes';
import type { Property } from '@/types';
import { formatNaira } from '@/utils/format';

import { PropertyThumbnail } from '../PropertyThumbnail';

export interface PropertyCardProps {
    property: Property;
    /** Set on the first card so its image is not lazy loaded. */
    priority?: boolean;
}

/**
 * One listing in the feed.
 *
 * The whole card is a single link rather than a card containing one: one stop
 * in the tab order, and the entire surface is clickable.
 */
export function PropertyCard({ property, priority = false }: PropertyCardProps) {
    const isLand = property.bedrooms === null;

    return (
        <Link
            href={ROUTES.property(property.id)}
            className="group border-border bg-card hover:border-brand focus-visible:ring-ring flex flex-col overflow-hidden rounded-xl border transition-all outline-none hover:-translate-y-0.5 focus-visible:ring-[3px]"
        >
            <div className="relative aspect-3/2 overflow-hidden">
                <PropertyThumbnail
                    images={property.images}
                    alt={`${property.title}, ${property.address}`}
                    priority={priority}
                    className="transition-transform duration-500 group-hover:scale-[1.03]"
                />
            </div>

            <div className="flex flex-col gap-1.5 p-5">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-small text-brand font-semibold">
                        {LISTING_TYPE_LABELS[property.listing_type]}
                    </span>
                    {property.is_distress_sale ? (
                        <span className="text-small text-distress font-semibold">
                            Distress sale
                        </span>
                    ) : null}
                </div>

                <p className="font-heading text-h4 text-foreground tabular-nums">
                    {formatNaira(property.price)}
                    {property.listing_type === 'rent' ? (
                        <span className="text-small text-muted-foreground ml-1.5 font-medium">
                            per year
                        </span>
                    ) : null}
                </p>

                <h3 className="text-small text-foreground font-semibold">{property.title}</h3>
                <p className="text-small text-muted-foreground">{property.address}</p>

                <div className="text-caption text-muted-foreground mt-2 flex flex-wrap gap-x-4 gap-y-1 border-t pt-3">
                    {isLand ? (
                        <span>Land</span>
                    ) : (
                        <>
                            <span>
                                <b className="text-foreground font-semibold tabular-nums">
                                    {property.bedrooms}
                                </b>{' '}
                                beds
                            </span>
                            <span>
                                <b className="text-foreground font-semibold tabular-nums">
                                    {property.bathrooms}
                                </b>{' '}
                                baths
                            </span>
                            <span>{property.is_furnished ? 'Furnished' : 'Unfurnished'}</span>
                        </>
                    )}
                    {/* `name` rather than `company_name`: a private owner has
                        no company, and the listing still needs crediting. */}
                    <span className="ml-auto">{property.posted_by.name}</span>
                </div>
            </div>
        </Link>
    );
}
