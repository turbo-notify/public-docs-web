// The error index lists every public error code a page documents.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { errorCodes, pages } from '../lib/content.mjs';

const all = pages();

for (const locale of ['pt', 'en']) {
  test(`${locale}: the error index covers every code in the per-page error tables`, () => {
    const index = all.find((p) => p.locale === locale && p.slug === 'reference/errors');
    assert.ok(index, 'reference/errors exists');
    const listed = errorCodes(index.source);
    const missing = new Set();
    for (const page of all.filter((p) => p.locale === locale && p !== index)) {
      for (const code of errorCodes(page.source)) if (!listed.has(code)) missing.add(code);
    }
    for (const code of ['external_id_already_used', 'number_not_connected']) {
      if (!listed.has(code)) missing.add(code);
    }
    assert.deepEqual([...missing].sort(), []);
  });
}
