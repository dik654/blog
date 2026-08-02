import { useState } from 'react';
import {
  Ban,
  CheckCircle2,
  CircleDot,
  FlaskConical,
  Route,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { InternalLink } from '@/components/learning/ArticleLearning';

type PairedMode = 'scores' | 'paired' | 'cluster';
type SplitDesign = 'rows' | 'group' | 'future-group';
type SelectionEvidence = 'reused' | 'untouched';
type GuardrailEvidence = 'average' | 'checked';

const PAIRED_COUNTS = {
  bothCorrect: 1040,
  aOnly: 52,
  bOnly: 59,
  bothWrong: 49,
} as const;

const TOTAL = Object.values(PAIRED_COUNTS).reduce((sum, value) => sum + value, 0);
const A_CORRECT = PAIRED_COUNTS.bothCorrect + PAIRED_COUNTS.aOnly;
const B_CORRECT = PAIRED_COUNTS.bothCorrect + PAIRED_COUNTS.bOnly;
const DELTA = (B_CORRECT - A_CORRECT) / TOTAL;
const A_ACCURACY = A_CORRECT / TOTAL * 100;
const B_ACCURACY = B_CORRECT / TOTAL * 100;
const DELTA_PERCENTAGE_POINTS = DELTA * 100;

const PAIRED_MODE_COPY: Record<PairedMode, {
  label: string;
  eyebrow: string;
  title: string;
  explanation: string;
  boundary: string;
}> = {
  scores: {
    label: '전체 점수',
    eyebrow: 'POINT ESTIMATE',
    title: '먼저 같은 1,200행에서 두 점수를 계산한다',
    explanation: 'A는 1,092행, B는 1,099행을 맞혔다. 표본에서는 B가 7행 더 맞혔다.',
    boundary: '두 평균만으로는 어느 행에서 판단이 달랐는지, 1,200행이 독립인지 알 수 없다.',
  },
  paired: {
    label: 'Paired 차이',
    eyebrow: 'SAME CASES',
    title: '같이 맞고 같이 틀린 행은 차이에서 상쇄된다',
    explanation: 'B만 맞힌 59행에서 A만 맞힌 52행을 빼면 순이득은 7행, 즉 +0.583%p다.',
    boundary: '이 값은 표본 차이다. 우연한 변동과 사용자 내부 반복 의존성은 아직 계산하지 않았다.',
  },
  cluster: {
    label: '사용자 재표본',
    eyebrow: 'RESAMPLING UNIT',
    title: '불확실성은 80명의 사용자 묶음을 다시 뽑아 본다',
    explanation: '한 사용자의 여러 행을 함께 유지한 채 사용자 80개를 재표본하고 paired 차이를 다시 계산한다.',
    boundary: '사용자별 네 cell 배분이 없으므로 이 요약 숫자만으로 numeric confidence interval을 만들 수 없다.',
  },
};

function pairedCellTone(mode: PairedMode, cell: keyof typeof PAIRED_COUNTS) {
  if (mode === 'scores') {
    return cell === 'bothCorrect'
      ? 'border-sky-600/30 bg-sky-500/[0.07]'
      : 'border-border bg-background';
  }
  if (mode === 'paired') {
    if (cell === 'bOnly') return 'border-emerald-600/40 bg-emerald-500/[0.08]';
    if (cell === 'aOnly') return 'border-rose-600/40 bg-rose-500/[0.08]';
    return 'border-border bg-muted/15 text-muted-foreground';
  }
  return 'border-amber-600/30 bg-amber-500/[0.05]';
}

export function PairedDifferenceExplorer() {
  const [mode, setMode] = useState<PairedMode>('scores');
  const current = PAIRED_MODE_COPY[mode];

  return (
    <div
      className="foundation-viz-explorer not-prose my-8 scroll-mt-20 overflow-hidden rounded-md border border-border bg-background"
      data-paired-difference-lab
      data-paired-mode={mode}
      data-a-accuracy={A_ACCURACY.toFixed(3)}
      data-b-accuracy={B_ACCURACY.toFixed(3)}
      data-paired-delta-pp={DELTA_PERCENTAGE_POINTS.toFixed(3)}
    >
      <div className="grid gap-5 border-b border-border bg-muted/20 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-end">
        <div>
          <p className="text-xs font-bold text-muted-foreground">PAIRED OUTCOME LAB</p>
          <p className="mt-2 text-lg font-bold">같은 사례에서 달라진 판단만 추적한다</p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            숫자는 계산 순서를 설명하기 위한 고정 fixture다. 실제 모델의 성능이나 신뢰구간이 아니다.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-1 rounded-md border border-border bg-background p-1">
          {(Object.keys(PAIRED_MODE_COPY) as PairedMode[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={mode === key}
              onClick={() => setMode(key)}
              className={`min-h-11 rounded-sm px-2 text-xs font-bold transition-colors motion-reduce:transition-none ${
                mode === key
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {PAIRED_MODE_COPY[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-px bg-border md:grid-cols-[minmax(19rem,0.95fr)_minmax(0,1.05fr)]">
        <div className="min-w-0 bg-background p-4 sm:p-6" data-paired-matrix>
          <div className="grid grid-cols-[4.75rem_minmax(0,1fr)_minmax(0,1fr)] gap-1 text-center">
            <div aria-hidden="true" />
            <div className="flex min-h-11 items-center justify-center px-2 text-xs font-bold text-muted-foreground">
              B 정답
            </div>
            <div className="flex min-h-11 items-center justify-center px-2 text-xs font-bold text-muted-foreground">
              B 오답
            </div>

            <div className="flex min-h-20 items-center justify-center px-2 text-xs font-bold text-muted-foreground">
              A 정답
            </div>
            <div
              className={`flex min-h-20 min-w-0 flex-col items-center justify-center rounded-sm border px-2 transition-colors motion-reduce:transition-none ${pairedCellTone(mode, 'bothCorrect')}`}
              data-paired-cell="both-correct"
            >
              <span className="font-mono text-xl font-bold">{PAIRED_COUNTS.bothCorrect}</span>
              <span className="mt-1 text-[11px] font-semibold">둘 다 정답</span>
            </div>
            <div
              className={`flex min-h-20 min-w-0 flex-col items-center justify-center rounded-sm border px-2 transition-colors motion-reduce:transition-none ${pairedCellTone(mode, 'aOnly')}`}
              data-paired-cell="a-only"
            >
              <span className="font-mono text-xl font-bold">{PAIRED_COUNTS.aOnly}</span>
              <span className="mt-1 text-[11px] font-semibold">A만 정답</span>
            </div>

            <div className="flex min-h-20 items-center justify-center px-2 text-xs font-bold text-muted-foreground">
              A 오답
            </div>
            <div
              className={`flex min-h-20 min-w-0 flex-col items-center justify-center rounded-sm border px-2 transition-colors motion-reduce:transition-none ${pairedCellTone(mode, 'bOnly')}`}
              data-paired-cell="b-only"
            >
              <span className="font-mono text-xl font-bold">{PAIRED_COUNTS.bOnly}</span>
              <span className="mt-1 text-[11px] font-semibold">B만 정답</span>
            </div>
            <div
              className={`flex min-h-20 min-w-0 flex-col items-center justify-center rounded-sm border px-2 transition-colors motion-reduce:transition-none ${pairedCellTone(mode, 'bothWrong')}`}
              data-paired-cell="both-wrong"
            >
              <span className="font-mono text-xl font-bold">{PAIRED_COUNTS.bothWrong}</span>
              <span className="mt-1 text-[11px] font-semibold">둘 다 오답</span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 divide-x divide-border border-y border-border py-3">
            <div className="min-w-0 px-2 text-center">
              <p className="text-[11px] font-bold text-muted-foreground">A</p>
              <p className="mt-1 font-mono text-sm font-bold">{A_ACCURACY.toFixed(3)}%</p>
            </div>
            <div className="min-w-0 px-2 text-center">
              <p className="text-[11px] font-bold text-muted-foreground">B</p>
              <p className="mt-1 font-mono text-sm font-bold">{B_ACCURACY.toFixed(3)}%</p>
            </div>
            <div className="min-w-0 px-2 text-center">
              <p className="text-[11px] font-bold text-muted-foreground">B - A</p>
              <p className="mt-1 font-mono text-sm font-bold text-emerald-700 dark:text-emerald-300">
                +{DELTA_PERCENTAGE_POINTS.toFixed(3)}%p
              </p>
            </div>
          </div>
        </div>

        <div
          className="flex min-w-0 flex-col justify-between bg-background p-4 sm:p-6 md:min-h-[20rem]"
          data-paired-explanation
        >
          <div>
            <p className="text-xs font-bold text-muted-foreground">{current.eyebrow}</p>
            <p className="mt-2 text-base font-bold leading-snug">{current.title}</p>
            <p
              className="mt-4 text-sm leading-relaxed"
              aria-live="polite"
              data-paired-summary
            >
              {current.explanation}
            </p>
          </div>
          <div className="mt-6 border-t border-border pt-4">
            <p className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-200">
              <CircleDot className="h-4 w-4 shrink-0" aria-hidden="true" />
              아직 남은 경계
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{current.boundary}</p>
            {mode === 'cluster' && (
              <p className="mt-4 text-sm leading-relaxed">
                실제 splitter와 cluster-aware 평가 절차는{' '}
                <InternalLink slug="cross-validation">교차 검증</InternalLink>에서 구현한다.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const SPLIT_LABELS: Record<SplitDesign, string> = {
  rows: '행 무작위',
  group: '사용자 분리',
  'future-group': '미래 병원 · 사용자 분리',
};

const SELECTION_LABELS: Record<SelectionEvidence, string> = {
  reused: '같은 validation 재사용',
  untouched: '손대지 않은 audit',
};

const GUARDRAIL_LABELS: Record<GuardrailEvidence, string> = {
  average: '전체 평균만',
  checked: 'Subgroup · calibration',
};

function claimState(
  split: SplitDesign,
  selection: SelectionEvidence,
  guardrail: GuardrailEvidence,
) {
  if (split === 'rows') {
    return {
      status: '기각',
      statusTone: 'rose',
      allowed: '같은 사용자가 섞인 random-row split에서 B가 +0.583%p 높았다고만 기록할 수 있다.',
      forbidden: '새 사용자, 새 병원 또는 다음 달 배포에서도 B가 더 좋다고 말할 수 없다.',
      alternative: '같은 사용자의 반복 행을 외운 효과와 실제 일반화가 분리되지 않았다.',
      next: '사용자를 fold 사이에 섞지 않고, 배포 시간 경계까지 보존하는 split을 만든다.',
      route: { slug: 'cross-validation', label: '교차 검증' },
    };
  }
  if (selection === 'reused') {
    return {
      status: '기각',
      statusTone: 'rose',
      allowed: '40회 탐색에 사용한 validation에서 선택된 후보의 관측 점수라고만 말할 수 있다.',
      forbidden: '그 validation을 독립적인 최종 성능 증거 또는 confidence 근거로 재사용할 수 없다.',
      alternative: '작은 우연한 상승을 40번 중에서 골랐을 가능성이 남아 있다.',
      next: 'trial, split, 선택 기준을 기록하고 선택에 쓰지 않은 audit set을 한 번만 연다.',
      route: { slug: 'experiment-tracking', label: '실험 관리' },
    };
  }
  if (split === 'group') {
    return {
      status: '범위 제한',
      statusTone: 'amber',
      allowed: '현재 수집 조건의 새 사용자 group에서 B와 A의 paired 차이를 추정했다고 말할 수 있다.',
      forbidden: '새 병원·새 기기·다음 달의 distribution shift까지 통과했다고 말할 수 없다.',
      alternative: '사용자 leakage는 줄였지만 site, device와 time 조건은 그대로다.',
      next: '배포 clock을 모사하는 future-site holdout을 추가한다.',
      route: { slug: 'cross-validation', label: '교차 검증' },
    };
  }
  if (guardrail === 'average') {
    return {
      status: '보류',
      statusTone: 'amber',
      allowed: 'future-site/group audit의 전체 평균 paired 차이만 보고할 수 있다.',
      forbidden: '희귀 subgroup에 안전하거나 예측 확률을 그대로 의사결정에 써도 된다고 말할 수 없다.',
      alternative: '전체 평균이 8%p 하락한 희귀 subgroup과 shift 뒤 calibration failure를 가릴 수 있다.',
      next: 'primary metric과 별도로 subgroup harm, calibration과 action threshold를 검사한다.',
      route: { slug: 'evaluation-metrics', label: '평가 지표' },
    };
  }
  return {
    status: '조건부 주장 가능',
    statusTone: 'emerald',
    allowed: '손대지 않은 future-site/group audit와 확인한 subgroup 범위에서 B의 paired point estimate를 보고할 수 있다. 사용자별 outcome 배분이 없으므로 numeric interval은 아직 없다.',
    forbidden: '모든 병원·기기·시간과 모든 subgroup에서 B가 보편적으로 우월하다고 일반화할 수 없다.',
    alternative: 'audit 밖의 더 큰 shift, 작은 subgroup의 넓은 uncertainty와 운영 조건은 여전히 남는다.',
    next: 'dataset, split, trial budget, audit 개봉과 slice 결과를 하나의 재현 가능한 release record로 남긴다.',
    route: { slug: 'experiment-tracking', label: '실험 관리' },
  };
}

export function GeneralizationClaimLab() {
  const [split, setSplit] = useState<SplitDesign>('rows');
  const [selection, setSelection] = useState<SelectionEvidence>('reused');
  const [guardrail, setGuardrail] = useState<GuardrailEvidence>('average');
  const result = claimState(split, selection, guardrail);
  const dominantBoundary = split === 'rows'
    ? '사용자 leakage'
    : selection === 'reused'
      ? '선택에 소비한 validation'
      : split === 'group'
        ? '아직 건너지 않은 병원·시간 경계'
        : guardrail === 'average'
          ? '확인하지 않은 subgroup · calibration'
          : 'audit 밖의 새 분포';
  const statusClass = result.statusTone === 'emerald'
    ? 'border-emerald-600/40 bg-emerald-500/[0.07] text-emerald-800 dark:text-emerald-200'
    : result.statusTone === 'amber'
      ? 'border-amber-600/40 bg-amber-500/[0.07] text-amber-800 dark:text-amber-200'
      : 'border-rose-600/40 bg-rose-500/[0.07] text-rose-800 dark:text-rose-200';

  return (
    <div
      className="foundation-viz-explorer not-prose my-8 scroll-mt-20 overflow-hidden rounded-md border border-border bg-background"
      data-generalization-claim-lab
      data-split-design={split}
      data-selection-evidence={selection}
      data-guardrail-evidence={guardrail}
      data-claim-status={result.status}
    >
      <div className="border-b border-border bg-muted/20 p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <FlaskConical className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div>
            <p className="text-xs font-bold text-muted-foreground">EVIDENCE CLAIM LAB</p>
            <p className="mt-2 text-lg font-bold" data-claim-lab-title>
              증거 설계가 바뀌면 허용되는 주장도 바뀐다
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              +0.583%p라는 숫자는 그대로 둔다. 분할, 선택에 사용한 evidence와 guardrail만 바꿔
              같은 숫자를 어디까지 일반화할 수 있는지 확인한다.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-px bg-border md:grid-cols-3">
        <div
          role="group"
          aria-labelledby="claim-split-label"
          className="min-w-0 bg-background p-4 sm:p-5"
          data-claim-control-group="split"
        >
          <p
            id="claim-split-label"
            className="flex items-center gap-2 text-xs font-bold text-muted-foreground"
          >
            <Users className="h-4 w-4" aria-hidden="true" />
            1 · 평가 경계
          </p>
          <div className="mt-3 grid gap-1">
            {(Object.keys(SPLIT_LABELS) as SplitDesign[]).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={split === key}
                onClick={() => setSplit(key)}
                className={`min-h-11 rounded-sm border px-3 text-left text-xs font-bold transition-colors motion-reduce:transition-none ${
                  split === key
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                {SPLIT_LABELS[key]}
              </button>
            ))}
          </div>
        </div>

        <div
          role="group"
          aria-labelledby="claim-selection-label"
          className="min-w-0 bg-background p-4 sm:p-5"
          data-claim-control-group="selection"
        >
          <p
            id="claim-selection-label"
            className="flex items-center gap-2 text-xs font-bold text-muted-foreground"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            2 · 선택과 감사
          </p>
          <div className="mt-3 grid gap-1">
            {(Object.keys(SELECTION_LABELS) as SelectionEvidence[]).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={selection === key}
                onClick={() => setSelection(key)}
                className={`min-h-11 rounded-sm border px-3 text-left text-xs font-bold transition-colors motion-reduce:transition-none ${
                  selection === key
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                {SELECTION_LABELS[key]}
              </button>
            ))}
          </div>
        </div>

        <div
          role="group"
          aria-labelledby="claim-guardrail-label"
          className="min-w-0 bg-background p-4 sm:p-5"
          data-claim-control-group="guardrail"
        >
          <p
            id="claim-guardrail-label"
            className="flex items-center gap-2 text-xs font-bold text-muted-foreground"
          >
            <CircleDot className="h-4 w-4" aria-hidden="true" />
            3 · 실패 guardrail
          </p>
          <div className="mt-3 grid gap-1">
            {(Object.keys(GUARDRAIL_LABELS) as GuardrailEvidence[]).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={guardrail === key}
                onClick={() => setGuardrail(key)}
                className={`min-h-11 rounded-sm border px-3 text-left text-xs font-bold transition-colors motion-reduce:transition-none ${
                  guardrail === key
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                {GUARDRAIL_LABELS[key]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-px bg-border md:min-h-[24rem] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="min-w-0 bg-background p-4 sm:p-6">
          <div className={`inline-flex min-h-8 items-center rounded-sm border px-3 text-xs font-bold ${statusClass}`}>
            {result.status}
          </div>
          <p className="mt-4 text-xs font-semibold leading-relaxed text-muted-foreground">
            현재 evidence:{' '}
            <span data-claim-evidence-chain>
              {SPLIT_LABELS[split]} → {SELECTION_LABELS[selection]} → {GUARDRAIL_LABELS[guardrail]}
            </span>
            <br />
            먼저 해결할 경계: <span data-claim-dominant-boundary>{dominantBoundary}</span>
          </p>
          <div className="mt-5">
            <p className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-200">
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              여기까지 말할 수 있다
            </p>
            <p
              className="mt-2 text-sm leading-relaxed"
              aria-live="polite"
              data-claim-allowed
            >
              {result.allowed}
            </p>
          </div>
          <div className="mt-6 border-t border-border pt-5">
            <p className="flex items-center gap-2 text-xs font-bold text-rose-800 dark:text-rose-200">
              <Ban className="h-4 w-4 shrink-0" aria-hidden="true" />
              아직 말할 수 없다
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground" data-claim-forbidden>
              {result.forbidden}
            </p>
          </div>
        </div>

        <div className="min-w-0 bg-background p-4 sm:p-6">
          <p className="text-xs font-bold text-muted-foreground">가장 큰 대체 설명</p>
          <p className="mt-2 text-sm leading-relaxed" data-claim-alternative>{result.alternative}</p>
          <div className="mt-6 border-t border-border pt-5">
            <p className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
              <Route className="h-4 w-4 shrink-0" aria-hidden="true" />
              다음 측정
            </p>
            <p className="mt-2 text-sm leading-relaxed" data-claim-next>{result.next}</p>
            <p className="mt-4 text-sm">
              다음 구현 경로: <InternalLink slug={result.route.slug}>{result.route.label}</InternalLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
