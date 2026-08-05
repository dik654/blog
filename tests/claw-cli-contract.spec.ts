import { expect, test } from '@playwright/test';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4189';
const path = `${base}/lab/blog/ai/claw-cli`;

test.describe('claw cli input contracts', () => {
  test('teaches source-backed launch, repl, render, and init boundaries', async ({ page }) => {
    await page.goto(path, { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { name: 'CLI에는 서로 다른 다섯 입력 경계가 있다' })).toBeVisible();
    await expect(page.locator('[data-cli-contract-lab]')).toBeVisible();
    await expect(page.getByText('clap', { exact: true })).toHaveCount(1);
    await expect(page.getByText('pulldown-cmark', { exact: true })).toBeVisible();
    await expect(page.getByText('base16-ocean.dark', { exact: true })).toBeVisible();
    await expect(page.locator('#slash-dispatch')).toContainText('persist_session()');
    await expect(page.locator('#slash-dispatch')).toContainText('ReadOutcome::Exit');
  });

  test('interactive scenarios preserve typed outcomes without mobile overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path, { waitUntil: 'networkidle' });

    const lab = page.locator('[data-cli-contract-lab]');

    await page.getByRole('button', { name: 'pipe prompt' }).click();
    await expect(lab.locator('[data-cli-result="pipe"]')).toContainText('CliAction::Prompt');

    await page.getByRole('button', { name: '/model opus' }).click();
    await expect(lab.locator('[data-cli-result="slash"]')).toContainText('SlashCommand::Model');

    await page.getByRole('button', { name: 'Ctrl-C' }).click();
    await expect(lab.locator('[data-cli-result="ctrl-c"]')).toContainText('Cancel');
    await expect(lab.locator('[data-cli-result="ctrl-c"]')).toContainText('Exit');

    await page.getByRole('button', { name: 'fresh init' }).click();
    await expect(lab.locator('[data-cli-result="init-fresh"]')).toContainText('dontAsk');
    await expect(lab.locator('[data-cli-result="init-fresh"]')).toContainText('DangerFullAccess');

    await page.getByRole('button', { name: 'init 재실행' }).click();
    await expect(lab.locator('[data-cli-result="init-again"]')).toContainText('Skipped');
    await expect(lab).toContainText('rollback하는 transaction은 아니다');

    const overflow = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      lab: (() => {
        const el = document.querySelector<HTMLElement>('[data-cli-contract-lab]');
        return el ? el.scrollWidth - el.clientWidth : -1;
      })(),
    }));
    expect(overflow.document).toBeLessThanOrEqual(0);
    expect(overflow.lab).toBeLessThanOrEqual(0);
  });
});
