import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, TriangleAlert } from 'lucide-react';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  {
    label: '모델보다 먼저 24-step 예측 계약을 고정한다',
    body: '각 origin에서 그 시점까지 공개된 정보만 사용하고, 운영에서 필요한 24개 미래 시점을 모두 채점한다.',
  },
  {
    label: '관측된 문제마다 서로 다른 처리를 연결한다',
    body: '분산 증가, 계절성, 추세, 영구 level shift는 같은 비정상성처럼 보여도 해결 도구가 다르다. 신호를 켜고 끄며 처리가 어떻게 달라지는지 확인한다.',
  },
  {
    label: 'ACF와 PACF는 p·q 후보만 좁힌다',
    body: '표본 수가 바뀌면 근사 95% 기준선도 달라진다. 막대 하나가 선을 넘는다는 사실만으로 차수를 확정하지 않는다.',
  },
  {
    label: '같은 학습 창에서 AICc로 작은 후보군을 선별한다',
    body: '변환과 d·D가 같은 후보만 비교한다. AICc 최저 후보는 다음 진단으로 갈 우선순위이지 출시 승자가 아니다.',
  },
  {
    label: '잔차의 실패 종류에 따라 되돌아갈 위치가 달라진다',
    body: '자기상관은 빠진 lag, 이분산은 변환·구간 가정, level shift는 intervention이나 학습 창을 다시 보라는 신호다.',
  },
  {
    label: '실제 horizon에서 단순 기준선을 이겨야 채택한다',
    body: 'h=1에서 이겨도 h=24에서 seasonal-naive에 지면 출시하지 않는다. 잔차 진단도 통과해야 조건부 채택할 수 있다.',
  },
];

type SignalKey = 'variance' | 'seasonality' | 'trend' | 'levelShift';
type CorrelationKind = 'ar' | 'ma' | 'mixed';
type ResidualKind = 'white' | 'autocorrelation' | 'heteroscedasticity' | 'break';

const SIGNALS: Array<{ key: SignalKey; label: string; detail: string }> = [
  { key: 'variance', label: '분산 증가', detail: '수준이 커질수록 흔들림도 커짐' },
  { key: 'seasonality', label: '12개월 계절성', detail: '같은 달의 반복 패턴' },
  { key: 'trend', label: '남은 추세', detail: '계절 차분 뒤에도 평균 이동' },
  { key: 'levelShift', label: '영구 level shift', detail: '정책 이후 중심이 한 번 점프' },
];

const CORRELATIONS: Record<CorrelationKind, { acf: number[]; pacf: number[]; candidates: string[] }> = {
  ar: {
    acf: [0.68, 0.43, 0.27, 0.16, 0.08, 0.03],
    pacf: [0.68, 0.09, -0.03, 0.02, -0.05, 0.01],
    candidates: ['ARIMA(1,d,0)', 'ARIMA(2,d,0)', 'ARIMA(1,d,1)'],
  },
  ma: {
    acf: [0.62, 0.08, -0.04, 0.03, -0.02, 0.01],
    pacf: [0.62, 0.35, 0.19, 0.11, 0.06, 0.03],
    candidates: ['ARIMA(0,d,1)', 'ARIMA(0,d,2)', 'ARIMA(1,d,1)'],
  },
  mixed: {
    acf: [0.61, 0.34, 0.18, 0.09, -0.04, -0.08],
    pacf: [0.58, 0.29, 0.13, -0.08, 0.05, -0.03],
    candidates: ['ARIMA(1,d,1)', 'ARIMA(2,d,1)', 'ARIMA(1,d,2)'],
  },
};

const RESIDUALS: Record<ResidualKind, {
  label: string;
  pValue: number;
  coverage: number;
  next: string;
}> = {
  white: { label: '백색잡음에 가까움', pValue: 0.42, coverage: 94, next: '바깥 24-step 검증으로 이동' },
  autocorrelation: { label: 'lag 구조가 남음', pValue: 0.01, coverage: 88, next: 'p·q 또는 계절항을 다시 제안' },
  heteroscedasticity: { label: '분산이 시간에 따라 변함', pValue: 0.31, coverage: 76, next: '변환과 구간 모형을 다시 점검' },
  break: { label: 'level shift가 남음', pValue: 0.02, coverage: 69, next: 'step 변수 또는 post-break 창을 비교' },
};

function RollingContract() {
  return (
    <div data-arima-contract className="w-full min-w-0">
      <div className="grid grid-cols-12 gap-1" aria-label="rolling-origin 24-step 평가 개념도">
        {Array.from({ length: 12 }, (_, index) => (
          <div
            key={index}
            className={`h-16 rounded-sm border ${index < 8 ? 'border-blue-600/20 bg-blue-500/10' : 'border-amber-600/25 bg-amber-500/10'}`}
          />
        ))}
      </div>
      <div className="mt-3 grid min-w-0 gap-2 text-sm sm:grid-cols-2">
        <div className="border-l-2 border-blue-600 pl-3">
          <p className="font-bold text-foreground">각 origin 이전</p>
          <p className="mt-1 text-muted-foreground">변환·차분·break 처리·차수 선택을 다시 적합</p>
        </div>
        <div className="border-l-2 border-amber-600 pl-3">
          <p className="font-bold text-foreground">origin 이후 24 step</p>
          <p className="mt-1 text-muted-foreground">학습에서 보지 않고 horizon별 오차와 구간 포함률을 채점</p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-border bg-border text-center">
        {['O₁', 'O₂', 'O₃'].map((origin, index) => (
          <div key={origin} className="bg-background px-2 py-4">
            <p className="font-mono text-lg font-black">{origin}</p>
            <p className="mt-1 text-xs text-muted-foreground">과거 {96 + index * 12}개월 → 미래 24개월</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SignalTreatment({
  signals,
  onToggle,
}: {
  signals: Record<SignalKey, boolean>;
  onToggle: (key: SignalKey) => void;
}) {
  const values = useMemo(() => Array.from({ length: 24 }, (_, index) => {
    const seasonal = signals.seasonality ? [0, 3, 7, 5, 2, -1, -4, -3, 0, 4, 7, 3][index % 12] : 0;
    const trend = signals.trend ? index * 0.65 : 0;
    const shift = signals.levelShift && index >= 13 ? 11 : 0;
    const variance = signals.variance ? 1 + index / 34 : 1;
    return (24 + seasonal + trend + shift) * variance;
  }), [signals]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const treatments = [
    signals.variance && '① log/Box–Cox로 변동 폭 안정화',
    signals.seasonality && '② lag 12 계절 차분 D=1 후보',
    signals.trend && '③ 그래도 평균 이동이 남으면 d=1 후보',
    signals.levelShift && '④ step 변수 또는 post-break 학습 창',
  ].filter(Boolean) as string[];

  return (
    <div data-arima-treatment-lab className="grid w-full min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.9fr)]">
      <div className="min-w-0">
        <div className="flex h-40 items-end gap-1 border-b border-border px-1" aria-label="선택한 신호가 반영된 예시 시계열">
          {values.map((value, index) => (
            <div
              key={index}
              className={`min-w-0 flex-1 rounded-t-sm ${index >= 13 && signals.levelShift ? 'bg-rose-500/65' : 'bg-blue-500/55'}`}
              style={{ height: `${24 + ((value - min) / Math.max(1, max - min)) * 70}%` }}
              title={`t=${index + 1}, 값=${value.toFixed(1)}`}
            />
          ))}
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          파란 막대는 일반 구간, 장밋빛 막대는 정책 이후 level shift 예시다. 높이는 설명용 fixture다.
        </p>
      </div>
      <div className="grid min-w-0 gap-3">
        <div className="grid grid-cols-2 gap-2">
          {SIGNALS.map((signal) => (
            <button
              key={signal.key}
              type="button"
              aria-pressed={signals[signal.key]}
              onClick={() => onToggle(signal.key)}
              className={`min-h-14 min-w-0 rounded-md border px-3 py-2 text-left transition-colors ${
                signals[signal.key]
                  ? 'border-blue-600/45 bg-blue-500/[0.07] text-foreground'
                  : 'border-border text-muted-foreground'
              }`}
            >
              <span className="block break-words text-sm font-bold">{signal.label}</span>
              <span className="mt-1 block break-words text-xs leading-snug">{signal.detail}</span>
            </button>
          ))}
        </div>
        <div data-arima-treatment-result className="border-y border-border py-3">
          <p className="text-xs font-bold text-muted-foreground">권장 처리 순서</p>
          {treatments.length > 0 ? treatments.map((treatment) => (
            <p key={treatment} className="mt-2 text-sm font-semibold leading-relaxed text-foreground">{treatment}</p>
          )) : <p className="mt-2 text-sm font-semibold text-foreground">변환·차분 없음부터 시작</p>}
        </div>
        {signals.levelShift && (
          <p className="flex gap-2 text-sm leading-relaxed text-rose-700 dark:text-rose-300">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            level shift는 차분 횟수를 늘려 지우는 문제가 아니다.
          </p>
        )}
      </div>
    </div>
  );
}

function CorrelationBars({
  label,
  values,
  band,
  tone,
}: {
  label: string;
  values: number[];
  band: number;
  tone: 'blue' | 'teal';
}) {
  const color = tone === 'blue' ? 'bg-blue-600' : 'bg-teal-600';
  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-end justify-between gap-2">
        <p className="font-mono text-sm font-black text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">기준 ±{band.toFixed(2)}</p>
      </div>
      <div className="relative h-44 overflow-hidden rounded-md border border-border bg-background">
        <div
          className="absolute inset-x-0 bg-blue-500/[0.07]"
          style={{ top: `${50 - band * 45}%`, height: `${band * 90}%` }}
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 top-1/2 border-t border-muted-foreground/55" aria-hidden="true" />
        <div className="absolute inset-0 grid grid-cols-6 gap-2 px-3">
          {values.map((value, index) => (
            <div key={index} className="relative min-w-0">
              <div
                className={`absolute left-1/2 w-3 -translate-x-1/2 rounded-sm ${color}`}
                style={value >= 0
                  ? { bottom: '50%', height: `${Math.abs(value) * 45}%` }
                  : { top: '50%', height: `${Math.abs(value) * 45}%` }}
              />
              <span className="absolute inset-x-0 bottom-1 text-center text-xs font-bold text-muted-foreground">{index + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CorrelationLab({
  kind,
  onKind,
  sampleSize,
  onSampleSize,
}: {
  kind: CorrelationKind;
  onKind: (kind: CorrelationKind) => void;
  sampleSize: number;
  onSampleSize: (size: number) => void;
}) {
  const profile = CORRELATIONS[kind];
  const band = 1.96 / Math.sqrt(sampleSize);
  return (
    <div data-arima-correlation-lab className="w-full min-w-0">
      <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_13rem] sm:items-end">
        <div className="grid grid-cols-3 gap-2">
          {([
            ['ar', 'AR형'],
            ['ma', 'MA형'],
            ['mixed', '혼합형'],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={kind === value}
              onClick={() => onKind(value)}
              className={`h-11 rounded-md border px-2 text-sm font-bold ${kind === value ? 'border-blue-600 bg-blue-500/[0.07]' : 'border-border text-muted-foreground'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="grid gap-1 text-sm font-semibold">
          <span className="flex justify-between gap-2"><span>표본 수 n</span><output className="font-mono font-black">{sampleSize}</output></span>
          <input
            aria-label="ACF 표본 수"
            className="h-11 w-full accent-blue-600"
            type="range"
            min="64"
            max="400"
            step="16"
            value={sampleSize}
            onChange={(event) => onSampleSize(Number(event.target.value))}
          />
        </label>
      </div>
      <div className="mt-5 grid min-w-0 gap-4 sm:grid-cols-2">
        <CorrelationBars label="ACF" values={profile.acf} band={band} tone="blue" />
        <CorrelationBars label="PACF" values={profile.pacf} band={band} tone="teal" />
      </div>
      <p data-arima-band className="mt-3 text-sm leading-relaxed text-muted-foreground">
        백색잡음 가정의 점별 근사선: ±1.96/√{sampleSize} = ±{band.toFixed(3)}. 여러 lag를 동시에 보면 우연한 초과가 생길 수 있다.
      </p>
    </div>
  );
}

function CandidateScene({ kind }: { kind: CorrelationKind }) {
  const candidates = CORRELATIONS[kind].candidates;
  return (
    <div data-arima-candidates className="w-full min-w-0">
      <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
        {candidates.map((candidate, index) => (
          <div key={candidate} className="min-w-0 bg-background px-4 py-5">
            <p className="break-words font-mono text-sm font-black">{candidate}</p>
            <p className="mt-4 text-xs font-bold text-muted-foreground">예시 AICc</p>
            <p className="mt-1 font-mono text-3xl font-black tabular-nums">{(214.1 + index * 2.4).toFixed(1)}</p>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              {index === 0 ? '잔차 진단으로 보낼 우선 후보' : '인접 차수 비교 후보'}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-4 border-l-2 border-amber-600 pl-3 text-sm leading-relaxed text-foreground">
        이 숫자는 동일 변환·동일 차분·동일 학습 창의 후보 순위만 정한다. 24-step 출시 여부는 결정하지 않는다.
      </p>
    </div>
  );
}

function ResidualLab({
  kind,
  onKind,
}: {
  kind: ResidualKind;
  onKind: (kind: ResidualKind) => void;
}) {
  const result = RESIDUALS[kind];
  return (
    <div data-arima-residual-lab className="w-full min-w-0">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {([
          ['white', '백색잡음형'],
          ['autocorrelation', '자기상관'],
          ['heteroscedasticity', '이분산'],
          ['break', 'level shift'],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={kind === value}
            onClick={() => onKind(value)}
            className={`min-h-11 rounded-md border px-2 py-2 text-sm font-bold ${kind === value ? 'border-blue-600 bg-blue-500/[0.07]' : 'border-border text-muted-foreground'}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
        <div className="bg-background p-4">
          <p className="text-xs font-bold text-muted-foreground">관찰</p>
          <p className="mt-2 text-sm font-black">{result.label}</p>
        </div>
        <div className="bg-background p-4">
          <p className="text-xs font-bold text-muted-foreground">Ljung–Box p-value</p>
          <p className="mt-2 font-mono text-2xl font-black">{result.pValue.toFixed(2)}</p>
        </div>
        <div className="bg-background p-4">
          <p className="text-xs font-bold text-muted-foreground">95% 구간 실제 포함률</p>
          <p className="mt-2 font-mono text-2xl font-black">{result.coverage}%</p>
        </div>
      </div>
      <p data-arima-residual-next className="mt-4 border-l-2 border-blue-600 pl-3 text-sm font-semibold leading-relaxed text-foreground">
        다음 행동: {result.next}
      </p>
    </div>
  );
}

function ReleaseLab({
  horizon,
  onHorizon,
  residualKind,
}: {
  horizon: 1 | 24;
  onHorizon: (horizon: 1 | 24) => void;
  residualKind: ResidualKind;
}) {
  const arimaMae = horizon === 1 ? 6.2 : 9.4;
  const baselineMae = horizon === 1 ? 7.1 : 8.6;
  const residualPass = residualKind === 'white';
  const beatsBaseline = arimaMae < baselineMae;
  const diagnosticPass = residualPass && beatsBaseline;
  const releasePass = diagnosticPass;
  return (
    <div data-arima-release-lab className="w-full min-w-0">
      <div className="mb-4 border-l-2 border-amber-600/55 pl-3 text-xs leading-relaxed text-muted-foreground">
        <strong className="text-foreground">교육용 고정 fixture</strong> · 아래 selector가 이번 배포에서 약속한 forecast horizon이다. H=1과 H=24는 서로 다른 제품 계약이므로 같은 MAE 판정으로 합치지 않는다.
      </div>
      <div className="grid grid-cols-2 gap-2 sm:max-w-sm">
        {[1, 24].map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={horizon === value}
            onClick={() => onHorizon(value as 1 | 24)}
            className={`h-11 rounded-md border px-3 text-sm font-bold ${horizon === value ? 'border-blue-600 bg-blue-500/[0.07]' : 'border-border text-muted-foreground'}`}
          >
            h = {value}
          </button>
        ))}
      </div>
      <div className="mt-5 space-y-5">
        {[
          ['ARIMA', arimaMae, 'bg-blue-600'],
          ['Seasonal-naïve', baselineMae, 'bg-amber-600'],
        ].map(([label, value, color]) => (
          <div key={String(label)} className="grid min-w-0 grid-cols-[7.5rem_minmax(0,1fr)_3rem] items-center gap-3 sm:grid-cols-[10rem_minmax(0,1fr)_4rem]">
            <span className="min-w-0 break-words text-sm font-bold">{label}</span>
            <div className="h-3 overflow-hidden rounded-sm bg-border/70">
              <motion.div className={`h-full ${color}`} animate={{ width: `${(Number(value) / 11) * 100}%` }} />
            </div>
            <span className="font-mono text-right text-sm font-black tabular-nums">{value}</span>
          </div>
        ))}
      </div>
      <div className={`mt-6 flex min-w-0 gap-3 border-y py-4 ${releasePass ? 'border-teal-600/35 text-teal-800 dark:text-teal-200' : 'border-rose-600/35 text-rose-800 dark:text-rose-200'}`}>
        {releasePass ? <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> : <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />}
        <div className="min-w-0">
          <p data-diagnostic-decision className="text-xs font-bold">
            선택한 h={horizon} 진단 · {diagnosticPass ? '통과' : '실패'}
          </p>
          <p data-release-decision className="mt-1 font-black">{releasePass ? '조건부 채택' : '출시 보류'}</p>
          <p className="mt-1 text-sm leading-relaxed">
            {!residualPass
              ? `현재 잔차 상태(${RESIDUALS[residualKind].label})를 먼저 해결한다.`
              : !releasePass
                ? `배포 horizon H=${horizon}에서 seasonal-naïve보다 MAE가 높다. 잔차가 깨끗해도 기준선을 이기지 못하면 출시하지 않는다.`
                : `잔차 진단과 배포 horizon H=${horizon}의 기준선 비교를 통과했다. 다른 origin에서도 같은 방향인지 확인한다.`}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ARIMAPipelineViz() {
  const reduceMotion = useReducedMotion();
  const [signals, setSignals] = useState<Record<SignalKey, boolean>>({
    variance: true,
    seasonality: true,
    trend: true,
    levelShift: true,
  });
  const [correlationKind, setCorrelationKind] = useState<CorrelationKind>('mixed');
  const [sampleSize, setSampleSize] = useState(192);
  const [residualKind, setResidualKind] = useState<ResidualKind>('autocorrelation');
  const [horizon, setHorizon] = useState<1 | 24>(24);

  const scenes = [
    <RollingContract key="contract" />,
    <SignalTreatment
      key="treatment"
      signals={signals}
      onToggle={(key) => setSignals((current) => ({ ...current, [key]: !current[key] }))}
    />,
    <CorrelationLab
      key="correlation"
      kind={correlationKind}
      onKind={setCorrelationKind}
      sampleSize={sampleSize}
      onSampleSize={setSampleSize}
    />,
    <CandidateScene key="candidate" kind={correlationKind} />,
    <ResidualLab key="residual" kind={residualKind} onKind={setResidualKind} />,
    <ReleaseLab key="release" horizon={horizon} onHorizon={setHorizon} residualKind={residualKind} />,
  ];

  return (
    <div data-arima-pipeline-lab>
      <StepViz steps={STEPS}>
        {(step) => (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
            className="w-full min-w-0"
          >
            {scenes[step]}
          </motion.div>
        )}
      </StepViz>
    </div>
  );
}
