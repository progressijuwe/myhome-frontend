import { BedDoubleIcon, BathIcon, MapPinIcon, ShieldCheckIcon, SofaIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { Section } from '@/components/shared/Section';
import { Text } from '@/components/shared/Text';
import { LISTING_TYPE_LABELS, PROPERTY_TYPE_LABELS } from '@/constants/properties';
import { ROUTES } from '@/constants/routes';
import { BookViewingPanel, PropertyGallery, PropertyLocation } from '@/features/properties';
import { ApiError } from '@/lib/api-error';
import { propertiesService } from '@/services/properties';
import type { Property } from '@/types';
import { formatNaira } from '@/utils/format';

type Props = { params: Promise<{ id: string }> };

/**
 * The API 404s anything not publicly visible — unapproved, sold or deleted —
 * so a missing listing and a hidden one are indistinguishable here, which is
 * the intended behaviour rather than a gap.
 */
async function findProperty(id: string): Promise<Property | null> {
    try {
        return await propertiesService.getById(id);
    } catch (error) {
        if (error instanceof ApiError && error.isNotFound) return null;
        throw error;
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const property = await findProperty((await params).id);

    if (!property) return { title: 'Property not found' };

    return {
        title: `${property.title}, ${property.address}`,
        description: property.description.slice(0, 155),
        openGraph: {
            title: property.title,
            description: property.description.slice(0, 155),
            images: property.images?.length ? [{ url: property.images[0].url }] : undefined,
        },
    };
}

export default async function PropertyDetailPage({ params }: Props) {
    const property = await findProperty((await params).id);

    if (!property) notFound();

    const isLand = property.bedrooms === null;

    const specs = [
        !isLand && { Icon: BedDoubleIcon, label: 'Bedrooms', value: String(property.bedrooms) },
        !isLand && { Icon: BathIcon, label: 'Bathrooms', value: String(property.bathrooms) },
        !isLand && {
            Icon: SofaIcon,
            label: 'Furnishing',
            value: property.is_furnished ? 'Furnished' : 'Unfurnished',
        },
    ].filter(Boolean) as { Icon: typeof BedDoubleIcon; label: string; value: string }[];

    return (
        <Section spacing="lg">
            <Container>
                <Text size="small" muted className="mb-6">
                    <Link
                        href={ROUTES.properties}
                        className="hover:text-brand underline underline-offset-4"
                    >
                        Properties
                    </Link>{' '}
                    / {property.title}
                </Text>

                <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
                    <div className="flex flex-col gap-8">
                        <PropertyGallery
                            images={property.images}
                            title={`${property.title}, ${property.address}`}
                        />

                        <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-small text-brand font-semibold">
                                    {LISTING_TYPE_LABELS[property.listing_type]}
                                </span>
                                <span className="text-small text-muted-foreground">
                                    {PROPERTY_TYPE_LABELS[property.type]}
                                </span>
                                {property.is_distress_sale ? (
                                    <span className="text-small text-distress font-semibold">
                                        Distress sale
                                    </span>
                                ) : null}
                            </div>

                            <Heading as="h1" size="h2">
                                {property.title}
                            </Heading>

                            <p className="text-small text-muted-foreground inline-flex items-center gap-1.5">
                                <MapPinIcon aria-hidden="true" className="size-4 shrink-0" />
                                {property.address}, {property.state_label}
                            </p>
                        </div>

                        {specs.length > 0 ? (
                            <dl className="border-border grid grid-cols-3 gap-4 rounded-xl border p-5">
                                {specs.map((spec) => (
                                    <div key={spec.label} className="flex flex-col gap-1">
                                        <dt className="text-caption text-muted-foreground inline-flex items-center gap-1.5">
                                            <spec.Icon aria-hidden="true" className="size-4" />
                                            {spec.label}
                                        </dt>
                                        <dd className="text-body text-foreground font-semibold">
                                            {spec.value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        ) : null}

                        <div className="flex flex-col gap-3">
                            <Heading as="h2" size="h4">
                                About this property
                            </Heading>
                            {/* `whitespace-pre-line` keeps the agent's own paragraph
                                breaks without trusting the string as markup. */}
                            <Text size="body" muted className="whitespace-pre-line">
                                {property.description}
                            </Text>
                        </div>
                    </div>

                    {/* ---- Sticky action rail ---- */}
                    <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
                        <div className="border-border bg-card flex flex-col gap-3 rounded-xl border p-6">
                            <p className="font-heading text-h2 text-foreground tabular-nums">
                                {formatNaira(property.price)}
                                {property.listing_type === 'rent' ? (
                                    <span className="text-body text-muted-foreground ml-2 font-medium">
                                        per year
                                    </span>
                                ) : null}
                            </p>

                            <p className="text-small text-brand inline-flex items-center gap-1.5 font-semibold">
                                <ShieldCheckIcon aria-hidden="true" className="size-4" />
                                Reviewed by Myhome
                            </p>

                            <div className="text-small text-muted-foreground border-t pt-3">
                                Listed by{' '}
                                <span className="text-foreground font-semibold">
                                    {property.posted_by.name}
                                </span>
                                {property.posted_by.is_company ? null : ' (private owner)'}
                            </div>
                        </div>

                        <BookViewingPanel propertyId={property.id} />

                        <PropertyLocation propertyId={property.id} address={property.address} />
                    </aside>
                </div>
            </Container>
        </Section>
    );
}
