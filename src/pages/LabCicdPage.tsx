import { ArrowRight, CheckCircle2, GitBranch, RotateCcw, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { labDocPath } from '@/content/lab-management';

type StageState = 'draft' | 'ready' | 'missing';

interface PipelineStage {
  title: string;
  state: StageState;
  goal: string;
  required: string[];
  output: string;
}

const stateMeta: Record<StageState, { label: string; className: string }> = {
  draft: { label: '설계 중', className: 'border-blue-500/30 bg-blue-500/5 text-blue-700' },
  ready: { label: '기준 확정', className: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-700' },
  missing: { label: '정의 필요', className: 'border-amber-500/30 bg-amber-500/5 text-amber-700' },
};

const pipelineStages: PipelineStage[] = [
  {
    title: '1. Change Intake',
    state: 'ready',
    goal: '변경이 들어왔을 때 실행할 가치가 있는 검증 범위를 먼저 정합니다.',
    required: ['변경 파일', '위험 영역', '사용자 영향', '수동 확인 필요 여부'],
    output: 'run plan: 어떤 gate를 실행할지 고른 기록',
  },
  {
    title: '2. Local Gate',
    state: 'ready',
    goal: 'PR/배포 전에 개발자 환경에서 빠르게 실패를 잡습니다.',
    required: ['format/lint', 'typecheck', 'unit test', 'AI quality gate'],
    output: 'local evidence: 명령, 성공/실패, 실패 로그',
  },
  {
    title: '3. CI Gate',
    state: 'ready',
    goal: '로컬과 독립된 환경에서 반복 가능한 build/test/check를 실행합니다.',
    required: ['clean install', 'lint/typecheck', 'unit/integration test', 'artifact 생성', 'cache key 고정'],
    output: 'CI run: commit SHA와 재현 가능한 결과',
  },
  {
    title: '4. Preview Artifact',
    state: 'ready',
    goal: '검토자가 실제 화면이나 산출물을 보고 승인할 수 있게 만듭니다.',
    required: ['preview URL', 'screenshot smoke', 'bundle/chunk report', 'route health'],
    output: 'preview evidence: URL, 스크린샷, 주요 라우트 확인',
  },
  {
    title: '5. Release Promotion',
    state: 'ready',
    goal: '어떤 조건에서 preview를 production으로 승격할지 명시합니다.',
    required: ['승인 조건', 'migration 여부', 'feature flag', 'release note'],
    output: 'promotion record: 누가 무엇을 근거로 올렸는지',
  },
  {
    title: '6. Smoke & Rollback',
    state: 'ready',
    goal: '배포 직후 확인과 실패 시 되돌리는 절차를 한 묶음으로 둡니다.',
    required: ['health check', '핵심 라우트 smoke', '로그 확인', 'rollback trigger'],
    output: 'release evidence: smoke 결과와 rollback 가능 상태',
  },
  {
    title: '7. Security Gate',
    state: 'ready',
    goal: 'dependency, secret, container, permission drift를 배포 판단 전에 차단합니다.',
    required: ['dependency audit', 'secret scan', 'SAST rule', 'container/package provenance'],
    output: 'security evidence: 취약점 등급, 예외 승인, provenance 기록',
  },
  {
    title: '8. Cost Gate',
    state: 'ready',
    goal: '빌드 시간, preview 유지 비용, 모델/API 호출 비용이 예산을 넘지 않는지 확인합니다.',
    required: ['job duration budget', 'cache hit rate', 'artifact size', 'external API/model call budget'],
    output: 'cost evidence: job별 시간/비용과 예산 초과 여부',
  },
  {
    title: '9. Compliance Gate',
    state: 'ready',
    goal: '라이선스, 데이터 보존, 접근 권한, 감사 로그가 배포 기준을 만족하는지 확인합니다.',
    required: ['license allowlist', 'PII/data retention check', 'access review', 'audit log retention'],
    output: 'compliance evidence: 정책별 통과/예외/승인 기록',
  },
  {
    title: '10. Rollback Automation',
    state: 'ready',
    goal: '사람이 절차를 기억하지 않아도 마지막 정상 산출물로 되돌릴 수 있게 자동화합니다.',
    required: ['previous release ref', 'database rollback plan', 'feature flag off-switch', 'post-rollback smoke'],
    output: 'rollback evidence: 자동 rollback run과 복구 후 smoke 결과',
  },
];

const gateMatrix = [
  ['change-intake', 'changed files + risk tags', 'run-plan.md', '위험 영역이 비어 있으면 실패'],
  ['local-fast', 'lint + typecheck + focused tests', 'local-gate.log', '로컬 재현 명령이 없으면 실패'],
  ['ci-repeatable', 'clean install + full build + test', 'CI run URL', 'lockfile/cache key가 흔들리면 실패'],
  ['preview', 'route health + screenshot smoke', 'preview URL + screenshots', '대표 화면 1개라도 깨지면 실패'],
  ['promotion', 'approval + migration/flag check', 'promotion record', '승인자/근거 누락이면 실패'],
  ['release-smoke', 'health + rollback drill', 'smoke log + rollback ref', 'rollback ref 없으면 실패'],
  ['security', 'dependency graph + source diff', 'audit/sast/secret scan report', 'critical/high 취약점 미승인이면 실패'],
  ['cost', 'workflow duration + artifact/API budget', 'cost-budget.json + run usage', '예산 초과 사유/승인 없으면 실패'],
  ['compliance', 'license/data/access policy', 'compliance-check.md', '라이선스/데이터 보존 정책 위반이면 실패'],
  ['rollback-auto', 'previous release + rollback command', 'rollback run URL + smoke log', '자동 rollback 검증 없으면 실패'],
];

const workflowSnippets = [
  {
    title: 'PR Gate',
    code: `name: pr-gate
on: [pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm test -- --runInBand`,
  },
  {
    title: 'Preview Smoke',
    code: `name: preview-smoke
on:
  workflow_run:
    workflows: [pr-gate]
    types: [completed]
jobs:
  smoke:
    if: github.event.workflow_run.conclusion == 'success'
    runs-on: ubuntu-latest
    steps:
      - run: curl -fsS "$PREVIEW_URL/health"
      - run: npx playwright test smoke.spec.ts
      - run: node scripts/check-bundle-budget.mjs`,
  },
  {
    title: 'Security Gate',
    code: `name: security-gate
on: [pull_request]
jobs:
  security:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write
    steps:
      - uses: actions/checkout@v4
      - run: npm audit --audit-level=high
      - run: gitleaks detect --redact
      - run: semgrep ci --config p/owasp-top-ten`,
  },
  {
    title: 'Cost & Compliance Gate',
    code: `name: cost-compliance-gate
on: [pull_request]
jobs:
  policy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: node scripts/check-ci-budget.mjs
      - run: node scripts/check-license-allowlist.mjs
      - run: node scripts/check-data-retention.mjs`,
  },
  {
    title: 'Rollback Automation',
    code: `name: rollback-automation
on:
  workflow_dispatch:
    inputs:
      release_ref:
        required: true
jobs:
  rollback:
    runs-on: ubuntu-latest
    steps:
      - run: ./scripts/rollback.sh "$RELEASE_REF"
      - run: curl -fsS "$PROD_URL/health"
      - run: npx playwright test smoke.spec.ts`,
  },
];

const policies = [
  {
    title: '프로젝트별 보드가 아닙니다.',
    body: 'CI/CD 화면은 개별 프로젝트 목록을 관리하지 않고, 모든 프로젝트에 적용할 파이프라인 구조와 승격 조건을 관리합니다.',
  },
  {
    title: '빠른 실패와 배포 판단을 분리합니다.',
    body: 'lint/typecheck/test는 빠른 실패용이고, preview/smoke/rollback은 배포 판단용입니다. 두 결과를 같은 의미로 취급하지 않습니다.',
  },
  {
    title: '증거가 없는 통과는 완료가 아닙니다.',
    body: '명령 결과, CI run, preview URL, screenshot, smoke 로그 중 하나 이상이 있어야 다음 단계로 넘깁니다.',
  },
];

const artifacts = [
  ['Run plan', '변경 파일과 위험 영역을 보고 실행할 gate를 선택한 기록'],
  ['Build artifact', 'production build 산출물, bundle report, 정적 파일 또는 이미지'],
  ['Preview evidence', '검토 가능한 URL과 대표 화면 screenshot'],
  ['Release evidence', '배포 후 health/smoke 결과와 rollback 가능 여부'],
  ['Security evidence', '취약점, secret, SAST, provenance 결과와 예외 승인 여부'],
  ['Cost evidence', 'workflow 시간, cache 효율, artifact 크기, API/model 호출 비용'],
  ['Compliance evidence', 'license allowlist, data retention, access review, audit log 결과'],
  ['Rollback evidence', '자동 rollback 실행 기록, 이전 release ref, 복구 후 smoke 결과'],
];

export default function LabCicdPage() {
  const readyCount = pipelineStages.filter((stage) => stage.state === 'ready').length;
  const draftCount = pipelineStages.filter((stage) => stage.state === 'draft').length;
  const missingCount = pipelineStages.filter((stage) => stage.state === 'missing').length;

  return (
    <div className="mx-auto max-w-7xl">
      <section className="mb-8 border-b pb-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs text-muted-foreground">Pipeline design</p>
            <h1 className="text-3xl font-bold tracking-tight">CI/CD 파이프라인 설계</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              프로젝트별 진행판이 아니라 변경 접수부터 rollback까지 어떤 검증과 증거를 남길지 설계하는 화면입니다.
            </p>
          </div>
          <div className="grid w-full grid-cols-3 gap-2 sm:w-auto sm:min-w-[360px]">
            {[
              ['확정', readyCount],
              ['설계', draftCount],
              ['필요', missingCount],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border px-3 py-2">
                <p className="text-xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to={labDocPath('delivery-system')} className="rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
            CI/CD 기준 문서
          </Link>
          <Link to="/lab/projects" className="rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
            프로젝트 보드
          </Link>
        </div>
      </section>

      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold uppercase text-muted-foreground">파이프라인 단계</h2>
          </div>
          <span className="text-xs text-muted-foreground">{pipelineStages.length}개 단계</span>
        </div>
        <div className="grid min-w-0 gap-3 xl:grid-cols-2">
          {pipelineStages.map((stage) => {
            const meta = stateMeta[stage.state];
            return (
              <article key={stage.title} className="min-w-0 rounded-lg border bg-card p-4">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">stage</p>
                    <h3 className="text-base font-semibold">{stage.title}</h3>
                  </div>
                  <span className={`shrink-0 rounded-md border px-2 py-1 text-xs font-medium ${meta.className}`}>
                    {meta.label}
                  </span>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{stage.goal}</p>
                <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_220px]">
                  <div className="rounded-md border bg-background p-3">
                    <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Required checks</p>
                    <div className="space-y-1.5">
                      {stage.required.map((item) => (
                        <div key={item} className="flex min-w-0 items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-md border bg-background p-3">
                    <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Output</p>
                    <p className="text-sm leading-relaxed">{stage.output}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mb-8 grid gap-3 lg:grid-cols-3">
        {policies.map((policy) => (
          <article key={policy.title} className="rounded-lg border bg-background p-4">
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">{policy.title}</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{policy.body}</p>
          </article>
        ))}
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <RotateCcw className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold uppercase text-muted-foreground">필수 산출물</h2>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {artifacts.map(([title, body]) => (
            <div key={title} className="flex min-w-0 items-start gap-3 rounded-lg border bg-card p-4">
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold uppercase text-muted-foreground">Gate Matrix</h2>
        </div>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Gate</th>
                <th className="px-3 py-2 font-medium">입력</th>
                <th className="px-3 py-2 font-medium">증거</th>
                <th className="px-3 py-2 font-medium">실패 기준</th>
              </tr>
            </thead>
            <tbody>
              {gateMatrix.map(([gate, input, evidence, failure]) => (
                <tr key={gate} className="border-t">
                  <td className="whitespace-nowrap px-3 py-3 font-mono text-xs">{gate}</td>
                  <td className="px-3 py-3 text-muted-foreground">{input}</td>
                  <td className="px-3 py-3 text-muted-foreground">{evidence}</td>
                  <td className="px-3 py-3 text-muted-foreground">{failure}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 grid gap-3 lg:grid-cols-2">
        {workflowSnippets.map((snippet) => (
          <article key={snippet.title} className="min-w-0 rounded-lg border bg-card p-4">
            <h3 className="mb-3 text-sm font-semibold">{snippet.title}</h3>
            <pre className="max-h-80 overflow-auto rounded-md bg-muted p-3 text-xs leading-relaxed">
              <code>{snippet.code}</code>
            </pre>
          </article>
        ))}
      </section>
    </div>
  );
}
