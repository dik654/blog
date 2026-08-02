import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';

const pages = [
  '/lab/blog/ai/clip-vision-language-model',
  '/lab/blog/ai/image-rag-defect-retrieval',
];

const imageRagTerms = [
  'split',
  'precision@K',
  'mean reciprocal rank',
  '판정자 만족도',
  'false neighbor',
  'K는',
  'IDCG@K',
  '왜 norm',
  '단위 vector',
  '방향이 같을수록',
];

const clipTerms = ['Precision@K', 'mean reciprocal rank', '판정자 만족도', 'false neighbor', 'L2 normalization', 'cosine similarity', 'region grounding'];

for (const path of pages) {
  for (const viewport of [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    test(`${path} ${viewport.name} exposes formula notes without material overflow`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });

      await page.setViewportSize(viewport);
      await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });

      const bodyText = await page.locator('body').innerText();
      const requiredTerms = path.includes('clip-vision-language-model') ? clipTerms : imageRagTerms;
      for (const term of requiredTerms) {
        expect(bodyText).toContain(term);
      }
      expect(bodyText).toContain('이 식은');

      if (path.includes('clip-vision-language-model')) {
        const similarityNote = await page
          .locator('[data-formula-note]')
          .filter({ hasText: '방향 일치를 score로 만든다' })
          .first();
        await expect(similarityNote).toContainText('Vector 길이를 제거');
        await expect(similarityNote).toContainText('학습되는 logit scale');
        await expect(page.locator('[data-clip-alignment-lab]')).toBeVisible();
        await expect(page.locator('[data-clip-retrieval-lab]')).toBeVisible();
      }

      if (path.includes('image-rag-defect-retrieval')) {
        const evidenceLab = page.locator('[data-defect-evidence-lab]');
        const policyLab = page.locator('[data-retrieval-policy-lab]');
        await expect(evidenceLab).toBeVisible();
        await expect(policyLab).toBeVisible();

        await evidenceLab.getByRole('tab', { name: /01 입력/ }).focus();
        await page.keyboard.press('End');
        await expect(evidenceLab.getByRole('tab', { name: /05 근거/ })).toHaveAttribute('aria-selected', 'true');
        await expect(evidenceLab).toContainText('근거 확정');
        await expect(evidenceLab).toContainText('근거 채택');

        await expect(policyLab).toContainText('0.33');
        await policyLab.getByRole('button', { name: '결함 ROI' }).click();
        await policyLab.getByRole('button', { name: '공정 맥락 확인' }).click();
        await expect(policyLab).toContainText('1.00');
        await expect(policyLab).toContainText('False neighbor');
        await expect(policyLab.locator('dd').filter({ hasText: /^0$/ })).toBeVisible();
      }

      const formulaPairing = await page.evaluate(() => {
        return Array.from(document.querySelectorAll<HTMLElement>('.katex-display'))
          .map((el) => {
            const container = el.closest<HTMLElement>('[data-math-fit]');
            const pair = container?.closest<HTMLElement>('[data-formula-pair]');
            const next = (pair?.querySelector<HTMLElement>('[data-formula-note]')
              ?? container?.nextElementSibling) as HTMLElement | null;
            return {
              text: el.textContent?.replace(/\s+/g, ' ').trim().slice(0, 80),
              hasFormulaNote: next?.hasAttribute('data-formula-note') ?? false,
              noteText: next?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 120) ?? '',
            };
          })
          .filter((item) => !item.hasFormulaNote || !item.noteText.includes('이 식은'));
      });

      expect(formulaPairing).toEqual([]);

      const overflow = await page.evaluate(() => {
        const allowedTags = new Set([
          'HTML',
          'BODY',
          'PRE',
          'CODE',
          'TABLE',
          'THEAD',
          'TBODY',
          'TR',
          'SVG',
          'MATH',
          'SEMANTICS',
          'MROW',
          'MI',
          'MO',
          'MN',
          'MTEXT',
          'MSUB',
          'MSUP',
          'MSUBSUP',
          'MFRAC',
          'MUNDER',
          'MOVER',
          'MUNDEROVER',
        ]);
        return Array.from(document.querySelectorAll<HTMLElement>('body *'))
          .map((el) => {
            const style = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            const dx = el.scrollWidth - el.clientWidth;
            const dy = el.scrollHeight - el.clientHeight;
            const allowsScroll = /(auto|scroll)/.test(style.overflowX) || /(auto|scroll)/.test(style.overflowY);
            const tinyOrHidden = rect.width < 4 || rect.height < 4 || style.visibility === 'hidden' || style.display === 'none';
            const isKatex = el.closest('[role="math"]') || el.closest('.katex') || el.closest('.katex-display');
            const material = !isKatex && !allowedTags.has(el.tagName) && !allowsScroll && !tinyOrHidden && (dx > 2 || dy > 2);
            return material
              ? {
                  tag: el.tagName,
                  text: (el.textContent ?? '').trim().slice(0, 100),
                  className: el.className.toString(),
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
