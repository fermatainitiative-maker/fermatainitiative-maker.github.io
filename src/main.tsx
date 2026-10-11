import React, { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowDown, ArrowRight, ArrowUpRight, CheckCircle2, ChevronLeft, ChevronRight, Heart, MapPin, Menu, Music2, Play, Send, UsersRound, X, Youtube, Instagram, Facebook, LoaderCircle, CircleHelp } from 'lucide-react';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import { events, site, videos } from './content';
import './styles.css';

const nav = [{ to: '/about', label: 'About us' }, { to: '/events', label: 'Past events' }, { to: '/videos', label: 'Watch & listen' }, { to: '/contact', label: 'Contact' }];
const icons = { Instagram, YouTube: Youtube, Facebook };

function SocialLinks() {
  return <div className="social-links">{site.socials.map(s => {
    const Icon = icons[s.name as keyof typeof icons];
    return <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={`${s.name}${s.placeholder ? ' — placeholder platform link' : ''}`} title={`${s.name}${s.placeholder ? ' (profile coming soon)' : ''}`}><Icon size={19} /></a>;
  })}</div>;
}

function RouteEffects() {
  const location = useLocation();
  const previousPath = useRef(location.pathname);
  useEffect(() => {
    const pathname = location.pathname.replace(/\/$/, '') || '/';
    const label = nav.find(n => n.to === pathname)?.label || (pathname === '/thank-you' ? 'Thank you' : pathname === '/privacy' ? 'Privacy' : undefined);
    document.title = `${label || 'Music brings us together'} | The Fermata Initiative`;
    if (previousPath.current !== location.pathname) {
      const target = location.hash ? document.getElementById(location.hash.slice(1)) : null;
      if (target) target.scrollIntoView({ behavior: 'instant' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
      document.querySelector<HTMLElement>('main')?.focus({ preventScroll: true });
      previousPath.current = location.pathname;
    }
  }, [location.pathname, location.hash]);
  return null;
}

function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location]);
  return <>
    <a href="#main" className="skip-link" onClick={e => { e.preventDefault(); document.getElementById('main')?.focus(); }}>Skip to content</a>
    <header className="site-header"><div className="container header-inner">
      <Link className="brand" to="/" aria-label="The Fermata Initiative — home"><img src="/images/logo.png" alt="The Fermata Initiative" width="132" height="106" /></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{nav.map(n => <NavLink key={n.to} to={n.to}>{n.label}</NavLink>)}</nav>
      <Link to="/contact?interest=volunteer" className="button button-primary header-cta">Get involved <ArrowUpRight size={18} /></Link>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger className="menu-button icon-button" aria-label="Open navigation"><Menu /></Dialog.Trigger>
        <Dialog.Portal><Dialog.Overlay className="dialog-overlay" /><Dialog.Content className="mobile-menu">
          <Dialog.Title>Come on in.</Dialog.Title><Dialog.Description>Explore The Fermata Initiative.</Dialog.Description>
          <Dialog.Close className="dialog-close icon-button" aria-label="Close navigation"><X /></Dialog.Close>
          <nav aria-label="Mobile navigation"><Link to="/">Home</Link>{nav.map(n => <NavLink key={n.to} to={n.to}>{n.label}<ArrowUpRight size={20} /></NavLink>)}</nav>
          <Link to="/contact?interest=volunteer" className="button button-primary">Get involved <Heart size={18} /></Link>
        </Dialog.Content></Dialog.Portal>
      </Dialog.Root>
    </div></header>
  </>;
}

function Footer() {
  return <footer className="footer"><div className="container footer-top">
    <div className="footer-brand"><Link to="/" aria-label="Home"><img src="/images/logo.png" width="165" height="132" alt="The Fermata Initiative" /></Link><p>Good music.<br />Even better company.</p></div>
    <div><span className="footer-label">Take a look around</span><div className="footer-nav">{nav.map(n => <Link key={n.to} to={n.to}>{n.label}</Link>)}</div></div>
    <div className="footer-social"><span className="footer-label">Keep in tune</span><p>Little moments, shared.</p><SocialLinks /><small>Our social profiles are coming soon.</small></div>
  </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} The Fermata Initiative</span><span>Made for connection, here in Newfoundland.</span><Link to="/privacy">Privacy</Link></div></footer>;
}

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) { return <div className={`eyebrow${light ? ' light' : ''}`}><span />{children}</div>; }

function FermataMark({ className = '' }: { className?: string }) {
  return <svg className={`fermata-mark ${className}`} viewBox="0 0 160 100" fill="none" aria-hidden="true"><path d="M14 80a66 66 0 0 1 132 0" stroke="currentColor" strokeWidth="9" strokeLinecap="round" /><circle cx="80" cy="77" r="12" fill="currentColor" /></svg>;
}

function InvolveBanner() {
  return <section className="involve-banner"><div className="container involve-inner"><div><Eyebrow light>There's a place for you here</Eyebrow><h2>Help us make the<br />next moment happen.</h2><p>Share your music. Welcome a concert. Be part of the connection.</p></div><div className="involve-actions"><Link className="button button-cream" to="/contact?interest=volunteer">Become a volunteer <ArrowUpRight size={18} /></Link><Link className="light-link" to="/contact?interest=host">Bring music to your community <ArrowRight size={18} /></Link></div><FermataMark /></div></section>;
}

function Home() {
  return <>
    <section className="hero container">
      <div className="hero-copy"><Eyebrow>Music brings us together</Eyebrow><h1>A little music.<br />A lot of<br /><span>connection.</span></h1><p>We bring live, volunteer-led concerts to retirement communities in Newfoundland — creating space to listen, smile, and connect.</p><div className="hero-actions"><Link to="/contact?interest=volunteer" className="button button-primary">Be part of the music <ArrowUpRight size={18} /></Link><Link to="/about" className="text-link">Meet Fermata <ArrowRight size={18} /></Link></div><div className="hero-note"><span className="small-heart"><Heart size={16} /></span>Local musicians. Shared moments. Stronger communities.</div></div>
      <div className="hero-visual"><div className="hero-photo"><img src="/images/concert-wide.webp" alt="A pianist and clarinettist sharing live music with retirement community residents" fetchPriority="high" width="1500" height="1000" /></div><div className="music-stamp"><Music2 size={30} strokeWidth={1.5} /><span>MADE TO<br />BE SHARED</span></div><div className="photo-caption"><span className="caption-symbol"><Heart size={24} strokeWidth={1.5} /></span><div><strong>A room full of music.</strong><span>A moment of belonging.</span></div></div><span className="photo-location"><MapPin size={14} /> A moment at Heritage Square</span><FermataMark className="hero-mark" /></div>
    </section>
    <div className="values-ribbon"><div className="container"><span><Music2 />Live music, close to home</span><span><UsersRound />Connection across generations</span><span><Heart />Powered by volunteers</span></div></div>
    <section className="section container story-section"><div className="story-heading"><Eyebrow>Why we come together</Eyebrow><h2>Some things are<br />better <span className="green-text">shared.</span></h2><Link className="text-link" to="/about">Our story <ArrowRight size={18} /></Link></div><div className="story-copy"><p className="large-copy">A familiar melody. A foot tapping along.<br />A conversation that starts with a song.</p><p>Music has a way of bringing us closer. The Fermata Initiative is a Newfoundland-based nonprofit connecting volunteer musicians with retirement communities, one concert at a time.</p><p>Our aim is simple: to make room for joy, connection, and live music in everyday life.</p></div></section>
    <section className="moments-section section"><div className="container"><div className="section-heading"><div><Eyebrow>A few shared moments</Eyebrow><h2>Small concerts.<br />Lasting connections.</h2></div><Link to="/events" className="text-link">Explore past events <ArrowRight size={18} /></Link></div><div className="home-event-grid"><Link to="/events#heritage-square" className="featured-event"><div className="event-photo"><img loading="lazy" src="/images/concert-wide.webp" alt="Piano and clarinet performance at Heritage Square" width="1500" height="1000" /><span className="image-tag">From our community</span><span className="round-arrow"><ArrowUpRight /></span></div><div className="featured-event-info"><div><span className="meta">September 2026 · Heritage Square</span><h3>An afternoon, brought to life.</h3></div><span className="event-type">Community concert</span></div></Link><div className="moment-note"><FermataMark /><span className="eyebrow plain">A little pause. A shared experience.</span><h3>That's the<br />Fermata feeling.</h3><p>In music, a fermata invites us to hold a moment a little longer. We believe connection deserves the same.</p><Link to="/about" className="text-link">Get to know us <ArrowRight size={18} /></Link></div></div></div></section>
    <section className="section container"><div className="section-heading"><div><Eyebrow>Press play. Stay a while.</Eyebrow><h2>A little of what music can do.</h2></div><Link to="/videos" className="text-link">Watch & listen <ArrowRight size={18} /></Link></div><VideoCollection compact /></section>
    <InvolveBanner />
  </>;
}

function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: React.ReactNode; children: React.ReactNode }) {
  return <section className="page-intro container"><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><p>{children}</p><FermataMark /></section>;
}

function About() {
  return <><PageIntro eyebrow="Hello, we're Fermata" title={<>Making room for<br /><span>music. And each other.</span></>}>A Newfoundland-based nonprofit with a simple belief: a little live music can bring people a little closer.</PageIntro>
    <section className="container about-feature"><div className="about-photo"><img src="/images/concert-portrait.webp" alt="Residents gathered for a live piano and clarinet concert" width="1000" height="1500" /></div><div><Eyebrow>Our story</Eyebrow><h2>It starts with<br />showing up.</h2><p className="large-copy">A musician brings a song.<br />A community brings it to life.</p><p>We organise volunteer concerts in retirement communities across Newfoundland. By bringing musicians and residents together in familiar spaces, we hope to create moments of joy and connection that everyone can share.</p><p>For us, a concert is more than a performance. It's a reason to gather, a chance to hear something beautiful, and an invitation to spend a little time together.</p><Link className="text-link" to="/contact?interest=volunteer">Join us <ArrowRight size={18} /></Link></div></section>
    <section className="section container"><div className="section-heading"><div><Eyebrow>What brings us here</Eyebrow><h2>People at the heart.<br />Music in the room.</h2></div></div><div className="principles"><article><span className="principle-icon"><Music2 /></span><h3>Music within reach</h3><p>Bringing the concert to residents, in the places they already call home.</p></article><article><span className="principle-icon"><UsersRound /></span><h3>Time together</h3><p>Creating a welcoming space for residents, families, and musicians to connect.</p></article><article><span className="principle-icon"><Heart /></span><h3>Community spirit</h3><p>Local people sharing their time and their talents to make something meaningful.</p></article></div></section>
    <section className="name-story"><div className="container"><FermataMark /><div><Eyebrow>Behind the name</Eyebrow><h2>Hold the moment.</h2><p>A fermata is a musical symbol that asks us to hold a note or a pause a little longer. It's a lovely reminder to slow down, listen, and appreciate being together.</p></div></div></section><InvolveBanner /></>;
}

function Gallery({ event }: { event: typeof events[number] }) {
  const [index, setIndex] = useState(0);
  return <Dialog.Root><Dialog.Trigger className="text-link">View concert photos <ArrowUpRight size={18} /></Dialog.Trigger><Dialog.Portal><Dialog.Overlay className="dialog-overlay" /><Dialog.Content className="gallery-dialog" onKeyDown={e => { if(e.key === 'ArrowRight') setIndex(i => (i + 1) % event.gallery.length); if(e.key === 'ArrowLeft') setIndex(i => (i + event.gallery.length - 1) % event.gallery.length); }}>
    <Dialog.Title>{event.name}</Dialog.Title><Dialog.Description>{event.date} · A few moments from our visit.</Dialog.Description><Dialog.Close className="dialog-close icon-button" aria-label="Close gallery"><X /></Dialog.Close><div className="gallery-image"><img src={event.gallery[index]} alt={`${event.venue} concert, photograph ${index + 1} of ${event.gallery.length}`} /></div><div className="gallery-controls"><button className="icon-button" aria-label="Previous photo" onClick={() => setIndex(i => (i + event.gallery.length - 1) % event.gallery.length)}><ChevronLeft /></button><span aria-live="polite">{index + 1} / {event.gallery.length}</span><button className="icon-button" aria-label="Next photo" onClick={() => setIndex(i => (i + 1) % event.gallery.length)}><ChevronRight /></button></div>
  </Dialog.Content></Dialog.Portal></Dialog.Root>;
}

function Events() {
  return <><PageIntro eyebrow="From our community" title={<>The music ends.<br /><span>The moments stay.</span></>}>A look back at the places we've visited and the music we've shared.</PageIntro><section className="container event-list" aria-label="Past concerts">{events.map(event => <article className="event-row" id={event.id} key={event.id}><div className={`event-row-photo ${!event.image ? 'event-placeholder' : ''}`}>{event.image ? <img src={event.image} alt="Musicians performing at Heritage Square" width="1500" height="1000" /> : <><FermataMark /><span>More moments to share.</span><small>Concert photos coming soon</small></>}</div><div className="event-row-info"><span className="meta">{event.date} <span className="meta-dot">·</span> Community concert</span><h2>{event.name}</h2><p className="event-venue"><MapPin size={16} />{event.venue}, Newfoundland</p><p>{event.description}</p>{event.gallery.length > 0 ? <Gallery event={event} /> : <span className="coming-soon">Photo album on the way</span>}</div></article>)}</section><section className="container host-note"><Music2 size={30} /><div><h3>Your community could be our next stop.</h3><p>Let's talk about bringing a volunteer concert to your residents.</p></div><Link className="button button-primary" to="/contact?interest=host">Host a concert <ArrowUpRight size={18} /></Link></section><InvolveBanner /></>;
}

function VideoCollection({ compact = false }: { compact?: boolean }) {
  const [playing, setPlaying] = useState<string | null>(null);
  const items = compact ? videos.slice(0, 2) : videos;
  function play(e: MouseEvent<HTMLAnchorElement>, id: string) {
    if(e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    e.preventDefault(); setPlaying(id);
  }
  return <><div className={`video-grid ${compact ? 'compact' : ''}`}>{items.map(video => <article className="video-card" key={video.id}><div className="video-frame">{playing === video.id ? <><iframe src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&controls=1&rel=0&playsinline=1&iv_load_policy=3`} title={video.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /><button className="video-stop" onClick={() => setPlaying(null)} aria-label={`Close ${video.title}`}><X size={18} /></button></> : <a href={`https://www.youtube.com/watch?v=${video.id}`} onClick={e => play(e, video.id)} target="_blank" rel="noopener noreferrer" aria-label={`Play ${video.title}`}><img loading="lazy" src={video.image} alt="" width="800" height="450" /><span className="video-shade" /><span className="video-label">Sample performance</span><span className="play-button"><Play size={22} fill="currentColor" /></span><span className="video-watch">Watch performance <ArrowUpRight size={17} /></span></a>}</div><span className="meta">{video.category}</span><h3>{video.title}</h3></article>)}</div><p className="sample-note">A preview of our video collection. These sample performances will be replaced with Fermata concert recordings.</p></>;
}

function Videos() {
  return <><PageIntro eyebrow="Watch & listen" title={<>Make a little<br /><span>time for music.</span></>}>Settle in for a song. Our concert recordings will bring a little of the room to wherever you are.</PageIntro><section className="container videos-section"><VideoCollection /><div className="video-info"><Music2 size={22} /><p>Videos play right here when you press play. Prefer YouTube? Ctrl-click or open a video link in a new tab.</p></div></section><InvolveBanner /></>;
}

function Contact() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialInterest = ['volunteer', 'host'].includes(params.get('interest') || '') ? params.get('interest')! : 'general';
  const [interest, setInterest] = useState(initialInterest);
  const [state, setState] = useState<'idle' | 'sending' | 'error'>('idle');
  const [error, setError] = useState('');
  const statusRef = useRef<HTMLDivElement>(null);
  useEffect(() => setInterest(initialInterest), [initialInterest]);
  useEffect(() => { if(state === 'error') statusRef.current?.focus(); }, [state]);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(state === 'sending') return;
    const form = e.currentTarget;
    const data = new FormData(form);
    if(data.get('botcheck')) return;
    data.set('access_key', site.web3formsKey);
    data.set('subject', `Fermata website enquiry: ${interest === 'host' ? 'Host a concert' : interest === 'volunteer' ? 'Volunteer' : 'General enquiry'}`);
    data.set('from_name', 'The Fermata Initiative website');
    setState('sending'); setError('');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(Object.fromEntries(data)), signal: controller.signal });
      const result = await response.json();
      if(!response.ok || !result.success) throw new Error(response.status === 429 ? 'Please wait a little before trying again.' : 'Your message could not be sent. Please try again in a moment.');
      form.reset();
      navigate('/thank-you', { replace: true });
    } catch(err) {
      setState('error');
      setError(err instanceof Error && err.name === 'AbortError' ? 'The connection took too long. Please check your connection and try again.' : err instanceof TypeError ? 'We could not connect. Please check your internet connection and try again.' : err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally { window.clearTimeout(timeout); }
  }
  return <><PageIntro eyebrow="Let's make a connection" title={<>It starts with<br /><span>a hello.</span></>}>Want to share your music, host a concert, or just learn a little more? We'd love to hear from you.</PageIntro><section className="container contact-layout"><aside><div className="contact-option"><span className="principle-icon"><Music2 /></span><h3>Share your music</h3><p>Musicians, singers, and helping hands: tell us a little about yourself and how you'd like to get involved.</p><button className="text-link" onClick={() => { setInterest('volunteer'); document.getElementById('name')?.focus(); }}>I'd like to volunteer <ArrowRight size={18} /></button></div><div className="contact-option"><span className="principle-icon"><UsersRound /></span><h3>Welcome a concert</h3><p>Part of a retirement community? Let's explore a visit that works for your residents and your space.</p><button className="text-link" onClick={() => { setInterest('host'); document.getElementById('name')?.focus(); }}>I'd like to host <ArrowRight size={18} /></button></div><div className="location-note"><MapPin size={18} /><span>Based in Newfoundland, Canada</span></div></aside><div className="form-card"><form onSubmit={submit}><h2>Drop us a note.</h2><p className="form-intro">All fields are required, except your organisation.</p><div className="form-grid"><label htmlFor="name">Your name<input id="name" name="name" autoComplete="name" placeholder="First and last name" required maxLength={120} /></label><label htmlFor="email">Email address<input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} /></label></div><label htmlFor="interest">I'm getting in touch about<select name="interest" id="interest" value={interest} onChange={e => setInterest(e.target.value)}><option value="general">A general hello</option><option value="volunteer">Volunteering / performing</option><option value="host">Hosting a concert</option><option value="partnership">A community partnership</option></select></label><label htmlFor="organisation">Organisation <span className="optional">(optional)</span><input id="organisation" name="organisation" autoComplete="organization" placeholder="Your community, group, or organisation" maxLength={180} /></label><label htmlFor="message">Your message<textarea id="message" name="message" rows={5} placeholder={interest === 'host' ? 'Tell us about your community, location, and any dates you have in mind…' : interest === 'volunteer' ? 'Tell us what you play or how you would like to help…' : 'A question, an idea, a little introduction…'} required maxLength={5000} /></label><input type="checkbox" name="botcheck" className="botcheck" tabIndex={-1} aria-hidden="true" /><p className="form-privacy">We'll use your details to respond to your enquiry. Messages are delivered through Web3Forms. <Link to="/privacy">Privacy details</Link></p>{state === 'error' && <div className="form-error" role="alert" tabIndex={-1} ref={statusRef}>{error} Your message is still here.</div>}<button type="submit" className="button button-primary submit-button" disabled={state === 'sending'}>{state === 'sending' ? <><LoaderCircle className="spin" size={18} />Sending…</> : <>Send your message <Send size={18} /></>}</button></form></div></section><section className="section container faq-section"><Eyebrow>A few helpful notes</Eyebrow><h2>Before you say hello.</h2><div className="faq-list"><details><summary>Who can volunteer?<CircleHelp size={20} /></summary><p>We'd love to hear from musicians, singers, and people who enjoy helping a concert come together. Use the form to tell us about your interests and availability.</p></details><details><summary>How do we arrange a visit?<CircleHelp size={20} /></summary><p>Choose “Hosting a concert” in the form and tell us about your retirement community, where you're located, and any dates you have in mind. We'll start a conversation about what might work.</p></details><details><summary>Do you only welcome one kind of music?<CircleHelp size={20} /></summary><p>We welcome conversations about different instruments and musical styles. Tell us what you love to perform, and we can explore how it could fit a community concert.</p></details></div></section></>;
}

function ThankYou() {
  return <section className="container thank-you-page"><div className="thank-you-card">
    <span className="thank-you-icon" aria-hidden="true"><CheckCircle2 size={32} /></span>
    <Eyebrow>Message sent</Eyebrow>
    <h1>Thanks for<br /><span>saying hello.</span></h1>
    <p>Your message is on its way to our team. We're looking forward to connecting with you.</p>
    <div className="thank-you-actions"><Link className="button button-primary" to="/">Back to home <ArrowRight size={18} /></Link><Link className="text-link" to="/videos">Enjoy a little music <Play size={17} /></Link></div>
    <FermataMark />
  </div></section>;
}

function Privacy() {
  return <section className="container section privacy-page"><Eyebrow>Your information</Eyebrow><h1>A note on privacy.</h1><p>The contact form asks for your name, email address, and message, plus an optional organisation. We use these details to respond to your enquiry and coordinate the volunteering, concert, or partnership you ask about.</p><h2>Contact form delivery</h2><p>Messages are sent through Web3Forms, which processes the submitted information to deliver it by email. Please avoid including sensitive personal information. See the <a href="https://web3forms.com/privacy" target="_blank" rel="noopener noreferrer">Web3Forms privacy policy</a> for its practices.</p><h2>Videos and external links</h2><p>Video players connect to YouTube's privacy-enhanced embed domain only when you press play. YouTube may then collect information according to its policies. Social links open external websites. This website uses locally hosted fonts and images and does not include analytics.</p><h2>Questions about your details?</h2><p>Use the <Link to="/contact">contact form</Link> to ask about information you've shared or to request its removal from our correspondence.</p></section>;
}

function App() {
  return <BrowserRouter><RouteEffects /><Header /><main id="main" tabIndex={-1}><Routes><Route path="/" element={<Home />} /><Route path="/about" element={<About />} /><Route path="/events" element={<Events />} /><Route path="/videos" element={<Videos />} /><Route path="/contact" element={<Contact />} /><Route path="/privacy" element={<Privacy />} /><Route path="/thank-you" element={<ThankYou />} /><Route path="*" element={<section className="container section"><h1>Let's get you back<br />to the music.</h1><Link className="button button-primary" to="/">Back home <ArrowRight size={18} /></Link></section>} /></Routes></main><Footer /><a href="#main" className="back-top" aria-label="Back to top" onClick={e => {e.preventDefault(); window.scrollTo({top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'}); document.getElementById('main')?.focus({ preventScroll: true });}}><ArrowDown size={18} /></a></BrowserRouter>;
}

// Keep links shared before clean page URLs were introduced working.
if (window.location.hash.startsWith('#/')) {
  window.history.replaceState(null, '', window.location.hash.slice(1));
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
