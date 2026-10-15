import { copyFile, mkdir } from 'node:fs/promises';

// GitHub Pages serves real files: give every React route its own entry page
// so direct visits, form redirects, and refreshing a page all work.
const routes = ['about', 'music', 'events', 'videos', 'contact', 'privacy', 'thank-you'];
await Promise.all(routes.map(async route => {
  await mkdir('dist/' + route, { recursive: true });
  await copyFile('dist/index.html', 'dist/' + route + '/index.html');
}));
await copyFile('dist/index.html', 'dist/404.html');
console.log('Created static entry pages for ' + routes.length + ' routes.');
