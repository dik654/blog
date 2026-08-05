import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';
const articles = [
  'arima',
  'deep-learning-overview',
  'perceptron',
  'neural-network',
  'activation-functions',
  'cross-entropy',
  'backprop-optimization',
  'optimizers',
  'foundation-training-step',
  'autoencoder',
  'fft',
  'tokenizer',
  'distributional-semantics',
  'word2vec',
  'rnn',
  'lstm',
  'seq2seq',
  'attention-theory',
  'transformer-architecture',
  'bert',
  'cnn',
  'resnet',
  'sentence-embeddings',
  'tabular-deep-learning',
  'ecod',
  'gan',
  'generative-theory',
  'vae',
  'diffusion-models',
  'wan22',
  'ltx-23',
] as const;

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  for (const slug of articles) {
    test(`${slug} keeps annotated formulas and visual stages readable on ${viewport.name}`, async ({ page }) => {
      const consoleErrors: string[] = [];
      const pageErrors: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });
      page.on('pageerror', (error) => pageErrors.push(error.message));

      await page.setViewportSize(viewport);
      await page.goto(`${base}/lab/blog/ai/${slug}`, { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('[data-math-fit]').first()).toBeVisible();
      await expect(page.locator('[data-formula-note]').first()).toBeVisible();

      const audit = await page.evaluate(() => {
        const formulas = Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'));
        const notes = Array.from(document.querySelectorAll<HTMLElement>('[data-formula-note]'));
        const stages = Array.from(document.querySelectorAll<HTMLElement>('[data-step-viz-stage]'));
        const slash = String.fromCharCode(92);

        return {
          documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          formulaOverflow: formulas.flatMap((formula) => {
            const rendered = formula.firstElementChild as HTMLElement | null;
            if (!rendered) return [];
            const amount = rendered.getBoundingClientRect().width - formula.clientWidth;
            return amount > 1 ? [{ amount, source: formula.dataset.mathSource?.slice(0, 100) }] : [];
          }),
          stageOverflow: stages.flatMap((stage) => (
            stage.scrollWidth - stage.clientWidth > 1
              ? [{ amount: stage.scrollWidth - stage.clientWidth }]
              : []
          )),
          minFormulaScale: Math.min(...formulas.map((formula) => Number(formula.dataset.mathScale ?? 1))),
          rawLatex: ['theta', 'tau', 'frac', 'sum', 'prod', 'dot', 'ddot', 'begin']
            .some((command) => document.body.innerText.includes(`${slash}${command}`)),
          nonKoreanNotes: notes
            .map((note) => note.textContent ?? '')
            .filter((text) => !/[가-힣]/.test(text)),
        };
      });

      expect(audit.documentOverflow).toBeLessThanOrEqual(1);
      expect(audit.formulaOverflow).toEqual([]);
      expect(audit.stageOverflow).toEqual([]);
      expect(audit.minFormulaScale).toBeGreaterThanOrEqual(0.8);
      expect(audit.rawLatex).toBe(false);
      expect(audit.nonKoreanNotes).toEqual([]);
      expect(consoleErrors).toEqual([]);
      expect(pageErrors).toEqual([]);
    });
  }
}
