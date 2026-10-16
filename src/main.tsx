import React, { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowDown, ArrowRight, ArrowUpRight, CheckCircle2, ChevronLeft, ChevronRight, Heart, MapPin, Menu, Music2, Play, Send, UsersRound, X, Youtube, LoaderCircle, CircleHelp } from 'lucide-react';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import { events, site, videos, type Concert, type ConcertMedia } from './content';
import './styles.css';
import { analytics, openCookieSettings } from './analytics-client';
import { CookieConsent } from './CookieConsent';
import { updatePageMetadata } from './seo';

const nav = [{ to: '/', label: 'Home' }, { to: '/about', label: 'About us' }, { to: '/music', label: 'Our music' }, { to: '/contact', label: 'Contact' }];
const icons = { YouTube: Youtube };

function SocialLinks() {
  return <div className="social-links">{site.socials.map(s => {
    const Icon = icons[s.name as keyof typeof icons];
    return <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.name} title={s.name}><Icon size={19} /></a>;
  })}</div>;
}

function RouteEffects() {
  const location = useLocation();
  const previousPath = useRef(location.pathname);
  const previousHash = useRef('');
  useEffect(() => {
    const pathname = location.pathname.replace(/\/$/, '') || '/';
    updatePageMetadata(location.pathname);
    if (!['/events', '/videos'].includes(pathname)) analytics.page(window.location.href, document.title);
    if (previousPath.current !== location.pathname || previousHash.current !== location.hash || location.hash) {
      const target = location.hash ? document.getElementById(location.hash.slice(1)) : null;
      if (target) target.scrollIntoView({ behavior: 'instant' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
      document.querySelector<HTMLElement>('main')?.focus({ preventScroll: true });
      previousPath.current = location.pathname;
      previousHash.current = location.hash;
    }
  }, [location.pathname, location.search, location.hash, location.key]);
  return null;
}

function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location]);
  return <>
    <a href="#main" className="skip-link" onClick={e => { e.preventDefault(); document.getElementById('main')?.focus(); }}>Skip to content</a>
    <header className="site-header"><div className="container header-inner">
      <Link className="brand" to="/" aria-label="The Fermata Initiative - home"><img src="/images/logo.png" alt="The Fermata Initiative" width="132" height="106" /></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{nav.map(n => <NavLink key={n.to} to={n.to}>{n.label}</NavLink>)}</nav>
      <Link to="/contact?interest=volunteer" className="button button-primary header-cta">Get involved <ArrowUpRight size={18} /></Link>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger className="menu-button icon-button" aria-label="Open navigation"><Menu /></Dialog.Trigger>
        <Dialog.Portal><Dialog.Overlay className="dialog-overlay" /><Dialog.Content className="mobile-menu">
          <Dialog.Title>Come on in.</Dialog.Title><Dialog.Description>Explore The Fermata Initiative.</Dialog.Description>
          <Dialog.Close className="dialog-close icon-button" aria-label="Close navigation"><X /></Dialog.Close>
          <nav aria-label="Mobile navigation">{nav.map(n => <NavLink key={n.to} to={n.to}>{n.label}<ArrowUpRight size={20} /></NavLink>)}</nav>
          <Link to="/contact?interest=volunteer" className="button button-primary">Get involved <Heart size={18} /></Link>
        </Dialog.Content></Dialog.Portal>
      </Dialog.Root>
    </div></header>
  </>;
}

function Footer() {
  return <footer className="footer"><div className="container footer-top">
    <div className="footer-brand"><Link to="/" aria-label="Home"><img src="/images/logo.png" width="165" height="132" alt="The Fermata Initiative" /></Link><p>The audience is part of the show.</p></div>
    <div><span className="footer-label">Take a look around</span><div className="footer-nav">{nav.map(n => <Link key={n.to} to={n.to}>{n.label}</Link>)}</div></div>
    <div className="footer-social"><span className="footer-label">Keep in tune</span><p>Little moments, shared.</p><SocialLinks /></div>
  </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} The Fermata Initiative</span><span className="footer-privacy"><Link to="/privacy">Privacy</Link><button type="button" onClick={openCookieSettings}>Analytics settings</button></span></div></footer>;
}

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) { return <div className={`eyebrow${light ? ' light' : ''}`}><span />{children}</div>; }

function FermataMark({ className = '' }: { className?: string }) {
  return <svg className={`fermata-mark ${className}`} viewBox="0 0 160 100" fill="none" aria-hidden="true"><path d="M14 80a66 66 0 0 1 132 0" stroke="currentColor" strokeWidth="9" strokeLinecap="round" /><circle cx="80" cy="77" r="12" fill="currentColor" /></svg>;
}

function InvolveBanner() {
  return <section className="involve-banner"><div className="container involve-inner"><div><h2>Help us make the<br />next moment happen.</h2><p>Share your music. Welcome a concert. Be part of the connection.</p></div><div className="involve-actions"><Link className="button button-cream" to="/contact?interest=volunteer">Become a volunteer <ArrowUpRight size={18} /></Link><Link className="light-link" to="/contact?interest=host">Bring music to your community <ArrowRight size={18} /></Link></div><FermataMark /></div></section>;
}

function Home() {
  return <>
    <section className="hero-section">
      <div className="hero-background" aria-hidden="true"><FermataMark /></div>
      <div className="hero container">
      <div className="hero-copy"><h1>Music Made{' '}<span className="hero-title-bridge">to be</span>{' '}<span className="hero-title-shared">Shared.</span></h1><p>We bring live, volunteer-led concerts to retirement communities in Newfoundland - creating space to listen, smile, and connect.</p><div className="hero-actions"><Link to="/contact?interest=volunteer" className="button button-primary">Be part of the music <ArrowUpRight size={18} /></Link><Link to="/about" className="text-link">Meet Fermata <ArrowRight size={18} /></Link></div></div>
      <div className="hero-visual"><div className="hero-photo"><img src="/images/heritage-duet.webp" alt="A pianist and clarinettist sharing live music with retirement community residents" fetchPriority="high" width="1500" height="1000" /></div><div className="photo-caption"><span className="caption-symbol"><MapPin size={24} strokeWidth={1.5} aria-hidden="true" /></span><div><strong>Heritage Square</strong><span className="caption-location">Conception Bay South</span></div></div></div>
      </div>
    </section>
    <section className="home-story section"><div className="container story-section"><div className="story-heading"><Eyebrow>Why we do this</Eyebrow><h2>Music is better<br />with <span className="green-text">company.</span></h2><Link className="text-link" to="/about">Our story <ArrowRight size={18} /></Link></div><div className="story-copy"><p>The Fermata Initiative is a nonprofit run by local, volunteer musicians in Newfoundland. We visit retirement communities and senior living centers to provide free concerts for the community.</p><p>We play classical, jazz, pop and Newfoundland traditional music, so there’s usually something for everyone. We know live music isn’t like a recording, so our volunteers ensure our audience is part of the concert every time.</p></div></div></section>
    <section className="moments-section section"><div className="container"><div className="section-heading"><div><h2>The audience is<br />part of the show.</h2></div><Link to="/music" className="text-link">Explore our music <ArrowRight size={18} /></Link></div><div className="home-event-grid"><Link to="/music#westbury-estates" className="featured-event"><div className="event-photo"><img loading="lazy" src="/images/westbury-piano.webp" alt="A pianist performing at Westbury Estates in St. John’s" width="1600" height="900" /><span className="image-tag">From our community</span><span className="round-arrow"><ArrowUpRight /></span></div><div className="featured-event-info"><div><span className="meta">Westbury Estates, St. John’s</span><h3>An afternoon, brought to life.</h3></div><span className="event-type">Community concert</span></div></Link><div className="moment-note"><FermataMark /><p>Our namesake is the fermata: the symbol in sheet music that tells a player to hold a note longer than written.</p><p>Like the fermata, we encourage slowing down for a moment, taking a beat, and savoring the music.</p><Link to="/about" className="text-link">Get to know us <ArrowRight size={18} /></Link></div></div></div></section>
    <section className="home-videos section"><div className="container"><div className="section-heading"><div><Eyebrow>Classical, jazz, pop and Newfoundland music, played live.</Eyebrow><h2>A little taste of our music</h2></div><Link to="/music#watch-listen" className="text-link">Watch & listen <ArrowRight size={18} /></Link></div><VideoCollection compact /></div></section>
    <InvolveBanner />
  </>;
}

function PageIntro({ eyebrow, title, children, className = '' }: { eyebrow?: string; title: React.ReactNode; children: React.ReactNode; className?: string }) {
  return <section className={`page-intro container ${className}`}>{eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}<h1>{title}</h1><p>{children}</p><FermataMark /></section>;
}

function About() {
  return <><PageIntro title={<>Live music for<br /><span>retirement communities.</span></>}>We’re a Newfoundland nonprofit. Volunteer musicians play live for residents of retirement communities and nursing homes.</PageIntro>
    <section className="container about-feature">
      <div className="about-photo"><img src="/images/concert-portrait.webp" alt="Residents gathered for a live piano and clarinet concert" width="1000" height="1500" /></div>
      <div>
        <Eyebrow>Our story</Eyebrow>
        <h2>How it started</h2>
        <p className="large-copy">We’re a group of musicians and friends who enjoy sharing the music we love with other people.</p>
        <p>We organise volunteer concerts in retirement communities and nursing homes across Newfoundland. We play classical repertoire, jazz, and pop in common rooms and halls, and introduce communities to the reason behind each piece.</p>
        <p>A concert is the perfect opportunity to get together, hear something new, and spend quality time with others.</p>
        <Link className="text-link" to="/contact?interest=volunteer">Join us <ArrowRight size={18} /></Link>
      </div>
    </section>
    <section className="section container">
      <div className="section-heading"><div><Eyebrow>What we care about</Eyebrow><h2>Sharing the joy of live music with everyone.</h2></div></div>
      <div className="principles">
        <article><span className="principle-icon"><UsersRound /></span><h3>Time together</h3><p>A relaxed space where residents, families, and musicians can talk and enjoy the music together.</p></article>
        <article><span className="principle-icon"><Heart /></span><h3>Community</h3><p>Local people giving their time to play for their neighbours.</p></article>
        <article><span className="principle-icon"><Music2 /></span><h3>Playing together</h3><p>As music students, we enjoy finding new opportunities to play together and share our music with an audience.</p></article>
      </div>
    </section>
    <section className="name-story"><div className="container"><FermataMark /><div><h2>Why “Fermata”</h2><p>Our namesake is the fermata: the symbol in sheet music that tells a player to hold a note longer than written. Like the fermata, we encourage slowing down for a moment, taking a beat, and savoring the music.</p></div></div></section>
    <InvolveBanner />
  </>;
}

function ConcertVideo({ media }: { media: Extract<ConcertMedia, { type: 'video' }> }) {
  const [playing, setPlaying] = useState(false);
  return <div className="concert-video">
    {playing ? <iframe src={`https://www.youtube-nocookie.com/embed/${media.youtubeId}?autoplay=1&controls=1&rel=0&playsinline=1&enablejsapi=1`} title={media.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /> : <button type="button" onClick={() => { analytics.video(media.youtubeId); setPlaying(true); }} aria-label={`Play ${media.title}`}><img src={media.poster} alt="" /><span className="play-button"><Play size={26} fill="currentColor" /></span></button>}
  </div>;
}

function MusicGallery({ concerts }: { concerts: Concert[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const opener = useRef<HTMLButtonElement | null>(null);
  const items = concerts.flatMap(concert => concert.media.map((media, mediaIndex) => ({ concert, media, mediaIndex }))).sort((a, b) => a.mediaIndex - b.mediaIndex);
  if (!items.length) return null;
  // Share the preview space across visits; extra footage stays in the viewer.
  const highlights = items.map((item, itemIndex) => ({ ...item, itemIndex })).filter(item => item.mediaIndex < 2);
  const current = items[index];
  function show(itemIndex: number, trigger: HTMLButtonElement) {
    opener.current = trigger;
    setIndex(itemIndex);
    setOpen(true);
  }
  function move(direction: number) { setIndex(i => (i + direction + items.length) % items.length); }
  return <section className="container music-moments" aria-label="Photos and recordings from our visits">
    <div className={`moments-gallery-grid moments-grid-${Math.min(highlights.length, 3)}`}>
      {highlights.map(({ concert, media, mediaIndex, itemIndex }) => <figure className="moment-tile" id={mediaIndex === 0 ? concert.id : undefined} key={`${concert.id}-${mediaIndex}`}>
        <button type="button" className="moment-photo" aria-haspopup="dialog" onClick={e => show(itemIndex, e.currentTarget)} aria-label={`Open ${media.type === 'photo' ? media.alt : media.title}`}>
          <img src={media.type === 'photo' ? media.src : media.poster} alt="" loading={itemIndex === 0 ? 'eager' : 'lazy'} style={{ objectPosition: media.position || 'center' }} />
          {media.type === 'video' && <span className="play-button"><Play size={24} fill="currentColor" /></span>}
          <span className="moment-open" aria-hidden="true"><ArrowUpRight size={20} /></span>
        </button>
        <figcaption><MapPin size={16} aria-hidden="true" /><div><span>{concert.venue}</span><small>{concert.location}</small></div></figcaption>
      </figure>)}
    </div>
    <div className="moments-gallery-footer"><p>A few moments from our visits.</p><button type="button" className="text-link" aria-haspopup="dialog" onClick={e => show(0, e.currentTarget)}>Browse the gallery<ArrowUpRight size={18} /></button></div>
    <Dialog.Root open={open} onOpenChange={setOpen}><Dialog.Portal><Dialog.Overlay className="dialog-overlay" /><Dialog.Content className="gallery-dialog music-gallery" onCloseAutoFocus={e => { e.preventDefault(); opener.current?.focus({ preventScroll: true }); }} onKeyDown={e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); move(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); }
    }}>
      <Dialog.Title>{current.concert.venue}</Dialog.Title><Dialog.Description>{current.concert.location}</Dialog.Description>
      <Dialog.Close className="dialog-close icon-button" aria-label="Close gallery"><X /></Dialog.Close>
      <div className="gallery-image">{current.media.type === 'photo' ? <img src={current.media.src} alt={current.media.alt} /> : <ConcertVideo key={current.media.youtubeId} media={current.media} />}</div>
      <div className="gallery-controls">
        {items.length > 1 && <button type="button" className="icon-button" aria-label="Previous item" onClick={() => move(-1)}><ChevronLeft /></button>}
        <span aria-live="polite">{index + 1} / {items.length}</span>
        {items.length > 1 && <button type="button" className="icon-button" aria-label="Next item" onClick={() => move(1)}><ChevronRight /></button>}
      </div>
    </Dialog.Content></Dialog.Portal></Dialog.Root>
  </section>;
}

function OurMusic() {
  return <>
    <PageIntro className="music-intro" eyebrow="Our music" title={<>We Come to <span>You.</span></>}>A look back at the places we've visited and the music we've shared.</PageIntro>
    <MusicGallery concerts={events} />
    <section className="music-listening section" id="watch-listen"><div className="container">
      <div className="section-heading"><div><Eyebrow>Watch & listen</Eyebrow><h2>A little taste of our music</h2><p>Classical, jazz, pop and Newfoundland music, played live.</p></div></div>
      <VideoCollection />
    </div></section>
    <section className="container music-places section" aria-labelledby="music-places-title">
      <div className="music-places-intro"><Eyebrow>From our community</Eyebrow><h2 id="music-places-title">Where we’ve played</h2><p>Live music for retirement communities and nursing homes in Newfoundland.</p></div>
      <ul className="venue-list">{events.map(concert => <li key={concert.id} id={concert.media.length ? undefined : concert.id}>
        <span className="venue-symbol" aria-hidden="true"><MapPin size={23} strokeWidth={1.5} /></span>
        <div><h3>{concert.venue}</h3><p>{concert.location}</p></div>
      </li>)}</ul>
    </section>
    <section className="container host-note"><Music2 size={30} /><div><h3>Your community could be our next stop.</h3><p>Let's talk about bringing a volunteer concert to your residents.</p></div><Link className="button button-primary" to="/contact?interest=host">Host a concert <ArrowUpRight size={18} /></Link></section>
    <InvolveBanner />
  </>;
}

function MusicRedirect({ listening = false }: { listening?: boolean }) {
  const location = useLocation();
  return <Navigate replace to={`/music${location.search}${location.hash || (listening ? '#watch-listen' : '')}`} />;
}

function VideoCollection({ compact = false }: { compact?: boolean }) {
  const [playing, setPlaying] = useState<string | null>(null);
  const items = compact ? videos.filter(video => video.featured) : videos;
  function play(e: MouseEvent<HTMLAnchorElement>, id: string) {
    if(e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    e.preventDefault(); analytics.video(id); setPlaying(id);
  }
  return <><div className={`video-grid ${compact ? 'compact' : ''}`}>{items.map(video => <article className="video-card" key={video.id}><div className="video-frame">{playing === video.id ? <><iframe src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&controls=1&rel=0&playsinline=1&enablejsapi=1&iv_load_policy=3`} title={video.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /><button className="video-stop" onClick={() => setPlaying(null)} aria-label={`Close ${video.title}`}><X size={18} /></button></> : <a href={`https://www.youtube.com/watch?v=${video.id}`} onClick={e => play(e, video.id)} target="_blank" rel="noopener noreferrer" aria-label={`Play ${video.title}`}><img loading="lazy" src={video.image} alt="" width="800" height="450" /><span className="video-shade" /><span className="play-button"><Play size={22} fill="currentColor" /></span><span className="video-watch">Watch performance <ArrowUpRight size={17} /></span></a>}</div><span className="meta">{video.category}</span><h3>{video.title}</h3></article>)}</div></>;
}

function Contact() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialInterest = ['volunteer', 'host'].includes(params.get('interest') || '') ? params.get('interest')! : 'general';
  const [interest, setInterest] = useState(initialInterest);
  const [state, setState] = useState<'idle' | 'sending' | 'error'>('idle');
  const [error, setError] = useState('');
  const statusRef = useRef<HTMLDivElement>(null);
  const sending = useRef(false);
  const started = useRef(false);
  function formStarted(e: FormEvent<HTMLFormElement>) {
    if (!started.current) {
      started.current = true;
      analytics.formStart(new FormData(e.currentTarget).get('interest'));
    }
  }
  useEffect(() => setInterest(initialInterest), [initialInterest]);
  useEffect(() => { if(state === 'error') statusRef.current?.focus(); }, [state]);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(sending.current) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    if(data.get('botcheck')) return;
    sending.current = true;
    const submission = {};
    const submittedInterest = data.get('interest');
    data.set('access_key', site.web3formsKey);
    data.set('subject', `Fermata website enquiry: ${interest === 'host' ? 'Host a concert' : interest === 'volunteer' ? 'Volunteer' : 'General enquiry'}`);
    data.set('from_name', 'The Fermata Initiative website');
    setState('sending'); setError('');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(Object.fromEntries(data)), signal: controller.signal });
      const result = await response.json();
      if(!response.ok || result.success !== true) throw new Error(response.status === 429 ? 'Please wait a little before trying again.' : 'Your message could not be sent. Please try again in a moment.');
      analytics.lead({ ok: response.ok, success: result.success }, submittedInterest, submission);
      form.reset();
      navigate('/thank-you', { replace: true });
    } catch(err) {
      setState('error');
      setError(err instanceof Error && err.name === 'AbortError' ? 'The connection took too long. Please check your connection and try again.' : err instanceof TypeError ? 'We could not connect. Please check your internet connection and try again.' : err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally { window.clearTimeout(timeout); sending.current = false; }
  }
  return <><PageIntro eyebrow="Let's make a connection" title={<>It starts with<br /><span>a hello.</span></>}>Want to share your music, host a concert, or just learn a little more? We'd love to hear from you.</PageIntro><section className="container contact-layout"><aside><div className="contact-option"><span className="principle-icon"><Music2 /></span><h3>Share your music</h3><p>Musicians, singers, and helping hands: tell us a little about yourself and how you'd like to get involved.</p><button className="text-link" onClick={() => { setInterest('volunteer'); document.getElementById('name')?.focus(); }}>I'd like to volunteer <ArrowRight size={18} /></button></div><div className="contact-option"><span className="principle-icon"><UsersRound /></span><h3>Welcome a concert</h3><p>Part of a retirement community? Let's explore a visit that works for your residents and your space.</p><button className="text-link" onClick={() => { setInterest('host'); document.getElementById('name')?.focus(); }}>I'd like to host <ArrowRight size={18} /></button></div><div className="location-note"><MapPin size={18} /><span>Based in Newfoundland, Canada</span></div></aside><div className="form-card"><form id="contact-form" onSubmit={submit} onChange={formStarted}><h2>Drop us a note.</h2><p className="form-intro">All fields are required, except your organisation.</p><div className="form-grid"><label htmlFor="name">Your name<input id="name" name="name" autoComplete="name" placeholder="First and last name" required maxLength={120} /></label><label htmlFor="email">Email address<input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} /></label></div><label htmlFor="interest">I'm getting in touch about<select name="interest" id="interest" value={interest} onChange={e => setInterest(e.target.value)}><option value="general">A general hello</option><option value="volunteer">Volunteering / performing</option><option value="host">Hosting a concert</option><option value="partnership">A community partnership</option></select></label><label htmlFor="organisation">Organisation <span className="optional">(optional)</span><input id="organisation" name="organisation" autoComplete="organization" placeholder="Your community, group, or organisation" maxLength={180} /></label><label htmlFor="message">Your message<textarea id="message" name="message" rows={5} placeholder={interest === 'host' ? 'Tell us about your community, location, and any dates you have in mind…' : interest === 'volunteer' ? 'Tell us what you play or how you would like to help…' : 'A question, an idea, a little introduction…'} required maxLength={5000} /></label><input type="checkbox" name="botcheck" className="botcheck" tabIndex={-1} aria-hidden="true" />{state === 'error' && <div className="form-error" role="alert" tabIndex={-1} ref={statusRef}>{error} Your message is still here.</div>}<button type="submit" className="button button-primary submit-button" disabled={state === 'sending'}>{state === 'sending' ? <><LoaderCircle className="spin" size={18} />Sending…</> : <>Send your message <Send size={18} /></>}</button></form></div></section><section className="section container faq-section"><Eyebrow>A few helpful notes</Eyebrow><h2>Before you say hello.</h2><div className="faq-list"><details><summary>Who can volunteer?<CircleHelp size={20} /></summary><p>We'd love to hear from musicians, singers, and people who enjoy helping a concert come together. Use the form to tell us about your interests and availability.</p></details><details><summary>How do we arrange a visit?<CircleHelp size={20} /></summary><p>Choose “Hosting a concert” in the form and tell us about your retirement community, where you're located, and any dates you have in mind. We'll start a conversation about what might work.</p></details><details><summary>Do you only welcome one kind of music?<CircleHelp size={20} /></summary><p>We welcome conversations about different instruments and musical styles. Tell us what you love to perform, and we can explore how it could fit a community concert.</p></details></div></section></>;
}

function ThankYou() {
  return <section className="container thank-you-page"><div className="thank-you-card">
    <span className="thank-you-icon" aria-hidden="true"><CheckCircle2 size={32} /></span>
    <Eyebrow>Message sent</Eyebrow>
    <h1>Thanks for<br /><span>saying hello.</span></h1>
    <p>Your message is on its way to our team. We're looking forward to connecting with you.</p>
    <div className="thank-you-actions"><Link className="button button-primary" to="/">Back to home <ArrowRight size={18} /></Link><Link className="text-link" to="/music#watch-listen">Enjoy a little music <Play size={17} /></Link></div>
    <FermataMark />
  </div></section>;
}

function Privacy() {
  return <section className="container section privacy-page"><Eyebrow>Your information</Eyebrow><h1>A note on privacy.</h1><p>The contact form asks for your name, email address, and message, plus an optional organisation. We use these details to respond to your enquiry and coordinate the volunteering, concert, or partnership you ask about.</p><h2>Contact form delivery</h2><p>Messages are sent through Web3Forms, which processes the submitted information to deliver it by email. Please avoid including sensitive personal information. See the <a href="https://web3forms.com/privacy" target="_blank" rel="noopener noreferrer">Web3Forms privacy policy</a> for its practices.</p><h2>Videos and external links</h2><p>Video players connect to YouTube's privacy-enhanced embed domain only when you press play. YouTube may then collect information according to its policies. Social links open external websites. This website uses locally hosted fonts and images.</p><h2>Optional website analytics</h2><p>We use Google Analytics to understand visits, page use, music engagement, and successful enquiries. It receives technical information such as browser and device details, approximate location, and a cookie identifier. For enquiries, we send only the category (such as volunteering or hosting), never your name, email address, organisation, or message text. Advertising personalisation is disabled.</p><p>Analytics is on by default unless you have opted out. We remember your choice for six months; you can <button type="button" className="privacy-settings" onClick={openCookieSettings}>change your analytics settings</button> at any time. Turning analytics off stops future collection and removes this site's Analytics cookies. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google’s privacy policy</a> for how Google processes data.</p><h2>Questions about your details?</h2><p>Use the <Link to="/contact">contact form</Link> to ask about information you've shared or to request its removal from our correspondence.</p></section>;
}

function ContactClickTracking() {
  useEffect(() => {
    function click(event: globalThis.MouseEvent) {
      const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const url = new URL(anchor.href);
      if (url.origin !== window.location.origin || url.pathname.replace(/\/$/, '') !== '/contact') return;
      const placement = anchor.closest('header') ? 'header' : anchor.closest('.hero') ? 'hero' : anchor.closest('footer') ? 'footer' : 'body';
      analytics.contactClick(url.searchParams.get('interest'), placement);
    }
    document.addEventListener('click', click);
    return () => document.removeEventListener('click', click);
  }, []);
  return null;
}

function BackToTop() {
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 1);
    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, [location.key]);

  if (!visible) return null;
  return <a href="#main" className="back-top" aria-label="Back to top" onClick={e => {e.preventDefault(); window.scrollTo({top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'}); document.getElementById('main')?.focus({ preventScroll: true });}}><ArrowDown size={18} /></a>;
}

function App() {
  return <BrowserRouter><RouteEffects /><ContactClickTracking /><Header /><main id="main" tabIndex={-1}><Routes><Route path="/" element={<Home />} /><Route path="/about" element={<About />} /><Route path="/music" element={<OurMusic />} /><Route path="/events" element={<MusicRedirect />} /><Route path="/videos" element={<MusicRedirect listening />} /><Route path="/contact" element={<Contact />} /><Route path="/privacy" element={<Privacy />} /><Route path="/thank-you" element={<ThankYou />} /><Route path="*" element={<section className="container section"><h1>Let's get you back<br />to the music.</h1><Link className="button button-primary" to="/">Back home <ArrowRight size={18} /></Link></section>} /></Routes></main><Footer /><CookieConsent /><BackToTop /></BrowserRouter>;
}

// Keep links shared before clean page URLs were introduced working.
if (window.location.hash.startsWith('#/')) {
  window.history.replaceState(null, '', window.location.hash.slice(1));
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
