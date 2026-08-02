import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowRightLeft,
  Boxes,
  CheckCircle2,
  Gauge,
  Network,
  Route,
  Server,
  ShieldCheck,
  TimerReset,
} from 'lucide-react';

const KIB = 1024;
const GIB = 1024 ** 3;
const KV_BYTES_PER_TOKEN = 2 * 32 * 8 * 128 * 2;

function FigureHeader({ eyebrow, title, metric }: { eyebrow: string; title: string; metric: string }) {
  return (
    <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:px-5">
      <span className="font-mono text-xs font-black text-blue-700 dark:text-blue-300">{eyebrow}</span>
      <strong className="min-w-0 text-sm leading-snug">{title}</strong>
      <span className="w-fit rounded-sm border border-border bg-background px-2 py-1 font-mono text-xs font-bold text-muted-foreground">{metric}</span>
    </figcaption>
  );
}

function SegmentedControl({ label, values, value, format, onChange }: {
  label: string;
  values: number[];
  value: number;
  format: (value: number) => string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-[11px] font-semibold text-muted-foreground">{label}</p>
      <div className="grid grid-cols-3 gap-1 rounded-md bg-muted/45 p-1" role="group" aria-label={label}>
        {values.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={item === value}
            onClick={() => onChange(item)}
            className={`min-h-11 min-w-0 rounded-sm px-1.5 text-[11px] font-bold transition-colors ${item === value ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {format(item)}
          </button>
        ))}
      </div>
    </div>
  );
}

function MetricCell({ label, value, note, tone = 'normal' }: {
  label: string;
  value: string;
  note: string;
  tone?: 'normal' | 'state' | 'risk';
}) {
  const valueClass = tone === 'state'
    ? 'text-violet-700 dark:text-violet-300'
    : tone === 'risk'
      ? 'text-amber-700 dark:text-amber-300'
      : 'text-foreground';
  return (
    <div className="min-w-0 bg-background p-4">
      <p className="text-[11px] font-semibold text-muted-foreground">{label}</p>
      <p className={`mt-1 break-words font-mono text-xl font-black ${valueClass}`}>{value}</p>
      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{note}</p>
    </div>
  );
}

export function ServingPressureLab() {
  const [prompt, setPrompt] = useState(8192);
  const [output, setOutput] = useState(512);
  const [concurrency, setConcurrency] = useState(24);
  const [fabric, setFabric] = useState(100);

  const ledger = useMemo(() => {
    const handoffBytes = prompt * KV_BYTES_PER_TOKEN;
    const effectiveGBps = (fabric / 8) * 0.8;
    const handoffMs = (handoffBytes / 1e9 / effectiveGBps) * 1000;
    const decodeGiB = concurrency * (prompt + output) * KV_BYTES_PER_TOKEN / GIB;
    return {
      handoffGiB: handoffBytes / GIB,
      effectiveGBps,
      handoffMs,
      decodeGiB,
      promptShare: prompt / (prompt + output),
    };
  }, [concurrency, fabric, output, prompt]);

  return (
    <figure data-serving-pressure-lab className="foundation-viz-explorer not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border">
      <FigureHeader eyebrow="REQUEST LEDGER" title="요청 shape가 바뀌면 어느 pool과 어느 link가 먼저 막힐까?" metric="32L · 8 KVH · D128 · BF16" />
      <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
        <SegmentedControl label="입력 prompt" values={[2048, 8192, 32768]} value={prompt} format={(v) => `${v / 1024}K`} onChange={setPrompt} />
        <SegmentedControl label="생성 output" values={[128, 512, 2048]} value={output} format={(v) => `${v}`} onChange={setOutput} />
        <SegmentedControl label="동시 request" values={[4, 24, 64]} value={concurrency} format={(v) => `${v}`} onChange={setConcurrency} />
        <SegmentedControl label="Fabric line rate" values={[100, 200, 400]} value={fabric} format={(v) => `${v}G`} onChange={setFabric} />
      </div>

      <div className="border-y border-border bg-muted/15 px-4 py-4 sm:px-5">
        <div className="flex h-3 overflow-hidden rounded-sm bg-muted" aria-label="요청 token 구성">
          <span className="bg-blue-600" style={{ width: `${ledger.promptShare * 100}%` }} />
          <span className="bg-emerald-500" style={{ width: `${(1 - ledger.promptShare) * 100}%` }} />
        </div>
        <div className="mt-2 flex flex-wrap justify-between gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
          <span><i className="mr-1 inline-block h-2 w-2 bg-blue-600" />Prefill {prompt.toLocaleString()} tokens</span>
          <span><i className="mr-1 inline-block h-2 w-2 bg-emerald-500" />Decode {output.toLocaleString()} steps</span>
        </div>
      </div>

      <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        <MetricCell label="KV / token" value={`${KV_BYTES_PER_TOKEN / KIB} KiB`} note="모델 구조와 KV dtype이 정하는 고정 단위" tone="state" />
        <MetricCell label="Prompt KV handoff" value={`${ledger.handoffGiB.toFixed(2)} GiB`} note="Prefill pool이 decode pool에 넘길 request state" tone="state" />
        <MetricCell label="Handoff lower bound" value={`${ledger.handoffMs.toFixed(0)} ms`} note={`${ledger.effectiveGBps.toFixed(0)} GB/s 유효 payload 가정`} tone={ledger.handoffMs >= 100 ? 'risk' : 'normal'} />
        <MetricCell label="Decode pool peak KV" value={`${ledger.decodeGiB.toFixed(1)} GiB`} note={`${concurrency}개 request의 prompt + output resident KV`} tone={ledger.decodeGiB >= 40 ? 'risk' : 'normal'} />
      </div>

      <div className="grid gap-3 p-4 text-xs leading-relaxed sm:grid-cols-2 sm:p-5">
        <p className="min-w-0"><strong className="text-blue-700 dark:text-blue-300">Prefill pressure.</strong> 입력이 길어질수록 한 번에 처리할 token과 handoff state가 함께 커진다.</p>
        <p className="min-w-0"><strong className="text-emerald-700 dark:text-emerald-300">Decode pressure.</strong> 출력과 동시성이 늘수록 반복 step과 resident KV가 함께 커진다.</p>
      </div>
    </figure>
  );
}

type FlowMode = 'aggregated' | 'disaggregated';

const flowStages = {
  aggregated: [
    { label: 'Request queue', icon: Route, input: 'prompt + sampling params', work: '한 queue에서 빈 worker를 고른다.', output: 'worker assignment', invariant: '모델과 tokenizer revision 일치', failure: '긴 요청 뒤에 짧은 요청이 대기' },
    { label: 'Shared worker', icon: Server, input: 'prefill·decode batch', work: '같은 GPU가 prompt 처리와 token 생성을 번갈아 수행한다.', output: 'KV + next token', invariant: 'handoff가 없어 state ownership이 단순', failure: '긴 prefill이 decode tail latency를 흔듦' },
    { label: 'Token stream', icon: Activity, input: 'next-token events', work: '완료 token을 client로 계속 보낸다.', output: 'response', invariant: 'request 순서와 cancel 상태 보존', failure: '한 pool의 saturation이 TTFT·TPOT에 같이 전파' },
  ],
  disaggregated: [
    { label: 'KV-aware router', icon: Route, input: 'prompt hash + pool load', work: 'cache overlap과 prefill load를 함께 보고 P worker를 고른다.', output: 'prefill assignment', invariant: 'locality와 load를 같은 단위로 비교', failure: 'cache hit만 좇아 hot worker를 과부하' },
    { label: 'Prefill pool', icon: Boxes, input: 'all prompt tokens', work: 'prompt pass로 KV blocks와 transfer metadata를 만든다.', output: 'KV blocks + transfer metadata', invariant: 'decode와 model·dtype·KV layout 일치', failure: '긴 prompt burst가 P queue를 포화' },
    { label: 'KV handoff', icon: ArrowRightLeft, input: 'KV blocks + destination', work: 'NIXL·UCX 같은 transport로 GPU state를 옮기거나 노출한다.', output: 'decode-visible KV', invariant: 'block identity와 완료 신호 보존', failure: 'TCP fallback·topology mismatch가 TTFT를 지배' },
    { label: 'Decode pool', icon: Server, input: 'KV + current token', work: '첫 output token부터 one-token step을 반복하고 stream한다. Memory-bound 여부는 profiler로 확인한다.', output: 'next token + extended KV', invariant: 'TPOT·ITL SLO와 KV capacity 유지', failure: 'concurrency가 HBM을 채워 preemption·reject 발생' },
  ],
} satisfies Record<FlowMode, Array<{ label: string; icon: typeof Route; input: string; work: string; output: string; invariant: string; failure: string }>>;

export function DisaggregatedFlowLab() {
  const [mode, setMode] = useState<FlowMode>('disaggregated');
  const [active, setActive] = useState(0);
  const stages = flowStages[mode];
  const selected = stages[Math.min(active, stages.length - 1)];

  function chooseMode(next: FlowMode) {
    setMode(next);
    setActive(0);
  }

  return (
    <figure data-disaggregated-flow data-flow-mode={mode} className="foundation-viz-explorer not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border">
      <FigureHeader eyebrow="TOPOLOGY TRACE" title="Pool을 나누면 간섭은 줄지만 state 이동 단계가 생긴다" metric={mode === 'aggregated' ? '1 shared pool' : 'P pool + D pool'} />
      <div className="flex gap-1 border-b border-border p-2" role="group" aria-label="서빙 topology">
        {([
          ['aggregated', '한 pool'],
          ['disaggregated', 'Prefill / Decode 분리'],
        ] as const).map(([value, label]) => (
          <button key={value} type="button" aria-pressed={mode === value} onClick={() => chooseMode(value)} className={`min-h-11 flex-1 rounded-sm px-3 text-xs font-bold transition-colors ${mode === value ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'}`}>{label}</button>
        ))}
      </div>

      <div className={`grid gap-2 p-4 sm:grid-cols-2 sm:p-5 ${mode === 'disaggregated' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isSelected = index === active;
          return (
            <button key={stage.label} type="button" aria-pressed={isSelected} onClick={() => setActive(index)} className={`min-h-28 min-w-0 rounded-md border p-4 text-left transition-colors ${isSelected ? 'border-blue-600/45 bg-blue-500/[0.05]' : 'border-border hover:bg-muted/25'}`}>
              <span className="flex items-center justify-between gap-2">
                <Icon className={`h-4 w-4 ${stage.label === 'KV handoff' ? 'text-violet-600 dark:text-violet-300' : ''}`} />
                <span className="font-mono text-[10px] text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
              </span>
              <strong className="mt-4 block text-sm leading-snug">{stage.label}</strong>
              <span className="mt-1 block text-[11px] leading-relaxed text-muted-foreground">{stage.output}</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-px border-t border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
        {[
          ['입력', selected.input],
          ['작업', selected.work],
          ['출력', selected.output],
          ['지켜야 할 것', selected.invariant],
          ['실패 신호', selected.failure],
        ].map(([label, value], index) => (
          <div key={label} className={`min-w-0 bg-background p-4 ${index === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
            <p className={`text-[10px] font-black ${index === 4 ? 'text-amber-700 dark:text-amber-300' : 'text-muted-foreground'}`}>{label}</p>
            <p className="mt-2 text-xs leading-relaxed">{value}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}

const releaseStages = [
  { label: 'Workload fixture', icon: Gauge, detail: 'Prompt·output 분포, burst, prefix reuse와 cancel 비율을 고정한다.', proof: '같은 trace를 모든 topology에 replay' },
  { label: 'Aggregated baseline', icon: Server, detail: '한 pool의 TTFT·TPOT·ITL·goodput·HBM과 reject를 먼저 잰다.', proof: '분리 전 기준선과 bottleneck trace' },
  { label: 'Transport audit', icon: Network, detail: 'KV byte, effective GB/s, RDMA·NIXL path와 TCP fallback을 확인한다.', proof: 'in-cluster transfer span과 capacity ledger' },
  { label: 'Failure · SLO gate', icon: ShieldCheck, detail: 'P/D worker loss, timeout, overload와 p99 회복 시간을 검증한다.', proof: 'fail-closed release evidence' },
];

export function ServingReleaseGate() {
  const [selected, setSelected] = useState(0);
  const active = releaseStages[selected];

  return (
    <figure data-serving-release-gate data-selected-stage={selected} className="foundation-viz-explorer not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border">
      <FigureHeader eyebrow="RELEASE GATE" title="Topology는 benchmark 결과가 아니라 동일 workload의 SLO 계약으로 승인한다" metric="4 REQUIRED RECEIPTS" />
      <div className="grid gap-2 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
        {releaseStages.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setSelected(index)}
              aria-pressed={selected === index}
              className={`min-h-36 min-w-0 rounded-md border p-4 text-left transition-colors ${selected === index ? 'border-blue-600 bg-blue-500/[0.06]' : 'border-border hover:bg-muted/40'}`}
            >
              <span className="flex items-center justify-between gap-2"><Icon className="h-4 w-4" /><span className="font-mono text-xs text-muted-foreground">REQUIRED {index + 1}/4</span></span>
              <strong className="mt-4 block text-sm">{item.label}</strong>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{item.detail}</span>
            </button>
          );
        })}
      </div>
      <div className="grid min-w-0 gap-3 border-t border-border bg-muted/15 p-4 sm:grid-cols-[2rem_minmax(0,1fr)] sm:p-5" aria-live="polite">
        <span className="font-mono text-xs font-bold text-muted-foreground">{String(selected + 1).padStart(2, '0')}</span>
        <div className="min-w-0">
          <p className="text-sm font-bold">{active.label}에서 확인할 영수증</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{active.proof}</p>
          <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-300" /><span><strong>선택은 완료 상태가 아니다.</strong> 네 receipt를 실제 trace·artifact로 모두 채우기 전에는 topology를 release하지 않는다.</span></p>
        </div>
      </div>
    </figure>
  );
}
