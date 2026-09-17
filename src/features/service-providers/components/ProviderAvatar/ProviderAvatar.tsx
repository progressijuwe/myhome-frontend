import Image from 'next/image';

import { toMediaUrl } from '@/lib/media';
import { cn } from '@/lib/utils';

export interface ProviderAvatarProps {
    name: string;
    photo?: string | null;
    className?: string;
    sizes?: string;
}

/** First letters of the first two words — "Chidi Okonkwo" becomes "CO". */
function initialsOf(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
}

/**
 * An artisan's photograph, falling back to their initials.
 *
 * Most accounts have no photo, so the initials are the normal case rather than
 * an error state, and are styled to look deliberate.
 */
export function ProviderAvatar({ name, photo, className, sizes = '56px' }: ProviderAvatarProps) {
    const base = 'bg-muted relative shrink-0 overflow-hidden rounded-full';

    if (!photo) {
        return (
            <span
                aria-hidden="true"
                className={cn(
                    base,
                    'text-brand font-heading grid place-items-center font-bold',
                    className,
                )}
            >
                {initialsOf(name)}
            </span>
        );
    }

    return (
        <span className={cn(base, className)}>
            <Image src={toMediaUrl(photo)} alt="" fill sizes={sizes} className="object-cover" />
        </span>
    );
}
