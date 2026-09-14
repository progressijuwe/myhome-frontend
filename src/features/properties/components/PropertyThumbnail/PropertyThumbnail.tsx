import { ImageIcon } from 'lucide-react';
import Image from 'next/image';

import { toMediaUrl } from '@/lib/media';
import { cn } from '@/lib/utils';
import type { PropertyImage } from '@/types';

export interface PropertyThumbnailProps {
    images?: PropertyImage[];
    alt: string;
    className?: string;
    sizes?: string;
    priority?: boolean;
}

/**
 * A listing's lead photograph, or a neutral placeholder.
 *
 * The placeholder is not decoration: `images` is only present when the API
 * eager loaded the relation, and a listing can legitimately have none, so a
 * card that assumed an array would crash on the feed.
 */
export function PropertyThumbnail({
    images,
    alt,
    className,
    sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
    priority = false,
}: PropertyThumbnailProps) {
    /* The API orders images, but defensively pick the lowest rather than trust
       array position. */
    const lead = images?.length ? [...images].sort((a, b) => a.order - b.order)[0] : undefined;

    if (!lead) {
        return (
            <div
                className={cn(
                    'bg-muted text-muted-foreground flex items-center justify-center',
                    className,
                )}
            >
                <ImageIcon aria-hidden="true" className="size-8 opacity-40" />
                <span className="sr-only">No photograph available</span>
            </div>
        );
    }

    return (
        <Image
            src={toMediaUrl(lead.url)}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className={cn('object-cover', className)}
        />
    );
}
