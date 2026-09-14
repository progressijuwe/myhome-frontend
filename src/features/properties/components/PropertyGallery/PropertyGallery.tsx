'use client';

import { ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { toMediaUrl } from '@/lib/media';
import { cn } from '@/lib/utils';
import type { PropertyImage } from '@/types';

export interface PropertyGalleryProps {
    images?: PropertyImage[];
    /** Describes the property, used to caption each photograph. */
    title: string;
}

/**
 * The listing's photographs: one large frame with selectable thumbnails.
 *
 * A listing can legitimately have no images — the relation is only present
 * when eager loaded — so the empty state is a real case, not a guard.
 */
export function PropertyGallery({ images, title }: PropertyGalleryProps) {
    const ordered = [...(images ?? [])].sort((a, b) => a.order - b.order);
    const [activeId, setActiveId] = useState<number | null>(ordered[0]?.id ?? null);

    if (ordered.length === 0) {
        return (
            <div className="bg-muted text-muted-foreground flex aspect-16/10 items-center justify-center rounded-2xl">
                <ImageIcon aria-hidden="true" className="size-10 opacity-40" />
                <span className="sr-only">No photographs available for this listing</span>
            </div>
        );
    }

    const active = ordered.find((image) => image.id === activeId) ?? ordered[0];

    return (
        <div className="flex flex-col gap-3">
            <div className="bg-muted relative aspect-16/10 overflow-hidden rounded-2xl">
                <Image
                    src={toMediaUrl(active.url)}
                    alt={title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover"
                />
            </div>

            {ordered.length > 1 ? (
                <ul className="grid grid-cols-4 gap-3 sm:grid-cols-6">
                    {ordered.map((image, index) => {
                        const isActive = image.id === active.id;

                        return (
                            <li key={image.id}>
                                <button
                                    type="button"
                                    onClick={() => setActiveId(image.id)}
                                    aria-label={`Show photograph ${index + 1} of ${ordered.length}`}
                                    aria-current={isActive}
                                    className={cn(
                                        'bg-muted focus-visible:ring-ring relative block aspect-4/3 w-full overflow-hidden rounded-lg outline-none focus-visible:ring-[3px]',
                                        isActive
                                            ? 'ring-brand ring-2'
                                            : 'opacity-70 hover:opacity-100',
                                    )}
                                >
                                    <Image
                                        src={toMediaUrl(image.url)}
                                        alt=""
                                        fill
                                        sizes="120px"
                                        className="object-cover"
                                    />
                                </button>
                            </li>
                        );
                    })}
                </ul>
            ) : null}
        </div>
    );
}
