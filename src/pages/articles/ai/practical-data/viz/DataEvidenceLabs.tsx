import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  AlertTriangle,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  Database,
  FileClock,
  Gauge,
  GitBranch,
  Image,
  Layers3,
  LockKeyhole,
  ScanSearch,
  ShieldCheck,
  SlidersHorizontal,
  Split,
  Target,
  Users,
  XCircle,
} from 'lucide-react';
import { SegmentedControl } from '../../nlp-shared';

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
  footer: ReactNode;
  dataAttribute: string;
}) {
  return (
    <figure
      {...{ [dataAttribute]: '' }}
      className="not-prose my-8 min-w-0 scroll-mt-24 overflow-hidden rounded-md border border-border bg-background"
    >
      <figcaption className="border-b border-border px-4 py-4 sm:px-6">
        <p className="text-[11px] font-bold uppercase text-muted-foreground">{eyebrow}</p>
        <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">{title}</h3>
      </figcaption>
      <div className="min-w-0 p-4 sm:p-6">{children}</div>
      <div className="border-t border-border bg-muted/15 px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-6">
        {footer}
      </div>
    </figure>
  );
}

type DataShape = 'independent' | 'grouped' | 'temporal';

const dataShapeCopy: Record<DataShape, {
  label: string;
  unit: string;
  hiddenDependency: string;
  split: string;
  stop: string;
  icon: typeof Database;
}> = {
  independent: {
    label: '독립 행',
    unit: '한 행 = 한 번의 독립 측정',
    hiddenDependency: '중복·원본 공유가 없다는 증거 필요',
    split: '고정 random holdout 후보',
    stop: 'Near duplicate가 발견되면 독립 가정을 취소',
    icon: Database,
  },
  grouped: {
    label: '반복 설비',
    unit: '한 설비에서 여러 window 생성',
    hiddenDependency: '같은 설비·중첩 시간창',
    split: '설비 group을 완전히 분리',
    stop: '같은 설비가 fold 양쪽에 있으면 중단',
    icon: Users,
  },
  temporal: {
    label: '미래 운영',
    unit: '과거로 학습해 다음 달을 예측',
    hiddenDependency: '시간 순서·label 지연·cutoff',
    split: '시간 순 forward validation',
    stop: 'Feature timestamp가 cutoff 뒤면 제거',
    icon: CalendarClock,
  },
};

export function DataContractLab() {
  const [shape, setShape] = useState<DataShape>('grouped');
  const selected = dataShapeCopy[shape];
  const ShapeIcon = selected.icon;
  const stages = [
    { label: '행 단위', value: selected.unit, icon: Database },
    { label: '숨은 의존', value: selected.hiddenDependency, icon: GitBranch },
    { label: '검증 경계', value: selected.split, icon: Split },
    { label: '중단 조건', value: selected.stop, icon: LockKeyhole },
  ];

  return (
    <LabFrame
      eyebrow="Data contract lab"
      title="행이 어떻게 만들어졌는지가 split을 바꾼다"
      dataAttribute="data-data-contract-lab"
      footer="Class 비율을 맞추는 것과 독립성을 보장하는 것은 다른 일이다. 먼저 생성 단위를 고정해야 분포와 metric도 의미를 얻는다."
    >
      <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ShapeIcon className="h-4 w-4 text-blue-700 dark:text-blue-300" aria-hidden="true" />
            현재 가정: {selected.label}
          </div>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            같은 표를 보더라도 표본 생성 과정이 달라지면 믿을 수 있는 validation도 달라진다.
          </p>
        </div>
        <SegmentedControl
          label="표본 생성 구조"
          options={(Object.entries(dataShapeCopy) as Array<[DataShape, (typeof dataShapeCopy)[DataShape]]>).map(([value, item]) => ({
            value,
            label: item.label,
          }))}
          value={shape}
          onChange={setShape}
        />
      </div>
      <div className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          return (
            <div key={stage.label} className="min-w-0 bg-background p-4">
              <div className="flex items-center justify-between gap-3">
                <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span>
              </div>
              <p className="mt-3 text-xs font-bold">{stage.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{stage.value}</p>
            </div>
          );
        })}
      </div>
    </LabFrame>
  );
}

type MissingPattern = 'scattered' | 'group' | 'event';

const missingPatterns: Record<MissingPattern, {
  label: string;
  slices: Array<[string, number]>;
  observation: string;
  hypothesis: string;
  nextEvidence: string;
}> = {
  scattered: {
    label: '고르게 흩어짐',
    slices: [['설비 A', 8], ['설비 B', 7], ['고장 전', 9]],
    observation: 'Slice별 관측률 차이가 작다.',
    hypothesis: '무작위 결측일 수 있지만 plot만으로 MCAR를 확정할 수 없다.',
    nextEvidence: '수집 로그, 장치 오류 코드와 시간별 비율을 확인한다.',
  },
  group: {
    label: '설비 B 집중',
    slices: [['설비 A', 5], ['설비 B', 42], ['고장 전', 18]],
    observation: '특정 장치 유형에서 결측이 급증한다.',
    hypothesis: '관측된 설비 유형에 조건부인 수집 차이일 수 있다.',
    nextEvidence: '장치 firmware·sensor schema·교체 이력을 대조한다.',
  },
  event: {
    label: '고장 직전 집중',
    slices: [['평상시', 4], ['고장 24h 전', 31], ['고장 1h 전', 68]],
    observation: '사건이 가까워질수록 결측률이 증가한다.',
    hypothesis: '상태가 센서 dropout을 만들 수 있어 missing indicator도 신호다.',
    nextEvidence: 'Prediction cutoff에서 관측 가능했는지와 운영 재현성을 확인한다.',
  },
};

export function MissingnessShiftLab() {
  const [pattern, setPattern] = useState<MissingPattern>('group');
  const selected = missingPatterns[pattern];

  return (
    <LabFrame
      eyebrow="Missingness evidence lab"
      title="결측률은 답이 아니라 생성 과정에 대한 관측이다"
      dataAttribute="data-missingness-shift-lab"
      footer="MCAR·MAR·MNAR는 데이터 표만 보고 확정하는 라벨이 아니다. 관측 가능한 원인, 수집 과정과 사건 시점을 연결해 가설과 추가 증거를 남긴다."
    >
      <SegmentedControl
        label="결측 패턴"
        options={(Object.entries(missingPatterns) as Array<[MissingPattern, (typeof missingPatterns)[MissingPattern]]>).map(([value, item]) => ({
          value,
          label: item.label,
        }))}
        value={pattern}
        onChange={setPattern}
      />
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(18rem,1.1fr)]">
        <div className="space-y-3">
          {selected.slices.map(([label, rate]) => (
            <div key={label}>
              <div className="flex items-center justify-between gap-3 text-xs font-semibold">
                <span>{label}</span>
                <span className="font-mono">{rate}% missing</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-sm bg-muted">
                <div className="h-full bg-amber-500" style={{ width: `${rate}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="divide-y divide-border border-y border-border">
          {[
            ['관측', selected.observation],
            ['가능한 가설', selected.hypothesis],
            ['다음 증거', selected.nextEvidence],
          ].map(([label, value]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[7rem_minmax(0,1fr)]">
              <strong className="text-xs">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </LabFrame>
  );
}

const sourceEvents = [
  { month: 1, label: '센서 원값', kind: 'raw' },
  { month: 2, label: '정비 횟수', kind: 'raw' },
  { month: 4, label: '30일 rolling', kind: 'aggregate' },
  { month: 6, label: '고장 확정', kind: 'label' },
  { month: 7, label: '전체 기간 평균', kind: 'aggregate' },
] as const;

export function FeatureCutoffLab() {
  const [cutoff, setCutoff] = useState(4);
  const rows = sourceEvents.map((event) => {
    const available = event.month < cutoff;
    const verdict = event.kind === 'label'
      ? '평가용 label'
      : available
        ? event.kind === 'aggregate'
        ? 'fold train에서 다시 계산'
          : '사용 가능'
        : '미래 누출';
    return { ...event, available, verdict };
  });

  return (
    <LabFrame
      eyebrow="Point-in-time feature lab"
      title="Prediction cutoff를 움직이면 사용할 수 있는 사실이 달라진다"
      dataAttribute="data-feature-cutoff-lab"
      footer="시간상 먼저 존재한다는 것만으로 충분하지 않다. 평균, 인코더, scaler처럼 데이터에서 학습한 상태는 fold train 안에서 fit해야 한다."
    >
      <label className="block">
        <span className="flex items-center justify-between gap-3 text-xs font-semibold">
          예측 시점
          <span className="font-mono text-blue-700 dark:text-blue-300">{cutoff}월 1일</span>
        </span>
        <input
          aria-label="예측 시점"
          className="mt-2 w-full accent-blue-600"
          type="range"
          min={2}
          max={7}
          step={1}
          value={cutoff}
          onChange={(event) => setCutoff(Number(event.target.value))}
        />
      </label>
      <div className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
        {rows.map((row) => {
          const rejected = row.verdict === '미래 누출';
          const evaluation = row.verdict === '평가용 label';
          return (
            <div key={`${row.month}-${row.label}`} className="min-w-0 bg-background p-3.5">
              <div className="flex items-center justify-between gap-2">
                <FileClock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span className="font-mono text-[11px]">{row.month}월</span>
              </div>
              <p className="mt-3 text-sm font-bold">{row.label}</p>
              <p className={`mt-2 text-xs font-semibold ${
                rejected
                  ? 'text-rose-700 dark:text-rose-300'
                  : evaluation
                    ? 'text-amber-700 dark:text-amber-300'
                    : 'text-emerald-700 dark:text-emerald-300'
              }`}>
                {row.verdict}
              </p>
            </div>
          );
        })}
      </div>
    </LabFrame>
  );
}

type AugTask = 'classification' | 'detection' | 'ocr';
type Transform = 'flip' | 'crop' | 'color';

const augmentationCopy: Record<AugTask, {
  label: string;
  target: string;
  contract: Record<Transform, { verdict: 'keep' | 'sync' | 'reject'; explanation: string }>;
}> = {
  classification: {
    label: '부품 종류 분류',
    target: 'Image label 하나',
    contract: {
      flip: { verdict: 'keep', explanation: '좌우 방향이 부품 종류를 바꾸지 않는다는 domain 확인 뒤 허용한다.' },
      crop: { verdict: 'reject', explanation: '부품 전체가 사라질 수 있어 minimum visible-area 조건 없이는 거부한다.' },
      color: { verdict: 'keep', explanation: '조명 변화는 허용하되 색이 결함 신호라면 강도를 낮춘다.' },
    },
  },
  detection: {
    label: '결함 위치 탐지',
    target: 'Image + bounding box',
    contract: {
      flip: { verdict: 'sync', explanation: 'Image와 box x좌표를 같은 변환으로 갱신해야 한다.' },
      crop: { verdict: 'sync', explanation: '잘린 box를 clip하고 visible-area 기준으로 label을 유지·제거한다.' },
      color: { verdict: 'keep', explanation: 'Box 좌표는 그대로지만 결함 contrast가 보존되는지 확인한다.' },
    },
  },
  ocr: {
    label: '문자 인식',
    target: 'Image + text sequence',
    contract: {
      flip: { verdict: 'reject', explanation: '좌우 반전은 문자 순서와 모양을 바꾸므로 일반적인 OCR invariance가 아니다.' },
      crop: { verdict: 'reject', explanation: '문자가 잘리면 transcript가 더는 정답이 아니다. Text-aware crop만 허용한다.' },
      color: { verdict: 'keep', explanation: '가독성을 유지하는 범위에서 scanner·조명 변화를 모사할 수 있다.' },
    },
  },
};

const transformLabels: Record<Transform, string> = {
  flip: '좌우 반전',
  crop: '무작위 crop',
  color: '색·조명 변화',
};

export function AugmentationContractLab() {
  const [task, setTask] = useState<AugTask>('detection');
  const [transform, setTransform] = useState<Transform>('flip');
  const selected = augmentationCopy[task];
  const result = selected.contract[transform];
  const VerdictIcon = result.verdict === 'keep' ? CheckCircle2 : result.verdict === 'sync' ? Layers3 : XCircle;
  const verdictLabel = result.verdict === 'keep' ? 'Label 보존' : result.verdict === 'sync' ? 'Target 동기화' : '변환 거부';

  return (
    <LabFrame
      eyebrow="Augmentation contract lab"
      title="같은 변환도 task가 바뀌면 정답이 바뀐다"
      dataAttribute="data-augmentation-contract-lab"
      footer="Augmentation은 이미지 효과 목록이 아니라 의미 보존 계약이다. Detection·segmentation·keypoint에서는 target도 같은 기하 변환을 받아야 한다."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <SegmentedControl
          label="학습 task"
          options={(Object.entries(augmentationCopy) as Array<[AugTask, (typeof augmentationCopy)[AugTask]]>).map(([value, item]) => ({
            value,
            label: item.label,
          }))}
          value={task}
          onChange={setTask}
        />
        <SegmentedControl
          label="후보 변환"
          options={(Object.entries(transformLabels) as Array<[Transform, string]>).map(([value, label]) => ({ value, label }))}
          value={transform}
          onChange={setTransform}
        />
      </div>
      <div className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-[0.8fr_1fr_1.2fr]">
        <div className="bg-background p-4">
          <Image className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <p className="mt-3 text-xs font-bold">입력</p>
          <p className="mt-1 text-sm">{transformLabels[transform]}</p>
        </div>
        <div className="bg-background p-4">
          <Target className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <p className="mt-3 text-xs font-bold">정답 구조</p>
          <p className="mt-1 text-sm">{selected.target}</p>
        </div>
        <div className="bg-background p-4">
          <VerdictIcon className={`h-5 w-5 ${
            result.verdict === 'reject'
              ? 'text-rose-600'
              : result.verdict === 'sync'
                ? 'text-amber-600'
                : 'text-emerald-600'
          }`} aria-hidden="true" />
          <p className="mt-3 text-xs font-bold">{verdictLabel}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{result.explanation}</p>
        </div>
      </div>
    </LabFrame>
  );
}

export function RareEventDecisionLab() {
  const [prevalence, setPrevalence] = useState(1);
  const [capacity, setCapacity] = useState(120);
  const [fnCost, setFnCost] = useState(40);
  const population = 10_000;
  const positives = Math.round(population * prevalence / 100);
  const actionShare = capacity / population;
  const recommendations = useMemo(() => [
    {
      label: '평가',
      value: `AP + Recall@${capacity}`,
      note: `${positives}개 양성과 상위 ${(actionShare * 100).toFixed(1)}% 행동을 함께 본다.`,
      icon: Gauge,
    },
    {
      label: '학습 신호',
      value: prevalence < 2 ? 'Class weight부터 비교' : '원 분포 baseline',
      note: 'Resampling은 fold train 내부 후보이며 자동 정답이 아니다.',
      icon: SlidersHorizontal,
    },
    {
      label: '확률',
      value: '독립 OOF calibration',
      note: 'Artificially balanced train prevalence를 운영 확률로 읽지 않는다.',
      icon: ScanSearch,
    },
    {
      label: '정책',
      value: fnCost >= 20 ? 'Recall guardrail + capacity' : 'Expected cost 최소화',
      note: 'Threshold는 모델 weight가 아니라 운영 release artifact다.',
      icon: ShieldCheck,
    },
  ], [actionShare, capacity, fnCost, positives, prevalence]);

  return (
    <LabFrame
      eyebrow="Rare-event decision lab"
      title="불균형 비율만으로 대응법을 고르지 않는다"
      dataAttribute="data-rare-event-decision-lab"
      footer="추천 문구는 교육용 진단이다. 실제 threshold는 고정된 OOF 또는 calibration evidence에서 업무 비용과 처리 용량을 계산해 선택한다."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {[
          { label: '양성률', value: prevalence, setValue: setPrevalence, min: 0.2, max: 10, step: 0.2, suffix: '%' },
          { label: '하루 검토 용량', value: capacity, setValue: setCapacity, min: 20, max: 1000, step: 20, suffix: '건' },
          { label: '미탐 상대 비용', value: fnCost, setValue: setFnCost, min: 1, max: 50, step: 1, suffix: '×' },
        ].map((control) => (
          <label key={control.label} className="block">
            <span className="flex items-center justify-between gap-3 text-xs font-semibold">
              {control.label}
              <span className="font-mono text-blue-700 dark:text-blue-300">{control.value}{control.suffix}</span>
            </span>
            <input
              aria-label={control.label}
              className="mt-2 w-full accent-blue-600"
              type="range"
              min={control.min}
              max={control.max}
              step={control.step}
              value={control.value}
              onChange={(event) => control.setValue(Number(event.target.value))}
            />
          </label>
        ))}
      </div>
      <div className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {recommendations.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="min-w-0 bg-background p-4">
              <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <p className="mt-3 text-xs font-bold">{item.label}</p>
              <p className="mt-1 text-sm font-semibold leading-snug text-blue-700 dark:text-blue-300">{item.value}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.note}</p>
            </div>
          );
        })}
      </div>
    </LabFrame>
  );
}

type ResampleBoundary = 'before' | 'inside';

export function ResamplingBoundaryLab() {
  const [boundary, setBoundary] = useState<ResampleBoundary>('before');
  const leaky = boundary === 'before';

  return (
    <LabFrame
      eyebrow="Resampling boundary lab"
      title="합성 표본을 만드는 위치가 평가의 의미를 바꾼다"
      dataAttribute="data-resampling-boundary-lab"
      footer="Validation과 test는 자연 prevalence와 실제 생성 과정을 유지한다. Sampler는 estimator와 함께 각 fold의 train 부분에만 fit_resample된다."
    >
      <SegmentedControl
        label="Resampling 위치"
        options={[
          { value: 'before', label: 'Split 전에 전체 적용' },
          { value: 'inside', label: 'Fold train 안에서 적용' },
        ]}
        value={boundary}
        onChange={setBoundary}
      />
      <div className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
        {[
          {
            label: '원 데이터',
            value: '양성 1%',
            icon: Database,
            status: 'neutral',
          },
          {
            label: leaky ? '전체 SMOTE' : 'Split manifest',
            value: leaky ? '양성 50%' : 'Group/time 고정',
            icon: leaky ? AlertTriangle : Split,
            status: leaky ? 'bad' : 'good',
          },
          {
            label: leaky ? 'Train · Val' : 'Fold train만',
            value: leaky ? '둘 다 합성 영향' : 'Sampler fit_resample',
            icon: GitBranch,
            status: leaky ? 'bad' : 'good',
          },
          {
            label: 'Validation',
            value: leaky ? '운영 분포 아님' : '자연 양성률 1%',
            icon: leaky ? XCircle : BadgeCheck,
            status: leaky ? 'bad' : 'good',
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="min-w-0 bg-background p-4">
              <Icon className={`h-4 w-4 ${
                item.status === 'bad'
                  ? 'text-rose-600'
                  : item.status === 'good'
                    ? 'text-emerald-600'
                    : 'text-muted-foreground'
              }`} aria-hidden="true" />
              <p className="mt-3 text-xs font-bold">{item.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.value}</p>
            </div>
          );
        })}
      </div>
      <div className={`mt-4 flex items-start gap-3 border-l-2 px-3 py-2 text-sm leading-relaxed ${
        leaky ? 'border-rose-500 text-rose-800 dark:text-rose-200' : 'border-emerald-500 text-emerald-800 dark:text-emerald-200'
      }`}>
        {leaky ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />}
        <p>
          {leaky
            ? '합성 이웃과 바뀐 prevalence가 validation까지 침범한다. 성능이 낙관적이고 운영 precision을 해석할 수 없다.'
            : '각 fold의 validation은 손대지 않는다. Train sampler의 효과를 실제 자연 분포에서 비교할 수 있다.'}
        </p>
      </div>
    </LabFrame>
  );
}
