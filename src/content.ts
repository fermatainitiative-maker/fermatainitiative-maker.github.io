// Update the site's photos, videos, event information and social links here.
// Concerts are presented by venue rather than date.
export const site = {
  name: 'The Fermata Initiative',
  web3formsKey: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'f384099e-16d8-46c2-9572-84a102a29ada',
  socials: [
    { name: 'YouTube', url: 'https://www.youtube.com/@Fermata-initiative' },
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

// Recordings from the Fermata Initiative YouTube channel.
export const videos = [
  { id: '3oLMtCtvWl8', title: 'Fauré - Sicilienne', category: 'Clarinet & piano', image: '/images/heritage-duet.webp', featured: true },
  { id: 'oyGuQrlzU4Y', title: 'Gerhard Wuensch - Clarinet Dances', category: 'Clarinet & piano', image: '/images/video-wuensch.webp', featured: false },
  { id: 'yq_O0boWw-c', title: 'Chopin - Impromptu', category: 'Solo piano', image: '/images/video-chopin.webp', featured: true },
];
