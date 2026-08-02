import { useMemo, useState, type KeyboardEvent } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Check,
  CircleDot,
  Gauge,
  Layers3,
  Shuffle,
  TriangleAlert,
} from 'lucide-react';

function moveTabFocus<Key extends string>(
  event: KeyboardEvent<HTMLButtonElement>,
  keys: readonly Key[],
  current: Key,
  onSelect: (key: Key) => void,
) {
  const currentIndex = keys.indexOf(current);
  let nextIndex: number | undefined;
  if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % keys.length;
  if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + keys.length) % keys.length;
  if (event.key === 'Home') nextIndex = 0;
  if (event.key === 'End') nextIndex = keys.length - 1;
  if (nextIndex === undefined) return;

  event.preventDefault();
  onSelect(keys[nextIndex]);
  const tabs = event.currentTarget
    .closest('[role="tablist"]')
    ?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
  tabs?.[nextIndex]?.focus();
}

type SeriesKey = 'new' | 'seasonal' | 'velocity';

const seriesFixtures: Record<SeriesKey, {
  label: string;
  history: number[];
  category: string;
  known: string;
  state: string;
  transfer: string;
}> = {
  new: {
    label: '신상품',
    history: [0, 0, 0, 3, 1],
    category: '생활용품',
    known: '출시 후 age · 다음 주 promotion',
    state: '짧은 history에서 만든 hᵢ,ₜ',
    transfer: '다른 상품에서 배운 주기·가격 반응은 공유하되 이 상품의 최근 3→1 흐름은 상태에 남긴다.',
  },
  seasonal: {
    label: '주기 상품',
    history: [12, 19, 13, 21, 14],
    category: '주말 식품',
    known: 'week-of-year · 휴일 여부',
    state: '반복 주기를 압축한 hᵢ,ₜ',
    transfer: '여러 식품에서 반복된 주말 패턴을 공유 parameter로 배우고 현재 상품의 위상은 history로 맞춘다.',
  },
  velocity: {
    label: '고판매 상품',
    history: [910, 1180, 940, 1260, 1020],
    category: '대량 소비재',
    known: '가격 · 재고 계획 · promotion',
    state: '큰 scale을 정규화한 hᵢ,ₜ',
    transfer: '공유 model을 그대로 쓰되 νᵢ로 수치 범위를 맞추고 training window 노출을 높인다.',
  },
};
const seriesKeys = Object.keys(seriesFixtures) as SeriesKey[];

export function GlobalSeriesLab() {
  const [series, setSeries] = useState<SeriesKey>('new');
  const selected = seriesFixtures[series];
  const max = Math.max(...selected.history, 1);

  return (
    <figure data-deepar-global-lab className="not-prose my-8 border-y border-border">
      <header className="flex flex-col gap-4 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Global model lab · 교육용 series</p>
          <p className="mt-1 text-sm font-black">공유하는 것과 상품마다 달라지는 것을 분리한다</p>
        </div>
        <div role="tablist" aria-label="시계열 유형" className="grid grid-cols-3 gap-1">
          {seriesKeys.map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              id={`deepar-series-tab-${key}`}
              aria-controls="deepar-series-panel"
              aria-selected={series === key}
              tabIndex={series === key ? 0 : -1}
              onClick={() => setSeries(key)}
              onKeyDown={(event) => moveTabFocus(event, seriesKeys, key, setSeries)}
              className={`min-h-11 rounded-md border px-2 text-xs font-bold sm:px-3 ${
                series === key ? 'border-foreground bg-foreground text-background' : 'border-border hover:bg-muted'
              }`}
            >
              {seriesFixtures[key].label}
            </button>
          ))}
        </div>
      </header>

      <div
        id="deepar-series-panel"
        role="tabpanel"
        aria-labelledby={`deepar-series-tab-${series}`}
        tabIndex={0}
        className="grid gap-px border border-border bg-border lg:grid-cols-[minmax(0,0.9fr)_3rem_minmax(0,1.1fr)]"
      >
        <div className="min-w-0 bg-background p-4 sm:p-5">
          <p className="text-xs font-semibold text-muted-foreground">Item-specific evidence</p>
          <p className="mt-2 text-sm font-black">{selected.category}</p>
          <div className="mt-5 grid h-28 grid-cols-5 items-end gap-2" aria-label={`${selected.label} 관측 history`}>
            {selected.history.map((value, index) => (
              <div key={`${value}-${index}`} className="flex min-w-0 flex-col items-center justify-end gap-2">
                <span className="font-mono text-xs font-bold">{value}</span>
                <span
                  className="w-full max-w-9 rounded-t-sm bg-blue-600/75"
                  style={{ height: `${Math.max(6, (value / max) * 72)}px` }}
                />
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{selected.known}</p>
        </div>

        <div className="flex min-h-12 items-center justify-center bg-background text-muted-foreground">
          <ArrowDown className="size-4 lg:hidden" aria-hidden="true" />
          <ArrowRight className="hidden size-4 lg:block" aria-hidden="true" />
        </div>

        <div className="min-w-0 bg-background p-4 sm:p-5">
          <p className="text-xs font-semibold text-muted-foreground">Shared across related series</p>
          <div className="mt-4 divide-y divide-border border-y border-border">
            {[
              ['Category embedding', '상품군의 공통 행동을 입력으로 바꾼다.'],
              ['LSTM parameters Θ', 'History와 covariate를 state로 갱신하는 규칙을 공유한다.'],
              ['Likelihood head', '다음 값의 평균·분산 parameter를 만드는 규칙을 공유한다.'],
            ].map(([owner, body]) => (
              <div key={owner} className="grid gap-1 py-3 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
                <p className="text-xs font-black text-blue-700 dark:text-blue-300">{owner}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs font-bold">{selected.state}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{selected.transfer}</p>
        </div>
      </div>

      <figcaption className="flex gap-2 py-4 text-xs leading-relaxed text-muted-foreground">
        <Layers3 className="mt-0.5 size-4 shrink-0 text-blue-600" aria-hidden="true" />
        Global은 모든 상품의 forecast가 같다는 뜻이 아니다. 갱신 규칙 Θ를 공유하고, 각 상품의 history·feature·hidden state를 조건으로 서로 다른 분포를 만든다.
      </figcaption>
    </figure>
  );
}

type TraceMode = 'training' | 'prediction';
const traceModes = [
  ['training', '학습'],
  ['prediction', '예측'],
] as const;

const observed = [8, 11, 9, 13];
const trainingSeed = 6;
const samplePaths = [
  [12, 15, 14, 18],
  [10, 9, 13, 12],
  [14, 17, 19, 21],
];

export function AutoregressiveTraceLab() {
  const [mode, setMode] = useState<TraceMode>('prediction');
  const [step, setStep] = useState(0);
  const previous = mode === 'training'
    ? step === 0 ? trainingSeed : observed[step - 1]
    : step === 0 ? observed[observed.length - 1] : samplePaths[0][step - 1];

  return (
    <figure data-deepar-trace-lab className="not-prose my-8 border-y border-border">
      <header className="flex flex-col gap-4 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Autoregressive trace · 교육용 값</p>
          <p className="mt-1 text-sm font-black">다음 step의 입력이 어디에서 왔는지 추적한다</p>
        </div>
        <div role="tablist" aria-label="DeepAR 실행 모드" className="grid grid-cols-2 gap-1">
          {traceModes.map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              id={`deepar-trace-tab-${key}`}
              aria-controls="deepar-trace-panel"
              aria-selected={mode === key}
              tabIndex={mode === key ? 0 : -1}
              onClick={() => {
                setMode(key);
                setStep(0);
              }}
              onKeyDown={(event) => moveTabFocus(
                event,
                traceModes.map(([traceMode]) => traceMode),
                key,
                (nextMode) => {
                  setMode(nextMode);
                  setStep(0);
                },
              )}
              className={`min-h-11 rounded-md border px-4 text-xs font-bold ${
                mode === key ? 'border-foreground bg-foreground text-background' : 'border-border hover:bg-muted'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <div
        id="deepar-trace-panel"
        role="tabpanel"
        aria-labelledby={`deepar-trace-tab-${mode}`}
        tabIndex={0}
      >
      <div className="grid grid-cols-4 border border-border" role="group" aria-label="예측 step">
        {[0, 1, 2, 3].map((index) => (
          <button
            key={index}
            type="button"
            onClick={() => setStep(index)}
            aria-pressed={step === index}
            className={`min-h-11 border-b-2 px-1 font-mono text-xs font-bold ${
              step === index ? 'border-blue-600 bg-blue-500/[0.07]' : 'border-transparent hover:bg-muted/30'
            }`}
          >
            t+{index + 1}
          </button>
        ))}
      </div>

      <div className="grid gap-px bg-border lg:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)_3rem_minmax(0,1fr)]">
        {[
          {
            label: '입력',
            title: `직전 z = ${previous}`,
            body: mode === 'training'
              ? step === 0
                ? '이 구간 직전의 관측값을 state 계산에 넣는다.'
                : '직전 step의 정답 관측값을 state 계산에 넣는다.'
              : step === 0
                ? 'Conditioning range의 마지막 관측값을 넣는다.'
                : '직전 step에서 뽑은 첫 sample을 다시 넣는다.',
          },
          {
            label: '공유 network',
            title: `hᵢ,t+${step + 1} 갱신`,
            body: '이전 hidden state, 직전 target, 현재 covariate를 공유 LSTM Θ에 통과시킨다.',
          },
          {
            label: mode === 'training' ? 'Likelihood score' : '분포에서 추출',
            title: mode === 'training' ? `정답 z = ${observed[step]}` : `3개 path · step ${step + 1}`,
            body: mode === 'training'
              ? '정답값의 log likelihood가 커지도록 Θ를 업데이트한다.'
              : '각 path는 자기 sample을 다음 step에 되먹여 시간 상관을 보존한다.',
          },
        ].map((item, index) => (
          <div key={item.label} className="contents">
            {index > 0 && (
              <div className="flex min-h-11 items-center justify-center bg-background text-muted-foreground">
                <ArrowDown className="size-4 lg:hidden" aria-hidden="true" />
                <ArrowRight className="hidden size-4 lg:block" aria-hidden="true" />
              </div>
            )}
            <div className="min-w-0 bg-background p-4">
              <p className="text-xs font-semibold text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-sm font-black">{item.title}</p>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          </div>
        ))}
      </div>

      {mode === 'prediction' && (
        <div className="divide-y divide-border border-y border-border py-1">
          {samplePaths.map((path, pathIndex) => (
            <div key={pathIndex} className="grid grid-cols-[4rem_repeat(4,minmax(0,1fr))] items-center gap-1 py-2">
              <p className="text-xs font-bold text-muted-foreground">path {pathIndex + 1}</p>
              {path.map((value, index) => (
                <span
                  key={`${value}-${index}`}
                  className={`grid min-h-9 place-items-center rounded-sm border font-mono text-xs font-bold ${
                    index === step ? 'border-blue-600 bg-blue-500/10' : 'border-border'
                  }`}
                >
                  {value}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
      </div>

      <figcaption className="flex gap-2 py-4 text-xs leading-relaxed text-muted-foreground">
        <CircleDot className="mt-0.5 size-4 shrink-0 text-blue-600" aria-hidden="true" />
        {mode === 'training'
          ? '학습에서는 prediction range도 과거에 놓아 정답을 알고 있으므로 teacher-forced likelihood를 직접 최적화한다.'
          : '예측에서는 하나의 값으로 접지 않는다. 이 과정을 반복해 얻은 여러 path가 horizon 전체의 joint predictive distribution을 이룬다.'}
      </figcaption>
    </figure>
  );
}

type ScaleKey = 'low' | 'high';

const scaleFixtures: Record<ScaleKey, {
  label: string;
  mean: number;
  latest: number;
  normalized: string;
  restored: string;
  exposure: string;
}> = {
  low: {
    label: '저판매',
    mean: 1,
    latest: 2,
    normalized: '2 ÷ 2 = 1.00',
    restored: 'softplus output × 2',
    exposure: '상대 노출 1×',
  },
  high: {
    label: '고판매',
    mean: 2000,
    latest: 2300,
    normalized: '2,300 ÷ 2,001 ≈ 1.15',
    restored: 'softplus output × 2,001',
    exposure: '상대 노출 약 1,000×',
  },
};
const scaleKeys = Object.keys(scaleFixtures) as ScaleKey[];

export function ScaleSamplingLab() {
  const [series, setSeries] = useState<ScaleKey>('high');
  const selected = scaleFixtures[series];
  const nu = 1 + selected.mean;
  const exposure = useMemo(() => Math.min(100, Math.max(8, (nu / 2001) * 100)), [nu]);

  return (
    <figure data-deepar-scale-lab className="not-prose my-8 border-y border-border">
      <header className="flex flex-col gap-4 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Scale handling · 교육용 fixture</p>
          <p className="mt-1 text-sm font-black">같은 network 범위로 넣고 원래 단위로 되돌린다</p>
        </div>
        <div role="tablist" aria-label="판매 scale" className="grid grid-cols-2 gap-1">
          {scaleKeys.map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              id={`deepar-scale-tab-${key}`}
              aria-controls="deepar-scale-panel"
              aria-selected={series === key}
              tabIndex={series === key ? 0 : -1}
              onClick={() => setSeries(key)}
              onKeyDown={(event) => moveTabFocus(event, scaleKeys, key, setSeries)}
              className={`min-h-11 rounded-md border px-4 text-xs font-bold ${
                series === key ? 'border-foreground bg-foreground text-background' : 'border-border hover:bg-muted'
              }`}
            >
              {scaleFixtures[key].label}
            </button>
          ))}
        </div>
      </header>

      <div
        id="deepar-scale-panel"
        role="tabpanel"
        aria-labelledby={`deepar-scale-tab-${series}`}
        tabIndex={0}
      >
      <div className="divide-y divide-border border-y border-border">
        {[
          ['01 · scale 계산', `νᵢ = 1 + 평균 = ${nu.toLocaleString()}`, 'Conditioning range의 item별 평균으로 대략적인 크기를 잡는다.'],
          ['02 · network 입력', selected.normalized, '큰 상품과 작은 상품을 LSTM nonlinearity의 비슷한 작동 범위에 넣는다.'],
          ['03 · 분포 복원', selected.restored, 'Likelihood mean은 원래 판매 단위로 돌리고 NB shape는 √νᵢ로 조정한다.'],
          ['04 · window 선택', selected.exposure, 'P(i)∝νᵢ라서 high-velocity series를 더 자주 본다. 정확도 목표에 넣은 heuristic이다.'],
        ].map(([label, value, note]) => (
          <div key={label} className="grid gap-2 py-4 sm:grid-cols-[9rem_minmax(0,0.8fr)_minmax(0,1.2fr)] sm:items-center sm:gap-4">
            <p className="text-xs font-black text-muted-foreground">{label}</p>
            <p className="break-words font-mono text-sm font-black">{value}</p>
            <p className="text-xs leading-relaxed text-muted-foreground">{note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 py-5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:items-center">
        <div>
          <p className="font-mono text-2xl font-black">{Math.round(exposure)}%</p>
          <p className="mt-1 text-xs text-muted-foreground">교육용 노출 막대</p>
        </div>
        <div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-amber-500" style={{ width: `${exposure}%` }} />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            이 막대는 원문 dataset 분포가 아니라 P(i)∝νᵢ의 방향을 보여 주는 fixture다. Sampling은 network scale 보정과 별개의 선택이다.
          </p>
        </div>
      </div>
      </div>

      <figcaption className="flex gap-2 pb-5 text-xs leading-relaxed text-muted-foreground">
        <Gauge className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden="true" />
        νᵢ는 수학적으로 유일한 정답이 아니다. 논문도 missing data나 item 내부 분산이 클 때 적절한 scale 선택이 어렵다고 명시한다.
      </figcaption>
    </figure>
  );
}

type EvidenceKey = 'retail' | 'public' | 'correlation' | 'missing';

const evidenceLabels: Record<EvidenceKey, string> = {
  retail: 'Retail risk',
  public: '공개 dataset',
  correlation: 'Path 상관',
  missing: '결측값',
};
const evidenceKeys = Object.keys(evidenceLabels) as EvidenceKey[];

export function DeepAREvidenceLab() {
  const [view, setView] = useState<EvidenceKey>('retail');

  return (
    <figure data-deepar-evidence-lab className="not-prose my-8 border-y border-border">
      <header className="grid grid-cols-2 border-x border-border sm:grid-cols-4" role="tablist" aria-label="DeepAR 원문 근거">
        {evidenceKeys.map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            id={`deepar-evidence-tab-${key}`}
            aria-controls="deepar-evidence-panel"
            aria-selected={view === key}
            tabIndex={view === key ? 0 : -1}
            onClick={() => setView(key)}
            onKeyDown={(event) => moveTabFocus(event, evidenceKeys, key, setView)}
            className={`min-h-12 border-b-2 px-2 text-xs font-bold ${
              view === key ? 'border-foreground bg-muted/35' : 'border-transparent text-muted-foreground hover:bg-muted/20'
            }`}
          >
            {evidenceLabels[key]}
          </button>
        ))}
      </header>

      {view === 'retail' && (
        <div id="deepar-evidence-panel" role="tabpanel" aria-labelledby="deepar-evidence-tab-retail" tabIndex={0} className="py-5">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Table 1 · 가장 강한 기존 방법을 1.00으로 둔 상대 0.5/0.9-risk의 전체 평균. 낮을수록 좋다.
          </p>
          <div className="mt-4 divide-y divide-border border-y border-border">
            {[
              ['parts', '0.94', 'Power-law가 두드러지지 않은 dataset'],
              ['ec-sub', '0.77', '39,700개 주간 판매 series'],
              ['ec', '0.85', '534,884개 주간 판매 series'],
            ].map(([dataset, value, note]) => (
              <div key={dataset} className="grid grid-cols-[5rem_4rem_minmax(0,1fr)] items-center gap-3 py-3">
                <p className="font-mono text-xs font-bold">{dataset}</p>
                <p className="font-mono text-lg font-black text-emerald-700 dark:text-emerald-300">{value}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">{note}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            이 숫자는 각 span의 상대 risk 평균이다. 절대 오차 23% 감소나 모든 retail dataset의 보편 개선율로 바꾸면 안 된다.
          </p>
        </div>
      )}

      {view === 'public' && (
        <div id="deepar-evidence-panel" role="tabpanel" aria-labelledby="deepar-evidence-tab-public" tabIndex={0} className="py-5">
          <p className="text-xs leading-relaxed text-muted-foreground">Table 2 · DeepAR와 MatFact의 point forecast 비교.</p>
          <div className="mt-4 divide-y divide-border border-y border-border">
            {[
              ['electricity', 'MatFact', 'ND 0.16 · RMSE 1.15'],
              ['electricity', 'DeepAR', 'ND 0.07 · RMSE 1.00'],
              ['traffic', 'MatFact', 'ND 0.20 · RMSE 0.43'],
              ['traffic', 'DeepAR', 'ND 0.17 · RMSE 0.42'],
            ].map(([dataset, model, score]) => (
              <div key={`${dataset}-${model}`} className="grid gap-1 py-3 sm:grid-cols-[7rem_6rem_minmax(0,1fr)] sm:gap-4">
                <p className="font-mono text-xs font-bold">{dataset}</p>
                <p className={`text-xs font-black ${model === 'DeepAR' ? 'text-emerald-700 dark:text-emerald-300' : ''}`}>{model}</p>
                <p className="font-mono text-xs text-muted-foreground">{score}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Electricity와 traffic은 rolling window로 평가했지만 window마다 model을 재학습하지 않고 첫 prediction 전 data로 학습한 한 model을 재사용했다.
          </p>
        </div>
      )}

      {view === 'correlation' && (
        <div id="deepar-evidence-panel" role="tabpanel" aria-labelledby="deepar-evidence-tab-correlation" tabIndex={0} className="py-5">
          <div className="flex gap-3 border-l-2 border-blue-600 bg-blue-500/[0.04] px-4 py-4">
            <Shuffle className="mt-0.5 size-5 shrink-0 text-blue-600" aria-hidden="true" />
            <div>
              <p className="text-sm font-black">Figure 5 · sample path를 시간별로 섞는 반증 실험</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                한 시점 span에서는 marginal distribution이 같아 영향이 없다. 9개 시점이 들어간 긴 span에서는 시간 상관이 깨져 calibration이 나빠지고 shuffled forecast의 0.9-risk가 10% 높아졌다.
              </p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)] items-center gap-3">
            <div className="min-w-0">
              <p className="text-xs font-black">path를 먼저 합산</p>
              <p className="mt-2 font-mono text-xs text-muted-foreground">[12+15+14+…] × 200</p>
            </div>
            <ArrowRight className="mx-auto size-4 text-muted-foreground" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-xs font-black">합계 분포의 q₀.₉</p>
              <p className="mt-2 text-xs text-muted-foreground">시간 상관을 유지한 재고 기준</p>
            </div>
          </div>
        </div>
      )}

      {view === 'missing' && (
        <div id="deepar-evidence-panel" role="tabpanel" aria-labelledby="deepar-evidence-tab-missing" tabIndex={0} className="py-5">
          <div className="flex gap-3 border-l-2 border-red-600 bg-red-500/[0.04] px-4 py-4">
            <TriangleAlert className="mt-0.5 size-5 shrink-0 text-red-600" aria-hidden="true" />
            <div>
              <p className="text-sm font-black text-red-700 dark:text-red-300">실험 결과 없음</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Appendix는 결측 z를 conditional sample로 대신하고 해당 likelihood term을 제외하는 방법을 제안한다. 그러나 비교 가능한 adjusted metric이 어렵다는 이유로 이 설정의 실험 결과를 논문에서 생략했다.
              </p>
            </div>
          </div>
          <p className="mt-5 flex gap-2 text-xs leading-relaxed text-muted-foreground">
            <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />
            따라서 out-of-stock 결측이 있는 운영 release에는 별도 censoring 가정, replay dataset과 calibration evidence가 필요하다.
          </p>
        </div>
      )}

      <figcaption className="border-t border-border py-4 text-xs leading-relaxed text-muted-foreground">
        <strong className="text-foreground">읽는 법.</strong> 논문 안에서도 숫자가 답하는 질문은 다르다. Relative risk, point metric, correlation ablation과 미검증 제안을 한 줄의 “성능 향상”으로 합치지 않는다.
      </figcaption>
    </figure>
  );
}
