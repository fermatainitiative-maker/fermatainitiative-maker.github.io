import seo from './seo.json';

type PageMetadata = { title: string; description: string; noindex?: boolean };
const pages: Record<string, PageMetadata> = seo.pages;
const aliases: Record<string, string> = seo.aliases;

function setMeta(key: string, value: string, attribute: 'name' | 'property' = 'name') {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.append(element);
  }
  element.content = value;
}

// Keep client navigation in sync with the metadata in each static entry page.
export function updatePageMetadata(pathname: string) {
  const path = pathname.replace(/\/+$/, '') || '/';
  const canonicalPath = aliases[path] || path;
  const page = pages[canonicalPath] || seo.notFound;
  const url = pages[canonicalPath] ? new URL(canonicalPath === '/' ? '/' : canonicalPath + '/', seo.siteUrl).href : null;
  document.title = page.title;
  setMeta('description', page.description);
  setMeta('robots', page.noindex ? 'noindex, follow' : 'index, follow');
  setMeta('og:site_name', seo.siteName, 'property');
  setMeta('og:title', page.title, 'property');
  setMeta('og:description', page.description, 'property');
  setMeta('og:type', 'website', 'property');

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (url) {
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.append(canonical);
    }
    canonical.href = url;
    setMeta('og:url', url, 'property');
  } else {
    canonical?.remove();
    document.head.querySelector('meta[property="og:url"]')?.remove();
  }

  let structuredData = document.head.querySelector<HTMLScriptElement>('#website-schema');
  if (canonicalPath === '/') {
    if (!structuredData) {
      structuredData = document.createElement('script');
      structuredData.id = 'website-schema';
      structuredData.type = 'application/ld+json';
      document.head.append(structuredData);
    }
    structuredData.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', name: seo.siteName, url: seo.siteUrl });
  } else structuredData?.remove();
}
