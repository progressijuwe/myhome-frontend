import Link from 'next/link';

import { siteConfig } from '@/config/site';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

export interface LogoProps {
    className?: string;
    /** Render the wordmark alongside the glyph. */
    showText?: boolean;
    /** Render as plain content instead of a link — for use inside a footer heading. */
    asLink?: boolean;
}

/**
 * Brand mark: a house inside the signal rings from the Myhome logo.
 *
 * The glyph is `aria-hidden` because the adjacent text already names the site.
 * When `showText` is false the link carries an `aria-label` instead, so it is
 * never an unlabelled link.
 */
export function Logo({ className, showText = true, asLink = true }: LogoProps) {
    const content = (
        <>
            <svg
                viewBox="0 0 34 34"
                aria-hidden="true"
                className="size-8 shrink-0"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Rings and nodes: the lighter accent green, used only here. */}
                <circle cx="17" cy="17" r="15.25" className="stroke-brand-accent" strokeWidth="1" />
                <circle cx="17" cy="17" r="11.25" className="stroke-brand-accent" strokeWidth="1" />
                <circle cx="28.4" cy="11" r="1.8" className="fill-brand-accent" />
                <circle cx="6" cy="12.5" r="1.3" className="fill-brand-accent" />
                <circle cx="17" cy="31.9" r="1.3" className="fill-brand-accent" />
                {/* House: the solid wordmark green. */}
                <path d="M17 8.5 L26 16.2 L26 25.5 L8 25.5 L8 16.2 Z" className="fill-brand" />
                <path
                    d="M22.4 9.6 L22.4 13.2"
                    className="stroke-brand"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                />
            </svg>
            {showText ? (
                <span className="font-heading text-brand text-[1.3rem] leading-none font-extrabold tracking-tight">
                    {siteConfig.name}
                </span>
            ) : null}
        </>
    );

    const classes = cn(
        'inline-flex items-center gap-2 rounded-md outline-none focus-visible:ring-ring focus-visible:ring-[3px]',
        className,
    );

    if (!asLink) {
        return <span className={classes}>{content}</span>;
    }

    return (
        <Link
            href={ROUTES.home}
            className={classes}
            aria-label={showText ? undefined : `${siteConfig.name} — home`}
        >
            {content}
        </Link>
    );
}
