import { useMemo, useState, type ReactNode } from 'react';
import {
  Boxes,
  Check,
  CircleAlert,
  Cpu,
  Gauge,
  HardDrive,
  Layers3,
  Route,
  Scale,
  Sparkles,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SegmentedControl } from '../../nlp-shared';

function LabShell({
  lab,
  eyebrow,
  title,
  children,
  footer,
}: {
  lab: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <section
      data-lab={lab}
      className="not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background shadow-sm"
    >
      <header className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-[11px] font-semibold uppercase text-muted-foreground">{eyebrow}</p>
        <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">{title}</h3>
      </header>
      <div className="min-w-0 space-y-5 p-4 sm:p-5">{children}</div>
      <footer className="border-t border-border bg-muted/15 px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-5">
        {footer}
      </footer>
    </section>
  );
}

function Verdict({
  good,
  title,
  description,
}: {
  good: boolean;
  title: string;
  description: string;
}) {
  return (
    <div className={`flex min-w-0 items-start gap-3 border-y py-4 ${good ? 'border-emerald-600/30' : 'border-amber-600/30'}`}>
      {good
        ? <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-300" />
        : <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" />}
      <div className="min-w-0">
        <p className="text-sm font-bold">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

type DeviceMemory = '24' | '48' | '80';
type ContextLength = '2k' | '8k' | '32k';
type Concurrency = '1' | '8' | '32';
type WeightMode = 'bf16' | 'int4';

export function MemoryEnvelopeLab() {
  const [device, setDevice] = useState<DeviceMemory>('24');
  const [context, setContext] = useState<ContextLength>('8k');
  const [concurrency, setConcurrency] = useState<Concurrency>('8');
  const [weightMode, setWeightMode] = useState<WeightMode>('bf16');

  const budget = Number(device);
  const tokens = { '2k': 2048, '8k': 8192, '32k': 32768 }[context];
  const requests = Number(concurrency);
  const weights = weightMode === 'bf16' ? 14 : 4.5;
  // Illustrative 7B GQA model: 32 layers, 8 KV heads, head dim 128, BF16 KV.
  const kv = (2 * 32 * 8 * 128 * 2 * tokens * requests) / 1024 ** 3;
  const workspace = 2.5;
  const total = weights + kv + workspace;
  const scale = Math.max(total, budget);
  const fits = total <= budget;

  const segments = [
    { label: '가중치', value: weights, color: 'bg-blue-600' },
    { label: 'KV cache', value: kv, color: 'bg-violet-600' },
    { label: '작업 공간', value: workspace, color: 'bg-amber-600' },
  ];

  return (
    <LabShell
      lab="memory-envelope"
      eyebrow="Memory envelope lab"
      title="가중치를 줄여도 긴 문맥과 동시 요청이 다시 메모리를 채운다"
      footer="수치는 7B GQA 가상 모델의 산술 예시다. 실제 값은 layer, KV head, head dimension, dtype, allocator와 runtime workspace를 실측해 교체한다."
    >
      <div className="flex min-w-0 flex-wrap gap-3">
        <SegmentedControl
          label="GPU 메모리"
          value={device}
          onChange={setDevice}
          options={[
            { value: '24', label: '24 GB' },
            { value: '48', label: '48 GB' },
            { value: '80', label: '80 GB' },
          ]}
        />
        <SegmentedControl
          label="가중치 표현"
          value={weightMode}
          onChange={setWeightMode}
          options={[
            { value: 'bf16', label: 'BF16' },
            { value: 'int4', label: 'INT4 예시' },
          ]}
        />
        <SegmentedControl
          label="요청당 문맥"
          value={context}
          onChange={setContext}
          options={[
            { value: '2k', label: '2K' },
            { value: '8k', label: '8K' },
            { value: '32k', label: '32K' },
          ]}
        />
        <SegmentedControl
          label="동시 요청"
          value={concurrency}
          onChange={setConcurrency}
          options={[
            { value: '1', label: '1' },
            { value: '8', label: '8' },
            { value: '32', label: '32' },
          ]}
        />
      </div>

      <div className="space-y-3 border-y border-border py-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">예상 peak 구성</p>
            <p className="mt-1 font-mono text-lg font-bold">{total.toFixed(1)} GB / {budget} GB</p>
          </div>
          <Gauge className={`h-6 w-6 shrink-0 ${fits ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}`} />
        </div>
        <div className="relative h-7 overflow-hidden rounded-sm bg-muted ring-1 ring-inset ring-border/50">
          <div className="flex h-full">
            {segments.map((segment) => (
              <motion.span
                key={segment.label}
                className={segment.color}
                initial={false}
                animate={{ width: `${(segment.value / scale) * 100}%` }}
                transition={{ type: 'spring', stiffness: 170, damping: 24 }}
              />
            ))}
          </div>
          {total > budget && (
            <span
              className="absolute inset-y-0 w-0.5 bg-foreground"
              style={{ left: `${(budget / scale) * 100}%` }}
              aria-label="GPU 메모리 한계"
            />
          )}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {segments.map((segment) => (
            <div key={segment.label} className="min-w-0">
              <span className={`mr-1.5 inline-block h-2 w-2 rounded-sm ${segment.color}`} />
              <span className="text-[11px] text-muted-foreground">{segment.label}</span>
              <p className="mt-0.5 break-words font-mono text-xs font-bold">{segment.value.toFixed(1)} GB</p>
            </div>
          ))}
        </div>
      </div>

      <Verdict
        good={fits}
        title={fits ? '이 가정에서는 메모리 envelope 안에 들어온다' : '가중치 압축만으로는 들어오지 않는다'}
        description={fits
          ? '이제 같은 request distribution에서 TTFT, TPOT, throughput과 품질을 실측해야 한다. Fit은 release가 아니라 다음 시험의 입장권이다.'
          : 'KV cache가 병목이면 weight-only INT4를 반복해도 해결되지 않는다. Context·동시성 정책, KV dtype, paging 또는 더 작은 architecture를 함께 검토한다.'}
      />
    </LabShell>
  );
}

type Bottleneck = 'weights' | 'kv' | 'compute' | 'runtime' | 'capability';
type TrainingAccess = 'yes' | 'no';

export function CompressionGateLab() {
  const [bottleneck, setBottleneck] = useState<Bottleneck>('weights');
  const [training, setTraining] = useState<TrainingAccess>('no');

  const decision = useMemo(() => {
    const trainingPossible = training === 'yes';
    const map: Record<Bottleneck, { branch: string; reason: string; icon: ReactNode }> = {
      weights: {
        branch: trainingPossible ? 'PTQ/QAT 또는 구조 축소를 비교' : 'Weight-only PTQ를 첫 후보로',
        reason: 'Checkpoint·HBM·memory bandwidth를 직접 줄인다. 실제 runtime의 low-bit kernel과 packing 지원이 선행 조건이다.',
        icon: <HardDrive className="h-5 w-5" />,
      },
      kv: {
        branch: 'KV 정책과 KV quantization 경로',
        reason: 'Weight-only 압축은 요청마다 늘어나는 KV를 바꾸지 않는다. Context·동시성·GQA 구조·paging을 함께 본다.',
        icon: <Layers3 className="h-5 w-5" />,
      },
      compute: {
        branch: trainingPossible ? 'W8A8/FP8, 구조 프루닝, 작은 Student' : '지원 kernel과 batching부터',
        reason: '낮은 bit가 실제 GEMM 경로를 바꾸거나 tensor shape 자체가 작아져야 한다. 저장 크기만 줄어서는 부족하다.',
        icon: <Cpu className="h-5 w-5" />,
      },
      runtime: {
        branch: 'Scheduler·batching·kernel·I/O를 먼저 교정',
        reason: 'Model rewrite 전에 profiler로 queue, launch, serialization과 host-device transfer를 분리한다.',
        icon: <Route className="h-5 w-5" />,
      },
      capability: {
        branch: trainingPossible ? 'Student/architecture와 data objective를 재설계' : '압축보다 모델·데이터 선택을 재검토',
        reason: '원본 모델이 실패하는 품질 slice는 압축 기법이 복구해 주지 않는다. Distillation도 teacher의 오류와 편향을 옮길 수 있다.',
        icon: <Sparkles className="h-5 w-5" />,
      },
    };
    return map[bottleneck];
  }, [bottleneck, training]);

  return (
    <LabShell
      lab="compression-gate"
      eyebrow="Intervention gate"
      title="관측한 병목이 바뀌면 첫 번째 경량화 기법도 바뀐다"
      footer="한 번에 하나의 원인을 바꾼다. 여러 기법을 조합할 때는 각 단독 run과 조합 run이 모두 있어야 상호작용을 설명할 수 있다."
    >
      <div className="flex min-w-0 flex-wrap gap-3">
        <SegmentedControl
          label="지배적인 실패"
          value={bottleneck}
          onChange={setBottleneck}
          options={[
            { value: 'weights', label: '가중치' },
            { value: 'kv', label: 'KV' },
            { value: 'compute', label: '연산' },
            { value: 'runtime', label: '런타임' },
            { value: 'capability', label: '품질' },
          ]}
        />
        <SegmentedControl
          label="재학습 가능 여부"
          value={training}
          onChange={setTraining}
          options={[
            { value: 'no', label: '불가' },
            { value: 'yes', label: '가능' },
          ]}
        />
      </div>
      <motion.div
        key={`${bottleneck}-${training}`}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid min-w-0 grid-cols-[2.5rem_minmax(0,1fr)] gap-3 border-y border-border py-4"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-500/[0.08] text-blue-700 dark:text-blue-300">
          {decision.icon}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold">{decision.branch}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{decision.reason}</p>
        </div>
      </motion.div>
    </LabShell>
  );
}

type QuantBits = '8' | '4';
type QuantGranularity = 'tensor' | 'group' | 'channel';
type OutlierMode = 'mild' | 'spike';

export function RangeOutlierLab() {
  const [bits, setBits] = useState<QuantBits>('4');
  const [granularity, setGranularity] = useState<QuantGranularity>('tensor');
  const [outlier, setOutlier] = useState<OutlierMode>('spike');

  const range = outlier === 'spike' ? 16 : 3;
  const levels = 2 ** Number(bits);
  const granularityFactor = { tensor: 1, group: 0.56, channel: 0.34 }[granularity];
  const step = (2 * range * granularityFactor) / (levels - 1);
  const harmful = step > 0.25;
  const samples = outlier === 'spike'
    ? [0.4, -0.8, 1.2, -1.6, 0.7, 16]
    : [0.4, -0.8, 1.2, -1.6, 0.7, 2.4];

  return (
    <LabShell
      lab="range-outlier"
      eyebrow="Quantization error lab"
      title="하나의 큰 값이 같은 scale을 쓰는 작은 값들의 눈금을 벌린다"
      footer="오차 수치는 원리를 보여 주는 정규화 예시다. 실제 선택은 layer·channel·token별 activation histogram과 target task의 품질 변화로 검증한다."
    >
      <div className="flex min-w-0 flex-wrap gap-3">
        <SegmentedControl
          label="비트 수"
          value={bits}
          onChange={setBits}
          options={[
            { value: '8', label: 'INT8' },
            { value: '4', label: 'INT4' },
          ]}
        />
        <SegmentedControl
          label="Scale 공유 범위"
          value={granularity}
          onChange={setGranularity}
          options={[
            { value: 'tensor', label: 'Tensor' },
            { value: 'group', label: 'Group' },
            { value: 'channel', label: 'Channel' },
          ]}
        />
        <SegmentedControl
          label="분포"
          value={outlier}
          onChange={setOutlier}
          options={[
            { value: 'mild', label: '완만함' },
            { value: 'spike', label: 'Outlier' },
          ]}
        />
      </div>
      <div className="grid min-w-0 grid-cols-6 items-end gap-2 border-y border-border py-4" aria-label="정규화된 값 분포">
        {samples.map((value, index) => (
          <div key={`${index}-${value}`} className="flex min-w-0 flex-col items-center gap-2">
            <motion.span
              initial={false}
              animate={{ height: `${Math.max(8, (Math.abs(value) / 16) * 96)}px` }}
              className={`w-full max-w-8 rounded-sm ${Math.abs(value) > 3 ? 'bg-amber-600' : 'bg-blue-600/75'}`}
            />
            <span className="font-mono text-[10px] text-muted-foreground">{value}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-px overflow-hidden rounded-md border border-border bg-border">
        {[
          ['표현 단계', levels.toLocaleString('ko-KR'), '2^bit'],
          ['예시 눈금 간격', step.toFixed(3), '작을수록 촘촘함'],
          ['공유 범위', { tensor: '전체', group: '그룹별', channel: '채널별' }[granularity], 'metadata·kernel 비용과 교환'],
        ].map(([label, value, note]) => (
          <div key={label} className="min-w-0 bg-background px-2 py-3 sm:p-3">
            <p className="text-xs font-semibold text-muted-foreground">{label}</p>
            <p className="mt-1 break-words font-mono text-sm font-bold sm:text-base">{value}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{note}</p>
          </div>
        ))}
      </div>
      <Verdict
        good={!harmful}
        title={harmful ? '작은 값들의 rounding 오차가 커지는 조건' : '이 예시에서는 눈금이 충분히 촘촘하다'}
        description={harmful
          ? '비트를 무조건 올리기 전에 group/channel scale, clipping, activation smoothing 또는 salient-weight 보호가 target slice를 회복하는지 비교한다.'
          : '더 촘촘한 granularity는 scale metadata와 kernel 제약을 늘릴 수 있다. 품질만이 아니라 실제 packing과 latency까지 함께 측정한다.'}
      />
    </LabShell>
  );
}

type StoredPrecision = 'bf16' | 'w4' | 'w8a8';
type ExecutionPath = 'generic' | 'native';

export function KernelRealizationLab() {
  const [stored, setStored] = useState<StoredPrecision>('w4');
  const [execution, setExecution] = useState<ExecutionPath>('generic');

  const result = useMemo(() => {
    if (stored === 'bf16') {
      return {
        good: true,
        title: '고정밀 baseline 경로',
        description: '압축 이득은 없지만 비교 가능한 기준이다. 같은 runtime·batch·request shape로 측정한다.',
        memory: '기준',
        compute: 'BF16 kernel',
      };
    }
    if (execution === 'generic') {
      return {
        good: false,
        title: '파일은 작아져도 실행 이득은 미확정',
        description: '실행 때 dequantize한 뒤 dense matmul을 하면 memory는 줄어도 latency가 같거나 느려질 수 있다.',
        memory: stored === 'w4' ? '크게 감소' : '감소',
        compute: 'Dequant + dense',
      };
    }
    return {
      good: true,
      title: '실현 가능한 low-bit 실행 후보',
      description: stored === 'w4'
        ? '지원되는 weight-only fused kernel에서 memory bandwidth 이득을 검증한다. Prefill과 decode를 따로 잰다.'
        : 'Activation까지 낮은 정밀도로 계산하는 지원 GEMM에서 compute-bound prefill 이득도 검증할 수 있다.',
      memory: stored === 'w4' ? '크게 감소' : '감소',
      compute: stored === 'w4' ? 'Fused W4 path' : 'INT8 GEMM',
    };
  }, [execution, stored]);

  return (
    <LabShell
      lab="kernel-realization"
      eyebrow="Runtime realization lab"
      title="저장 bit와 실제 matmul 경로는 서로 다른 축이다"
      footer="지원 여부는 runtime version, GPU compute capability, CPU ISA, group size와 packing에 따라 바뀐다. 배포 시점의 공식 compatibility matrix를 다시 확인한다."
    >
      <div className="flex min-w-0 flex-wrap gap-3">
        <SegmentedControl
          label="저장·계산 방식"
          value={stored}
          onChange={setStored}
          options={[
            { value: 'bf16', label: 'BF16' },
            { value: 'w4', label: 'W4A16' },
            { value: 'w8a8', label: 'W8A8' },
          ]}
        />
        <SegmentedControl
          label="실행 경로"
          value={execution}
          onChange={setExecution}
          options={[
            { value: 'generic', label: '범용' },
            { value: 'native', label: '지원 kernel' },
          ]}
        />
      </div>
      <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-5">
        {[
          ['알고리즘', 'RTN·GPTQ·AWQ'],
          ['Tensor', 'dtype·scale·packing'],
          ['Container', 'safetensors·GGUF'],
          ['Runtime', 'vLLM·llama.cpp'],
          ['Kernel', '실제 matmul'],
        ].map(([label, value], index) => (
          <div
            key={label}
            className={`min-w-0 border-t-2 border-blue-600/30 bg-muted/10 px-3 py-3 ${
              index === 4 ? 'col-span-2 sm:col-span-1' : ''
            }`}
          >
            <p className="text-[10px] font-semibold text-muted-foreground">{index + 1}. {label}</p>
            <p className="mt-1 break-words text-xs font-bold leading-relaxed">{value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border">
        <div className="bg-background p-3">
          <p className="text-xs font-semibold text-muted-foreground">Weight memory</p>
          <p className="mt-1 text-sm font-bold">{result.memory}</p>
        </div>
        <div className="bg-background p-3">
          <p className="text-xs font-semibold text-muted-foreground">Execution</p>
          <p className="mt-1 break-words text-sm font-bold">{result.compute}</p>
        </div>
      </div>
      <Verdict good={result.good} title={result.title} description={result.description} />
    </LabShell>
  );
}

type SparsityPattern = 'unstructured' | 'twofour' | 'channel';
type SparseRuntime = 'dense' | 'supported';

export function SparsityRealizationLab() {
  const [pattern, setPattern] = useState<SparsityPattern>('unstructured');
  const [runtime, setRuntime] = useState<SparseRuntime>('dense');

  const mask = useMemo(() => {
    if (pattern === 'twofour') {
      return Array.from({ length: 24 }, (_, index) => index % 4 < 2);
    }
    if (pattern === 'channel') {
      return Array.from({ length: 24 }, (_, index) => index % 6 < 4);
    }
    const kept = new Set([0, 2, 5, 6, 9, 11, 12, 15, 17, 18, 21, 23]);
    return Array.from({ length: 24 }, (_, index) => kept.has(index));
  }, [pattern]);

  const result = useMemo(() => {
    if (pattern === 'channel') {
      return {
        good: true,
        title: '더 작은 dense shape로 재구성할 수 있다',
        description: 'Channel·head·layer를 실제 graph에서 제거하면 일반 dense kernel도 줄어든 tensor를 계산한다. Shape divisibility와 residual contract를 다시 검증한다.',
      };
    }
    if (pattern === 'twofour' && runtime === 'supported') {
      return {
        good: true,
        title: '지원되는 2:4 sparse kernel의 후보',
        description: '패턴·dtype·hardware·library가 모두 맞을 때 zero 위치를 건너뛸 수 있다. 이론 FLOP가 아니라 end-to-end latency를 측정한다.',
      };
    }
    if (pattern === 'unstructured' && runtime === 'supported') {
      return {
        good: false,
        title: 'Sparse runtime만으로 임의 패턴이 빨라진다고 보장할 수 없다',
        description: 'Index·metadata·불규칙 access 비용이 이득을 삼킬 수 있다. 목표 shape와 sparsity에서 실제 kernel benchmark가 필요하다.',
      };
    }
    return {
      good: false,
      title: '0이 생겼지만 dense kernel은 여전히 모든 위치를 계산한다',
      description: 'Mask가 checkpoint나 dense tensor shape를 바꾸지 않았다. 압축 파일·sparse kernel·구조 재작성 중 하나가 더 필요하다.',
    };
  }, [pattern, runtime]);

  return (
    <LabShell
      lab="sparsity-realization"
      eyebrow="Sparse execution lab"
      title="0의 개수보다 runtime이 건너뛸 수 있는 모양이 중요하다"
      footer="Pruning ratio는 모델 속도가 아니다. Pattern, tensor shape, encoding, kernel, hardware와 request shape가 함께 맞아야 실제 시간이 줄어든다."
    >
      <div className="flex min-w-0 flex-wrap gap-3">
        <SegmentedControl
          label="Sparsity pattern"
          value={pattern}
          onChange={setPattern}
          options={[
            { value: 'unstructured', label: '임의 위치' },
            { value: 'twofour', label: '2:4' },
            { value: 'channel', label: '채널 제거' },
          ]}
        />
        <SegmentedControl
          label="Runtime"
          value={runtime}
          onChange={setRuntime}
          options={[
            { value: 'dense', label: 'Dense' },
            { value: 'supported', label: 'Sparse 지원' },
          ]}
        />
      </div>
      <div className="grid grid-cols-6 gap-2 border-y border-border py-4" aria-label="프루닝 mask">
        {mask.map((kept, index) => (
          <motion.span
            key={index}
            initial={false}
            animate={{
              opacity: kept ? 1 : 0.22,
              scale: kept ? 1 : 0.82,
            }}
            className={`aspect-square rounded-sm border ${kept ? 'border-blue-600/40 bg-blue-500/15' : 'border-border bg-muted/20'}`}
          />
        ))}
      </div>
      <div className="flex min-w-0 items-center gap-3 text-xs text-muted-foreground">
        <Boxes className="h-4 w-4 shrink-0" />
        <span>남은 weight {mask.filter(Boolean).length} / {mask.length}</span>
        <span aria-hidden="true">·</span>
        <span>{runtime === 'dense' ? 'dense 연산' : 'sparse path 요청'}</span>
      </div>
      <Verdict good={result.good} title={result.title} description={result.description} />
    </LabShell>
  );
}

type TeacherAccess = 'logits' | 'features' | 'samples';
type VocabularyContract = 'same' | 'different';

export function DistillationSignalLab() {
  const [access, setAccess] = useState<TeacherAccess>('logits');
  const [vocabulary, setVocabulary] = useState<VocabularyContract>('different');

  const decision = useMemo(() => {
    if (access === 'logits' && vocabulary === 'same') {
      return {
        valid: true,
        signal: 'Token-level KL + hard-label loss',
        reason: '같은 위치의 같은 vocabulary event를 비교할 수 있다. Temperature, masking과 reduction까지 동일하게 정의한다.',
      };
    }
    if (access === 'logits') {
      return {
        valid: false,
        signal: 'Vocabulary alignment 또는 sequence-level KD',
        reason: '서로 다른 tokenizer의 token index는 같은 사건이 아니다. Mapping 없이 token-wise KL을 계산하면 목적함수가 잘못 정의된다.',
      };
    }
    if (access === 'features') {
      return {
        valid: true,
        signal: 'Feature projection + representation loss',
        reason: 'Hidden size·layer 수·sequence alignment가 다르면 adapter와 대응 규칙이 필요하다. Tokenizer 차이도 alignment 단계에서 처리한다.',
      };
    }
    return {
      valid: true,
      signal: 'Sequence/data distillation',
      reason: 'Teacher output을 supervised target으로 사용한다. Prompt·sampling·filter·teacher version·license와 shared bias를 데이터 lineage로 남긴다.',
    };
  }, [access, vocabulary]);

  return (
    <LabShell
      lab="distillation-signal"
      eyebrow="Teacher contract lab"
      title="Teacher에서 무엇을 볼 수 있는지가 전달 가능한 지식을 결정한다"
      footer="Teacher가 크다는 사실만으로 좋은 감독 신호가 되지 않는다. Target domain에서 teacher ceiling과 오류 상관을 먼저 측정한다."
    >
      <div className="flex min-w-0 flex-wrap gap-3">
        <SegmentedControl
          label="Teacher 접근"
          value={access}
          onChange={setAccess}
          options={[
            { value: 'logits', label: 'Logits' },
            { value: 'features', label: 'Features' },
            { value: 'samples', label: '출력만' },
          ]}
        />
        <SegmentedControl
          label="Tokenizer·출력 공간"
          value={vocabulary}
          onChange={setVocabulary}
          options={[
            { value: 'same', label: '같음' },
            { value: 'different', label: '다름' },
          ]}
        />
      </div>
      <div className="grid min-w-0 grid-cols-[1fr_2.5rem_1fr] items-center gap-2 border-y border-border py-5">
        <div className="flex min-h-24 min-w-0 flex-col items-center justify-center bg-violet-500/[0.06] px-2 text-center">
          <Sparkles className="h-6 w-6 text-violet-700 dark:text-violet-300" />
          <p className="mt-2 text-xs font-bold">Teacher</p>
          <p className="mt-1 break-words text-[10px] text-muted-foreground">{access}</p>
        </div>
        <Zap className="mx-auto h-5 w-5 text-muted-foreground" />
        <div className="flex min-h-24 min-w-0 flex-col items-center justify-center bg-blue-500/[0.06] px-2 text-center">
          <Scale className="h-6 w-6 text-blue-700 dark:text-blue-300" />
          <p className="mt-2 text-xs font-bold">Student</p>
          <p className="mt-1 break-words text-[10px] text-muted-foreground">{vocabulary === 'same' ? 'shared space' : 'new space'}</p>
        </div>
      </div>
      <Verdict good={decision.valid} title={decision.signal} description={decision.reason} />
    </LabShell>
  );
}
