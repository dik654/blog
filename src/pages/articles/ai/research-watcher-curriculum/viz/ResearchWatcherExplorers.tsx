import { useState } from 'react';
import {
  Archive,
  ArrowDown,
  BookOpenCheck,
  Check,
  CircleDot,
  Code2,
  FilePenLine,
  GitCompareArrows,
  History,
  RotateCcw,
  ShieldAlert,
  X,
} from 'lucide-react';

const lineageEvents = [
  {
    id: 'paper-v1',
    short: '논문 v1',
    title: '처음 발견된 preprint',
    icon: FilePenLine,
    work: 'Work W-1042',
    version: 'arXiv:2607.01234v1',
    relation: '새 Work의 첫 WorkVersion',
    evidence: 'Claim C-17 · ablation = 61%',
    impact: '아직 이 값을 인용하는 공개 글은 없음',
    action: '현재 글과 contract를 비교하는 review packet 생성',
    tone: 'blue',
  },
  {
    id: 'paper-v2',
    short: '논문 v2',
    title: '구성요소 제거 실험(ablation)이 수정된 새 버전',
    icon: GitCompareArrows,
    work: 'Work W-1042 · 같은 연구',
    version: 'arXiv:2607.01234v2',
    relation: 'wasRevisionOf · v1',
    evidence: 'Claim C-17 · 61% → 54%',
    impact: 'v1의 수치를 인용한 claim만 stale 후보가 됨',
    action: '공개 인용은 아직 없으므로 차단 없이 C-17을 재검토하고 v1도 보존',
    tone: 'amber',
  },
  {
    id: 'company-post',
    short: '회사 글',
    title: '같은 연구를 설명한 공식 블로그',
    icon: BookOpenCheck,
    work: 'Work W-1042 · 같은 연구',
    version: 'SourceEvent S-88 · company post',
    relation: 'hadPrimarySource · paper v2',
    evidence: '직관·데모를 보충하지만 실험은 같은 원천',
    impact: '독립 검증 source 수는 늘어나지 않음',
    action: '쉬운 설명의 근거로 연결하되 교차 검증으로 세지 않음',
    tone: 'emerald',
  },
  {
    id: 'repo-release',
    short: '코드 릴리스',
    title: 'runtime interface가 바뀐 구현',
    icon: Code2,
    work: 'Artifact A-31 · W-1042 구현',
    version: 'GitHub release 2.0.0 · commit 91f…',
    relation: 'implements · Work W-1042 · 자체 정의 관계',
    evidence: 'batch API → streaming state API',
    impact: '논문 주장은 같아도 구현 계약은 달라짐',
    action: 'runtime 축의 delta를 평가하고 구현 단계를 갱신',
    tone: 'violet',
  },
  {
    id: 'correction',
    short: '정정 알림',
    title: '공개 글의 수치를 무효화하는 정정',
    icon: ShieldAlert,
    work: 'Correction E-9 · W-1042 대상',
    version: 'arXiv v3 withdrawal comment + 저자 errata 확인',
    relation: 'Claim C-23 wasInvalidatedBy · Correction E-9',
    evidence: 'Claim C-23 · 1.8× latency 주장을 철회',
    impact: 'C-23 → 문단 P-4 → 공개된 아티클 A-7만 영향',
    action: 'A-7 공개를 차단하고 P-4만 재작성·재검증',
    tone: 'rose',
  },
] as const;

const toneStyles = {
  blue: 'border-blue-600/35 bg-blue-500/[0.07] text-blue-800 dark:text-blue-200',
  amber: 'border-amber-600/40 bg-amber-500/[0.09] text-amber-900 dark:text-amber-100',
  emerald: 'border-emerald-600/35 bg-emerald-500/[0.07] text-emerald-800 dark:text-emerald-200',
  violet: 'border-violet-600/35 bg-violet-500/[0.07] text-violet-800 dark:text-violet-200',
  rose: 'border-rose-600/40 bg-rose-500/[0.08] text-rose-800 dark:text-rose-200',
} as const;

export function SourceLineageExplorer() {
  const [activeId, setActiveId] = useState<(typeof lineageEvents)[number]['id']>('paper-v2');
  const active = lineageEvents.find((event) => event.id === activeId) ?? lineageEvents[0];
  const ActiveIcon = active.icon;

  return (
    <figure data-source-lineage className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">SOURCE LINEAGE</p>
        <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">URL 다섯 개를 연구 다섯 개로 세지 않는다</h3>
        <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted-foreground">이벤트를 눌러 같은 연구의 버전, 설명 글, 구현과 정정이 서로 어떤 관계인지 확인한다.</p>
      </figcaption>

      <div className="grid grid-cols-2 gap-px border-b border-border bg-border sm:grid-cols-5">
        {lineageEvents.map((event, index) => {
          const Icon = event.icon;
          const selected = event.id === active.id;
          return (
            <button
              key={event.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setActiveId(event.id)}
              className={`min-h-20 min-w-0 bg-background px-3 py-3 text-left transition-colors ${index === lineageEvents.length - 1 ? 'col-span-2 sm:col-span-1' : ''} ${selected ? 'shadow-[inset_0_-3px_0_0_currentColor]' : 'hover:bg-muted/35'}`}
            >
              <span className="flex items-center gap-2"><Icon className="h-4 w-4 shrink-0" aria-hidden="true" /><strong className="break-keep text-xs">{event.short}</strong></span>
              <span className="mt-2 block text-[10px] leading-snug text-muted-foreground">{event.version}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 sm:p-5">
        <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] lg:items-stretch">
          <div className="min-w-0 border-l-2 border-foreground/30 pl-4">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground"><Archive className="h-3.5 w-3.5" aria-hidden="true" />안정된 identity</div>
            <p className="mt-3 text-sm font-bold">{active.work}</p>
            <p className="mt-1 break-words font-mono text-[11px] leading-relaxed text-muted-foreground">{active.version}</p>
            <p className="mt-3 text-xs leading-relaxed"><strong>관계</strong> · {active.relation}</p>
          </div>

          <div className="flex items-center justify-center lg:flex-col" aria-hidden="true">
            <ArrowDown className="h-4 w-4 text-muted-foreground lg:-rotate-90" />
          </div>

          <div className={`min-w-0 rounded-md border p-4 ${toneStyles[active.tone]}`} aria-live="polite">
            <div className="flex items-center gap-2"><ActiveIcon className="h-4 w-4 shrink-0" aria-hidden="true" /><p className="text-sm font-bold">{active.title}</p></div>
            <p className="mt-3 text-xs leading-relaxed"><strong>증거 역할</strong> · {active.evidence}</p>
            <p className="mt-2 text-xs leading-relaxed"><strong>영향 범위</strong> · {active.impact}</p>
          </div>
        </div>
      </div>

      <div className="flex min-w-0 gap-3 border-t border-border bg-muted/15 px-4 py-4 sm:px-5">
        <RotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <div className="min-w-0"><p className="text-[10px] font-bold uppercase text-muted-foreground">이 이벤트의 처리</p><p className="mt-1 text-sm font-semibold leading-relaxed">{active.action}</p></div>
      </div>
    </figure>
  );
}

const promotionScenarios = [
  {
    id: 'benchmark',
    short: '점수만 상승',
    title: '같은 구조를 더 크게 학습해 benchmark가 2.4점 올랐다',
    summary: '새 결과는 비교 근거지만 learner가 새 계산이나 구현 계약을 배울 이유는 없다.',
    axes: [
      ['계산', '동일 · parameter scale만 증가', false],
      ['데이터', '동일한 corpus family', false],
      ['목표', '동일한 training objective', false],
      ['runtime', '동일한 serving contract', false],
      ['검증', '같은 검증 계약 · benchmark 수치만 추가', false],
    ],
    gates: [false, false, false, false],
    outcome: 'Evidence only',
    outcomeKo: '현재 글의 비교 근거만 갱신',
    tone: 'amber',
  },
  {
    id: 'replace',
    short: '현재 교체',
    title: 'state를 외부로 노출하는 streaming runtime contract가 생겼다',
    summary: '현재 글의 구현 판단을 바꾸지만 기존 state·cache 기반으로 충분히 설명하고 재현할 수 있다.',
    axes: [
      ['계산', '같은 core operator', false],
      ['데이터', '동일', false],
      ['목표', '동일', false],
      ['runtime', 'batch → explicit streaming state', true],
      ['검증', 'latency·state recovery 추가', true],
    ],
    gates: [true, false, true, true],
    outcome: 'Replace current',
    outcomeKo: '현재 top과 구현 단계만 교체',
    tone: 'blue',
  },
  {
    id: 'foundation',
    short: '기반 추가',
    title: '기존 글로 판정할 수 없는 새로운 verification primitive가 생겼다',
    summary: '새 메커니즘을 계산·구현·실패 진단하려면 재사용 가능한 한 개의 기반 개념이 실제로 필요하다.',
    axes: [
      ['계산', 'verification operator 추가', true],
      ['데이터', 'proof trace schema 추가', true],
      ['목표', 'answer quality + proof validity', true],
      ['runtime', 'verifier call과 reject path', true],
      ['검증', '새 correctness contract', true],
    ],
    gates: [true, true, true, true],
    outcome: 'Foundation delta',
    outcomeKo: '현재 top 교체 + 최소 기반 1개 추가',
    tone: 'emerald',
  },
] as const;

const gateLabels = [
  '메커니즘이 실제로 달라졌는가?',
  '기존 기반만으로 설명할 수 없는가?',
  '계산·구현·진단에 꼭 필요한가?',
  '다른 글에서도 재사용되는가?',
] as const;

export function PromotionDecisionWorkbench() {
  const [activeId, setActiveId] = useState<(typeof promotionScenarios)[number]['id']>('replace');
  const active = promotionScenarios.find((scenario) => scenario.id === activeId) ?? promotionScenarios[0];

  return (
    <figure data-promotion-workbench className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">PROMOTION WORKBENCH</p>
        <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">최신이라는 이유가 아니라 학습 계약이 바뀔 때만 경로를 바꾼다</h3>
      </figcaption>

      <div className="grid grid-cols-3 gap-px border-b border-border bg-border">
        {promotionScenarios.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            aria-pressed={scenario.id === active.id}
            onClick={() => setActiveId(scenario.id)}
            className={`min-h-16 min-w-0 bg-background px-2 py-3 text-center text-[11px] font-bold leading-snug transition-colors sm:px-4 sm:text-xs ${scenario.id === active.id ? 'shadow-[inset_0_-3px_0_0_currentColor]' : 'text-muted-foreground hover:bg-muted/35'}`}
          >
            {scenario.short}
          </button>
        ))}
      </div>

      <div className="min-w-0 p-4 sm:p-5" aria-live="polite">
        <h4 className="text-sm font-bold leading-relaxed sm:text-base">{active.title}</h4>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{active.summary}</p>

        <div className="mt-5 grid min-w-0 gap-6 lg:grid-cols-2">
          <div className="min-w-0">
            <p className="mb-2 text-[10px] font-bold uppercase text-muted-foreground">다섯 contract delta</p>
            <div className="border-y border-border">
              {active.axes.map(([label, value, changed]) => (
                <div key={label} className="grid min-w-0 grid-cols-[4rem_minmax(0,1fr)_2.5rem] items-center gap-2 border-t border-border/70 py-2.5 first:border-t-0">
                  <strong className="text-xs">{label}</strong>
                  <span className="min-w-0 text-[11px] leading-relaxed text-muted-foreground">{value}</span>
                  <span className={`justify-self-end text-[10px] font-bold ${changed ? 'text-foreground' : 'text-muted-foreground'}`}>{changed ? '변경' : '동일'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <p className="mb-2 text-[10px] font-bold uppercase text-muted-foreground">기반을 늘리는 네 gate</p>
            <div className="border-y border-border">
              {gateLabels.map((label, index) => {
                const pass = active.gates[index];
                return (
                  <div key={label} className="flex min-w-0 items-start gap-3 border-t border-border/70 py-2.5 first:border-t-0">
                    <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm ${pass ? 'bg-foreground text-background' : 'border border-border text-muted-foreground'}`}>{pass ? <Check className="h-3 w-3" aria-hidden="true" /> : <X className="h-3 w-3" aria-hidden="true" />}</span>
                    <span className="text-[11px] font-medium leading-relaxed">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div data-promotion-outcome={active.id} className={`flex min-w-0 gap-3 border-t px-4 py-4 sm:px-5 ${toneStyles[active.tone]}`}>
        <CircleDot className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <div className="min-w-0"><p className="font-mono text-[10px] font-bold uppercase">{active.outcome}</p><p className="mt-1 text-sm font-bold leading-relaxed">{active.outcomeKo}</p></div>
      </div>

      <div className="flex gap-2 border-t border-border px-4 py-3 text-[10px] leading-relaxed text-muted-foreground sm:px-5">
        <History className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <p>교체된 이전 top은 삭제하지 않고 evidence history에 남긴다. 하지만 독자에게 새 필수 단계 하나로 다시 노출하지 않는다.</p>
      </div>
    </figure>
  );
}
