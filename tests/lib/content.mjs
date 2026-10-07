// Helpers shared by the source tests: list the docs pages of each locale and
// reduce an MDX page to the prose a reader sees (code, URLs, component props
// and imports removed), so copy guards never fire on data or identifiers.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('../..', import.meta.url));
export const DOCS = join(ROOT, 'src', 'content', 'docs');

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

/** Every page as { locale, slug, path, source }. pt-BR is the root locale. */
export function pages() {
  return walk(DOCS)
    .filter((p) => /\.mdx?$/.test(p))
    .map((path) => {
      const rel = relative(DOCS, path).split(sep).join('/');
      const isEn = rel.startsWith('en/');
      const slug = (isEn ? rel.slice(3) : rel).replace(/\.mdx?$/, '');
      return { locale: isEn ? 'en' : 'pt', slug, path, rel, source: readFileSync(path, 'utf8') };
    });
}

/** Frontmatter as a flat map of top-level `key: value` lines. */
export function frontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  const fields = {};
  if (!match) return fields;
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^([A-Za-z]+):\s*(.*)$/);
    if (kv) fields[kv[1]] = kv[2].replace(/^["']|["']$/g, '');
  }
  return fields;
}

/**
 * The text a reader sees, line by line (line numbers preserved for messages).
 * Removes fenced code, inline code, imports, self-closing components with their
 * props, HTML tags, link targets and bare URLs. A table cell that holds only
 * "—" (meaning "none") is a table convention, not prose, and is removed too.
 */
export function prose(source) {
  let text = source;
  // Fenced code blocks (also indented inside <TabItem>).
  text = text.replace(/^([ \t]*)(```|~~~)[\s\S]*?^\1\2[ \t]*$/gm, (m) => m.replace(/[^\n]/g, ''));
  // Self-closing JSX components and their (possibly multi-line) props.
  text = text.replace(/<[A-Z][A-Za-z]*\b[\s\S]*?\/>/g, (m) => m.replace(/[^\n]/g, ''));
  // Frontmatter keys that are not prose (links, icons, templates).
  text = text.replace(/^\s*(link|icon|variant|template|slug):.*$/gm, '');
  return text
    .split('\n')
    .map((line) =>
      line
        .replace(/^import .*$/, '')
        .replace(/`[^`]*`/g, ' ')
        .replace(/\]\([^)]*\)/g, ']')
        .replace(/<\/?[A-Za-z][^>]*>/g, ' ')
        .replace(/https?:\/\/\S+/g, ' ')
        .replace(/\|\s*—\s*(?=\|)/g, '| '),
    );
}

/** Lines of `prose()` matching `pattern`, as "rel:line: text" strings. */
export function findInProse(page, pattern) {
  const hits = [];
  prose(page.source).forEach((line, i) => {
    if (pattern.test(line)) hits.push(`${page.rel}:${i + 1}: ${line.trim()}`);
  });
  return hits;
}

/** Error codes listed in the page's error tables: rows "| 4xx | `code` | …". */
export function errorCodes(source) {
  const codes = new Set();
  for (const m of source.matchAll(/^\|\s*`?(\d{3})`?\s*\|\s*`([a-z][a-z0-9_]*)`/gm)) {
    codes.add(m[2]);
  }
  return codes;
}
