import { Building2Icon, HouseIcon, WrenchIcon, type LucideIcon } from 'lucide-react';
import Link from 'next/link';

import { ROUTES } from '@/constants/routes';

interface RoleOption {
    href: string;
    title: string;
    description: string;
    Icon: LucideIcon;
    /** Business roles wait for an administrator; individuals do not. */
    reviewed: boolean;
}

const OPTIONS: readonly RoleOption[] = [
    {
        href: ROUTES.registerIndividual,
        title: 'I’m looking for a property',
        description: 'Browse listings, save what you like, and book viewings.',
        Icon: HouseIcon,
        reviewed: false,
    },
    {
        href: ROUTES.registerCompany,
        title: 'I’m an estate agency',
        description: 'List properties and manage viewing requests in one inbox.',
        Icon: Building2Icon,
        reviewed: true,
    },
    {
        href: ROUTES.registerProvider,
        title: 'I offer a service',
        description: 'Publish what you do, where you cover, and what it costs.',
        Icon: WrenchIcon,
        reviewed: true,
    },
];

/**
 * Registration splits into three different endpoints with different fields, so
 * the role is chosen before the form rather than as a field inside it.
 */
export function RoleChooser() {
    return (
        <ul className="flex flex-col gap-3">
            {OPTIONS.map((option) => (
                <li key={option.href}>
                    <Link
                        href={option.href}
                        className="border-border hover:border-brand focus-visible:ring-ring group flex items-start gap-4 rounded-xl border p-4 transition-colors outline-none focus-visible:ring-[3px]"
                    >
                        <span className="bg-muted text-brand grid size-10 shrink-0 place-items-center rounded-lg">
                            <option.Icon aria-hidden="true" className="size-5" />
                        </span>

                        <span className="min-w-0">
                            <span className="text-small text-foreground block font-semibold">
                                {option.title}
                            </span>
                            <span className="text-caption text-muted-foreground block">
                                {option.description}
                            </span>
                            {option.reviewed ? (
                                <span className="text-caption text-muted-foreground mt-1 block italic">
                                    Reviewed by our team before going live.
                                </span>
                            ) : null}
                        </span>
                    </Link>
                </li>
            ))}
        </ul>
    );
}
