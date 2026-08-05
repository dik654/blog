import { expect, test } from '@playwright/test';
import { getCategoryBySlug } from '../src/content';
import { getLearningPath } from '../src/content/learning-paths';
import type { Subcategory } from '../src/content/types';

const base = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4179';

function findSubcategory(items: Subcategory[], slug: string): Subcategory | undefined {
  for (const item of items) {
    if (item.slug === slug) return item;
    const nested = findSubcategory(item.children ?? [], slug);
    if (nested) return nested;
  }
  return undefined;
}

test('Agent sidebar assigns one canonical responsibility to each hub', () => {
  const ai = getCategoryBySlug('ai');
  expect(ai).not.toBeNull();

  const expected = [
    ['ai-agents', '에이전트 시스템 · 공통 계약', '특정 코드베이스 구현은 Claw Code'],
    ['ai-agents-ops', '에이전트 운영 · 증거와 기록', 'telemetry·recovery evidence'],
    ['ai-agents-claw', 'Claw Code · Agent Runtime 구현', '실제 Rust source로 검증'],
    ['ai-practical-llm', 'LLM 적응 · Adapter Release', 'Agent runtime은 에이전트 시스템'],
  ] as const;

  for (const [slug, name, description] of expected) {
    const subcategory = findSubcategory(ai!.subcategories, slug);
    expect(subcategory, slug).toBeDefined();
    expect(subcategory!.name).toBe(name);
    expect(subcategory!.description).toContain(description);
  }
});

test('Agent Ops has an evidence-to-recovery learning path', () => {
  expect(getLearningPath('ai-agent-ops-evidence')?.steps.map((step) => step.slug)).toEqual([
    'agent-evaluation-trace',
    'agent-devlog-patterns',
    'claw-telemetry',
    'claw-recovery',
  ]);
});

test('Agent Frameworks preserves combined guarantees and readable math on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/agent-frameworks?path=ai-agent-runtime-cases`, {
    waitUntil: 'networkidle',
  });

  await expect(page.locator('.katex-error')).toHaveCount(0);
  const formulaFit = await page.locator('[data-formula-pair] [data-math-fit]').evaluate((node) => ({
    clientWidth: node.clientWidth,
    scrollWidth: node.scrollWidth,
  }));
  expect(formulaFit.scrollWidth).toBeLessThanOrEqual(formulaFit.clientWidth + 1);

  await page.getByText('병렬 역할', { exact: true }).click();
  await expect(page.locator('[data-runtime-result]')).toContainText('Durable graph');
  await expect(page.locator('[data-runtime-supporting]')).toContainText('Coordination / crew runtime');
  await expect(page.locator('[data-runtime-ownership-lab]')).toContainText('외부 effect reconciliation');
  await expect(page.locator('[data-runtime-ownership-lab]')).toContainText('worker 권한 격리');

  await page.getByText('짧은 답변', { exact: true }).click();
  for (const label of ['재시작 후 재개', '사람 승인', '결정 재현', '병렬 역할']) {
    await page.getByText(label, { exact: true }).click();
  }
  await expect(page.locator('[data-runtime-result]')).toHaveText('직접 API + application loop');

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test('Tool runtime separates hidden, explicit ask, denied, and observed states on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/claw-tool-system`, { waitUntil: 'networkidle' });

  const lab = page.locator('[data-tool-runtime-lab]');
  await expect(lab).toHaveAttribute('data-tool-result', 'observed');

  await lab.getByLabel('호출 후보').selectOption('bash-write');
  await expect(lab).toHaveAttribute('data-tool-result', 'denied');
  await expect(lab).toContainText('executor에 들어가기 전에 닫혀야 한다');

  await lab.getByLabel('active permission mode').selectOption('prompt');
  await expect(lab).toHaveAttribute('data-tool-result', 'observed');
  await lab.getByText('ask rule 또는 hook Ask').click();
  await expect(lab).toHaveAttribute('data-tool-result', 'approval');
  await expect(lab).toContainText('명시적 ask가 사용자 결정을 기다림');

  await lab.getByText('이 도구를 model request의 definitions에 포함').click();
  await expect(lab).toHaveAttribute('data-tool-result', 'hidden');
  await expect(lab).toContainText('definition이 request에 없으므로');

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test('Tool runtime keeps definition origin and executor ownership separate', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/claw-tool-system`, { waitUntil: 'networkidle' });

  const article = page.locator('article');
  const lab = page.locator('[data-tool-runtime-lab]');
  await expect(article).toContainText('built-in, plugin, runtime discovery 세 출처');
  await expect(article).toContainText('runtime definition을 직접 dispatch하지 않는다');

  await lab.getByLabel('호출 후보').selectOption('runtime');
  await expect(lab).toHaveAttribute('data-tool-result', 'unwired');
  await expect(lab).toContainText('definition은 보이지만 executor가 없음');
  await expect(lab).toContainText('registry execute와 별도 배선');

  await lab.getByLabel('higher-level runtime executor 연결').check();
  await expect(lab).toHaveAttribute('data-tool-result', 'observed');
  await expect(lab).toContainText('higher-level runtime/MCP executor');
  await expect(lab).toContainText('remote protocol result');

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test('Agent type normalization and orchestration follow the implemented worker path', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/claw-subagent-orchestration`, { waitUntil: 'networkidle' });

  const selection = page.locator('[data-agent-selection-lab]');
  await selection.getByRole('button', { name: '별칭 입력' }).click();
  await expect(selection.locator('[data-selection-outcome]')).toContainText('explorer → Explore');
  await selection.getByRole('button', { name: '알 수 없는 타입' }).click();
  await expect(selection.locator('[data-selection-outcome]')).toContainText('기본 권한이 넓은 branch');

  const orchestration = page.locator('[data-orchestration-contract-lab]');
  await orchestration.getByRole('button', { name: 'Explore' }).click();
  await expect(orchestration).toContainText('edit_file');
  await expect(orchestration).toContainText('실행 전 차단');
  await orchestration.getByRole('button', { name: 'Custom type' }).click();
  await expect(orchestration).toContainText('edit_file: allowlist 포함');
  await expect(orchestration.locator('[data-manifest-immediate]')).toContainText('status: "running"');

  await orchestration.getByLabel('background outcome').selectOption('panic');
  await expect(orchestration.locator('[data-manifest-terminal]')).toContainText('status: failed');
  await expect(orchestration.locator('[data-manifest-terminal]')).toContainText('sub-agent thread panicked');

  await orchestration.getByLabel('background outcome').selectOption('spawn-error');
  await expect(orchestration.locator('[data-manifest-immediate]')).toContainText('failed to spawn sub-agent');
  await expect(orchestration.locator('[data-manifest-terminal]')).toContainText('status: failed');
  await expect(orchestration).toContainText('deadline, lease, late-result merge');

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test('Recovery boundary allows one scenario attempt then escalates before steps', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/claw-recovery`, { waitUntil: 'networkidle' });

  const recovery = page.locator('[data-recovery-boundary-lab]');
  const attempt = recovery.getByRole('button', { name: '복구 시도' });

  await recovery.getByLabel('failure scenario').selectOption('stale');
  await recovery.getByRole('button', { name: '모두 성공' }).click();
  await attempt.click();
  await expect(recovery.locator('[data-recovery-result]')).toContainText('Recovered { steps_taken: 2 }');
  await expect(recovery.locator('[data-recovery-events]')).toContainText('RecoverySucceeded');

  await attempt.click();
  await expect(recovery.locator('[data-recovery-result]')).toContainText('max recovery attempts (1) exceeded');
  await expect(recovery.locator('[data-recovery-result]')).not.toContainText('AlertHuman');
  await expect(recovery.locator('[data-recovery-events]')).toContainText('Escalated');
  await expect(recovery.locator('[data-recovery-attempt-count]')).toContainText('1 / 1');
  await expect(recovery.locator('[data-recovery-effect-owner]')).toContainText('AlertHuman');
  await expect(recovery.locator('[data-recovery-effect-owner]')).toContainText('이 함수는 사람 알림');

  await recovery.getByLabel('failure scenario').selectOption('plugin');
  await recovery.getByRole('button', { name: '뒤 step 실패' }).click();
  await attempt.click();
  await expect(recovery.locator('[data-recovery-result]')).toContainText('PartialRecovery');
  await expect(recovery.locator('[data-recovery-result]')).toContainText('RestartPlugin(stalled)');
  await expect(recovery.locator('[data-recovery-result]')).toContainText('RetryMcpHandshake(3000ms)');
  await expect(recovery.locator('[data-recovery-events]')).toContainText('RecoveryFailed');
  await expect(recovery).toContainText('다른 producer 필요');

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test('Telemetry lab exposes synchronous sink records and per-event JSONL flush', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/claw-telemetry`, { waitUntil: 'networkidle' });

  const telemetry = page.locator('[data-telemetry-pipeline-lab]');
  await telemetry.getByRole('button', { name: 'HTTP started' }).click();
  await telemetry.getByRole('button', { name: 'JSONL' }).click();
  await telemetry.getByRole('button', { name: 'record' }).click();
  await expect(telemetry.locator('[data-telemetry-action]')).toContainText('2회 동기 record · 각 event를 writeln + flush');
  await expect(telemetry).toContainText('호출 시도 · 2');
  await expect(telemetry).toContainText('2개 JSONL line 확인');
  await expect(telemetry).toContainText('SessionTrace(http_request_started)');
  await expect(telemetry.locator('[data-telemetry-records]')).toContainText('sequence 없음');
  await expect(telemetry.locator('[data-telemetry-records]')).toContainText('seq 0');
  await expect(telemetry.locator('[data-telemetry-next-sequence]')).toHaveText('1');

  await telemetry.getByRole('button', { name: 'Direct trace' }).click();
  await telemetry.getByRole('button', { name: 'record' }).click();
  await expect(telemetry.locator('[data-telemetry-records]')).toContainText('SessionTrace(turn_started)');
  await expect(telemetry.locator('[data-telemetry-records]')).toContainText('seq 1');
  await expect(telemetry.locator('[data-telemetry-next-sequence]')).toHaveText('2');

  await telemetry.getByRole('button', { name: 'telemetry 실험 초기화' }).click();
  await telemetry.getByRole('button', { name: 'HTTP started' }).click();
  await telemetry.getByLabel('JSONL I/O outcome').selectOption('write-fail');
  await telemetry.getByRole('button', { name: 'record' }).click();
  await expect(telemetry.locator('[data-telemetry-action]')).toContainText('writeln 오류 무시');
  await expect(telemetry.locator('[data-telemetry-durability]')).toContainText('0개로 간주');

  await telemetry.getByRole('checkbox').uncheck();
  await telemetry.getByRole('button', { name: 'telemetry 실험 초기화' }).click();
  await telemetry.getByRole('button', { name: 'record' }).click();
  await expect(telemetry.locator('[data-telemetry-action]')).toContainText('session_tracer가 None');
  await expect(telemetry.locator('[data-telemetry-records]')).not.toContainText('HttpRequestStarted');
  await expect(telemetry.getByRole('button', { name: 'telemetry 실험 초기화' })).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test('Session maps persisted evidence back to the six harness owners', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/claw-session`, { waitUntil: 'networkidle' });

  const ownerMap = page.locator('[data-session-owner-map]');
  await expect(ownerMap).toContainText('Approval / commit');
  await expect(ownerMap).toContainText('저장 필드 없음');
  await expect(ownerMap).toContainText('External effect');
  await expect(page.getByRole('heading', { name: 'Fork와 checkpoint를 구분한다' })).toBeVisible();
  await expect(page.getByText('이미지, PDF, permission log는 이 타입에 없다.')).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test('XML overview separates visual structure from authority and schema guarantees', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai/xml-prompting`, { waitUntil: 'networkidle' });

  await expect(page.locator('[data-xml-boundary]')).toContainText('지시 우선순위, 보안, 스키마 유효성이 자동으로 생기지는 않는다');
  await expect(page.getByText('XML은 경계를 표시할 뿐 권한 경계가 아니다', { exact: false })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'XML을 선택할 때' })).toBeVisible();
  await expect(page.getByText('JSON Schema나 구조화 출력 기능과 파서 오류 처리', { exact: false })).toBeVisible();
  await expect(page.getByRole('heading', { name: '태그 이름보다 역할을 먼저 정한다' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '파싱 성공과 정답 성공을 따로 판정한다' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'XML이면 XML parser를 쓴다' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '비용은 tokenizer로 직접 잰다' })).toBeVisible();
  await expect(page.getByText('regex나 관대한 parser로 몰래 성공 처리하는 fallback', { exact: false })).toBeVisible();
  await expect(page.getByText('고정된 오버헤드 비율을 가정하지 말고', { exact: false })).toBeVisible();
  await expect(page.getByText('Anthropic 추천', { exact: false })).toHaveCount(0);
  await expect(page.getByText('10-20%', { exact: false })).toHaveCount(0);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

const handoffs = [
  {
    source: 'mcp-protocol',
    targets: ['claw-mcp'],
  },
  {
    source: 'llm-harness',
    targets: ['claw-overview'],
  },
  {
    source: 'prompt-injection-defense',
    targets: ['claw-permissions', 'claw-bash'],
  },
] as const;

for (const handoff of handoffs) {
  test(`${handoff.source} links its common contract to concrete Claw implementation`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/lab/blog/ai/${handoff.source}`, { waitUntil: 'networkidle' });
    for (const target of handoff.targets) {
      await expect(
        page.getByRole('article').locator(`a[href^="/lab/blog/ai/${target}"]`).first(),
      ).toBeVisible();
    }
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
}
