import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';

const pages = [
  {
    path: '/lab/blog/ai/contrastive-learning',
    terms: ['Hard negative', 'InfoNCE', 'Triplet', 'SimCLR', 'Defect Retrieval'],
  },
  {
    path: '/lab/blog/ai/domain-finetuning',
    terms: ['Domain shift', 'Continued pretraining', 'Task fine-tuning', 'Generic baseline', '중단 조건'],
  },
];

for (const pageSpec of pages) {
  for (const viewport of [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    test(`${pageSpec.path} ${viewport.name} keeps the learning path readable`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });

      await page.setViewportSize(viewport);
      await page.goto(`${base}${pageSpec.path}`, { waitUntil: 'networkidle' });

      const bodyText = await page.locator('body').innerText();
      for (const term of pageSpec.terms) expect(bodyText).toContain(term);

      if (pageSpec.path.includes('contrastive-learning')) {
        const unpairedFormula = await page.evaluate(() => (
          Array.from(document.querySelectorAll<HTMLElement>('.katex-display'))
            .filter((formula) => {
              const pair = formula.closest('[data-formula-pair]');
              return !pair?.querySelector('[data-formula-note]');
            })
            .map((formula) => formula.textContent?.replace(/\s+/g, ' ').trim().slice(0, 100))
        ));
        expect(unpairedFormula).toEqual([]);
      }

      if (pageSpec.path.includes('domain-finetuning')) {
        const lab = page.locator('[data-domain-adaptation-lab]');
        await expect(lab).toBeVisible();
        await lab.getByRole('tab', { name: /이웃 정의/ }).click();
        await expect(lab).toContainText('contrastive objective');
        await lab.getByRole('tab', { name: /최종 과업/ }).click();
        await expect(lab).toContainText('Head-only');
      }

      const overflow = await page.evaluate(() => {
        const allowedTags = new Set([
          'HTML', 'BODY', 'PRE', 'CODE', 'TABLE', 'THEAD', 'TBODY', 'TR', 'SVG',
          'MATH', 'SEMANTICS', 'MROW', 'MI', 'MO', 'MN', 'MTEXT', 'MSUB', 'MSUP',
          'MSUBSUP', 'MFRAC', 'MUNDER', 'MOVER', 'MUNDEROVER',
        ]);
        return Array.from(document.querySelectorAll<HTMLElement>('body *'))
          .map((element) => {
            const style = window.getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            const dx = element.scrollWidth - element.clientWidth;
            const dy = element.scrollHeight - element.clientHeight;
            const allowsScroll = /(auto|scroll)/.test(style.overflowX) || /(auto|scroll)/.test(style.overflowY);
            const tinyOrHidden = rect.width < 4 || rect.height < 4 || style.visibility === 'hidden' || style.display === 'none';
            const isKatex = element.closest('[role="math"]') || element.closest('.katex') || element.closest('.katex-display');
            const material = !isKatex && !allowedTags.has(element.tagName) && !allowsScroll && !tinyOrHidden && (dx > 2 || dy > 2);
            return material
              ? {
                  tag: element.tagName,
                  text: (element.textContent ?? '').trim().slice(0, 100),
                  className: element.className.toString(),
                  dx,
                  dy,
                }
              : null;
          })
          .filter(Boolean);
      });

      expect(overflow).toEqual([]);
      expect(consoleErrors).toEqual([]);
    });
  }
}
