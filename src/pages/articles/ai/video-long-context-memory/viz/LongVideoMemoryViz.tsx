import { useMemo, useState } from 'react';
import { Archive, ArrowDown, ArrowRight, AudioLines, Film, Gauge, ScanSearch } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

type MemoryMode = 'full' | 'window' | 'tiered';

const durationOptions = [
  { value: 60, label: '1분' },
  { value: 600, label: '10분' },
  { value: 1800, label: '30분' },
];
const fpsOptions = [1, 2, 4];
const spatialTokenOptions = [64, 256, 576];

function formatCount(value: number) {
  return new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 1, notation: 'compact' }).format(value);
}

function formatBytes(value: number) {
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
  let amount = value;
  let unit = 0;
  while (amount >= 1024 && unit < units.length - 1) {
    amount /= 1024;
    unit += 1;
  }
  return `${amount.toLocaleString('ko-KR', { maximumFractionDigits: amount >= 100 ? 0 : amount >= 10 ? 1 : 2 })} ${units[unit]}`;
}

function SegmentedControl<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-[11px] font-bold text-muted-foreground">{label}</legend>
      <div className="grid min-h-11 grid-cols-3 overflow-hidden rounded-md border border-border bg-background">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
            className={`min-h-11 min-w-0 px-2 py-2 text-xs font-semibold transition-colors ${
              value === option.value
                ? 'bg-foreground text-background'
                : 'border-l border-border first:border-l-0 hover:bg-muted'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function TemporalTokenBudgetLab() {
  const [duration, setDuration] = useState(600);
  const [sampleFps, setSampleFps] = useState(2);
  const [spatialTokens, setSpatialTokens] = useState(256);
  const [mode, setMode] = useState<MemoryMode>('tiered');

  const budget = useMemo(() => {
    const frames = duration * sampleFps;
    const totalTokens = frames * spatialTokens;
    const recentFrames = Math.min(frames, 32);
    const recentTokens = recentFrames * spatialTokens;
    const oldTokens = Math.max(0, totalTokens - recentTokens);
    const compressedTokens = Math.ceil(oldTokens * 0.02);
    const retrievedTokens = Math.min(compressedTokens, spatialTokens * 8);
    const activeTokens = mode === 'full'
      ? totalTokens
      : mode === 'window'
        ? recentTokens
        : recentTokens + compressedTokens + retrievedTokens;
    const kvBytesPerLayer = 2 * activeTokens * 8 * 128 * 2;
    const kvBytes32Layers = kvBytesPerLayer * 32;
    const attentionPairs = activeTokens * activeTokens;
    return {
      frames,
      totalTokens,
      activeTokens,
      recentTokens,
      compressedTokens,
      retrievedTokens,
      kvBytes32Layers,
      attentionPairs,
      retainedRatio: activeTokens / Math.max(1, totalTokens),
    };
  }, [duration, mode, sampleFps, spatialTokens]);

  return (
    <section className="not-prose my-10 overflow-hidden rounded-lg border border-border bg-card" data-temporal-token-budget-lab>
      <header className="grid gap-3 border-b border-border px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:px-5">
        <div>
          <p className="font-mono text-[10px] font-bold text-cyan-700 dark:text-cyan-300">INTERACTIVE · TOKEN & MEMORY LEDGER</p>
          <h3 className="mt-1 text-base font-bold">영상 길이가 context와 KV memory로 바뀌는 순간</h3>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
            Encoder 뒤 frame당 token 수와 sampling rate를 고정한 교육용 장부다. 실제 모델 값은 model card와 profiler에서 교체한다.
          </p>
        </div>
        <span
          className="font-mono text-xs font-bold text-muted-foreground"
          data-retained-ratio={budget.retainedRatio}
        >
          활성 {Math.round(budget.retainedRatio * 100)}%
        </span>
      </header>

      <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)]">
        <div className="space-y-4">
          <SegmentedControl
            label="영상 길이"
            value={duration}
            options={durationOptions}
            onChange={setDuration}
          />
          <SegmentedControl
            label="Sampling"
            value={sampleFps}
            options={fpsOptions.map((value) => ({ value, label: `${value} fps` }))}
            onChange={setSampleFps}
          />
          <SegmentedControl
            label="Frame당 visual token"
            value={spatialTokens}
            options={spatialTokenOptions.map((value) => ({ value, label: String(value) }))}
            onChange={setSpatialTokens}
          />
          <fieldset>
            <legend className="mb-2 text-[11px] font-bold text-muted-foreground">Memory policy</legend>
            <div className="space-y-2">
              {([
                ['full', '전체 문맥', '모든 visual token을 계속 유지'],
                ['window', '최근 Window', '최근 32 frame만 직접 유지'],
                ['tiered', '계층형 Memory', '최근 + 과거 2% 압축 + 관련 8 frame 회수'],
              ] as Array<[MemoryMode, string, string]>).map(([value, label, note]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMode(value)}
                  aria-pressed={mode === value}
                  className={`grid min-h-12 w-full grid-cols-[1rem_minmax(0,1fr)] gap-3 rounded-md border px-3 py-2 text-left transition-colors ${
                    mode === value ? 'border-cyan-600 bg-cyan-500/10' : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <span className={`mt-1 h-2.5 w-2.5 rounded-full ${mode === value ? 'bg-cyan-600' : 'bg-border'}`} />
                  <span className="min-w-0">
                    <strong className="block text-xs">{label}</strong>
                    <span className="mt-0.5 block text-[11px] leading-relaxed text-muted-foreground">{note}</span>
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="min-w-0">
          <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
            {[
              ['Sampling frame', formatCount(budget.frames), `${duration}초 × ${sampleFps} fps`],
              ['전체 visual token', formatCount(budget.totalTokens), `${formatCount(budget.frames)} × ${spatialTokens}`],
              ['현재 활성 token', formatCount(budget.activeTokens), mode === 'tiered' ? '최근 + 압축 + 회수' : mode === 'window' ? '최근 window' : '전체'],
              ['32-layer KV', formatBytes(budget.kvBytes32Layers), '8 KV heads · 128 dim · bf16 toy'],
            ].map(([label, value, note]) => (
              <div key={label} className="min-w-0 bg-background p-4">
                <p className="text-[10px] font-bold text-muted-foreground">{label}</p>
                <p
                  className="mt-2 break-words font-mono text-xl font-black"
                  data-budget-value={label}
                  data-raw-value={
                    label === 'Sampling frame'
                      ? budget.frames
                      : label === '전체 visual token'
                        ? budget.totalTokens
                        : label === '현재 활성 token'
                          ? budget.activeTokens
                          : budget.kvBytes32Layers
                  }
                >
                  {value}
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{note}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-md border border-border bg-background p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold">Memory 구성</p>
                <p className="mt-1 text-[11px] text-muted-foreground">같은 예산에서도 무엇을 남기는지가 품질을 바꾼다.</p>
              </div>
              <Gauge className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </div>
            <div className="mt-4 flex h-4 w-full overflow-hidden rounded-sm bg-muted" aria-label="Memory token allocation">
              <motion.span
                className="bg-cyan-600"
                animate={{ flexGrow: Math.max(1, budget.recentTokens) }}
                title="최근 token"
              />
              <motion.span
                className="bg-amber-500"
                animate={{ flexGrow: mode === 'tiered' ? Math.max(1, budget.compressedTokens) : 0 }}
                title="압축 memory"
              />
              <motion.span
                className="bg-violet-600"
                animate={{ flexGrow: mode === 'tiered' ? Math.max(1, budget.retrievedTokens) : 0 }}
                title="질문 관련 회수"
              />
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-3 text-xs">
              <div><dt className="font-semibold text-cyan-700 dark:text-cyan-300">최근</dt><dd className="mt-1 font-mono">{formatCount(Math.min(budget.activeTokens, budget.recentTokens))}</dd></div>
              <div><dt className="font-semibold text-amber-700 dark:text-amber-300">압축</dt><dd className="mt-1 font-mono">{mode === 'tiered' ? formatCount(budget.compressedTokens) : '0'}</dd></div>
              <div><dt className="font-semibold text-violet-700 dark:text-violet-300">회수</dt><dd className="mt-1 font-mono">{mode === 'tiered' ? formatCount(budget.retrievedTokens) : '0'}</dd></div>
            </dl>
          </div>

          <div className="mt-4 border-l-2 border-rose-500 pl-4">
            <p className="text-xs font-bold text-rose-700 dark:text-rose-300">Attention pair 상한 · {formatCount(budget.attentionPairs)}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              모든 활성 token끼리 dense attention한다고 가정한 상한이다. 실제 sparse·chunk·linear kernel은 이 pair를 materialize하지 않을 수 있다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FlowCard({
  icon: Icon,
  eyebrow,
  title,
  body,
  tone,
}: {
  icon: typeof Film;
  eyebrow: string;
  title: string;
  body: string;
  tone: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-w-0 rounded-md border border-border bg-background p-4"
    >
      <div className={`flex h-8 w-8 items-center justify-center rounded-md ${tone}`}>
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <p className="mt-4 font-mono text-[10px] font-bold text-muted-foreground">{eyebrow}</p>
      <p className="mt-1 text-sm font-bold">{title}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{body}</p>
    </motion.div>
  );
}

function LongVideoFlowScene({ step }: { step: number }) {
  const reducedMotion = useReducedMotion();

  if (step === 0) {
    return (
      <div className="w-full">
        <p className="mb-5 text-center text-sm font-bold">영상은 곧바로 Transformer token이 되지 않는다</p>
        <div className="grid items-center gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]">
          <FlowCard icon={Film} eyebrow="RAW" title="30 fps 영상" body="시간마다 RGB frame이 들어온다." tone="bg-blue-500/12 text-blue-700 dark:text-blue-300" />
          <ArrowRight className="mx-auto hidden h-4 w-4 text-muted-foreground sm:block" aria-hidden="true" />
          <FlowCard icon={Gauge} eyebrow="SAMPLE" title="2 fps · tubelet" body="시간축 중복을 먼저 줄인다." tone="bg-amber-500/12 text-amber-700 dark:text-amber-300" />
          <ArrowRight className="mx-auto hidden h-4 w-4 text-muted-foreground sm:block" aria-hidden="true" />
          <FlowCard icon={ScanSearch} eyebrow="ENCODE" title="Frame당 256 token" body="공간 patch를 visual feature로 압축한다." tone="bg-cyan-500/12 text-cyan-700 dark:text-cyan-300" />
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="w-full">
        <p className="mb-5 text-center text-sm font-bold">짧은 clip 모델은 window 밖의 사건을 직접 보지 못한다</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {['00–15s', '12–27s', '24–39s', '36–51s'].map((label, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0.25 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reducedMotion ? 0 : index * 0.12 }}
              className="min-w-0 rounded-md border border-border bg-background px-2 py-5 text-center"
            >
              <span className="block font-mono text-[10px] font-bold text-muted-foreground">CHUNK {index + 1}</span>
              <strong className="mt-2 block break-words text-xs">{label}</strong>
              <span className={`mx-auto mt-4 block h-1.5 w-4/5 rounded-full ${index % 2 === 0 ? 'bg-cyan-500' : 'bg-violet-500'}`} />
            </motion.div>
          ))}
        </div>
        <div className="mx-auto mt-5 max-w-xl border-l-2 border-rose-500 pl-4 text-xs leading-relaxed text-muted-foreground">
          Overlap은 인접 chunk의 seam을 줄이지만, 2분 전 인물의 옷이나 사건 순서를 자동으로 보존하지 않는다.
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="w-full">
        <p className="mb-5 text-center text-sm font-bold">장시간 모델은 memory를 한 종류로 두지 않는다</p>
        <div className="grid gap-3 md:grid-cols-3">
          <FlowCard icon={Film} eyebrow="RECENT" title="최근 고해상도" body="현재 행동과 경계 연속성을 위해 세밀한 token을 짧게 유지한다." tone="bg-cyan-500/12 text-cyan-700 dark:text-cyan-300" />
          <FlowCard icon={Archive} eyebrow="COMPRESSED" title="과거 요약" body="오래된 사건을 event, KV, state 또는 graph memory로 압축한다." tone="bg-amber-500/12 text-amber-700 dark:text-amber-300" />
          <FlowCard icon={ScanSearch} eyebrow="RETRIEVED" title="질문 관련 회수" body="현재 질문·camera·scene과 관련된 과거 조각만 다시 고해상도로 읽는다." tone="bg-violet-500/12 text-violet-700 dark:text-violet-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <p className="mb-5 text-center text-sm font-bold">이해와 생성은 같은 memory를 다른 성공 조건으로 읽는다</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <FlowCard icon={AudioLines} eyebrow="UNDERSTANDING" title="사건을 찾아 답하기" body="질문과 관련된 frame·audio를 회수하고 시간 순서와 근거 위치를 함께 검증한다." tone="bg-blue-500/12 text-blue-700 dark:text-blue-300" />
        <FlowCard icon={Film} eyebrow="GENERATION" title="다음 장면을 이어 만들기" body="인물·공간·camera 상태를 보존하면서 chunk 경계의 깜빡임과 장기 drift를 막는다." tone="bg-rose-500/12 text-rose-700 dark:text-rose-300" />
      </div>
      <ArrowDown className="mx-auto my-4 h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <div className="mx-auto max-w-2xl rounded-md border border-border bg-background px-4 py-3 text-center text-xs leading-relaxed">
        공통 release gate: 품질 score + 시간 grounding + memory 증가율 + frame latency + 경계 연속성
      </div>
    </div>
  );
}

export function LongVideoMemoryFlowViz() {
  return (
    <StepViz
      steps={[
        { label: '1. 먼저 시간과 공간을 token budget으로 바꾼다.', body: 'Raw fps를 모두 넣지 않는다. sampling, tubelet, encoder와 resampler가 시간·공간 정보를 줄이는 첫 압축층이다.' },
        { label: '2. Chunk는 계산을 제한하지만 오래된 사건을 자동으로 기억하지 않는다.', body: 'Sliding window와 overlap은 인접 경계를 연결한다. Window 밖의 identity와 사건 순서를 보존하려면 별도 memory가 필요하다.' },
        { label: '3. 최근·압축·회수 memory의 역할을 분리한다.', body: '최근 frame은 세밀하게, 오래된 사건은 압축해 유지하고, 현재 질문이나 camera와 관련된 과거만 다시 읽는다.' },
        { label: '4. 이해와 생성은 서로 다른 failure gate를 가진다.', body: '이해는 temporal grounding과 evidence recall, 생성은 identity·geometry·chunk seam과 drift를 검증한다. 둘 다 평균 score 하나로 닫을 수 없다.' },
      ]}
    >
      {(step) => <LongVideoFlowScene step={step} />}
    </StepViz>
  );
}
