// Pages that moved to a new address. The old address keeps working in both
// locales (pt-BR at the root, English under /en/): readers arriving from an
// old bookmark, a search result or another site land on the page that
// replaced it. Keys and values are page slugs without slashes.
export const MOVED_PAGES = {
  // The quickstart replaced the getting-started page and absorbed next steps.
  'general/getting-started': 'guides/quickstart',
  'general/next-steps': 'guides/quickstart',
};

/** Astro `redirects` for every moved page, in both locales. */
export function movedPageRedirects() {
  return Object.fromEntries(
    Object.entries(MOVED_PAGES).flatMap(([from, to]) => [
      [`/${from}`, `/${to}/`],
      [`/en/${from}`, `/en/${to}/`],
    ]),
  );
}
