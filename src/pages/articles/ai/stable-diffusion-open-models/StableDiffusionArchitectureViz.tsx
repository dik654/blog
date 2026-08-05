import { Fragment } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  Check,
  CircleAlert,
  GitCompareArrows,
  Layers3,
  Network,
  RefreshCw,
  ScanSearch,
  Split,
} from 'lucide-react';
import StepViz from '@/components/ui/step-viz';

const steps = [
  {
    label: '먼저 두 구조가 공유하는 바깥 계약을 고정한다.',
    body: 'U-Net과 MMDiT 모두 noisy latent, timestep, text condition을 받아 제거 방향을 낸다. Diffusion loop가 같다고 내부 weight topology까지 호환되는 것은 아니다.',
  },
  {
    label: 'U-Net은 여러 해상도를 오가며 구조와 세부를 나눈다.',
    body: 'Down path는 feature map을 작게 만들고 channel을 깊게 한다. Bottleneck 뒤 up path가 해상도를 복원하며 skip feature를 다시 받는다.',
  },
  {
    label: 'Skip connection과 cross-attention은 서로 다른 정보를 운반한다.',
    body: 'Skip은 같은 이미지의 공간 detail을 우회 전달한다. Cross-attention은 image query가 text key/value를 조회해 prompt 의미를 주입한다.',
  },
  {
    label: 'MMDiT는 image와 text token을 joint attention에서 함께 갱신한다.',
    body: '두 modality는 projection, normalization과 MLP weight를 따로 유지하지만 attention 순간에는 Q/K/V sequence를 합쳐 양방향으로 정보를 교환한다.',
  },
  {
    label: '계열을 바꾸면 adapter와 solver 계약을 다시 고른다.',
    body: 'SDXL recipe에서 재사용할 것은 실험 방법이지 module address가 아니다. Target, encoder, prediction objective와 scheduler semantics를 새 manifest로 고정한다.',
  },
] as const;

function FlowArrow() {
  return (
    <div className="flex min-h-8 shrink-0 items-center justify-center text-muted-foreground" aria-hidden="true">
      <ArrowDown className="h-4 w-4 lg:hidden" />
      <ArrowRight className="hidden h-4 w-4 lg:block" />
    </div>
  );
}

function SharedContract() {
  const nodes = [
    ['Noisy latent', 'z_t', '#a16207'],
    ['Timestep', 't / σ_t', '#0f766e'],
    ['Text condition', 'c', '#2563eb'],
  ] as const;
  return (
    <div className="min-w-0">
      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,0.85fr)_2rem_minmax(14rem,1fr)_2rem_minmax(0,0.85fr)] lg:items-center">
        <div className="space-y-2">
          {nodes.map(([label, value, color], index) => (
            <motion.div
              initial={{ opacity: 0, x: -7 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="flex min-w-0 items-center justify-between gap-3 rounded-md border border-border bg-background px-4 py-3"
              key={label}
            >
              <span className="text-xs font-bold">{label}</span>
              <span className="font-mono text-xs font-black" style={{ color }}>{value}</span>
            </motion.div>
          ))}
        </div>
        <FlowArrow />
        <div className="min-w-0 rounded-md border border-border bg-background p-5">
          <p className="text-[11px] font-bold uppercase text-muted-foreground">Replaceable denoiser</p>
          <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border">
            <span className="bg-blue-50 px-3 py-4 text-center text-xs font-black text-blue-800 dark:bg-blue-950/30 dark:text-blue-200">U-Net</span>
            <span className="bg-violet-50 px-3 py-4 text-center text-xs font-black text-violet-800 dark:bg-violet-950/30 dark:text-violet-200">MMDiT</span>
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">바깥 tensor 역할은 비슷하지만 내부 parameter address는 다르다.</p>
        </div>
        <FlowArrow />
        <div className="min-w-0 rounded-md border border-border bg-background p-5">
          <p className="text-[11px] font-bold uppercase text-muted-foreground">Prediction</p>
          <p className="mt-2 font-mono text-xl font-black">ε̂ / v̂ / flow</p>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">Objective와 scheduler가 해석하는 vector field</p>
        </div>
      </div>
      <p className="mt-6 border-l-2 border-rose-600 pl-3 text-xs font-semibold leading-5 text-rose-700 dark:text-rose-300">
        공통 I/O shape만 보고 SDXL LoRA weight를 SD3 block에 꽂을 수는 없다.
      </p>
    </div>
  );
}

function UNetPath() {
  const down = [
    ['64×64', 'edge · texture'],
    ['32×32', 'part relation'],
    ['16×16', 'global layout'],
  ] as const;
  return (
    <div className="min-w-0">
      <div className="flex min-w-0 items-center gap-3 border-b border-border pb-4">
        <Layers3 className="h-5 w-5 text-blue-700 dark:text-blue-300" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase text-muted-foreground">SD1.x · SDXL denoiser</p>
          <p className="mt-1 text-sm font-bold">공간 grid를 작게 만들었다가 다시 키우는 대칭 경로</p>
        </div>
      </div>
      <div className="relative mt-7 min-w-0">
        <svg
          className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <path d="M 8 18 C 24 18, 23 49, 40 49 S 67 18, 84 18" fill="none" stroke="#2563eb" strokeOpacity="0.32" strokeWidth="0.65" />
          <path d="M 8 82 C 24 82, 23 53, 40 53 S 67 82, 84 82" fill="none" stroke="#0f766e" strokeOpacity="0.28" strokeWidth="0.65" />
        </svg>
        <div className="relative grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)_2rem_minmax(0,0.8fr)_2rem_minmax(0,1fr)_2rem_minmax(0,1fr)] lg:items-center">
          {[
            { title: down[0][0], detail: down[0][1], width: 'w-full', tone: 'border-blue-300 bg-blue-500/[0.05]' },
            { title: down[1][0], detail: down[1][1], width: 'w-[88%]', tone: 'border-blue-300 bg-blue-500/[0.05]' },
            { title: down[2][0], detail: down[2][1], width: 'w-[76%]', tone: 'border-amber-400 bg-amber-500/[0.06]' },
            { title: '32×32', detail: 'skip detail 결합', width: 'w-[88%]', tone: 'border-teal-300 bg-teal-500/[0.05]' },
            { title: '64×64', detail: 'latent 출력 복원', width: 'w-full', tone: 'border-teal-300 bg-teal-500/[0.05]' },
          ].map((node, index) => (
            <Fragment key={`${node.title}-${index}`}>
              <motion.div
                initial={{ opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className={`mx-auto min-w-0 rounded-md border p-4 ${node.width} ${node.tone}`}
              >
                <p className="font-mono text-sm font-black">{node.title}</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{node.detail}</p>
              </motion.div>
              {index < 4 ? <FlowArrow /> : null}
            </Fragment>
          ))}
        </div>
      </div>
      <div className="mt-6 grid gap-2 border-y border-border py-4 sm:grid-cols-3">
        <p className="text-xs font-semibold"><span className="text-blue-700 dark:text-blue-300">Down</span> · 넓은 문맥으로 압축</p>
        <p className="text-xs font-semibold"><span className="text-amber-700 dark:text-amber-300">Middle</span> · 전역 관계 mixing</p>
        <p className="text-xs font-semibold"><span className="text-teal-700 dark:text-teal-300">Up</span> · 공간 detail 복원</p>
      </div>
    </div>
  );
}

function InformationPaths() {
  const paths = [
    {
      title: 'Skip connection',
      from: 'Down feature',
      to: '같은 해상도 Up block',
      role: 'edge·texture·위치 detail 우회 전달',
      icon: Split,
      color: '#0f766e',
    },
    {
      title: 'Cross-attention',
      from: 'Q = image feature',
      to: 'K/V = text embedding',
      role: '각 이미지 위치가 볼 prompt token 선택',
      icon: ScanSearch,
      color: '#7c3aed',
    },
  ] as const;
  return (
    <div className="min-w-0">
      <div className="grid min-w-0 gap-px overflow-hidden rounded-md border border-border bg-border lg:grid-cols-2">
        {paths.map((path, index) => {
          const Icon = path.icon;
          return (
            <motion.div
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12 }}
              className="min-w-0 bg-background p-5 sm:p-6"
              key={path.title}
            >
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border">
                  <Icon className="h-4 w-4" style={{ color: path.color }} aria-hidden="true" />
                </span>
                <p className="text-sm font-black">{path.title}</p>
              </div>
              <div className="mt-6 grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1fr)] sm:items-center">
                <span className="min-w-0 rounded-md border border-border px-3 py-3 text-center font-mono text-[11px] font-bold">{path.from}</span>
                <ArrowRight className="mx-auto hidden h-4 w-4 text-muted-foreground sm:block" aria-hidden="true" />
                <ArrowDown className="mx-auto h-4 w-4 text-muted-foreground sm:hidden" aria-hidden="true" />
                <span className="min-w-0 rounded-md border border-border px-3 py-3 text-center font-mono text-[11px] font-bold">{path.to}</span>
              </div>
              <p className="mt-5 border-t border-border pt-4 text-xs font-semibold leading-5" style={{ color: path.color }}>{path.role}</p>
            </motion.div>
          );
        })}
      </div>
      <p className="mt-5 text-xs leading-5 text-muted-foreground">
        Prompt 결합 문제는 cross-attention target을 먼저 본다. 얇은 선과 지역 texture 문제까지 같은 adapter 하나로 해결된다고 가정하지 않는다.
      </p>
    </div>
  );
}

function MMDiTPath() {
  const streams = [
    ['Image stream', 'latent patch → image projection', '#a16207'],
    ['Text stream', 'token embedding → text projection', '#2563eb'],
  ] as const;
  return (
    <div className="min-w-0">
      <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_2rem_minmax(12rem,0.9fr)_2rem_minmax(0,1fr)] lg:items-center">
        <div className="space-y-3">
          {streams.map(([title, detail, color], index) => (
            <motion.div
              initial={{ opacity: 0, x: -7 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="min-w-0 rounded-md border border-border bg-background p-4"
              key={title}
            >
              <p className="text-xs font-black" style={{ color }}>{title}</p>
              <p className="mt-2 font-mono text-[11px] leading-5 text-muted-foreground">{detail}</p>
            </motion.div>
          ))}
        </div>
        <FlowArrow />
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative min-w-0 overflow-hidden rounded-md border border-violet-300 bg-violet-500/[0.06] p-5 text-center dark:border-violet-900"
        >
          <Network className="mx-auto h-5 w-5 text-violet-700 dark:text-violet-300" aria-hidden="true" />
          <p className="mt-3 text-sm font-black">Joint attention</p>
          <p className="mt-2 font-mono text-[11px] leading-5 text-muted-foreground">concat Q/K/V for attention</p>
          <p className="mt-3 text-xs leading-5">관계를 계산하는 순간에만 두 sequence가 만난다.</p>
        </motion.div>
        <FlowArrow />
        <div className="space-y-3">
          {streams.map(([title, , color], index) => (
            <motion.div
              initial={{ opacity: 0, x: 7 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.16 + index * 0.1 }}
              className="min-w-0 rounded-md border border-border bg-background p-4"
              key={title}
            >
              <p className="text-xs font-black" style={{ color }}>{title} update</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">각자의 normalization · MLP · residual weight 유지</p>
            </motion.div>
          ))}
        </div>
      </div>
      <p className="mt-6 border-l-2 border-violet-600 pl-3 text-xs font-semibold leading-5 text-violet-800 dark:text-violet-200">
        “모두 한 token stream”이 아니다. 표현 weight는 분리하고 attention relation은 공동으로 계산한다.
      </p>
    </div>
  );
}

function MigrationLedger() {
  const rows = [
    ['실험 원칙', '같은 prompt·seed로 A/B', '그대로 상속', true],
    ['Latent 입출력 경계', 'z_t → prediction → z_{t-1}', '역할만 상속', true],
    ['Adapter target', 'q/k/v/out · conv · MLP', 'module address 재선정', false],
    ['Text condition', 'encoder 수·길이·pooling', 'pipeline별 재선정', false],
    ['Prediction / solver', 'epsilon · v · flow', 'objective와 함께 재선정', false],
  ] as const;
  return (
    <div className="min-w-0">
      <div className="flex min-w-0 items-start gap-3 border-b border-border pb-4">
        <GitCompareArrows className="h-5 w-5 shrink-0 text-violet-700 dark:text-violet-300" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase text-muted-foreground">SDXL → SD3/3.5</p>
          <p className="mt-1 text-sm font-bold">Recipe를 복사하지 말고 유지할 원칙과 다시 고를 주소를 분리한다</p>
        </div>
      </div>
      <div className="mt-5 divide-y divide-border border-y border-border">
        {rows.map(([boundary, detail, decision, inherited], index) => (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
            className="grid min-w-0 gap-2 py-4 sm:grid-cols-[9rem_minmax(0,1fr)_9rem] sm:items-center"
            key={boundary}
          >
            <span className="text-xs font-black">{boundary}</span>
            <span className="min-w-0 text-xs leading-5 text-muted-foreground">{detail}</span>
            <span className={`flex items-center gap-2 text-xs font-bold ${
              inherited ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
            }`}>
              {inherited ? <Check className="h-4 w-4 shrink-0" aria-hidden="true" /> : <CircleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />}
              {decision}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <RefreshCw className="h-4 w-4 shrink-0" aria-hidden="true" />
        새 manifest에서 target, encoder, objective, scheduler revision을 다시 고정한다.
      </div>
    </div>
  );
}

function ArchitectureStage({ step }: { step: number }) {
  if (step === 0) return <SharedContract />;
  if (step === 1) return <UNetPath />;
  if (step === 2) return <InformationPaths />;
  if (step === 3) return <MMDiTPath />;
  return <MigrationLedger />;
}

export default function StableDiffusionArchitectureViz() {
  return (
    <div
      className="not-prose min-w-0 [&_.step-viz]:my-8 [&_.step-viz__stage]:min-h-[300px] sm:[&_.step-viz__stage]:min-h-[405px]"
      data-sd-architecture-viz
    >
      <StepViz steps={[...steps]} stageClassName="!items-stretch bg-muted/[0.06]">
        {(step) => <ArchitectureStage step={step} />}
      </StepViz>
    </div>
  );
}
