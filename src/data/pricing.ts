/**
 * Prices quoted by the docs, one place only. Source: the Turbo Notify pricing
 * catalog (the same figures the landing and the dashboard read). When the
 * catalog changes, change these numbers; pages never write a price literal.
 *
 * Two currencies exist: BRL for Brazil and USD for every other country. A pt-BR
 * page shows BRL, an English page shows USD.
 */
export type Currency = 'BRL' | 'USD';

export type PriceItem = 'extraNumber' | 'businessPlan';

export const pricing: Record<PriceItem, Record<Currency, number>> = {
  /** Monthly price of one extra number (BUSINESS plan). */
  extraNumber: { BRL: 34.9, USD: 17.9 },
  /** Monthly base price of the BUSINESS plan. */
  businessPlan: { BRL: 69.9, USD: 24.9 },
};

export function formatPrice(amount: number, currency: Currency): string {
  const locale = currency === 'BRL' ? 'pt-BR' : 'en-US';
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}
