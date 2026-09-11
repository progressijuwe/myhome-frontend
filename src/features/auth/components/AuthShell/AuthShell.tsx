import type { ReactNode } from 'react';

import { Heading } from '@/components/shared/Heading';
import { Text } from '@/components/shared/Text';

export interface AuthShellProps {
    title: string;
    description?: ReactNode;
    children: ReactNode;
    /** Secondary action below the card — "Already have an account?" and friends. */
    footer?: ReactNode;
}

/**
 * The card every auth screen sits in. A Server Component: only the form inside
 * it crosses into the client.
 */
export function AuthShell({ title, description, children, footer }: AuthShellProps) {
    return (
        <div className="w-full max-w-md">
            <div className="border-border bg-card rounded-2xl border p-6 shadow-sm sm:p-8">
                <Heading as="h1" size="h3">
                    {title}
                </Heading>

                {description ? (
                    <Text size="small" muted className="mt-2">
                        {description}
                    </Text>
                ) : null}

                <div className="mt-6">{children}</div>
            </div>

            {footer ? (
                <Text size="small" muted align="center" className="mt-6">
                    {footer}
                </Text>
            ) : null}
        </div>
    );
}
