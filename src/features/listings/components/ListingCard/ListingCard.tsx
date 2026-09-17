'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPinIcon, PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Text } from '@/components/shared/Text';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PROPERTY_STATUS_LABELS, PROPERTY_STATUS_TONES } from '@/constants/listings';
import { LISTING_TYPE_LABELS } from '@/constants/properties';
import { ROUTES } from '@/constants/routes';
import { getErrorMessage } from '@/lib/api-error';
import { propertiesService } from '@/services/properties';
import type { Property } from '@/types';
import { formatNaira } from '@/utils/format';

import { PropertyThumbnail } from '@/features/properties';

export interface ListingCardProps {
    property: Property;
}

/**
 * One of the lister's own listings, with what they can do to it.
 *
 * Actions follow the API: only an approved listing can be marked sold, and a
 * sold one cannot be edited. Offering either would produce a 422 the reader
 * cannot act on.
 */
export function ListingCard({ property }: ListingCardProps) {
    const queryClient = useQueryClient();
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    const refresh = () => queryClient.invalidateQueries({ queryKey: ['my-listings'] });

    const markSold = useMutation({
        mutationFn: () => propertiesService.markSold(property.id),
        onSuccess: refresh,
    });

    const remove = useMutation({
        mutationFn: () => propertiesService.remove(property.id),
        onSuccess: refresh,
    });

    const isSold = property.status === 'sold';
    const busy = markSold.isPending || remove.isPending;
    const failure = markSold.error ?? remove.error;

    return (
        <li className="border-border bg-card flex flex-col gap-4 rounded-xl border p-5 sm:flex-row sm:gap-5">
            <div className="relative aspect-3/2 w-full shrink-0 overflow-hidden rounded-lg sm:w-44">
                <PropertyThumbnail images={property.images} alt={property.title} />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-body text-foreground font-semibold">{property.title}</p>
                        <p className="text-caption text-muted-foreground mt-1 inline-flex items-center gap-1.5">
                            <MapPinIcon aria-hidden="true" className="size-3.5 shrink-0" />
                            {property.address}
                        </p>
                    </div>

                    <Badge variant={PROPERTY_STATUS_TONES[property.status]}>
                        {PROPERTY_STATUS_LABELS[property.status]}
                    </Badge>
                </div>

                <p className="text-small text-foreground font-semibold tabular-nums">
                    {formatNaira(property.price)}
                    <span className="text-muted-foreground ml-2 font-medium">
                        {LISTING_TYPE_LABELS[property.listing_type]}
                    </span>
                </p>

                {/* The reason matters more than the status here — it is the only
                    thing that tells them what to change. */}
                {property.status === 'rejected' && property.rejection_reason ? (
                    <Alert variant="destructive">
                        <AlertDescription>
                            Not approved: {property.rejection_reason}
                        </AlertDescription>
                    </Alert>
                ) : null}

                {failure ? (
                    <Alert variant="destructive">
                        <AlertDescription>{getErrorMessage(failure)}</AlertDescription>
                    </Alert>
                ) : null}

                {confirmingDelete ? (
                    <div className="border-border flex flex-col gap-3 border-t pt-4">
                        <Text size="small">
                            Delete this listing? It disappears from your list and from the site.
                        </Text>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="destructive"
                                onClick={() => remove.mutate()}
                                isLoading={remove.isPending}
                                loadingLabel="Deleting"
                            >
                                Yes, delete it
                            </Button>
                            <Button variant="ghost" onClick={() => setConfirmingDelete(false)}>
                                Keep it
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2 border-t pt-3">
                        {property.status === 'approved' ? (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={ROUTES.property(property.id)}>View</Link>
                            </Button>
                        ) : null}

                        {isSold ? null : (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={ROUTES.editListing(property.id)}>
                                    <PencilIcon aria-hidden="true" />
                                    Edit
                                </Link>
                            </Button>
                        )}

                        {/* Only an approved listing can be marked sold. */}
                        {property.status === 'approved' ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markSold.mutate()}
                                isLoading={markSold.isPending}
                                loadingLabel="Updating"
                                disabled={busy}
                            >
                                Mark as sold
                            </Button>
                        ) : null}

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setConfirmingDelete(true)}
                            disabled={busy}
                            className="text-destructive hover:text-destructive ml-auto"
                        >
                            Delete
                        </Button>
                    </div>
                )}
            </div>
        </li>
    );
}
