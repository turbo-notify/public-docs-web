#!/usr/bin/env node
// Builds the Insomnia collection customers download from the docs site.
//
// Usage: npm run export:collection -- <path to insomnia/public_api.yaml>
//        (defaults to ../insomnia/public_api.yaml, the sibling repository)
//
// The source collection is the team's working copy: it carries local and
// staging environments and sample values from the team's own tests. The
// download keeps every request and folder as is and changes only the
// environments: one "Production" environment pointing at the public API,
// an empty `apiKey` for the reader to fill in, and placeholder sample values.
// The script is deterministic: rerunning it on the same input produces the
// same file, so the committed download only changes when the collection does.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, stringify } from 'yaml';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const source = resolve(process.argv[2] ?? resolve(ROOT, '..', 'insomnia', 'public_api.yaml'));
const target = resolve(ROOT, 'public', 'downloads', 'turbo-notify-insomnia.yaml');

/** Sample values a reader replaces with their own; never real people's data. */
const PLACEHOLDERS = {
  messageId: '',
  requestId: '',
  operationId: '',
  reactionEventId: '',
  numberAlias: 'main',
  extraNumberAlias: 'cliente_ana',
  recipientPhone: '+5511988887777',
  contactId: 'ct_00000000000000000000000000000000',
  exampleGroupId: 'grp_00000000000000000000000000000000',
  organizationId: 'org_00000000000000000000000000000000',
};

const doc = parse(readFileSync(source, 'utf8'));
if (!doc?.collection || !doc?.environments) {
  throw new Error(`${source} is not an Insomnia v5 collection`);
}

const base = doc.environments;
const production = (base.subEnvironments ?? []).find((env) => env.name === 'Production');
if (!production) throw new Error('the source collection has no Production environment');

const unknownKeys = Object.keys(base.data ?? {}).filter((key) => !(key in PLACEHOLDERS));
if (unknownKeys.length > 0) {
  throw new Error(
    `new base environment values need a placeholder in this script: ${unknownKeys.join(', ')}`,
  );
}

base.data = Object.fromEntries(Object.keys(base.data ?? {}).map((key) => [key, PLACEHOLDERS[key]]));
base.subEnvironments = [
  { ...production, data: { baseUrl: 'https://api.turbonotify.com', apiKey: '' } },
];
delete doc.cookieJar;

const output = stringify(doc, { lineWidth: 0 });
if (/tn_(live|test)_[A-Za-z0-9]/.test(output)) {
  throw new Error('the collection contains something that looks like a real API key');
}
writeFileSync(target, output);
console.log(`wrote ${target}`);
