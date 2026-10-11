import { useEffect, useRef, useState, type ReactNode } from 'react';
import './coming-soon.css';

const sessionKey = 'fermata-preview-unlocked';

// A temporary preview curtain, intentionally not an authentication mechanism.
export function PreviewGate({ children }: { children: ReactNode }) {
  const clicks = useRef(0);
  const [unlocked, setUnlocked] = useState(() => {
    try { return sessionStorage.getItem(sessionKey) === 'yes'; }
    catch { return false; }
  });

  useEffect(() => {
    if (!unlocked) document.title = 'Coming soon | The Fermata Initiative';
    else document.getElementById('main')?.focus({ preventScroll: true });
  }, [unlocked]);

  function reveal() {
    clicks.current += 1;
    if (clicks.current < 10) return;
    try { sessionStorage.setItem(sessionKey, 'yes'); } catch { /* Still reveal if storage is unavailable. */ }
    setUnlocked(true);
  }

  if (unlocked) return children;

  return <main className="coming-soon">
    <img className="coming-soon-logo" src="/images/logo.png" alt="The Fermata Initiative" width="180" height="144" />
    <div className="coming-soon-content">
      <svg className="coming-soon-mark" viewBox="0 0 160 100" fill="none" aria-hidden="true"><path d="M14 80a66 66 0 0 1 132 0" stroke="currentColor" strokeWidth="7" strokeLinecap="round" /><circle cx="80" cy="77" r="11" fill="currentColor" /></svg>
      <p className="coming-soon-eyebrow">A little pause before the music.</p>
      <h1><button type="button" onClick={reveal}>Coming soon.</button></h1>
      <p className="coming-soon-description">Bringing live music and shared moments to retirement communities across Newfoundland.</p>
      <span className="coming-soon-rule" aria-hidden="true" />
      <p className="coming-soon-note">We look forward to welcoming you.</p>
    </div>
    <footer>© {new Date().getFullYear()} The Fermata Initiative</footer>
  </main>;
}
