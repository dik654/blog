import { useMemo, useState } from 'react';
import { Aperture, Boxes, CircleDot, ScanSearch, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { handleTabKey } from './tabKeyboard';

const details = [
  { id: 'shape', label: '형태', semantic: true, reconstruct: true },
  { id: 'object', label: '객체 의미', semantic: true, reconstruct: true },
  { id: 'color', label: '정확한 색', semantic: false, reconstruct: true },
  { id: 'texture', label: '미세 texture', semantic: false, reconstruct: true },
  { id: 'position', label: 'pixel 위치', semantic: false, reconstruct: true },
];

export function SemanticReconstructionLab() {
  const [mode, setMode] = useState<'semantic' | 'reconstruct'>('semantic');
  const reduceMotion = useReducedMotion();
  const isSemantic = mode === 'semantic';

  return (
    <figure className="not-prose my-9 overflow-hidden rounded-md border border-border bg-background" data-semantic-reconstruction-lab data-viz-canvas>
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <p className="font-mono text-xs font-bold text-cyan-700 dark:text-cyan-300">REPRESENTATION LAB · 무엇을 버려도 되는가</p>
        <h3 className="mt-2 text-lg font-bold">이해용 feature와 생성용 code는 같은 시험을 보지 않는다</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">의미 이해는 “무엇인가”를 남기면 되지만 image decoder는 색·texture·위치까지 복구해야 한다. 목적을 바꾸면 보존해야 할 정보가 달라진다.</p>
      </figcaption>

      <div className="grid sm:grid-cols-2">
        <div className="border-b border-border p-4 sm:border-b-0 sm:border-r sm:p-6">
          <div className="grid grid-cols-2 gap-1" role="tablist" aria-label="시각 표현 목적 선택">
            <button
              type="button"
              role="tab"
              id="representation-tab-semantic"
              aria-controls="representation-panel-semantic"
              aria-selected={isSemantic}
              tabIndex={isSemantic ? 0 : -1}
              onClick={() => setMode('semantic')}
              onKeyDown={(event) => handleTabKey(event, 0, 2, (index) => setMode(index === 0 ? 'semantic' : 'reconstruct'))}
              className={`min-h-12 border px-3 text-xs font-bold ${isSemantic ? 'border-cyan-700 bg-cyan-700 text-white' : 'border-border hover:bg-muted/30'}`}
            >
              의미 이해
            </button>
            <button
              type="button"
              role="tab"
              id="representation-tab-reconstruct"
              aria-controls="representation-panel-reconstruct"
              aria-selected={!isSemantic}
              tabIndex={!isSemantic ? 0 : -1}
              onClick={() => setMode('reconstruct')}
              onKeyDown={(event) => handleTabKey(event, 1, 2, (index) => setMode(index === 0 ? 'semantic' : 'reconstruct'))}
              className={`min-h-12 border px-3 text-xs font-bold ${!isSemantic ? 'border-orange-700 bg-orange-700 text-white' : 'border-border hover:bg-muted/30'}`}
            >
              Image 복원
            </button>
          </div>
          <div
            key={mode}
            id={`representation-panel-${mode}`}
            role="tabpanel"
            aria-labelledby={`representation-tab-${mode}`}
            className="mt-5 grid min-h-64 grid-cols-2 overflow-hidden border border-border"
          >
            <motion.div
              animate={{ opacity: isSemantic ? 1 : 0.48 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.2 }}
              className={`flex min-w-0 flex-col items-center justify-center border-r border-border p-3 text-center sm:p-5 ${isSemantic ? 'bg-cyan-500/[0.08]' : 'bg-muted/15'}`}
            >
              <ScanSearch className="h-10 w-10 text-cyan-700" aria-hidden="true" />
              <p className="mt-4 text-base font-bold sm:text-lg">“파란 자전거”</p>
              <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">객체와 관계를 남긴다</p>
            </motion.div>
            <motion.div
              animate={{ opacity: isSemantic ? 0.48 : 1 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.2 }}
              className={`flex min-w-0 flex-col items-center justify-center p-3 sm:p-5 ${isSemantic ? 'bg-muted/15' : 'bg-orange-500/[0.08]'}`}
            >
              <div className="grid w-full max-w-32 grid-cols-6 gap-1 sm:max-w-40">
                {Array.from({ length: 36 }, (_, index) => <span key={index} className={`aspect-square ${index % 5 === 0 ? 'bg-orange-500/55' : index % 3 === 0 ? 'bg-cyan-600/45' : 'bg-muted'}`} />)}
              </div>
              <p className="mt-4 text-[12px] font-bold leading-relaxed">색·texture·위치를 남긴다</p>
            </motion.div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <p className="text-[12px] font-bold text-muted-foreground">DECODER가 요구하는 정보</p>
          <div className="mt-3 divide-y divide-border border-y border-border">
            {details.map((detail) => {
              return (
                <div key={detail.id} className="grid min-h-12 grid-cols-[minmax(0,1fr)_4.5rem_4.5rem] items-center gap-2 py-2">
                  <span className="text-sm font-semibold">{detail.label}</span>
                  <StatusCell active={isSemantic} kept={detail.semantic} label="이해" />
                  <StatusCell active={!isSemantic} kept={detail.reconstruct} label="복원" />
                </div>
              );
            })}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            {isSemantic
              ? 'CLIP·ViT 계열 semantic feature는 object와 relation에 유용하다. 하지만 decoder가 원래 pixel을 복원하도록 학습되지 않았다면 생성 token이라고 부를 수 없다.'
              : 'VQ code나 continuous latent는 decoder가 image를 재구성하도록 학습된다. 의미뿐 아니라 appearance 정보를 더 오래 보존해야 한다.'}
          </p>
        </div>
      </div>
    </figure>
  );
}

function StatusCell({ active, kept, label }: { active: boolean; kept: boolean; label: string }) {
  return (
    <span className={`border px-1.5 py-1 text-center text-[12px] font-bold transition-opacity ${active ? 'opacity-100' : 'opacity-55'} ${kept ? 'border-emerald-600/35 bg-emerald-500/[0.08] text-emerald-900 dark:text-emerald-100' : 'border-border bg-muted/30 text-muted-foreground'}`}>
      <span className="sr-only">{label}: </span>{kept ? '보존' : '생략'}
    </span>
  );
}

const representationTasks = [
  {
    id: 'understand',
    label: '이해 · 검색',
    recommendation: 'Semantic feature',
    reason: 'Pixel을 되살리는 대신 객체·관계와 text 정렬을 우선한다.',
  },
  {
    id: 'ar',
    label: 'Visual AR',
    recommendation: 'Discrete code',
    reason: '유한 vocabulary ID가 있어야 다음 visual token의 확률을 예측할 수 있다.',
  },
  {
    id: 'flow',
    label: 'Diffusion · Flow',
    recommendation: 'Continuous latent',
    reason: 'Noise와 velocity를 미분 가능한 연속 vector 공간에서 회귀한다.',
  },
] as const;

type RepresentationTask = (typeof representationTasks)[number]['id'];

export function RepresentationBudgetLab() {
  const [task, setTask] = useState<RepresentationTask>('understand');
  const [resolution, setResolution] = useState(512);
  const [stride, setStride] = useState(16);
  const [codebook, setCodebook] = useState(16_384);
  const [precision, setPrecision] = useState(16);
  const reduceMotion = useReducedMotion();
  const selected = representationTasks.findIndex((item) => item.id === task);
  const current = representationTasks[selected];

  const metrics = useMemo(() => {
    const side = Math.ceil(resolution / stride);
    const tokens = side * side;
    const codeBits = Math.ceil(Math.log2(codebook));
    const discreteBits = tokens * codeBits;
    const continuousBits = tokens * 4 * precision;
    const maxBits = Math.max(discreteBits, continuousBits);
    return {
      side,
      tokens,
      codeBits,
      discreteBits,
      continuousBits,
      discreteShare: (discreteBits / maxBits) * 100,
      continuousShare: (continuousBits / maxBits) * 100,
    };
  }, [codebook, precision, resolution, stride]);

  const selectTask = (index: number) => setTask(representationTasks[index].id);

  return (
    <figure className="not-prose my-9 overflow-hidden rounded-md border border-border bg-background" data-representation-budget-lab data-viz-canvas>
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <p className="font-mono text-xs font-bold text-violet-700 dark:text-violet-300">REPRESENTATION LEDGER · token 수와 bit 상한</p>
        <h3 className="mt-2 text-lg font-bold">같은 latent grid라도 discrete ID와 continuous vector의 장부는 다르다</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">목표를 먼저 고르고, 해상도·downsample·codebook·precision이 sequence 길이와 원시 표현량을 어떻게 바꾸는지 계산한다.</p>
      </figcaption>

      <div className="grid grid-cols-3 gap-px bg-border" role="tablist" aria-label="시각 표현 목표 선택">
        {representationTasks.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`representation-budget-tab-${item.id}`}
            aria-controls={`representation-budget-panel-${item.id}`}
            aria-selected={task === item.id}
            tabIndex={task === item.id ? 0 : -1}
            onClick={() => selectTask(index)}
            onKeyDown={(event) => handleTabKey(event, index, representationTasks.length, selectTask)}
            className={`min-h-12 min-w-0 bg-background px-2 text-xs font-bold sm:px-3 ${
              task === item.id ? 'shadow-[inset_0_-3px_0_0_hsl(var(--foreground))]' : 'text-muted-foreground hover:bg-muted/30'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div
        key={task}
        id={`representation-budget-panel-${task}`}
        role="tabpanel"
        aria-labelledby={`representation-budget-tab-${task}`}
        className="grid lg:grid-cols-[17rem_minmax(0,1fr)]"
      >
        <div className="space-y-5 border-b border-border bg-muted/15 p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <BudgetControl label="정사각 image" value={`${resolution}px`}>
            <input aria-label="Representation image resolution" className="min-h-11 w-full accent-violet-700" type="range" min="256" max="1024" step="128" value={resolution} onChange={(event) => setResolution(Number(event.target.value))} />
          </BudgetControl>
          <BudgetSegments label="Encoder downsample" values={[8, 16, 32]} selected={stride} onSelect={setStride} format={(value) => `${value}×`} />
          <BudgetSegments label="Codebook size K" values={[1_024, 4_096, 16_384]} selected={codebook} onSelect={setCodebook} format={(value) => value.toLocaleString()} />
          <BudgetSegments label="Continuous precision" values={[8, 16, 32]} selected={precision} onSelect={setPrecision} format={(value) => `${value} bit`} />
        </div>

        <div className="min-w-0 p-4 sm:p-6" aria-live="polite" aria-atomic="true">
          <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
            <BudgetMetric label="Latent grid" value={`${metrics.side} × ${metrics.side}`} note={`${metrics.tokens.toLocaleString()} positions`} />
            <BudgetMetric label="Discrete ID" value={`${metrics.codeBits} bit`} note={`ceil(log₂ ${codebook.toLocaleString()})`} />
            <BudgetMetric label="권장 표현" value={current.recommendation} note={current.reason} />
          </div>

          <div className="mt-6 space-y-4">
            <BitBar
              label="Discrete code index 상한"
              value={metrics.discreteBits}
              width={metrics.discreteShare}
              tone="bg-violet-600"
              reduceMotion={Boolean(reduceMotion)}
            />
            <BitBar
              label="Continuous 4-channel latent"
              value={metrics.continuousBits}
              width={metrics.continuousShare}
              tone="bg-cyan-600"
              reduceMotion={Boolean(reduceMotion)}
            />
          </div>
          <p className="mt-6 border-l-2 border-amber-600/50 pl-3 text-xs leading-relaxed text-muted-foreground">이 값은 representation tensor의 원시 상한이다. 실제 파일 크기나 VRAM 전체가 아니다. Entropy coding, batch·dtype, decoder weight와 intermediate activation은 별도 장부로 계산한다.</p>
        </div>
      </div>
    </figure>
  );
}

function BudgetControl({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return <label className="block text-xs font-bold"><span className="flex justify-between gap-3"><span>{label}</span><span className="font-mono tabular-nums">{value}</span></span><span className="mt-2 block">{children}</span></label>;
}

function BudgetSegments({ label, values, selected, onSelect, format }: { label: string; values: number[]; selected: number; onSelect: (value: number) => void; format: (value: number) => string }) {
  return (
    <div>
      <p className="text-xs font-bold">{label}</p>
      <div className="mt-2 grid grid-cols-3 gap-1">
        {values.map((value) => (
          <button key={value} type="button" aria-pressed={selected === value} onClick={() => onSelect(value)} className={`min-h-11 border px-1 text-[12px] font-bold ${selected === value ? 'border-violet-700 bg-violet-700 text-white' : 'border-border bg-background hover:bg-muted/30'}`}>
            {format(value)}
          </button>
        ))}
      </div>
    </div>
  );
}

function BudgetMetric({ label, value, note }: { label: string; value: string; note: string }) {
  return <div className="min-w-0 bg-background p-4"><p className="text-[12px] font-bold text-muted-foreground">{label}</p><p className="mt-2 break-words font-mono text-xl font-bold">{value}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{note}</p></div>;
}

function BitBar({ label, value, width, tone, reduceMotion }: { label: string; value: number; width: number; tone: string; reduceMotion: boolean }) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs font-bold"><span>{label}</span><span className="font-mono tabular-nums">{(value / 8 / 1024).toFixed(2)} KiB</span></div>
      <div className="mt-2 h-3 overflow-hidden rounded-sm bg-muted">
        <motion.div className={`h-full ${tone}`} animate={{ width: `${width}%` }} transition={{ duration: reduceMotion ? 0 : 0.2 }} />
      </div>
    </div>
  );
}

const codes = [
  { id: 0, x: 18, y: 22, tone: 'bg-cyan-600' },
  { id: 1, x: 76, y: 18, tone: 'bg-blue-600' },
  { id: 2, x: 30, y: 76, tone: 'bg-emerald-600' },
  { id: 3, x: 78, y: 76, tone: 'bg-orange-600' },
  { id: 4, x: 52, y: 48, tone: 'bg-violet-600' },
];

export function CodebookAssignmentLab() {
  const [x, setX] = useState(44);
  const [y, setY] = useState(58);
  const reduceMotion = useReducedMotion();
  const nearest = useMemo(() => {
    return codes
      .map((code) => ({ ...code, distance: (x - code.x) ** 2 + (y - code.y) ** 2 }))
      .sort((a, b) => a.distance - b.distance)[0];
  }, [x, y]);

  return (
    <figure className="not-prose my-9 overflow-hidden rounded-md border border-border bg-background" data-codebook-assignment-lab data-viz-canvas>
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <p className="font-mono text-xs font-bold text-violet-700 dark:text-violet-300">CODEBOOK LAB · 연속 feature를 ID로 바꾸기</p>
        <h3 className="mt-2 text-lg font-bold">가장 가까운 code 하나를 고르면 image patch가 discrete token이 된다</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">Encoder output을 움직이면 nearest code와 quantization error가 바뀐다. `argmin`은 모든 code와의 거리를 비교해 오차가 가장 작은 ID를 고르는 연산이다.</p>
      </figcaption>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="min-w-0 border-b border-border p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="relative aspect-[4/3] min-h-52 overflow-hidden border border-border bg-[linear-gradient(to_right,hsl(var(--border)/.35)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/.35)_1px,transparent_1px)] bg-[size:10%_10%] sm:min-h-64">
            {codes.map((code) => (
              <div key={code.id} className="absolute -translate-x-1/2 -translate-y-1/2 text-center" style={{ left: `${code.x}%`, top: `${code.y}%` }}>
                <span className={`block h-5 w-5 rounded-sm border-2 ${code.id === nearest.id ? 'scale-125 border-foreground shadow-md' : 'border-background'} ${code.tone}`} />
                <span className="mt-1 block font-mono text-[12px] font-bold">e{code.id}</span>
              </div>
            ))}
            <motion.div
              className="absolute -translate-x-1/2 -translate-y-1/2"
              animate={{ left: `${x}%`, top: `${y}%` }}
              transition={{ duration: reduceMotion ? 0 : 0.18 }}
            >
              <span className="block h-6 w-6 rounded-full border-2 border-foreground bg-background shadow-md" />
              <span className="mt-1 block whitespace-nowrap font-mono text-[12px] font-bold">zₑ</span>
            </motion.div>
            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <line x1={x} y1={y} x2={nearest.x} y2={nearest.y} stroke="currentColor" strokeWidth="0.65" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <AxisControl label="feature x" value={x} onChange={setX} />
            <AxisControl label="feature y" value={y} onChange={setY} />
          </div>
        </div>

        <div className="min-w-0 bg-muted/15 p-4 sm:p-6">
          <p className="text-[12px] font-bold text-muted-foreground">NEAREST ASSIGNMENT</p>
          <div className="mt-3 flex items-end gap-3" aria-live="polite" aria-atomic="true">
            <span className={`h-10 w-10 rounded-sm ${nearest.tone}`} />
            <span className="font-mono text-4xl font-bold tabular-nums" data-nearest-code>e{nearest.id}</span>
          </div>
          <dl className="mt-6 divide-y divide-border border-y border-border">
            <Metric icon={CircleDot} label="제곱 L2 오차" value={nearest.distance.toFixed(0)} />
            <Metric icon={Boxes} label="Vocabulary" value={`${codes.length} codes`} />
            <Metric icon={Aperture} label="출력 ID" value={String(nearest.id)} />
          </dl>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">Code 수가 너무 적으면 서로 다른 patch가 같은 ID로 뭉개진다. 너무 크거나 update가 치우치면 선택되지 않는 dead code가 생긴다.</p>
        </div>
      </div>
    </figure>
  );
}

type StraightThroughPhase = 'forward' | 'backward' | 'owners';

export function StraightThroughLab() {
  const [phase, setPhase] = useState<StraightThroughPhase>('forward');
  const [encoderValue, setEncoderValue] = useState(0.65);
  const codeValue = 1;
  const correction = codeValue - encoderValue;
  const phases: Array<{ id: StraightThroughPhase; label: string }> = [
    { id: 'forward', label: '1 · Forward 값' },
    { id: 'backward', label: '2 · Backward 통로' },
    { id: 'owners', label: '3 · Loss 책임' },
  ];

  return (
    <figure className="not-prose my-9 overflow-hidden rounded-md border border-border bg-background" data-straight-through-lab data-viz-canvas>
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <p className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">GRADIENT ROUTE LAB · 값과 미분 경로 분리</p>
        <h3 className="mt-2 text-lg font-bold">Forward에서는 code로 바꾸고 backward에서는 encoder로 돌아간다</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">Encoder 값을 움직인 뒤 세 단계를 넘겨 본다. Stop-gradient는 forward 값을 지우는 연산이 아니라, backward의 한 갈래만 막는 연산이다.</p>
      </figcaption>

      <div className="grid lg:grid-cols-[17rem_minmax(0,1fr)]">
        <div className="border-b border-border bg-muted/15 p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <label className="block text-xs font-bold">
            <span className="flex justify-between gap-3">
              <span>Encoder output zₑ</span>
              <span className="font-mono tabular-nums">{encoderValue.toFixed(2)}</span>
            </span>
            <input
              aria-label="Straight-through encoder value"
              className="mt-3 min-h-11 w-full accent-emerald-700"
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={encoderValue}
              onChange={(event) => setEncoderValue(Number(event.target.value))}
            />
          </label>
          <div className="mt-5 grid gap-1" role="tablist" aria-label="Straight-through 계산 단계">
            {phases.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={phase === item.id}
                tabIndex={phase === item.id ? 0 : -1}
                onClick={() => setPhase(item.id)}
                onKeyDown={(event) => handleTabKey(event, index, phases.length, (next) => setPhase(phases[next].id))}
                className={`min-h-11 border px-3 text-left text-xs font-bold ${phase === item.id ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-border bg-background hover:bg-muted/30'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="min-w-0 p-4 sm:p-6" aria-live="polite" aria-atomic="true">
          {phase === 'forward' && (
            <div role="tabpanel">
              <p className="text-[12px] font-bold text-muted-foreground">FORWARD · 실제 decoder 입력값</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
                <RouteValue label="zₑ" value={encoderValue.toFixed(2)} note="encoder가 만든 값" />
                <span className="text-center font-mono text-muted-foreground">+</span>
                <RouteValue label="sg(e − zₑ)" value={correction.toFixed(2)} note="forward 교정값" />
                <span className="text-center font-mono text-muted-foreground">=</span>
                <RouteValue label="zq" value={codeValue.toFixed(2)} note="선택 code와 정확히 같음" accent />
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">zₑ가 바뀌면 괄호의 교정값이 반대로 바뀌므로 합은 항상 선택 code e=1.00이다. Decoder는 연속 encoder 값이 아니라 quantized code를 본다.</p>
            </div>
          )}

          {phase === 'backward' && (
            <div role="tabpanel">
              <p className="text-[12px] font-bold text-muted-foreground">BACKWARD · decoder gradient의 귀로</p>
              <div className="mt-4 grid gap-px border border-border bg-border sm:grid-cols-3">
                <GradientOwner label="Decoder → zq" value="g" note="복원 loss가 보낸 gradient" />
                <GradientOwner label="sg 괄호" value="0" note="이 branch는 미분 차단" blocked />
                <GradientOwner label="zₑ identity" value="g × 1" note="encoder로 그대로 전달" accent />
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">이 경로는 argmin의 진짜 미분이 아니다. zq=zₑ처럼 미분한다고 근사해 decoder의 gradient를 encoder에 복사한다.</p>
            </div>
          )}

          {phase === 'owners' && (
            <div role="tabpanel">
              <p className="text-[12px] font-bold text-muted-foreground">LOSS OWNERS · 어느 parameter가 움직이는가</p>
              <div className="mt-4 divide-y divide-border border-y border-border">
                <OwnerRow label="Image 복원" encoder="decoder gradient를 STE로 받음" codebook="직접 update 아님" decoder="update" />
                <OwnerRow label="Codebook 이동" encoder="sg로 고정" codebook="encoder feature 쪽으로 update" decoder="관여 없음" />
                <OwnerRow label="Commitment" encoder="선택 code 쪽으로 update" codebook="sg로 고정" decoder="관여 없음" />
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">Stop-gradient 위치를 바꾸면 책임도 바뀐다. 세 항은 복원, code 중심 이동, encoder 안정화를 서로 다른 parameter에 배분한다.</p>
            </div>
          )}
        </div>
      </div>
    </figure>
  );
}

function RouteValue({ label, value, note, accent = false }: { label: string; value: string; note: string; accent?: boolean }) {
  return (
    <div className={`min-w-0 border p-3 text-center ${accent ? 'border-emerald-600/50 bg-emerald-500/[0.08]' : 'border-border bg-background'}`}>
      <p className="font-mono text-xs font-bold">{label}</p>
      <p className="mt-2 font-mono text-2xl font-bold tabular-nums">{value}</p>
      <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{note}</p>
    </div>
  );
}

function GradientOwner({ label, value, note, blocked = false, accent = false }: { label: string; value: string; note: string; blocked?: boolean; accent?: boolean }) {
  return (
    <div className={`min-w-0 p-4 ${blocked ? 'bg-red-500/[0.06]' : accent ? 'bg-emerald-500/[0.08]' : 'bg-background'}`}>
      <p className="text-[12px] font-bold text-muted-foreground">{label}</p>
      <p className="mt-2 font-mono text-2xl font-bold">{value}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{note}</p>
    </div>
  );
}

function OwnerRow({ label, encoder, codebook, decoder }: { label: string; encoder: string; codebook: string; decoder: string }) {
  return (
    <div className="grid gap-2 py-4 text-xs sm:grid-cols-[7rem_repeat(3,minmax(0,1fr))]">
      <strong>{label}</strong>
      <span><b className="block text-[11px] text-muted-foreground">ENCODER</b>{encoder}</span>
      <span><b className="block text-[11px] text-muted-foreground">CODEBOOK</b>{codebook}</span>
      <span><b className="block text-[11px] text-muted-foreground">DECODER</b>{decoder}</span>
    </div>
  );
}

function AxisControl({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="text-xs font-bold">
      <span className="flex justify-between gap-3"><span>{label}</span><span className="font-mono tabular-nums">{value}</span></span>
      <input aria-label={label} className="mt-2 min-h-11 w-full accent-violet-700" type="range" min="5" max="95" value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Sparkles; label: string; value: string }) {
  return <div className="flex min-h-14 items-center justify-between gap-3 py-3"><dt className="flex items-center gap-2 text-xs font-bold text-muted-foreground"><Icon className="h-4 w-4" aria-hidden="true" />{label}</dt><dd className="font-mono text-sm font-bold tabular-nums">{value}</dd></div>;
}
