import { StarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface ProviderRatingProps {
    /** Null until someone has reviewed them. */
    rating: number | null;
    count: number;
    className?: string;
}

/**
 * An artisan's rating, or an honest note that they have none yet.
 *
 * An unrated artisan is deliberately not shown as zero stars: nobody has judged
 * them badly, nobody has judged them at all, and conflating the two would
 * penalise everyone new to the platform.
 */
/** "5" rather than "5.0", but "4.5" kept — a trailing zero is noise. */
function formatRating(rating: number): string {
    return Number.isInteger(rating) ? String(rating) : rating.toFixed(1);
}

export function ProviderRating({ rating, count, className }: ProviderRatingProps) {
    if (rating === null || count === 0) {
        return (
            <span className={cn('text-caption text-muted-foreground', className)}>
                No reviews yet
            </span>
        );
    }

    return (
        <span
            className={cn(
                'text-caption text-muted-foreground inline-flex items-center gap-1.5',
                className,
            )}
        >
            <StarIcon aria-hidden="true" className="fill-brand text-brand size-3.5" />
            <b className="text-foreground font-semibold tabular-nums">
                {/* Out of five, said plainly: a bare "5" could be read as five
                    reviews, or five out of ten. */}
                {formatRating(rating)}/5
            </b>
            <span>
                ({count} {count === 1 ? 'review' : 'reviews'})
            </span>
        </span>
    );
}
