import { useMemo, useState } from 'react';
import {
  ArrowDown,
  Boxes,
  BrainCircuit,
  Check,
  CircleDot,
  Gauge,
  GitCompareArrows,
  Grid3X3,
  Image,
  Layers3,
  Route,
  ScanSearch,
  SlidersHorizontal,
  Sparkles,
  Timer,
  TriangleAlert,
} from 'lucide-react';

const contractModels = [
  {
    id: 'a',
    name: 'A · DDPM baseline',
    note: '기초 비교점',
    contracts: {
      representation: 'VAE latent · f=8',
      backbone: 'U-Net',
      path: 'VP diffusion · ε target',
      solver: 'DDIM · 30 NFE',
      evaluation: '1 sample · fixed seed set',
    },
  },
  {
    id: 'b',
    name: 'B · Rectified Flow',
    note: '구조와 path가 함께 바뀜',
    contracts: {
      representation: 'VAE latent · f=8',
      backbone: 'MMDiT',
      path: 'Straight interpolation · velocity',
      solver: 'Euler · 28 NFE',
      evaluation: '1 sample · fixed seed set',
    },
  },
  {
    id: 'c',
    name: 'C · Few-step student',
    note: 'distillation과 demo budget까지 바뀜',
    contracts: {
      representation: '새 VAE latent · f=16',
      backbone: 'Distilled DiT',
      path: 'Teacher trajectory target',
      solver: 'Student transition · 4 NFE',
      evaluation: '9 samples · reranker best-of-9',
    },
  },
] as const;

const contractRows = [
  ['representation', '표현', '어떤 공간에서 계산하는가?', Image],
  ['backbone', 'Backbone', '누가 방향을 예측하는가?', BrainCircuit],
  ['path', 'Path · target', '무엇을 정답으로 학습하는가?', Route],
  ['solver', 'Solver', '학습한 field를 어떻게 따라가는가?', Timer],
  ['evaluation', '평가 계약', '무슨 조건의 결과를 비교하는가?', ScanSearch],
] as const;

export function FiveContractWorkbench() {
  const [modelId, setModelId] = useState<(typeof contractModels)[number]['id']>('b');
  const active = contractModels.find((model) => model.id === modelId) ?? contractModels[0];
  const baseline = contractModels[0];
  const changedCount = contractRows.filter(([key]) => active.contracts[key] !== baseline.contracts[key]).length;

  return (
    <figure data-five-contracts className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">FIVE CONTRACTS</p>
        <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">모델 이름을 지우고 동시에 바뀐 설계 축부터 찾는다</h3>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">A·B·C는 공개 모델 사양을 옮긴 표가 아니라, 한 축만 바뀌었다고 오판하는 상황을 드러내기 위한 교육용 재구성이다.</p>
      </figcaption>
      <div className="grid grid-cols-3 gap-px border-b border-border bg-border">
        {contractModels.map((model) => (
          <button
            key={model.id}
            type="button"
            aria-pressed={model.id === active.id}
            onClick={() => setModelId(model.id)}
            className={`min-h-20 min-w-0 bg-background px-2 py-3 text-center transition-colors sm:px-4 ${model.id === active.id ? 'shadow-[inset_0_-3px_0_0_currentColor]' : 'text-muted-foreground hover:bg-muted/35'}`}
          >
            <strong className="block break-words text-xs leading-snug">{model.name}</strong>
            <span className="mt-1 hidden text-xs leading-snug sm:block">{model.note}</span>
          </button>
        ))}
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="min-w-0 divide-y divide-border border-y border-border">
          {contractRows.map(([key, label, question, Icon]) => {
            const changed = active.contracts[key] !== baseline.contracts[key];
            return (
              <div key={key} className="grid min-w-0 gap-2 py-3 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:items-center sm:gap-4">
                <div className="flex min-w-0 items-center gap-2">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <div className="min-w-0"><strong className="block text-xs">{label}</strong><span className="block text-xs leading-snug text-muted-foreground">{question}</span></div>
                </div>
                <div className={`flex min-w-0 items-center justify-between gap-3 rounded-md border px-3 py-2.5 ${changed ? 'border-blue-600/35 bg-blue-500/[0.055]' : 'border-border bg-muted/10'}`}>
                  <span className="min-w-0 break-words text-xs font-semibold leading-relaxed">{active.contracts[key]}</span>
                  <span className={`shrink-0 text-xs font-bold uppercase ${changed ? 'text-blue-800 dark:text-blue-200' : 'text-muted-foreground'}`}>{changed ? 'changed' : 'same'}</span>
                </div>
              </div>
            );
          })}
        </div>
        <aside aria-live="polite" data-changed-count={changedCount} className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <GitCompareArrows className="h-5 w-5" aria-hidden="true" />
          <p className="mt-3 text-xs font-bold uppercase text-muted-foreground">A와 동시에 달라진 축</p>
          <p className="mt-1 flex min-h-11 items-baseline gap-1 font-mono text-4xl font-black leading-tight">
            <span className="leading-tight">{changedCount}</span>
            <span className="text-sm font-semibold leading-normal text-muted-foreground">/ 5</span>
          </p>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">두 개 이상이면 최종 점수 차이를 backbone 하나의 효과라고 부를 수 없다. 한 축씩 고정한 ablation이 필요하다.</p>
        </aside>
      </div>
    </figure>
  );
}

const resolutions = [512, 768, 1024] as const;
const vaeFactors = [8, 16] as const;
const patchSizes = [1, 2, 4] as const;

function compactNumber(value: number) {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(value);
}

function Segmented<T extends number>({ label, values, value, onChange }: { label: string; values: readonly T[]; value: T; onChange: (value: T) => void }) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs font-bold uppercase text-muted-foreground">{label}</p>
      <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border" style={{ gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))` }}>
        {values.map((option) => <button key={option} type="button" aria-pressed={option === value} onClick={() => onChange(option)} className={`min-h-11 min-w-0 bg-background px-1 font-mono text-xs font-bold ${option === value ? 'shadow-[inset_0_-2px_0_0_currentColor]' : 'text-muted-foreground hover:bg-muted/35'}`}>{option}</button>)}
      </div>
    </div>
  );
}

export function DiTTokenExplorer() {
  const [resolution, setResolution] = useState<(typeof resolutions)[number]>(1024);
  const [vaeFactor, setVaeFactor] = useState<(typeof vaeFactors)[number]>(8);
  const [patchSize, setPatchSize] = useState<(typeof patchSizes)[number]>(2);
  const [dualStream, setDualStream] = useState(true);
  const latentSide = resolution / vaeFactor;
  const tokenSide = latentSide / patchSize;
  const tokens = tokenSide ** 2;
  const attentionPairs = tokens ** 2;
  const density = Math.min(64, Math.max(4, Math.round(Math.log2(tokenSide) * 6)));

  return (
    <figure data-dit-token-explorer className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">LATENT TO TOKENS</p>
        <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">해상도, VAE 압축, patch가 attention 비용을 함께 정한다</h3>
      </figcaption>
      <div className="grid gap-4 border-b border-border bg-muted/15 p-4 sm:grid-cols-3 sm:p-5">
        <Segmented label="출력 해상도" values={resolutions} value={resolution} onChange={setResolution} />
        <Segmented label="VAE factor f" values={vaeFactors} value={vaeFactor} onChange={setVaeFactor} />
        <Segmented label="Latent patch p" values={patchSizes} value={patchSize} onChange={setPatchSize} />
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0">
          <div className="grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1fr)_1.5rem_minmax(0,1fr)] sm:items-center">
            <div className="min-h-24 min-w-0 rounded-md border border-border bg-muted/15 p-3 text-center"><Image className="mx-auto h-4 w-4" aria-hidden="true" /><p className="mt-2 font-mono text-sm font-black">{resolution}²</p><p className="mt-1 text-xs text-muted-foreground">pixel image</p></div>
            <ArrowDown className="mx-auto h-4 w-4 text-muted-foreground sm:-rotate-90" aria-hidden="true" />
            <div className="min-h-24 min-w-0 rounded-md border border-border bg-blue-500/[0.045] p-3 text-center"><Layers3 className="mx-auto h-4 w-4" aria-hidden="true" /><p className="mt-2 font-mono text-sm font-black">{latentSide}²</p><p className="mt-1 text-xs text-muted-foreground">VAE latent</p></div>
            <ArrowDown className="mx-auto h-4 w-4 text-muted-foreground sm:-rotate-90" aria-hidden="true" />
            <div className="min-h-24 min-w-0 rounded-md border border-border bg-emerald-500/[0.045] p-3 text-center"><Grid3X3 className="mx-auto h-4 w-4" aria-hidden="true" /><p className="mt-2 font-mono text-sm font-black">{compactNumber(tokens)}</p><p className="mt-1 text-xs text-muted-foreground">image tokens</p></div>
          </div>
          <div className="mt-3 grid min-w-0 gap-4 rounded-md border border-border p-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-center">
            <div className="mx-auto grid aspect-square w-full max-w-36 gap-px overflow-hidden rounded-sm border border-border bg-border p-px" style={{ gridTemplateColumns: `repeat(${Math.round(Math.sqrt(density))}, minmax(0, 1fr))` }} aria-label="token density sample">
              {Array.from({ length: density }).map((_, index) => <i key={index} className="bg-blue-500/30" />)}
            </div>
            <div className="min-w-0">
              <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
                <div className="min-w-0 bg-background p-3"><p className="text-xs font-bold uppercase text-muted-foreground">Token grid</p><p className="mt-1 font-mono text-lg font-black">{tokenSide} × {tokenSide}</p></div>
                <div className="min-w-0 bg-background p-3"><p className="text-xs font-bold uppercase text-muted-foreground">Dense attention pairs</p><p className="mt-1 font-mono text-lg font-black">{compactNumber(attentionPairs)}</p></div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">왼쪽 격자는 밀도 표본이다. 실제 {compactNumber(tokens)}개 token을 전부 그려 browser를 느리게 만들지 않는다.</p>
            </div>
          </div>
        </div>
        <aside className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><Boxes className="h-4 w-4" aria-hidden="true" /><h4 className="text-sm font-bold">Condition stream</h4></div><button type="button" aria-label="Condition stream 구조 전환" aria-pressed={dualStream} onClick={() => setDualStream((value) => !value)} className="min-h-11 rounded-md border border-border px-2 text-xs font-bold">구조 · {dualStream ? 'MMDiT' : 'DiT'}</button></div>
          <div className="mt-4 space-y-2">
            <div className="rounded-md border border-blue-600/30 bg-blue-500/[0.05] p-3 text-xs font-semibold">Image tokens · image-specific weights</div>
            {dualStream ? (
              <><div className="flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground"><ArrowDown className="h-3.5 w-3.5" />joint attention<ArrowDown className="h-3.5 w-3.5 rotate-180" /></div><div className="rounded-md border border-emerald-600/30 bg-emerald-500/[0.05] p-3 text-xs font-semibold">Text tokens · text-specific weights</div></>
            ) : (
              <div className="rounded-md border border-border bg-muted/15 p-3 text-xs leading-relaxed text-muted-foreground">Text/timestep은 adaLN이나 cross-attention으로 image stream을 조건화한다.</div>
            )}
          </div>
          <p className="mt-4 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">MMDiT는 두 modality의 projection·norm·MLP를 분리하고, joint attention에서 Q/K/V를 만나게 해 양방향 정보를 교환한다.</p>
        </aside>
      </div>
    </figure>
  );
}

const dataPoints = [[88, 62], [82, 172], [170, 108], [185, 205]] as const;
const noisePoints = [[430, 46], [500, 98], [418, 178], [510, 216]] as const;
const pairings = {
  aligned: [0, 2, 1, 3],
  crossed: [3, 0, 2, 1],
} as const;

export function FlowPathExplorer() {
  const [coupling, setCoupling] = useState<keyof typeof pairings>('aligned');
  const [time, setTime] = useState(0.45);
  const mapping = pairings[coupling];
  const crossingRisk = coupling === 'aligned' ? '낮음' : '높음';

  return (
    <figure data-flow-path className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">CONDITIONAL PATHS</p>
        <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">각 data-noise 쌍이 만드는 conditional path와 속도를 비교한다</h3>
      </figcaption>
      <div className="grid gap-4 border-b border-border bg-muted/15 p-4 sm:grid-cols-[13rem_minmax(0,1fr)] sm:items-end sm:p-5">
        <div><p className="mb-2 text-xs font-bold uppercase text-muted-foreground">Coupling 예시</p><div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border">{(['aligned', 'crossed'] as const).map((mode) => <button key={mode} type="button" aria-pressed={coupling === mode} onClick={() => setCoupling(mode)} className={`min-h-11 bg-background px-2 text-xs font-bold ${coupling === mode ? 'shadow-[inset_0_-2px_0_0_currentColor]' : 'text-muted-foreground'}`}>{mode === 'aligned' ? '가까운 쌍' : '교차 쌍'}</button>)}</div></div>
        <label className="min-w-0 text-xs font-semibold text-muted-foreground">Forward time t · {time.toFixed(2)}<input aria-label="flow forward time" className="mt-3 block w-full accent-blue-700" type="range" min="0" max="1" step="0.01" value={time} onChange={(event) => setTime(Number(event.target.value))} /></label>
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="min-w-0 overflow-hidden rounded-md border border-border bg-muted/10">
          <div className="flex items-center justify-between border-b border-border px-3 py-2 text-xs font-bold uppercase text-muted-foreground"><span>data · t=0</span><span>noise · t=1</span></div>
          <svg viewBox="0 0 600 260" className="block aspect-[600/260] w-full" role="img" aria-label="data and noise conditional interpolation paths">
            <g stroke="currentColor" strokeOpacity="0.16" strokeWidth="1">
              {[100, 200, 300, 400, 500].map((x) => <line key={`x-${x}`} x1={x} y1="0" x2={x} y2="260" />)}
              {[52, 104, 156, 208].map((y) => <line key={`y-${y}`} x1="0" y1={y} x2="600" y2={y} />)}
            </g>
            {dataPoints.map(([dx, dy], index) => {
              const [nx, ny] = noisePoints[mapping[index]];
              const x = dx + (nx - dx) * time;
              const y = dy + (ny - dy) * time;
              return <g key={index}><line x1={dx} y1={dy} x2={nx} y2={ny} stroke="currentColor" strokeOpacity="0.27" strokeWidth="2" strokeDasharray="5 5" /><circle cx={dx} cy={dy} r="7" className="fill-blue-600" /><circle cx={nx} cy={ny} r="7" className="fill-muted-foreground" /><circle cx={x} cy={y} r="9" className="fill-emerald-500 stroke-emerald-900 dark:stroke-emerald-100" strokeWidth="2" /></g>;
            })}
          </svg>
        </div>
        <aside aria-live="polite" className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <Route className="h-5 w-5" aria-hidden="true" />
          <p className="mt-3 text-xs font-bold uppercase text-muted-foreground">Conditional line crossing</p>
          <p className={`mt-1 text-xl font-black ${crossingRisk === '높음' ? 'text-rose-700 dark:text-rose-300' : 'text-emerald-700 dark:text-emerald-300'}`}>{crossingRisk}</p>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">초록 점의 target은 각 선의 일정한 방향이다. 하지만 같은 <code>xₜ</code> 근처에 서로 다른 방향이 겹치면 network는 조건부 평균을 배워 실제 marginal trajectory가 휘거나 모호해질 수 있다.</p>
        </aside>
      </div>
      <div className="flex min-w-0 gap-3 border-t border-border bg-amber-500/[0.05] px-4 py-4 sm:px-5"><TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-800 dark:text-amber-200" aria-hidden="true" /><p className="text-xs font-semibold leading-relaxed">“Straight conditional path”는 학습 sample pair의 target이 단순하다는 뜻이다. 모든 learned sample이 정확히 한 직선으로 이동하거나 one-step 생성이 자동 보장된다는 뜻은 아니다.</p></div>
    </figure>
  );
}

type SolverName = 'euler' | 'heun';

function derivative(s: number, y: number) {
  return 1.8 * s + 0.72 * y;
}

function integrate(steps: number, solver: SolverName) {
  const points: Array<[number, number]> = [[0, 0]];
  let y = 0;
  const h = 1 / steps;
  for (let index = 0; index < steps; index += 1) {
    const s = index * h;
    const k1 = derivative(s, y);
    if (solver === 'euler') y += h * k1;
    else {
      const predictor = y + h * k1;
      const k2 = derivative(s + h, predictor);
      y += h * (k1 + k2) / 2;
    }
    points.push([(index + 1) * h, y]);
  }
  return points;
}

function toPolyline(points: Array<[number, number]>, maxY: number) {
  return points.map(([s, y]) => `${40 + s * 500},${220 - (y / maxY) * 175}`).join(' ');
}

export function SolverStepExplorer() {
  const [solver, setSolver] = useState<SolverName>('euler');
  const [steps, setSteps] = useState(4);
  const reference = useMemo(() => integrate(256, 'heun'), []);
  const approximation = useMemo(() => integrate(steps, solver), [solver, steps]);
  const referenceEnd = reference.at(-1)?.[1] ?? 1;
  const approximateEnd = approximation.at(-1)?.[1] ?? 0;
  const error = Math.abs(referenceEnd - approximateEnd) / referenceEnd * 100;
  const nfe = solver === 'euler' ? steps : steps * 2;
  const maxY = referenceEnd * 1.08;

  return (
    <figure data-solver-step className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">NUMERICAL TRAJECTORY</p>
        <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">같은 field도 solver와 step 수가 endpoint를 바꾼다</h3>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">아래 ODE와 reference 곡선은 solver 오차를 격리해 보기 위한 교육용 toy system이며, 특정 생성 모델의 실제 trajectory가 아니다.</p>
      </figcaption>
      <div className="grid gap-4 border-b border-border bg-muted/15 p-4 sm:grid-cols-[12rem_minmax(0,1fr)] sm:items-end sm:p-5">
        <div><p className="mb-2 text-xs font-bold uppercase text-muted-foreground">Solver</p><div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border">{(['euler', 'heun'] as const).map((name) => <button key={name} type="button" aria-pressed={solver === name} onClick={() => setSolver(name)} className={`min-h-11 bg-background text-xs font-bold uppercase ${solver === name ? 'shadow-[inset_0_-2px_0_0_currentColor]' : 'text-muted-foreground'}`}>{name}</button>)}</div></div>
        <label className="min-w-0 text-xs font-semibold text-muted-foreground">Integration steps · {steps}<input aria-label="integration steps" className="mt-3 block w-full accent-blue-700" type="range" min="2" max="16" step="2" value={steps} onChange={(event) => setSteps(Number(event.target.value))} /></label>
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="min-w-0 overflow-hidden rounded-md border border-border bg-muted/10">
          <svg viewBox="0 0 580 250" className="block aspect-[580/250] w-full" role="img" aria-label="reference and numerical solver trajectories">
            <line x1="40" y1="220" x2="540" y2="220" stroke="currentColor" strokeOpacity="0.25" />
            <line x1="40" y1="220" x2="40" y2="35" stroke="currentColor" strokeOpacity="0.25" />
            <polyline points={toPolyline(reference, maxY)} fill="none" className="stroke-muted-foreground" strokeOpacity="0.45" strokeWidth="5" />
            <polyline points={toPolyline(approximation, maxY)} fill="none" className="stroke-blue-600" strokeWidth="3" />
            {approximation.map(([s, y], index) => <circle key={index} cx={40 + s * 500} cy={220 - (y / maxY) * 175} r="5" className="fill-background stroke-blue-700 dark:stroke-blue-200" strokeWidth="2" />)}
          </svg>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border px-3 py-2 text-xs font-semibold text-muted-foreground"><span className="flex items-center gap-1.5"><i className="h-1 w-5 bg-muted-foreground/45" />reference</span><span className="flex items-center gap-1.5"><i className="h-0.5 w-5 bg-blue-600" />{solver} approximation</span><span>sampling progress s = 1 - t</span></div>
        </div>
        <aside aria-live="polite" className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <Gauge className="h-5 w-5" aria-hidden="true" />
          <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border lg:grid-cols-1">
            <div className="bg-background p-3"><dt className="text-xs font-bold uppercase text-muted-foreground">NFE</dt><dd className="mt-1 font-mono text-xl font-black">{nfe}</dd></div>
            <div className="bg-background p-3"><dt className="text-xs font-bold uppercase text-muted-foreground">Endpoint error</dt><dd className="mt-1 font-mono text-xl font-black">{error.toFixed(2)}%</dd></div>
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Heun은 step마다 field를 두 번 평가해 같은 step 수의 오차를 줄이지만 NFE는 늘어난다. 실제 wall-clock은 model token 수, CFG batching, kernel, VAE와 hardware까지 포함해 측정한다.</p>
        </aside>
      </div>
    </figure>
  );
}

const releaseAxes = [
  { id: 'quality', label: 'Fidelity', short: '선명도·artifact', status: 'pass' },
  { id: 'coverage', label: 'Coverage', short: 'rare style 누락', status: 'fail' },
  { id: 'composition', label: 'Composition', short: 'count·relation', status: 'fail' },
  { id: 'preference', label: 'Human', short: 'blind pairwise', status: 'pass' },
  { id: 'runtime', label: 'Runtime', short: 'p95·VRAM', status: 'warn' },
] as const;

export function GenerativeEvaluationGate() {
  const [candidateCount, setCandidateCount] = useState(1);
  const [fullGate, setFullGate] = useState(true);
  const visibleAxes = fullGate ? releaseAxes : releaseAxes.slice(0, 1);
  const releaseReady = releaseAxes.every((axis) => axis.status === 'pass');

  return (
    <figure data-generative-eval className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">RELEASE EVIDENCE</p>
        <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">좋은 demo와 배포 가능한 분포를 같은 말로 부르지 않는다</h3>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">아래 pass·fail은 평가 축의 역할을 보여 주기 위한 가상 후보 예시이며, 특정 공개 모델의 실측 점수가 아니다.</p>
      </figcaption>
      <div className="grid gap-4 border-b border-border bg-muted/15 p-4 sm:grid-cols-[minmax(0,1fr)_13rem] sm:items-end sm:p-5">
        <label className="min-w-0 text-xs font-semibold text-muted-foreground">Prompt당 생성 후보 · {candidateCount}장<input aria-label="candidate count" className="mt-3 block w-full accent-blue-700" type="range" min="1" max="9" step="1" value={candidateCount} onChange={(event) => setCandidateCount(Number(event.target.value))} /></label>
        <button type="button" aria-label="평가 표시 범위 전환" aria-pressed={fullGate} onClick={() => setFullGate((value) => !value)} className="min-h-11 rounded-md border border-border bg-background px-3 text-xs font-bold"><SlidersHorizontal className="mr-2 inline h-3.5 w-3.5" />표시 범위 · {fullGate ? '전체' : 'FID만'}</button>
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0">
          <div className="grid gap-2 sm:grid-cols-[repeat(auto-fit,minmax(6rem,1fr))]">
            {visibleAxes.map((axis) => (
              <div key={axis.id} className={`min-h-24 min-w-0 rounded-md border p-3 ${axis.status === 'pass' ? 'border-emerald-600/30 bg-emerald-500/[0.05]' : axis.status === 'fail' ? 'border-rose-600/30 bg-rose-500/[0.05]' : 'border-amber-600/30 bg-amber-500/[0.05]'}`}>
                <div className="flex items-start justify-between gap-2">
                  <strong className="text-xs">{axis.label}</strong>
                  <span className="flex items-center gap-1 text-xs font-bold">
                    {axis.status === 'pass' ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <TriangleAlert className="h-3.5 w-3.5" aria-hidden="true" />}
                    {axis.status === 'pass' ? '통과' : axis.status === 'fail' ? '실패' : '주의'}
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{axis.short}</p>
              </div>
            ))}
          </div>
          {!fullGate && <div className="mt-3 flex gap-3 rounded-md border border-rose-600/25 bg-rose-500/[0.05] p-4"><TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" /><p className="text-xs font-semibold leading-relaxed">FID 하나만 열면 mode dropping, count·relation 실패와 p95 latency가 평가 화면에서 사라진다. 사라진 실패가 해결된 것은 아니다.</p></div>}
          <div className="mt-3 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
            <div className="min-w-0 bg-background p-3"><p className="text-xs font-bold uppercase text-muted-foreground">Model calls</p><p className="mt-1 font-mono text-lg font-black">{candidateCount}× budget</p></div>
            <div className="min-w-0 bg-background p-3"><p className="text-xs font-bold uppercase text-muted-foreground">Selection</p><p className="mt-1 text-xs font-bold">{candidateCount === 1 ? '그대로 평가' : `reranker가 ${candidateCount}장 중 선택`}</p></div>
            <div className="min-w-0 bg-background p-3"><p className="text-xs font-bold uppercase text-muted-foreground">Model weights</p><p className="mt-1 text-xs font-bold">변하지 않음</p></div>
          </div>
        </div>
        <aside aria-live="polite" className={`min-w-0 border-t pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0 ${releaseReady ? 'border-emerald-600/35' : 'border-rose-600/35'}`}>
          {releaseReady ? <Sparkles className="h-5 w-5 text-emerald-700 dark:text-emerald-300" aria-hidden="true" /> : <TriangleAlert className="h-5 w-5 text-rose-700 dark:text-rose-300" aria-hidden="true" />}
          <p className="mt-3 text-xs font-bold uppercase text-muted-foreground">Decision</p>
          <p className="mt-1 text-xl font-black">{releaseReady ? 'release candidate' : 'hold'}</p>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">판정은 화면에 숨긴 축까지 항상 포함한다. Best-of-{candidateCount}은 허용 가능한 system 계약이며 model, candidate budget과 reranker를 함께 평가하고 Best-of-1 비용 기준선을 남긴다.</p>
        </aside>
      </div>
      <div className="flex min-w-0 items-start gap-3 border-t border-border px-4 py-4 sm:px-5"><CircleDot className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /><p className="text-xs font-semibold leading-relaxed">배포 manifest에는 checkpoint, VAE, text encoder, resolution, solver·NFE, CFG, precision, seed, 후보 수, reranker, postprocess와 hardware가 모두 들어간다.</p></div>
    </figure>
  );
}
