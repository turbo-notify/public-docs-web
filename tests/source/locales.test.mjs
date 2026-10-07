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
