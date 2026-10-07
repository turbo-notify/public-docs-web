// Copy hygiene for every page in both locales: punctuation, vocabulary,
// currencies and billing rules a customer could optimize against.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findInProse, pages } from '../lib/content.mjs';

const all = pages();
const scan = (filter, pattern) => all.filter(filter).flatMap((p) => findInProse(p, pattern));
const any = () => true;

test('no em or en dash in prose (a lone "—" table cell is allowed)', () => {
  assert.deepEqual(scan(any, /[—–]/), []);
});

test('pt-BR prose does not mix English words that have a Portuguese term', () => {
  const english = /\b(handle|inbox|chars|default|trial|fan-out|quotas?)\b|sem enrolação/i;
  assert.deepEqual(scan((p) => p.locale === 'pt', english), []);
});

test('English prose says quota, never the Portuguese cota', () => {
  assert.deepEqual(scan((p) => p.locale === 'en', /\bcotas?\b/i), []);
});

test('no internal vocabulary reaches the customer', () => {
  const internal =
    /\b(device[- ]links?|tenants?|multi-tenant|workers?|NATS|JetStream|upstream|ADR|neonize|whatsmeow|stdio)\b|neste ambiente|this environment/i;
  assert.deepEqual(scan(any, internal), []);
});

test('only BRL and USD, and no price literal outside the pricing data', () => {
  assert.deepEqual(scan(any, /\bEUR\b|€|\beuros?\b/i), []);
  assert.deepEqual(scan(any, /(R\$|US\$|\$)\s?\d/), []);
});

test('refunds are described by outcome, never by threshold (D17)', () => {
  // No time window anywhere (the refund window is the obvious one to publish).
  assert.deepEqual(scan(any, /\b72\s*(h\b|horas|hours)/i), []);
  // No message count, cap or retry day next to refund or payment-retry wording.
  const refundLine = /reembols|estorn|refund|nova tentativa de cobrança|payment retr/i;
  const threshold = /\b\d+\s*(mensagens|messages|reembolsos|refunds|dias|days|horas|hours)\b|\bD\+\d/i;
  const hits = all.flatMap((p) =>
    findInProse(p, refundLine).filter((line) => threshold.test(line)),
  );
  assert.deepEqual(hits, []);
  const leaks = all.filter((p) => p.source.includes('messages_sent')).map((p) => p.rel);
  assert.deepEqual(leaks, [], 'the DELETE response has no messages_sent');
});
