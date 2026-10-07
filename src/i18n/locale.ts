/**
 * The two locales of the docs site: pt-BR at the root (default) and English
 * under `/en/`. Components derive the locale from the page URL so the same
 * component renders correctly in both trees.
 */
export type DocsLocale = 'pt' | 'en';

export function localeFromPath(pathname: string): DocsLocale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'pt';
}

/** Prefix for internal links of a locale: '' for pt-BR, '/en' for English. */
export function localePrefix(locale: DocsLocale): string {
  return locale === 'en' ? '/en' : '';
}

/** Strings rendered by the site's own components (never by page content). */
export const ui = {
  pt: {
    opensInNewTab: ' (abre em nova aba)',
    httpStatus: 'Status HTTP:',
    emptyBody: '<VAZIO>',
    website: 'Site',
    websiteLabel: 'Voltar ao site do Turbo Notify',
    landingUrl: 'https://turbonotify.com/pt',
    backToDocs: 'Documentação',
    apiReferenceTitle: 'Referência interativa da API',
  },
  en: {
    opensInNewTab: ' (opens in a new tab)',
    httpStatus: 'HTTP status:',
    emptyBody: '<EMPTY>',
    website: 'Website',
    websiteLabel: 'Back to the Turbo Notify website',
    landingUrl: 'https://turbonotify.com/en',
    backToDocs: 'Documentation',
    apiReferenceTitle: 'Interactive API reference',
  },
} as const satisfies Record<DocsLocale, Record<string, string>>;
