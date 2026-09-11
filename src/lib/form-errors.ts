import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

import { ApiError } from './api-error';

/**
 * Replay the API's per-field validation onto the matching inputs.
 *
 * The server validates too, and it knows things the client cannot — that an
 * email is already taken, that a CAC number is a duplicate. Showing those in
 * context beats one opaque banner above the form.
 *
 * `fields` is the allow-list of names the form actually renders: without it, a
 * message for a field that isn't on screen would be set on the form and never
 * displayed, leaving the form permanently invalid with nothing to fix.
 *
 * @returns true when at least one message was placed on a field.
 */
export function applyServerFieldErrors<T extends FieldValues>(
    error: unknown,
    setError: UseFormSetError<T>,
    fields: readonly string[],
): boolean {
    if (!(error instanceof ApiError) || !error.fieldErrors) return false;

    let applied = false;

    for (const [field, messages] of Object.entries(error.fieldErrors)) {
        const message = messages?.[0];

        if (message && fields.includes(field)) {
            setError(field as Path<T>, { type: 'server', message });
            applied = true;
        }
    }

    return applied;
}
