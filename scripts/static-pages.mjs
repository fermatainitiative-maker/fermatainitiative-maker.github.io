import { readFile, writeFile, mkdir } from 'node:fs/promises';

// GitHub Pages serves real files: give every React route its own entry page
// with its own metadata, available before JavaScript runs.
const seo = JSON.parse(await readFile(new URL('../src/seo.json', import.meta.url), 'utf8'));
const template = await readFile('dist/index.html', 'utf8');
const metadataBlock = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/;
if (!metadataBlock.test(template)) throw new Error('Missing SEO metadata placeholder in the built HTML.');

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}
function renderPage(path) {
  const canonicalPath = seo.aliases[path] || path;
  const page = seo.pages[canonicalPath] || seo.notFound;
  const url = seo.pages[canonicalPath] ? new URL(canonicalPath === '/' ? '/' : canonicalPath + '/', seo.siteUrl).href : null;
  const tags = [
    `<title>${escapeHtml(page.title)}</title>`,
    `<meta name="description" content="${escapeHtml(page.description)}" />`,
    `<meta name="robots" content="${page.noindex ? 'noindex, follow' : 'index, follow'}" />`,
    `<meta property="og:site_name" content="${escapeHtml(seo.siteName)}" />`,
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
    '<meta property="og:type" content="website" />',
  ];
  if (url) tags.push(`<link rel="canonical" href="${escapeHtml(url)}" />`, `<meta property="og:url" content="${escapeHtml(url)}" />`);
  if (canonicalPath === '/') {
    const schema = { '@context': 'https://schema.org', '@type': 'WebSite', name: seo.siteName, url: seo.siteUrl };
    tags.push(`<script id="website-schema" type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`);
  }
  return template.replace(metadataBlock, () => `<!-- seo:start -->\n    ${tags.join('\n    ')}\n    <!-- seo:end -->`);
}

const routes = [...Object.keys(seo.pages), ...Object.keys(seo.aliases)];
await Promise.all(routes.map(async path => {
  const directory = path === '/' ? 'dist' : 'dist' + path;
  await mkdir(directory, { recursive: true });
  await writeFile(directory + '/index.html', renderPage(path));
}));
await writeFile('dist/404.html', renderPage('/404'));
console.log('Created static entry pages with metadata for ' + routes.length + ' routes.');
