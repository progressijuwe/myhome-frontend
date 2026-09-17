import type { NigerianState } from './property';
import type { Trade } from './service-provider';

/**
 * The account shape as the API returns it (see UserResource on the backend).
 *
 * Field names stay snake_case deliberately: they mirror the wire format, so
 * there is no mapping layer to keep in sync when the resource changes.
 */

export type UserRole =
    'individual' | 'property_owner' | 'service_provider' | 'real_estate_company' | 'admin';

/** `not_required` is what individuals and admins get — only the two business roles are reviewed. */
export type ApprovalStatus = 'not_required' | 'pending' | 'approved' | 'rejected';

export interface ServiceProviderProfile {
    business_name: string;
    /** Canonical key, matched exactly by the directory filter. */
    trade: Trade;
    /** What to show: the label, or their own words when they chose `other`. */
    trade_specialty: string;
    years_of_experience: number;
    /** One of the 36 states or the FCT. The coarse, exactly-matched filter. */
    state: NigerianState;
    /** Display form of `state`, built by the API. */
    state_label: string;
    /** Free text detail within the state — "Lekki and Ajah". */
    service_coverage_area: string;
}

export interface RealEstateCompanyProfile {
    company_name: string;
    cac_number: string;
    contact_person_name: string;
    company_address: string;
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    phone: string | null;
    profile_photo_url: string | null;
    role: UserRole;
    email_verified: boolean;
    approval_status: ApprovalStatus;
    is_active: boolean;
    created_at: string;

    /** Present only when the relation was loaded — i.e. for that role. */
    service_provider_profile?: ServiceProviderProfile;
    real_estate_company_profile?: RealEstateCompanyProfile;
}

/**
 * Why the API refused an otherwise-valid request. Every protected route can
 * return one of these with a 403 (or 423 for a lockout), and the UI routes on
 * it rather than on the message text.
 */
export type AccountAction =
    'verify_email' | 'pending_approval' | 'application_rejected' | 'account_locked';
