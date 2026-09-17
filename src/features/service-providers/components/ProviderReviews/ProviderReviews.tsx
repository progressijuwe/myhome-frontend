import { StarIcon } from 'lucide-react';

import { Text } from '@/components/shared/Text';
import { cn } from '@/lib/utils';
import type { ProviderReview } from '@/types';
import { formatDate } from '@/utils/format';

import { ProviderAvatar } from '../ProviderAvatar';

export interface ProviderReviewsProps {
    reviews: ProviderReview[];
}

/** Five stars with the earned ones filled. Decorative — the count is read out. */
function Stars({ rating }: { rating: number }) {
    return (
        <span className="inline-flex items-center gap-0.5" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((value) => (
                <StarIcon
                    key={value}
                    className={cn(
                        'size-3.5',
                        value <= rating ? 'fill-brand text-brand' : 'text-border',
                    )}
                />
            ))}
        </span>
    );
}

/**
 * What previous customers said.
 *
 * A review can be a rating with no words — the API allows a null comment — so
 * the stars carry the meaning and the text is optional rather than assumed.
 */
export function ProviderReviews({ reviews }: ProviderReviewsProps) {
    if (reviews.length === 0) {
        return (
            <Text size="small" muted>
                No reviews yet. This artisan has been reviewed by Myhome but hasn&apos;t been rated
                by customers here.
            </Text>
        );
    }

    return (
        <ul className="flex flex-col gap-3">
            {reviews.map((review) => (
                <li
                    key={review.id}
                    className="border-border flex flex-col gap-2 rounded-xl border p-5"
                >
                    <div className="flex items-start gap-3">
                        {review.reviewer ? (
                            <ProviderAvatar
                                name={review.reviewer.name}
                                photo={review.reviewer.photo}
                                className="size-9 text-xs"
                                sizes="36px"
                            />
                        ) : null}

                        <div className="min-w-0 flex-1">
                            <p className="text-small text-foreground font-semibold">
                                {review.reviewer?.name ?? 'A customer'}
                            </p>
                            <p className="text-caption text-muted-foreground flex items-center gap-2">
                                <Stars rating={review.rating} />
                                <span>{review.rating} out of 5</span>
                                <span aria-hidden="true">·</span>
                                <time dateTime={review.created_at}>
                                    {formatDate(review.created_at)}
                                </time>
                            </p>
                        </div>
                    </div>

                    {review.comment ? (
                        <Text size="small" muted className="whitespace-pre-line">
                            {review.comment}
                        </Text>
                    ) : null}
                </li>
            ))}
        </ul>
    );
}
