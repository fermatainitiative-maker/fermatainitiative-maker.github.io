import { analyticsEnabled, createAnalytics, measurementId } from './analytics';

declare global {
  interface Window { dataLayer?: unknown[]; [key: `ga-disable-${string}`]: boolean }
}
const analyticsWindow = window;
export const analytics = createAnalytics({
  hostname: window.location.hostname,
  referrer: document.referrer,
  command: function () {
    analyticsWindow.dataLayer ||= [];
    // gtag expects an Arguments object, not an ordinary array.
    analyticsWindow.dataLayer.push(arguments);
  },
  load() {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.append(script);
  },
  disable(disabled) { analyticsWindow[`ga-disable-${measurementId}`] = disabled; },
});

export type Consent = 'accepted' | 'declined' | null;
const consentKey = 'fermata-analytics-consent';
const consentLifetime = 180 * 24 * 60 * 60 * 1000;
export function readConsent(): Consent {
  try {
    const saved = JSON.parse(localStorage.getItem(consentKey) || 'null');
    if (saved && saved.expires > Date.now() && ['accepted', 'declined'].includes(saved.choice)) return saved.choice;
  } catch { /* Storage may be unavailable in private browsing. */ }
  return null;
}
export function saveConsent(choice: Exclude<Consent, null>) {
  try { localStorage.setItem(consentKey, JSON.stringify({ choice, expires: Date.now() + consentLifetime })); } catch { /* The choice still applies to this page. */ }
  analytics.setConsent(choice === 'accepted');
  if (choice === 'declined') {
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.split('=')[0].trim();
      if (name === '_ga' || name.startsWith('_ga_')) {
        for (const domain of ['', window.location.hostname, '.fermatainitiative.org']) {
          document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain ? `; Domain=${domain}` : ''}`;
        }
      }
    }
  }
}
export function openCookieSettings() { window.dispatchEvent(new Event('fermata-cookie-settings')); }
analytics.setConsent(analyticsEnabled(readConsent()));
