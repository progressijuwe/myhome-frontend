import Image from 'next/image';
import Link from 'next/link';
import type { ComponentPropsWithRef } from 'react';

import logo from '@/assets/brand/myhome-logo.png';
import { siteConfig } from '@/config/site';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

export interface LogoProps extends Omit<ComponentPropsWithRef<'a'>, 'href'> {
    /** Height utility for the lockup. Width always follows the aspect ratio. */
    className?: string;
    /** Render as plain content instead of a link — for use inside a heading. */
    asLink?: boolean;
}

/**
 * The Myhome lockup — mark, wordmark and tagline, as supplied.
 *
 * The image is decorative and the accessible name sits on the wrapper, so the
 * brand name is announced once rather than twice.
 *
 * Props are forwarded to the root element so Radix `asChild` consumers — the
 * mobile nav wraps this in `Dialog.Close` — can attach their handler and ref.
 */
export function Logo({ className, asLink = true, ...props }: LogoProps) {
    const height = className ?? 'h-9';

    const content = <Image src={logo} alt="" priority className={cn('w-auto', height)} />;

    const classes =
        'focus-visible:ring-ring inline-flex items-center rounded-md outline-none focus-visible:ring-[3px]';

    if (!asLink) {
        return (
            <span
                className={classes}
                role="img"
                aria-label={siteConfig.name}
                {...(props as ComponentPropsWithRef<'span'>)}
            >
                {content}
            </span>
        );
    }

    return (
        <Link
            href={ROUTES.home}
            className={classes}
            aria-label={`${siteConfig.name} — home`}
            {...props}
        >
            {content}
        </Link>
    );
}
