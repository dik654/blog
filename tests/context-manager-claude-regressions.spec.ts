import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4179';

test('Seq2Seq renders the missing attention normalization and explains it before the handoff', async ({ page }) => {
  await page.goto(`${base}/lab/blog/ai/seq2seq`, { waitUntil: 'networkidle' });

  const bridge = page.getByText('점수에서 동적 context까지').locator('..');
  await expect(bridge.locator('.katex').first()).toContainText('softmax');
  await expect(page.locator('[data-formula-note]').filter({ hasText: '미분 가능한 읽기 비율' })).toBeVisible();

  const reversalExplanation = page.getByText(/Source reversal은 “영어를 거꾸로 읽는 것이 더 자연스럽다”/);
  const reversalControl = page.getByRole('group', { name: 'Source token order' });
  expect(await reversalExplanation.evaluate((node, control) => (
    Boolean(node.compareDocumentPosition(control as Node) & Node.DOCUMENT_POSITION_FOLLOWING)
  ), await reversalControl.elementHandle())).toBe(true);
});

test('Janus keeps the Stage III mask boundary and the full D-to-E ablation receipt', async ({ page }) => {
  await page.goto(`${base}/lab/blog/ai/paper-janus-2024`, { waitUntil: 'networkidle' });

  await expect(page.getByText(/Stage III의 understanding SFT는 system·user prompt를 loss에서 가리고/)).toBeVisible();
  await expect(page.getByText('MMBench 70.6 · generation 없음')).toBeVisible();
  await expect(page.getByText(/D와 E다.*1.2점 차이까지 사라진 것은 아니다/)).toBeVisible();
});

test('Interleaved context progress uses the disclosed fixture total and reaches 100 percent', async ({ page }) => {
  await page.goto(`${base}/lab/blog/ai/multimodal-fusion-interleaved-context`, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-interleaved-sequence-lab]');
  await lab.getByLabel('Interleaved sequence block count').fill('6');
  await expect(lab.locator('[data-interleaved-total]')).toHaveText('1048');
  await expect(lab.locator('[data-interleaved-fixture-caption]')).toContainText('이 예시 전체 1,048 token');

  await expect.poll(async () => lab.locator('[data-interleaved-fixture-track] > div').evaluate((bar) => {
    const track = bar.parentElement;
    return track ? bar.getBoundingClientRect().width / track.getBoundingClientRect().width : 0;
  })).toBeGreaterThan(0.99);
});

test('Mobile search and navigation controls stay inside the viewport with 44px targets', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-llm-serving`, { waitUntil: 'networkidle' });

  const menu = page.getByRole('button', { name: '메뉴 열기' });
  const search = page.getByRole('button', { name: '검색 열기' });
  for (const control of [menu, search]) {
    const box = await control.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }

  await search.click();
  const input = page.getByPlaceholder('아티클 제목이나 섹션으로 검색...');
  await expect(input).toBeVisible();
  const panel = input.locator('..').locator('..');
  const panelBox = await panel.boundingBox();
  expect(panelBox?.x).toBeGreaterThanOrEqual(0);
  expect((panelBox?.x ?? 0) + (panelBox?.width ?? 0)).toBeLessThanOrEqual(390);

  await search.click();
  await menu.click();
  const close = page.getByRole('button', { name: '닫기' });
  const closeBox = await close.boundingBox();
  expect(closeBox?.width).toBeGreaterThanOrEqual(44);
  expect(closeBox?.height).toBeGreaterThanOrEqual(44);
});

test('Codebook perplexity names the natural log and keeps the effective-code interpretation', async ({ page }) => {
  await page.goto(`${base}/lab/blog/ai/multimodal-visual-tokenization`, { waitUntil: 'networkidle' });
  const note = page.locator('[data-formula-note]').filter({ hasText: '선택 분포를 같은 정도로 고르게 쓰는 code 개수' });
  await expect(note).toContainText('자연로그');
  await expect(page.getByText(/네 code를 똑같이 25%씩 고르면 4다/)).toBeVisible();
  await expect(page.getByText(/Perplexity 하나만 높이는 것이 목표는 아니다/)).toBeVisible();
});
