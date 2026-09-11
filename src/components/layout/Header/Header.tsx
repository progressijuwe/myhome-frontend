import Link from 'next/link';

import { Container } from '@/components/shared/Container';
import { Logo } from '@/components/shared/Logo';
import { mainNav } from '@/config/site';
import { AuthNav } from '@/features/auth';

import { MobileNav } from '../MobileNav';

/**
 * Site header. A Server Component — only MobileNav crosses into the client,
 * so the nav markup ships as HTML with no JavaScript cost.
 */
export function Header() {
    return (
        <header className="bg-background/85 sticky top-0 z-40 w-full border-b backdrop-blur-md">
            <Container>
                <div className="flex h-16 items-center justify-between gap-4">
                    <Logo />

                    <nav aria-label="Main" className="hidden md:block">
                        <ul className="flex items-center gap-1">
                            {mainNav.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring rounded-md px-3 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-[3px]"
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="flex items-center gap-2">
                        <AuthNav />
                        <MobileNav />
                    </div>
                </div>
            </Container>
        </header>
    );
}
