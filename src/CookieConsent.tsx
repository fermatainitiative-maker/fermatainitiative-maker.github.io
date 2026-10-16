import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { readConsent, saveConsent, type Consent } from './analytics-client';
import { analyticsEnabled } from './analytics';

export function CookieConsent() {
  const [choice, setChoice] = useState<Consent>(readConsent);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener('fermata-cookie-settings', show);
    return () => window.removeEventListener('fermata-cookie-settings', show);
  }, []);
  function choose(value: Exclude<Consent, null>) {
    saveConsent(value); setChoice(value); setOpen(false);
  }
  if (!open) return null;
  return <section className="cookie-notice" aria-label="Analytics preferences">
    <div><strong>Analytics settings</strong><p>Google Analytics helps us understand visits and music engagement. You can turn it off here. <Link to="/privacy">Privacy details</Link></p><small>Analytics is currently {analyticsEnabled(choice) ? 'on' : 'off'}.</small></div>
    <div className="cookie-actions"><button type="button" className="button cookie-choice" onClick={() => choose('declined')}>Turn off analytics</button><button type="button" className="button cookie-choice" onClick={() => choose('accepted')}>Turn on analytics</button><button type="button" className="cookie-close" onClick={() => setOpen(false)}>Close</button></div>
  </section>;
}
