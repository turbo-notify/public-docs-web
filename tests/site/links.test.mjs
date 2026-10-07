// Every internal link and anchor in the built site resolves, in both locales.
// Run after `astro build` (npm run test:site does both).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, posix, relative, sep } from 'node:path';
import { ROOT } from '../lib/content.mjs';

const DIST = join(ROOT, 'dist');
const SITE = 'https://docs.turbonotify.com';

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

/** Map a site path to the file nginx would serve, or null. */
function resolveFile(pathname) {
  const clean = decodeURIComponent(pathname);
  const candidates = clean.endsWith('/')
    ? [join(DIST, clean, 'index.html')]
    : [join(DIST, clean), join(DIST, clean, 'index.html')];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile()) ?? null;
}

const idCache = new Map();
function idsOf(file) {
  if (!idCache.has(file)) {
    const html = readFileSync(file, 'utf8');
    idCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idCache.get(file);
}

test('the build exists for both locales', () => {
  assert.ok(existsSync(join(DIST, 'index.html')), 'run astro build first');
  assert.ok(existsSync(join(DIST, 'en', 'index.html')), 'English home is built');
});

test('every internal link and anchor resolves', () => {
  const broken = [];
  const htmlFiles = walk(DIST).filter((f) => f.endsWith('.html'));
  for (const file of htmlFiles) {
    const pagePath = '/' + relative(DIST, file).split(sep).join('/').replace(/index\.html$/, '');
    const html = readFileSync(file, 'utf8');
    for (const [, raw] of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
      const href = raw.replace(/&amp;/g, '&');
      if (/^(mailto:|tel:|javascript:)/.test(href)) continue;
      let url;
      try {
        url = new URL(href, SITE + pagePath);
      } catch {
        broken.push(`${pagePath}: unparsable ${href}`);
        continue;
      }
      if (url.origin !== SITE) continue;
      const target = resolveFile(posix.normalize(url.pathname));
      if (!target) {
        broken.push(`${pagePath}: ${href}`);
        continue;
      }
      const anchor = decodeURIComponent(url.hash.slice(1));
      if (anchor && target.endsWith('.html') && !idsOf(target).has(anchor)) {
        broken.push(`${pagePath}: ${href} (missing #${anchor})`);
      }
    }
  }
  assert.deepEqual(broken, []);
});
