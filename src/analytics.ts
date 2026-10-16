// Only these public routes and campaign labels can enter Analytics URLs.
const paths = new Set(['/', '/about', '/music', '/contact', '/privacy', '/thank-you']);
const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_id', 'utm_content', 'utm_term'];
export const measurementId = 'G-0W1LJTWBZ2';
export type LeadType = 'volunteer' | 'host' | 'partnership' | 'general';
export function leadType(value: unknown): LeadType {
  return value === 'volunteer' || value === 'host' || value === 'partnership' ? value : 'general';
}
export function safePage(url: string) {
  const parsed = new URL(url);
  const path = parsed.pathname.replace(/\/+$/, '') || '/';
  const clean = new URL(paths.has(path) ? path : '/not-found', 'https://fermatainitiative.org');
  for (const key of campaignKeys) {
    const value = parsed.searchParams.get(key);
    if (value && /^[\w .-]{1,100}$/.test(value)) clean.searchParams.set(key, value);
  }
  return clean.href;
}
export function safeReferrer(url: string) {
  try {
    const parsed = new URL(url);
    if (!['https:', 'http:'].includes(parsed.protocol)) return '';
    return ['fermatainitiative.org', 'www.fermatainitiative.org'].includes(parsed.hostname) ? safePage(url) : parsed.origin + '/';
  } catch { return ''; }
}

type Params = Record<string, string | number | boolean>;
type Runtime = {
  hostname: string;
  referrer: string;
  command: (...args: unknown[]) => void;
  load: () => void;
  disable: (disabled: boolean) => void;
};
export function createAnalytics(runtime: Runtime) {
  const production = ['fermatainitiative.org', 'www.fermatainitiative.org'].includes(runtime.hostname);
  let allowed = false;
  let initialized = false;
  let page: { url: string; title: string } | undefined;
  let lastPage = '';
  let referrer = safeReferrer(runtime.referrer);
  const submissions = new Set<object>();
  function event(name: string, params: Params = {}) {
    if (allowed && initialized && production) runtime.command('event', name, params);
  }
  function sendPage() {
    if (!allowed || !production || !page || page.url === lastPage) return;
    if (!initialized) {
      runtime.disable(false);
      runtime.command('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
      runtime.command('js', new Date());
      runtime.command('config', measurementId, {
        send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false,
        cookie_expires: 60 * 60 * 24 * 180, cookie_update: false,
        page_location: page.url, page_title: page.title, page_referrer: referrer,
      });
      runtime.load();
      initialized = true;
    }
    const params = { page_location: page.url, page_title: page.title, page_referrer: lastPage || referrer };
    runtime.command('set', params);
    event('page_view', params);
    lastPage = page.url;
  }
  return {
    setConsent(granted: boolean) {
      allowed = granted;
      runtime.disable(!granted || !production);
      if (initialized) runtime.command('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
      if (!granted) { lastPage = ''; referrer = ''; }
      else sendPage();
    },
    page(url: string, title: string) { page = { url: safePage(url), title }; sendPage(); },
    formStart(type: unknown) { event('form_start', { form_id: 'contact', lead_type: leadType(type) }); },
    lead(result: { ok: boolean; success: unknown }, type: unknown, submission: object) {
      // An attempted send or a thank-you-page visit is not a conversion.
      if (!result.ok || result.success !== true || submissions.has(submission)) return;
      submissions.add(submission);
      event('generate_lead', { form_id: 'contact', lead_type: leadType(type), lead_source: 'website' });
    },
    contactClick(type: unknown, placement: string) {
      event('contact_click', { lead_type: leadType(type), placement: ['header', 'hero', 'footer'].includes(placement) ? placement : 'body' });
    },
    video(id: string) {
      if (/^[\w-]{11}$/.test(id)) event('select_content', { content_type: 'video', content_id: id });
    },
  };
}
