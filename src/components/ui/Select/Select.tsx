'use client';

import { useId, type ComponentProps, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface SelectProps extends Omit<ComponentProps<'select'>, 'id'> {
    /** Rendered as a `<label>` bound to the select. */
    label?: ReactNode;
    /** Helper text below the field. Announced alongside the label. */
    description?: ReactNode;
    /** Validation message. Its presence sets the invalid state. */
    error?: ReactNode;
    id?: string;
}

/**
 * A native select with the same accessible wiring as Input.
 *
 * Native rather than a Radix listbox on purpose: this is a plain one-of-many
 * choice with no search or multi-select, and the native control brings keyboard
 * behaviour, type-ahead and the platform's own mobile picker for free. It also
 * submits inside a GET form with no JavaScript, which the filter panels depend
 * on.
 */
export function Select({
    className,
    label,
    description,
    error,
    id: idProp,
    'aria-describedby': describedByProp,
    children,
    ...props
}: SelectProps) {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const descriptionId = `${id}-description`;
    const errorId = `${id}-error`;

    /* The error replaces the description in the markup below, so the id list
       has to match what is actually rendered. */
    const showDescription = Boolean(description) && !error;

    const describedBy =
        [describedByProp, showDescription ? descriptionId : null, error ? errorId : null]
            .filter(Boolean)
            .join(' ') || undefined;

    return (
        <div className="flex w-full flex-col gap-1.5">
            {label ? (
                <label htmlFor={id} className="text-small text-foreground font-medium">
                    {label}
                </label>
            ) : null}

            <select
                id={id}
                data-slot="select"
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                className={cn(
                    'border-input bg-background text-foreground flex h-9 w-full rounded-lg border px-3 py-1 text-sm shadow-sm transition-colors',
                    'focus-visible:border-ring focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
                    className,
                )}
                {...props}
            >
                {children}
            </select>

            {showDescription ? (
                <p id={descriptionId} className="text-caption text-muted-foreground">
                    {description}
                </p>
            ) : null}

            {error ? (
                <p id={errorId} role="alert" className="text-caption text-destructive font-medium">
                    {error}
                </p>
            ) : null}
        </div>
    );
}
