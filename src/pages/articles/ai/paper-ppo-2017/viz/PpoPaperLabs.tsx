import { useState } from 'react';
import {
  Activity,
  ArchiveRestore,
  ChartNoAxesCombined,
  CircleGauge,
  Play,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

function formatNumber(value: number) {
  const normalized = Math.abs(value) < 0.0005 ? 0 : value;
  return normalized.toFixed(2);
}

export function PpoClipLab() {
  const [positive, setPositive] = useState(true);
  const [ratio, setRatio] = useState(1.3);
  const advantage = positive ? 1 : -1;
  const clippedRatio = Math.min(1.2, Math.max(0.8, ratio));
  const raw = ratio * advantage;
  const clipped = clippedRatio * advantage;
  const selected = Math.min(raw, clipped);
  const marker = ((ratio - 0.5) / 1) * 100;
  const clippedBranchSelected = Math.abs(selected - clipped) < 0.0001;

  return (
    <figure
      className="not-prose my-9 overflow-hidden rounded-md border border-border bg-background"
      data-ppo-clip-lab
      data-viz-canvas
    >
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <p className="font-mono text-xs font-bold text-rose-700 dark:text-rose-300">
          SIGNED CLIP LAB · ε=0.2
        </p>
        <h3 className="mt-2 text-lg font-bold">Clip은 ratio를 자르는 것이 아니라 두 surrogate 중 더 작은 값을 고른다</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Advantage 부호와 새/옛 policy 비율을 바꾸며 어느 방향의 과도한 개선만 막고, 해로운 이동은 그대로 벌주는지 확인한다.
        </p>
      </figcaption>

      <div className="grid gap-px border-b border-border bg-border sm:grid-cols-[15rem_minmax(0,1fr)]">
        <div className="grid grid-cols-2 gap-px bg-border" role="group" aria-label="Advantage 부호">
          <button
            type="button"
            aria-pressed={positive}
            onClick={() => setPositive(true)}
            className={`min-h-14 bg-background px-3 text-xs font-bold ${
              positive ? 'shadow-[inset_0_-3px_0_0_hsl(var(--foreground))]' : 'text-muted-foreground'
            }`}
          >
            A = +1
          </button>
          <button
            type="button"
            aria-pressed={!positive}
            onClick={() => setPositive(false)}
            className={`min-h-14 bg-background px-3 text-xs font-bold ${
              !positive ? 'shadow-[inset_0_-3px_0_0_hsl(var(--foreground))]' : 'text-muted-foreground'
            }`}
          >
            A = −1
          </button>
        </div>
        <label className="min-w-0 bg-background px-4 py-3 sm:px-5">
          <span className="flex items-center justify-between gap-4 text-xs font-bold">
            Policy ratio rₜ
            <output className="font-mono text-sm" data-ppo-ratio-output>{ratio.toFixed(2)}</output>
          </span>
          <input
            aria-label="Policy ratio"
            className="mt-2 w-full accent-foreground"
            type="range"
            min="0.5"
            max="1.5"
            step="0.05"
            value={ratio}
            onChange={(event) => setRatio(Number(event.target.value))}
          />
        </label>
      </div>

      <div className="p-4 sm:p-6">
        <div className="relative h-14" aria-label={`Clip band 0.8에서 1.2, 현재 ratio ${ratio.toFixed(2)}`}>
          <div className="absolute inset-x-0 top-6 h-1 bg-muted" />
          <div className="absolute left-[30%] right-[30%] top-5 h-3 bg-emerald-500/25" />
          <div className="absolute left-[30%] top-2 h-8 w-px bg-emerald-700/70" />
          <div className="absolute right-[30%] top-2 h-8 w-px bg-emerald-700/70" />
          <motion.div
            className="absolute top-1 h-10 w-1 bg-foreground"
            animate={{ left: `calc(${marker}% - 2px)` }}
            transition={{ duration: 0.15 }}
          />
          <span className="absolute left-[30%] top-10 -translate-x-1/2 font-mono text-xs text-muted-foreground">0.8</span>
          <span className="absolute left-1/2 top-10 -translate-x-1/2 font-mono text-xs text-muted-foreground">1.0</span>
          <span className="absolute right-[30%] top-10 translate-x-1/2 font-mono text-xs text-muted-foreground">1.2</span>
        </div>

        <dl className="mt-7 grid gap-px border border-border bg-border sm:grid-cols-3">
          <Metric label="RAW · rₜAₜ" value={formatNumber(raw)} note={`${ratio.toFixed(2)} × ${positive ? '+1' : '−1'}`} />
          <Metric label="CLIPPED" value={formatNumber(clipped)} note={`${clippedRatio.toFixed(2)} × ${positive ? '+1' : '−1'}`} />
          <Metric label="MIN · 선택" value={formatNumber(selected)} note={clippedBranchSelected ? 'Clipped branch' : 'Raw branch'} strong />
        </dl>

        <div className={`mt-4 flex gap-3 border-l-2 px-4 py-3 text-sm leading-relaxed ${
          clippedBranchSelected
            ? 'border-amber-600 bg-amber-500/[0.06]'
            : 'border-cyan-700 bg-cyan-500/[0.05]'
        }`}>
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            {positive
              ? ratio > 1.2
                ? '좋았던 행동의 확률을 1.2보다 더 올려 얻는 추가 이득을 잘랐다.'
                : '좋았던 행동의 확률이 clip 상한 안이거나 낮아졌으므로 raw 불이익을 그대로 남긴다.'
              : ratio < 0.8
                ? '나빴던 행동의 확률을 0.8보다 더 낮춰 얻는 추가 이득을 잘랐다.'
                : '나빴던 행동의 확률을 높이는 해로운 이동은 상한 밖이어도 raw 손해를 그대로 남긴다.'}
          </p>
        </div>
      </div>
    </figure>
  );
}

function Metric({
  label,
  value,
  note,
  strong = false,
}: {
  label: string;
  value: string;
  note: string;
  strong?: boolean;
}) {
  return (
    <div className={`min-w-0 bg-background p-4 ${strong ? 'shadow-[inset_0_3px_0_0_hsl(var(--foreground))]' : ''}`}>
      <dt className="font-mono text-xs font-bold text-muted-foreground">{label}</dt>
      <dd className="mt-2 font-mono text-xl font-black">{value}</dd>
      <dd className="mt-1 text-xs text-muted-foreground">{note}</dd>
    </div>
  );
}

const iterationStages = [
  {
    order: '01',
    label: 'Rollout',
    icon: Play,
    immutable: '현재 θ_old로 기록한 action과 old_log_prob',
    update: 'N actors × T steps의 observation, reward, done buffer',
    invariant: '한 rollout 안의 모든 sample은 같은 behavior policy snapshot을 가리킨다.',
    failure: 'Update 도중 old_log_prob를 다시 계산하면 ratio 분모가 움직여 clip 의미가 사라진다.',
  },
  {
    order: '02',
    label: 'Advantage · target',
    icon: Activity,
    immutable: 'Reward, done mask와 rollout 당시 value estimate',
    update: 'GAE advantage Âₜ와 return target V̂ₜ',
    invariant: 'Advantage는 batch에서 normalize할 수 있어도 old action provenance는 바꾸지 않는다.',
    failure: 'Terminal mask나 bootstrap 경계를 틀리면 policy loss 이전에 학습 신호가 오염된다.',
  },
  {
    order: '03',
    label: 'K minibatch epochs',
    icon: RefreshCw,
    immutable: '같은 rollout, old_log_prob, Âₜ와 V̂ₜ',
    update: '현재 θ와 value parameters를 여러 minibatch pass로 최적화',
    invariant: '각 minibatch에서 새 log_prob만 다시 계산하고 ratio=exp(new−old)를 만든다.',
    failure: 'K를 늘려도 새 sample이 생기지 않는다. 지나친 epoch는 같은 data에 policy를 과도하게 이동시킨다.',
  },
  {
    order: '04',
    label: 'Diagnostics',
    icon: CircleGauge,
    immutable: 'Update 전 old policy와 이번 rollout',
    update: 'Approx KL, clip fraction, entropy, value error',
    invariant: 'Clip은 hard constraint가 아니므로 실제 이동량은 별도로 관측한다.',
    failure: 'Clipped objective만 보고 KL 폭주나 entropy collapse를 놓칠 수 있다.',
  },
  {
    order: '05',
    label: 'Policy snapshot',
    icon: ArchiveRestore,
    immutable: '완료된 K epoch의 최종 parameters',
    update: 'θ_old ← θ 후 다음 rollout 시작',
    invariant: 'Snapshot 교체는 rollout과 update 사이의 명시적 경계에서 한 번 일어난다.',
    failure: 'Actor마다 다른 시점의 policy가 섞이면 하나의 old policy라는 ratio 가정이 깨진다.',
  },
] as const;

export function PpoIterationLab() {
  const [selected, setSelected] = useState(0);
  const reduceMotion = useReducedMotion();
  const stage = iterationStages[selected];
  const Icon = stage.icon;

  return (
    <figure
      className="not-prose my-9 overflow-hidden rounded-md border border-border bg-background"
      data-ppo-iteration-lab
      data-viz-canvas
    >
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <p className="font-mono text-xs font-bold text-cyan-700 dark:text-cyan-300">
          ALGORITHM 1 · STATE LEDGER
        </p>
        <h3 className="mt-2 text-lg font-bold">PPO의 핵심 상태는 K epoch 동안 움직이지 않는 old policy다</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          실행 단계를 선택해 읽기 전용 artifact, 실제 update와 깨지면 안 되는 invariant를 분리한다.
        </p>
      </figcaption>

      <div className="grid grid-cols-5 gap-px bg-border" role="tablist" aria-label="PPO iteration 단계">
        {iterationStages.map((item, index) => (
          <button
            key={item.order}
            type="button"
            role="tab"
            aria-selected={selected === index}
            tabIndex={selected === index ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => {
              let next = index;
              if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % iterationStages.length;
              else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + iterationStages.length) % iterationStages.length;
              else if (event.key === 'Home') next = 0;
              else if (event.key === 'End') next = iterationStages.length - 1;
              else return;
              event.preventDefault();
              setSelected(next);
            }}
            className={`min-h-16 min-w-0 bg-background px-1 py-2 text-center ${
              selected === index
                ? 'shadow-[inset_0_-3px_0_0_hsl(var(--foreground))]'
                : 'text-muted-foreground hover:bg-muted/30'
            }`}
          >
            <span className="block font-mono text-xs font-bold">{item.order}</span>
            <span className="mt-1 hidden text-xs font-bold leading-tight sm:block">{item.label}</span>
          </button>
        ))}
      </div>

      <motion.div
        key={stage.order}
        role="tabpanel"
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.2 }}
      >
        <div className="flex items-start gap-3 border-y border-border bg-muted/15 px-4 py-4 sm:px-6">
          <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-mono text-xs font-bold text-muted-foreground">STAGE {stage.order}</p>
            <h4 className="mt-1 text-base font-bold">{stage.label}</h4>
          </div>
        </div>
        <dl className="grid gap-px bg-border sm:grid-cols-2">
          <LedgerItem label="IMMUTABLE INPUT" value={stage.immutable} tone="bg-blue-500/[0.05]" />
          <LedgerItem label="UPDATED STATE" value={stage.update} tone="bg-emerald-500/[0.05]" />
          <LedgerItem label="INVARIANT" value={stage.invariant} tone="bg-background" />
          <LedgerItem label="FAILURE" value={stage.failure} tone="bg-rose-500/[0.05]" />
        </dl>
      </motion.div>
    </figure>
  );
}

function LedgerItem({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className={`min-w-0 p-4 sm:p-5 ${tone}`}>
      <dt className="font-mono text-xs font-bold text-muted-foreground">{label}</dt>
      <dd className="mt-2 text-sm font-semibold leading-relaxed">{value}</dd>
    </div>
  );
}

const evidenceTabs = [
  {
    id: 'table-1',
    label: 'Table 1',
    title: 'Continuous-control normalized score',
    rows: [
      ['No clipping', '−0.39'],
      ['Clip ε=.1 / .2 / .3', '0.76 / 0.82 / 0.70'],
      ['Adaptive KL target .003 / .01 / .03', '0.68 / 0.74 / 0.71'],
      ['Fixed KL β .3 / 1 / 3 / 10', '0.62 / 0.71 / 0.72 / 0.69'],
    ],
    supports: '이 sweep의 평균 normalized score에서는 clipped surrogate ε=.2가 비교한 PPO 변형 중 가장 높았다.',
    limit: 'ε=.2가 모든 environment와 batch size에서 최적이라는 법칙도, clip이 KL을 hard-bound한다는 증명도 아니다.',
  },
  {
    id: 'figure-3',
    label: 'Figure 3',
    title: 'MuJoCo learning curves',
    rows: [
      ['PPO', '여러 epoch의 minibatch update를 쓰는 clipped surrogate'],
      ['TRPO', 'Conjugate-gradient와 constraint 기반 비교'],
      ['A2C · A2C + Trust Region', 'Synchronous actor-critic와 trust-region 보강 비교'],
      ['CEM · Vanilla PG', '동일 figure의 다른 baseline 계열'],
      ['읽는 단위', 'Task별 return curve와 sample count'],
    ],
    supports: '여러 simulated continuous-control task에서 PPO가 sample efficiency와 최종 score의 경쟁력 있는 곡선을 보였다.',
    limit: 'Figure가 보고하지 않은 정확한 좌표를 눈대중 숫자로 만들거나, wall-clock과 real-robot 안전성을 주장하면 안 된다.',
  },
  {
    id: 'table-2',
    label: 'Table 2',
    title: 'Atari game별 승리 수',
    rows: [
      ['Average reward 전체 학습', 'A2C 1 · ACER 18 · PPO 30 · tie 0'],
      ['마지막 100 episodes', 'A2C 1 · ACER 28 · PPO 19 · tie 1'],
      ['PPO setting', '8 actors · T=128 · 3 epochs · ε=.1α'],
    ],
    supports: '학습 전체의 평균 reward 기준에서는 PPO가 더 많은 game에서 이겼다.',
    limit: '최종 100 episode 기준에서는 ACER가 28 대 19로 더 많이 이겼다. PPO가 모든 Atari metric에서 우월하다는 결론은 틀리다.',
  },
] as const;

export function PpoEvidenceLab() {
  const [selected, setSelected] = useState(0);
  const reduceMotion = useReducedMotion();
  const evidence = evidenceTabs[selected];

  return (
    <figure
      className="not-prose my-9 overflow-hidden rounded-md border border-border bg-background"
      data-ppo-evidence-lab
      data-viz-canvas
    >
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <p className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">
          EVIDENCE LAB · 이긴 기준과 진 기준
        </p>
        <h3 className="mt-2 text-lg font-bold">PPO의 강한 결과와 불리한 Atari metric을 같은 화면에서 읽는다</h3>
      </figcaption>
      <div className="grid grid-cols-3 gap-px bg-border" role="tablist" aria-label="PPO 원문 증거 선택">
        {evidenceTabs.map((tab, index) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected === index}
            tabIndex={selected === index ? 0 : -1}
            onClick={() => setSelected(index)}
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
        key={evidence.id}
        role="tabpanel"
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.2 }}
      >
        <div className="flex items-center gap-3 border-y border-border bg-muted/15 px-4 py-4 sm:px-6">
          <ChartNoAxesCombined className="h-4 w-4 shrink-0" aria-hidden="true" />
          <h4 className="text-sm font-bold">{evidence.title}</h4>
        </div>
        <dl className="divide-y divide-border">
          {evidence.rows.map(([label, value]) => (
            <div key={label} className="grid gap-1 px-4 py-4 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-5 sm:px-6">
              <dt className="text-xs font-bold leading-relaxed text-muted-foreground">{label}</dt>
              <dd className="font-mono text-[13px] font-bold leading-relaxed">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="grid gap-px border-t border-border bg-border sm:grid-cols-2">
          <div className="bg-emerald-500/[0.06] p-4 sm:p-5">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">지지하는 주장</p>
            <p className="mt-2 text-sm leading-relaxed">{evidence.supports}</p>
          </div>
          <div className="bg-rose-500/[0.05] p-4 sm:p-5">
            <p className="text-xs font-bold text-rose-700 dark:text-rose-300">증명하지 않는 것</p>
            <p className="mt-2 text-sm leading-relaxed">{evidence.limit}</p>
          </div>
        </div>
      </motion.div>
    </figure>
  );
}
