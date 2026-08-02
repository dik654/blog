import { expect, test } from '@playwright/test';
import { getLearningPath } from '../src/content/learning-paths';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4179';

test('ROS 2 runtime route stays focused on timing and execution contracts', () => {
  const path = getLearningPath('ai-robot-ros2-runtime');
  expect(path).toBeDefined();
  expect(path!.steps.map((step) => step.slug)).toEqual([
    'signals-systems-convolution',
    'robot-ai-top-down',
    'robot-ros2-runtime-communication',
    'paper-casini-ros2-response-time-2019',
  ]);
});

test('Robot AI overview has one explicit primary navigation owner', () => {
  const path = getLearningPath('ai-robot-system-overview');
  expect(path).toBeDefined();
  expect(path!.steps.map((step) => step.slug)).toEqual(['robot-ai-top-down']);
});

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  test(`Robot AI reconstructs one command into causal execution evidence on ${viewport.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/robot-ai-top-down`, { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { name: '명령 하나는 왜 곧바로 motor를 움직이지 못할까?' })).toBeVisible();

    const execution = page.locator('[data-robot-execution-lab]');
    await expect(execution).toHaveAttribute('data-stage', 'goal');
    await expect(execution).toHaveAttribute('data-chain-decision', 'execute');
    await execution.getByRole('switch', { name: /TF age 180 ms · 예제 limit 50 ms/ }).click();
    await expect(execution).toHaveAttribute('data-scenario', 'stale-tf');
    await expect(execution).toHaveAttribute('data-chain-decision', 're-estimate');
    await expect(execution).toHaveAttribute('data-invalidated-count', '6');
    await execution.getByRole('button', { name: /Trajectory/ }).click();
    await expect(execution).toHaveAttribute('data-stage', 'trajectory');
    await expect(execution.getByText('재계산 전까지 downstream 출력 금지')).toBeVisible();
    await expect(execution.getByText(/pose, path, trajectory는 같은 오염/)).toBeVisible();

    const feedback = page.locator('[data-feedback-disturbance-lab]');
    await feedback.getByRole('button', { name: '예상 밖 접촉' }).click();
    await expect(feedback).toHaveAttribute('data-scenario', 'contact');
    await expect(feedback).toHaveAttribute('data-decision', 'slow-stop');
    await expect(feedback.getByText('속도를 낮추고 멈춘 뒤 재계획')).toBeVisible();
    await feedback.getByRole('button', { name: 'Deadline 누락' }).click();
    await expect(feedback).toHaveAttribute('data-decision', 'hold');
    await expect(feedback.getByText('정의된 hold/stop 상태로 전환')).toBeVisible();
    await feedback.getByRole('button', { name: '복합 사고' }).click();
    await expect(feedback).toHaveAttribute('data-scenario', 'compound');
    await expect(feedback).toHaveAttribute('data-decision', 'hold');
    await expect(feedback.getByText('오염된 pose·path·trajectory 폐기')).toBeVisible();
    await expect(feedback.getByText('0.31 rad · TF age 180 ms > limit 50 ms')).toBeVisible();
    await expect(feedback.getByText('Drive / plant → State estimate')).toBeVisible();
    await expect(feedback.getByText('Embedded watchdog · safety supervisor · drive deadline에서 먼저 차단')).toBeVisible();
    await expect(feedback.getByText('1. watchdog · 2. contact guard · 3. TF age')).toBeVisible();
    await expect(feedback.getByText('설정된 safe state → 정지 확인 → state 추정·plan 재계산')).toBeVisible();

    const ros = page.locator('[data-ros-contract-lab]');
    await ros.getByRole('button', { name: /Navigation goal/ }).click();
    await expect(ros).toHaveAttribute('data-contract', 'action');
    await expect(ros.getByText('goal → feedback → result')).toBeVisible();
    await ros.getByRole('button', { name: /Frame transform/ }).click();
    await expect(ros).toHaveAttribute('data-contract', 'tf');
    await expect(ros.getByText(/과거 image를 잘못 투영/)).toBeVisible();

    const orchard = page.locator('[data-orchard-evidence-lab]');
    await orchard.getByRole('button', { name: '사람이 경로 진입' }).click();
    await expect(orchard).toHaveAttribute('data-decision', 'stop');
    await expect(orchard.getByText('centerline과 무관하게 정지').last()).toBeVisible();

    const release = page.locator('[data-simulator-release-strip]');
    await release.getByRole('button', { name: /Real rollout/ }).click();
    await expect(release).toHaveAttribute('data-stage', 'real');
    await expect(release.getByText(/intervention, near-miss/)).toBeVisible();

    const roadmap = page.locator('#foundation-descent');
    const chain = [
      'robot-kinematics-coordinate-frames',
      'robot-motion-planning',
      'robot-trajectory-generation',
      'robot-dynamics-feedback-control',
      'robot-ros2-runtime-communication',
      'robot-embedded-realtime-control',
      'robot-motor-drive-foc',
    ];

    for (const slug of chain) {
      await expect(roadmap.locator(`a[href="/lab/blog/ai/${slug}"]`)).toBeVisible();
    }

    const positions = await roadmap.locator(
      chain.map((slug) => `a[href="/lab/blog/ai/${slug}"]`).join(','),
    ).evaluateAll((links) => links.map((link) => link.getBoundingClientRect().top));
    expect(positions).toEqual([...positions].sort((a, b) => a - b));

    const formulaAudit = await page.locator('[data-math-fit]').evaluateAll((elements) => elements.map((element) => ({
      overflow: element.scrollWidth - element.clientWidth,
      scale: Number(element.getAttribute('data-math-scale') ?? '1'),
      fontSize: Number.parseFloat(getComputedStyle(element.querySelector('.katex') as Element).fontSize),
      rawLatex: /\\(?:underbrace|arg|min|widehat|mathcal)/.test((element as HTMLElement).innerText ?? ''),
    })));
    expect(formulaAudit.length).toBeGreaterThanOrEqual(5);
    for (const formula of formulaAudit) {
      expect(formula.overflow).toBeLessThanOrEqual(1);
      expect(formula.scale).toBeGreaterThanOrEqual(0.78);
      expect(formula.fontSize).toBeGreaterThanOrEqual(12);
      expect(formula.rawLatex).toBe(false);
    }

    const clippedControls = await page.locator(
      '[data-robot-execution-lab] button, [data-feedback-disturbance-lab] button, [data-ros-contract-lab] button, [data-orchard-evidence-lab] button, [data-simulator-release-strip] button',
    ).evaluateAll((buttons) => buttons
      .map((button) => {
        const rect = button.getBoundingClientRect();
        return {
          text: (button as HTMLElement).innerText,
          width: rect.width,
          height: rect.height,
          clippedX: button.scrollWidth - button.clientWidth,
          clippedY: button.scrollHeight - button.clientHeight,
        };
      })
      .filter((button) => button.width < 44 || button.height < 44 || button.clippedX > 1 || button.clippedY > 1));
    expect(clippedControls).toEqual([]);

    await expect(page.locator('article table')).toHaveCount(0);
    await expect(page.locator('article pre')).toHaveCount(0);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}
