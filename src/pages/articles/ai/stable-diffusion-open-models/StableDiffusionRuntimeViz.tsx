import { Fragment } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  Braces,
  Check,
  Image as ImageIcon,
  RefreshCw,
  ScanText,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import StepViz from '@/components/ui/step-viz';

const ACCENTS = {
  condition: '#2563eb',
  latent: '#a16207',
  denoiser: '#be123c',
  solver: '#0f766e',
  decode: '#7c3aed',
} as const;

const steps = [
  {
    label: 'Prompt를 denoiser가 조회할 조건 tensor로 바꾼다.',
    body: 'Tokenizer가 문자열을 token ID로 자르고 text encoder가 embedding c를 만든다. 빠진 token은 뒤 latent loop에서 되살릴 수 없다.',
  },
  {
    label: 'Seed에서 압축된 latent 작업 공간을 만든다.',
    body: '512×512 출력을 직접 움직이지 않는다. 같은 seed로 [1, 4, 64, 64] initial noise z_T를 만들어 비교 시작점을 고정한다.',
  },
  {
    label: 'Denoiser는 현재 상태에서 제거할 방향을 예측한다.',
    body: 'z_t, timestep t, condition c를 함께 받아 noise 또는 velocity를 예측한다. 아직 다음 latent로 이동한 것은 아니다.',
  },
  {
    label: 'Solver가 예측을 사용해 다음 latent로 이동하고 반복한다.',
    body: 'Euler, DDIM, DPM++ 같은 수치 규칙이 z_t를 z_{t-1}로 바꾼다. Weight를 고정해도 이 경로가 달라지면 결과가 달라진다.',
  },
  {
    label: '마지막 latent를 VAE가 사람이 보는 RGB로 복원한다.',
    body: 'z_0가 안정적이어도 decoder에서 색, 얇은 선과 작은 글자가 무너질 수 있다. 그래서 latent와 RGB를 별도 경계로 관찰한다.',
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

function StageTitle({
  icon: Icon,
  eyebrow,
  title,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 border-b border-border pb-4">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border bg-background">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase text-muted-foreground">{eyebrow}</p>
        <p className="mt-1 text-sm font-bold leading-5">{title}</p>
      </div>
    </div>
  );
}

function Receipt({
  owner,
  output,
  fixed,
}: {
  owner: string;
  output: string;
  fixed: string;
}) {
  return (
    <dl className="mt-5 grid min-w-0 divide-y divide-border border-y border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {[
        ['현재 책임', owner],
        ['남긴 출력', output],
        ['다음 비교에서 고정', fixed],
      ].map(([term, value]) => (
        <div className="min-w-0 px-3 py-3 first:pl-0 sm:first:pl-3" key={term}>
          <dt className="text-[11px] font-bold text-muted-foreground">{term}</dt>
          <dd className="mt-1 break-words font-mono text-xs font-semibold leading-5">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ConditionStage() {
  const nodes = [
    { label: 'Prompt', value: '“은빛 로봇, 빗속”', icon: ScanText, color: ACCENTS.condition },
    { label: 'Token IDs', value: '[49406, 842, 736, …]', icon: Braces, color: ACCENTS.latent },
    { label: 'Text encoder', value: 'CLIP / OpenCLIP', icon: Sparkles, color: ACCENTS.denoiser },
    { label: 'Condition', value: 'c · [1, 77, 768]', icon: Check, color: ACCENTS.solver },
  ] as const;

  return (
    <div className="min-w-0">
      <StageTitle icon={ScanText} eyebrow="Condition boundary" title="문자열을 그림에 직접 넣지 않고 조회 가능한 의미 좌표로 바꾼다" />
      <div className="mt-7 grid min-w-0 grid-cols-2 gap-2 lg:hidden">
        {nodes.map((node, index) => {
          const Icon = node.icon;
          return (
            <motion.div
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="relative min-w-0 overflow-hidden rounded-md border border-border bg-background p-3"
              key={node.label}
            >
              <span className="absolute inset-y-0 left-0 w-0.5" style={{ backgroundColor: node.color }} />
              <div className="flex items-center justify-between gap-2">
                <Icon className="h-4 w-4" style={{ color: node.color }} aria-hidden="true" />
                <span className="font-mono text-[11px] font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <p className="mt-3 text-xs font-bold">{node.label}</p>
              <p className="mt-2 break-words font-mono text-[11px] leading-5 text-muted-foreground">{node.value}</p>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-7 hidden min-w-0 lg:grid lg:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)_2rem_minmax(0,1fr)_2rem_minmax(0,1fr)] lg:items-stretch">
        {nodes.map((node, index) => {
          const Icon = node.icon;
          return (
            <Fragment key={node.label}>
              <motion.div
                initial={{ opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="relative min-w-0 overflow-hidden rounded-md border border-border bg-background p-4"
              >
                <span className="absolute inset-y-0 left-0 w-0.5" style={{ backgroundColor: node.color }} />
                <Icon className="h-4 w-4" style={{ color: node.color }} aria-hidden="true" />
                <p className="mt-4 text-xs font-bold">{node.label}</p>
                <p className="mt-2 break-words font-mono text-[11px] leading-5 text-muted-foreground">{node.value}</p>
              </motion.div>
              {index < nodes.length - 1 ? <FlowArrow /> : null}
            </Fragment>
          );
        })}
      </div>
      <p className="mt-4 border-l-2 border-blue-600 pl-3 text-xs font-semibold leading-5 text-blue-800 dark:text-blue-200">
        Tokenizer가 잘라낸 뒤의 문장은 더 이상 원문과 같지 않다. 먼저 token 길이와 encoder revision을 남긴다.
      </p>
      <Receipt owner="Tokenizer + text encoder" output="condition c" fixed="prompt · tokenizer · encoder" />
    </div>
  );
}

function LatentStage() {
  return (
    <div className="min-w-0">
      <StageTitle icon={Sparkles} eyebrow="Latent workspace" title="같은 seed를 같은 shape의 initial noise로 바꿔 실행 시작점을 고정한다" />
      <div className="mt-7 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center">
        <div className="min-w-0">
          <p className="text-4xl font-black tabular-nums text-amber-700 dark:text-amber-300">512² → 64²</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            VAE의 8배 공간 압축 계약을 따라 denoiser는 RGB 786,432개 값 대신 4채널 latent 16,384개 값을 다룬다.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="min-w-0 rounded-md border border-border bg-background p-5"
        >
          <div className="flex min-w-0 items-center justify-between gap-4 border-b border-border pb-4">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase text-muted-foreground">Initial state</p>
              <p className="mt-1 font-mono text-sm font-black">z_T · [1, 4, 64, 64]</p>
            </div>
            <span className="shrink-0 rounded-sm bg-amber-700 px-2 py-1 font-mono text-[11px] font-bold text-white">
              seed 1042
            </span>
          </div>
          <div className="mt-5 grid grid-cols-8 gap-1" aria-label="initial latent noise sample">
            {Array.from({ length: 32 }, (_, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.28 + ((index * 17) % 60) / 100 }}
                transition={{ delay: index * 0.01 }}
                className="aspect-square rounded-[2px] bg-amber-700 dark:bg-amber-300"
              />
            ))}
          </div>
        </motion.div>
      </div>
      <Receipt owner="Noise initializer" output="z_T · dtype · shape" fixed="seed · width · height · batch" />
    </div>
  );
}

function DenoiserStage() {
  const inputs = [
    ['현재 상태', 'z_t', ACCENTS.latent],
    ['noise 시각', 't / σ_t', ACCENTS.solver],
    ['문장 조건', 'c', ACCENTS.condition],
  ] as const;
  return (
    <div className="min-w-0">
      <StageTitle icon={Sparkles} eyebrow="Prediction boundary" title="Denoiser는 다음 이미지를 만들지 않고 현재 상태에서 제거할 방향만 예측한다" />
      <div className="mt-7 grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_2rem_minmax(12rem,1fr)_2rem_minmax(0,0.85fr)] lg:items-center">
        <div className="space-y-2">
          {inputs.map(([label, value, color], index) => (
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
        <div className="relative min-w-0 overflow-hidden rounded-md border border-rose-300 bg-rose-500/[0.05] p-5 dark:border-rose-900">
          <span className="absolute inset-x-0 top-0 h-0.5 bg-rose-700" />
          <p className="text-[11px] font-bold uppercase text-rose-700 dark:text-rose-300">Model weights</p>
          <p className="mt-2 text-lg font-black">U-Net / MMDiT</p>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">세 입력을 섞어 현재 step의 vector field를 추정한다.</p>
        </div>
        <FlowArrow />
        <motion.div
          initial={{ opacity: 0, x: 7 }}
          animate={{ opacity: 1, x: 0 }}
          className="min-w-0 rounded-md border border-border bg-background p-5"
        >
          <p className="text-[11px] font-bold uppercase text-muted-foreground">Prediction</p>
          <p className="mt-2 font-mono text-xl font-black text-rose-700 dark:text-rose-300">ε̂ / v̂</p>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">제거할 noise 또는 이동 velocity</p>
        </motion.div>
      </div>
      <Receipt owner="Denoiser weights" output="ε̂ 또는 v̂" fixed="z_t · t · c · model revision" />
    </div>
  );
}

function SolverStage() {
  const states = [
    ['t = 30', 'z₃₀', 'noise가 큰 상태'],
    ['t = 29', 'z₂₉', 'solver가 한 단계 이동'],
    ['…', '…', 'denoiser와 solver 반복'],
    ['t = 0', 'z₀', 'decode 가능한 latent'],
  ] as const;
  return (
    <div className="min-w-0">
      <StageTitle icon={SlidersHorizontal} eyebrow="Numerical path" title="같은 예측도 어떤 수치 규칙으로 적분하느냐에 따라 다른 경로를 지난다" />
      <div className="mt-7 grid min-w-0 grid-cols-2 gap-2 lg:hidden">
        {states.map(([time, latent, detail], index) => (
          <motion.div
            initial={{ opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.09 }}
            className={`min-w-0 rounded-md border p-3 ${
              index === 1
                ? 'border-teal-400 bg-teal-500/[0.07] dark:border-teal-800'
                : 'border-border bg-background'
            }`}
            key={time}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-[11px] font-bold text-muted-foreground">{time}</p>
              <span className="font-mono text-[11px] font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
            </div>
            <p className="mt-2 font-mono text-lg font-black">{latent}</p>
            <p className="mt-2 text-[11px] leading-5 text-muted-foreground">{detail}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-7 hidden min-w-0 lg:grid lg:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)_2rem_minmax(0,1fr)_2rem_minmax(0,1fr)] lg:items-stretch">
        {states.map(([time, latent, detail], index) => (
          <Fragment key={time}>
            <motion.div
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.09 }}
              className={`min-w-0 rounded-md border p-4 ${
                index === 1
                  ? 'border-teal-400 bg-teal-500/[0.07] dark:border-teal-800'
                  : 'border-border bg-background'
              }`}
            >
              <p className="font-mono text-[11px] font-bold text-muted-foreground">{time}</p>
              <p className="mt-3 font-mono text-xl font-black">{latent}</p>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">{detail}</p>
            </motion.div>
            {index < states.length - 1 ? <FlowArrow /> : null}
          </Fragment>
        ))}
      </div>
      <div className="mt-5 flex min-w-0 flex-col gap-3 border-y border-border py-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center gap-2 text-xs font-bold text-teal-800 dark:text-teal-200">
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Denoiser는 방향을 예측
        </span>
        <span className="text-xs font-semibold leading-5 text-muted-foreground">Solver는 실제 state를 이동</span>
      </div>
      <Receipt owner="Scheduler / solver" output="z_t → z_{t-1}" fixed="weight · prompt · seed, scheduler만 변경" />
    </div>
  );
}

function DecodeStage() {
  return (
    <div className="min-w-0">
      <StageTitle icon={ImageIcon} eyebrow="Decode boundary" title="마지막 latent와 최종 RGB를 따로 보관해야 decoder 결함을 분리할 수 있다" />
      <div className="mt-7 grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_2rem_minmax(0,0.8fr)_2rem_minmax(0,1.25fr)] lg:items-center">
        <div className="min-w-0 rounded-md border border-border bg-background p-5">
          <p className="text-[11px] font-bold uppercase text-muted-foreground">Final latent</p>
          <p className="mt-2 font-mono text-xl font-black">z₀</p>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">[1, 4, 64, 64] · finite · checksum 3aa…</p>
        </div>
        <FlowArrow />
        <div className="relative min-w-0 overflow-hidden rounded-md border border-violet-300 bg-violet-500/[0.05] p-5 dark:border-violet-900">
          <span className="absolute inset-y-0 left-0 w-0.5 bg-violet-700" />
          <p className="text-[11px] font-bold uppercase text-violet-700 dark:text-violet-300">VAE decoder</p>
          <p className="mt-2 text-sm font-black">latent → RGB</p>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">색·경계·작은 detail 복원</p>
        </div>
        <FlowArrow />
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative min-h-40 overflow-hidden rounded-md border border-border bg-[#dce9e2]"
          aria-label="decoded image example"
        >
          <div className="absolute inset-x-0 bottom-0 h-14 bg-[#6f7e73]" />
          <div className="absolute left-[18%] top-[22%] h-16 w-16 rounded-full bg-[#e7b85d] shadow-[0_20px_35px_rgba(47,71,59,0.25)]" />
          <div className="absolute right-[15%] top-[18%] h-24 w-14 rounded-t-full bg-[#647b91]" />
          <div className="absolute inset-x-4 top-4 flex items-center justify-between">
            <span className="rounded-sm bg-white/85 px-2 py-1 text-[11px] font-bold text-[#27372e]">RGB · 512×512</span>
            <Check className="h-4 w-4 text-[#285f48]" aria-hidden="true" />
          </div>
        </motion.div>
      </div>
      <Receipt owner="VAE decoder" output="RGB image + decoder revision" fixed="z_0, decoder만 A/B" />
    </div>
  );
}

function RuntimeStage({ step }: { step: number }) {
  if (step === 0) return <ConditionStage />;
  if (step === 1) return <LatentStage />;
  if (step === 2) return <DenoiserStage />;
  if (step === 3) return <SolverStage />;
  return <DecodeStage />;
}

export default function StableDiffusionRuntimeViz() {
  return (
    <div
      className="not-prose min-w-0 [&_.step-viz]:my-8 [&_.step-viz__stage]:min-h-[300px] sm:[&_.step-viz__stage]:min-h-[410px]"
      data-sd-runtime-viz
    >
      <StepViz steps={[...steps]} stageClassName="!items-stretch bg-muted/[0.06]">
        {(step) => <RuntimeStage step={step} />}
      </StepViz>
    </div>
  );
}
