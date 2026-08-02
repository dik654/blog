import type { LucideIcon } from 'lucide-react';
import StepViz, { type StepDef } from '@/components/ui/step-viz';
import {
  AlertTriangle,
  Boxes,
  Check,
  FileArchive,
  FileJson,
  Gauge,
  GitCommitHorizontal,
  Image,
  Layers3,
  LockKeyhole,
  Network,
  PackageCheck,
  Play,
  Route,
  ScanSearch,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';

type Tone = 'blue' | 'violet' | 'rose' | 'emerald' | 'amber' | 'neutral';

const tone: Record<Tone, string> = {
  blue: 'border-sky-500/35 bg-sky-500/[0.06] text-sky-800 dark:text-sky-200',
  violet: 'border-violet-500/35 bg-violet-500/[0.06] text-violet-800 dark:text-violet-200',
  rose: 'border-rose-500/35 bg-rose-500/[0.06] text-rose-800 dark:text-rose-200',
  emerald: 'border-emerald-500/35 bg-emerald-500/[0.06] text-emerald-800 dark:text-emerald-200',
  amber: 'border-amber-500/35 bg-amber-500/[0.06] text-amber-900 dark:text-amber-200',
  neutral: 'border-border bg-muted/20 text-foreground',
};

function RuntimeDecisionViz({ steps, children }: { steps: StepDef[]; children: (step: number) => React.ReactNode }) {
  return (
    <div
      data-comfy-runtime-viz
      className="not-prose min-w-0 [&_.step-viz]:my-8 [&_.step-viz__stage]:min-h-[250px] sm:[&_.step-viz__stage]:min-h-[310px]"
    >
      <StepViz steps={steps}>{children}</StepViz>
    </div>
  );
}

function Stage({ icon: Icon, number, title, detail, kind = 'neutral' }: { icon: LucideIcon; number: string; title: string; detail: string; kind?: Tone }) {
  return (
    <div className={`min-w-0 border-l-2 px-3 py-3 ${tone[kind]}`}>
      <div className="flex min-w-0 items-center gap-2">
        <span className="font-mono text-[10px] font-bold text-muted-foreground">{number}</span>
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        <strong className="min-w-0 text-sm leading-tight">{title}</strong>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{detail}</p>
    </div>
  );
}

export function WorkflowContractViz() {
  const steps: StepDef[] = [
    { label: '실행할 graph snapshot을 고정한다', body: 'Node ID, class type, widget input과 link를 API 형식으로 저장한다.' },
    { label: 'Queue 전에 의존성을 검증한다', body: 'Missing node·model·asset와 type 오류를 먼저 닫는다.' },
    { label: 'Snapshot을 독립 job으로 제출한다', body: '제출 시점의 입력에 prompt_id가 붙으며 이후 UI 수정과 분리된다.' },
    { label: '실행·cache·error event를 추적한다', body: '모든 event와 output을 같은 prompt_id 아래 연결한다.' },
    { label: '다른 환경에서 replay할 묶음을 만든다', body: 'Output만이 아니라 workflow와 dependency manifest를 함께 보관한다.' },
  ];
  const stages = [
    { icon: FileJson, number: '01', title: 'Snapshot', detail: 'node ID, class type, widget input과 link를 API 형식으로 고정', kind: 'blue' as Tone },
    { icon: ScanSearch, number: '02', title: 'Validate', detail: 'missing node, model, asset와 type error를 queue 전에 확인', kind: 'amber' as Tone },
    { icon: Play, number: '03', title: 'Queue', detail: '제출 시점 graph가 prompt_id를 가진 독립 job으로 전환', kind: 'violet' as Tone },
    { icon: GitCommitHorizontal, number: '04', title: 'Trace', detail: '실행·cache·error event를 같은 prompt_id 아래 수집', kind: 'neutral' as Tone },
    { icon: FileArchive, number: '05', title: 'Replay', detail: 'output과 workflow, dependency manifest를 한 묶음으로 보관', kind: 'emerald' as Tone },
  ];
  return (
    <RuntimeDecisionViz steps={steps}>
      {(step) => <div className="w-full min-w-0">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {stages.map((stage, index) => <div key={stage.number} className={`transition-opacity duration-300 ${index === step ? 'opacity-100' : index < step ? 'opacity-75' : 'opacity-55'}`}><Stage {...stage} /></div>)}
        </div>
        <div className="mt-4 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
          <div className="bg-background px-3 py-3 text-sm"><strong className="block">queue 이전 수정</strong><span className="mt-1 block text-xs leading-relaxed text-muted-foreground">다음 snapshot에 포함할 수 있다.</span></div>
          <div className="bg-background px-3 py-3 text-sm"><strong className="block">queue 이후 UI 수정</strong><span className="mt-1 block text-xs leading-relaxed text-muted-foreground">이미 제출된 prompt_id의 입력을 바꾸지 않는다.</span></div>
        </div>
      </div>}
    </RuntimeDecisionViz>
  );
}

const dependencyRows = [
  { consumer: 'Save Image', needs: 'IMAGE', producers: 'Decode', kind: 'blue' as Tone },
  { consumer: 'Decode', needs: 'LATENT · VAE', producers: 'Sampler · Loader', kind: 'rose' as Tone },
  { consumer: 'Sampler', needs: 'MODEL · CONDITIONING · LATENT', producers: 'Loader · Text encode · Latent source', kind: 'violet' as Tone },
  { consumer: 'Text encode', needs: 'CLIP', producers: 'Loader', kind: 'amber' as Tone },
];

export function TypedDagViz() {
  const steps: StepDef[] = [
    { label: 'Target output에서 역추적을 시작한다', body: 'Save Image가 요구하는 IMAGE producer를 찾는다.' },
    { label: 'Decode의 입력 producer를 closure에 넣는다', body: 'LATENT를 만든 Sampler와 VAE를 만든 Loader가 필요하다.' },
    { label: 'Sampler의 모든 typed input을 펼친다', body: 'MODEL, CONDITIONING과 시작 LATENT의 producer를 각각 찾는다.' },
    { label: 'Text encode가 요구하는 CLIP까지 닫는다', body: 'Loader에 도달하면 이 target의 upstream dependency closure가 완성된다.' },
    { label: '완성된 closure를 producer부터 실행한다', body: 'Loader·Text encode·Latent source 뒤에 Sampler, Decode, Save Image가 온다.' },
  ];
  return (
    <RuntimeDecisionViz steps={steps}>
      {(step) => <div className="w-full min-w-0">
        <div className="overflow-hidden border border-border" data-dependency-closure>
        {dependencyRows.map((row, index) => (
          <div key={row.consumer} className={`grid min-w-0 border-b border-border transition-all duration-300 last:border-b-0 sm:grid-cols-[2.5rem_8rem_minmax(0,1fr)_minmax(8rem,1fr)] ${index === step ? 'opacity-100 ring-1 ring-inset ring-current/25' : index < step || step === steps.length - 1 ? 'opacity-85' : 'opacity-70'}`}>
            <div className="flex items-center justify-center border-b border-border bg-muted/20 font-mono text-[10px] sm:border-b-0 sm:border-r">{String(index + 1).padStart(2, '0')}</div>
            <strong className="border-b border-border px-3 py-3 text-sm sm:border-b-0 sm:border-r">{row.consumer}</strong>
            <div className={`min-w-0 border-b px-3 py-3 font-mono text-xs [overflow-wrap:anywhere] sm:border-b-0 sm:border-r ${tone[row.kind]}`}>필요 · {row.needs}</div>
            <div className="min-w-0 px-3 py-3 text-xs leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">producer · <strong className="text-foreground">{row.producers}</strong></div>
          </div>
        ))}
        </div>
        <div className={`mt-4 border-l-2 border-emerald-500/45 bg-emerald-500/[0.06] px-3 py-3 transition-opacity ${step === steps.length - 1 ? 'opacity-100' : 'opacity-70'}`}>
          <p className="flex gap-2 text-xs font-bold text-foreground"><Route className="mt-0.5 h-3.5 w-3.5 shrink-0" />Producer-first 실행 순서</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Loader → Text encode · Latent source → Sampler → Decode → Save Image</p>
        </div>
        <p className="mt-3 flex gap-2 text-xs leading-relaxed text-muted-foreground"><Network className="mt-0.5 h-3.5 w-3.5 shrink-0" />Canvas 위치가 아니라 target에서 역추적한 typed dependency closure가 실행 단위를 정한다. Cache 여부는 그 closure 안에서 별도로 판단한다.</p>
      </div>}
    </RuntimeDecisionViz>
  );
}

export function LoaderManifestViz() {
  const parts = [
    ['Denoiser', 'MODEL', 'architecture · precision · loader', 'violet'],
    ['Text encoder', 'CLIP', 'tokenizer · encoder family · precision', 'amber'],
    ['Latent codec', 'VAE', 'latent channels · scale · decode range', 'rose'],
    ['Adapter', 'MODEL / CONDITION', 'base family · target blocks · strength', 'blue'],
  ] as const;
  const steps: StepDef[] = parts.map(([name, output, detail]) => ({
    label: `${name}를 독립 component로 검증한다`,
    body: `${output} type을 만들며 ${detail} 계약을 함께 고정한다.`,
  }));
  return (
    <RuntimeDecisionViz steps={steps}>
      {(step) => <div className="w-full min-w-0">
        <div className="grid gap-2 sm:grid-cols-2">
        {parts.map(([name, output, detail, kind], index) => (
          <div key={name} className={`min-w-0 border px-3 py-3 transition-opacity duration-300 ${tone[kind]} ${index === step ? 'opacity-100' : index < step ? 'opacity-75' : 'opacity-55'}`}>
            <div className="flex items-center justify-between gap-3"><strong className="text-sm">{name}</strong><code className="text-[10px] font-bold">{output}</code></div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{detail}</p>
          </div>
        ))}
        </div>
        <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-3">
          <div><span className="text-[10px] font-bold uppercase text-muted-foreground">먼저</span><p className="mt-1 text-sm font-semibold">공식 template의 component 조합</p></div>
          <div><span className="text-[10px] font-bold uppercase text-muted-foreground">그다음</span><p className="mt-1 text-sm font-semibold">정적 weight + runtime headroom</p></div>
          <div><span className="text-[10px] font-bold uppercase text-muted-foreground">마지막</span><p className="mt-1 text-sm font-semibold">같은 입력으로 load·decode 검증</p></div>
        </div>
      </div>}
    </RuntimeDecisionViz>
  );
}

export function SamplingTraceViz() {
  const levels = ['1.00', '0.78', '0.55', '0.31', '0.12', '0.00'];
  const steps: StepDef[] = levels.map((level, index) => ({
    label: `step ${index} · sigma ${level}`,
    body: index === 0 ? 'Noise가 큰 시작 상태다.' : index === levels.length - 1 ? 'Noise schedule의 끝에서 결과 latent를 넘긴다.' : 'Sampler가 model 예측을 사용해 다음 noise level로 이동한다.',
  }));
  return (
    <RuntimeDecisionViz steps={steps}>
      {(step) => <div className="w-full min-w-0">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {levels.map((level, index) => (
          <div key={level} className={`min-w-0 border px-2 py-3 text-center transition-opacity duration-300 ${index === 0 ? tone.rose : index === levels.length - 1 ? tone.emerald : tone.neutral} ${index === step ? 'opacity-100 ring-2 ring-current/20' : index < step ? 'opacity-75' : 'opacity-55'}`}>
            <span className="font-mono text-[10px] text-muted-foreground">step {index}</span>
            <div className="mx-auto my-3 grid h-8 w-8 grid-cols-3 gap-0.5" aria-hidden="true">
              {Array.from({ length: 9 }, (_, cell) => <span key={cell} className="bg-current" style={{ opacity: Math.max(0.12, Number(level) * ((cell % 3) + 1) / 3) }} />)}
            </div>
            <strong className="block font-mono text-xs">sigma {level}</strong>
          </div>
        ))}
        </div>
        <div className="mt-4 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
          <div className="bg-background px-3 py-3"><SlidersHorizontal className="h-4 w-4" /><strong className="mt-2 block text-sm">Sampler</strong><p className="mt-1 text-xs text-muted-foreground">다음 상태를 계산하는 수치 규칙</p></div>
          <div className="bg-background px-3 py-3"><Gauge className="h-4 w-4" /><strong className="mt-2 block text-sm">Scheduler</strong><p className="mt-1 text-xs text-muted-foreground">각 step의 noise level 배치</p></div>
          <div className="bg-background px-3 py-3"><Sparkles className="h-4 w-4" /><strong className="mt-2 block text-sm">CFG</strong><p className="mt-1 text-xs text-muted-foreground">조건·무조건 예측 사이의 이동량</p></div>
        </div>
      </div>}
    </RuntimeDecisionViz>
  );
}

export function ConditionRouteViz() {
  const routes = [
    ['Prompt', 'text → CONDITIONING', 'Sampler positive / negative', 'amber'],
    ['LoRA', 'W → W + ΔW', '패치된 MODEL / CLIP', 'violet'],
    ['ControlNet', 'pose · edge · depth', '가공된 CONDITIONING', 'emerald'],
    ['Image adapter', 'reference → embedding', 'attention / model condition', 'blue'],
  ] as const;
  const steps: StepDef[] = routes.map(([name, signal, target]) => ({
    label: `${name}의 실제 consumer를 추적한다`,
    body: `${signal} 경로가 ${target}에 연결되는지 확인한다.`,
  }));
  return (
    <RuntimeDecisionViz steps={steps}>
      {(step) => <div className="w-full min-w-0">
        <div className="space-y-2">
        {routes.map(([name, signal, target, kind], index) => (
          <div key={name} className={`grid min-w-0 border border-border transition-opacity duration-300 sm:grid-cols-[7rem_minmax(0,1fr)_minmax(0,1fr)] ${index === step ? 'opacity-100' : index < step ? 'opacity-75' : 'opacity-55'}`}>
            <strong className={`border-b px-3 py-3 text-sm sm:border-b-0 sm:border-r ${tone[kind]}`}>{name}</strong>
            <code className="min-w-0 border-b px-3 py-3 text-xs [overflow-wrap:anywhere] sm:border-b-0 sm:border-r">{signal}</code>
            <span className="min-w-0 px-3 py-3 text-xs leading-relaxed text-muted-foreground">{target}</span>
          </div>
        ))}
        </div>
        <p className="mt-3 flex gap-2 text-xs leading-relaxed text-muted-foreground"><Route className="mt-0.5 h-3.5 w-3.5 shrink-0" />효과가 없으면 strength부터 올리지 않는다. patch output과 condition output을 sampler에서 역추적한 뒤 하나씩 bypass한다.</p>
      </div>}
    </RuntimeDecisionViz>
  );
}

export function PostprocessOwnershipViz() {
  const stages = [
    ['Base', '구도·텍스트·identity', '모델 또는 기본 condition'],
    ['Latent pass', '재해석·세부 생성', '2차 sampler와 denoise'],
    ['Pixel upscale', '해상도·국소 질감', 'upscaler / resize'],
    ['Detailer', '검출된 영역 수리', 'detector·crop·paste'],
    ['Tiling', 'peak memory·국소 detail', 'tile size·overlap·blend'],
  ] as const;
  const steps: StepDef[] = stages.map(([name, owns, cause]) => ({
    label: `${name} stage의 before/after를 비교한다`,
    body: `${owns}을(를) 맡으며 주요 원인 후보는 ${cause}다.`,
  }));
  return (
    <RuntimeDecisionViz steps={steps}>
      {(step) => <div className="w-full min-w-0">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stages.map(([name, owns, cause], index) => (
          <div key={name} className={`min-w-0 border-t-2 px-3 py-3 transition-opacity duration-300 ${index === 1 ? tone.amber : tone.neutral} ${index === step ? 'opacity-100' : index < step ? 'opacity-75' : 'opacity-55'}`}>
            <span className="font-mono text-[10px] font-bold text-muted-foreground">0{index + 1}</span>
            <strong className="mt-2 block text-sm">{name}</strong>
            <p className="mt-2 text-xs leading-relaxed">{owns}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">주요 원인: {cause}</p>
          </div>
        ))}
        </div>
        <div className="mt-4 flex items-start gap-2 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground"><AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" /><span>Detailer가 얼굴을 고쳤더라도 base의 identity 실패는 사라진 것이 아니다. before/after를 모두 저장한다.</span></div>
      </div>}
    </RuntimeDecisionViz>
  );
}

export function NodeOpsReleaseViz() {
  const evidence = [
    [FileJson, 'Graph', 'UI JSON + API-format snapshot'],
    [Boxes, 'Dependencies', 'core · node pack · Python package'],
    [Layers3, 'Weights', 'file name · variant · hash · license'],
    [Image, 'Inputs/outputs', 'asset hash · seed · accepted result'],
  ] as const;
  const steps: StepDef[] = evidence.map(([, name, detail]) => ({
    label: `${name} evidence를 replay bundle에 넣는다`,
    body: detail,
  }));
  return (
    <RuntimeDecisionViz steps={steps}>
      {(step) => <div className="w-full min-w-0">
        <div className="grid gap-2 sm:grid-cols-2">
        {evidence.map(([Icon, name, detail], index) => (
          <div key={name} className={`flex min-w-0 gap-3 border border-border px-3 py-3 transition-opacity duration-300 ${index === step ? 'opacity-100' : index < step ? 'opacity-75' : 'opacity-55'}`}>
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div className="min-w-0"><strong className="block text-sm">{name}</strong><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p></div>
          </div>
        ))}
        </div>
        <div className="mt-4 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
          <div className="bg-background px-3 py-3"><PackageCheck className="h-4 w-4 text-emerald-600" /><strong className="mt-2 block text-sm">Pin</strong><p className="mt-1 text-xs text-muted-foreground">검증한 version과 revision</p></div>
          <div className="bg-background px-3 py-3"><LockKeyhole className="h-4 w-4 text-amber-600" /><strong className="mt-2 block text-sm">Review</strong><p className="mt-1 text-xs text-muted-foreground">source·install hook·dependency 권한</p></div>
          <div className="bg-background px-3 py-3"><Check className="h-4 w-4 text-sky-600" /><strong className="mt-2 block text-sm">Replay</strong><p className="mt-1 text-xs text-muted-foreground">격리 환경에서 artifact 대조</p></div>
        </div>
      </div>}
    </RuntimeDecisionViz>
  );
}
