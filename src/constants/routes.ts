/**
 * Every in-app path in one place. Import these instead of writing string
 * literals so a route rename is a single edit and a typo is a type error.
 *
 * Mirrors the API's public surface — see the API's routes/api.php.
 */
export const ROUTES = {
    home: '/',

    /* Browsing */
    properties: '/properties',
    property: (id: string | number) => `/properties/${id}`,
    serviceProviders: '/service-providers',
    serviceProvider: (id: string | number) => `/service-providers/${id}`,
    company: (id: string | number) => `/companies/${id}`,
    search: '/search',

    /* Auth */
    login: '/login',
    register: '/register',
    registerIndividual: '/register/individual',
    registerCompany: '/register/real-estate-company',
    registerPropertyOwner: '/register/property-owner',
    registerProvider: '/register/service-provider',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    /* Post-registration notice, and where an unverified user is sent to ask
       for another link. */
    verifyEmail: '/verify-email',
    /* The API redirects here after a verification link is followed; the page
       reads ?status=verified|pending-approval|already-verified|invalid|expired. */
    emailVerified: '/email-verified',

    /* Signed in */
    dashboard: '/dashboard',
    /* Admin review queue — listings and accounts. */
    admin: '/admin',
    /* Listing management, for agencies and private owners. */
    myListings: '/dashboard/listings',
    newListing: '/dashboard/listings/new',
    editListing: (id: string | number) => `/dashboard/listings/${id}/edit`,
    /* Viewing requests coming in on your own listings. */
    companyBookings: '/dashboard/viewings',
    savedProperties: '/saved',
    following: '/following',
    bookings: '/bookings',
    enquiries: '/enquiries',
    notifications: '/notifications',
    settings: '/settings',
} as const;

/**
 * Routes that render their own minimal chrome (just the logo) instead of the
 * site header and footer. Matched by prefix, so `/register/individual` is
 * covered by `/register`.
 */
export const AUTH_ROUTE_PREFIXES = [
    ROUTES.login,
    ROUTES.register,
    ROUTES.forgotPassword,
    ROUTES.resetPassword,
    ROUTES.verifyEmail,
    ROUTES.emailVerified,
] as const;

export function isAuthRoute(pathname: string): boolean {
    return AUTH_ROUTE_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
}
