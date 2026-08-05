import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Activity,
  BadgeCheck,
  Boxes,
  CalendarDays,
  Check,
  CircleStop,
  Database,
  Fingerprint,
  GitBranch,
  Gauge,
  ListChecks,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  Users,
} from 'lucide-react';
import { SegmentedControl } from '../../nlp-shared';

type DataShape = 'iid' | 'group' | 'time' | 'group-time';

const dataShapes: Record<DataShape, {
  label: string;
  icon: typeof Database;
  risk: string;
  split: string;
  firstEvidence: string;
}> = {
  iid: {
    label: '독립 표본',
    icon: Database,
    risk: '같은 생성 과정에서 독립적으로 뽑혔다는 가정이 틀리면 random split도 낙관적이다.',
    split: '고정된 random holdout 예시',
    firstEvidence: '중복·그룹·시간 의존성 부재',
  },
  group: {
    label: '반복 고객',
    icon: Users,
    risk: '같은 고객이 train과 validation에 있으면 신원·행동 패턴을 외운 점수가 된다.',
    split: 'GroupKFold 또는 group holdout',
    firstEvidence: '고객 ID 단위의 완전 분리',
  },
  time: {
    label: '미래 예측',
    icon: CalendarDays,
    risk: '미래 통계와 과거 예측이 섞이면 배포 시점에 존재하지 않는 정보를 사용한다.',
    split: '시간 순 forward validation',
    firstEvidence: 'Prediction cutoff와 feature timestamp',
  },
  'group-time': {
    label: '고객 + 시간',
    icon: GitBranch,
    risk: '시간만 자르거나 고객만 자르면 다른 축의 누출이 남을 수 있다.',
    split: '시간 holdout + group 격리 audit',
    firstEvidence: '월 경계와 고객 overlap을 함께 검사',
  },
};

function LabFrame({
  eyebrow,
  title,
  children,
  footer,
  dataAttribute,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  dataAttribute: string;
}) {
  return (
    <figure
      {...{ [dataAttribute]: '' }}
      className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background"
    >
      <figcaption className="border-b border-border px-4 py-4 sm:px-6">
        <p className="text-[11px] font-bold uppercase text-muted-foreground">{eyebrow}</p>
        <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">{title}</h3>
      </figcaption>
      <div className="min-w-0 p-4 sm:p-6">{children}</div>
      {footer ? <div className="border-t border-border bg-muted/15 px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-6">{footer}</div> : null}
    </figure>
  );
}

export function CompetitionContractLab() {
  const [shape, setShape] = useState<DataShape>('group-time');
  const item = dataShapes[shape];
  const ShapeIcon = item.icon;
  const stages = [
    { label: '업무 계약', value: '검토 500건/일', note: 'Prediction이 바꾸는 행동과 비용을 고정한다.', icon: ListChecks },
    { label: 'Metric bundle', value: 'AP + Recall@500', note: '순위 품질과 실제 처리 용량을 함께 잰다.', icon: Gauge },
    { label: 'Split 계약', value: item.split, note: item.firstEvidence, icon: ShapeIcon },
    { label: 'Run evidence', value: 'OOF + manifest', note: 'Score를 data·code·artifact와 묶는다.', icon: Fingerprint },
    { label: 'Release gate', value: 'noise보다 큰 개선', note: 'Public LB가 아니라 고정 evidence로 닫는다.', icon: BadgeCheck },
  ];

  return (
    <LabFrame
      eyebrow="Competition contract lab"
      title="모델을 고르기 전에 어떤 증거를 고정해야 할까?"
      dataAttribute="data-competition-contract-lab"
      footer="이 순서는 대회 팁이 아니라 실험 claim이 성립하기 위한 의존 관계다. Split이 틀리면 뒤의 모든 점수는 강해 보이는 오답이 된다."
    >
      <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold">숨은 데이터의 생성 구조</p>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">{item.risk}</p>
        </div>
        <SegmentedControl
          label="데이터 생성 구조"
          options={(Object.entries(dataShapes) as Array<[DataShape, (typeof dataShapes)[DataShape]]>).map(([value, data]) => ({ value, label: data.label }))}
          value={shape}
          onChange={setShape}
        />
      </div>
      <div className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          return (
            <div key={stage.label} className="min-w-0 bg-background p-3.5">
              <div className="flex items-center justify-between gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span>
              </div>
              <p className="mt-3 text-xs font-bold">{stage.label}</p>
              <p className="mt-1 text-sm font-semibold leading-snug text-blue-700 dark:text-blue-300">{stage.value}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{stage.note}</p>
            </div>
          );
        })}
      </div>
    </LabFrame>
  );
}

export function MetricDecisionLab() {
  const [prevalence, setPrevalence] = useState(1);
  const [fnCost, setFnCost] = useState(30);
  const [capacity, setCapacity] = useState(500);
  const rare = prevalence < 5;
  const capacityBound = capacity < 1500;
  const primary = rare ? 'Average precision' : 'ROC AUC';
  const actionMetric = capacityBound ? `Recall@${capacity}` : 'Fβ at policy threshold';
  const probabilityMetric = fnCost >= 10 ? 'Log loss + calibration curve' : 'Brier score';

  return (
    <LabFrame
      eyebrow="Metric decision lab"
      title="순위, 확률, 행동을 한 숫자로 뭉개지 않는다"
      dataAttribute="data-metric-decision-lab"
      footer="추천은 문제 구조를 드러내는 교육용 rule이다. 실제 채택은 업무 비용, 표본 불확실성, slice 결과를 함께 검토한다."
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.72fr)]">
        <div className="space-y-5">
          {[
            { label: '양성률', value: prevalence, set: setPrevalence, min: 0.2, max: 20, step: 0.2, suffix: '%' },
            { label: 'False negative 상대 비용', value: fnCost, set: setFnCost, min: 1, max: 50, step: 1, suffix: '×' },
            { label: '하루 검토 용량', value: capacity, set: setCapacity, min: 100, max: 3000, step: 100, suffix: '건' },
          ].map((control) => (
            <label key={control.label} className="block">
              <span className="flex items-center justify-between gap-3 text-xs font-semibold">
                {control.label}
                <span className="font-mono text-blue-700 dark:text-blue-300">{control.value}{control.suffix}</span>
              </span>
              <input
                aria-label={control.label}
                type="range"
                min={control.min}
                max={control.max}
                step={control.step}
                value={control.value}
                onChange={(event) => control.set(Number(event.target.value))}
                className="mt-2 w-full accent-blue-600"
              />
            </label>
          ))}
        </div>
        <div className="divide-y divide-border border-y border-border">
          {[
            ['순위 품질', primary, '후보 전체에서 양성을 얼마나 앞에 두는가'],
            ['행동 품질', actionMetric, '실제 처리 가능한 위치에서 얼마나 잡는가'],
            ['확률 품질', probabilityMetric, '0.8이라는 숫자가 실제 빈도와 맞는가'],
          ].map(([label, value, note]) => (
            <div key={label} className="py-3">
              <p className="text-[11px] font-bold text-muted-foreground">{label}</p>
              <p className="mt-1 text-sm font-bold">{value}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{note}</p>
            </div>
          ))}
        </div>
      </div>
    </LabFrame>
  );
}

const splitRows = [
  { month: '1월', group: 'A', target: 0 },
  { month: '2월', group: 'B', target: 0 },
  { month: '3월', group: 'A', target: 1 },
  { month: '4월', group: 'C', target: 0 },
  { month: '5월', group: 'D', target: 1 },
  { month: '6월', group: 'A', target: 1 },
] as const;

export function SplitContractLab() {
  const [shape, setShape] = useState<DataShape>('group-time');
  const assignment: Array<'train' | 'valid' | 'excluded'> = splitRows.map((row, index) => {
    if (shape === 'iid') return index % 3 === 2 ? 'valid' : 'train';
    if (shape === 'group') return row.group === 'D' ? 'valid' : 'train';
    if (shape === 'time') return index >= 4 ? 'valid' : 'train';
    if (index >= 4) return 'valid';
    return row.group === 'A' ? 'excluded' : 'train';
  });
  const trainGroups = new Set(splitRows.filter((_, index) => assignment[index] === 'train').map((row) => row.group));
  const validGroups = new Set(splitRows.filter((_, index) => assignment[index] === 'valid').map((row) => row.group));
  const observedGroupOverlap = [...validGroups].some((group) => trainGroups.has(group));
  const firstValidIndex = assignment.findIndex((side) => side === 'valid');
  const timeLeak = firstValidIndex < 0 || assignment.some((side, index) => side === 'train' && index > firstValidIndex);
  const hasRepeatedGroup = new Set(splitRows.map((row) => row.group)).size < splitRows.length;
  const groupLeak = (shape === 'group' || shape === 'group-time') && observedGroupOverlap;
  const futureLeak = (shape === 'time' || shape === 'group-time') && timeLeak;
  const valid = shape === 'group-time'
    ? !groupLeak && !futureLeak
    : shape === 'time'
      ? !futureLeak
      : shape === 'group'
        ? !groupLeak
        : !hasRepeatedGroup && !timeLeak;
  const timeStatus = shape === 'time' || shape === 'group-time'
    ? (futureLeak ? '위험' : '통과')
    : '계약 밖';
  const groupStatus = shape === 'group' || shape === 'group-time'
    ? (groupLeak ? '위험' : '통과')
    : shape === 'time'
      ? (observedGroupOverlap ? '기존 고객 허용' : 'Overlap 없음')
      : hasRepeatedGroup ? 'IID 가정 위반' : 'IID 가정 통과';

  return (
    <LabFrame
      eyebrow="Split contract lab"
      title="같은 여섯 행도 split 질문에 따라 증거가 달라진다"
      dataAttribute="data-split-contract-lab"
      footer="데모는 단일 holdout의 작은 예다. Group+time에서는 validation 고객 A가 train에 섞이지 않도록 과거 A 행을 학습 제외했다. 실제로는 신규 고객과 기존 고객을 별도 slice로 평가하는 정책도 가능하며 이를 manifest에 명시한다."
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold">검증하려는 일반화 축</p>
          <p className="mt-1 text-sm text-muted-foreground">{dataShapes[shape].firstEvidence}</p>
        </div>
        <SegmentedControl
          label="Split 구조"
          options={(Object.entries(dataShapes) as Array<[DataShape, (typeof dataShapes)[DataShape]]>).map(([value, data]) => ({ value, label: data.label }))}
          value={shape}
          onChange={setShape}
        />
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
        {splitRows.map((row, index) => (
          <div
            key={`${row.month}-${row.group}`}
            className={`min-w-0 rounded-md border p-3 ${
              assignment[index] === 'valid'
                ? 'border-blue-500/40 bg-blue-500/[0.05]'
                : assignment[index] === 'excluded'
                  ? 'border-amber-500/35 bg-amber-500/[0.04]'
                  : 'border-border'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold">{row.month}</span>
              <span
                className={`rounded-sm px-1.5 py-0.5 text-[10px] font-bold ${
                  assignment[index] === 'valid'
                    ? 'bg-blue-600 text-white'
                    : assignment[index] === 'excluded'
                      ? 'bg-amber-600 text-white'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {assignment[index] === 'excluded' ? '학습 제외' : assignment[index]}
              </span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">고객 <strong className="text-foreground">{row.group}</strong> · y={row.target}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-3">
        {[
          ['시간 순서', timeStatus],
          ['고객 overlap', groupStatus],
          ['현재 계약', valid ? '증거 사용 가능' : '생성 과정 재검토'],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-[11px] font-bold text-muted-foreground">{label}</p>
            <p
              className={`mt-1 text-sm font-bold ${
                value === '위험' || value === '생성 과정 재검토' || value === 'IID 가정 위반'
                  ? 'text-rose-700 dark:text-rose-300'
                  : value === '계약 밖' || value === '기존 고객 허용'
                    ? 'text-amber-700 dark:text-amber-300'
                    : 'text-emerald-700 dark:text-emerald-300'
              }`}
            >
              {value}
            </p>
          </div>
        ))}
      </div>
    </LabFrame>
  );
}

const evidenceFields = [
  { id: 'data', label: 'Dataset digest', icon: Database, consequence: '어떤 행·label로 score를 만들었는지 복원할 수 없다.' },
  { id: 'split', label: 'Split manifest', icon: GitBranch, consequence: '같은 경계에서 leakage와 fold score를 다시 검사할 수 없다.' },
  { id: 'code', label: 'Code revision', icon: Fingerprint, consequence: 'Preprocessing과 metric 구현의 차이를 추적할 수 없다.' },
  { id: 'config', label: 'Config + seed policy', icon: SlidersHorizontal, consequence: '설정 차이와 반복 변동을 model 변화로부터 분리할 수 없다.' },
  { id: 'oof', label: 'OOF predictions', icon: Activity, consequence: 'Threshold, slice, calibration과 ensemble을 같은 행에서 재검증할 수 없다.' },
  { id: 'artifact', label: 'Model + feature schema', icon: Boxes, consequence: '같은 inference를 재생하거나 입력 schema 변화를 막을 수 없다.' },
] as const;

export function EvidenceLedgerLab() {
  const [included, setIncluded] = useState<Set<string>>(() => new Set(['data', 'code', 'config']));
  const toggle = (id: string) => setIncluded((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
  const missing = evidenceFields.filter((field) => !included.has(field.id));
  const complete = missing.length === 0;

  return (
    <LabFrame
      eyebrow="Evidence ledger lab"
      title="0.982라는 score를 다시 만들 수 있는 claim으로 바꾼다"
      dataAttribute="data-evidence-ledger-lab"
      footer="Tracking 제품은 이 ledger를 저장하고 비교하는 구현이다. 제품 이름이 run의 완전성을 자동으로 보장하지는 않는다."
    >
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {evidenceFields.map((field) => {
          const active = included.has(field.id);
          const Icon = field.icon;
          return (
            <button
              key={field.id}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(field.id)}
              className={`flex min-h-16 min-w-0 items-center gap-3 rounded-md border px-3 py-3 text-left transition-colors ${active ? 'border-emerald-500/40 bg-emerald-500/[0.05]' : 'border-border hover:bg-muted/25'}`}
            >
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-md border ${active ? 'border-emerald-500/35 text-emerald-700 dark:text-emerald-300' : 'border-border text-muted-foreground'}`}>
                {active ? <Check className="h-4 w-4" aria-hidden="true" /> : <Icon className="h-4 w-4" aria-hidden="true" />}
              </span>
              <span className="min-w-0 text-xs font-bold leading-snug">{field.label}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-5 flex items-start gap-3 border-t border-border pt-4">
        {complete ? <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /> : <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />}
        <div className="min-w-0">
          <p className="text-sm font-bold">{complete ? '재현 evidence 완성' : `${missing.length}개 필드가 비어 있음`}</p>
          {complete ? (
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              다른 사람이 같은 split과 artifact를 찾아 score claim을 재검사할 수 있다.
            </p>
          ) : (
            <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-muted-foreground">
              {missing.map((field) => (
                <li key={field.id}>
                  <strong className="text-foreground">{field.label}</strong>: {field.consequence}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </LabFrame>
  );
}

export function SearchGateLab() {
  const [delta, setDelta] = useState(12);
  const [noise, setNoise] = useState(9);
  const [hours, setHours] = useState(18);
  const [trials, setTrials] = useState(100);
  const margin = delta - 1.5 * noise;
  const costly = hours > 36;
  const decision = margin > 0 && !costly
    ? { label: '반복 검증으로 진행', note: 'Noise margin과 36 GPU-hour 예산을 통과했다. 아직 자동 채택은 아니다.', icon: BadgeCheck, tone: 'text-emerald-700 dark:text-emerald-300' }
    : margin > 0
      ? { label: 'Compute 예산 초과', note: '품질 signal은 보이지만 같은 예산의 더 단순한 실험과 비교한다.', icon: Search, tone: 'text-amber-700 dark:text-amber-300' }
      : { label: '탐색 중단', note: '관측 개선이 validation 변동과 구분되지 않는다.', icon: CircleStop, tone: 'text-rose-700 dark:text-rose-300' };
  const DecisionIcon = decision.icon;

  return (
    <LabFrame
      eyebrow="Search stop gate"
      title="Trial을 더 돌리는 대신 개선 신호가 noise보다 큰지 묻는다"
      dataAttribute="data-search-gate-lab"
      footer="1.5×와 36 GPU-hour는 이 데모의 명시적 heuristic이지 보편 정리가 아니다. 실제 margin과 budget은 repeated seed, fold 변동, 업무 위험과 compute opportunity cost로 정한다."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-5">
          {[
            { label: 'Baseline 대비 관측 개선', value: delta, set: setDelta, max: 40, suffix: ' bp' },
            { label: '반복·fold noise', value: noise, set: setNoise, max: 25, suffix: ' bp' },
            { label: '추가 compute', value: hours, set: setHours, max: 72, suffix: ' GPU-hour' },
            { label: '누적 trial 수', value: trials, set: setTrials, max: 2000, suffix: '회' },
          ].map((control) => (
            <label key={control.label} className="block">
              <span className="flex items-center justify-between gap-3 text-xs font-semibold"><span>{control.label}</span><span className="font-mono text-blue-700 dark:text-blue-300">{control.value}{control.suffix}</span></span>
              <input aria-label={control.label} type="range" min="0" max={control.max} value={control.value} onChange={(event) => control.set(Number(event.target.value))} className="mt-2 w-full accent-blue-600" />
            </label>
          ))}
        </div>
        <div className="flex min-w-0 flex-col justify-between border-y border-border py-4">
          <div>
            <p className="text-[11px] font-bold text-muted-foreground">Noise-adjusted margin</p>
            <p className={`mt-1 font-mono text-2xl font-bold ${margin > 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>{margin.toFixed(1)} bp</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {trials >= 500 ? '반복 선택 편향 위험 높음 · untouched audit 필요' : '탐색 횟수 제한 안에서 비교 중'}
            </p>
          </div>
          <div className="mt-5 flex items-start gap-3">
            <DecisionIcon className={`mt-0.5 h-5 w-5 shrink-0 ${decision.tone}`} aria-hidden="true" />
            <div><p className={`text-sm font-bold ${decision.tone}`}>{decision.label}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{decision.note}</p></div>
          </div>
        </div>
      </div>
    </LabFrame>
  );
}

type LearningCurve = 'fast' | 'late' | 'unstable';

const learningCurves: Record<LearningCurve, { label: string; values: number[]; note: string }> = {
  fast: {
    label: '빠른 수렴',
    values: [42, 58, 69, 76, 80, 82, 83, 84],
    note: '초반부터 비교 기준을 넘으므로 pruning 판단이 비교적 안정적이다.',
  },
  late: {
    label: '늦은 개선',
    values: [35, 38, 43, 51, 64, 76, 84, 88],
    note: 'Warmup 전에 자르면 실제로 가장 좋은 후보를 제거한다.',
  },
  unstable: {
    label: '불안정',
    values: [48, 62, 45, 71, 53, 77, 59, 73],
    note: '한 step의 값보다 smoothing, 반복과 failure policy가 필요하다.',
  },
};

export function PruningEvidenceLab() {
  const [curve, setCurve] = useState<LearningCurve>('late');
  const [step, setStep] = useState(3);
  const data = learningCurves[curve];
  const score = data.values[step - 1];
  const warmupComplete = step >= 4;
  const decision = !warmupComplete ? '판정 보류' : score >= 55 ? '계속 학습' : 'Prune 후보';

  return (
    <LabFrame
      eyebrow="Pruning evidence lab"
      title="초기 score만 보고 늦게 좋아지는 trial을 버리지 않는다"
      dataAttribute="data-pruning-evidence-lab"
      footer="55점과 4-step warmup은 교육용 기준이다. 실제 pruner는 비교 가능한 resource 축과 study의 intermediate distribution으로 정한다."
    >
      <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold">{data.note}</p>
          <p className="mt-1 text-xs text-muted-foreground">현재 step {step} · intermediate score {score}</p>
        </div>
        <SegmentedControl
          label="학습 곡선"
          options={(Object.entries(learningCurves) as Array<[LearningCurve, (typeof learningCurves)[LearningCurve]]>).map(([value, item]) => ({ value, label: item.label }))}
          value={curve}
          onChange={setCurve}
        />
      </div>
      <div className="mt-5 grid h-36 grid-cols-8 items-end gap-1.5 border-b border-border px-1" aria-label="step별 intermediate score">
        {data.values.map((value, index) => (
          <div key={index} className="flex h-full min-w-0 items-end">
            <div
              role="meter"
              aria-label={`step ${index + 1} intermediate score ${value}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={value}
              className={`w-full rounded-t-sm ${index + 1 <= step ? 'bg-blue-600' : 'bg-muted'}`}
              style={{ height: `${value}%` }}
              title={`step ${index + 1}: ${value}`}
            />
          </div>
        ))}
      </div>
      <label className="mt-5 block">
        <span className="flex items-center justify-between gap-3 text-xs font-semibold">
          관측 step
          <span className="font-mono text-blue-700 dark:text-blue-300">{step} / 8</span>
        </span>
        <input aria-label="관측 step" type="range" min="1" max="8" value={step} onChange={(event) => setStep(Number(event.target.value))} className="mt-2 w-full accent-blue-600" />
      </label>
      <div className="mt-4 border-t border-border pt-4">
        <p className={`text-sm font-bold ${decision === '판정 보류' ? 'text-amber-700 dark:text-amber-300' : decision === '계속 학습' ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>{decision}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {!warmupComplete ? '최소 warmup을 채우지 않아 현재 score로 trial을 제거하지 않는다.' : score >= 55 ? '같은 resource 단계의 기준을 넘어 다음 step을 관측한다.' : '반복 확인 뒤 compute를 회수할 수 있다.'}
        </p>
      </div>
    </LabFrame>
  );
}

const paretoCandidates = [
  { id: 'A', quality: 91, latency: 78, memory: 14 },
  { id: 'B', quality: 88, latency: 34, memory: 9 },
  { id: 'C', quality: 86, latency: 22, memory: 7 },
  { id: 'D', quality: 84, latency: 46, memory: 11 },
] as const;

export function ParetoBudgetLab() {
  const [latencyBudget, setLatencyBudget] = useState(40);
  const [memoryBudget, setMemoryBudget] = useState(10);

  return (
    <LabFrame
      eyebrow="Multi-objective budget lab"
      title="품질 하나로 합치지 않고 hard budget 안의 Pareto 후보를 본다"
      dataAttribute="data-pareto-budget-lab"
      footer="후보 D는 B보다 품질이 낮고 latency·memory도 커서 지배된다. 나머지 후보 중 실제 release는 품질 차이의 uncertainty와 운영 비용까지 검토한다."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label>
          <span className="flex items-center justify-between gap-3 text-xs font-semibold">p95 latency budget<span className="font-mono text-blue-700 dark:text-blue-300">{latencyBudget} ms</span></span>
          <input aria-label="p95 latency budget" type="range" min="15" max="100" value={latencyBudget} onChange={(event) => setLatencyBudget(Number(event.target.value))} className="mt-2 w-full accent-blue-600" />
        </label>
        <label>
          <span className="flex items-center justify-between gap-3 text-xs font-semibold">Memory budget<span className="font-mono text-blue-700 dark:text-blue-300">{memoryBudget} GB</span></span>
          <input aria-label="Memory budget" type="range" min="6" max="16" value={memoryBudget} onChange={(event) => setMemoryBudget(Number(event.target.value))} className="mt-2 w-full accent-blue-600" />
        </label>
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {paretoCandidates.map((candidate) => {
          const feasible = candidate.latency <= latencyBudget && candidate.memory <= memoryBudget;
          const dominated = candidate.id === 'D';
          return (
            <div key={candidate.id} className={`min-w-0 rounded-md border p-3 ${feasible && !dominated ? 'border-emerald-500/40 bg-emerald-500/[0.05]' : 'border-border'}`}>
              <div className="flex items-center justify-between gap-2">
                <strong className="text-sm">후보 {candidate.id}</strong>
                <span className={`text-[10px] font-bold ${dominated ? 'text-rose-700 dark:text-rose-300' : feasible ? 'text-emerald-700 dark:text-emerald-300' : 'text-muted-foreground'}`}>
                  {dominated ? '지배됨' : feasible ? '예산 통과' : '예산 밖'}
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">품질 {candidate.quality} · {candidate.latency} ms · {candidate.memory} GB</p>
            </div>
          );
        })}
      </div>
    </LabFrame>
  );
}

export function EnsembleGateLab() {
  const [lift, setLift] = useState(18);
  const [correlation, setCorrelation] = useState(82);
  const [latency, setLatency] = useState(14);
  const [calibrationGap, setCalibrationGap] = useState(3);
  const diversityGain = useMemo(() => lift * (1 - correlation / 100), [correlation, lift]);
  const pass = diversityGain >= 4 && latency <= 25 && calibrationGap <= 5;

  return (
    <LabFrame
      eyebrow="OOF ensemble gate"
      title="다른 architecture가 아니라 다른 오류가 필요하다"
      dataAttribute="data-ensemble-gate-lab"
      footer="lift×(1−상관), 4 bp, 25 ms, calibration gap 5%p는 상호작용을 보여 주는 교육용 heuristic과 예시 budget이다. 실제 기준은 같은 OOF 행렬과 운영 계약에서 정하고 final test label은 보지 않는다."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-5">
          {[
            { label: '후보 model의 단독 OOF lift', value: lift, set: setLift, max: 40, suffix: ' bp' },
            { label: '현재 조합과 OOF 오류 상관', value: correlation, set: setCorrelation, min: -100, max: 100, suffix: '%' },
            { label: '추가 p95 latency', value: latency, set: setLatency, max: 60, suffix: ' ms' },
            { label: 'Calibration gap', value: calibrationGap, set: setCalibrationGap, max: 20, suffix: '%p' },
          ].map((control) => (
            <label key={control.label} className="block">
              <span className="flex items-center justify-between gap-3 text-xs font-semibold"><span>{control.label}</span><span className="font-mono text-blue-700 dark:text-blue-300">{control.value}{control.suffix}</span></span>
              <input aria-label={control.label} type="range" min={control.min ?? 0} max={control.max} value={control.value} onChange={(event) => control.set(Number(event.target.value))} className="mt-2 w-full accent-blue-600" />
            </label>
          ))}
        </div>
        <div className="border-y border-border py-4">
          <p className="text-[11px] font-bold text-muted-foreground">Diversity-adjusted signal</p>
          <p className="mt-1 font-mono text-2xl font-bold">{diversityGain.toFixed(1)} bp</p>
          <div className="mt-5 flex items-start gap-3">
            {pass ? <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /> : <CircleStop className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />}
            <div>
              <p className={`text-sm font-bold ${pass ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>{pass ? 'OOF 조합 검증으로 진행' : '복잡도 추가를 멈춤'}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{pass ? '오류 다양성, latency와 calibration 예산이 모두 gate를 통과했다.' : '단독 점수가 높아도 같은 오류를 반복하거나 latency·calibration 예산을 넘는다.'}</p>
            </div>
          </div>
        </div>
      </div>
    </LabFrame>
  );
}
