import { expect, test, type Page } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';
test.setTimeout(90_000);

test('Speech and Audio track exposes Moshi as the internal canonical source', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-speech-audio`, { waitUntil: 'networkidle' });

  const route = page.locator('[data-topdown-research-route="speech-audio"]');
  const canonical = route.locator('[data-route-stage="evidence"] article').last();
  await expect(canonical.getByRole('link', { name: /내부 해설 읽기/ })).toHaveAttribute(
    'href',
    '/lab/blog/ai/paper-moshi-2024?track=speech-audio',
  );
});

for (const viewport of [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`Moshi source reconstruction stays readable and interactive at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/paper-moshi-2024`, { waitUntil: 'networkidle' });

    await expect(page.locator('[data-moshi-duplex-lab]')).toBeVisible();
    await expect(page.locator('[data-moshi-hierarchy-lab]')).toBeVisible();
    await expect(page.locator('[data-moshi-delay-lab]')).toBeVisible();
    await expect(page.locator('[data-moshi-evidence-lab]')).toBeVisible();
    await expect(page.locator('[data-formula-label]').filter({ hasText: 'practical 200 ms' })).toBeVisible();

    await page.locator('[data-moshi-duplex-lab]').getByRole('tab', { name: '중간 끼어들기', exact: true }).click();
    await expect(page.locator('[data-moshi-duplex-lab]')).toContainText('queued된 playback');

    await page.locator('[data-moshi-hierarchy-lab]').getByRole('tab', { name: 'Flat K×S', exact: true }).click();
    await page.locator('[data-moshi-hierarchy-lab]').getByRole('button', { name: 'q8', exact: true }).click();
    await expect(page.locator('[data-moshi-hierarchy-lab]')).toContainText('큰 시간축 sequence');

    await page.locator('[data-moshi-delay-lab]').getByRole('tab', { name: '대각 640ms', exact: true }).click();
    await expect(page.locator('[data-moshi-delay-lab]')).toContainText('640 ms');
    await expect(page.locator('[data-moshi-delay-lab]')).toContainText('microphone-to-playback p95가 아니다');
    await expect(page.locator('#inner-monologue-delay')).toContainText('평균 230 ms 응답 간격');
    await page.locator('[data-moshi-delay-lab]').getByRole('tab', { name: '동시 80ms', exact: true }).click();
    await expect(page.locator('[data-moshi-delay-lab]')).toContainText('Table 5의 zero-delay 비교 조건');
    await expect(page.locator('[data-moshi-delay-lab]')).not.toContainText('Table 6의 zero-delay 비교 조건');
    await expect(page.locator('#source-evidence')).toContainText('Table 6은 같은 delay pattern·matched setting');

    await page.locator('[data-moshi-evidence-lab]').getByRole('tab', { name: 'RQ-Transformer', exact: true }).click();
    await expect(page.locator('[data-moshi-evidence-lab]')).toContainText('135.4 PPL');
    await expect(page.locator('[data-moshi-evidence-lab]')).toContainText('36.8 PPL');
    await page.locator('[data-moshi-evidence-lab]').getByRole('tab', { name: '대화 동역학', exact: true }).click();
    await expect(page.locator('[data-moshi-evidence-lab]')).toContainText('Overlap 4.1s');
    await expect(page.locator('[data-moshi-evidence-lab]')).toContainText('barge-in 성공률');
    await page.locator('[data-moshi-evidence-lab]').getByRole('tab', { name: '파생 ASR·TTS', exact: true }).click();
    await expect(page.locator('[data-moshi-evidence-lab]')).toContainText('state of the art 경쟁');

    await assertSourceContracts(
      page,
      '[data-moshi-duplex-lab], [data-moshi-hierarchy-lab], [data-moshi-delay-lab], [data-moshi-evidence-lab]',
    );
  });
}

async function assertSourceContracts(page: Page, labSelector: string) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(100);

  const audit = await page.evaluate((selector) => {
    const formulaHosts = Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'));
    const visibleFormulaOverflows = formulaHosts.filter((host) => {
      const visibleMath = host.querySelector<HTMLElement>('.katex-html');
      if (!visibleMath) return true;
      const hostRect = host.getBoundingClientRect();
      const mathRect = visibleMath.getBoundingClientRect();
      return mathRect.left < hostRect.left - 1 || mathRect.right > hostRect.right + 1;
    }).length;
    const labs = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const labText = labs.flatMap((lab) => Array.from(lab.querySelectorAll<HTMLElement>(
      'p, span, strong, button, label',
    )));
    const proseBeforeLabs = labs.every((lab) => {
      const section = lab.closest('section');
      const prose = section?.querySelector('.prose p');
      return !!prose && Boolean(prose.compareDocumentPosition(lab) & Node.DOCUMENT_POSITION_FOLLOWING);
    });

    return {
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      visibleFormulaOverflows,
      minFormulaScale: formulaHosts.length
        ? Math.min(...formulaHosts.map((host) => Number(host.dataset.mathScale ?? '1')))
        : 1,
      minFormulaFont: formulaHosts.length
        ? Math.min(...formulaHosts.map((host) => Number.parseFloat(
          getComputedStyle(host.querySelector('.katex') as Element).fontSize,
        )))
        : 12,
      smallestLabText: labText.length
        ? Math.min(...labText.map((node) => Number.parseFloat(getComputedStyle(node).fontSize)))
        : 12,
      proseBeforeLabs,
      rawLatex: /\\(?:theta|underbrace|operatorname|begin\{aligned\}|mathcal)/.test(document.body.innerText),
      katexErrors: document.querySelectorAll('.katex-error').length,
    };
  }, labSelector);

  expect(audit.documentOverflow).toBeLessThanOrEqual(1);
  expect(audit.visibleFormulaOverflows).toBe(0);
  expect(audit.minFormulaScale).toBeGreaterThanOrEqual(0.7);
  expect(audit.minFormulaFont).toBeGreaterThanOrEqual(12);
  expect(audit.smallestLabText).toBeGreaterThanOrEqual(12);
  expect(audit.proseBeforeLabs).toBe(true);
  expect(audit.rawLatex).toBe(false);
  expect(audit.katexErrors).toBe(0);
}
