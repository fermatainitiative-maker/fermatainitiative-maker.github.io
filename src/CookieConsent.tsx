import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { readConsent, saveConsent, type Consent } from './analytics-client';

export function CookieConsent() {
  const [choice, setChoice] = useState<Consent>(readConsent);
  const [open, setOpen] = useState(choice === null);
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
    <div><strong>A little help understanding our website</strong><p>May we use Google Analytics to see which pages and music people enjoy? It’s optional. <Link to="/privacy">Privacy details</Link></p>{choice && <small>Analytics is currently {choice === 'accepted' ? 'on' : 'off'}.</small>}</div>
    <div className="cookie-actions"><button type="button" className="button cookie-choice" onClick={() => choose('declined')}>Decline</button><button type="button" className="button cookie-choice" onClick={() => choose('accepted')}>Accept analytics</button>{choice && <button type="button" className="cookie-close" onClick={() => setOpen(false)}>Close</button>}</div>
  </section>;
}
