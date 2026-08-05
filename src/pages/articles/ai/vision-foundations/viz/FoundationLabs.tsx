import { useMemo, useState } from 'react';
import { Boxes, Focus, GitBranch, Grid3X3, Layers3, ScanLine, SplitSquareVertical } from 'lucide-react';

const frame = 'not-prose my-8 min-w-0 scroll-mt-28 overflow-hidden rounded-md border border-border bg-background';
const tab = 'min-h-11 min-w-0 px-3 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset';

const image = [
  [0, 0, 0, 1, 1],
  [0, 0, 0, 1, 1],
  [0, 0, 0, 1, 1],
  [0, 0, 0, 1, 1],
  [0, 0, 0, 1, 1],
];

const kernels = {
  edge: { label: '세로 경계', values: [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]] },
  blur: { label: '주변 평균', values: [[1 / 9, 1 / 9, 1 / 9], [1 / 9, 1 / 9, 1 / 9], [1 / 9, 1 / 9, 1 / 9]] },
  center: { label: '가운데 보존', values: [[0, 0, 0], [0, 1, 0], [0, 0, 0]] },
} as const;

function Header({ eyebrow, title, icon: Icon }: { eyebrow: string; title: string; icon: typeof Grid3X3 }) {
  return <div className="flex items-start gap-3 border-b border-border px-4 py-4 sm:px-5"><span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded bg-primary/10 text-primary"><Icon className="size-4" /></span><div className="min-w-0"><p className="font-mono text-[10px] font-black uppercase tracking-normal text-muted-foreground">{eyebrow}</p><p className="mt-1 text-sm font-black leading-snug">{title}</p></div></div>;
}

function Segments<T extends string>({ value, onChange, items }: { value: T; onChange: (value: T) => void; items: { value: T; label: string }[] }) {
  return <div className="grid border-b border-border bg-muted/30" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>{items.map((item) => <button key={item.value} type="button" onClick={() => onChange(item.value)} aria-pressed={value === item.value} className={`${tab} ${value === item.value ? 'bg-background text-foreground shadow-[inset_0_-2px_0_hsl(var(--primary))]' : 'text-muted-foreground hover:bg-background/70 hover:text-foreground'}`}>{item.label}</button>)}</div>;
}

export function ConvolutionProbeLab() {
  const [mode, setMode] = useState<keyof typeof kernels>('edge');
  const kernel = kernels[mode];
  const score = useMemo(() => {
    let total = 0;
    for (let r = 0; r < 3; r += 1) for (let c = 0; c < 3; c += 1) total += image[r + 1][c + 1] * kernel.values[r][c];
    return total;
  }, [kernel]);
  return <div data-convolution-probe data-kernel={mode} className={frame}>
    <Header eyebrow="Local operator" title="같은 3×3 weight가 모든 위치를 훑는다" icon={ScanLine} />
    <Segments value={mode} onChange={setMode} items={[{ value: 'edge', label: '경계 찾기' }, { value: 'blur', label: '평균 내기' }, { value: 'center', label: '원본 보존' }]} />
    <div className="grid min-w-0 gap-0 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
      <div className="min-w-0 p-5"><p className="mb-3 text-xs font-bold text-muted-foreground">입력의 5×5 밝기</p><div className="mx-auto grid aspect-square w-full max-w-56 grid-cols-5 overflow-hidden border border-border">{image.flatMap((row, r) => row.map((value, c) => <span key={`${r}-${c}`} className={`grid min-h-0 place-items-center border-b border-r border-border/60 text-[11px] font-black ${r >= 1 && r <= 3 && c >= 1 && c <= 3 ? 'ring-1 ring-inset ring-primary/60' : ''}`} style={{ background: value ? 'hsl(var(--foreground) / .86)' : 'hsl(var(--muted))', color: value ? 'hsl(var(--background))' : 'hsl(var(--foreground))' }}>{value}</span>))}</div></div>
      <div className="hidden w-px bg-border sm:block" />
      <div className="min-w-0 border-t border-border p-5 sm:border-t-0"><p className="mb-3 text-xs font-bold text-muted-foreground">{kernel.label} kernel</p><div className="mx-auto grid aspect-square w-full max-w-44 grid-cols-3 overflow-hidden border border-border">{kernel.values.flatMap((row, r) => row.map((value, c) => <span key={`${r}-${c}`} className="grid place-items-center border-b border-r border-border/60 bg-primary/5 font-mono text-xs font-black">{Number.isInteger(value) ? value : value.toFixed(2)}</span>))}</div><div className="mt-5 border-l-2 border-primary pl-3"><p className="text-xs font-bold text-muted-foreground">가운데 위치의 가중합</p><p className="mt-1 font-mono text-2xl font-black">{score.toFixed(2)}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Weight를 바꾸면 같은 입력도 다른 feature map이 된다. 학습은 이 weight를 찾는 과정이다.</p></div></div>
    </div>
  </div>;
}

type ConvGeometry = 'standard' | 'dilated' | 'depthwise';
export function ConvolutionGeometryLab() {
  const [mode, setMode] = useState<ConvGeometry>('standard');
  const copy = {
    standard: { title: 'Standard 3×3', points: ['모든 입력 channel을 함께 본다', 'locality + weight sharing', '출력 channel마다 하나의 filter bank'] },
    dilated: { title: 'Dilated 3×3', points: ['kernel 점 사이를 띄운다', 'parameter 수를 늘리지 않고 더 넓게 본다', '격자 artifact는 별도 확인'] },
    depthwise: { title: 'Depthwise + 1×1', points: ['channel별 spatial filter', '1×1에서 channel을 다시 섞는다', 'FLOPs보다 실제 device latency로 선택'] },
  }[mode];
  return <div data-convolution-geometry data-mode={mode} className={frame}>
    <Header eyebrow="Geometry & cost" title="Kernel 모양보다 연결 계약을 먼저 읽는다" icon={Focus} />
    <Segments value={mode} onChange={setMode} items={[{ value: 'standard', label: 'Standard' }, { value: 'dilated', label: 'Dilation' }, { value: 'depthwise', label: 'Depthwise' }]} />
    <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
      <div className="grid min-h-56 place-items-center p-6"><div className="relative grid size-44 grid-cols-7 overflow-hidden border border-border">{Array.from({ length: 49 }).map((_, index) => { const r = Math.floor(index / 7); const c = index % 7; const active = mode === 'dilated' ? [1, 3, 5].includes(r) && [1, 3, 5].includes(c) : r >= 2 && r <= 4 && c >= 2 && c <= 4; return <span key={index} className={`border-b border-r border-border/50 ${active ? 'bg-primary/75' : 'bg-muted/30'}`} />; })}</div></div>
      <div className="border-t border-border p-6 md:border-l md:border-t-0"><p className="text-xl font-black">{copy.title}</p><div className="mt-5 divide-y divide-border border-y border-border">{copy.points.map((point, index) => <div key={point} className="grid grid-cols-[2rem_1fr] gap-3 py-3"><span className="font-mono text-xs font-black text-primary">0{index + 1}</span><p className="text-sm leading-relaxed">{point}</p></div>)}</div></div>
    </div>
  </div>;
}

type ResidualMode = 'plain' | 'identity' | 'projection';
export function ResidualPathLab() {
  const [mode, setMode] = useState<ResidualMode>('identity');
  const [jacobian, setJacobian] = useState(-0.5);
  const [postActivation, setPostActivation] = useState(false);
  const data = {
    plain: { skip: '없음', out: 'y = F(x)', grad: 'gradient가 모든 변환의 Jacobian을 지나간다', state: '깊어질수록 identity조차 다시 학습' },
    identity: { skip: 'x 그대로', out: 'y = F(x) + x', grad: 'gradient에 직접 더해지는 1 경로가 생긴다', state: '필요 없으면 F(x) ≈ 0으로 둘 수 있음' },
    projection: { skip: 'Wₛx', out: 'y = F(x) + Wₛx', grad: 'shape을 맞춘 shortcut을 통과한다', state: 'stride·channel이 바뀌는 stage 경계' },
  }[mode];
  const shortcutGain = mode === 'plain' ? 0 : mode === 'identity' ? 1 : 0.5;
  const preActivationGain = jacobian + shortcutGain;
  const localGain = postActivation && preActivationGain <= 0 ? 0 : preActivationGain;
  return <div data-residual-path data-mode={mode} data-activation={postActivation ? 'v1-post' : 'clean-add'} data-jacobian={jacobian} className={frame}>
    <Header eyebrow="Residual computation" title="층이 무엇을 만들지보다 무엇을 보존할지 먼저 본다" icon={GitBranch} />
    <Segments value={mode} onChange={setMode} items={[{ value: 'plain', label: 'Plain' }, { value: 'identity', label: 'Identity skip' }, { value: 'projection', label: 'Projection' }]} />
    <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="min-w-0 p-5 sm:p-6">
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)_2rem_minmax(0,1fr)]"><div className="border-l-2 border-sky-500 bg-sky-500/5 p-4"><p className="font-mono text-[12px] font-black text-muted-foreground">INPUT</p><p className="mt-1 text-lg font-black">x</p></div><span className="grid place-items-center text-muted-foreground">→</span><div className="border-l-2 border-amber-500 bg-amber-500/5 p-4"><p className="font-mono text-[12px] font-black text-muted-foreground">RESIDUAL</p><p className="mt-1 text-lg font-black">F(x)</p></div><span className="grid place-items-center text-muted-foreground">→</span><div className="border-l-2 border-emerald-500 bg-emerald-500/5 p-4"><p className="font-mono text-[12px] font-black text-muted-foreground">OUTPUT</p><p className="mt-1 break-words text-lg font-black">{data.out}</p></div></div>
        {mode !== 'plain' && <div className="mt-3 border border-dashed border-primary/45 bg-primary/5 px-4 py-3"><p className="text-xs font-bold text-primary">Shortcut · {data.skip}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Main branch를 우회하지만 projection이면 backward의 직접 항도 I가 아니라 Wₛ다.</p></div>}
        <label className="mt-5 block text-xs font-bold"><span className="flex justify-between gap-3"><span>Residual local Jacobian J<sub className="text-xs">F</sub></span><span className="font-mono tabular-nums">{jacobian.toFixed(1)}</span></span><input aria-label="Residual local Jacobian" className="mt-2 min-h-11 w-full accent-sky-700" type="range" min="-1.5" max="1.5" step="0.5" value={jacobian} onChange={(event) => setJacobian(Number(event.target.value))} /></label>
        <button type="button" aria-pressed={postActivation} onClick={() => setPostActivation((value) => !value)} className={`${tab} mt-3 w-full border border-border ${postActivation ? 'bg-foreground text-background' : 'bg-background text-muted-foreground'}`}>Addition 뒤 ReLU gate · {postActivation ? 'ON (v1)' : 'OFF (clean path)'}</button>
      </div>
      <div className="border-t border-border lg:border-l lg:border-t-0"><div className="border-b border-border p-5"><p className="font-mono text-[12px] font-black text-muted-foreground">FORWARD</p><p className="mt-2 text-sm font-bold leading-relaxed">{data.state}</p></div><div className="p-5"><p className="font-mono text-[12px] font-black text-muted-foreground">LOCAL BACKWARD GAIN</p><p className="mt-2 font-mono text-3xl font-black tabular-nums">{localGain.toFixed(1)}</p><p className="mt-2 text-sm font-bold leading-relaxed">{data.grad}</p><p className="mt-3 text-xs leading-relaxed text-muted-foreground">{postActivation && preActivationGain <= 0 ? 'Addition 결과가 ReLU의 음수 영역이라 local gradient가 0이 됐다.' : preActivationGain === 0 ? 'Identity 항과 residual Jacobian이 상쇄됐다. Shortcut은 nonzero gradient를 보장하지 않는다.' : `현재 계산: ${shortcutGain.toFixed(1)} + (${jacobian.toFixed(1)})`}</p></div></div>
    </div>
  </div>;
}

export function ResidualStageLab() {
  const [stage, setStage] = useState<'same' | 'downsample'>('same');
  const [shortcut, setShortcut] = useState<'pad' | 'projection'>('projection');
  const down = stage === 'downsample';
  const shortcutLabel = !down ? 'identity → 56×56×64' : shortcut === 'projection' ? '1×1, s=2 → 28×28×128' : 'stride-2 subsample + zero pad';
  const mac = down && shortcut === 'projection' ? 28 * 28 * 64 * 128 : 0;
  return <div data-residual-stage data-stage={stage} data-shortcut={shortcut} className={frame}>
    <Header eyebrow="Shape contract" title="Addition 전에 H×W×C가 반드시 맞아야 한다" icon={Layers3} />
    <Segments value={stage} onChange={setStage} items={[{ value: 'same', label: '같은 stage' }, { value: 'downsample', label: 'Stage 전환' }]} />
    {down && <div className="grid grid-cols-2 gap-px border-b border-border bg-border">{(['pad', 'projection'] as const).map((value) => <button key={value} type="button" aria-pressed={shortcut === value} onClick={() => setShortcut(value)} className={`${tab} bg-background ${shortcut === value ? 'shadow-[inset_0_-2px_0_hsl(var(--primary))]' : 'text-muted-foreground'}`}>{value === 'pad' ? 'A · subsample + pad' : 'B · 1×1 projection'}</button>)}</div>}
    <div className="grid gap-px bg-border sm:grid-cols-3"><div className="bg-background p-5"><p className="text-xs font-bold text-muted-foreground">입력</p><p className="mt-2 font-mono text-lg font-black">56×56×64</p></div><div className="bg-background p-5"><p className="text-xs font-bold text-muted-foreground">Main branch</p><p className="mt-2 font-mono text-lg font-black">{down ? '28×28×128' : '56×56×64'}</p></div><div className="bg-background p-5"><p className="text-xs font-bold text-muted-foreground">Shortcut</p><p className="mt-2 break-words font-mono text-base font-black">{shortcutLabel}</p><p className="mt-2 text-xs text-muted-foreground">MAC {mac.toLocaleString()}</p></div></div>
    <div className={`border-t border-border px-5 py-4 ${down ? 'bg-amber-500/5' : 'bg-emerald-500/5'}`}><p className="text-sm font-bold">{down ? shortcut === 'projection' ? 'Shape을 학습 projection으로 맞춘다. Backward 직접 항은 Wₛ다.' : 'Parameter 없이 shape을 맞추지만 새 channel은 0으로 채운다.' : 'Shape이 같으므로 parameter 없는 identity shortcut이 가능하다.'}</p></div>
  </div>;
}

export function BottleneckCostLab() {
  const [kind, setKind] = useState<'basic' | 'bottleneck' | 'wide3x3'>('basic');
  const spatial = 56 * 56;
  const d = 64;
  const mac = kind === 'basic' ? 18 * spatial * d * d : kind === 'bottleneck' ? 17 * spatial * d * d : 288 * spatial * d * d;
  const copy = {
    basic: ['d → d → d', '3×3 두 번', '18·H·W·d²'],
    bottleneck: ['4d → d → d → 4d', '1×1 축소 · 3×3 · 1×1 복원', '17·H·W·d²'],
    wide3x3: ['4d → 4d → 4d', '3×3 두 번 · channel 축소 없음', '288·H·W·d²'],
  }[kind];
  return <div data-bottleneck-cost data-kind={kind} className={frame}>
    <Header eyebrow="Compute ledger · H=W=56, d=64" title="Bottleneck은 이름이 아니라 3×3이 보는 channel 폭을 줄이는 계산 계약이다" icon={Layers3} />
    <Segments value={kind} onChange={setKind} items={[{ value: 'basic', label: 'Basic' }, { value: 'bottleneck', label: 'Bottleneck' }, { value: 'wide3x3', label: 'Wide 3×3' }]} />
    <div className="grid gap-px bg-border sm:grid-cols-3">
      <div className="bg-background p-5"><p className="text-xs font-bold text-muted-foreground">Channel path</p><p className="mt-2 font-mono text-lg font-black">{copy[0]}</p></div>
      <div className="bg-background p-5"><p className="text-xs font-bold text-muted-foreground">Operator</p><p className="mt-2 text-sm font-black leading-relaxed">{copy[1]}</p><p className="mt-2 font-mono text-xs text-muted-foreground">{copy[2]}</p></div>
      <div className="bg-background p-5"><p className="text-xs font-bold text-muted-foreground">Multiply-accumulate</p><p className="mt-2 font-mono text-2xl font-black tabular-nums">{mac.toLocaleString()}</p></div>
    </div>
  </div>;
}

export function PatchBudgetLab() {
  const [patch, setPatch] = useState<8 | 16 | 32>(16);
  const cells = 224 / patch;
  const tokens = cells * cells;
  const relative = Math.round((tokens * tokens) / (196 * 196) * 100) / 100;
  return <div data-patch-budget data-patch={patch} className={frame}>
    <Header eyebrow="Token budget · 224×224 input" title="Patch가 작아지면 detail과 attention 비용이 함께 커진다" icon={Grid3X3} />
    <div className="grid grid-cols-3 border-b border-border bg-muted/30">{([32, 16, 8] as const).map((size) => <button key={size} type="button" onClick={() => setPatch(size)} aria-pressed={patch === size} className={`${tab} ${patch === size ? 'bg-background text-foreground shadow-[inset_0_-2px_0_hsl(var(--primary))]' : 'text-muted-foreground hover:bg-background/70 hover:text-foreground'}`}>P = {size}</button>)}</div>
    <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_16rem]"><div className="grid min-h-72 place-items-center p-6"><div className="grid aspect-square w-full max-w-64 overflow-hidden border border-border" style={{ gridTemplateColumns: `repeat(${cells}, minmax(0,1fr))` }}>{Array.from({ length: tokens }).map((_, index) => { const row = Math.floor(index / cells); const column = index % cells; const object = row > cells * .2 && row < cells * .82 && column > cells * .34 && column < cells * .68; const selected = row === Math.floor(cells * .46) && column === Math.floor(cells * .5); return <span key={index} className={`${patch === 8 ? 'border-b border-r border-border/35' : 'border-b border-r border-border/60'} ${selected ? 'bg-primary' : object ? 'bg-primary/15' : 'bg-muted/25'}`} />; })}</div></div><div className="grid content-start gap-px border-t border-border bg-border md:border-l md:border-t-0"><div className="bg-background p-5"><p className="text-xs font-bold text-muted-foreground">Patch grid</p><p className="mt-1 font-mono text-2xl font-black">{cells}×{cells}</p></div><div className="bg-background p-5"><p className="text-xs font-bold text-muted-foreground">Image tokens</p><p className="mt-1 font-mono text-2xl font-black">{tokens.toLocaleString()}</p></div><div className="bg-background p-5"><p className="text-xs font-bold text-muted-foreground">Attention matrix</p><p className="mt-1 font-mono text-2xl font-black">{tokens.toLocaleString()}²</p><p className="mt-1 text-xs text-muted-foreground">P=16 대비 {relative}×</p></div></div></div>
  </div>;
}

type ReadoutMode = 'cls' | 'mean' | 'dense';
export function ViTShapeReadoutLab() {
  const [resolution, setResolution] = useState<224 | 384>(224);
  const [tokenContract, setTokenContract] = useState<'with-cls' | 'patch-only'>('with-cls');
  const [readout, setReadout] = useState<ReadoutMode>('cls');
  const patch = 16;
  const batch = 2;
  const width = 768;
  const grid = resolution / patch;
  const patchTokens = grid * grid;
  const hasCls = tokenContract === 'with-cls';
  const sequence = patchTokens + (hasCls ? 1 : 0);
  const validReadout = readout !== 'cls' || hasCls;
  const output = !validReadout ? '사용 불가' : readout === 'dense' ? `[${batch}, ${patchTokens}, ${width}]` : `[${batch}, ${width}]`;

  return <div data-vit-shape-readout data-resolution={resolution} data-token-contract={tokenContract} data-readout={readout} data-readout-valid={validReadout ? 'true' : 'false'} className={frame}>
    <Header eyebrow="Shape · position · readout" title="Encoder token 계약과 downstream readout은 서로 다른 축이다" icon={SplitSquareVertical} />
    <div className="grid gap-px border-b border-border bg-border sm:grid-cols-3">
      <div className="grid grid-cols-2 gap-px bg-border">
        {([224, 384] as const).map((value) => <button key={value} type="button" aria-pressed={resolution === value} onClick={() => setResolution(value)} className={`${tab} bg-background ${resolution === value ? 'shadow-[inset_0_-2px_0_hsl(var(--primary))]' : 'text-muted-foreground hover:bg-muted/30'}`}>{value} px</button>)}
      </div>
      <div className="grid grid-cols-2 gap-px bg-border">
        {([['with-cls', 'CLS 포함'], ['patch-only', 'Patch만']] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={tokenContract === value} onClick={() => setTokenContract(value)} className={`${tab} bg-background ${tokenContract === value ? 'shadow-[inset_0_-2px_0_hsl(var(--primary))]' : 'text-muted-foreground hover:bg-muted/30'}`}>{label}</button>)}
      </div>
      <div className="grid grid-cols-3 gap-px bg-border">
        {([
          ['cls', 'CLS'],
          ['mean', '평균'],
          ['dense', 'Patch 전체'],
        ] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={readout === value} onClick={() => setReadout(value)} className={`${tab} bg-background ${readout === value ? 'shadow-[inset_0_-2px_0_hsl(var(--primary))]' : 'text-muted-foreground hover:bg-muted/30'}`}>{label}</button>)}
      </div>
    </div>
    <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_17rem]">
      <div className="min-w-0 p-4 sm:p-6">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ['입력', `[${batch}, 3, ${resolution}, ${resolution}]`, 'pixel tensor'],
            ['Patchify', `[${batch}, ${patchTokens}, 768]`, `${grid}×${grid}, P=${patch}`],
            ['Encoder 입력', `[${batch}, ${sequence}, ${width}]`, hasCls ? 'CLS 1자리 + patch token' : 'patch token만'],
            ['Task 출력', output, !validReadout ? 'CLS가 없어 0번 special token을 읽을 수 없음' : readout === 'dense' ? 'special token을 빼고 좌표별 feature 유지' : readout === 'cls' ? '0번 CLS token 선택' : 'patch 축만 평균'],
          ].map(([label, value, note]) => <div key={label} className={`min-w-0 border-l-2 p-4 ${label === 'Task 출력' && !validReadout ? 'border-red-500 bg-red-500/[0.045]' : 'border-primary/55 bg-primary/[0.04]'}`}><p className="text-[12px] font-bold text-muted-foreground">{label}</p><p className="mt-2 break-words font-mono text-sm font-black">{value}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{note}</p></div>)}
        </div>
        <div className="mt-5 grid items-center gap-2 text-center text-xs font-bold sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <span className="border border-border bg-muted/20 px-3 py-3">사전학습 position grid · 14×14</span>
          <span className="text-muted-foreground">→</span>
          <span className="border border-border bg-muted/20 px-3 py-3">{resolution === 224 ? '그대로 14×14' : 'patch 자리만 24×24로 2D 보간'}</span>
        </div>
      </div>
      <div className="border-t border-border bg-muted/15 p-5 lg:border-l lg:border-t-0">
        <p className="font-mono text-[12px] font-black text-primary">POSITION INVARIANT</p>
        <p className="mt-3 text-sm font-bold leading-relaxed">{resolution === 224 ? '학습한 patch 좌표와 입력 grid가 일치한다.' : hasCls ? 'CLS 자리는 보간하지 않고, 196개 patch 위치만 576개로 2D 보간한다.' : 'Special token 없이 196개 patch 위치를 576개로 2D 보간한다.'}</p>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Encoder에 CLS가 있어도 patch 평균이나 dense grid를 읽을 수 있다. 반대로 CLS가 없는 checkpoint에서 CLS readout을 요청하면 계약 오류다.</p>
      </div>
    </div>
  </div>;
}

type AttentionScope = 'global' | 'window';
export function VisionBackboneLab() {
  const [scope, setScope] = useState<AttentionScope>('global');
  const [hierarchy, setHierarchy] = useState(false);
  const visibleCells = hierarchy ? 16 : 64;
  const columns = hierarchy ? 4 : 8;
  const relation = scope === 'global' ? '한 layer에서 모든 현재 token 쌍을 비교' : '각 4×4 window 안에서 비교하고, 이웃 연결은 shift·다음 stage가 담당';
  const output = hierarchy ? 'Stage마다 grid를 줄인 multi-scale feature' : '같은 해상도의 token grid';
  return <div data-vision-backbone data-scope={scope} data-hierarchy={hierarchy ? 'on' : 'off'} className={frame}>
    <Header eyebrow="Backbone branch" title="Attention 범위와 stage 계층은 서로 다른 두 축이다" icon={Boxes} />
    <div className="grid gap-px border-b border-border bg-border sm:grid-cols-2">
      <div className="grid grid-cols-2 gap-px bg-border">
        {(['global', 'window'] as const).map((value) => <button key={value} type="button" aria-pressed={scope === value} onClick={() => setScope(value)} className={`${tab} bg-background ${scope === value ? 'shadow-[inset_0_-2px_0_hsl(var(--primary))]' : 'text-muted-foreground hover:bg-muted/30'}`}>{value === 'global' ? 'Global 범위' : 'Window 범위'}</button>)}
      </div>
      <button type="button" aria-pressed={hierarchy} onClick={() => setHierarchy((value) => !value)} className={`${tab} bg-background ${hierarchy ? 'shadow-[inset_0_-2px_0_hsl(var(--primary))]' : 'text-muted-foreground hover:bg-muted/30'}`}>계층형 stage · {hierarchy ? 'ON' : 'OFF'}</button>
    </div>
    <div className="grid gap-0 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <div className="grid min-h-64 place-items-center border-b border-border p-6 lg:border-b-0 lg:border-r">
        <div className="grid aspect-square w-full max-w-52 gap-px bg-border p-px" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}>
          {Array.from({ length: visibleCells }).map((_, index) => {
            const local = scope === 'window' && ((Math.floor(index / columns) < columns / 2 && index % columns < columns / 2) || (Math.floor(index / columns) >= columns / 2 && index % columns >= columns / 2));
            return <span key={index} className={`${scope === 'global' ? 'bg-primary/25' : local ? 'bg-sky-500/35' : 'bg-amber-500/20'}`} />;
          })}
        </div>
      </div>
      <div className="grid gap-px bg-border sm:grid-cols-3">
        {[['Attention 범위', relation], ['Stage 출력', output], ['현재 조합', `${scope === 'global' ? 'Global' : 'Window'} attention + ${hierarchy ? 'hierarchy' : 'single scale'}`]].map(([label, value]) => <div key={label} className="min-w-0 bg-background p-5"><p className="font-mono text-[12px] font-black text-primary">{label}</p><p className="mt-3 text-sm font-bold leading-relaxed">{value}</p></div>)}
      </div>
    </div>
  </div>;
}
