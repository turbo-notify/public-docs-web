import { expect, test } from '@playwright/test';

// Key pages of each locale: the home, the three guides, the reference intro,
// the error index, support, and one dense reference page per section.
const SLUGS = [
  '',
  'guides/quickstart/',
  'guides/ai-agent/',
  'guides/resale/',
  'reference/api/',
  'reference/errors/',
  'help/support/',
  'help/changelog/',
  'numbers/add/',
  'numbers/list/',
  'messages/send/',
  'messages/webhook/',
  'general/mcp-server/',
  'usage/quota/',
];

for (const locale of ['', 'en/']) {
  for (const slug of SLUGS) {
    const path = `/${locale}${slug}`;
    test(`docs page ${path}`, async ({ page }, testInfo) => {
      const errors: string[] = [];
      page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
      page.on('pageerror', (err) => errors.push(err.message));

      await page.goto(path, { waitUntil: 'networkidle' });
      await expect(page.locator('h1').first()).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('lang', locale ? 'en' : 'pt-BR');

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, 'no horizontal page scroll').toBeLessThanOrEqual(0);
      expect(errors).toEqual([]);

      await page.screenshot({
        path: testInfo.outputPath(`${(locale + slug).replace(/\//g, '_') || 'home'}.png`),
        fullPage: false,
      });
    });
  }

  test(`interactive API reference /${locale}api-reference/`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto(`/${locale}api-reference/`, { waitUntil: 'networkidle' });
    await expect(page.getByText('Turbo Notify Public API').first()).toBeVisible();
    await expect(page.locator('.tn-back')).toBeVisible();
    // No developer toolbar, no agent chat, no MCP generator.
    await expect(page.getByText('Developer Tools')).toHaveCount(0);
    await expect(page.getByText(/Ask AI|Perguntar à IA/)).toHaveCount(0);
    await expect(page.getByText(/Generate MCP|Gerar MCP/)).toHaveCount(0);
    // Requests are tested in the page itself, never in Scalar's hosted client.
    await expect(page.locator('a[href*="client.scalar.com"]')).toHaveCount(0);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, 'no horizontal page scroll').toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`${locale ? 'en' : 'pt'}_api-reference.png`) });
  });
}
