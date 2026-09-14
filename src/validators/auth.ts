import { z } from 'zod';

/**
 * Auth schemas. These are the contract for both the form and the request body —
 * infer the TypeScript type from the schema rather than declaring it twice, so
 * a rule change can't drift from the type.
 *
 * Field names are snake_case to match the API payloads exactly; the form binds
 * straight to the request body with no mapping step in between.
 */

/**
 * Mirrors Laravel's `Password::min(8)->mixedCase()->numbers()->symbols()`.
 * The symbol rule is the one most easily missed — without it the form accepts
 * a password the API will reject, and the failure surfaces as a server error
 * on submit instead of inline while typing.
 */
export const passwordSchema = z
    .string()
    .min(8, 'Use at least 8 characters')
    .max(72, 'Use at most 72 characters')
    .regex(/[a-z]/, 'Include a lowercase letter')
    .regex(/[A-Z]/, 'Include an uppercase letter')
    .regex(/[0-9]/, 'Include a number')
    .regex(/[^A-Za-z0-9]/, 'Include a symbol, such as ! or ?');

export const loginSchema = z.object({
    email: z.email('Enter a valid email address'),
    /* Deliberately lax: an existing password predates the current rules, and
       validating it here only leaks what those rules are. */
    password: z.string().min(1, 'Enter your password'),
});

/* Shared across all three registration forms. Kept as a plain object of shapes
   rather than a schema, because `.refine()` returns a type that can no longer
   be `.extend()`ed — so each role composes the fields, then refines. */
const accountFields = {
    first_name: z.string().trim().min(1, 'Enter your first name').max(100),
    last_name: z.string().trim().min(1, 'Enter your last name').max(100),
    email: z.email('Enter a valid email address').max(255),
    password: passwordSchema,
    password_confirmation: z.string().min(1, 'Confirm your password'),
};

const passwordsMatch = (data: { password: string; password_confirmation: string }) =>
    data.password === data.password_confirmation;

/* `path` puts the message on the field the user has to fix, not the form.
   Not `as const`: zod types this as a mutable PropertyKey[]. */
const matchError = {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
};

export const registerIndividualSchema = z.object(accountFields).refine(passwordsMatch, matchError);

/**
 * A private landlord or seller. No company name and no CAC number — that is
 * the whole point of the role — so it collects nothing beyond the account.
 */
export const registerPropertyOwnerSchema = z
    .object(accountFields)
    .refine(passwordsMatch, matchError);

export const registerServiceProviderSchema = z
    .object({
        ...accountFields,
        business_name: z.string().trim().min(1, 'Enter your business name').max(200),
        trade_specialty: z.string().trim().min(1, 'Enter your trade').max(100),
        /* A plain number, not `z.coerce`: coercion gives the schema an
           `unknown` input type, which RHF's resolver generics reject. The
           input is registered with `valueAsNumber` instead. */
        years_of_experience: z
            .number({ error: 'Enter a number' })
            .int('Enter a whole number')
            .min(0, 'Cannot be negative')
            .max(60, 'Enter 60 or fewer'),
        service_coverage_area: z.string().trim().min(1, 'Enter the areas you cover').max(255),
    })
    .refine(passwordsMatch, matchError);

export const registerRealEstateCompanySchema = z
    .object({
        ...accountFields,
        company_name: z.string().trim().min(1, 'Enter the company name').max(200),
        cac_number: z.string().trim().min(1, 'Enter your CAC registration number').max(50),
        contact_person_name: z.string().trim().min(1, 'Enter the contact person').max(200),
        company_address: z.string().trim().min(1, 'Enter the company address').max(500),
    })
    .refine(passwordsMatch, matchError);

export const forgotPasswordSchema = z.object({
    email: z.email('Enter a valid email address'),
});

export const resetPasswordSchema = z
    .object({
        token: z.string().min(1),
        email: z.email('Enter a valid email address'),
        password: passwordSchema,
        password_confirmation: z.string().min(1, 'Confirm your password'),
    })
    .refine(passwordsMatch, matchError);

export const resendVerificationSchema = z.object({
    email: z.email('Enter a valid email address'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterIndividualInput = z.infer<typeof registerIndividualSchema>;
export type RegisterPropertyOwnerInput = z.infer<typeof registerPropertyOwnerSchema>;
export type RegisterServiceProviderInput = z.infer<typeof registerServiceProviderSchema>;
export type RegisterRealEstateCompanyInput = z.infer<typeof registerRealEstateCompanySchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;

/** The fields every registration form collects, whatever the role. */
export type AccountFieldValues = z.infer<z.ZodObject<typeof accountFields>>;
