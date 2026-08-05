import { useMemo, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Braces,
  Check,
  CircleGauge,
  FileCheck2,
  Film,
  GitCommitHorizontal,
  Image,
  Layers3,
  LockKeyhole,
  PackageCheck,
  SlidersHorizontal,
  Sparkles,
  TriangleAlert,
  WandSparkles,
} from 'lucide-react';
import { articlePath } from '@/lib/paths';

function Figure({
  eyebrow,
  title,
  children,
  footer,
  data,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  data: Record<string, string>;
}) {
  return (
    <figure {...data} className="foundation-viz-explorer not-prose my-8 min-w-0 scroll-mt-28 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-bold uppercase text-muted-foreground">{eyebrow}</p>
        <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">{title}</h3>
      </figcaption>
      {children}
      {footer && <div className="border-t border-border px-4 py-4 sm:px-5">{footer}</div>}
    </figure>
  );
}

function Metric({ label, value, note, tone = 'normal', stable = false }: { label: string; value: string; note: string; tone?: 'normal' | 'good' | 'warn'; stable?: boolean }) {
  const toneClass = tone === 'good'
    ? 'text-emerald-700 dark:text-emerald-300'
    : tone === 'warn'
      ? 'text-rose-700 dark:text-rose-300'
      : 'text-foreground';

  return (
    <div className={`${stable ? 'grid h-[5.25rem] grid-cols-[5.25rem_minmax(0,1fr)] items-center gap-x-3 sm:block sm:h-36' : 'min-h-30 sm:min-h-32'} min-w-0 bg-background p-3 sm:p-4`}>
      <p className="text-xs font-bold uppercase text-muted-foreground">{label}</p>
      <p className={`${stable ? 'mt-0 sm:mt-1' : 'mt-1'} break-words font-mono text-base font-black leading-tight sm:text-lg ${toneClass}`}>{value}</p>
      <p className={`${stable ? 'hidden sm:block' : ''} mt-1 text-xs leading-relaxed text-muted-foreground`}>{note}</p>
    </div>
  );
}

type GoalKey = 'type' | 'edit' | 'explore' | 'video';

const goals = {
  type: {
    label: '한국어 패키지',
    icon: Braces,
    hardConstraint: '문구 exact match · 줄바꿈 · 지정 box · 2K 납품',
    control: '문자열 + layout box + palette',
    evidence: 'Ideogram 4.0 · Qwen-Image-2.0 · FLUX.2 flex',
    boundary: '모델 이름만으로 확정하지 않고 exact-string suite를 직접 통과시킨다.',
    route: 'Image runtime → manifest → parameter budget',
    branchSlug: 'image-model-runtime',
    branchPath: 'ai-open-image-current-first',
    branchLabel: 'Image 제작 경로 시작',
  },
  edit: {
    label: '제품 정체성 편집',
    icon: Layers3,
    hardConstraint: '로고·형태·색상 보존 · 배경과 문구만 변경',
    control: '다중 reference + mask + edit instruction',
    evidence: 'FLUX.2 multi-reference · Qwen Image unified edit',
    boundary: 'API variant와 공개 weight variant의 편집 기능·license를 따로 확인한다.',
    route: 'Image runtime → workflow audit → adaptation',
    branchSlug: 'image-model-runtime',
    branchPath: 'ai-open-image-current-first',
    branchLabel: 'Image 제작 경로 시작',
  },
  explore: {
    label: '아트 디렉션',
    icon: Sparkles,
    hardConstraint: '한 가지 AI look이 아닌 넓은 style 후보와 반복 가능한 방향',
    control: 'style reference + strength + weighted mixing',
    evidence: 'Krea 2 foundation model + style-reference system',
    boundary: '예쁜 한 장보다 batch 다양성, content leakage와 strength 반응을 본다.',
    route: 'Image runtime → parameter budget → adaptation',
    branchSlug: 'image-model-runtime',
    branchPath: 'ai-open-image-current-first',
    branchLabel: 'Image 제작 경로 시작',
  },
  video: {
    label: '5초 제품 영상',
    icon: Film,
    hardConstraint: '제품 identity · camera motion · 시간 일관성 · audio sync',
    control: 'image condition + motion prompt + frame/audio contract',
    evidence: 'Wan2.2 task variants · LTX-2.3 joint audio-video',
    boundary: '이미지 품질 점수로 대체하지 않고 flicker·drift·sync를 별도 측정한다.',
    route: 'Video runtime → manifest → parameter budget',
    branchSlug: 'video-model-runtime',
    branchPath: 'ai-open-video-current-first',
    branchLabel: 'Video 제작 경로 시작',
  },
} as const;

export function ProductionGoalRouter() {
  const [searchParams] = useSearchParams();
  const routePath = searchParams.get('path');
  const routeGoal: GoalKey = routePath === 'ai-open-video-current-first' ? 'video' : 'type';
  const [selection, setSelection] = useState<{ routePath: string | null; goal: GoalKey } | null>(null);
  const goal = selection?.routePath === routePath ? selection.goal : routeGoal;
  const active = goals[goal];
  const Icon = active.icon;

  return (
    <Figure
      data={{ 'data-open-goal-router': '' }}
      eyebrow="OPEN MEDIA GOAL ROUTER · 2026-07"
      title="최신 모델 순위가 아니라 폐기 조건에서 실행 경로를 고른다"
      footer={<p className="text-xs font-semibold leading-relaxed">표시된 모델은 공식 자료가 해당 control surface를 제공한다는 후보 근거다. 실제 채택은 고정된 작업 suite, 정확한 revision, license와 runtime 비용을 함께 통과해야 한다.</p>}
    >
      <div className="grid grid-cols-2 gap-px border-b border-border bg-border lg:grid-cols-4" aria-label="2026 이미지와 비디오 모델을 선택하는 네 가지 제작 목표">
        {(Object.keys(goals) as GoalKey[]).map((key) => {
          const ItemIcon = goals[key].icon;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={goal === key}
              onClick={() => setSelection({ routePath, goal: key })}
              className={`min-h-20 min-w-0 bg-background p-3 text-left transition-colors sm:p-4 ${goal === key ? 'shadow-[inset_0_-3px_0_0_currentColor]' : 'text-muted-foreground hover:bg-muted/25'}`}
            >
              <ItemIcon className="h-4 w-4" />
              <strong className="mt-2 block break-keep text-xs leading-snug">{goals[key].label}</strong>
            </button>
          );
        })}
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          <Metric label="폐기 조건" value={active.hardConstraint} note="틀리면 후보 결과를 버리는 hard constraint" />
          <Metric label="필요한 제어면" value={active.control} note="prompt 밖에서 고정해야 할 input contract" />
          <Metric label="현재 공식 후보" value={active.evidence} note="기능을 주장한 공식 release·documentation" tone="good" />
          <Metric label="검증 경계" value={active.boundary} note="marketing claim을 production evidence로 바꾸는 방법" tone="warn" />
        </div>
        <aside className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <Icon className="h-5 w-5" />
          <p className="mt-3 text-xs font-bold uppercase text-muted-foreground">이 글 뒤의 경로</p>
          <p className="mt-2 text-lg font-black leading-tight">{active.route}</p>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Image와 Video는 형제 branch다. 필요한 branch 하나를 읽은 뒤 workflow에서 다시 합류한다.</p>
          <Link
            to={`${articlePath('ai', active.branchSlug)}?path=${encodeURIComponent(active.branchPath)}`}
            state={{ learningPathId: active.branchPath }}
            className="mt-5 flex min-h-11 items-center justify-between gap-3 rounded-md border border-border px-3 text-xs font-bold transition-colors hover:bg-muted/30"
          >
            {active.branchLabel}
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </Link>
        </aside>
      </div>
    </Figure>
  );
}

type RuntimeMode = 'image' | 'video';

const runtimeStages = {
  image: [
    { name: '지시·참고 입력', tech: 'Prompt / reference', shape: 'text · image · mask', responsibility: '의도를 조건으로 표현', failure: '조건 누락·reference leakage' },
    { name: '조건으로 변환', tech: 'Condition encoder', shape: 'L × D', responsibility: '문자·이미지를 embedding으로 변환', failure: 'token truncation·언어 오해' },
    { name: '작업 공간 시작', tech: 'Latent seed', shape: 'C × H′ × W′', responsibility: '압축 공간의 시작 상태 생성', failure: 'shape·seed·resolution 불일치' },
    { name: '여러 번 수정', tech: 'Denoiser + solver', shape: 'N = H′W′', responsibility: 'noise level을 따라 latent 이동', failure: 'schedule·prediction target 불일치' },
    { name: '그림으로 복원', tech: 'VAE + delivery', shape: '3 × H × W', responsibility: 'pixel 복원·upscale·export', failure: '색·작은 글자·postprocess 혼입' },
  ],
  video: [
    { name: '지시·미디어 입력', tech: 'Prompt / media', shape: 'text · image · audio', responsibility: '장면과 시간 조건 표현', failure: '첫 frame·audio 조건 충돌' },
    { name: '조건으로 변환', tech: 'Condition encoder', shape: 'L × D + media', responsibility: '다중 modality를 embedding으로 변환', failure: 'alignment·timing 손실' },
    { name: '시간 작업 공간', tech: 'Temporal latent', shape: 'C × T′ × H′ × W′', responsibility: '시간·공간을 함께 압축', failure: 'frame padding·compression mismatch' },
    { name: '움직임까지 수정', tech: 'Temporal denoiser', shape: 'N = T′H′W′', responsibility: 'motion·identity·audio를 함께 복원', failure: 'flicker·drift·desync' },
    { name: '영상으로 복원', tech: 'Decode + delivery', shape: 'T × 3 × H × W', responsibility: 'frame/audio decode·encode', failure: 'OOM·VAE seam·FPS mismatch' },
  ],
} as const;

export function RuntimeInheritanceExplorer({ initialMode = 'image' }: { initialMode?: RuntimeMode }) {
  const [mode, setMode] = useState<RuntimeMode>(initialMode);
  const [stage, setStage] = useState(2);
  const active = runtimeStages[mode][stage];
  const tokenMultiplier = mode === 'image' ? '1× spatial' : 'T′× spatial';

  return (
    <Figure
      data={{ 'data-media-runtime': mode }}
      eyebrow="IMAGE · VIDEO RUNTIME"
      title="한 장과 영상이 만들어지는 단계를 나란히 비교한다"
      footer={<p className="text-xs font-semibold leading-relaxed">같은 `steps`, `resolution` 이름이라도 latent compression, prediction target와 solver가 다르면 같은 값으로 비교할 수 없다. 먼저 tensor와 module contract를 맞춘다.</p>}
    >
      <div className="grid gap-4 border-b border-border bg-muted/15 p-4 sm:grid-cols-[12rem_minmax(0,1fr)] sm:items-end sm:p-5">
        <div>
          <p className="mb-2 text-xs font-bold uppercase text-muted-foreground">비교할 결과</p>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border">
            {(['image', 'video'] as const).map((value) => (
              <button key={value} type="button" aria-pressed={mode === value} onClick={() => { setMode(value); setStage(2); }} className={`min-h-11 bg-background px-3 text-xs font-bold ${mode === value ? 'text-violet-700 shadow-[inset_0_-2px_0_0_currentColor] dark:text-violet-300' : 'text-muted-foreground'}`}>{value === 'image' ? '한 장' : '영상'}</button>
            ))}
          </div>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">단계를 누르면 그곳에서 다루는 값의 모양, 맡은 일과 대표 실패가 아래에 나타납니다.</p>
      </div>
      <div className="grid grid-cols-5 gap-px bg-border" aria-label={`${mode === 'image' ? '한 장' : '영상'} 생성의 다섯 단계`}>
        {runtimeStages[mode].map((item, index) => (
          <button key={item.name} type="button" aria-pressed={stage === index} onClick={() => setStage(index)} className={`h-28 min-w-0 bg-background px-1.5 py-3 text-left sm:h-32 sm:p-3 ${stage === index ? 'bg-violet-500/[0.055] text-violet-800 shadow-[inset_0_-3px_0_0_currentColor] dark:text-violet-200' : 'text-muted-foreground hover:bg-muted/25'}`}>
            <span className="font-mono text-xs font-black">0{index + 1}</span>
            <strong className="mt-1.5 block break-keep text-xs leading-snug sm:mt-2 sm:text-sm">{item.name}</strong>
            <span className="mt-1 hidden break-words text-xs leading-snug text-muted-foreground sm:block">{item.tech}</span>
          </button>
        ))}
      </div>
      <div className="grid min-w-0 gap-5 border-t border-border p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="grid gap-px overflow-hidden bg-border sm:grid-cols-3">
          <Metric label="tensor / input" value={active.shape} note="이 stage가 읽거나 만드는 형태" stable />
          <Metric label="책임" value={active.responsibility} note="이 module을 교체하는 이유" tone="good" stable />
          <Metric label="대표 실패" value={active.failure} note="debug owner" tone="warn" stable />
        </div>
        <aside className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          {mode === 'image' ? <Image className="h-5 w-5" /> : <Film className="h-5 w-5" />}
          <p className="mt-3 text-xs font-bold uppercase text-muted-foreground">sequence budget</p>
          <p className="mt-1 font-mono text-xl font-black">{tokenMultiplier}</p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Video에서는 시간축 때문에 motion과 memory가 같은 tensor 위에서 결합된다.</p>
        </aside>
      </div>
    </Figure>
  );
}

const manifestFields = [
  { key: 'revision', label: 'Model revision', detail: 'weight hash · exact variant · VAE', icon: GitCommitHorizontal },
  { key: 'graph', label: 'Graph revision', detail: 'workflow JSON · node commit · code lock', icon: Boxes },
  { key: 'runtime', label: 'Runtime state', detail: 'dtype · device · offload · kernel', icon: CircleGauge },
  { key: 'input', label: 'Input transform', detail: 'resize · crop · mask · prompt rewrite', icon: SlidersHorizontal },
  { key: 'sampling', label: 'Sampling trace', detail: 'seed · solver · schedule · guidance', icon: WandSparkles },
] as const;

type ManifestKey = (typeof manifestFields)[number]['key'];

export function WorkflowManifestExplorer() {
  const [captured, setCaptured] = useState<Record<ManifestKey, boolean>>({ revision: true, graph: true, runtime: false, input: false, sampling: true });
  const score = manifestFields.filter((field) => captured[field.key]).length;
  const reproducible = score === manifestFields.length;

  return (
    <Figure
      data={{ 'data-workflow-manifest': '' }}
      eyebrow="WORKFLOW MANIFEST LAB"
      title="그래프 screenshot이 아니라 다시 실행할 수 있는 manifest를 남긴다"
      footer={<p className="text-xs font-semibold leading-relaxed">Workflow export만으로는 custom node가 최신 commit으로 바뀌거나 model alias가 다른 weight를 가리키는 drift를 막지 못한다. Artifact와 environment를 함께 고정한다.</p>}
    >
      <div className="divide-y divide-border">
        {manifestFields.map((field) => {
          const Icon = field.icon;
          const on = captured[field.key];
          return (
            <button key={field.key} type="button" aria-pressed={on} onClick={() => setCaptured((value) => ({ ...value, [field.key]: !value[field.key] }))} className="grid w-full min-w-0 grid-cols-[2.5rem_minmax(0,1fr)_4rem] items-center gap-x-3 gap-y-1 p-3.5 text-left hover:bg-muted/25 sm:grid-cols-[2.5rem_minmax(0,10rem)_minmax(0,1fr)_5rem] sm:gap-3 sm:px-5">
              <span className={`row-span-2 flex h-9 w-9 items-center justify-center rounded-md border sm:row-span-1 ${on ? 'border-emerald-600/35 bg-emerald-500/[0.07]' : 'border-rose-600/35 bg-rose-500/[0.07]'}`}><Icon className="h-4 w-4" /></span>
              <strong className="min-w-0 text-xs">{field.label}</strong>
              <span className="col-start-2 col-span-2 min-w-0 text-xs leading-relaxed text-muted-foreground sm:col-auto sm:col-span-1">{field.detail}</span>
              <span className={`col-start-3 row-start-1 text-right font-mono text-xs font-black sm:col-auto sm:row-auto sm:text-left ${on ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>{on ? 'captured' : 'missing'}</span>
            </button>
          );
        })}
      </div>
      <div className="grid gap-px border-t border-border bg-border sm:grid-cols-3">
        <Metric label="fields captured" value={`${score}/5`} note="minimum release manifest" tone={reproducible ? 'good' : 'warn'} />
        <Metric label="same graph" value={captured.graph ? 'locked' : 'drifting'} note="node·code dependency" tone={captured.graph ? 'good' : 'warn'} />
        <Metric label="release verdict" value={reproducible ? 'replay ready' : 'evidence missing'} note="다른 machine에서 재실행" tone={reproducible ? 'good' : 'warn'} />
      </div>
    </Figure>
  );
}

export function ParameterBudgetExplorer() {
  const [mode, setMode] = useState<RuntimeMode>('image');
  const [resolution, setResolution] = useState(1024);
  const [steps, setSteps] = useState(28);
  const [frames, setFrames] = useState(81);
  const [guidance, setGuidance] = useState(4);

  const budget = useMemo(() => {
    const spatialCompression = 8;
    const temporalCompression = mode === 'video' ? 4 : 1;
    const latentSide = Math.ceil(resolution / spatialCompression);
    const temporal = mode === 'video' ? Math.ceil(frames / temporalCompression) : 1;
    const positions = latentSide * latentSide * temporal;
    const calls = positions * steps;
    return {
      profile: mode === 'image' ? 'SDXL-like · 공간 8×' : 'Wan2.2-VAE-like · 시간 4× · 공간 8×',
      latent: mode === 'image' ? `${latentSide} × ${latentSide}` : `${temporal} × ${latentSide} × ${latentSide}`,
      positions: positions >= 1_000_000 ? `${(positions / 1_000_000).toFixed(2)}M` : `${(positions / 1000).toFixed(1)}K`,
      calls: calls >= 1_000_000 ? `${(calls / 1_000_000).toFixed(1)}M` : `${(calls / 1000).toFixed(1)}K`,
      risk: guidance > 7 ? '과도한 조건 힘' : guidance < 1.5 ? '조건 약화' : '검증 구간',
    };
  }, [frames, guidance, mode, resolution, steps]);

  return (
    <Figure
      data={{ 'data-parameter-budget': mode }}
      eyebrow="PARAMETER BUDGET LAB"
      title="UI 숫자를 품질 마법값이 아니라 position-step 예산으로 읽는다"
      footer={<p className="text-xs font-semibold leading-relaxed">Image는 SDXL-like VAE 공간 8배, Video는 Wan2.2-VAE-like 시간 4배·공간 8배를 가정한 교육용 상대 예산이다. Patchification·attention·activation을 포함한 VRAM 추정치가 아니다.</p>}
    >
      <div className="grid gap-5 border-b border-border bg-muted/15 p-4 sm:p-5 lg:grid-cols-[10rem_minmax(0,1fr)]">
        <div>
          <p className="mb-2 text-xs font-bold uppercase text-muted-foreground">Media</p>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border">
            {(['image', 'video'] as const).map((value) => <button key={value} type="button" aria-pressed={mode === value} onClick={() => setMode(value)} className={`min-h-11 bg-background px-2 text-xs font-bold ${mode === value ? 'shadow-[inset_0_-2px_0_0_currentColor]' : 'text-muted-foreground'}`}>{value}</button>)}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{budget.profile}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="min-w-0 text-xs font-bold">Resolution <output className="float-right font-mono">{resolution}px</output><input aria-label="resolution" type="range" min="512" max="2048" step="256" value={resolution} onChange={(event) => setResolution(Number(event.target.value))} className="mt-3 w-full accent-foreground" /></label>
          <label className="min-w-0 text-xs font-bold">Denoising steps <output className="float-right font-mono">{steps}</output><input aria-label="denoising steps" type="range" min="4" max="60" value={steps} onChange={(event) => setSteps(Number(event.target.value))} className="mt-3 w-full accent-foreground" /></label>
          {mode === 'video' && <label className="min-w-0 text-xs font-bold">Frames <output className="float-right font-mono">{frames}</output><input aria-label="frames" type="range" min="17" max="241" step="16" value={frames} onChange={(event) => setFrames(Number(event.target.value))} className="mt-3 w-full accent-foreground" /></label>}
          <label className="min-w-0 text-xs font-bold">Guidance <output className="float-right font-mono">{guidance.toFixed(1)}</output><input aria-label="guidance" type="range" min="0" max="12" step="0.5" value={guidance} onChange={(event) => setGuidance(Number(event.target.value))} className="mt-3 w-full accent-foreground" /></label>
        </div>
      </div>
      <div className="grid gap-px bg-border sm:grid-cols-4">
        <Metric label="VAE latent grid" value={budget.latent} note="명시한 profile의 압축 뒤 shape" />
        <Metric label="latent positions" value={budget.positions} note="patch 전 압축 위치 수" />
        <Metric label="position-steps" value={budget.calls} note="latent 위치 수 × denoiser 호출" />
        <Metric label="guidance risk" value={budget.risk} note="모델별 실측 필요" tone={guidance > 7 || guidance < 1.5 ? 'warn' : 'good'} />
      </div>
    </Figure>
  );
}

type AdaptGoal = 'layout' | 'identity' | 'style' | 'domain';
const adaptationGoals = {
  layout: { label: '구도 한 번', preferred: 'Prompt / Control', reason: '새 weight보다 box·mask·pose 같은 inference condition이 직접적이다.', scope: '0 trainable', risk: 'control overfit' },
  identity: { label: '제품 반복', preferred: 'Reference → LoRA', reason: 'reference만으로 재현되지 않을 때 작은 weight delta를 학습한다.', scope: 'low-rank ΔW', risk: 'identity leakage' },
  style: { label: '새 화풍', preferred: 'LoRA / adapter', reason: 'base prior를 보존하면서 반복 가능한 방향을 추가한다.', scope: 'selected blocks', risk: 'style collapse' },
  domain: { label: '새 도메인', preferred: 'SFT / full fine-tune', reason: 'base가 학습하지 못한 분포 자체를 바꿀 때만 큰 update를 검토한다.', scope: 'broad weights', risk: 'catastrophic forgetting' },
} as const;

export function AdaptationDecisionExplorer() {
  const [goal, setGoal] = useState<AdaptGoal>('identity');
  const [examples, setExamples] = useState(120);
  const [regressionSuite, setRegressionSuite] = useState(true);
  const active = adaptationGoals[goal];
  const dataReady = goal === 'layout' || examples >= (goal === 'domain' ? 1000 : 40);

  return (
    <Figure
      data={{ 'data-adaptation-decision': '' }}
      eyebrow="ADAPTATION DECISION LAB"
      title="Prompt로 고칠 문제와 weight를 바꿔야 할 문제를 먼저 분리한다"
      footer={<p className="text-xs font-semibold leading-relaxed">권고는 출발점이다. Base-vs-adapted 고정 suite에서 목표 향상과 비목표 회귀를 함께 측정해야 최종 채택할 수 있다.</p>}
    >
      <div className="grid grid-cols-2 gap-px border-b border-border bg-border lg:grid-cols-4">
        {(Object.keys(adaptationGoals) as AdaptGoal[]).map((key) => <button key={key} type="button" aria-pressed={goal === key} onClick={() => setGoal(key)} className={`min-h-16 min-w-0 bg-background p-3 text-left text-xs font-bold ${goal === key ? 'shadow-[inset_0_-3px_0_0_currentColor]' : 'text-muted-foreground'}`}>{adaptationGoals[key].label}</button>)}
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          <Metric label="먼저 시도할 개입" value={active.preferred} note={active.reason} tone="good" />
          <Metric label="trainable scope" value={active.scope} note="업데이트되는 parameter 범위" />
          <Metric label="대표 회귀" value={active.risk} note="validation suite가 잡아야 할 손실" tone="warn" />
          <Metric label="현재 준비" value={dataReady && regressionSuite ? 'experiment ready' : 'design incomplete'} note="data와 regression gate" tone={dataReady && regressionSuite ? 'good' : 'warn'} />
        </div>
        <aside className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <label className="text-xs font-bold">Curated examples <output className="float-right font-mono">{examples}</output><input aria-label="curated examples" type="range" min="20" max="2000" step="20" value={examples} onChange={(event) => setExamples(Number(event.target.value))} className="mt-3 w-full accent-foreground" /></label>
          <button type="button" aria-pressed={regressionSuite} onClick={() => setRegressionSuite((value) => !value)} className={`mt-5 flex min-h-11 w-full items-center gap-2 rounded-md border px-3 text-left text-xs font-bold ${regressionSuite ? 'border-emerald-600/35 bg-emerald-500/[0.07]' : 'border-rose-600/35 bg-rose-500/[0.07]'}`}>{regressionSuite ? <Check className="h-4 w-4" /> : <TriangleAlert className="h-4 w-4" />}Regression suite</button>
        </aside>
      </div>
    </Figure>
  );
}

const releaseChecks = [
  { key: 'text', label: '한국어 exact string', detail: 'OCR + 사람이 layout·line break 확인', icon: Braces },
  { key: 'identity', label: '제품 identity', detail: 'shape·logo·brand color drift 측정', icon: LockKeyhole },
  { key: 'temporal', label: '5초 temporal', detail: 'flicker·camera·object motion·sync 측정', icon: Film },
  { key: 'license', label: '상업 사용 범위', detail: 'weight·code·output·derivative 조건 snapshot', icon: FileCheck2 },
  { key: 'replay', label: '다른 machine replay', detail: 'manifest와 artifact hash로 재실행', icon: PackageCheck },
] as const;

type ReleaseKey = (typeof releaseChecks)[number]['key'];

export function OpenMediaReleaseGate() {
  const [checks, setChecks] = useState<Record<ReleaseKey, boolean>>({ text: true, identity: false, temporal: false, license: true, replay: false });
  const passed = releaseChecks.filter((item) => checks[item.key]).length;
  const ready = passed === releaseChecks.length;

  return (
    <Figure
      data={{ 'data-open-media-release': '' }}
      eyebrow="PRODUCTION RELEASE GATE"
      title="좋아 보이는 sample을 납품 가능한 artifact로 바꾸는 마지막 다섯 증거"
      footer={<p className="text-xs font-semibold leading-relaxed">Image-only 작업이면 temporal gate를 `not applicable` 근거와 함께 닫을 수 있다. 검증 없이 숨기는 것은 pass가 아니다.</p>}
    >
      <div className="grid gap-px bg-border sm:grid-cols-5">
        {releaseChecks.map((item) => {
          const Icon = item.icon;
          const on = checks[item.key];
          return (
            <button key={item.key} type="button" aria-pressed={on} onClick={() => setChecks((value) => ({ ...value, [item.key]: !value[item.key] }))} className="min-h-32 min-w-0 bg-background p-4 text-left hover:bg-muted/25">
              <span className={`flex h-9 w-9 items-center justify-center rounded-full border ${on ? 'border-emerald-600/35 bg-emerald-500/[0.07]' : 'border-rose-600/35 bg-rose-500/[0.07]'}`}>{on ? <BadgeCheck className="h-4 w-4" /> : <Icon className="h-4 w-4" />}</span>
              <strong className="mt-3 block break-words text-xs leading-relaxed">{item.label}</strong>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.detail}</p>
            </button>
          );
        })}
      </div>
      <div className="grid gap-px border-t border-border bg-border sm:grid-cols-3">
        <Metric label="gates passed" value={`${passed}/5`} note="production contract" tone={ready ? 'good' : 'warn'} />
        <Metric label="unverified" value={`${releaseChecks.length - passed}`} note="sample quality로 대체 불가" tone={ready ? 'good' : 'warn'} />
        <Metric label="release" value={ready ? 'approved' : 'blocked'} note="근거가 모두 닫힐 때만 배포" tone={ready ? 'good' : 'warn'} />
      </div>
    </Figure>
  );
}
