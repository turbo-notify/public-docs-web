// pt-BR (root) and English must stay in lockstep: same pages, same sidebar.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DOCS, ROOT, frontmatter, pages } from '../lib/content.mjs';

const all = pages();
const slugs = (locale) => new Set(all.filter((p) => p.locale === locale).map((p) => p.slug));
const config = readFileSync(join(ROOT, 'astro.config.mjs'), 'utf8');

test('every pt-BR page has an English page and vice versa', () => {
  const pt = slugs('pt');
  const en = slugs('en');
  assert.deepEqual([...pt].filter((s) => !en.has(s)), [], 'pt pages missing in en');
  assert.deepEqual([...en].filter((s) => !pt.has(s)), [], 'en pages missing in pt');
});

test('only the pt-BR root and English locales exist', () => {
  assert.match(config, /root:\s*{\s*label:\s*'Português',\s*lang:\s*'pt-BR'\s*}/);
  assert.match(config, /en:\s*{\s*label:\s*'English',\s*lang:\s*'en'\s*}/);
  assert.doesNotMatch(config, /\bes\b\s*:/, 'no Spanish locale or es translation');
  assert.ok(!existsSync(join(DOCS, 'es')), 'no es content tree');
});

test('every sidebar entry has an English label and points to a page in both locales', () => {
  const entries = [...config.matchAll(/page\('([^']+)',\s*'([^']+)',\s*'([^']+)'\)/g)];
  assert.ok(entries.length > 40, 'sidebar entries found');
  const pt = slugs('pt');
  const en = slugs('en');
  for (const [, slug] of entries) {
    assert.ok(pt.has(slug), `sidebar slug ${slug} has a pt page`);
    assert.ok(en.has(slug), `sidebar slug ${slug} has an en page`);
  }
  for (const [, pt] of config.matchAll(/group\('([^']+)',\s*'[^']+',/g)) assert.ok(pt);
  const listed = new Set(entries.map(([, slug]) => slug));
  const unlisted = [...pt].filter((s) => s !== 'index' && !listed.has(s));
  assert.deepEqual(unlisted, [], 'every page is reachable from the sidebar');
});

test('the first sidebar group is the guides, starting with the quickstart', () => {
  const first = config.match(/sidebar:\s*\[\s*group\('([^']+)',\s*'([^']+)',\s*\[\s*page\('([^']+)'/);
  assert.ok(first);
  assert.deepEqual(first.slice(1, 4), ['Guias', 'Guides', 'guides/quickstart']);
});

test('the quickstart title matches its sidebar label in both locales', () => {
  const [, pt, en] = config.match(/page\('guides\/quickstart',\s*'([^']+)',\s*'([^']+)'\)/) ?? [];
  const page = (locale) => all.find((p) => p.locale === locale && p.slug === 'guides/quickstart');
  assert.equal(frontmatter(page('pt').source).title, pt);
  assert.equal(frontmatter(page('en').source).title, en);
});

test('every page has a title and a meta description', () => {
  for (const page of all) {
    const fm = frontmatter(page.source);
    assert.ok(fm.title, `${page.rel} has a title`);
    assert.ok(fm.description && fm.description.length >= 40, `${page.rel} has a description`);
  }
});

test('internal links stay inside the page locale', () => {
  const offenders = [];
  const shared = /^\/(openapi\.json|downloads\/|favicon)/;
  for (const page of all) {
    for (const m of page.source.matchAll(/\]\((\/[^)\s]*)\)|link:\s*(\/\S*)|href="(\/[^"]*)"/g)) {
      const href = m[1] ?? m[2] ?? m[3];
      if (shared.test(href)) continue;
      const isEn = href === '/en/' || href.startsWith('/en/');
      if (page.locale === 'en' && !isEn) offenders.push(`${page.rel}: ${href}`);
      if (page.locale === 'pt' && isEn) offenders.push(`${page.rel}: ${href}`);
    }
  }
  assert.deepEqual(offenders, []);
});

test('every moved page redirects to a page that exists, in both locales', async () => {
  const { MOVED_PAGES, movedPageRedirects } = await import('../../src/data/moved-pages.mjs');
  const pt = slugs('pt');
  const en = slugs('en');
  for (const [from, to] of Object.entries(MOVED_PAGES)) {
    assert.ok(!pt.has(from) && !en.has(from), `${from} no longer exists as a page`);
    assert.ok(pt.has(to) && en.has(to), `${to} exists in both locales`);
  }
  const redirects = movedPageRedirects();
  assert.equal(Object.keys(redirects).length, Object.keys(MOVED_PAGES).length * 2);
  assert.match(config, /redirects:\s*movedPageRedirects\(\)/, 'astro.config.mjs applies the redirects');
});

test('links to the Turbo Notify website open it in the page language', () => {
  const wrong = [];
  for (const page of all) {
    const prefix = page.locale === 'en' ? '/en' : '/pt';
    // Link targets only (Markdown links and href attributes), not sample payloads.
    const links = /(?:\]\(|href=")(https:\/\/turbonotify\.com(\/[^\s"'`)<>]*)?)/g;
    for (const [, url, path] of page.source.matchAll(links)) {
      if (!path || !(path === prefix || path.startsWith(`${prefix}/`))) wrong.push(`${page.rel}: ${url}`);
    }
  }
  assert.deepEqual(wrong, [], 'website links carry the locale of the page (/pt or /en)');
});

test('links to the dashboard sign-in and sign-up open it in the page language', () => {
  const wrong = [];
  for (const page of all) {
    const locale = page.locale === 'en' ? 'en' : 'pt-BR';
    const links = /https:\/\/dashboard\.turbonotify\.com\/auth\/[^\s"'`)<>]*/g;
    for (const [url] of page.source.matchAll(links)) {
      if (!new URL(url).searchParams.has('locale', locale)) wrong.push(`${page.rel}: ${url}`);
    }
  }
  assert.deepEqual(wrong, [], `dashboard auth links carry ?locale= of the page (pt-BR or en)`);
});
