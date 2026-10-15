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

export const events = [
  {
    id: 'westbury-estates',
    name: 'An afternoon at Westbury Estates',
    venue: 'Westbury Estates',
    location: 'St. John’s',
    image: null,
    description: 'Another place to come together through live music. Photos and a full look back at this visit are coming soon.',
    gallery: [],
  },
  {
    id: 'heritage-square',
    name: 'Music at Heritage Square',
    venue: 'Heritage Square',
    location: 'Conception Bay South',
    image: '/images/concert-wide.webp',
    description: 'Piano, clarinet, and a room brought together by music. A few moments from our visit to Heritage Square.',
    gallery: ['/images/concert-wide.webp', '/images/concert-portrait.webp', '/images/concert-moment.webp'],
  },
];

// Temporary performance examples from the supplied reference website.
// These are explicitly labelled samples, not recordings of Fermata events.
export const videos = [
  { id: '7mefYOLnADI', title: 'Like Someone in Love', category: 'Jazz piano', image: '/images/video-jazz.webp' },
  { id: 'FEHCJHAtehQ', title: 'Rachmaninov, Concerto No. 3', category: 'Classical piano', image: '/images/video-classical.webp' },
  { id: 'oconJTVC3WI', title: 'The Gardens of Buitenzorg', category: 'Solo piano', image: '/images/video-solo.webp' },
];
