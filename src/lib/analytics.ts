/** Pluggable analytics seam — replace `track` with a Plausible/Umami/etc. call
 * if/when the institute decides on a vendor. The default no-ops so dev and
 * tests are silent. */

export type AnalyticsEvent =
  | { name: 'enquiry_submitted'; programme?: string }
  | { name: 'application_started' }
  | { name: 'application_submitted'; programme: string }
  | { name: 'payment_captured'; programme: string; amountInRupees: number }
  | { name: 'admin_signed_in' };

export function track(event: AnalyticsEvent): void {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', event);
  }
}
