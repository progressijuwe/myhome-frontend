import Link from 'next/link';

import { Container } from '@/components/shared/Container';
import { Logo } from '@/components/shared/Logo';
import { Text } from '@/components/shared/Text';
import { siteConfig } from '@/config/site';
import { ROUTES } from '@/constants/routes';

interface FooterColumn {
    heading: string;
    links: readonly { label: string; href: string }[];
}

const columns: readonly FooterColumn[] = [
    {
        heading: 'Properties',
        links: [
            { label: 'For sale', href: `${ROUTES.properties}?listing_type=sale` },
            { label: 'For rent', href: `${ROUTES.properties}?listing_type=rent` },
            { label: 'Land', href: `${ROUTES.properties}?type=land` },
            { label: 'Distress sales', href: `${ROUTES.properties}?is_distress_sale=1` },
        ],
    },
    {
        heading: 'Services',
        links: [
            { label: 'Plumbing', href: `${ROUTES.serviceProviders}?trade=plumbing` },
            { label: 'Electrical', href: `${ROUTES.serviceProviders}?trade=electrical` },
            { label: 'Carpentry', href: `${ROUTES.serviceProviders}?trade=carpentry` },
            { label: 'Painting', href: `${ROUTES.serviceProviders}?trade=painting` },
        ],
    },
    {
        heading: 'Company',
        links: [
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
            { label: 'Terms', href: '/terms' },
            { label: 'Privacy', href: '/privacy' },
        ],
    },
];

export function Footer() {
    return (
        <footer className="mt-auto border-t">
            <Container>
                <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
                    <div className="flex flex-col items-start gap-3">
                        <Logo />
                        <Text size="small" muted className="max-w-[30ch]">
                            {siteConfig.tagline}.
                        </Text>
                    </div>

                    {columns.map((column) => (
                        <nav key={column.heading} aria-label={column.heading}>
                            <h2 className="text-caption text-foreground mb-4 font-bold tracking-widest uppercase">
                                {column.heading}
                            </h2>
                            <ul className="flex flex-col gap-2.5">
                                {column.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-small text-muted-foreground hover:text-brand focus-visible:ring-ring rounded-sm transition-colors outline-none focus-visible:ring-[3px]"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    ))}
                </div>

                <div className="flex flex-col justify-between gap-2 border-t py-6 sm:flex-row">
                    <Text size="small" muted>
                        {/* Rendered on the server at build time. If this page is
                            statically generated, the year freezes at build — use
                            a client component if that matters to you. */}
                        &copy; {new Date().getFullYear()} {siteConfig.name}. Nigeria.
                    </Text>
                    <Text size="small" muted>
                        All listings reviewed before publication.
                    </Text>
                </div>
            </Container>
        </footer>
    );
}
