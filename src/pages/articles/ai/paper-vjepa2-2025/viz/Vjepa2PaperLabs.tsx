import { useState, type KeyboardEvent } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Camera,
  CircleGauge,
  Crosshair,
  ScanSearch,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

function moveTab(
  event: KeyboardEvent<HTMLButtonElement>,
  index: number,
  count: number,
  select: (next: number) => void,
) {
  let next = index;
  if (event.key === 'ArrowRight') next = (index + 1) % count;
  else if (event.key === 'ArrowLeft') next = (index - 1 + count) % count;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = count - 1;
  else return;
  event.preventDefault();
  select(next);
  event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
}

const stages = [
  {
    order: '01',
    label: 'Action-free pretraining',
    scale: '22M videos · 1M+ hours · 최대 1B encoder',
    input: 'Mask로 일부 tubelet을 버린 internet video',
    learned: '보이지 않는 patch의 target representation을 예측하는 encoder·predictor',
    boundary: '행동 command의 효과는 아직 조건으로 받지 않는다.',
    tone: 'bg-cyan-500/[0.06]',
  },
  {
    order: '02',
    label: 'AC post-training',
    scale: '<62 hours · DROID 약 23k trajectories',
    input: '16 frames + 15 action + 16 end-effector state',
    learned: 'Frozen encoder 위의 약 300M block-causal predictor',
    boundary: 'Task label, reward와 성공 여부는 사용하지 않는다.',
    tone: 'bg-violet-500/[0.06]',
  },
  {
    order: '03',
    label: 'Closed-loop planning',
    scale: 'Image goal · CEM · receding horizon',
    input: '현재 image·pose와 후보 7D action sequence',
    learned: '학습 없음 · imagined latent와 goal latent의 L1 energy로 action search',
    boundary: '첫 action만 실행하고 새 camera observation에서 다시 계획한다.',
    tone: 'bg-emerald-500/[0.06]',
  },
] as const;

export function VjepaStageLab() {
  const [selected, setSelected] = useState(0);
  const reduceMotion = useReducedMotion();
  const stage = stages[selected];

  return (
    <figure
      className="not-prose my-9 overflow-hidden rounded-md border border-border bg-background"
      data-vjepa-stage-lab
      data-viz-canvas
    >
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <p className="font-mono text-xs font-bold text-cyan-700 dark:text-cyan-300">
          STAGE-WISE TRANSFER · video에서 robot action으로
        </p>
        <h3 className="mt-2 text-lg font-bold">큰 video pretraining과 작은 interaction data는 같은 module을 학습하지 않는다</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          단계를 선택해 data scale, 움직이는 parameter와 아직 주장하지 않는 경계를 함께 읽는다.
        </p>
      </figcaption>
      <div className="grid grid-cols-3 gap-px bg-border" role="tablist" aria-label="V-JEPA 2 단계 선택">
        {stages.map((item, index) => (
          <button
            key={item.order}
            type="button"
            role="tab"
            aria-selected={selected === index}
            tabIndex={selected === index ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => moveTab(event, index, stages.length, setSelected)}
            className={`min-h-16 min-w-0 bg-background px-2 py-2 text-left sm:px-4 ${
              selected === index
                ? 'shadow-[inset_0_-3px_0_0_hsl(var(--foreground))]'
                : 'text-muted-foreground hover:bg-muted/30'
            }`}
          >
            <span className="font-mono text-xs font-bold">{item.order}</span>
            <span className="mt-1 block text-xs font-bold leading-tight text-foreground">{item.label}</span>
          </button>
        ))}
      </div>
      <motion.div
        key={stage.order}
        role="tabpanel"
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.2 }}
        className={stage.tone}
      >
        <div className="border-y border-border px-4 py-4 sm:px-6">
          <p className="font-mono text-xs font-bold text-muted-foreground">SCALE</p>
          <p className="mt-2 text-sm font-black">{stage.scale}</p>
        </div>
        <dl className="grid gap-px bg-border sm:grid-cols-3">
          <StageItem label="INPUT" value={stage.input} />
          <StageItem label="OUTPUT · UPDATE" value={stage.learned} />
          <StageItem label="BOUNDARY" value={stage.boundary} />
        </dl>
      </motion.div>
    </figure>
  );
}

function StageItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 bg-background p-4 sm:p-5">
      <dt className="font-mono text-xs font-bold text-muted-foreground">{label}</dt>
      <dd className="mt-2 text-sm font-semibold leading-relaxed">{value}</dd>
    </div>
  );
}

const trainingModes = [
  {
    id: 'teacher',
    label: 'Teacher forcing · T=15',
    input: '각 step의 실제 frozen encoder feature zₖ',
    recurrence: '예측 ẑₖ₊₁은 loss에만 쓰고 다음 입력은 실제 zₖ₊₁',
    target: '15개 next-frame feature map',
    strength: 'Transition마다 stable supervision을 주어 one-step dynamics를 맞힌다.',
    limit: 'Inference에서 자기 prediction을 다시 넣을 때 생기는 분포 이동을 직접 보지 않는다.',
  },
  {
    id: 'rollout',
    label: 'Rollout · 실제 T=2',
    input: '시작의 실제 z₁ 뒤에는 predictor가 만든 ẑ를 다시 입력',
    recurrence: '한 recurrent step을 통과해 final imagined feature를 target과 비교',
    target: '두 action 뒤의 실제 z₃',
    strength: '자기 오차를 입력으로 본 뒤 누적을 줄이는 신호를 준다.',
    limit: '긴 horizon 전체를 학습한 것이 아니며 paper Figure 6의 T=4는 설명용 그림이다.',
  },
] as const;

export function VjepaTrainingLab() {
  const [selected, setSelected] = useState(0);
  const reduceMotion = useReducedMotion();
  const mode = trainingModes[selected];

  return (
    <figure
      className="not-prose my-9 overflow-hidden rounded-md border border-border bg-background"
      data-vjepa-training-lab
      data-viz-canvas
    >
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <p className="font-mono text-xs font-bold text-violet-700 dark:text-violet-300">
          TRAINING TRACE · 무엇을 다음 입력으로 쓰는가
        </p>
        <h3 className="mt-2 text-lg font-bold">Teacher forcing 15-step과 rollout 2-step의 T는 같은 뜻이 아니다</h3>
      </figcaption>
      <div className="grid grid-cols-2 gap-px bg-border" role="tablist" aria-label="V-JEPA 2-AC loss 모드">
        {trainingModes.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selected === index}
            tabIndex={selected === index ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => moveTab(event, index, trainingModes.length, setSelected)}
            className={`min-h-14 bg-background px-3 text-xs font-bold ${
              selected === index
                ? 'shadow-[inset_0_-3px_0_0_hsl(var(--foreground))]'
                : 'text-muted-foreground hover:bg-muted/30'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <motion.div
        key={mode.id}
        role="tabpanel"
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.2 }}
      >
        <div className="grid gap-2 border-y border-border bg-muted/15 p-4 sm:p-6 md:grid-cols-[minmax(0,1fr)_1rem_minmax(0,1fr)_1rem_minmax(0,1fr)] md:items-stretch">
          {[
            ['INPUT', mode.input],
            ['RECURRENCE', mode.recurrence],
            ['TARGET', mode.target],
          ].map(([label, value], index) => (
            <div key={label} className="contents">
              <div className="min-w-0 border border-border bg-background p-4">
                <p className="font-mono text-xs font-bold text-muted-foreground">{label}</p>
                <p className="mt-2 text-sm font-bold leading-relaxed">{value}</p>
              </div>
              {index < 2 && (
                <>
                  <ArrowDown className="mx-auto h-4 w-4 text-muted-foreground md:hidden" aria-hidden="true" />
                  <div className="hidden items-center justify-center md:flex">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="grid gap-px bg-border sm:grid-cols-2">
          <div className="bg-emerald-500/[0.06] p-4 sm:p-5">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">얻는 신호</p>
            <p className="mt-2 text-sm leading-relaxed">{mode.strength}</p>
          </div>
          <div className="bg-rose-500/[0.05] p-4 sm:p-5">
            <p className="text-xs font-bold text-rose-700 dark:text-rose-300">남는 한계</p>
            <p className="mt-2 text-sm leading-relaxed">{mode.limit}</p>
          </div>
        </div>
      </motion.div>
      <div className="grid gap-px border-t border-border bg-border sm:grid-cols-3">
        <Receipt label="ENCODER FEATURE" value="16×16×1408 · frozen ViT-g" />
        <Receipt label="ROBOT TOKEN" value="State 7D · action 7D" />
        <Receipt label="PREDICTOR" value="~300M · 24L · 16 heads · width 1024" />
      </div>
    </figure>
  );
}

function Receipt({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 bg-background p-4">
      <p className="font-mono text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-2 font-mono text-[12px] font-bold leading-relaxed">{value}</p>
    </div>
  );
}

const evidenceTabs = [
  {
    id: 'representation',
    label: 'Represent',
    icon: ScanSearch,
    title: 'Action 없이 배운 video representation',
    rows: [
      ['Something-Something v2', '77.3 top-1 · attentive probe'],
      ['Epic-Kitchens-100', '39.7 action recall@5 · 이전 best 대비 44% relative 개선'],
      ['Video QA + 8B LLM', 'PerceptionTest 84.0 · TempCompass 76.9'],
    ],
    limit: 'Probe와 language alignment 결과는 robot control 성공을 직접 증명하지 않는다.',
  },
  {
    id: 'robot',
    label: 'Robot',
    icon: Crosshair,
    title: '두 새 lab에서 zero-shot closed loop',
    rows: [
      ['Deployment', 'DROID에 없던 두 lab · Franka + RobotiQ · monocular RGB'],
      ['V-JEPA 2-AC 평균', 'Reach 100 · Grasp cup/box 65/25 · Reach+object 75/75 · Pick-place 80/65%'],
      ['Trials', '각 task permutation 10회 · 같은 weights와 inference code'],
    ],
    limit: 'Camera 위치를 수동으로 고른 뒤 평가했고 성공률은 소규모 task와 object set에 한정된다.',
  },
  {
    id: 'planner',
    label: 'Planner',
    icon: CircleGauge,
    title: '같은 RTX 4090의 latent-vs-pixel planning',
    rows: [
      ['Cosmos', '80 samples · 10 refinements · horizon 1 · 4분/action'],
      ['V-JEPA 2-AC', '800 samples · 10 refinements · horizon 1 · 16초/action'],
      ['Lab 2 V-JEPA 2-AC', 'Reach 100 · Grasp 60/20 · Pick-place 80/50%'],
      ['Lab 2 Cosmos', 'Reach 80 · Grasp 0/20 · Pick-place 0/0%'],
    ],
    limit: 'Sample 수가 같지 않다. 이 표는 representation-space planning의 실용 결과이지 architecture만의 통제 실험이 아니다.',
  },
] as const;

export function VjepaEvidenceLab() {
  const [selected, setSelected] = useState(0);
  const reduceMotion = useReducedMotion();
  const item = evidenceTabs[selected];
  const Icon = item.icon;

  return (
    <figure
      className="not-prose my-9 overflow-hidden rounded-md border border-border bg-background"
      data-vjepa-evidence-lab
      data-viz-canvas
    >
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <p className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">
          EVIDENCE LAB · 이해, robot, planner
        </p>
        <h3 className="mt-2 text-lg font-bold">세 결과는 같은 능력을 측정하지 않는다</h3>
      </figcaption>
      <div className="grid grid-cols-3 gap-px bg-border" role="tablist" aria-label="V-JEPA 2 evidence">
        {evidenceTabs.map((tab, index) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected === index}
            tabIndex={selected === index ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => moveTab(event, index, evidenceTabs.length, setSelected)}
            className={`min-h-14 bg-background px-2 text-xs font-bold ${
              selected === index
                ? 'shadow-[inset_0_-3px_0_0_hsl(var(--foreground))]'
                : 'text-muted-foreground hover:bg-muted/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <motion.div
        key={item.id}
        role="tabpanel"
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.2 }}
      >
        <div className="flex items-start gap-3 border-y border-border bg-muted/15 px-4 py-4 sm:px-6">
          <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <h4 className="text-sm font-bold">{item.title}</h4>
        </div>
        <dl className="divide-y divide-border">
          {item.rows.map(([label, value]) => (
            <div key={label} className="grid gap-1 px-4 py-4 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-5 sm:px-6">
              <dt className="text-xs font-bold text-muted-foreground">{label}</dt>
              <dd className="font-mono text-[12px] font-bold leading-relaxed">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="flex gap-3 border-t border-border bg-rose-500/[0.05] px-4 py-4 text-sm leading-relaxed sm:px-6">
          <Camera className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p><strong>증거 경계.</strong> {item.limit}</p>
        </div>
      </motion.div>
    </figure>
  );
}
