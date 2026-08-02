import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  CheckCircle2,
  CircuitBoard,
  Clock3,
  Cpu,
  Gauge,
  HardDrive,
  Radio,
  ShieldAlert,
  ShieldCheck,
  TimerReset,
  Zap,
} from 'lucide-react';
import { MetricGrid, SegmentedControl } from '../../nlp-shared';

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));

function LabFrame({
  eyebrow,
  title,
  status,
  danger = false,
  children,
}: {
  eyebrow: string;
  title: string;
  status: string;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="grid min-w-0 gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <span className="font-mono text-xs font-black text-teal-700 dark:text-teal-300">{eyebrow}</span>
        <strong className="min-w-0 text-sm leading-snug">{title}</strong>
        <span className={`text-xs font-black ${danger ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`}>{status}</span>
      </figcaption>
      {children}
    </figure>
  );
}

function ToggleRow({
  label,
  note,
  checked,
  onChange,
}: {
  label: string;
  note: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex min-w-0 cursor-pointer items-start gap-3 rounded-md border border-border p-3 transition-colors hover:bg-muted/20">
      <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-teal-600" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{label}</span>
        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{note}</span>
      </span>
    </label>
  );
}

function RangeControl({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
  accent = 'teal',
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (value: number) => void;
  accent?: 'teal' | 'violet';
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold">
        <span>{label}</span>
        <span className="shrink-0 font-mono text-foreground">{value}{unit}</span>
      </span>
      <input className={`h-2 w-full cursor-pointer ${accent === 'violet' ? 'accent-violet-600' : 'accent-teal-600'}`} type="range" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function StageFlow({
  stages,
}: {
  stages: Array<{ label: string; note: string; tone: string }>;
}) {
  return (
    <div className="grid min-w-0 gap-2 lg:grid-cols-3 lg:items-stretch">
      {stages.map((stage, index) => (
        <div key={stage.label} className="contents">
          <div className={`min-w-0 rounded-md border p-3 ${stage.tone}`}>
            <p className="text-xs font-black">{stage.label}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{stage.note}</p>
          </div>
          {index < stages.length - 1 && <ArrowDown className="mx-auto h-4 w-4 text-muted-foreground lg:hidden" />}
        </div>
      ))}
    </div>
  );
}

type QueuePolicy = 'fifo' | 'latest' | 'scheduled';

export function CommandEnvelopeLab() {
  const [policy, setPolicy] = useState<QueuePolicy>('fifo');
  const [epoch, setEpoch] = useState(false);
  const [targetCycle, setTargetCycle] = useState(false);
  const [validity, setValidity] = useState(true);
  const [ack, setAck] = useState(false);
  const [delay, setDelay] = useState(2);
  const stale = policy === 'fifo' && delay > 0 && (!epoch || !targetCycle);
  const identityValid = epoch && targetCycle && validity;
  const applied = stale ? 'cmd 417 · old epoch' : identityValid ? 'cmd 421 · cycle 8204' : 'none';
  const safe = identityValid && ack && !stale;

  return (
    <LabFrame eyebrow="DEVICE LAB 01" title="Setpoint envelope와 applied-command identity" status={safe ? 'APPLIED · ACK VERIFIED' : stale ? 'STALE COMMAND CAN ESCAPE' : 'COMMAND GATE CLOSED'} danger={!safe}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="Drive queue policy" value={policy} onChange={setPolicy} options={[
            { value: 'fifo', label: 'FIFO' },
            { value: 'latest', label: 'Latest' },
            { value: 'scheduled', label: 'Target cycle' },
          ]} />
          <RangeControl label="Bus/queue delay" value={delay} min={0} max={5} unit=" cycles" onChange={setDelay} />
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <ToggleRow label="Epoch identity" note="restart 전후 command 분리" checked={epoch} onChange={setEpoch} />
            <ToggleRow label="Target cycle" note="적용할 hardware cycle 지정" checked={targetCycle} onChange={setTargetCycle} />
            <ToggleRow label="Validity horizon" note="늦게 도착한 command 폐기" checked={validity} onChange={setValidity} />
            <ToggleRow label="Physical ack" note="driver state와 applied seq 회신" checked={ack} onChange={setAck} />
          </div>
        </div>
        <div className="min-w-0 rounded-md border border-border p-4">
          <StageFlow stages={[
            { label: 'requested', note: 'cmd 421 · torque', tone: 'border-blue-500/25 bg-blue-500/[0.045]' },
            { label: 'accepted', note: identityValid ? 'identity valid' : 'missing identity', tone: identityValid ? 'border-teal-500/25 bg-teal-500/[0.045]' : 'border-red-500/25 bg-red-500/[0.04]' },
            { label: 'applied', note: applied, tone: stale ? 'border-red-500/25 bg-red-500/[0.04]' : 'border-violet-500/25 bg-violet-500/[0.04]' },
            { label: 'observed', note: ack ? 'driver seq returned' : 'command echo only', tone: ack ? 'border-emerald-500/25 bg-emerald-500/[0.045]' : 'border-amber-500/25 bg-amber-500/[0.045]' },
            { label: 'decision', note: safe ? 'power allowed' : 'PWM disabled', tone: safe ? 'border-emerald-500/25 bg-emerald-500/[0.045]' : 'border-red-500/25 bg-red-500/[0.04]' },
          ]} />
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">값이 같아도 requested, accepted, applied, observed는 서로 다른 상태입니다. Host의 command echo는 gate driver가 실제로 적용한 sequence를 대신하지 않습니다.</p>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[
        { label: 'Requested seq', value: '421' },
        { label: 'Applied identity', value: stale ? '417 · stale' : identityValid ? '421' : 'none' },
        { label: 'Queue age', value: `${delay} cycles` },
        { label: 'Power gate', value: safe ? 'OPEN' : 'CLOSED', accent: safe },
      ]} /></div>
    </LabFrame>
  );
}

export function DeadlineLatchLab() {
  const [wcet, setWcet] = useState(24);
  const [jitter, setJitter] = useState(8);
  const [latch, setLatch] = useState(44);
  const response = wcet + jitter;
  const margin = latch - response;
  const appliedCycle = margin >= 0 ? 8204 : 8205;
  const safe = margin >= 0;

  return (
    <LabFrame eyebrow="DEVICE LAB 02" title="Function finish가 아니라 PWM latch가 deadline" status={safe ? `${margin} µs MARGIN` : `LATCH MISSED BY ${Math.abs(margin)} µs`} danger={!safe}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
        <div className="min-w-0 space-y-5">
          <RangeControl label="Control WCET" value={wcet} min={12} max={48} unit=" µs" onChange={setWcet} />
          <RangeControl label="Release jitter" value={jitter} min={0} max={20} unit=" µs" onChange={setJitter} />
          <RangeControl label="Safe PWM latch" value={latch} min={35} max={48} unit=" µs" onChange={setLatch} />
        </div>
        <div className="min-w-0 rounded-md border border-border p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground"><span>20 kHz cycle · 0-50 µs</span><span className="font-mono">applied #{appliedCycle}</span></div>
          <div className="relative mt-4 h-32 overflow-hidden rounded-md bg-muted/20 ring-1 ring-inset ring-border">
            {[0, 10, 20, 30, 40, 50].map((tick) => <span key={tick} className="absolute inset-y-0 border-l border-border/70" style={{ left: `${tick * 2}%` }}><span className={`absolute top-1 font-mono text-[10px] text-muted-foreground ${tick === 50 ? 'right-1' : 'left-1'}`}>{tick}</span></span>)}
            <span className="absolute left-0 top-8 h-6 rounded-sm bg-amber-400/80" style={{ width: `${jitter * 2}%` }}><span className="sr-only">release jitter</span></span>
            <span className={`absolute top-8 flex h-6 items-center justify-center overflow-hidden rounded-sm text-[9px] font-black text-white ${safe ? 'bg-violet-500' : 'bg-red-500'}`} style={{ left: `${jitter * 2}%`, width: `${Math.min(wcet * 2, 100 - jitter * 2)}%` }}>CTRL</span>
            <span className="absolute inset-y-0 border-l-2 border-emerald-600" style={{ left: `${latch * 2}%` }}><span className="absolute bottom-2 right-1 whitespace-nowrap text-[10px] font-black text-emerald-700">PWM latch</span></span>
            {!safe && <span className="absolute bottom-2 left-2 text-[10px] font-black text-red-700">next cycle까지 old duty 유지</span>}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Function이 50 µs period 안에 끝나도 shadow-register latch 뒤라면 이번 cycle의 물리 출력은 이미 결정됐습니다.</p>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[
        { label: 'Release', value: `${jitter} µs` },
        { label: 'Finish', value: `${response} µs` },
        { label: 'Latch deadline', value: `${latch} µs` },
        { label: 'Applied cycle', value: `#${appliedCycle}`, accent: safe },
      ]} /></div>
    </LabFrame>
  );
}

type TriggerMode = 'hardware' | 'software';

export function SampleActuateLab() {
  const [mode, setMode] = useState<TriggerMode>('software');
  const [softwareGap, setSoftwareGap] = useState(6);
  const [compute, setCompute] = useState(30);
  const sampleSkew = mode === 'hardware' ? 0.2 : softwareGap;
  const currentError = sampleSkew * 0.45;
  const finish = 8 + compute;
  const sameCycle = finish <= 44;

  return (
    <LabFrame eyebrow="DEVICE LAB 03" title="Timer-triggered sample · compute · PWM update" status={mode === 'hardware' && sameCycle ? 'PHASE CONTRACT VALID' : 'SAMPLE OR LATCH RISK'} danger={mode !== 'hardware' || !sameCycle}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="ADC trigger" value={mode} onChange={setMode} options={[
            { value: 'hardware', label: 'Timer hardware' },
            { value: 'software', label: 'Sequential call' },
          ]} />
          <RangeControl label="Software channel gap" value={softwareGap} min={1} max={12} unit=" µs" onChange={setSoftwareGap} />
          <RangeControl label="Control compute" value={compute} min={12} max={44} unit=" µs" onChange={setCompute} />
        </div>
        <div className="min-w-0 rounded-md border border-border p-4">
          <div className="grid gap-2 sm:grid-cols-4">
            {[
              ['01', 'timer event', 'cycle origin'],
              ['02', 'ADC A/B', mode === 'hardware' ? 'same trigger' : `${softwareGap} µs apart`],
              ['03', 'control', `${compute} µs`],
              ['04', 'PWM latch', sameCycle ? 'this cycle' : 'next cycle'],
            ].map(([index, label, note]) => <div key={label} className="min-w-0 rounded-md border border-border bg-muted/[0.12] p-3"><span className="font-mono text-[10px] font-black text-teal-700">{index}</span><p className="mt-2 text-xs font-black">{label}</p><p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{note}</p></div>)}
          </div>
          <div className="mt-4 h-2 rounded bg-muted"><span className={`block h-full rounded ${mode === 'hardware' && sameCycle ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${clamp((finish / 50) * 100, 0, 100)}%` }} /></div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">동시에 존재한다고 가정한 phase currents를 서로 다른 시각에 읽으면 physical slope가 measurement inconsistency로 들어갑니다.</p>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[
        { label: 'Channel skew', value: `${sampleSkew.toFixed(1)} µs` },
        { label: 'Estimated current error', value: `${currentError.toFixed(1)} A` },
        { label: 'Compute finish', value: `${finish} µs` },
        { label: 'Duty update', value: sameCycle ? 'cycle N' : 'cycle N+1', accent: mode === 'hardware' && sameCycle },
      ]} /></div>
    </LabFrame>
  );
}

type BufferCount = 'one' | 'two' | 'three';

export function IsrDmaLab() {
  const [isrWork, setIsrWork] = useState(12);
  const [consumer, setConsumer] = useState(58);
  const [buffers, setBuffers] = useState<BufferCount>('one');
  const [nested, setNested] = useState(true);
  const count = buffers === 'one' ? 1 : buffers === 'two' ? 2 : 3;
  const period = 50;
  const producerReturns = period * count;
  const corruption = consumer + isrWork > producerReturns;
  const irqDelay = isrWork + (nested ? 7 : 0);
  const margin = 20 - irqDelay;

  return (
    <LabFrame eyebrow="DEVICE LAB 04" title="NVIC · ISR · DMA buffer ownership" status={!corruption && margin >= 0 ? 'OWNERSHIP · IRQ BOUNDED' : corruption ? 'DMA BUFFER REUSED EARLY' : 'IRQ LATENCY VIOLATION'} danger={corruption || margin < 0}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="min-w-0 space-y-5">
          <RangeControl label="ISR work" value={isrWork} min={2} max={24} unit=" µs" onChange={setIsrWork} />
          <RangeControl label="Consumer hold" value={consumer} min={10} max={140} unit=" µs" onChange={setConsumer} />
          <SegmentedControl label="DMA buffers" value={buffers} onChange={setBuffers} options={[
            { value: 'one', label: '1' },
            { value: 'two', label: 'Ping-pong' },
            { value: 'three', label: '3-ring' },
          ]} />
          <ToggleRow label="Higher IRQ nesting" note="7 µs encoder capture가 중첩" checked={nested} onChange={setNested} />
        </div>
        <div className="min-w-0 rounded-md border border-border p-4">
          <StageFlow stages={[
            { label: 'peripheral', note: 'timer/ADC event', tone: 'border-blue-500/25 bg-blue-500/[0.045]' },
            { label: 'NVIC', note: nested ? 'nested priority' : 'single IRQ', tone: 'border-violet-500/25 bg-violet-500/[0.045]' },
            { label: 'ISR', note: `${isrWork} µs + release`, tone: margin >= 0 ? 'border-teal-500/25 bg-teal-500/[0.045]' : 'border-red-500/25 bg-red-500/[0.04]' },
            { label: 'consumer', note: `holds ${consumer} µs`, tone: corruption ? 'border-red-500/25 bg-red-500/[0.04]' : 'border-amber-500/25 bg-amber-500/[0.045]' },
            { label: 'return', note: `${producerReturns} µs reuse`, tone: corruption ? 'border-red-500/25 bg-red-500/[0.04]' : 'border-emerald-500/25 bg-emerald-500/[0.045]' },
          ]} />
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {Array.from({ length: count }, (_, index) => <div key={index} className={`flex min-h-14 items-center justify-between rounded-md border px-3 ${corruption && index === 0 ? 'border-red-500/35 bg-red-500/[0.04]' : 'border-border bg-muted/[0.12]'}`}><span className="font-mono text-xs font-black">BUF {index}</span><span className="text-[10px] font-semibold text-muted-foreground">{index === 0 ? 'consumer' : 'free'}</span></div>)}
          </div>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[
        { label: 'IRQ path', value: `${irqDelay} µs` },
        { label: 'IRQ margin', value: `${margin} µs` },
        { label: 'Reuse interval', value: `${producerReturns} µs` },
        { label: 'Buffer state', value: corruption ? 'CORRUPTED' : 'owned', accent: !corruption && margin >= 0 },
      ]} /></div>
    </LabFrame>
  );
}

type ScheduleMode = 'rm' | 'edf';

export function RtosScheduleLab() {
  const [mode, setMode] = useState<ScheduleMode>('rm');
  const [telemetry, setTelemetry] = useState(220);
  const [criticalRelease, setCriticalRelease] = useState(true);
  const tasks = useMemo(() => [
    { name: 'current', short: 'I', period: 50, cost: 12, tone: 'bg-blue-500' },
    { name: 'velocity', short: 'V', period: 500, cost: 34, tone: 'bg-teal-500' },
    { name: 'fieldbus', short: 'B', period: 1000, cost: 62, tone: 'bg-violet-500' },
    { name: 'telemetry', short: 'T', period: 2000, cost: telemetry, tone: 'bg-amber-500' },
  ], [telemetry]);
  const utilization = tasks.reduce((sum, task) => sum + task.cost / task.period, 0);
  const rmBound = tasks.length * (2 ** (1 / tasks.length) - 1);
  const interference = criticalRelease ? 12 * 3 + 34 + 62 : 12;
  const outerResponse = 34 + interference + (mode === 'rm' ? 0 : Math.max(0, telemetry - 180) * 0.12);
  const schedulable = mode === 'rm' ? utilization <= rmBound && outerResponse <= 500 : utilization <= 1 && outerResponse <= 500;

  return (
    <LabFrame eyebrow="DEVICE LAB 05" title="Periodic task model과 critical instant" status={schedulable ? 'SUFFICIENT TEST PASSES' : 'SCHEDULE NOT CERTIFIED'} danger={!schedulable}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="Scheduler model" value={mode} onChange={setMode} options={[
            { value: 'rm', label: 'Fixed priority RM' },
            { value: 'edf', label: 'Deadline driven' },
          ]} />
          <RangeControl label="Telemetry WCET" value={telemetry} min={40} max={620} step={20} unit=" µs" onChange={setTelemetry} accent="violet" />
          <ToggleRow label="Critical simultaneous release" note="모든 higher-priority work가 함께 ready" checked={criticalRelease} onChange={setCriticalRelease} />
        </div>
        <div className="min-w-0 rounded-md border border-border p-4">
          <div className="grid gap-2 sm:grid-cols-4">
            {tasks.map((task) => <div key={task.name} className="rounded-md border border-border p-3"><span className={`block h-1 w-7 rounded ${task.tone}`} /><p className="mt-2 text-xs font-black">{task.name}</p><p className="mt-1 font-mono text-[10px] text-muted-foreground">C/T {task.cost}/{task.period} µs</p></div>)}
          </div>
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold"><span>Total utilization</span><span className="font-mono">{(utilization * 100).toFixed(1)}%</span></div>
            <div className="h-2 overflow-hidden rounded bg-muted"><span className={`block h-full rounded ${schedulable ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${clamp(utilization * 100, 0, 100)}%` }} /></div>
            <p className="text-xs leading-relaxed text-muted-foreground">{mode === 'rm' ? `4-task Liu–Layland sufficient bound ${(rmBound * 100).toFixed(1)}%` : 'EDF의 100% result는 독립 periodic, D=T, zero blocking/overhead 가정 안에서만 성립'}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[
        { label: 'Task load', value: `${(utilization * 100).toFixed(1)}%` },
        { label: 'Sufficient bound', value: mode === 'rm' ? `${(rmBound * 100).toFixed(1)}%` : '100%' },
        { label: 'Velocity response', value: `${Math.round(outerResponse)} µs` },
        { label: 'Admission', value: schedulable ? 'PASS' : 'REJECT', accent: schedulable },
      ]} /></div>
    </LabFrame>
  );
}

type LockProtocol = 'none' | 'inherit' | 'owner';

export function PriorityInversionLab() {
  const [protocol, setProtocol] = useState<LockProtocol>('none');
  const [lowHold, setLowHold] = useState(28);
  const [mediumWork, setMediumWork] = useState(34);
  const blocking = protocol === 'none' ? lowHold + mediumWork : protocol === 'inherit' ? lowHold : 8;
  const response = 12 + blocking;
  const deadline = 50;
  const safe = response <= deadline;

  return (
    <LabFrame eyebrow="DEVICE LAB 06" title="Priority inversion과 bounded resource access" status={safe ? `${deadline - response} µs MARGIN` : `HIGH TASK MISSES BY ${response - deadline} µs`} danger={!safe}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="Shared bus protocol" value={protocol} onChange={setProtocol} options={[
            { value: 'none', label: 'Plain semaphore' },
            { value: 'inherit', label: 'PI mutex' },
            { value: 'owner', label: 'Bus owner' },
          ]} />
          <RangeControl label="Low task lock hold" value={lowHold} min={8} max={60} unit=" µs" onChange={setLowHold} />
          <RangeControl label="Medium task work" value={mediumWork} min={0} max={70} unit=" µs" onChange={setMediumWork} />
        </div>
        <div className="min-w-0 rounded-md border border-border p-4">
          <div className="space-y-3">
            {[
              { name: 'HIGH · current', width: 12, wait: blocking, tone: 'bg-blue-500' },
              { name: 'MED · diagnostic', width: mediumWork, wait: 0, tone: 'bg-amber-500' },
              { name: 'LOW · telemetry lock', width: lowHold, wait: 0, tone: 'bg-violet-500' },
            ].map((row) => <div key={row.name} className="grid min-w-0 grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-3"><span className="text-[10px] font-black text-muted-foreground">{row.name}</span><div className="flex h-7 min-w-0 overflow-hidden rounded bg-muted/30">{row.wait > 0 && <span className="flex items-center justify-center bg-red-500/15 text-[9px] font-black text-red-700" style={{ width: `${clamp((row.wait / 90) * 100, 8, 78)}%` }}>BLOCK {row.wait}</span>}<span className={`${row.tone}`} style={{ width: `${clamp((row.width / 90) * 100, 8, 78)}%` }} /></div></div>)}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{protocol === 'none' ? 'High task가 block된 동안 unrelated medium task가 low lock owner의 진행까지 밀어냅니다.' : protocol === 'inherit' ? 'Low owner가 high priority를 임시 상속해 medium interference를 제거하지만 lock hold 자체는 남습니다.' : '한 owner task가 bus transaction을 직렬화하고 high path에는 bounded request/response snapshot만 남깁니다.'}</p>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[
        { label: 'Direct lock hold', value: `${lowHold} µs` },
        { label: 'Inversion add-on', value: `${protocol === 'none' ? mediumWork : 0} µs` },
        { label: 'High response', value: `${response} µs` },
        { label: 'Deadline', value: safe ? 'MET' : 'MISSED', accent: safe },
      ]} /></div>
    </LabFrame>
  );
}

type ClockPolicy = 'arrival' | 'distributed';

export function FieldbusClockLab() {
  const [clock, setClock] = useState<ClockPolicy>('arrival');
  const [policy, setPolicy] = useState<QueuePolicy>('fifo');
  const [busJitter, setBusJitter] = useState(260);
  const [clockSkew, setClockSkew] = useState(18);
  const [depth, setDepth] = useState(3);
  const age = policy === 'fifo' ? busJitter + (depth - 1) * 1000 : policy === 'latest' ? busJitter : Math.max(clockSkew, 20);
  const axisSkew = clock === 'distributed' ? clockSkew : busJitter + 35;
  const valid = policy === 'scheduled' && clock === 'distributed' && age <= 100 && axisSkew <= 50;

  return (
    <LabFrame eyebrow="DEVICE LAB 07" title="Fieldbus arrival과 synchronized target cycle" status={valid ? 'SIX AXES SYNCHRONIZED' : 'LINK UP · MOTION CONTRACT FAIL'} danger={!valid}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="Axis timebase" value={clock} onChange={setClock} options={[
            { value: 'arrival', label: 'Frame arrival' },
            { value: 'distributed', label: 'Distributed clock' },
          ]} />
          <SegmentedControl label="Command policy" value={policy} onChange={setPolicy} options={[
            { value: 'fifo', label: 'FIFO' },
            { value: 'latest', label: 'Latest' },
            { value: 'scheduled', label: 'Target cycle' },
          ]} />
          <RangeControl label="Bus arrival jitter" value={busJitter} min={20} max={500} step={20} unit=" µs" onChange={setBusJitter} />
          <RangeControl label="Device clock skew" value={clockSkew} min={2} max={100} step={2} unit=" µs" onChange={setClockSkew} />
          <RangeControl label="Drive queue depth" value={depth} min={1} max={4} unit="" onChange={setDepth} />
        </div>
        <div className="min-w-0 rounded-md border border-border p-4">
          <div className="flex items-center gap-3"><Radio className="h-5 w-5 text-violet-600" /><div><p className="text-xs font-black">Link operational</p><p className="text-[11px] text-muted-foreground">Frame CRC와 working counter 정상</p></div></div>
          <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {Array.from({ length: 6 }, (_, index) => {
              const offset = clock === 'distributed' ? (index - 2.5) * (axisSkew / 5) : (index - 2.5) * (axisSkew / 5);
              return <div key={index} className={`rounded-md border p-2 text-center ${valid ? 'border-emerald-500/30 bg-emerald-500/[0.045]' : 'border-amber-500/30 bg-amber-500/[0.045]'}`}><p className="font-mono text-[10px] font-black">AX {index + 1}</p><p className="mt-1 font-mono text-[10px] text-muted-foreground">{offset >= 0 ? '+' : ''}{Math.round(offset)} µs</p></div>;
            })}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Distributed clock는 frame을 받은 순간 실행하는 대신 각 drive가 같은 local target time에 sample/latch하도록 만듭니다. Application deadline과 driver response는 별도로 검증합니다.</p>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[
        { label: 'Link', value: 'UP' },
        { label: 'Oldest command age', value: `${age} µs` },
        { label: 'Six-axis skew', value: `${Math.round(axisSkew)} µs` },
        { label: 'Motion gate', value: valid ? 'OPEN' : 'CLOSED', accent: valid },
      ]} /></div>
    </LabFrame>
  );
}

type NumericMode = 'naive' | 'bounded';

export function NumericMemoryLab() {
  const [mode, setMode] = useState<NumericMode>('naive');
  const [current, setCurrent] = useState(92);
  const [scale, setScale] = useState(512);
  const [stackHeadroom, setStackHeadroom] = useState(18);
  const [logging, setLogging] = useState(true);
  const before = 0xfffffff0;
  const after = 0x00000020;
  const naiveElapsed = after - before;
  const modularElapsed = (after - before) >>> 0;
  const raw = Math.round(current * scale);
  const overflow = raw > 32767;
  const stackRisk = stackHeadroom < 15 || logging;
  const safe = mode === 'bounded' && !overflow && !stackRisk;

  return (
    <LabFrame eyebrow="DEVICE LAB 08" title="Timer wrap · fixed-point range · bounded memory" status={safe ? 'NUMERIC · MEMORY BOUNDED' : overflow ? 'FIXED-POINT OVERFLOW' : 'RUNTIME BOUND MISSING'} danger={!safe}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="Implementation" value={mode} onChange={setMode} options={[
            { value: 'naive', label: 'Naive signed' },
            { value: 'bounded', label: 'Modular + saturate' },
          ]} />
          <RangeControl label="Measured current" value={current} min={10} max={120} unit=" A" onChange={setCurrent} />
          <RangeControl label="Fixed-point scale" value={scale} min={128} max={512} step={128} unit=" count/A" onChange={setScale} />
          <RangeControl label="Stack headroom" value={stackHeadroom} min={5} max={45} unit=" %" onChange={setStackHeadroom} />
          <ToggleRow label="Formatted logging in critical path" note="가변 시간·stack·lock 사용" checked={logging} onChange={setLogging} />
        </div>
        <div className="min-w-0 rounded-md border border-border p-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-md border border-border bg-muted/[0.12] p-3"><div className="flex items-center gap-2 text-xs font-black"><Clock3 className="h-4 w-4 text-violet-600" />32-bit timer wrap</div><p className="mt-3 font-mono text-[11px] text-muted-foreground">before 0xfffffff0</p><p className="font-mono text-[11px] text-muted-foreground">after&nbsp;&nbsp;0x00000020</p><p className={`mt-2 text-sm font-black ${mode === 'bounded' ? 'text-emerald-700' : 'text-red-700'}`}>Δt {mode === 'bounded' ? modularElapsed : naiveElapsed} µs</p></div>
            <div className="rounded-md border border-border bg-muted/[0.12] p-3"><div className="flex items-center gap-2 text-xs font-black"><Gauge className="h-4 w-4 text-teal-600" />int16 current</div><p className="mt-3 font-mono text-[11px] text-muted-foreground">raw = {raw}</p><p className="font-mono text-[11px] text-muted-foreground">range ±32767</p><p className={`mt-2 text-sm font-black ${overflow ? 'text-red-700' : 'text-emerald-700'}`}>{overflow ? mode === 'bounded' ? 'SATURATE + FAULT' : 'WRAP / wrong sign' : 'in range'}</p></div>
          </div>
          <div className="mt-3 rounded-md border border-border p-3"><div className="flex items-center gap-2 text-xs font-black"><HardDrive className="h-4 w-4 text-amber-600" />Critical memory budget</div><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Stack headroom {stackHeadroom}% · {logging ? 'formatted logging active' : 'binary trace deferred'} · runtime allocation disabled</p></div>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[
        { label: 'Elapsed time', value: `${mode === 'bounded' ? modularElapsed : naiveElapsed} µs` },
        { label: 'Raw current', value: String(raw) },
        { label: 'Stack/log gate', value: stackRisk ? 'RISK' : 'bounded' },
        { label: 'Command gate', value: safe ? 'OPEN' : 'CLOSED', accent: safe },
      ]} /></div>
    </LabFrame>
  );
}

type FaultType = 'deadline' | 'sensor' | 'numeric' | 'driver' | 'ack';
type KickPolicy = 'early' | 'validated';

export function FaultLadderLab() {
  const [fault, setFault] = useState<FaultType>('driver');
  const [kick, setKick] = useState<KickPolicy>('early');
  const [hardwareTrip, setHardwareTrip] = useState(true);
  const caughtBy = fault === 'driver' && hardwareTrip ? 'hardware comparator' : kick === 'validated' ? 'firmware output gate' : fault === 'ack' ? 'host timeout' : 'not caught before PWM';
  const pwmEnabled = caughtBy === 'not caught before PWM';
  const safe = !pwmEnabled;
  const faultCopy: Record<FaultType, string> = {
    deadline: 'control result arrived after latch',
    sensor: 'phase-current plausibility failed',
    numeric: 'fixed-point saturation/NaN',
    driver: 'gate driver reports overcurrent',
    ack: 'applied sequence not observed',
  };

  return (
    <LabFrame eyebrow="DEVICE LAB 09" title="Hardware trip에서 supervised restart까지" status={safe ? `POWER OFF · ${caughtBy.toUpperCase()}` : 'WATCHDOG ALIVE · PWM STILL ON'} danger={!safe}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="Injected fault" value={fault} onChange={setFault} options={[
            { value: 'deadline', label: 'Deadline' },
            { value: 'sensor', label: 'Sensor' },
            { value: 'numeric', label: 'Numeric' },
            { value: 'driver', label: 'Driver' },
            { value: 'ack', label: 'Ack' },
          ]} />
          <SegmentedControl label="Watchdog kick" value={kick} onChange={setKick} options={[
            { value: 'early', label: 'Task start' },
            { value: 'validated', label: 'Validated output' },
          ]} />
          <ToggleRow label="Independent hardware trip" note="overcurrent가 MCU와 무관하게 gate disable" checked={hardwareTrip} onChange={setHardwareTrip} />
        </div>
        <div className="min-w-0 rounded-md border border-border p-4">
          <div className="flex items-start gap-3 rounded-md border border-red-500/25 bg-red-500/[0.035] p-3"><ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-600" /><div><p className="text-xs font-black">Injected evidence</p><p className="mt-1 text-sm font-semibold">{faultCopy[fault]}</p></div></div>
          <div className="mt-3 grid gap-2 sm:grid-cols-4">
            {[
              ['01', 'hardware', fault === 'driver' && hardwareTrip ? 'trip' : 'pass'],
              ['02', 'firmware', kick === 'validated' ? 'validate' : 'kicked early'],
              ['03', 'host', fault === 'ack' ? 'timeout' : 'fault state'],
              ['04', 'reset', safe ? 'supervised' : 'unsafe run'],
            ].map(([index, label, note]) => <div key={label} className={`rounded-md border p-3 ${note === 'unsafe run' || note === 'kicked early' ? 'border-red-500/25 bg-red-500/[0.035]' : 'border-border bg-muted/[0.12]'}`}><span className="font-mono text-[10px] font-black text-violet-700">{index}</span><p className="mt-2 text-xs font-black">{label}</p><p className="mt-1 text-[11px] text-muted-foreground">{note}</p></div>)}
          </div>
          <div className={`mt-4 flex items-center gap-3 rounded-md border p-4 ${pwmEnabled ? 'border-red-500/30 bg-red-500/[0.04]' : 'border-emerald-500/30 bg-emerald-500/[0.045]'}`}>{pwmEnabled ? <Zap className="h-5 w-5 text-red-600" /> : <ShieldCheck className="h-5 w-5 text-emerald-600" />}<div><p className="text-sm font-black">PWM {pwmEnabled ? 'ENABLED' : 'DISABLED'}</p><p className="mt-1 text-xs text-muted-foreground">catch: {caughtBy}</p></div></div>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[
        { label: 'CPU heartbeat', value: 'alive' },
        { label: 'Fault latch', value: safe ? 'SET' : 'missing' },
        { label: 'Observed state', value: safe ? 'power off' : 'unknown' },
        { label: 'Actuation gate', value: safe ? 'CLOSED' : 'OPEN', accent: safe },
      ]} /></div>
    </LabFrame>
  );
}

export function EmbeddedRuntimeStrip() {
  const stages = [
    { icon: Radio, label: 'fieldbus', note: 'seq · epoch · target cycle' },
    { icon: Clock3, label: 'timer', note: 'sample origin' },
    { icon: CircuitBoard, label: 'ISR/DMA', note: 'capture · ownership' },
    { icon: Cpu, label: 'RTOS', note: 'bounded execution' },
    { icon: Zap, label: 'PWM/driver', note: 'latch · power' },
  ];
  return (
    <div className="not-prose my-7 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-5">
      {stages.map((stage, index) => <div key={stage.label} className="min-w-0 bg-background p-4"><div className="flex items-center justify-between"><stage.icon className="h-4 w-4 text-teal-600" /><span className="font-mono text-[10px] font-black text-muted-foreground">{String(index + 1).padStart(2, '0')}</span></div><p className="mt-3 text-xs font-black">{stage.label}</p><p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{stage.note}</p></div>)}
    </div>
  );
}

export function EmbeddedFailureLegend() {
  return (
    <div className="not-prose my-7 grid gap-2 sm:grid-cols-3">
      {[
        { icon: TimerReset, label: 'Timing fault', note: 'release · response · latch · skew', tone: 'text-violet-600' },
        { icon: AlertTriangle, label: 'Integrity fault', note: 'buffer · identity · numeric · unit', tone: 'text-amber-600' },
        { icon: CheckCircle2, label: 'Physical evidence', note: 'applied seq · driver state · power', tone: 'text-emerald-600' },
      ].map((item) => <div key={item.label} className="rounded-md border border-border p-4"><item.icon className={`h-5 w-5 ${item.tone}`} /><p className="mt-3 text-sm font-black">{item.label}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.note}</p></div>)}
    </div>
  );
}
