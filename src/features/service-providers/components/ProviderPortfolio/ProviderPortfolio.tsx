import Image from 'next/image';

import { toMediaUrl } from '@/lib/media';
import type { PortfolioPhoto } from '@/types';

export interface ProviderPortfolioProps {
    photos: PortfolioPhoto[];
    /** Whose work it is, so each photo has a meaningful alt text. */
    name: string;
}

/**
 * Photographs of the artisan's finished work.
 *
 * A plain grid rather than a carousel: there are at most a dozen, and every one
 * of them is the point — hiding eleven behind arrows would defeat the reason
 * for having them.
 */
export function ProviderPortfolio({ photos, name }: ProviderPortfolioProps) {
    if (photos.length === 0) return null;

    const ordered = [...photos].sort((a, b) => a.order - b.order);

    return (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {ordered.map((photo, index) => (
                <li key={photo.id} className="flex flex-col gap-1.5">
                    <div className="bg-muted relative aspect-4/3 overflow-hidden rounded-xl">
                        <Image
                            src={toMediaUrl(photo.url)}
                            alt={photo.caption ?? `Work by ${name}`}
                            fill
                            /* The first row is likely above the fold on a
                               phone; the rest can wait. */
                            priority={index < 2}
                            sizes="(min-width: 640px) 33vw, 50vw"
                            className="object-cover"
                        />
                    </div>

                    {photo.caption ? (
                        <p className="text-caption text-muted-foreground">{photo.caption}</p>
                    ) : null}
                </li>
            ))}
        </ul>
    );
}
