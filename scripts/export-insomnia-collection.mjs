#!/usr/bin/env node
// Builds the Insomnia collection customers download from the docs site.
//
// Usage: pnpm export:collection <path to insomnia/public_api.yaml>
//        (defaults to ../insomnia/public_api.yaml, the sibling repository)
//
// The source collection is the team's working copy: it carries local and
// staging environments, sample values from the team's own tests, and the
// team's liveness probe. The download keeps every API request and folder as
// is, drops the probe (it is outside the public reference: `/health` is not in
// the OpenAPI document either), and changes the environments: one "Production"
// environment pointing at the public API, an empty `apiKey` for the reader to
// fill in, and placeholder sample values.
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
  externalId: 'cliente-4711',
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

/** Folders for the team only: requests outside the public API reference. */
const TEAM_ONLY_FOLDERS = new Set(['fld_health']);
const keptFolders = doc.collection.filter((item) => !TEAM_ONLY_FOLDERS.has(item?.meta?.id));
if (keptFolders.length !== doc.collection.length - TEAM_ONLY_FOLDERS.size) {
  throw new Error(`the source collection no longer has the folders ${[...TEAM_ONLY_FOLDERS]}`);
}
doc.collection = keptFolders;

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
