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
  test(`RL and robot articles expose causal learning handoffs at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);

    for (const target of [
      {
        slug: 'rl-mdp-bellman',
        linkCount: 3,
        text: '알 수 없는 transition 평균을 실제 transition sample과 bootstrap target으로 학습한다.',
      },
      {
        slug: 'rl-pomdp-state-estimation',
        linkCount: 3,
        text: 'Learned latent state에 action-conditioned dynamics를 붙여 imagination과 planning에 사용하는 경계를 읽는다.',
      },
      {
        slug: 'rl-safe-constrained-learning',
        linkCount: 4,
        text: 'Offline safety critic의 support, OOD optimism과 off-policy evaluation 한계를 검산한다.',
      },
      {
        slug: 'robot-camera-geometry-calibration',
        linkCount: 3,
        text: 'Metric point·mask·depth를 persistent track, occupancy와 versioned PlanningScene으로 조립한다.',
      },
      {
        slug: 'robot-ros2-runtime-communication',
        linkCount: 4,
        text: 'Callback deadline을 MCU task, ISR·DMA, watchdog와 physical latch의 시간 계약으로 내린다.',
      },
    ]) {
      await page.goto(`${base}/lab/blog/ai/${target.slug}`, { waitUntil: 'domcontentloaded' });
      const handoff = page.locator('[data-learning-handoff]').last();
      await expect(handoff).toBeVisible();
      await expect(handoff.getByRole('link')).toHaveCount(target.linkCount);
      await expect(handoff).toContainText(target.text);
      await expectNoHorizontalOverflow(page);
    }

    await page.goto(`${base}/lab/blog/ai/rl-temporal-difference-dqn`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByText(/Bellman expectation backup에서 transition·reward 분포의 평균/)).toBeVisible();

    await page.goto(`${base}/lab/blog/ai/rl-pomdp-state-estimation`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('link', { name: 'MDP 글의 Markov 충분성 반례' })).toBeVisible();

    await page.goto(`${base}/lab/blog/ai/rl-safe-constrained-learning`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('link', { name: 'Offline RL의 dataset support·OPE·ESS 진단' })).toBeVisible();
  });

  test(`remaining AI paths expose causal learning handoffs at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);

    for (const target of [
      {
        slug: 'knowledge-source-ingestion',
        linkCount: 3,
        text: 'Block과 locator를 Claim·Scope·Evidence·Transformation graph로 바꾸고 수정 영향을 추적한다.',
      },
      {
        slug: 'knowledge-ir-evidence-lineage',
        linkCount: 3,
        text: '새 version과 correction event를 감지해 어떤 claim과 article을 stale로 닫을지 결정한다.',
      },
      {
        slug: 'knowledge-research-watcher',
        linkCount: 4,
        text: '발견한 PDF·HTML·video·repository를 재현 가능한 version과 locator로 고정한다.',
      },
      {
        slug: 'linear-algebra-decompositions',
        linkCount: 3,
        text: 'Jacobian singular value와 null space가 손끝 속도, 역기구학과 redundancy를 어떻게 제한하는지 검산한다.',
      },
      {
        slug: 'optimization-geometry',
        linkCount: 4,
        text: 'Expected return와 cost budget을 분리하고 Lagrangian update가 runtime safety를 대신하지 못하는 경계를 본다.',
      },
      {
        slug: 'generative-theory',
        linkCount: 3,
        text: 'Likelihood를 직접 계산하지 않고 real·generated sample 차이를 discriminator가 학습 신호로 만드는 adversarial game을 본다.',
      },
      {
        slug: 'vae',
        linkCount: 3,
        text: 'VAE의 한 번짜리 latent reconstruction과 noise level별 반복 denoising을 같은 평가 축에서 비교한다.',
      },
      {
        slug: 'quantization',
        linkCount: 3,
        text: '실제 mobile compiler·CPU/GPU/NPU partition과 thermal trace에서 선택한 dtype·packing이 end-to-end 이득을 내는지 검증한다.',
      },
      {
        slug: 'pruning',
        linkCount: 3,
        text: 'N:M·block·structural artifact가 target compiler와 kernel에서 wall-clock, memory와 energy 이득으로 실현되는지 확인한다.',
      },
      {
        slug: 'efficient-inference-on-device',
        linkCount: 4,
        text: '같은 byte movement와 SLO 문제를 server의 prefill/decode 분리, network transfer와 fleet scheduling 경계에서 비교한다.',
      },
      {
        slug: 'deformable-detr',
        linkCount: 3,
        text: 'Box만으로 부족해 pixel mask와 시간축 identity가 필요할 때 output contract를 확장한다.',
      },
    ]) {
      await page.goto(`${base}/lab/blog/ai/${target.slug}`, { waitUntil: 'domcontentloaded' });
      const handoff = page.locator('[data-learning-handoff]').last();
      await expect(handoff).toBeVisible();
      await expect(handoff.getByRole('link')).toHaveCount(target.linkCount);
      await expect(handoff).toContainText(target.text);
      await expectNoHorizontalOverflow(page);
    }
  });
}
