# The Fermata Initiative — website draft

A responsive React + TypeScript website, built with Vite, Lucide icons, Radix UI accessible dialogs, React Router, and locally hosted Outfit fonts.

## Run locally

Requires Node.js 22.12+ (or a newer supported LTS release).

```sh
npm install
npm run dev
```

Open http://localhost:5173. Use `localhost`, since that is the origin configured for the supplied Web3Forms key.

```sh
npm run build
npm run preview
```

The production build is in `dist/`. Routes use a hash so the site also works on ordinary static hosting without server rewrite rules. Do not open `index.html` directly from the filesystem; use the local server.

## Change the content

- `src/content.ts`: event names and dates, gallery images, sample YouTube IDs, social links, and the form key.
- `src/main.tsx`: page copy and layout. Includes Home, About, Past events, Watch & listen, Contact, and Privacy.
- `src/styles.css`: colours, spacing, typography, and responsive layouts.
- `public/images/`: optimised copies of the supplied photos and logo. Original source files are unchanged.

## What is provisional

- YouTube examples and their thumbnails are from the reference website supplied by the owner, and are visibly labelled sample performances. Replace them with Fermata recordings in `content.ts`.
- Instagram, YouTube, and Facebook currently link to the platform homepages. Replace their URLs with your profile URLs, change `placeholder` to `false`, and update the footer's “coming soon” copy.
- Event months and venue names are based on the provided folders. Exact dates are deliberately omitted: the Heritage Square folder and photo filenames suggest different days. Confirm before adding precise dates.
- The Westbury Estates folder contained no images. Its event uses a branded “photos coming soon” panel.
- The draft has a `noindex, nofollow` meta tag. Remove it once the content is approved and the site is ready for public launch.
- Privacy copy is a draft description of the implemented behaviour; finalise it before launch.

## Contact form

The supplied Web3Forms public access key is connected in `content.ts`. To override it, create `.env.local` with `VITE_WEB3FORMS_ACCESS_KEY=your-key`, then restart Vite. Web3Forms access keys are client-side form identifiers, not server-side secrets.

The form includes required-field and email validation, a hidden honeypot, a sending state, a success state, timeout handling, and errors that retain the entered message. No real test submission was sent during development.

For deployment on a real domain, update your Web3Forms allowed-domain configuration. Reference: [Web3Forms API](https://docs.web3forms.com/getting-started/api-reference).

## Video behaviour

Inspired by the supplied reference's `scripts/video-embed.js`: thumbnails become inline YouTube privacy-enhanced players on click, only one video plays at a time, modified clicks keep normal YouTube navigation, and changing pages unmounts the player. Players are loaded on request rather than in the background.

## Design

Warm cream `#FDFBF7`, Fermata blue `#376983`, sage `#607E61`, deep green `#49654B`, gold `#E0A62B`. The supplied logo is preserved. Layouts adapt for phones, tablets, and desktops; dialogs manage keyboard focus; reduced-motion preferences are respected.
