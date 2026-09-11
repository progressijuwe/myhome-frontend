'use client';

import { MenuIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { Dialog as DialogPrimitive, VisuallyHidden } from 'radix-ui';

import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/Button';
import { mainNav } from '@/config/site';
import { ROUTES } from '@/constants/routes';

/**
 * Navigation for viewports below `md`, where the inline nav is hidden.
 *
 * The only client component in the header — `Header` itself stays a Server
 * Component, so the nav markup still ships as HTML.
 *
 * Built on Radix Dialog rather than a hand-rolled panel because it needs the
 * hard parts: focus trapped inside while open and returned to the hamburger on
 * close, Escape and outside-click to dismiss, background scroll locked, and the
 * rest of the page hidden from screen readers. Radix also puts `aria-expanded`
 * and `aria-haspopup` on the trigger for us.
 *
 * Every link is wrapped in `Dialog.Close`, so following one dismisses the sheet
 * instead of leaving it open over the new page.
 */
export function MobileNav() {
    return (
        <DialogPrimitive.Root>
            <DialogPrimitive.Trigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                    <MenuIcon />
                </Button>
            </DialogPrimitive.Trigger>

            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay
                    data-slot="mobile-nav-overlay"
                    className="data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] md:hidden"
                />

                <DialogPrimitive.Content
                    data-slot="mobile-nav-content"
                    /* Radix warns when a dialog has no description; this one is
                       a nav panel with nothing to describe. */
                    aria-describedby={undefined}
                    className="bg-card text-card-foreground data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:animate-in data-[state=open]:slide-in-from-right fixed inset-y-0 right-0 z-50 flex w-[min(20rem,85vw)] flex-col border-l shadow-xl duration-200 md:hidden"
                >
                    <VisuallyHidden.Root>
                        <DialogPrimitive.Title>Navigation menu</DialogPrimitive.Title>
                    </VisuallyHidden.Root>

                    <div className="flex h-16 shrink-0 items-center justify-between border-b px-4">
                        <DialogPrimitive.Close asChild>
                            <Logo />
                        </DialogPrimitive.Close>

                        <DialogPrimitive.Close asChild>
                            <Button variant="ghost" size="icon" aria-label="Close menu">
                                <XIcon />
                            </Button>
                        </DialogPrimitive.Close>
                    </div>

                    {/* Scrolls internally so a long menu still reaches its
                        buttons on a short viewport. */}
                    <nav aria-label="Main" className="flex-1 overflow-y-auto p-4">
                        <ul className="flex flex-col gap-1">
                            {mainNav.map((item) => (
                                <li key={item.href}>
                                    <DialogPrimitive.Close asChild>
                                        <Link
                                            href={item.href}
                                            className="text-foreground hover:bg-muted hover:text-brand focus-visible:ring-ring block rounded-lg px-3 py-3 text-base font-medium transition-colors outline-none focus-visible:ring-[3px]"
                                        >
                                            {item.title}
                                        </Link>
                                    </DialogPrimitive.Close>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="flex shrink-0 flex-col gap-2 border-t p-4">
                        <DialogPrimitive.Close asChild>
                            <Button variant="outline" size="lg" fullWidth asChild>
                                <Link href={ROUTES.login}>Log in</Link>
                            </Button>
                        </DialogPrimitive.Close>

                        <DialogPrimitive.Close asChild>
                            <Button
                                size="lg"
                                fullWidth
                                asChild
                                className="bg-brand text-brand-foreground hover:bg-brand-hover"
                            >
                                <Link href={ROUTES.register}>Create account</Link>
                            </Button>
                        </DialogPrimitive.Close>
                    </div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
