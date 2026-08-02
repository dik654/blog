import { useMemo, useState, type ReactNode } from 'react';
import {
  Activity,
  Bot,
  BrainCircuit,
  Camera,
  CheckCircle2,
  CircleDot,
  Clock3,
  Eye,
  Film,
  Gauge,
  GitBranch,
  Layers3,
  Move3d,
  RefreshCw,
  Route,
  ScanLine,
  ShieldCheck,
  Target,
  TriangleAlert,
  WandSparkles,
} from 'lucide-react';

function Figure({ eyebrow, title, children, footer, data }: { eyebrow: string; title: string; children: ReactNode; footer?: ReactNode; data: Record<string, string> }) {
  return (
    <figure {...data} className="foundation-viz-explorer not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{eyebrow}</p>
        <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">{title}</h3>
      </figcaption>
      {children}
      {footer && <div className="border-t border-border px-4 py-4 sm:px-5">{footer}</div>}
    </figure>
  );
}

function Segmented<T extends string>({ label, options, value, onChange }: { label: string; options: readonly { value: T; label: string }[]; value: T; onChange: (value: T) => void }) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-[9px] font-bold uppercase text-muted-foreground">{label}</p>
      <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((option) => (
          <button key={option.value} type="button" aria-pressed={option.value === value} onClick={() => onChange(option.value)} className={`min-h-11 min-w-0 bg-background px-1.5 text-[9px] font-bold leading-tight sm:text-[10px] ${option.value === value ? 'shadow-[inset_0_-2px_0_0_currentColor]' : 'text-muted-foreground hover:bg-muted/35'}`}>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value, note, tone = 'normal' }: { label: string; value: string; note: string; tone?: 'normal' | 'good' | 'warn' }) {
  const color = tone === 'good' ? 'text-emerald-700 dark:text-emerald-300' : tone === 'warn' ? 'text-rose-700 dark:text-rose-300' : '';
  return <div className="min-w-0 bg-background p-3"><p className="text-[9px] font-bold uppercase text-muted-foreground">{label}</p><p className={`mt-1 break-words font-mono text-lg font-black ${color}`}>{value}</p><p className="mt-1 text-[9px] leading-relaxed text-muted-foreground">{note}</p></div>;
}

const contracts = {
  interactive: {
    label: 'Interactive world', icon: WandSparkles,
    input: 'Text·image + user control', output: '다음 visual frame', action: '이동·prompt control', evidence: '시각적 일관성·반응성',
    boundary: 'Metric pose, contact와 robot actuator command를 보장하지 않는다.', tone: 'blue',
  },
  representation: {
    label: 'Latent predictor', icon: BrainCircuit,
    input: 'Context video + mask', output: '가려진 target latent', action: '없음', evidence: 'motion probe·transfer',
    boundary: '관찰에서 규칙을 배우지만 행동의 인과 효과는 직접 식별하지 않는다.', tone: 'violet',
  },
  dynamics: {
    label: 'Action dynamics', icon: Move3d,
    input: 'State + metric action', output: '다음 state 분포', action: '좌표·단위·시간이 명시됨', evidence: 'multi-step rollout·planning',
    boundary: 'Transition이 좋아도 search, constraint와 feedback이 없으면 planner가 아니다.', tone: 'emerald',
  },
  policy: {
    label: 'World-action / policy', icon: Bot,
    input: 'Observation + goal', output: 'Action 또는 action+future', action: '실행 가능한 control', evidence: 'real closed-loop success',
    boundary: '직접 policy와 explicit future rollout을 쓰는 model-based policy는 구분해야 한다.', tone: 'amber',
  },
} as const;

export function WorldModelContractExplorer() {
  const [mode, setMode] = useState<keyof typeof contracts>('dynamics');
  const active = contracts[mode];
  const Icon = active.icon;
  return (
    <Figure data={{ 'data-world-contract': '' }} eyebrow="WORLD MODEL CONTRACT LAB" title="같은 ‘world model’ 이름도 action이 들어가는 위치가 다르다" footer={<p className="text-xs font-semibold leading-relaxed">모델 이름 대신 input, predicted variable, action grounding과 strongest evidence를 읽는다. 네 칸 중 하나라도 문서에 없으면 planner 사용 가능성을 추정하지 않는다.</p>}>
      <div className="grid grid-cols-2 gap-px border-b border-border bg-border lg:grid-cols-4">
        {(Object.keys(contracts) as Array<keyof typeof contracts>).map((key) => {
          const ItemIcon = contracts[key].icon;
          return <button key={key} type="button" aria-pressed={mode === key} onClick={() => setMode(key)} className={`min-h-20 min-w-0 bg-background p-3 text-left ${mode === key ? 'shadow-[inset_0_-3px_0_0_currentColor]' : 'text-muted-foreground'}`}><ItemIcon className="h-4 w-4" /><strong className="mt-2 block break-words text-[10px] sm:text-xs">{contracts[key].label}</strong></button>;
        })}
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0">
          <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
            {[
              ['INPUT', active.input], ['PREDICT', active.output], ['ACTION GROUNDING', active.action], ['STRONGEST EVIDENCE', active.evidence],
            ].map(([label, value]) => <div key={label} className="min-h-24 bg-background p-4"><p className="text-[9px] font-bold text-muted-foreground">{label}</p><p className="mt-3 text-sm font-bold leading-snug">{value}</p></div>)}
          </div>
          <div className="mt-3 flex min-w-0 items-start gap-3 rounded-md border border-border bg-muted/10 p-4"><GitBranch className="mt-0.5 h-4 w-4 shrink-0" /><p className="text-xs font-semibold leading-relaxed">{active.boundary}</p></div>
        </div>
        <aside className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <Icon className="h-5 w-5" />
          <p className="mt-3 text-[10px] font-bold uppercase text-muted-foreground">Selected contract</p>
          <p className="mt-1 text-xl font-black leading-tight">{active.label}</p>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">‘Controllable’이라는 단어만으로 action의 물리 단위와 좌표계가 있다는 뜻은 아니다. 실제 actuator command와 연결되는지 별도로 확인한다.</p>
        </aside>
      </div>
    </Figure>
  );
}

const patchCells = Array.from({ length: 32 }, (_, index) => index);

export function PredictiveRepresentationExplorer() {
  const [target, setTarget] = useState<'pixel' | 'latent'>('latent');
  const [maskRatio, setMaskRatio] = useState(50);
  const maskedCount = Math.round(patchCells.length * maskRatio / 100);
  const masked = useMemo(() => new Set(patchCells.filter((_, index) => (index * 7 + 3) % patchCells.length < maskedCount)), [maskedCount]);
  const outputCount = target === 'pixel' ? maskedCount * 3 : Math.ceil(maskedCount / 4);

  return (
    <Figure data={{ 'data-predictive-representation': '' }} eyebrow="PREDICTIVE REPRESENTATION LAB" title="예측 target을 바꾸면 모델이 중요하게 보는 오차가 달라진다" footer={<p className="text-xs font-semibold leading-relaxed">Latent target은 unpredictable texture를 모두 복원하지 않아도 된다. 대신 target encoder가 control-relevant state를 보존했는지는 별도 probe와 action post-training으로 확인한다.</p>}>
      <div className="grid gap-4 border-b border-border bg-muted/15 p-4 sm:grid-cols-[13rem_minmax(0,1fr)] sm:items-end sm:p-5">
        <Segmented label="Prediction target" options={[{ value: 'pixel', label: 'Pixel reconstruction' }, { value: 'latent', label: 'Latent prediction' }]} value={target} onChange={setTarget} />
        <label className="text-xs font-semibold text-muted-foreground">가릴 patch · {maskRatio}%<input aria-label="masked patch ratio" type="range" min="25" max="75" step="25" value={maskRatio} onChange={(event) => setMaskRatio(Number(event.target.value))} className="mt-3 block w-full accent-blue-700" /></label>
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)] sm:items-center">
            <div className="rounded-md border border-border p-3"><div className="mb-3 flex items-center justify-between text-[9px] font-bold text-muted-foreground"><span>CONTEXT VIDEO TOKENS</span><span>{32 - maskedCount} visible</span></div><div className="grid grid-cols-8 gap-1">{patchCells.map((cell) => <i key={cell} className={`aspect-square rounded-[2px] border ${masked.has(cell) ? 'border-dashed border-border bg-muted/15' : 'border-blue-600/30 bg-blue-500/15'}`} />)}</div></div>
            <Route className="mx-auto h-5 w-5 rotate-90 text-muted-foreground sm:rotate-0" />
            <div className={`rounded-md border p-3 ${target === 'latent' ? 'border-violet-600/30 bg-violet-500/[0.045]' : 'border-emerald-600/30 bg-emerald-500/[0.045]'}`}><div className="flex items-center gap-2"><Layers3 className="h-4 w-4" /><strong className="text-xs">{target === 'latent' ? 'Target encoder feature' : 'RGB target patch'}</strong></div><div className="mt-4 grid grid-cols-6 gap-1">{Array.from({ length: Math.min(outputCount, 24) }, (_, index) => <i key={index} className={`h-3 rounded-[2px] ${target === 'latent' ? 'bg-violet-500/35' : 'bg-emerald-500/35'}`} />)}</div><p className="mt-4 text-[9px] leading-relaxed text-muted-foreground">{target === 'latent' ? '의미·motion에 필요한 compact feature를 비교' : '색·조명·texture를 포함한 관측 값을 직접 비교'}</p></div>
          </div>
          <div className="mt-3 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
            <Metric label="visible context" value={`${32 - maskedCount}`} note="encoder input patches" />
            <Metric label="prediction values" value={`${outputCount}`} note={target === 'latent' ? 'illustrative latent groups' : 'illustrative RGB groups'} />
            <Metric label="action causality" value="not learned" note="action label이 없음" tone="warn" />
          </div>
        </div>
        <aside className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <Eye className="h-5 w-5" />
          <p className="mt-3 text-sm font-bold">{target === 'latent' ? '보이는 모든 것을 복사하지 않는다' : '관측 fidelity를 직접 최적화한다'}</p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{target === 'latent' ? '예측하기 어렵고 task와 무관한 pixel detail을 target encoder가 줄일 수 있다. 그러나 작은 물체나 contact cue까지 지우면 planning에는 실패한다.' : '생성 품질과 visual likelihood에 유리하지만 조명·texture 오차가 loss를 지배할 수 있고 반복 rollout 비용이 커진다.'}</p>
        </aside>
      </div>
    </Figure>
  );
}

const dynamicsModes = {
  forward: { label: 'Forward', video: ['clean', 'predict', 'predict'], action: ['clean', 'clean'], question: '이 action을 하면 무엇이 보일까?', color: 'emerald' },
  inverse: { label: 'Inverse', video: ['clean', 'clean', 'clean'], action: ['predict', 'predict'], question: '이 변화는 어떤 action으로 생겼을까?', color: 'blue' },
  joint: { label: 'Joint policy', video: ['clean', 'predict', 'predict'], action: ['predict', 'predict'], question: '어떤 action과 future를 함께 만들까?', color: 'violet' },
} as const;

const frames = {
  base: { label: 'Robot base', action: 'Δx=+4 cm · Δyaw=+6°', risk: 'Base calibration이 맞으면 camera가 달라도 물리 명령은 유지된다.' },
  camera: { label: 'Camera', action: 'Δu=+31 px · Δv=-8 px', risk: 'Pixel motion은 camera가 움직이면 같은 물리 action을 뜻하지 않는다.' },
  effector: { label: 'End effector', action: 'ΔT⁽ᴱ⁾ · gripper close', risk: 'Local command는 tool frame과 gripper convention을 함께 기록해야 한다.' },
} as const;

export function ActionDynamicsExplorer() {
  const [mode, setMode] = useState<keyof typeof dynamicsModes>('forward');
  const [frame, setFrame] = useState<keyof typeof frames>('base');
  const active = dynamicsModes[mode];
  const basis = frames[frame];
  return (
    <Figure data={{ 'data-action-dynamics': '' }} eyebrow="ACTION DYNAMICS LAB" title="Clean token과 예측 token의 위치가 학습 질문을 결정한다" footer={<p className="text-xs font-semibold leading-relaxed">Action aₜ는 frame vₜ₋₁과 vₜ 사이의 물리 변화다. 좌표계, 단위와 timestamp가 빠지면 같은 숫자가 다른 intervention을 뜻할 수 있다.</p>}>
      <div className="grid gap-4 border-b border-border bg-muted/15 p-4 sm:grid-cols-2 sm:p-5">
        <Segmented label="Conditional direction" options={(Object.keys(dynamicsModes) as Array<keyof typeof dynamicsModes>).map((value) => ({ value, label: dynamicsModes[value].label }))} value={mode} onChange={setMode} />
        <Segmented label="Action coordinate" options={(Object.keys(frames) as Array<keyof typeof frames>).map((value) => ({ value, label: frames[value].label }))} value={frame} onChange={setFrame} />
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0">
          <div className="rounded-md border border-border p-3 sm:p-4">
            <div className="grid grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)_3.5rem_minmax(0,1fr)] items-center gap-1">
              {active.video.flatMap((state, index) => {
                const items: ReactNode[] = [<div key={`v-${index}`} className={`min-w-0 rounded-md border p-2 text-center ${state === 'predict' ? 'border-violet-600/30 bg-violet-500/[0.06]' : 'border-border bg-muted/10'}`}><Film className="mx-auto h-4 w-4" /><strong className="mt-2 block font-mono text-[9px]">v{index}</strong><span className="mt-1 block text-[9px] text-muted-foreground">{state === 'predict' ? '예측' : '관측'}</span></div>];
                if (index < 2) items.push(<div key={`a-${index}`} className={`min-w-0 rounded-md border px-1 py-3 text-center ${active.action[index] === 'predict' ? 'border-blue-600/30 bg-blue-500/[0.06]' : 'border-emerald-600/30 bg-emerald-500/[0.06]'}`}><Move3d className="mx-auto h-3.5 w-3.5" /><strong className="mt-1 block font-mono text-xs">a{index + 1}</strong><span className="mt-1 block text-xs text-muted-foreground">{active.action[index] === 'predict' ? '예측' : '조건'}</span></div>);
                return items;
              })}
            </div>
            <div className="mt-4 border-t border-border pt-4"><p className="text-[9px] font-bold uppercase text-muted-foreground">Model question</p><p className="mt-2 text-sm font-bold">{active.question}</p></div>
          </div>
          <div className="mt-3 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
            <Metric label="frame basis" value={basis.label} note="action vector 기준" />
            <Metric label="example action" value={basis.action} note="단위까지 contract에 포함" />
            <Metric label="time alignment" value="aₜ: vₜ₋₁→vₜ" note="sensor·action clock" tone="good" />
          </div>
        </div>
        <aside className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <Camera className="h-5 w-5" />
          <p className="mt-3 text-sm font-bold">{basis.label} 기준</p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{basis.risk}</p>
          <div className="mt-4 border-t border-border pt-4 text-[10px] leading-relaxed text-muted-foreground">Camera가 바뀐 배포에서는 visual representation의 domain shift와 action frame의 calibration error를 따로 측정한다.</div>
        </aside>
      </div>
    </Figure>
  );
}

export function ClosedLoopPlannerExplorer() {
  const [horizon, setHorizon] = useState(3);
  const [stepError, setStepError] = useState(4);
  const [openLoopSteps, setOpenLoopSteps] = useState(1);
  const [candidateCount, setCandidateCount] = useState(400);
  const [refinements, setRefinements] = useState(5);
  const [effectiveBatch, setEffectiveBatch] = useState(100);
  const predictedDrift = stepError * openLoopSteps;
  const perRolloutMs = 1.2;
  const overheadMs = 24;
  const compute = Math.round((candidateCount * refinements * horizon * perRolloutMs) / effectiveBatch + overheadMs);
  const designFits = predictedDrift <= 18 && compute <= 500 && openLoopSteps <= 2;
  const paths = useMemo(() => Array.from({ length: 6 }, (_, index) => {
    const bend = 36 + index * 17 + horizon * 3;
    const endY = 92 + (index - 2.5) * 16;
    return `M 54 170 C ${160 + index * 8} ${bend}, ${330 - index * 4} ${218 - bend / 2}, 548 ${endY}`;
  }), [horizon]);
  return (
    <Figure data={{ 'data-closed-loop-planner': '' }} eyebrow="CLOSED-LOOP PLANNING LAB" title="Rollout 길이, 탐색량과 현실 재관측을 따로 계산한다" footer={<p className="text-xs font-semibold leading-relaxed">이 lab의 1.2 ms/rollout과 24 ms overhead는 계산 구조를 보여 주는 가상 fixture다. 실제 release에는 profiler로 얻은 effective batch, p95 latency와 robot stop distance가 필요하다. V-JEPA 2의 공개 800×10·H1 결과는 별도로 약 16초/action이었다.</p>}>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 border-b border-border bg-muted/15 p-4 sm:grid-cols-3 sm:gap-x-5 sm:p-5">
        <label className="text-xs font-semibold text-muted-foreground">Planning horizon H · {horizon}<input aria-label="planning horizon" type="range" min="1" max="8" value={horizon} onChange={(event) => setHorizon(Number(event.target.value))} className="mt-2 block h-11 w-full accent-blue-700" /></label>
        <label className="text-xs font-semibold text-muted-foreground">후보 수 N · {candidateCount}<input aria-label="candidate count" type="range" min="100" max="800" step="100" value={candidateCount} onChange={(event) => setCandidateCount(Number(event.target.value))} className="mt-2 block h-11 w-full accent-blue-700" /></label>
        <label className="text-xs font-semibold text-muted-foreground">CEM 반복 R · {refinements}<input aria-label="refinement count" type="range" min="1" max="10" value={refinements} onChange={(event) => setRefinements(Number(event.target.value))} className="mt-2 block h-11 w-full accent-blue-700" /></label>
        <label className="text-xs font-semibold text-muted-foreground">Effective batch B · {effectiveBatch}<input aria-label="effective batch" type="range" min="50" max="400" step="50" value={effectiveBatch} onChange={(event) => setEffectiveBatch(Number(event.target.value))} className="mt-2 block h-11 w-full accent-blue-700" /></label>
        <label className="text-xs font-semibold text-muted-foreground">One-step error · {stepError}%<input aria-label="one step model error" type="range" min="1" max="12" value={stepError} onChange={(event) => setStepError(Number(event.target.value))} className="mt-2 block h-11 w-full accent-blue-700" /></label>
        <label className="text-xs font-semibold text-muted-foreground">재관측 전 실행 · {openLoopSteps} action<input aria-label="open loop execution steps" type="range" min="1" max="4" value={openLoopSteps} onChange={(event) => setOpenLoopSteps(Number(event.target.value))} className="mt-2 block h-11 w-full accent-blue-700" /></label>
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0">
          <div className="overflow-hidden rounded-md border border-border bg-muted/10">
            <svg viewBox="0 0 600 240" className="block aspect-[5/2] w-full" role="img" aria-label="CEM candidate action trajectories around an obstacle toward a goal">
              <rect x="264" y="84" width="92" height="88" rx="8" className="fill-rose-500/10 stroke-rose-600/35" strokeWidth="2" />
              <text x="310" y="134" textAnchor="middle" className="fill-rose-700 text-[15px] font-bold dark:fill-rose-300">위험 영역</text>
              <circle cx="54" cy="170" r="18" className="fill-blue-500/15 stroke-blue-600/50" strokeWidth="2" />
              <text x="54" y="209" textAnchor="middle" className="fill-current text-[16px] font-bold">현재</text>
              <circle cx="548" cy="92" r="22" className="fill-emerald-500/10 stroke-emerald-600/55" strokeWidth="2" />
              <text x="548" y="98" textAnchor="middle" className="fill-emerald-700 text-[16px] font-bold dark:fill-emerald-300">GOAL</text>
              {paths.map((path, index) => <path key={path} d={path} fill="none" className={index === 1 ? 'stroke-emerald-600' : index === 3 ? 'stroke-rose-500/45' : 'stroke-foreground/18'} strokeWidth={index === 1 ? 4 : 2} strokeDasharray={index === 3 ? '6 5' : undefined} strokeLinecap="round" />)}
              <circle cx="359" cy="112" r="5" className="fill-rose-600" />
            </svg>
            <div className="grid grid-cols-3 gap-px border-t border-border bg-border text-[9px] font-bold leading-tight">
              <div className="flex min-w-0 items-center gap-2 bg-background px-2 py-2.5"><i className="h-0.5 w-5 shrink-0 rounded-full bg-emerald-600" /><span>선택 궤적</span></div>
              <div className="flex min-w-0 items-center gap-2 bg-background px-2 py-2.5"><i className="h-0.5 w-5 shrink-0 border-t-2 border-dashed border-rose-500" /><span>제약 위반</span></div>
              <div className="flex min-w-0 items-center gap-2 bg-background px-2 py-2.5"><i className="h-3 w-5 shrink-0 rounded-[2px] border border-rose-500/50 bg-rose-500/10" /><span>위험 영역</span></div>
            </div>
          </div>
          <div className="mt-3 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
            <Metric label="open-loop drift bound" value={`${predictedDrift}%`} note={`${stepError}% × 실제 실행 ${openLoopSteps}`} tone={predictedDrift <= 18 ? 'good' : 'warn'} />
            <Metric label="illustrative wall estimate" value={`${compute} ms`} note={`N${candidateCount} × R${refinements} × H${horizon} ÷ B${effectiveBatch} + overhead`} tone={compute <= 500 ? 'good' : 'warn'} />
            <Metric label="execute" value={openLoopSteps === 1 ? 'first action' : `${openLoopSteps} actions`} note="then reobserve" tone={openLoopSteps <= 2 ? 'good' : 'warn'} />
          </div>
        </div>
        <aside className={`min-w-0 border-t pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0 ${designFits ? 'border-emerald-600/35' : 'border-rose-600/35'}`}>
          {designFits ? <ShieldCheck className="h-5 w-5 text-emerald-700 dark:text-emerald-300" /> : <TriangleAlert className="h-5 w-5 text-rose-700 dark:text-rose-300" />}
          <p className="mt-3 text-[10px] font-bold uppercase text-muted-foreground">Design estimate</p>
          <p className="mt-1 text-xl font-black">{designFits ? '실측 후보' : '설계 수정'}</p>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{designFits ? '가상 계산에서는 budget 안에 든다. 아직 action을 release할 근거는 아니다. 같은 N·R·H·batch로 profiler와 real closed-loop trial을 실행한다.' : '탐색량, model error 또는 open-loop 실행이 가상 budget을 넘겼다. 병렬 batch와 재관측 주기를 바꾼 뒤 profiler에서 다시 측정한다.'}</p>
        </aside>
      </div>
      <div className="grid gap-3 border-t border-border px-4 py-4 text-xs sm:grid-cols-3 sm:px-5">
        <div className="flex items-start gap-2"><ScanLine className="mt-0.5 h-4 w-4 shrink-0" /><span><strong>Observe</strong><br /><span className="text-muted-foreground">부분 관측에서 현재 latent 갱신</span></span></div>
        <div className="flex items-start gap-2"><Activity className="mt-0.5 h-4 w-4 shrink-0" /><span><strong>Search</strong><br /><span className="text-muted-foreground">goal·risk·uncertainty로 후보 채점</span></span></div>
        <div className="flex items-start gap-2"><RefreshCw className="mt-0.5 h-4 w-4 shrink-0" /><span><strong>Replan</strong><br /><span className="text-muted-foreground">첫 action 뒤 현실 feedback 반영</span></span></div>
      </div>
    </Figure>
  );
}

export function WorldModelReleaseGate() {
  const [cameraShift, setCameraShift] = useState(25);
  const [cameraTilt, setCameraTilt] = useState(12);
  const [uncertainty, setUncertainty] = useState(8);
  const [minimumClearance, setMinimumClearance] = useState(12);
  const [latencyP95, setLatencyP95] = useState(460);
  const [closedLoopSuccess, setClosedLoopSuccess] = useState(92);
  const [trialCount, setTrialCount] = useState(40);
  const [calibrationReceipt, setCalibrationReceipt] = useState(false);
  const [constraintReceipt, setConstraintReceipt] = useState(false);
  const [latencyReceipt, setLatencyReceipt] = useState(false);
  const [closedLoopReceipt, setClosedLoopReceipt] = useState(false);
  const successRate = closedLoopSuccess / 100;
  const z95 = 1.96;
  const wilsonDenominator = 1 + (z95 ** 2) / trialCount;
  const wilsonCenter = successRate + (z95 ** 2) / (2 * trialCount);
  const wilsonMargin = z95 * Math.sqrt((successRate * (1 - successRate) + (z95 ** 2) / (4 * trialCount)) / trialCount);
  const wilsonLower = ((wilsonCenter - wilsonMargin) / wilsonDenominator) * 100;
  const gates = [
    { label: 'Frame', measured: calibrationReceipt, pass: calibrationReceipt && cameraShift <= 30 && cameraTilt <= 15, note: `${cameraShift} cm · ${cameraTilt}° · camera/gripper calibration` },
    { label: 'Dynamics', measured: true, pass: uncertainty <= 10, note: `${uncertainty}% · OOD action uncertainty` },
    { label: 'Constraint', measured: constraintReceipt, pass: constraintReceipt && minimumClearance >= 10, note: `${minimumClearance} mm · collision clearance` },
    { label: 'Latency', measured: latencyReceipt, pass: latencyReceipt && latencyP95 <= 500, note: `${latencyP95} ms · measured p95` },
    { label: 'Closed loop', measured: closedLoopReceipt, pass: closedLoopReceipt && trialCount >= 100 && wilsonLower >= 90, note: `${closedLoopSuccess}% · n=${trialCount} · 95% 하한 ${wilsonLower.toFixed(1)}%` },
  ];
  const release = gates.every((gate) => gate.pass);
  return (
    <Figure data={{ 'data-world-release': '' }} eyebrow="WORLD MODEL RELEASE LAB" title="Offline prediction이 좋아도 실제 action release는 별도 gate다" footer={<p className="text-xs font-semibold leading-relaxed">Goal latent 거리 하나로 release하지 않는다. 새 camera, action uncertainty, workspace constraint, planning latency와 real closed-loop trial을 독립 gate로 둔다.</p>}>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 border-b border-border bg-muted/15 p-4 sm:grid-cols-3 sm:gap-x-5 sm:p-5">
        <label className="text-xs font-semibold text-muted-foreground">Camera shift · {cameraShift} cm<input aria-label="camera position shift" type="range" min="0" max="60" step="5" value={cameraShift} onChange={(event) => setCameraShift(Number(event.target.value))} className="mt-2 block h-11 w-full accent-blue-700" /></label>
        <label className="text-xs font-semibold text-muted-foreground">Camera tilt · {cameraTilt}°<input aria-label="camera tilt shift" type="range" min="0" max="30" step="2" value={cameraTilt} onChange={(event) => setCameraTilt(Number(event.target.value))} className="mt-2 block h-11 w-full accent-blue-700" /></label>
        <label className="text-xs font-semibold text-muted-foreground">Dynamics uncertainty · {uncertainty}%<input aria-label="dynamics uncertainty" type="range" min="2" max="24" step="2" value={uncertainty} onChange={(event) => setUncertainty(Number(event.target.value))} className="mt-2 block h-11 w-full accent-blue-700" /></label>
        <label className="text-xs font-semibold text-muted-foreground">Minimum clearance · {minimumClearance} mm<input aria-label="minimum collision clearance" type="range" min="0" max="30" step="2" value={minimumClearance} onChange={(event) => setMinimumClearance(Number(event.target.value))} className="mt-2 block h-11 w-full accent-blue-700" /></label>
        <label className="text-xs font-semibold text-muted-foreground">Planning p95 · {latencyP95} ms<input aria-label="planning p95 latency" type="range" min="200" max="900" step="20" value={latencyP95} onChange={(event) => setLatencyP95(Number(event.target.value))} className="mt-2 block h-11 w-full accent-blue-700" /></label>
        <label className="text-xs font-semibold text-muted-foreground">Real success · {closedLoopSuccess}%<input aria-label="closed loop task success" type="range" min="80" max="100" step="1" value={closedLoopSuccess} onChange={(event) => setClosedLoopSuccess(Number(event.target.value))} className="mt-2 block h-11 w-full accent-blue-700" /></label>
        <label className="text-xs font-semibold text-muted-foreground">Real trials · {trialCount}<input aria-label="closed loop trial count" type="range" min="20" max="200" step="20" value={trialCount} onChange={(event) => setTrialCount(Number(event.target.value))} className="mt-2 block h-11 w-full accent-blue-700" /></label>
      </div>
      <div className="grid grid-cols-2 gap-px border-b border-border bg-border sm:grid-cols-4">
        {[
          ['calibration measurement receipt', 'Camera pose·gripper mapping', calibrationReceipt, setCalibrationReceipt],
          ['constraint measurement receipt', 'Collision clearance', constraintReceipt, setConstraintReceipt],
          ['latency measurement receipt', 'p95 profiler', latencyReceipt, setLatencyReceipt],
          ['closed loop measurement receipt', 'Real n≥100 cohort', closedLoopReceipt, setClosedLoopReceipt],
        ].map(([ariaLabel, label, checked, setter]) => (
          <label key={String(ariaLabel)} className="flex min-h-11 cursor-pointer items-center gap-2 bg-background px-3 py-2 text-[10px] font-bold leading-tight">
            <input aria-label={String(ariaLabel)} type="checkbox" checked={Boolean(checked)} onChange={(event) => (setter as (value: boolean) => void)(event.target.checked)} className="h-4 w-4 accent-blue-700" />
            <span>{String(label)}</span>
          </label>
        ))}
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">{gates.map((gate) => {
          const state = !gate.measured ? 'unmeasured' : gate.pass ? 'pass' : 'fail';
          return <div key={gate.label} data-gate-state={state} className={`min-h-24 rounded-md border p-3 ${state === 'pass' ? 'border-emerald-600/30 bg-emerald-500/[0.05]' : state === 'fail' ? 'border-rose-600/30 bg-rose-500/[0.05]' : 'border-border bg-muted/15'}`}><div className="flex items-center justify-between gap-2"><strong className="text-[10px]">{gate.label}</strong>{state === 'pass' ? <CheckCircle2 className="h-3.5 w-3.5" /> : state === 'fail' ? <CircleDot className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />}</div><p className="mt-2 text-[9px] font-bold">{state === 'unmeasured' ? '미측정' : state === 'pass' ? '통과' : '실패'}</p><p className="mt-2 text-[9px] leading-relaxed text-muted-foreground">{gate.note}</p></div>;
        })}</div>
        <aside className={`min-w-0 border-t pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0 ${release ? 'border-emerald-600/35' : 'border-rose-600/35'}`}>
          {release ? <Target className="h-5 w-5 text-emerald-700 dark:text-emerald-300" /> : <Gauge className="h-5 w-5 text-rose-700 dark:text-rose-300" />}
          <p className="mt-3 text-[10px] font-bold uppercase text-muted-foreground">Decision</p><p className="mt-1 text-xl font-black">{release ? 'release' : 'hold'}</p>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{release ? '모든 독립 gate가 닫혔다. 새 object와 lighting slice에서도 같은 기준으로 반복한다.' : 'Model demo가 좋아도 실패한 gate가 있다. 해당 원인을 재현 trace로 고정하고 다시 검증한다.'}</p>
        </aside>
      </div>
      <div className="flex items-start gap-3 border-t border-border px-4 py-4 sm:px-5"><Clock3 className="mt-0.5 h-4 w-4 shrink-0" /><p className="text-xs font-semibold leading-relaxed">Trace에는 sensor timestamp, camera calibration version, current/goal latent, sampled action sequence, elite score, constraint reject reason, executed action과 next observation을 같은 episode clock으로 남긴다.</p></div>
    </Figure>
  );
}
