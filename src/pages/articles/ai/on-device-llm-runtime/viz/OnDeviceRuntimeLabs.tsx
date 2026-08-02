import { useMemo, useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Cpu,
  FileOutput,
  Gauge,
  GitBranch,
  MemoryStick,
  PackageCheck,
  Play,
  ShieldAlert,
  Smartphone,
  Thermometer,
  XCircle,
} from 'lucide-react';

function FigureHeader({ eyebrow, title, metric }: { eyebrow: string; title: string; metric: string }) {
  return (
    <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:px-5">
      <span className="font-mono text-[11px] font-black text-blue-700 dark:text-blue-300">{eyebrow}</span>
      <strong className="min-w-0 text-sm leading-snug">{title}</strong>
      <span className="w-fit rounded-sm border border-border bg-background px-2 py-1 font-mono text-[10px] font-bold text-muted-foreground">{metric}</span>
    </figcaption>
  );
}

function Choice<T extends string>({ label, options, value, onChange }: {
  label: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-[11px] font-semibold text-muted-foreground">{label}</p>
      <div className={`grid gap-1 rounded-md bg-muted/45 p-1 ${options.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`} role="group" aria-label={label}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={`min-h-11 min-w-0 rounded-sm px-2 text-[11px] font-bold leading-tight transition-colors ${value === option.value ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

type Backend = 'xnnpack' | 'coreml' | 'qnn';

const backendProfiles = {
  xnnpack: {
    label: 'XNNPACK · CPU', artifact: 'llama4b-xnnpack.pte', target: 'Arm CPU kernel',
    risk: '지원되지 않는 low-bit packing은 portable op로 돌아가거나 export에서 막힌다.',
  },
  coreml: {
    label: 'Core ML · ANE/GPU', artifact: 'llama4b-coreml.pte', target: 'Apple delegate',
    risk: '동적 shape와 일부 attention op가 graph 분할·CPU 왕복을 만들 수 있다.',
  },
  qnn: {
    label: 'QNN · NPU', artifact: 'llama4b-qnn.pte', target: 'Qualcomm HTP',
    risk: 'Target chipset·SDK·dtype 계약이 다르면 compile 또는 load 단계에서 실패한다.',
  },
} satisfies Record<Backend, { label: string; artifact: string; target: string; risk: string }>;

const pipelineStages = [
  {
    label: 'Export contract', icon: GitBranch,
    input: 'Checkpoint + example inputs',
    work: 'Prefill·decode method, dynamic context bound와 KV mutation을 graph contract로 고정한다.',
    output: 'ExportedProgram',
    invariant: 'Tokenizer·model revision과 tensor shape 의미가 같다.',
    failure: '예제 입력이 너무 좁아 실제 prompt shape를 받지 못한다.',
  },
  {
    label: 'Precision', icon: Cpu,
    input: 'Exported graph + target dtype',
    work: 'Backend가 실제 실행할 수 있는 packing과 quantized operator로 바꾼다.',
    output: 'Backend-aware graph',
    invariant: 'Reference logits와 허용 오차 안에서 일치한다.',
    failure: '작은 file은 만들었지만 target kernel이 없어 dequantize한다.',
  },
  {
    label: 'Partition', icon: GitBranch,
    input: 'Supported-op capability',
    work: '지원 subgraph는 delegate로 내리고 나머지는 portable fallback으로 남긴다.',
    output: 'Delegated + fallback regions',
    invariant: '경계 tensor의 dtype·layout·shape가 보존된다.',
    failure: '작은 unsupported op 하나가 큰 attention 영역을 잘라낸다.',
  },
  {
    label: 'Serialize', icon: FileOutput,
    input: 'Lowered edge program',
    work: 'Target delegate blob, constants와 execution plan을 하나의 배포 artifact로 직렬화한다.',
    output: 'Target-specific .pte',
    invariant: 'Target SDK·backend·model manifest가 함께 versioned 된다.',
    failure: '한 .pte를 모든 device에서 통용되는 model file로 착각한다.',
  },
  {
    label: 'App + trace', icon: Smartphone,
    input: '.pte + tokenizer + prompt',
    work: '명시적으로 load하고 UI thread 밖에서 stream 생성하며 ETDump와 device trace를 수집한다.',
    output: 'Tokens + release evidence',
    invariant: 'Stop·error·reset과 thermal 상태까지 재현된다.',
    failure: '첫 generate에 load를 숨기거나 cold 1회 수치만 보고 배포한다.',
  },
] as const;

export function EdgeExportPipelineLab() {
  const [backend, setBackend] = useState<Backend>('qnn');
  const [active, setActive] = useState(0);
  const profile = backendProfiles[backend];
  const stage = pipelineStages[active];
  const StageIcon = stage.icon;

  return (
    <figure data-edge-export-pipeline data-backend={backend} className="foundation-viz-explorer not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border">
      <FigureHeader eyebrow="EXECUTION CONTRACT" title="Checkpoint는 target별 실행 계약을 통과해야 앱 artifact가 된다" metric={profile.artifact} />
      <div className="border-b border-border p-4 sm:p-5">
        <Choice
          label="배포 backend"
          options={([
            { value: 'xnnpack', label: 'XNNPACK CPU' },
            { value: 'coreml', label: 'Core ML' },
            { value: 'qnn', label: 'QNN NPU' },
          ] as const)}
          value={backend}
          onChange={setBackend}
        />
      </div>

      <div className="grid gap-2 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-5">
        {pipelineStages.map((item, index) => {
          const Icon = item.icon;
          const selected = active === index;
          return (
            <button
              key={item.label}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(index)}
              className={`min-h-24 min-w-0 rounded-md border p-3 text-left transition-colors ${selected ? 'border-blue-600/45 bg-blue-500/[0.06]' : 'border-border hover:bg-muted/25'}`}
            >
              <span className="flex items-center justify-between gap-2">
                <Icon className="h-4 w-4 shrink-0" />
                <span className="font-mono text-[10px] font-bold text-muted-foreground">0{index + 1}</span>
              </span>
              <strong className="mt-3 block text-xs leading-snug">{item.label}</strong>
            </button>
          );
        })}
      </div>

      <div className="border-t border-border bg-muted/15 p-4 sm:p-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border bg-background"><StageIcon className="h-4 w-4" /></span>
          <div className="min-w-0">
            <p className="text-sm font-black">{stage.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{stage.work}</p>
          </div>
        </div>
        <div className="mt-4 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['입력', stage.input], ['출력', active === 3 ? profile.artifact : stage.output],
            ['지켜야 할 것', stage.invariant], ['깨지는 지점', stage.failure],
          ].map(([label, value]) => (
            <div key={label} className="min-w-0 bg-background p-3">
              <p className="text-[10px] font-black text-muted-foreground">{label}</p>
              <p className="mt-1 break-words text-xs leading-relaxed">{value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-3 border-t border-border p-4 text-xs leading-relaxed sm:grid-cols-2 sm:p-5">
        <p><strong className="text-blue-700 dark:text-blue-300">현재 target.</strong> {profile.target}용 artifact는 다른 backend artifact와 별도로 검증한다.</p>
        <p><strong className="text-amber-700 dark:text-amber-300">대표 위험.</strong> {profile.risk}</p>
      </div>
    </figure>
  );
}

type CoverageScenario = 'shape' | 'attention' | 'full';

const coverageScenarios = {
  shape: {
    label: '싼 shape fallback', delegatedNodes: 312, totalNodes: 732, delegatedMs: 96, totalMs: 112,
    boundaryMiB: 96, insight: '많은 shape·assert node가 CPU에 남아도 계산 시간이 짧으면 전체 latency 영향은 작다.',
    groups: [
      ['Delegate · linear', '184 nodes · 58 ms'], ['Delegate · attention', '32 nodes · 26 ms'],
      ['Delegate · norm/act', '96 nodes · 12 ms'], ['Fallback + boundary', '420 nodes · 16 ms'],
    ],
  },
  attention: {
    label: '비싼 attention fallback', delegatedNodes: 784, totalNodes: 832, delegatedMs: 73, totalMs: 145,
    boundaryMiB: 768, insight: 'Node는 거의 다 위임됐지만 핵심 attention과 큰 tensor 왕복이 전체 시간의 절반을 먹는다.',
    groups: [
      ['Delegate · elementwise', '600 nodes · 15 ms'], ['Delegate · linear', '184 nodes · 58 ms'],
      ['Fallback · attention', '32 nodes · 52 ms'], ['Shape + boundary', '16 nodes · 20 ms'],
    ],
  },
  full: {
    label: 'Full delegation', delegatedNodes: 832, totalNodes: 832, delegatedMs: 105, totalMs: 105,
    boundaryMiB: 0, insight: '모든 node가 같은 delegate에 있어도 실제 kernel 효율과 thermal 지속 성능 검증은 별도로 남는다.',
    groups: [
      ['Delegate · elementwise', '600 nodes · 14 ms'], ['Delegate · linear', '184 nodes · 56 ms'],
      ['Delegate · attention', '32 nodes · 27 ms'], ['Delegate · support', '16 nodes · 8 ms'],
    ],
  },
} satisfies Record<CoverageScenario, {
  label: string; delegatedNodes: number; totalNodes: number; delegatedMs: number; totalMs: number;
  boundaryMiB: number; insight: string; groups: string[][];
}>;

function CoverageBar({ label, value, tone }: { label: string; value: number; tone: 'blue' | 'emerald' }) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-xs font-semibold">{label}</span>
        <strong className="font-mono text-lg">{value.toFixed(1)}%</strong>
      </div>
      <div className="h-3 overflow-hidden rounded-sm bg-muted" aria-label={`${label} ${value.toFixed(1)}%`}>
        <div className={`h-full ${tone === 'blue' ? 'bg-blue-600' : 'bg-emerald-500'}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export function DelegationCoverageLab() {
  const [scenario, setScenario] = useState<CoverageScenario>('attention');
  const trace = coverageScenarios[scenario];
  const nodeCoverage = trace.delegatedNodes / trace.totalNodes * 100;
  const timeCoverage = trace.delegatedMs / trace.totalMs * 100;

  return (
    <figure data-delegation-coverage data-scenario={scenario} className="foundation-viz-explorer not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border">
      <FigureHeader eyebrow="MEASURED TEACHING FIXTURE" title="위임된 node 수와 빨라진 실행 시간은 같은 지표가 아니다" metric={`${trace.totalMs} ms trace`} />
      <div className="border-b border-border p-4 sm:p-5">
        <Choice
          label="Inspector trace"
          options={([
            { value: 'shape', label: 'Shape fallback' },
            { value: 'attention', label: 'Attention fallback' },
            { value: 'full', label: 'Full delegate' },
          ] as const)}
          value={scenario}
          onChange={setScenario}
        />
      </div>
      <div className="grid gap-6 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,.85fr)]">
        <div className="min-w-0 space-y-6">
          <CoverageBar label="Node coverage" value={nodeCoverage} tone="blue" />
          <CoverageBar label="Time coverage" value={timeCoverage} tone="emerald" />
          <div className="rounded-md border border-border bg-muted/15 p-4">
            <p className="text-[11px] font-black text-muted-foreground">판독</p>
            <p className="mt-2 text-sm leading-relaxed">{trace.insight}</p>
          </div>
        </div>
        <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-1">
          <div className="bg-background p-4">
            <p className="text-[11px] font-semibold text-muted-foreground">Boundary traffic</p>
            <p className="mt-1 font-mono text-2xl font-black text-violet-700 dark:text-violet-300">{trace.boundaryMiB} MiB</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">Delegate와 portable runtime 사이의 tensor 이동</p>
          </div>
          <div className="bg-background p-4">
            <p className="text-[11px] font-semibold text-muted-foreground">Trace duration</p>
            <p className="mt-1 font-mono text-2xl font-black">{trace.totalMs} ms</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">같은 input fixture의 end-to-end execution</p>
          </div>
        </div>
      </div>
      <div className="grid gap-px border-t border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {trace.groups.map(([label, value]) => (
          <div key={label} className="min-w-0 bg-background p-4">
            <p className="text-[10px] font-black text-muted-foreground">{label}</p>
            <p className="mt-1 break-words font-mono text-xs font-bold">{value}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}

type ModelSize = '4b' | '9b';
type ContextSize = '2k' | '8k';
type Duration = 'cold' | '5m' | '15m';
type DelegateMode = 'full' | 'fallback';

const GATES = { memory: 6.2, ttft: 3, tps: 10, energy: 65 };

function GateCell({ label, value, limit, pass, icon: Icon }: {
  label: string; value: string; limit: string; pass: boolean; icon: typeof Gauge;
}) {
  return (
    <div className="min-w-0 bg-background p-4">
      <span className="flex items-center justify-between gap-2">
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
        {pass ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /> : <XCircle className="h-4 w-4 shrink-0 text-red-600" />}
      </span>
      <p className="mt-3 text-[11px] font-semibold text-muted-foreground">{label}</p>
      <p className={`mt-1 break-words font-mono text-xl font-black ${pass ? 'text-foreground' : 'text-red-700 dark:text-red-300'}`}>{value}</p>
      <p className="mt-1 text-[10px] text-muted-foreground">gate {limit}</p>
    </div>
  );
}

export function DeviceReleaseLab() {
  const [model, setModel] = useState<ModelSize>('4b');
  const [context, setContext] = useState<ContextSize>('8k');
  const [duration, setDuration] = useState<Duration>('15m');
  const [delegate, setDelegate] = useState<DelegateMode>('fallback');

  const result = useMemo(() => {
    const contextTokens = context === '2k' ? 2048 : 8192;
    const weights = model === '4b' ? 2.2 : 5.0;
    const kvKiB = model === '4b' ? 96 : 160;
    const arena = model === '4b' ? 0.7 : 1.1;
    const memory = weights + contextTokens * kvKiB / 1024 / 1024 + arena + 0.45;
    const baseTtft = model === '4b'
      ? (context === '2k' ? 0.95 : 2.8)
      : (context === '2k' ? 1.9 : 5.8);
    const thermalTtft = duration === 'cold' ? 1 : duration === '5m' ? 1.12 : 1.35;
    const ttft = baseTtft * (delegate === 'fallback' ? 1.65 : 1) * thermalTtft;
    const baseTps = model === '4b' ? 18 : 9;
    const contextFactor = context === '2k' ? 1 : 0.82;
    const thermalTps = duration === 'cold' ? 1 : duration === '5m' ? 0.88 : 0.68;
    const tps = baseTps * contextFactor * (delegate === 'fallback' ? 0.58 : 1) * thermalTps;
    const baseEnergy = model === '4b' ? 42 : 75;
    const durationEnergy = duration === 'cold' ? 1 : duration === '5m' ? 1.05 : 1.18;
    const energy = baseEnergy * (delegate === 'fallback' ? 1.25 : 1) * durationEnergy;
    const checks = {
      memory: memory <= GATES.memory,
      ttft: ttft <= GATES.ttft,
      tps: tps >= GATES.tps,
      energy: energy <= GATES.energy,
    };
    return { memory, ttft, tps, energy, checks, passed: Object.values(checks).every(Boolean) };
  }, [context, delegate, duration, model]);

  return (
    <figure data-device-release-lab data-release={result.passed ? 'approve' : 'reject'} className="foundation-viz-explorer not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border">
      <FigureHeader eyebrow="SYNTHETIC RELEASE FIXTURE" title="Memory fit이 아니라 모든 지속 성능 gate를 함께 통과해야 한다" metric="usable 6.2 GiB" />
      <div className="grid gap-4 border-b border-border p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
        <Choice label="Model" options={([{ value: '4b', label: '4B · INT4' }, { value: '9b', label: '9B · INT4' }] as const)} value={model} onChange={setModel} />
        <Choice label="Context" options={([{ value: '2k', label: '2K' }, { value: '8k', label: '8K' }] as const)} value={context} onChange={setContext} />
        <Choice label="Device run" options={([{ value: 'cold', label: 'Cold' }, { value: '5m', label: '5 min' }, { value: '15m', label: '15 min' }] as const)} value={duration} onChange={setDuration} />
        <Choice label="Graph placement" options={([{ value: 'full', label: 'Full delegate' }, { value: 'fallback', label: 'Attention fallback' }] as const)} value={delegate} onChange={setDelegate} />
      </div>

      <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        <GateCell label="Resident memory" value={`${result.memory.toFixed(2)} GiB`} limit={`≤ ${GATES.memory} GiB`} pass={result.checks.memory} icon={MemoryStick} />
        <GateCell label="TTFT" value={`${result.ttft.toFixed(2)} s`} limit={`≤ ${GATES.ttft.toFixed(1)} s`} pass={result.checks.ttft} icon={Play} />
        <GateCell label="Decode" value={`${result.tps.toFixed(1)} tok/s`} limit={`≥ ${GATES.tps} tok/s`} pass={result.checks.tps} icon={Activity} />
        <GateCell label="Energy / token" value={`${result.energy.toFixed(0)} mJ`} limit={`≤ ${GATES.energy} mJ`} pass={result.checks.energy} icon={Thermometer} />
      </div>

      <div className={`grid gap-4 border-t border-border p-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:p-5 ${result.passed ? 'bg-emerald-500/[0.06]' : 'bg-red-500/[0.05]'}`}>
        <span className={`grid h-11 w-11 place-items-center rounded-md border bg-background ${result.passed ? 'border-emerald-600/35 text-emerald-700 dark:text-emerald-300' : 'border-red-600/35 text-red-700 dark:text-red-300'}`}>
          {result.passed ? <PackageCheck className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-black">{result.passed ? '진단상 승인 후보' : 'Release 거부'}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {result.passed
              ? '수치 fixture는 통과했다. 같은 설정의 5분·15분 physical-device trace와 quality gate까지 재현해야 최종 승인한다.'
              : `통과한 gate ${Object.values(result.checks).filter(Boolean).length}/4. Memory에 들어가도 latency·throughput·energy 중 하나가 깨지면 배포하지 않는다.`}
          </p>
        </div>
      </div>
      <p className="border-t border-border px-4 py-3 text-[10px] leading-relaxed text-muted-foreground sm:px-5">이 수치는 인과관계를 검산하기 위한 교육용 synthetic fixture이며 특정 vendor·device benchmark가 아니다.</p>
    </figure>
  );
}
