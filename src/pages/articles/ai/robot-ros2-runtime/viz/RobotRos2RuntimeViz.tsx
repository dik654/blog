import { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Clock3,
  Copy,
  Cpu,
  Network,
  Pause,
  Power,
  RotateCcw,
  ShieldCheck,
  TimerReset,
  Unplug,
  XCircle,
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
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold">
        <span>{label}</span>
        <span className="shrink-0 font-mono text-foreground">{value}{unit}</span>
      </span>
      <input className="h-2 w-full cursor-pointer accent-teal-600" type="range" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

type InterfaceMode = 'stream' | 'query' | 'mission';

export function InterfaceContractLab() {
  const [mode, setMode] = useState<InterfaceMode>('stream');
  const [stamp, setStamp] = useState(true);
  const [frame, setFrame] = useState(true);
  const [validity, setValidity] = useState(false);
  const [identity, setIdentity] = useState(false);
  const expected = mode === 'stream' ? 'topic' : mode === 'query' ? 'service' : 'action';
  const missing = [!stamp && 'acquisition stamp', !frame && 'frame/unit', !validity && 'validity horizon', !identity && (mode === 'mission' ? 'goal/revision ID' : 'source/sequence ID')].filter(Boolean) as string[];
  const valid = missing.length === 0;
  const modeCopy = {
    stream: ['연속 관측', '발행자가 시점 결정', 'topic'],
    query: ['짧은 질의', '즉시 결과·무상태', 'service'],
    mission: ['오래 걸리는 동작', 'feedback·cancel 필요', 'action'],
  }[mode];

  return (
    <LabFrame eyebrow="RUNTIME LAB 01" title="인터페이스와 메시지 의미 계약" status={valid ? `${expected.toUpperCase()} · 실행 가능` : `${missing.length}개 계약 누락`} danger={!valid}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="상호작용 유형" value={mode} onChange={setMode} options={[
            { value: 'stream', label: '연속 관측' },
            { value: 'query', label: '짧은 질의' },
            { value: 'mission', label: '장기 동작' },
          ]} />
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <ToggleRow label="획득 시각" note="센서가 값을 얻은 시각/구간" checked={stamp} onChange={setStamp} />
            <ToggleRow label="Frame · 단위" note="값이 어느 좌표계와 단위인지" checked={frame} onChange={setFrame} />
            <ToggleRow label="유효 기간" note="언제부터 stale로 폐기할지" checked={validity} onChange={setValidity} />
            <ToggleRow label="Identity" note="source·sequence·goal·revision 결속" checked={identity} onChange={setIdentity} />
          </div>
        </div>
        <div className="min-w-0 rounded-md border border-border bg-muted/[0.12] p-4">
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
            <div className="rounded-md border border-blue-500/25 bg-blue-500/[0.045] p-3">
              <p className="text-xs font-bold text-muted-foreground">의도</p>
              <p className="mt-1 text-sm font-semibold">{modeCopy[0]}</p>
              <p className="mt-1 text-xs text-muted-foreground">{modeCopy[1]}</p>
            </div>
            <ArrowRight className="mx-auto h-4 w-4 rotate-90 text-muted-foreground sm:rotate-0" />
            <div className={`rounded-md border p-3 ${valid ? 'border-emerald-500/30 bg-emerald-500/[0.045]' : 'border-red-500/30 bg-red-500/[0.04]'}`}>
              <p className="text-xs font-bold text-muted-foreground">실행 계약</p>
              <p className="mt-1 font-mono text-sm font-black">{modeCopy[2]}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{valid ? '의미·시간·identity가 actuator까지 보존됨' : `모호함: ${missing.join(', ')}`}</p>
            </div>
          </div>
          <div className="mt-4 border-t border-border pt-4">
            <p className="text-xs font-bold text-muted-foreground">선택 검산</p>
            <p className="mt-2 text-sm leading-relaxed">
              {mode === 'mission'
                ? '동작이 오래 걸리고 중간 상태와 취소가 필요하므로 service가 아니라 action이 책임을 갖습니다.'
                : mode === 'query'
                  ? '빠르게 끝나고 side effect가 없는 질의만 service에 둡니다. 오래 기다리거나 취소해야 하면 action으로 올립니다.'
                  : '독립적으로 계속 생성되는 상태·센서 값은 topic에 둡니다. 수신자는 각 sample의 유효성을 별도로 판단합니다.'}
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[
        { label: '추천 인터페이스', value: expected },
        { label: '누락 계약', value: String(missing.length), note: missing[0] ?? '없음' },
        { label: '취소 경로', value: mode === 'mission' ? '필수' : '해당 없음' },
        { label: 'Actuator gate', value: valid ? 'OPEN' : 'CLOSED', accent: valid },
      ]} /></div>
    </LabFrame>
  );
}

const runtimeGates = [
  { key: 'discovery', label: '발견', note: 'participant와 endpoint가 보임' },
  { key: 'matching', label: '호환', note: 'name·type·QoS가 맞음' },
  { key: 'active', label: '활성', note: 'lifecycle Active' },
  { key: 'fresh', label: '신선', note: '첫 유효 sample이 도착' },
  { key: 'healthy', label: '건강', note: 'deadline·TF·callback 정상' },
] as const;

export function RuntimeGateLab() {
  const [gates, setGates] = useState<Record<(typeof runtimeGates)[number]['key'], boolean>>({ discovery: true, matching: false, active: false, fresh: false, healthy: false });
  const firstFailure = runtimeGates.find((gate) => !gates[gate.key]);
  const ready = !firstFailure;

  return (
    <LabFrame eyebrow="RUNTIME LAB 02" title="발견에서 안전 실행까지의 다섯 gate" status={ready ? '모든 gate 통과' : `${firstFailure?.label}에서 차단`} danger={!ready}>
      <div className="p-4 sm:p-6">
        <div className="grid gap-2 md:grid-cols-5">
          {runtimeGates.map((gate, index) => {
            const enabled = gates[gate.key];
            const blockedBefore = runtimeGates.slice(0, index).some((prior) => !gates[prior.key]);
            return (
              <button key={gate.key} type="button" onClick={() => setGates((current) => ({ ...current, [gate.key]: !current[gate.key] }))} className={`relative min-w-0 rounded-md border p-3 text-left transition-colors ${enabled && !blockedBefore ? 'border-emerald-500/35 bg-emerald-500/[0.045]' : 'border-border bg-muted/[0.12]'}`}>
                <span className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-black text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                  {enabled ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
                </span>
                <span className="mt-3 block text-sm font-bold">{gate.label}</span>
                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{gate.note}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-5 grid gap-3 rounded-md border border-border p-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
          <div className={`flex h-11 w-11 items-center justify-center rounded-md ${ready ? 'bg-emerald-500/10 text-emerald-700' : 'bg-red-500/10 text-red-700'}`}>
            {ready ? <ShieldCheck className="h-5 w-5" /> : <Unplug className="h-5 w-5" />}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold">{ready ? '명령 경로를 열 수 있습니다.' : `${firstFailure?.label} 이후의 초록 표시도 안전을 증명하지 않습니다.`}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Graph introspection은 첫 gate만 관찰합니다. Endpoint match, Active state, 유효 sample과 runtime health를 각각 측정해야 합니다.
            </p>
          </div>
        </div>
      </div>
    </LabFrame>
  );
}

type Reliability = 'best_effort' | 'reliable';
type Durability = 'volatile' | 'transient_local';

export function QosContractLab() {
  const [offeredReliability, setOfferedReliability] = useState<Reliability>('best_effort');
  const [requestedReliability, setRequestedReliability] = useState<Reliability>('reliable');
  const [offeredDurability, setOfferedDurability] = useState<Durability>('volatile');
  const [requestedDurability, setRequestedDurability] = useState<Durability>('volatile');
  const [depth, setDepth] = useState(8);
  const reliabilityMatch = offeredReliability === 'reliable' || requestedReliability === 'best_effort';
  const durabilityMatch = offeredDurability === 'transient_local' || requestedDurability === 'volatile';
  const match = reliabilityMatch && durabilityMatch;
  const lateReplay = match && offeredDurability === 'transient_local';
  const estimatedAge = match ? Math.max(0, depth - 1) * 100 : 0;

  return (
    <LabFrame eyebrow="RUNTIME LAB 03" title="Requested / Offered QoS compatibility" status={match ? 'ENDPOINT MATCH' : 'NO COMMUNICATION'} danger={!match}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-2">
        <div className="min-w-0 space-y-5 rounded-md border border-blue-500/25 bg-blue-500/[0.035] p-4">
          <div><p className="mb-2 text-xs font-black text-blue-700 dark:text-blue-300">PUBLISHER · OFFERED</p><SegmentedControl label="Publisher reliability" value={offeredReliability} onChange={setOfferedReliability} options={[{ value: 'best_effort', label: 'Best effort' }, { value: 'reliable', label: 'Reliable' }]} /></div>
          <div><p className="mb-2 text-xs font-semibold text-muted-foreground">Durability</p><SegmentedControl label="Publisher durability" value={offeredDurability} onChange={setOfferedDurability} options={[{ value: 'volatile', label: 'Volatile' }, { value: 'transient_local', label: 'Transient local' }]} /></div>
        </div>
        <div className="min-w-0 space-y-5 rounded-md border border-violet-500/25 bg-violet-500/[0.035] p-4">
          <div><p className="mb-2 text-xs font-black text-violet-700 dark:text-violet-300">SUBSCRIBER · REQUESTED</p><SegmentedControl label="Subscriber reliability" value={requestedReliability} onChange={setRequestedReliability} options={[{ value: 'best_effort', label: 'Best effort' }, { value: 'reliable', label: 'Reliable' }]} /></div>
          <div><p className="mb-2 text-xs font-semibold text-muted-foreground">Durability</p><SegmentedControl label="Subscriber durability" value={requestedDurability} onChange={setRequestedDurability} options={[{ value: 'volatile', label: 'Volatile' }, { value: 'transient_local', label: 'Transient local' }]} /></div>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6">
        <RangeControl label="Keep last depth" value={depth} min={1} max={20} unit=" samples" onChange={setDepth} />
        <div className="mt-5"><MetricGrid mobileColumns={2} items={[
          { label: 'Reliability', value: reliabilityMatch ? 'compatible' : 'incompatible', note: 'requested보다 약한 offer는 match되지 않음' },
          { label: 'Durability', value: durabilityMatch ? 'compatible' : 'incompatible', note: 'late-join replay 요구를 offer가 충족해야 함' },
          { label: 'Late join', value: lateReplay ? 'history replay' : 'new data only' },
          { label: '최대 queue age', value: match ? `${estimatedAge} ms` : 'N/A', note: '10 Hz와 가득 찬 queue의 단순 상한' },
        ]} /></div>
        {lateReplay && <p className="mt-4 border-l-2 border-amber-500 pl-3 text-xs leading-relaxed text-muted-foreground">Transient-local history는 설정·정적 map에는 유용하지만 path·velocity command라면 restart 뒤 낡은 명령을 되살릴 수 있습니다. Lifespan과 epoch/revision gate가 별도로 필요합니다.</p>}
      </div>
    </LabFrame>
  );
}

type QueuePolicy = 'fresh' | 'reliable';

export function QueueOverloadLab() {
  const [rate, setRate] = useState(30);
  const [cost, setCost] = useState(42);
  const [depth, setDepth] = useState(8);
  const [windowMs, setWindowMs] = useState(800);
  const [policy, setPolicy] = useState<QueuePolicy>('reliable');
  const serviceRate = 1000 / cost;
  const utilization = rate / serviceRate;
  const arrivalPeriod = 1000 / rate;
  const excessRate = Math.max(0, rate - serviceRate);
  const reliableBacklog = Math.min(depth, Math.ceil(excessRate * windowMs / 1000));
  const backlog = policy === 'fresh' ? (excessRate > 0 ? 1 : 0) : reliableBacklog;
  const age = policy === 'fresh'
    ? Math.min(cost + arrivalPeriod, windowMs)
    : backlog * arrivalPeriod + cost;
  const drops = policy === 'fresh' ? excessRate : 0;
  const timeToFull = excessRate > 0 ? depth / excessRate * 1000 : Infinity;
  const blocked = policy === 'reliable' && windowMs >= timeToFull;
  const unsafe = age > 100 || blocked;

  const samples = Array.from({ length: depth }, (_, index) => index < backlog);
  return (
    <LabFrame eyebrow="RUNTIME LAB 04" title="Overload가 sample loss인가, truth age인가" status={unsafe ? (blocked ? 'PUBLISHER BLOCKED' : 'STALE CONTROL INPUT') : 'FRESHNESS BUDGET OK'} danger={unsafe}>
      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="Queue policy" value={policy} onChange={setPolicy} options={[{ value: 'fresh', label: 'Keep latest' }, { value: 'reliable', label: 'Reliable backlog' }]} />
          <RangeControl label="Input rate" value={rate} min={5} max={60} unit=" Hz" onChange={setRate} />
          <RangeControl label="Callback cost" value={cost} min={5} max={80} unit=" ms" onChange={setCost} />
          <RangeControl label="Queue depth" value={depth} min={1} max={16} unit="" onChange={setDepth} />
          <RangeControl label="Observation window" value={windowMs} min={100} max={2000} step={100} unit=" ms" onChange={setWindowMs} />
        </div>
        <div className="min-w-0 rounded-md border border-border p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold text-muted-foreground">DDS / subscription queue</p>
            <span className="font-mono text-xs">newest →</span>
          </div>
          <div className="mt-4 grid grid-cols-8 gap-1 sm:grid-cols-16">
            {samples.map((filled, index) => <span key={index} className={`aspect-square rounded-sm border ${filled ? (unsafe ? 'border-amber-500/50 bg-amber-500/35' : 'border-blue-500/50 bg-blue-500/30') : 'border-border bg-muted/20'}`} />)}
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-sm bg-muted">
            <div className={`h-full transition-[width] ${utilization > 1 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${clamp(utilization * 70, 3, 100)}%` }} />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {utilization > 1
              ? `${windowMs} ms 동안 도착 ${rate.toFixed(0)} Hz가 처리 ${serviceRate.toFixed(1)} Hz보다 빠릅니다. ${policy === 'fresh' ? '오래된 sample을 덮어써 시간을 보존합니다.' : '차이 λ−μ만큼 backlog가 누적됩니다.'}`
              : 'Callback service rate가 input rate보다 높아 steady-state backlog가 생기지 않습니다.'}
          </p>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[
        { label: 'Utilization', value: `${(utilization * 100).toFixed(0)}%`, note: 'arrival rate / service rate' },
        { label: 'Backlog', value: `${backlog}/${depth}` },
        { label: 'Oldest age', value: `${age.toFixed(0)} ms` },
        { label: policy === 'fresh' ? 'Drop rate' : 'Backpressure', value: policy === 'fresh' ? `${Math.max(0, drops).toFixed(1)} /s` : blocked ? 'active' : 'none' },
        { label: 'Time to full', value: policy === 'fresh' ? 'N/A' : Number.isFinite(timeToFull) ? `${timeToFull.toFixed(0)} ms` : 'never', note: 'depth / (arrival − service)' },
      ]} /></div>
    </LabFrame>
  );
}

type ExecutorMode = 'single' | 'separate' | 'deadlock';

export function ExecutorTimelineLab() {
  const [mode, setMode] = useState<ExecutorMode>('single');
  const [imageCost, setImageCost] = useState(42);
  const baseTasks = useMemo(() => {
    if (mode === 'separate') return [
      { label: 'IMU', short: 'I', start: 0, width: 5, row: 0, tone: 'bg-blue-500' },
      { label: 'watchdog', short: 'W', start: 6, width: 4, row: 0, tone: 'bg-emerald-500' },
      { label: 'image', short: 'image', start: 0, width: imageCost, row: 1, tone: 'bg-violet-500' },
      { label: 'service done', short: 'F', start: 12, width: 4, row: 0, tone: 'bg-teal-500' },
    ];
    if (mode === 'deadlock') return [
      { label: 'image + sync wait', short: 'image + sync wait', start: 0, width: 84, row: 0, tone: 'bg-red-500' },
      { label: 'future done (blocked)', short: 'done blocked', start: 18, width: 20, row: 1, tone: 'bg-amber-500/50' },
    ];
    return [
      { label: 'image', short: 'image', start: 0, width: imageCost, row: 0, tone: 'bg-violet-500' },
      { label: 'IMU', short: 'I', start: imageCost + 2, width: 5, row: 0, tone: 'bg-blue-500' },
      { label: 'watchdog', short: 'W', start: imageCost + 9, width: 5, row: 0, tone: imageCost > 25 ? 'bg-red-500' : 'bg-emerald-500' },
    ];
  }, [mode, imageCost]);
  const deadlock = mode === 'deadlock';
  const watchdogDelay = mode === 'single' ? imageCost + 9 : mode === 'separate' ? 6 : Infinity;
  const unsafe = deadlock || watchdogDelay > 30;

  return (
    <LabFrame eyebrow="RUNTIME LAB 05" title="Executor, callback group과 숨은 deadlock" status={deadlock ? 'DEADLOCK' : unsafe ? 'WATCHDOG DEADLINE MISS' : 'SCHEDULE VALID'} danger={unsafe}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="Executor allocation" value={mode} onChange={setMode} options={[{ value: 'single', label: 'Default group' }, { value: 'separate', label: 'Groups 분리' }, { value: 'deadlock', label: 'Sync call' }]} />
          <RangeControl label="Image callback WCET" value={imageCost} min={8} max={70} unit=" ms" onChange={setImageCost} />
          <p className="text-xs leading-relaxed text-muted-foreground">
            {mode === 'separate'
              ? 'Image와 control/watchdog를 다른 callback group과 worker에 배치했습니다. 공유 state가 있다면 별도 동기화가 필요합니다.'
              : mode === 'deadlock'
                ? 'Mutually-exclusive callback이 synchronous service 결과를 기다립니다. 결과를 깨우는 future done-callback도 같은 group이라 실행될 수 없습니다.'
                : 'Multi-threaded executor를 골라도 모든 entity가 default mutually-exclusive group이면 실제로는 한 callback씩만 실행됩니다.'}
          </p>
        </div>
        <div className="min-w-0 rounded-md border border-border p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground"><span>Callback execution timeline</span><span className="font-mono">0–100 ms</span></div>
          <div className="relative mt-4 h-28 overflow-hidden rounded-md bg-muted/20 ring-1 ring-inset ring-border">
            {[0, 25, 50, 75, 100].map((tick) => <span key={tick} className="absolute inset-y-0 border-l border-border/70" style={{ left: `${tick}%` }}><span className={`absolute top-1 font-mono text-[10px] text-muted-foreground ${tick === 100 ? 'right-1' : 'left-1'}`}>{tick}</span></span>)}
            {baseTasks.map((task) => <span key={`${task.label}-${task.row}`} className={`absolute flex h-7 min-w-0 items-center justify-center overflow-hidden rounded-sm px-0.5 text-[10px] font-bold text-white shadow-sm ${task.tone}`} style={{ left: `${task.start}%`, width: `${Math.min(task.width, 100 - task.start)}%`, top: `${28 + task.row * 38}px` }} title={task.label} aria-label={task.label}>{task.short}</span>)}
            {deadlock && <span className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] font-black text-red-700"><Pause className="h-3 w-3" /> progress 없음</span>}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground"><span><b className="text-blue-600">I</b> IMU</span><span><b className="text-red-600">W</b> watchdog</span><span><b className="text-teal-600">F</b> future done</span></div>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[
        { label: 'Worker threads', value: mode === 'separate' ? '2' : '1 effective' },
        { label: 'Watchdog start', value: Number.isFinite(watchdogDelay) ? `${watchdogDelay} ms` : 'never' },
        { label: 'Preemption', value: 'callback 끝까지 없음' },
        { label: 'Recovery', value: deadlock ? 'async / group 분리' : unsafe ? 'group·executor 분리' : 'none' },
      ]} /></div>
    </LabFrame>
  );
}

type LifecycleState = 'unconfigured' | 'inactive' | 'active' | 'error' | 'finalized';

export function LifecycleSupervisorLab() {
  const [state, setState] = useState<LifecycleState>('unconfigured');
  const [calibrationOk, setCalibrationOk] = useState(true);
  const [supervised, setSupervised] = useState(true);
  const transitions: Record<LifecycleState, LifecycleState[]> = {
    unconfigured: calibrationOk ? ['inactive', 'finalized'] : ['error', 'finalized'],
    inactive: ['active', 'unconfigured', 'finalized'],
    active: ['inactive', 'error', 'finalized'],
    error: ['unconfigured', 'finalized'],
    finalized: [],
  };
  const commandOpen = state === 'active' && calibrationOk;
  const discovered = state !== 'finalized';

  const transition = (next: LifecycleState) => {
    if (!supervised && next === 'inactive') {
      setState(calibrationOk ? 'active' : 'error');
      return;
    }
    setState(next);
  };

  return (
    <LabFrame eyebrow="RUNTIME LAB 06" title="Lifecycle supervisor와 actuation gate" status={commandOpen ? 'ACTIVE · COMMAND ENABLED' : `${state.toUpperCase()} · COMMAND BLOCKED`} danger={!commandOpen}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-3">
            {(['unconfigured', 'inactive', 'active', 'error', 'finalized'] as LifecycleState[]).map((item) => <div key={item} className={`min-w-0 rounded-md border p-3 ${state === item ? item === 'active' ? 'border-emerald-500/40 bg-emerald-500/[0.05]' : item === 'error' ? 'border-red-500/40 bg-red-500/[0.05]' : 'border-teal-500/40 bg-teal-500/[0.05]' : 'border-border bg-muted/[0.1]'}`}><p className="break-words font-mono text-[10px] font-black uppercase">{item}</p><p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{item === 'unconfigured' ? 'resource 없음' : item === 'inactive' ? '준비됨·처리 안 함' : item === 'active' ? '기능 실행' : item === 'error' ? '복구 처리' : '종료·관찰'}</p></div>)}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(['unconfigured', 'inactive', 'active', 'error', 'finalized'] as LifecycleState[]).map((next) => {
              const isCurrent = state === next;
              const isAllowed = transitions[state].includes(next);
              return (
                <button
                  key={next}
                  type="button"
                  aria-current={isCurrent ? 'step' : undefined}
                  disabled={!isAllowed && !isCurrent}
                  onClick={() => isAllowed && transition(next)}
                  className="min-h-9 rounded-md border border-border bg-background px-3 text-xs font-semibold hover:bg-muted/30 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isCurrent ? '•' : '→'} {next}
                </button>
              );
            })}
            <button
              type="button"
              aria-disabled={state !== 'active'}
              onClick={() => state === 'active' && setState('error')}
              className="min-h-9 rounded-md border border-red-500/30 px-3 text-xs font-semibold text-red-700 hover:bg-red-500/[0.04] aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
            >
              Fault 주입
            </button>
            <button type="button" onClick={() => setState('unconfigured')} className="flex min-h-9 items-center gap-1 rounded-md border border-border px-3 text-xs font-semibold"><RotateCcw className="h-3.5 w-3.5" /> Reset</button>
          </div>
        </div>
        <div className="min-w-0 space-y-3">
          <ToggleRow label="Calibration valid" note="configure 단계의 hardware/calibration 검사" checked={calibrationOk} onChange={setCalibrationOk} />
          <ToggleRow label="Supervisor transaction" note="configure 성공 확인 뒤 명시적으로 activate" checked={supervised} onChange={setSupervised} />
          <div className={`rounded-md border p-4 ${commandOpen ? 'border-emerald-500/30 bg-emerald-500/[0.04]' : 'border-amber-500/30 bg-amber-500/[0.04]'}`}>
            <p className="flex items-center gap-2 text-sm font-bold">{commandOpen ? <Power className="h-4 w-4 text-emerald-600" /> : <Power className="h-4 w-4 text-amber-600" />}{commandOpen ? 'Motor bridge가 command를 수락합니다.' : 'Graph에 보여도 motor command는 폐기합니다.'}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Inactive에서는 functional topic 처리와 command publication이 멈춰야 합니다. 관리 interface가 살아 있는 것은 복구를 위한 관찰 가능성입니다.</p>
          </div>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[
        { label: 'Graph discovery', value: discovered ? 'visible' : 'destroyed' },
        { label: 'Configured', value: ['inactive', 'active'].includes(state) ? 'yes' : 'no' },
        { label: 'Functional work', value: state === 'active' ? 'running' : 'stopped' },
        { label: 'Command gate', value: commandOpen ? 'OPEN' : 'CLOSED', accent: commandOpen },
      ]} /></div>
    </LabFrame>
  );
}

type OwnershipMode = 'inter' | 'shared' | 'unique';

export function OwnershipCompositionLab() {
  const [mode, setMode] = useState<OwnershipMode>('shared');
  const [subscribers, setSubscribers] = useState(2);
  const [messageSize, setMessageSize] = useState(6);
  const [reuseEarly, setReuseEarly] = useState(false);
  const copies = mode === 'inter' ? subscribers + 1 : mode === 'unique' ? Math.max(0, subscribers - 1) : 0;
  const latency = mode === 'inter' ? 0.7 + messageSize * 0.35 + copies * 0.5 : 0.15 + copies * messageSize * 0.18;
  const corruption = reuseEarly && mode !== 'inter';
  const blast = mode === 'inter' ? '1 process' : `${subscribers + 1} components`;

  return (
    <LabFrame eyebrow="RUNTIME LAB 07" title="Composition, copies와 buffer ownership" status={corruption ? 'BUFFER CORRUPTION RISK' : `${copies} COPIES · OWNERSHIP VALID`} danger={corruption}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="Communication mode" value={mode} onChange={setMode} options={[{ value: 'inter', label: 'Inter-process' }, { value: 'shared', label: 'Shared const' }, { value: 'unique', label: 'Unique owner' }]} />
          <RangeControl label="Image size" value={messageSize} min={1} max={16} unit=" MB" onChange={setMessageSize} />
          <RangeControl label="Subscribers" value={subscribers} min={1} max={4} unit="" onChange={setSubscribers} />
          <ToggleRow label="Publisher가 buffer를 즉시 재사용" note="모든 subscriber completion 전에 pool slot을 덮어씀" checked={reuseEarly} onChange={setReuseEarly} />
        </div>
        <div className="min-w-0 rounded-md border border-border p-4">
          <div className="flex min-w-0 items-center gap-2 overflow-hidden">
            <div className="flex h-12 w-14 shrink-0 items-center justify-center rounded-md border border-blue-500/30 bg-blue-500/[0.05]"><CircleDot className="h-5 w-5 text-blue-700" /></div>
            <div className="relative h-1 min-w-8 flex-1 rounded bg-muted"><span className={`absolute inset-y-0 left-0 rounded ${corruption ? 'bg-red-500' : 'bg-teal-500'}`} style={{ width: '100%' }} /></div>
            <div className="grid shrink-0 gap-1">
              {Array.from({ length: subscribers }, (_, index) => <div key={index} className={`flex h-8 w-20 items-center justify-center rounded border text-[10px] font-bold ${corruption ? 'border-red-500/35 bg-red-500/[0.04]' : 'border-violet-500/30 bg-violet-500/[0.04]'}`}>subscriber {index + 1}</div>)}
            </div>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            <div className="rounded-md bg-muted/25 p-3"><Copy className="h-4 w-4 text-muted-foreground" /><p className="mt-2 text-xs font-bold">{copies} copies</p></div>
            <div className="rounded-md bg-muted/25 p-3"><Clock3 className="h-4 w-4 text-muted-foreground" /><p className="mt-2 text-xs font-bold">{latency.toFixed(1)} ms est.</p></div>
            <div className="rounded-md bg-muted/25 p-3"><AlertTriangle className="h-4 w-4 text-muted-foreground" /><p className="mt-2 text-xs font-bold">blast: {blast}</p></div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            {mode === 'inter' ? 'Serialization/copy 비용은 늘지만 주소 공간과 crash가 분리됩니다.' : mode === 'shared' ? 'Immutable shared ownership은 fan-out copy를 줄이지만 subscriber가 끝날 때까지 lifetime을 유지해야 합니다.' : '한 subscriber에는 ownership을 move할 수 있지만 여러 owner가 필요하면 추가 copy가 생깁니다.'}
          </p>
        </div>
      </div>
    </LabFrame>
  );
}

type ClockMode = 'live' | 'paused' | 'jump';

export function TimeTfLab() {
  const [delay, setDelay] = useState(120);
  const [yawRate, setYawRate] = useState(60);
  const [lookup, setLookup] = useState<'acquisition' | 'arrival'>('arrival');
  const [clockMode, setClockMode] = useState<ClockMode>('live');
  const angleError = lookup === 'arrival' ? yawRate * delay / 1000 : 0;
  const lateralError = Math.sin(angleError * Math.PI / 180) * 3;
  const bufferValid = clockMode === 'live' || (clockMode === 'paused' && lookup === 'acquisition');
  const mustClear = clockMode === 'jump';
  const unsafe = Math.abs(lateralError) > 0.15 || !bufferValid || mustClear;

  return (
    <LabFrame eyebrow="RUNTIME LAB 08" title="Acquisition time, ROS time과 TF buffer" status={mustClear ? 'BACKWARD JUMP · CLEAR STATE' : unsafe ? 'TIME CONTRACT VIOLATION' : 'TIME-ALIGNED'} danger={unsafe}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="TF lookup time" value={lookup} onChange={setLookup} options={[{ value: 'acquisition', label: '획득 시각' }, { value: 'arrival', label: '도착 시각' }]} />
          <SegmentedControl label="ROS clock behavior" value={clockMode} onChange={setClockMode} options={[{ value: 'live', label: '정상' }, { value: 'paused', label: 'Pause' }, { value: 'jump', label: '뒤로 Jump' }]} />
          <RangeControl label="Transport delay" value={delay} min={0} max={400} step={10} unit=" ms" onChange={setDelay} />
          <RangeControl label="Robot yaw rate" value={yawRate} min={0} max={120} step={5} unit=" °/s" onChange={setYawRate} />
        </div>
        <div className="min-w-0 rounded-md border border-border p-4">
          <div className="relative h-48 overflow-hidden rounded-md bg-[linear-gradient(to_right,hsl(var(--border)/0.55)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.55)_1px,transparent_1px)] bg-[size:24px_24px]">
            <div className="absolute left-[12%] top-1/2 -translate-y-1/2 text-center"><span className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-500/40 bg-background text-blue-700"><Activity className="h-4 w-4" /></span><span className="mt-1 block text-[10px] font-bold">t_acq</span></div>
            <div className="absolute left-[32%] right-[20%] top-1/2 h-0.5 bg-teal-500/50"><ArrowRight className="absolute -right-1 -top-[7px] h-4 w-4 text-teal-600" /></div>
            <div className="absolute right-[12%] top-1/2 -translate-y-1/2 text-center"><span className={`flex h-10 w-10 items-center justify-center rounded-full border bg-background ${unsafe ? 'border-red-500/40 text-red-700' : 'border-emerald-500/40 text-emerald-700'}`}><Clock3 className="h-4 w-4" /></span><span className="mt-1 block text-[10px] font-bold">t_arrival</span></div>
            <div className="absolute inset-x-4 bottom-3 rounded-md border border-border bg-background/95 p-2 text-center text-xs font-semibold">TF query: {lookup === 'acquisition' ? 'T_base_sensor(t_acq)' : 'T_base_sensor(t_arrival)'}</div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            {mustClear ? 'ROS time이 과거로 이동했습니다. TF cache, synchronizer, derivative/integrator와 timeout state를 jump callback에서 무효화해야 합니다.' : clockMode === 'paused' ? 'ROS time timeout은 멈출 수 있으므로 process watchdog과 duration 측정에는 SteadyTime을 사용합니다.' : 'SystemTime은 wall clock, SteadyTime은 단조 duration, ROSTime은 simulation/replay timeline 책임을 가집니다.'}
          </p>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[
        { label: 'Sample age', value: `${delay} ms` },
        { label: 'Pose angle error', value: `${angleError.toFixed(1)}°` },
        { label: '3 m lateral error', value: `${Math.abs(lateralError).toFixed(2)} m` },
        { label: 'Time-indexed buffers', value: mustClear ? 'CLEAR' : bufferValid ? 'valid' : 'blocked' },
      ]} /></div>
    </LabFrame>
  );
}

type TriggerMode = 'time' | 'event';

export function EndToEndRuntimeLab() {
  const [executorWait, setExecutorWait] = useState(15);
  const [communication, setCommunication] = useState(12);
  const [trigger, setTrigger] = useState<TriggerMode>('event');
  const [timerPeriod, setTimerPeriod] = useState(80);
  const [boundsValidated, setBoundsValidated] = useState(false);
  const callbackWork = 2 + 10 + 18 + 4;
  const sampling = trigger === 'time' ? timerPeriod : 0;
  const suppliedBound = callbackWork + executorWait + communication + sampling;
  const deadline = 100;
  const reserve = 10;
  const allocation = deadline - reserve;
  const margin = allocation - suppliedBound;
  const exceeds = suppliedBound > allocation;
  const steps = [
    { label: 'sensor', cost: 2, tone: 'bg-blue-500' },
    { label: 'estimate', cost: 10, tone: 'bg-teal-500' },
    { label: 'plan', cost: 18, tone: 'bg-violet-500' },
    { label: 'control', cost: 4, tone: 'bg-emerald-500' },
  ];

  return (
    <LabFrame eyebrow="RUNTIME LAB 09" title="Sensor-to-actuator bound worksheet" status={!boundsValidated ? 'ILLUSTRATIVE · NOT A RELEASE GATE' : exceeds ? 'BOUND EXCEEDS ALLOCATION' : 'DECLARED BOUNDS FIT'} danger={boundsValidated && exceeds}>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="Trigger model" value={trigger} onChange={setTrigger} options={[{ value: 'event', label: 'Event-driven' }, { value: 'time', label: 'Time-driven' }]} />
          <RangeControl label="Executor wait bound" value={executorWait} min={0} max={80} step={1} unit=" ms" onChange={setExecutorWait} />
          <RangeControl label="Communication bound" value={communication} min={0} max={60} step={1} unit=" ms" onChange={setCommunication} />
          {trigger === 'time' && <RangeControl label="Timer period bound" value={timerPeriod} min={10} max={100} step={5} unit=" ms" onChange={setTimerPeriod} />}
          <ToggleRow label="입력이 분석·측정된 상한인가" note="WCET, arrival, executor와 network 가정의 근거가 있을 때만 켬" checked={boundsValidated} onChange={setBoundsValidated} />
        </div>
        <div className="min-w-0 rounded-md border border-border p-4">
          <p className="text-xs font-bold text-muted-foreground">Critical callback chain</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            {steps.map((step, index) => <div key={step.label} className="contents"><div className="min-w-0 rounded-md border border-border p-3"><span className={`block h-1.5 w-8 rounded ${step.tone}`} /><p className="mt-2 text-xs font-bold">{step.label}</p><p className="mt-1 font-mono text-[11px] text-muted-foreground">WCET {step.cost} ms</p></div>{index < steps.length - 1 && <ArrowRight className="mx-auto h-4 w-4 rotate-90 self-center text-muted-foreground sm:hidden" />}</div>)}
          </div>
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs font-semibold"><span>Supplied stage bounds</span><span className={`font-mono ${exceeds ? 'text-red-700' : 'text-emerald-700'}`}>{suppliedBound.toFixed(0)} / {allocation} ms</span></div>
            <div className="relative mt-2 h-3 overflow-hidden rounded bg-muted"><span className={`absolute inset-y-0 left-0 rounded ${exceeds ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${clamp(suppliedBound / allocation * 100, 2, 100)}%` }} /><span className="absolute inset-y-0 right-0 border-l-2 border-foreground/60" /></div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            이 합은 입력한 각 항이 실제 upper bound일 때만 의미가 있습니다. Trace 평균이나 임의 계수를 넣으면 response-time 보장이 아니며, 아래 Qualification Lab의 identity·readiness·stop gate도 대신하지 못합니다.
          </p>
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[
        { label: 'Callback work', value: `${callbackWork} ms` },
        { label: 'Executor wait', value: `${executorWait} ms`, note: '사용자가 공급한 bound' },
        { label: 'Communication', value: `${communication} ms`, note: '사용자가 공급한 bound' },
        { label: 'Trigger alignment', value: `${sampling} ms`, note: trigger === 'time' ? '최대 한 timer period' : 'event path에서는 0' },
        { label: 'Allocation margin', value: `${margin.toFixed(0)} ms`, note: boundsValidated ? 'Qualification 입력 후보' : '교육용 합산만 수행' },
      ]} /></div>
    </LabFrame>
  );
}

type QualificationFault = 'baseline' | 'dds-burst' | 'priority-inversion' | 'clock-jump' | 'restart-history' | 'inactive';

const qualificationStages = [
  { id: 'sensor', label: 'Sensor · driver', budget: 8, base: 6, tone: 'bg-blue-500' },
  { id: 'dds', label: 'DDS · network', budget: 12, base: 7, tone: 'bg-teal-500' },
  { id: 'executor', label: 'Executor wait', budget: 15, base: 10, tone: 'bg-violet-500' },
  { id: 'estimate', label: 'Estimate', budget: 15, base: 11, tone: 'bg-cyan-600' },
  { id: 'plan', label: 'Local plan', budget: 25, base: 18, tone: 'bg-amber-500' },
  { id: 'control', label: 'Control · ack', budget: 15, base: 9, tone: 'bg-emerald-500' },
] as const;

const qualificationFaults: Record<QualificationFault, {
  label: string;
  delta: Partial<Record<(typeof qualificationStages)[number]['id'], number>>;
  timeOk: boolean;
  epochOk: boolean;
  lifecycleOk: boolean;
  stopAck: number;
  evidence: string;
  action: string;
  derivation?: string;
}> = {
  baseline: {
    label: 'Baseline',
    delta: {},
    timeOk: true,
    epochOk: true,
    lifecycleOk: true,
    stopAck: 12,
    evidence: '모든 구간이 allocation 안이고 identity·readiness gate가 열려 있습니다.',
    action: '반복 trial과 hardware replay에서도 같은 upper envelope인지 확인합니다.',
  },
  'dds-burst': {
    label: 'DDS burst',
    delta: { dds: 14, executor: 8 },
    timeOk: true,
    epochOk: true,
    lifecycleOk: true,
    stopAck: 18,
    evidence: '전체 100 ms는 넘지 않지만 DDS와 executor의 지역 budget을 함께 넘었습니다.',
    action: 'Keep-last(1), burst shaping, callback 격리 뒤 같은 burst fixture를 다시 실행합니다.',
  },
  'priority-inversion': {
    label: 'Priority inversion',
    delta: { executor: 35 },
    timeOk: true,
    epochOk: true,
    lifecycleOk: true,
    stopAck: 47,
    evidence: '낮은 우선순위 task의 35 ms critical section이 high-priority control과 stop acknowledgement를 함께 막습니다.',
    action: 'Lock owner, callback group와 OS priority를 분리하고 stop path의 30 ms bound를 재검증합니다.',
    derivation: 'B_H = 35 ms, R_stop = 12 ms + B_H = 47 ms > 30 ms',
  },
  'clock-jump': {
    label: 'Clock jump',
    delta: {},
    timeOk: false,
    epochOk: true,
    lifecycleOk: true,
    stopAck: 14,
    evidence: '실행 시간은 짧지만 ROS time이 뒤로 이동해 TF·synchronizer·integrator의 시간 계보가 끊겼습니다.',
    action: 'Time-indexed state를 clear하고 새 first-valid sample 전까지 command gate를 닫습니다.',
  },
  'restart-history': {
    label: 'Restart history',
    delta: {},
    timeOk: true,
    epochOk: false,
    lifecycleOk: true,
    stopAck: 13,
    evidence: 'Transient history의 command가 현재 goal이 아니라 restart 이전 epoch에 속합니다.',
    action: 'Epoch·goal revision을 consumer 직전 재검사하고 현재 command가 올 때까지 hold합니다.',
  },
  inactive: {
    label: 'Inactive node',
    delta: {},
    timeOk: true,
    epochOk: true,
    lifecycleOk: false,
    stopAck: 11,
    evidence: 'Endpoint는 발견됐지만 controller가 Inactive라 functional processing과 command publish가 허용되지 않습니다.',
    action: 'Calibration·dependency·first valid data를 다시 확인한 뒤 supervisor가 명시적으로 activate합니다.',
  },
};

export function RuntimeQualificationLab() {
  const [fault, setFault] = useState<QualificationFault>('baseline');
  const scenario = qualificationFaults[fault];
  const stages = qualificationStages.map((stage) => ({
    ...stage,
    actual: stage.base + (scenario.delta[stage.id] ?? 0),
  }));
  const responseBound = stages.reduce((sum, stage) => sum + stage.actual, 0);
  const deadline = 100;
  const reserve = 10;
  const stageBreaches = stages.filter((stage) => stage.actual > stage.budget);
  const timingOk = responseBound <= deadline - reserve && stageBreaches.length === 0;
  const stopOk = scenario.stopAck <= 30;
  const fixturePass = timingOk && scenario.timeOk && scenario.epochOk && scenario.lifecycleOk && stopOk;
  const mustStop = !scenario.timeOk || !scenario.epochOk || !scenario.lifecycleOk || !stopOk || responseBound > deadline;
  const status = fixturePass
    ? 'BASELINE PASS · SUITE NO-GO'
    : mustStop
      ? 'NO-GO · CANCEL · STOP'
      : 'NO-GO · DEGRADE';

  const gates = [
    { label: 'Timing allocation', value: timingOk, note: `${responseBound}/${deadline - reserve} ms release envelope` },
    { label: 'Clock · TF lineage', value: scenario.timeOk, note: scenario.timeOk ? 'acquisition-time valid' : 'TIME CLOSED' },
    { label: 'Epoch · goal identity', value: scenario.epochOk, note: scenario.epochOk ? 'current revision' : 'EPOCH CLOSED' },
    { label: 'Lifecycle readiness', value: scenario.lifecycleOk, note: scenario.lifecycleOk ? 'Active + dependencies' : 'LIFECYCLE CLOSED' },
    { label: 'Stop acknowledgement', value: stopOk, note: `${scenario.stopAck}/30 ms` },
  ];

  return (
    <LabFrame eyebrow="QUALIFICATION LAB 10" title="Fault injection에서 release gate까지" status={status} danger>
      <div data-ros2-qualification-lab>
        <div className="border-b border-border p-4 sm:p-6">
          <SegmentedControl
            label="Failure injection"
            value={fault}
            onChange={setFault}
            options={(Object.entries(qualificationFaults) as Array<[QualificationFault, (typeof qualificationFaults)[QualificationFault]]>).map(([value, item]) => ({ value, label: item.label }))}
          />
          <div className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <p className="text-sm font-semibold leading-relaxed">{scenario.evidence}</p>
            <p className="text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">다음 조치 · </strong>{scenario.action}</p>
          </div>
          {scenario.derivation && (
            <p className="mt-3 rounded-md border border-amber-500/25 bg-amber-500/[0.04] px-3 py-2 font-mono text-[11px] font-semibold leading-relaxed text-amber-900 dark:text-amber-200">
              계산 근거 · {scenario.derivation}
            </p>
          )}
        </div>

        <div className="grid min-w-0 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="min-w-0 border-b border-border p-4 sm:p-6 lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold text-muted-foreground">구간별 allocation과 injected bound</p>
              <span className="font-mono text-[11px] text-muted-foreground">90 ms + reserve 10 ms</span>
            </div>
            <div className="mt-4 space-y-3">
              {stages.map((stage) => {
                const breached = stage.actual > stage.budget;
                return (
                  <div key={stage.id} className="grid min-w-0 grid-cols-[6.5rem_minmax(0,1fr)_5.25rem] items-center gap-3 sm:grid-cols-[8rem_minmax(0,1fr)_6rem]">
                    <span className="min-w-0 text-xs font-semibold">{stage.label}</span>
                    <span className="relative h-2 overflow-hidden rounded bg-muted">
                      <span className={`absolute inset-y-0 left-0 rounded ${breached ? 'bg-red-500' : stage.tone}`} style={{ width: `${clamp(stage.actual / Math.max(stage.budget, stage.actual) * 100, 4, 100)}%` }} />
                      <span className="absolute inset-y-0 right-0 border-l border-foreground/45" />
                    </span>
                    <span className={`justify-self-end font-mono text-[11px] font-bold ${breached ? 'text-red-700 dark:text-red-300' : 'text-muted-foreground'}`}>
                      {stage.actual}/{stage.budget} ms
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-border bg-border">
              {[
                ['Bound', `${responseBound} ms`],
                ['Deadline', `${deadline} ms`],
                ['Margin', `${deadline - responseBound} ms`],
              ].map(([label, value]) => <div key={label} className="min-w-0 bg-background p-3"><p className="text-[10px] font-semibold text-muted-foreground">{label}</p><p className="mt-1 break-words font-mono text-sm font-black">{value}</p></div>)}
            </div>
          </div>

          <div className="min-w-0 p-4 sm:p-6">
            <p className="text-xs font-bold text-muted-foreground">독립 release gates</p>
            <div className="mt-3 divide-y divide-border border-y border-border">
              {gates.map((gate) => (
                <div key={gate.label} className="grid min-w-0 grid-cols-[1.25rem_minmax(0,1fr)] gap-3 py-3">
                  {gate.value
                    ? <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
                    : <XCircle className="mt-0.5 h-4 w-4 text-red-700 dark:text-red-300" aria-hidden="true" />}
                  <div className="min-w-0">
                    <p className="text-xs font-bold">{gate.label}</p>
                    <p className={`mt-1 break-words font-mono text-[11px] ${gate.value ? 'text-muted-foreground' : 'font-bold text-red-700 dark:text-red-300'}`}>{gate.note}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              전체 bound가 deadline 안이어도 지역 allocation, time, epoch, lifecycle 또는 stop gate 하나가 닫히면 release하지 않습니다.
            </p>
          </div>
        </div>
      </div>
    </LabFrame>
  );
}

export function RuntimeContractStrip() {
  return (
    <div className="not-prose my-6 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
      {[
        { icon: Network, label: 'Communication', value: 'matched + fresh' },
        { icon: Cpu, label: 'Execution', value: 'bounded callback chain' },
        { icon: TimerReset, label: 'Time', value: 'acquisition aligned' },
        { icon: ShieldCheck, label: 'Actuation', value: 'epoch + health gate' },
      ].map((item) => <div key={item.label} className="min-w-0 bg-background p-4"><item.icon className="h-4 w-4 text-teal-700" /><p className="mt-3 text-xs font-bold text-muted-foreground">{item.label}</p><p className="mt-1 font-mono text-sm font-black">{item.value}</p></div>)}
    </div>
  );
}

export function RuntimeFailureLegend() {
  return (
    <div className="not-prose my-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" />data</span>
      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-teal-500" />middleware</span>
      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet-500" />execution</span>
      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" />waiting / stale</span>
      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500" />violated invariant</span>
    </div>
  );
}
