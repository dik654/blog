import { useState } from 'react';
import {
  Activity,
  ChartSpline,
  FlaskConical,
  Gauge,
  Scale,
  TriangleAlert,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const approaches = [
  {
    order: '01',
    label: 'Training-curve envelope',
    range: '70M–10B · model마다 4개 cosine horizon',
    observation: 'Run 중간 checkpoint를 포함해 FLOP마다 가장 낮은 smoothed loss를 고른다.',
    fit: '1,500개 log-spaced compute 지점의 efficient envelope에 power law를 맞춘다.',
    result: 'Nopt ∝ C⁰·⁵⁰ · Dopt ∝ C⁰·⁵⁰',
    risk: 'Learning-rate horizon을 실제 token budget에 맞추지 않으면 curve 비교가 schedule 차이를 측정한다.',
  },
  {
    order: '02',
    label: 'IsoFLOP profiles',
    range: '9개 compute budget · 6×10¹⁸–3×10²¹ FLOPs · 최대 16B',
    observation: 'Compute를 고정하고 model size를 바꿔 final loss가 내려갔다 올라오는 valley를 찾는다.',
    fit: '각 IsoFLOP curve에 parabola를 맞춰 loss-minimizing N을 찾고 compute와 power law를 맞춘다.',
    result: 'Nopt ∝ C⁰·⁴⁹ · Dopt ∝ C⁰·⁵¹',
    risk: 'Valley 양쪽의 model을 실제로 학습하지 않으면 경계점을 최적점으로 잘못 고를 수 있다.',
  },
  {
    order: '03',
    label: 'Parametric loss fit',
    range: 'Approach 1·2의 final loss · 400개가 넘는 run',
    observation: 'Loss를 irreducible, finite-model, finite-data 세 항의 합으로 가정한다.',
    fit: 'Log loss의 Huber residual을 L-BFGS와 여러 initialization으로 robust fitting한다.',
    result: 'α=.34 · β=.28 → Nopt ∝ C⁰·⁴⁶ · Dopt ∝ C⁰·⁵⁴',
    risk: '가정한 additive power law를 벗어나는 고 compute curvature와 반복 epoch regime을 설명하지 못한다.',
  },
] as const;

export function ChinchillaApproachLab() {
  const [selected, setSelected] = useState(0);
  const reduceMotion = useReducedMotion();
  const approach = approaches[selected];

  return (
    <figure
      className="not-prose my-9 overflow-hidden rounded-md border border-border bg-background"
      data-chinchilla-approach-lab
      data-viz-canvas
    >
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <p className="font-mono text-xs font-bold text-cyan-700 dark:text-cyan-300">
          THREE ESTIMATORS · 같은 질문을 다른 data slice로
        </p>
        <h3 className="mt-2 text-lg font-bold">“최적 크기”는 한 curve를 눈대중으로 읽은 결과가 아니다</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          방법을 선택해 어떤 run 지점을 관측하고, 무엇을 fit하며, 어떤 failure를 경계했는지 분리해 읽는다.
        </p>
      </figcaption>
      <div className="grid grid-cols-3 gap-px bg-border" role="tablist" aria-label="Chinchilla 분석 방법">
        {approaches.map((item, index) => (
          <button
            key={item.order}
            type="button"
            role="tab"
            aria-selected={selected === index}
            tabIndex={selected === index ? 0 : -1}
            onClick={() => setSelected(index)}
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
        key={approach.order}
        role="tabpanel"
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.2 }}
      >
        <div className="border-y border-border bg-muted/15 px-4 py-4 sm:px-6">
          <p className="font-mono text-xs font-bold text-muted-foreground">EXPERIMENT RANGE</p>
          <p className="mt-2 text-sm font-bold leading-relaxed">{approach.range}</p>
        </div>
        <dl className="grid gap-px bg-border sm:grid-cols-2">
          <ApproachItem icon={Activity} label="관측" value={approach.observation} />
          <ApproachItem icon={ChartSpline} label="추정" value={approach.fit} />
          <ApproachItem icon={Scale} label="결과" value={approach.result} tone="bg-emerald-500/[0.06]" />
          <ApproachItem icon={TriangleAlert} label="실패 경계" value={approach.risk} tone="bg-rose-500/[0.05]" />
        </dl>
      </motion.div>
    </figure>
  );
}

function ApproachItem({
  icon: Icon,
  label,
  value,
  tone = 'bg-background',
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className={`min-w-0 p-4 sm:p-5 ${tone}`}>
      <dt className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
        <Icon className="h-4 w-4" aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-2 text-sm font-semibold leading-relaxed">{value}</dd>
    </div>
  );
}

const computeMultipliers = [1, 4, 16, 64] as const;

export function ComputeAllocationLab() {
  const [index, setIndex] = useState(2);
  const compute = computeMultipliers[index];
  const chinchillaN = Math.pow(compute, 0.5);
  const chinchillaD = Math.pow(compute, 0.5);
  const kaplanN = Math.pow(compute, 0.73);
  const kaplanD = Math.pow(compute, 0.27);

  return (
    <figure
      className="not-prose my-9 overflow-hidden rounded-md border border-border bg-background"
      data-compute-allocation-lab
      data-viz-canvas
    >
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <p className="font-mono text-xs font-bold text-violet-700 dark:text-violet-300">
          ALLOCATION LAB · 기준 compute 대비 배수
        </p>
        <h3 className="mt-2 text-lg font-bold">Compute가 늘 때 model과 token 중 어느 축에 더 배분할까?</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          이 비교는 절대 model 크기를 예측하지 않는다. 두 연구가 추가 compute를 나누는 exponent의 차이를 보여준다.
        </p>
      </figcaption>
      <label className="block border-b border-border px-4 py-4 sm:px-6">
        <span className="flex items-center justify-between gap-4 text-xs font-bold">
          Training compute
          <output className="font-mono text-base">{compute}×</output>
        </span>
        <input
          aria-label="Training compute multiplier"
          className="mt-3 w-full accent-foreground"
          type="range"
          min="0"
          max="3"
          step="1"
          value={index}
          onChange={(event) => setIndex(Number(event.target.value))}
        />
        <div className="mt-1 flex justify-between font-mono text-xs text-muted-foreground">
          {computeMultipliers.map((value) => <span key={value}>{value}×</span>)}
        </div>
      </label>
      <div className="grid gap-px bg-border sm:grid-cols-2">
        <AllocationLane
          title="Chinchilla · Approach 1"
          subtitle="N ∝ C⁰·⁵⁰ · D ∝ C⁰·⁵⁰"
          model={chinchillaN}
          data={chinchillaD}
          tone="text-cyan-700 dark:text-cyan-300"
        />
        <AllocationLane
          title="Kaplan et al. 2020"
          subtitle="N ∝ C⁰·⁷³ · D ∝ C⁰·²⁷"
          model={kaplanN}
          data={kaplanD}
          tone="text-amber-700 dark:text-amber-300"
        />
      </div>
      <div className="border-t border-border bg-muted/20 px-4 py-4 text-sm leading-relaxed sm:px-6">
        <strong>{compute}× compute에서:</strong> Chinchilla fit은 model과 token을 각각 약 {chinchillaN.toFixed(1)}×로,
        Kaplan fit은 model 약 {kaplanN.toFixed(1)}×와 token 약 {kaplanD.toFixed(1)}×로 늘린다.
        이 차이가 “더 작은 model을 더 오래 학습하라”는 당시 수정의 정량적 뜻이다.
      </div>
    </figure>
  );
}

function AllocationLane({
  title,
  subtitle,
  model,
  data,
  tone,
}: {
  title: string;
  subtitle: string;
  model: number;
  data: number;
  tone: string;
}) {
  const max = Math.max(model, data, 1);
  return (
    <div className="min-w-0 bg-background p-4 sm:p-6">
      <p className={`text-sm font-bold ${tone}`}>{title}</p>
      <p className="mt-1 font-mono text-xs text-muted-foreground">{subtitle}</p>
      <dl className="mt-5 space-y-4">
        {[
          ['Model N', model],
          ['Tokens D', data],
        ].map(([label, value]) => (
          <div key={String(label)}>
            <div className="flex items-center justify-between gap-3 text-xs font-bold">
              <dt>{label}</dt>
              <dd className="font-mono">{Number(value).toFixed(1)}×</dd>
            </div>
            <div className="mt-2 h-2 bg-muted">
              <motion.div
                className="h-full bg-foreground"
                animate={{ width: `${(Number(value) / max) * 100}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}

const evidence = [
  {
    id: 'matched',
    label: 'Matched compute',
    title: '가설을 70B full run으로 검증',
    icon: Gauge,
    receipts: [
      ['Gopher', '280B parameters · 약 300B tokens'],
      ['Chinchilla', '70B parameters · 1.4T tokens'],
      ['Training compute', '두 run 모두 약 5.76×10²³ FLOPs'],
      ['Inference consequence', 'Chinchilla는 parameter가 4× 작아 memory footprint와 inference cost도 더 작음'],
    ],
    reading: '같은 compute에서 parameter를 줄이고 data를 늘린 model이 대부분의 평가에서 큰 model을 이겼다는 직접 검증이다.',
  },
  {
    id: 'downstream',
    label: 'Downstream',
    title: '강한 평균과 남은 예외를 함께 기록',
    icon: FlaskConical,
    receipts: [
      ['MMLU 5-shot', 'Chinchilla 67.6% · Gopher 60.0% · 57 tasks'],
      ['MMLU task별', '51/57 개선 · 4개 하락 · 2개 동일'],
      ['BIG-bench', 'Chinchilla 65.1% · Gopher 54.4% · 62 tasks'],
      ['LAMBADA', 'Chinchilla 77.4% · Gopher 74.5%'],
    ],
    reading: '“Uniformly”라는 abstract 표현을 task별 완전 승리로 읽지 않는다. 평균은 강하지만 MMLU와 BIG-bench에 하락 task가 있었다.',
  },
  {
    id: 'limits',
    label: 'Limits',
    title: '논문이 스스로 닫은 외삽 경계',
    icon: TriangleAlert,
    receipts: [
      ['Large-scale comparison', '직접 비교 가능한 큰 run은 Chinchilla와 Gopher 두 개'],
      ['Functional assumption', 'N·D·C의 efficient frontier를 power law로 가정'],
      ['Observed curvature', 'High-compute에서 log Nopt의 concavity를 관측'],
      ['Data regime', '분석 run은 모두 1 epoch 미만 · repeated-data regime 미검증'],
    ],
    reading: '20 tokens/parameter를 영구 상수로 쓰거나 여러 epoch, 새 optimizer, 새 data mixture와 inference cost까지 자동 일반화하면 안 된다.',
  },
] as const;

export function ChinchillaEvidenceLab() {
  const [selected, setSelected] = useState(0);
  const reduceMotion = useReducedMotion();
  const item = evidence[selected];
  const Icon = item.icon;

  return (
    <figure
      className="not-prose my-9 overflow-hidden rounded-md border border-border bg-background"
      data-chinchilla-evidence-lab
      data-viz-canvas
    >
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <p className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">
          RECEIPT LAB · 예측, full run, 한계
        </p>
        <h3 className="mt-2 text-lg font-bold">Scaling fit이 맞았다는 말은 어디까지 확인됐을까?</h3>
      </figcaption>
      <div className="grid grid-cols-3 gap-px bg-border" role="tablist" aria-label="Chinchilla evidence 선택">
        {evidence.map((tab, index) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected === index}
            tabIndex={selected === index ? 0 : -1}
            onClick={() => setSelected(index)}
            className={`min-h-14 min-w-0 bg-background px-2 text-xs font-bold ${
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
          {item.receipts.map(([label, value]) => (
            <div key={label} className="grid gap-1 px-4 py-4 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-5 sm:px-6">
              <dt className="text-xs font-bold text-muted-foreground">{label}</dt>
              <dd className="font-mono text-[13px] font-bold leading-relaxed">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="border-t border-border bg-emerald-500/[0.05] px-4 py-4 text-sm leading-relaxed sm:px-6">
          {item.reading}
        </div>
      </motion.div>
    </figure>
  );
}
