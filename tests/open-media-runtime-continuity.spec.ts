import { expect, test, type Page } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4181';

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    body: document.body.scrollWidth - document.body.clientWidth,
  }));
  expect(overflow.document).toBeLessThanOrEqual(1);
  expect(overflow.body).toBeLessThanOrEqual(1);
}

for (const viewport of [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'desktop-1440', width: 1440, height: 900 },
]) {
  test(`open media runtime handoff and trust contract at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);

    for (const target of [
      { slug: 'image-model-runtime', links: 3 },
      { slug: 'video-model-runtime', links: 3 },
      { slug: 'open-model-workflow-parameters', links: 4 },
      { slug: 'open-model-community-workflows', links: 3 },
    ]) {
      await page.goto(`${base}/lab/blog/ai/${target.slug}`, { waitUntil: 'domcontentloaded' });
      const handoff = page.locator('[data-learning-handoff]').last();
      await expect(handoff).toBeVisible();
      await expect(handoff.getByRole('link')).toHaveCount(target.links);
      await expectNoHorizontalOverflow(page);
    }

    await page.goto(`${base}/lab/blog/ai/image-model-runtime`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: '한 장 생성도 weight 크기만으로 VRAM을 예측할 수 없다' })).toBeVisible();
    await expect(page.locator('.katex-error')).toHaveCount(0);
    await expect(page.getByText(/24GB에서 실행 가능한지 판단하려면 checkpoint file 크기가 아니라/)).toBeVisible();

    await page.goto(`${base}/lab/blog/ai/open-model-community-workflows`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByText(/File hash는 받은 byte가 예상 artifact와 같다는 integrity만 확인/)).toBeVisible();
    await expect(page.getByText(/weights_only=True/)).toBeVisible();
    await expect(page.getByRole('link', { name: /PyTorch · torch.load/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Hugging Face · safetensors/ })).toBeVisible();
  });
}
