// Update the site's photos, videos, event information and social links here.
// Concerts are presented by venue rather than date.
export const site = {
  name: 'The Fermata Initiative',
  web3formsKey: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'f384099e-16d8-46c2-9572-84a102a29ada',
  socials: [
    { name: 'Instagram', url: 'https://www.instagram.com/', placeholder: true },
    { name: 'YouTube', url: 'https://www.youtube.com/', placeholder: true },
    { name: 'Facebook', url: 'https://www.facebook.com/', placeholder: true },
  ],
};

// Give a venue any number of photos and/or YouTube recordings. Empty media
// keeps it in Where we've played without an unfinished album or placeholder.
export type ConcertMedia =
  | { type: 'photo'; src: string; alt: string; position?: string }
  | { type: 'video'; youtubeId: string; poster: string; title: string; position?: string };

export type Concert = {
  id: string;
  name: string;
  venue: string;
  location: string;
  description: string;
  media: ConcertMedia[];
};

export const events: Concert[] = [
  {
    id: 'heritage-square',
    name: 'Music at Heritage Square',
    venue: 'Heritage Square',
    location: 'Conception Bay South',
    description: 'Piano, clarinet, and a room brought together by music. A few moments from our visit to Heritage Square.',
    media: [
      { type: 'photo', src: '/images/heritage-duet.webp', alt: 'A pianist and clarinettist performing at Heritage Square' },
      { type: 'photo', src: '/images/concert-portrait.webp', alt: 'Residents listening to piano and clarinet at Heritage Square', position: '50% 65%' },
      { type: 'photo', src: '/images/concert-moment.webp', alt: 'Musicians and residents sharing a concert in the Heritage Square common room' },
    ],
  },
  {
    id: 'westbury-estates',
    name: 'An afternoon at Westbury Estates',
    venue: 'Westbury Estates',
    location: 'St. John’s',
    description: 'Another place to come together through live music.',
    media: [{ type: 'photo', src: '/images/westbury-piano.webp', alt: 'A pianist performing in the common room at Westbury Estates in St. John’s' }],
  },
];

// Temporary performance examples from the supplied reference website.
// These are explicitly labelled samples, not recordings of Fermata events.
export const videos = [
  { id: '7mefYOLnADI', title: 'Like Someone in Love', category: 'Jazz piano', image: '/images/video-jazz.webp' },
  { id: 'FEHCJHAtehQ', title: 'Rachmaninov, Concerto No. 3', category: 'Classical piano', image: '/images/video-classical.webp' },
  { id: 'oconJTVC3WI', title: 'The Gardens of Buitenzorg', category: 'Solo piano', image: '/images/video-solo.webp' },
];
