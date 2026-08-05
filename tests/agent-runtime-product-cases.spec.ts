import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4175';

const cases = [
  {
    slug: 'claude-code',
    lab: '[data-claude-code-boundary-lab]',
    sections: ['execution-contract', 'permission-sandbox', 'context-extensions', 'verification'],
    buttons: ['요청 구성', '행동 제안', '허용과 격리', '결과 관찰'],
    required: ['tool proposal', 'permission decision', 'dontAsk', '독립 판정한다'],
    forbidden: ['평균 21.2회', '최대 7개', '84%', '98%', 'Auto-Allow', 'YOLO'],
  },
  {
    slug: 'openclaw-assistant',
    lab: '[data-openclaw-message-lab]',
    sections: ['gateway-contract', 'identity-session', 'runtime-effect', 'delivery-evidence', 'durable-verification'],
    buttons: ['입구 승인', '경로·세션', '판단·효과', '응답 전달', '상태·검증'],
    required: ['OpenClaw-owned embedded runtime', 'per-channel-peer', 'delivery outcome', 'openclaw-agent.sqlite'],
    forbidden: ['Pi SDK 통합', 'ChannelRouter.handleMessage', '~/.openclaw/sessions/<sessionId>.jsonl'],
  },
] as const;

async function inspectLayout(
  page: import('@playwright/test').Page,
  labSelector: string,
) {
  return page.evaluate((selector) => {
    const viewportWidth = document.documentElement.clientWidth;
    const lab = document.querySelector<HTMLElement>(selector);
    const inspected = [
      ...document.querySelectorAll<HTMLElement>(
        '[data-learning-question], [data-concept-primer], section, [data-claude-code-boundary-lab], [data-openclaw-message-lab]',
      ),
    ];
    const offenders = inspected
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && (
          rect.left < -2
          || rect.right > viewportWidth + 2
          || element.scrollWidth - element.clientWidth > 2
        );
      })
      .map((element) => ({
        tag: element.tagName,
        marker: element.id || element.getAttribute('data-claude-code-boundary-lab') || element.getAttribute('data-openclaw-message-lab'),
        ownOverflow: element.scrollWidth - element.clientWidth,
      }));
    const undersizedControls = lab
      ? [...lab.querySelectorAll<HTMLElement>('button')].map((button) => {
        const rect = button.getBoundingClientRect();
        return { text: button.textContent?.trim(), width: rect.width, height: rect.height };
      }).filter((button) => button.width < 44 || button.height < 44)
      : [];
    return {
      documentOverflow: document.documentElement.scrollWidth - viewportWidth,
      labOverflow: lab ? lab.scrollWidth - lab.clientWidth : null,
      offenders,
      undersizedControls,
    };
  }, labSelector);
}

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  for (const article of cases) {
    test(`${article.slug} preserves source, narrative, and visual contracts at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(`${base}/lab/blog/ai/${article.slug}`, { waitUntil: 'networkidle' });

      await expect(page.locator('[data-learning-question]')).toBeVisible();
      await expect(page.locator('[data-concept-primer]')).toBeVisible();
      await expect(page.locator(article.lab)).toBeVisible();
      await expect(page.locator('.katex-error')).toHaveCount(0);

      for (const section of article.sections) {
        await expect(page.locator(`#${section}`)).toHaveCount(1);
      }
      for (const text of article.required) {
        await expect(page.locator('body')).toContainText(text);
      }
      for (const text of article.forbidden) {
        await expect(page.locator('body')).not.toContainText(text);
      }

      for (const label of article.buttons) {
        const button = page.locator(article.lab).getByRole('button', { name: label });
        await button.click();
        await expect(button).toHaveAttribute('aria-pressed', 'true');
      }

      const layout = await inspectLayout(page, article.lab);
      expect(layout.documentOverflow).toBeLessThanOrEqual(1);
      expect(layout.labOverflow).toBeLessThanOrEqual(1);
      expect(layout.offenders).toEqual([]);
      expect(layout.undersizedControls).toEqual([]);
    });
  }
}

test('Agent Runtime product path keeps common contract before product cases', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-agents-cases`, { waitUntil: 'networkidle' });

  const path = page.locator('[data-authored-learning-path="ai-agent-runtime-cases"]');
  await expect(path).toBeVisible();
  expect(await path.getByRole('link').evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual([
    '/lab/blog/ai/agent-frameworks',
    '/lab/blog/ai/claude-code',
    '/lab/blog/ai/openclaw-assistant',
  ]);
});
