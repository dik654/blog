import { useMemo, useState, type ReactNode } from 'react';
import {
  BadgeCheck,
  Ban,
  Boxes,
  Cable,
  CircleDollarSign,
  Clock3,
  Cpu,
  GitCompareArrows,
  Network,
  Radar,
  RefreshCw,
  Route,
  ShieldAlert,
  TimerReset,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react';

function LabFrame({
  eyebrow,
  title,
  description,
  footer,
  dataAttribute,
  dataState,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  footer: ReactNode;
  dataAttribute: string;
  dataState: string;
  children: ReactNode;
}) {
  return (
    <figure
      {...{ [dataAttribute]: '' }}
      data-serving-control-viz
      data-lab-state={dataState}
      className="not-prose my-8 min-w-0 scroll-mt-24 overflow-hidden rounded-md border border-border bg-background"
    >
      <figcaption className="grid min-w-0 gap-2 border-b border-border bg-muted/15 px-4 py-4 sm:px-6 sm:py-5">
        <p className="text-[11px] font-black uppercase text-muted-foreground">{eyebrow}</p>
        <h3 className="text-base font-bold leading-snug sm:text-lg">{title}</h3>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{description}</p>
      </figcaption>
      {children}
      <div className="border-t border-border bg-muted/15 px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-6">
        {footer}
      </div>
    </figure>
  );
}

function ScenarioTabs<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="grid gap-px border-b border-border bg-border sm:auto-cols-fr sm:grid-flow-col" role="tablist" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          onClick={() => onChange(option.value)}
          className={`min-h-11 min-w-0 bg-background px-3 py-2.5 text-left text-xs font-bold leading-snug transition-colors sm:text-center ${
            value === option.value
              ? 'shadow-[inset_0_-2px_0_var(--foreground)] text-foreground'
              : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function Metric({
  label,
  value,
  detail,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  detail?: string;
  tone?: 'neutral' | 'good' | 'warn' | 'bad';
}) {
  const color = {
    neutral: 'text-foreground',
    good: 'text-emerald-700 dark:text-emerald-300',
    warn: 'text-amber-700 dark:text-amber-300',
    bad: 'text-rose-700 dark:text-rose-300',
  }[tone];
  return (
    <div className="min-w-0 bg-background p-4 sm:p-5">
      <p className="text-[11px] font-bold text-muted-foreground">{label}</p>
      <p className={`mt-2 break-words font-mono text-lg font-black tabular-nums ${color}`}>{value}</p>
      {detail && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{detail}</p>}
    </div>
  );
}

type OpsScenario = 'release' | 'capacity' | 'retry';

const OPS_SCENARIOS: Record<OpsScenario, {
  label: string;
  icon: LucideIcon;
  symptom: string;
  separator: string;
  owner: string;
  query: string;
  action: string;
  identity: string;
  tone: string;
}> = {
  release: {
    label: '새 release만 실패',
    icon: GitCompareArrows,
    symptom: 'structured output error ↑',
    separator: '오류가 release r43에만 묶임',
    owner: 'Release controller',
    query: 'model·tokenizer·template hash 비교',
    action: 'r43 traffic hold → r42 rollback',
    identity: 'release_id = r43',
    tone: 'text-sky-700 dark:text-sky-300',
  },
  capacity: {
    label: 'TTFT·queue 상승',
    icon: Cpu,
    symptom: 'TTFT 0.45 → 1.4 s',
    separator: 'TPOT stable · 2 Pending',
    owner: 'Fleet / admission',
    query: 'claim·device·Pending reason 조회',
    action: 'canary 확대 중단 → capacity 복원',
    identity: 'device_claim = gpu-06',
    tone: 'text-violet-700 dark:text-violet-300',
  },
  retry: {
    label: 'Backend attempt 급증',
    icon: RefreshCw,
    symptom: '800 request → 1,120 attempt/min',
    separator: 'ingress stable · gateway retry ↑',
    owner: 'Gateway policy',
    query: 'attempt lineage·cooldown reason 조회',
    action: 'retry budget 축소 → 실패 후보 격리',
    identity: 'route_reason = retry',
    tone: 'text-amber-700 dark:text-amber-300',
  },
};

export function OpsEvidenceLab() {
  const [scenario, setScenario] = useState<OpsScenario>('capacity');
  const selected = OPS_SCENARIOS[scenario];
  const Icon = selected.icon;

  return (
    <LabFrame
      eyebrow="Evidence ownership lab"
      title="비슷한 장애 화면도 분리 신호가 달라지면 첫 소유자가 달라진다"
      description="증상을 고른 뒤, 원인을 단정하지 않고 어떤 identity로 어느 제어면을 먼저 조회할지 추적한다."
      dataAttribute="data-serving-ops-lab"
      dataState={scenario}
      footer={<><strong className="text-foreground">판정 원칙.</strong> 메트릭은 가설을 고르는 증거다. release·device·route·request identity가 이어져야 행동의 효과를 같은 대상에서 다시 검증할 수 있다.</>}
    >
      <ScenarioTabs
        label="서빙 장애 증상"
        value={scenario}
        onChange={setScenario}
        options={(Object.entries(OPS_SCENARIOS) as Array<[OpsScenario, (typeof OPS_SCENARIOS)[OpsScenario]]>).map(([value, item]) => ({ value, label: item.label }))}
      />
      <div className="grid gap-px bg-border sm:grid-cols-3">
        <Metric label="사용자·시스템 증상" value={selected.symptom} tone="bad" />
        <Metric label="층을 가르는 반증" value={selected.separator} tone="warn" />
        <Metric label="첫 소유자" value={selected.owner} />
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
        <div className="border-y border-border py-4">
          <Icon className={`h-6 w-6 ${selected.tone}`} aria-hidden="true" />
          <p className="mt-4 text-xs font-bold">Correlation key</p>
          <code className="mt-2 block break-words text-sm">{selected.identity}</code>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">이 key로 gateway log, Pod event, runtime metric과 release manifest를 같은 대상에 묶는다.</p>
        </div>
        <div className="divide-y divide-border border-y border-border">
          <div className="grid gap-2 py-4 sm:grid-cols-[7rem_minmax(0,1fr)]">
            <strong className="text-xs">다음 조회</strong>
            <p className="text-sm leading-relaxed text-muted-foreground">{selected.query}</p>
          </div>
          <div className="grid gap-2 py-4 sm:grid-cols-[7rem_minmax(0,1fr)]">
            <strong className="text-xs">제한된 행동</strong>
            <p className="text-sm leading-relaxed text-muted-foreground">{selected.action}</p>
          </div>
          <div className="grid gap-2 py-4 sm:grid-cols-[7rem_minmax(0,1fr)]">
            <strong className="text-xs">종료 조건</strong>
            <p className="text-sm leading-relaxed text-muted-foreground">같은 identity의 증상과 분리 신호가 observation window 안에 함께 회복된다.</p>
          </div>
        </div>
      </div>
    </LabFrame>
  );
}

type ReleaseScenario = 'pass' | 'tokenizer' | 'warmup' | 'ttft';

const RELEASE_SCENARIOS: Record<ReleaseScenario, {
  label: string;
  blocked: number | null;
  gateValues: [string, string, string, string];
  verdict: string;
  next: string;
}> = {
  pass: {
    label: '모두 통과',
    blocked: null,
    gateValues: ['모든 digest 고정', '240 s 뒤 성공', '대표 prompt 성공', 'TTFT +4% · eval 통과'],
    verdict: '10% → 100% promote',
    next: 'route weight를 단계적으로 올리고 release window를 계속 관찰한다.',
  },
  tokenizer: {
    label: 'Tokenizer 불일치',
    blocked: 0,
    gateValues: ['model r43 · tokenizer r42', '검사 대상 아님', '검사 대상 아님', '검사 대상 아님'],
    verdict: 'manifest gate에서 차단',
    next: 'immutable tuple을 다시 만들기 전에는 Pod startup조차 release 증거로 인정하지 않는다.',
  },
  warmup: {
    label: 'Warmup timeout',
    blocked: 2,
    gateValues: ['모든 digest 고정', '240 s 뒤 성공', '600 s timeout', '검사 대상 아님'],
    verdict: 'readiness에서 차단',
    next: 'endpoint를 Service에서 제외하고 memory headroom·sample trace를 조사한다.',
  },
  ttft: {
    label: 'TTFT 회귀',
    blocked: 3,
    gateValues: ['모든 digest 고정', '240 s 뒤 성공', '대표 prompt 성공', 'TTFT +38% > +10%'],
    verdict: 'canary에서 rollback',
    next: '새 traffic을 중단하고 in-flight request를 drain한 뒤 r42로 route를 되돌린다.',
  },
};

const RELEASE_GATES = [
  { label: 'Immutable tuple', icon: GitCompareArrows },
  { label: 'Startup complete', icon: Clock3 },
  { label: 'Ready · warm', icon: BadgeCheck },
  { label: 'Canary approved', icon: Radar },
] as const;

export function ReleaseDecisionLab() {
  const [scenario, setScenario] = useState<ReleaseScenario>('ttft');
  const selected = RELEASE_SCENARIOS[scenario];

  return (
    <LabFrame
      eyebrow="Fail-closed release lab"
      title="첫 차단 gate 뒤의 상태는 성공이 아니라 아직 검사할 자격이 없는 상태다"
      description="시나리오를 바꾸면 manifest, startup, readiness, canary 중 최초로 release를 멈추는 경계와 rollback 행동이 달라진다."
      dataAttribute="data-serving-release-lab"
      dataState={scenario}
      footer={<><strong className="text-foreground">고정 fixture.</strong> 800 req/min, startup 240 s이므로 새 replica가 준비되는 동안 3,200 requests가 도착한다. 이것은 queue 크기가 아니라 arrival pressure 하한이다.</>}
    >
      <ScenarioTabs
        label="릴리스 검증 시나리오"
        value={scenario}
        onChange={setScenario}
        options={(Object.entries(RELEASE_SCENARIOS) as Array<[ReleaseScenario, (typeof RELEASE_SCENARIOS)[ReleaseScenario]]>).map(([value, item]) => ({ value, label: item.label }))}
      />
      <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        {RELEASE_GATES.map((gate, index) => {
          const blocked = selected.blocked === index;
          const eligible = selected.blocked == null || index <= selected.blocked;
          const passed = eligible && !blocked;
          const Icon = gate.icon;
          return (
            <div key={gate.label} className="min-w-0 bg-background p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[11px] font-black text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                {passed ? <BadgeCheck className="h-4 w-4 text-emerald-600" aria-label="통과" /> : blocked ? <Ban className="h-4 w-4 text-rose-600" aria-label="차단" /> : <Clock3 className="h-4 w-4 text-muted-foreground" aria-label="검사 전" />}
              </div>
              <Icon className="mt-5 h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <p className="mt-3 text-sm font-bold">{gate.label}</p>
              <p className={`mt-2 text-xs leading-relaxed ${blocked ? 'font-semibold text-rose-700 dark:text-rose-300' : 'text-muted-foreground'}`}>
                {selected.gateValues[index]}
              </p>
              <p className="mt-3 text-[11px] font-bold">
                {passed ? 'PASS' : blocked ? 'BLOCK' : 'NOT ELIGIBLE'}
              </p>
            </div>
          );
        })}
      </div>
      <div className="grid gap-4 border-t border-border p-4 sm:p-6 lg:grid-cols-[12rem_minmax(0,1fr)]">
        <div>
          <p className="text-[11px] font-bold text-muted-foreground">RELEASE DECISION</p>
          <p className={`mt-2 text-base font-black ${selected.blocked == null ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>{selected.verdict}</p>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{selected.next}</p>
      </div>
    </LabFrame>
  );
}

type TopologyScenario = 'replica' | 'tp8' | 'tp16-no-rdma' | 'tp16-rdma';

const TOPOLOGY_SCENARIOS: Record<TopologyScenario, {
  label: string;
  group: string;
  groups: number;
  network: string;
  scheduler: string;
  verdict: string;
  detail: string;
}> = {
  replica: {
    label: '독립 replica',
    group: '1 GPU',
    groups: 16,
    network: '요청 단위 독립',
    scheduler: '일반 Pod scheduling',
    verdict: '16개 endpoint 가능',
    detail: '각 request가 한 GPU 안에서 끝난다. 서버 간 RDMA는 serving correctness의 필수조건이 아니다.',
  },
  tp8: {
    label: '단일 node TP=8',
    group: '8 GPU · 같은 NVLink domain',
    groups: 2,
    network: 'node 내부 NVLink/NVSwitch',
    scheduler: 'node affinity + 8 GPU 동시 할당',
    verdict: '2개 model group 가능',
    detail: '총 16개를 8개씩 같은 node 안에 묶는다. 흩어진 여덟 GPU는 같은 TP group이 아니다.',
  },
  'tp16-no-rdma': {
    label: '2-node TP=16 · TCP',
    group: '16 GPU · 2 nodes',
    groups: 0,
    network: 'RDMA 경로 없음',
    scheduler: 'gang scheduling 필요',
    verdict: '토폴로지 계약 차단',
    detail: 'GPU 수는 충분하지만 이 workload가 요구한 GPUDirect RDMA/RoCE·InfiniBand 경로가 없어 compatible group은 0이다.',
  },
  'tp16-rdma': {
    label: '2-node TP=16 · RDMA',
    group: '16 GPU · 2 nodes',
    groups: 1,
    network: 'GPUDirect RDMA',
    scheduler: 'gang + topology-aware placement',
    verdict: '1개 distributed group 가능',
    detail: '두 node의 모든 rank가 함께 시작되고 실패도 함께 처리되어야 하나의 model execution group이 된다.',
  },
};

export function GpuTopologyLab() {
  const [scenario, setScenario] = useState<TopologyScenario>('tp8');
  const selected = TOPOLOGY_SCENARIOS[scenario];
  const blocked = selected.groups === 0;

  return (
    <LabFrame
      eyebrow="Topology packing lab"
      title="GPU 합계가 같아도 함께 계산할 수 있는 실행 그룹 수는 다르다"
      description="H100 8장씩 가진 두 node를 어떤 workload 단위로 묶는지 바꾸며, scheduler가 실제로 만들 수 있는 compatible group을 센다."
      dataAttribute="data-serving-gpu-lab"
      dataState={scenario}
      footer={<><strong className="text-foreground">물리 inventory.</strong> node A·B 각각 H100 × 8, node 내부 NVLink domain. RDMA scenario에서만 두 node 사이 GPUDirect 경로가 준비됐다고 가정한다.</>}
    >
      <ScenarioTabs
        label="GPU workload topology"
        value={scenario}
        onChange={setScenario}
        options={(Object.entries(TOPOLOGY_SCENARIOS) as Array<[TopologyScenario, (typeof TOPOLOGY_SCENARIOS)[TopologyScenario]]>).map(([value, item]) => ({ value, label: item.label }))}
      />
      <div className="grid gap-px bg-border sm:grid-cols-3">
        <Metric label="물리 GPU 합계" value="16 GPUs" detail="node A 8 + node B 8" />
        <Metric label="실행 group 요구" value={selected.group} detail={selected.scheduler} />
        <Metric label="Compatible groups" value={String(selected.groups)} tone={blocked ? 'bad' : 'good'} detail={selected.verdict} />
      </div>
      <div className="grid min-w-0 gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.85fr)]">
        <div className="relative grid grid-cols-2 gap-3">
          {['A', 'B'].map((node) => (
            <div key={node} className="border border-border p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <strong className="text-xs">GPU node {node}</strong>
                <span className="font-mono text-[11px] text-muted-foreground">8 × H100</span>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-1.5" aria-label={`node ${node} GPU inventory`}>
                {Array.from({ length: 8 }, (_, index) => (
                  <span key={index} className={`flex aspect-square items-center justify-center rounded-sm border text-[10px] font-black ${
                    blocked ? 'border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300' : 'border-violet-500/40 bg-violet-500/10 text-violet-700 dark:text-violet-300'
                  }`}>
                    {index}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <div className="col-span-2 flex min-h-11 items-center justify-center gap-2 border-y border-border text-xs font-bold">
            {scenario === 'tp16-rdma' ? <Cable className="h-4 w-4 text-emerald-600" /> : scenario === 'tp16-no-rdma' ? <ShieldAlert className="h-4 w-4 text-rose-600" /> : <Network className="h-4 w-4 text-muted-foreground" />}
            {selected.network}
          </div>
        </div>
        <div className="border-y border-border py-5">
          <Boxes className={`h-6 w-6 ${blocked ? 'text-rose-600' : 'text-emerald-600'}`} aria-hidden="true" />
          <p className="mt-4 text-xs font-bold">Packing result</p>
          <p className={`mt-2 text-xl font-black ${blocked ? 'text-rose-700 dark:text-rose-300' : 'text-emerald-700 dark:text-emerald-300'}`}>{selected.verdict}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{selected.detail}</p>
        </div>
      </div>
    </LabFrame>
  );
}

type GatewayScenario = 'pretoken' | 'midstream' | 'capability' | 'storm';

const GATEWAY_SCENARIOS: Record<GatewayScenario, {
  label: string;
  original: number;
  attempts: number;
  output: string;
  risk: string;
  decision: string;
  cost: string;
  icon: LucideIcon;
}> = {
  pretoken: {
    label: '첫 token 전 timeout',
    original: 800,
    attempts: 880,
    output: '아직 client output 없음',
    risk: '10%를 한 번 backoff retry',
    decision: '동일 capability endpoint로 제한 retry',
    cost: '실패 attempt 과금 확인',
    icon: TimerReset,
  },
  midstream: {
    label: 'Streaming 중단',
    original: 800,
    attempts: 800,
    output: '부분 token이 이미 전달됨',
    risk: '투명 재시도 시 중복·문맥 단절',
    decision: 'stream error를 명시하고 client가 재개 결정',
    cost: '부분 생성 token 비용',
    icon: TriangleAlert,
  },
  capability: {
    label: 'Tool capability 불일치',
    original: 800,
    attempts: 800,
    output: 'primary 후보에서 제외',
    risk: '10%를 호환 fallback으로 route',
    decision: 'retry가 아니라 capability fallback',
    cost: '$0.0026 / request',
    icon: Route,
  },
  storm: {
    label: '30%가 두 번 retry',
    original: 800,
    attempts: 1280,
    output: 'ingress는 그대로 800',
    risk: '+60% backend load',
    decision: 'retry budget 축소 + cooldown',
    cost: 'attempt 증폭 비용',
    icon: RefreshCw,
  },
};

export function GatewayAttemptLab() {
  const [scenario, setScenario] = useState<GatewayScenario>('pretoken');
  const selected = GATEWAY_SCENARIOS[scenario];
  const amplification = useMemo(() => selected.attempts / selected.original, [selected]);
  const Icon = selected.icon;

  return (
    <LabFrame
      eyebrow="Attempt lineage lab"
      title="원 요청 수와 backend attempt 수, 이미 전달된 output을 따로 센다"
      description="실패 위치를 바꾸면 retry 가능 경계, 실제 부하, fallback 의미와 client가 받아야 할 결과가 달라진다."
      dataAttribute="data-serving-gateway-lab"
      dataState={scenario}
      footer={<><strong className="text-foreground">중요한 경계.</strong> Mid-stream 재시도 위험은 streaming protocol과 client 동작에 따른 engineering inference다. Gateway 제품 문서의 retry 기능이 부분 출력 뒤의 안전한 재개를 자동 보장한다는 뜻이 아니다.</>}
    >
      <ScenarioTabs
        label="Gateway failure position"
        value={scenario}
        onChange={setScenario}
        options={(Object.entries(GATEWAY_SCENARIOS) as Array<[GatewayScenario, (typeof GATEWAY_SCENARIOS)[GatewayScenario]]>).map(([value, item]) => ({ value, label: item.label }))}
      />
      <div className="grid gap-px bg-border sm:grid-cols-3">
        <Metric label="원 request" value={`${selected.original} / min`} />
        <Metric label="실제 backend attempt" value={`${selected.attempts} / min`} tone={amplification > 1.2 ? 'bad' : amplification > 1 ? 'warn' : 'good'} />
        <Metric label="Attempt amplification" value={`${amplification.toFixed(2)}×`} tone={amplification > 1.2 ? 'bad' : amplification > 1 ? 'warn' : 'good'} />
      </div>
      <div className="grid min-w-0 gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,1.35fr)]">
        <div className="border-y border-border py-5">
          <Icon className={`h-6 w-6 ${scenario === 'midstream' || scenario === 'storm' ? 'text-rose-600' : 'text-sky-700 dark:text-sky-300'}`} aria-hidden="true" />
          <p className="mt-4 text-xs font-bold">Output boundary</p>
          <p className="mt-2 text-sm font-semibold leading-relaxed">{selected.output}</p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{selected.risk}</p>
        </div>
        <div className="divide-y divide-border border-y border-border">
          <div className="grid gap-2 py-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
            <strong className="text-xs">Route decision</strong>
            <p className="text-sm leading-relaxed text-muted-foreground">{selected.decision}</p>
          </div>
          <div className="grid gap-2 py-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
            <strong className="text-xs">비용 장부</strong>
            <p className="text-sm leading-relaxed text-muted-foreground">{selected.cost}</p>
          </div>
          <div className="grid gap-2 py-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
            <strong className="text-xs">필수 trace</strong>
            <p className="break-words font-mono text-xs leading-relaxed text-muted-foreground">request_id → attempt_id[] → route_reason → release_id</p>
          </div>
        </div>
      </div>
    </LabFrame>
  );
}

type LatencySurfaceScenario = 'queue' | 'tail' | 'missing';

const LATENCY_SURFACE_SCENARIOS: Record<LatencySurfaceScenario, {
  label: string;
  events: string[];
  surfaces: Array<{ label: string; value: string; detail: string; tone: 'good' | 'warn' | 'bad' | 'neutral' }>;
  conclusion: string;
}> = {
  queue: {
    label: 'Queue 1.2초',
    events: ['arrival 0 ms', 'scheduled 1,200 ms', 'first token 1,400 ms', 'final token 2,200 ms'],
    surfaces: [
      { label: 'Frontend TTFT', value: '1.40 s', detail: 'arrival → first token', tone: 'bad' },
      { label: 'Response TTFT', value: '0.20 s', detail: 'scheduled → first token', tone: 'good' },
      { label: 'Queue duration', value: '1.20 s', detail: 'arrival → scheduled', tone: 'bad' },
      { label: 'ITL p99', value: '55 ms', detail: 'token gap tail · 안정', tone: 'good' },
    ],
    conclusion: '1.4초와 0.2초는 모순이 아니다. 서로 다른 clock surface이며, 이 fixture는 decode보다 queue를 먼저 조사한다.',
  },
  tail: {
    label: 'Token gap tail',
    events: ['arrival 0 ms', 'scheduled 90 ms', 'first token 290 ms', '한 token gap 2,000 ms'],
    surfaces: [
      { label: 'Frontend TTFT', value: '0.29 s', detail: 'arrival → first token', tone: 'good' },
      { label: 'Mean TPOT', value: '45 ms', detail: '요청별 평균', tone: 'good' },
      { label: 'Waiting gauge', value: '18', detail: 'scrape 순간 backlog', tone: 'good' },
      { label: 'ITL p99', value: '2.00 s', detail: '일부 token stall', tone: 'bad' },
    ],
    conclusion: '평균 TPOT가 안정적이어도 긴 token stall은 존재한다. ITL tail이 악화됐으므로 decode를 가설에서 제거하면 안 된다.',
  },
  missing: {
    label: 'Per-request missing',
    events: ['n=2 parallel sampling', 'streaming final usage 없음', 'aggregate histogram은 존재', 'response metrics는 null'],
    surfaces: [
      { label: 'Frontend TTFT', value: '집계 가능', detail: 'server histogram', tone: 'neutral' },
      { label: 'Response TTFT', value: 'missing', detail: '0 ms가 아님', tone: 'warn' },
      { label: 'Queue duration', value: 'missing', detail: 'attribution 불가', tone: 'warn' },
      { label: 'Mean ITL', value: 'missing', detail: 'good으로 세지 않음', tone: 'warn' },
    ],
    conclusion: 'Missing을 0이나 success로 채우면 cohort가 인위적으로 빨라진다. 별도 missing ratio를 기록하고 release 비교에서 판정 불가로 둔다.',
  },
};

export function LatencySurfaceLab() {
  const [scenario, setScenario] = useState<LatencySurfaceScenario>('queue');
  const selected = LATENCY_SURFACE_SCENARIOS[scenario];

  return (
    <LabFrame
      eyebrow="Latency clock lab"
      title="같은 TTFT라는 이름도 시작 event와 집계 surface가 다를 수 있다"
      description="시나리오를 바꾸며 frontend aggregate, per-request timing, queue snapshot과 token-gap tail을 분리한다."
      dataAttribute="data-observability-latency-lab"
      dataState={scenario}
      footer={<><strong className="text-foreground">금지된 추론.</strong> 이름이 같다는 이유로 단위와 시작 event가 다른 series를 직접 비교하거나, missing timing을 0으로 채우지 않는다.</>}
    >
      <ScenarioTabs
        label="Latency clock scenario"
        value={scenario}
        onChange={setScenario}
        options={(Object.entries(LATENCY_SURFACE_SCENARIOS) as Array<[LatencySurfaceScenario, (typeof LATENCY_SURFACE_SCENARIOS)[LatencySurfaceScenario]]>).map(([value, item]) => ({ value, label: item.label }))}
      />
      <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        {selected.surfaces.map((surface) => (
          <Metric
            key={surface.label}
            label={surface.label}
            value={surface.value}
            detail={surface.detail}
            tone={surface.tone}
          />
        ))}
      </div>
      <div className="grid min-w-0 gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="border-y border-border py-4">
          <p className="text-[11px] font-bold text-muted-foreground">EVENT LEDGER</p>
          <div className="mt-3 divide-y divide-border">
            {selected.events.map((event, index) => (
              <div key={event} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-2 py-2.5">
                <span className="font-mono text-xs font-black text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                <code className="break-words text-xs">{event}</code>
              </div>
            ))}
          </div>
        </div>
        <div className="flex min-w-0 items-center border-y border-border py-5">
          <div>
            <p className="text-[11px] font-bold text-muted-foreground">READING</p>
            <p className="mt-3 text-sm font-semibold leading-relaxed">{selected.conclusion}</p>
          </div>
        </div>
      </div>
    </LabFrame>
  );
}

type ObservabilityScenario = 'capacity' | 'retry' | 'decode' | 'device';

const OBSERVABILITY_SCENARIOS: Record<ObservabilityScenario, {
  label: string;
  metrics: [
    { value: string; detail: string; tone: 'good' | 'warn' | 'bad' },
    { value: string; detail: string; tone: 'good' | 'warn' | 'bad' },
    { value: string; detail: string; tone: 'good' | 'warn' | 'bad' },
    { value: string; detail: string; tone: 'good' | 'warn' | 'bad' },
  ];
  evidence: string;
  counterevidence: string;
  owner: string;
  identity: string;
  precondition: string;
  action: string;
  actionKey: string;
  expected: string;
  undo: string;
  burn: string;
}> = {
  capacity: {
    label: 'Ready capacity 부족',
    metrics: [
      { value: '1.40 s', detail: 'TTFT p95', tone: 'bad' },
      { value: '55 ms', detail: 'ITL p99 · 안정', tone: 'good' },
      { value: '96', detail: 'waiting request', tone: 'bad' },
      { value: '1.02×', detail: 'attempt / request', tone: 'good' },
    ],
    evidence: '2 Pending · 1 warmup 중 · Ready endpoint 5/8',
    counterevidence: 'ITL tail과 attempt가 안정적이어서 decode·retry를 먼저 고칠 근거가 약하다.',
    owner: 'Fleet / admission',
    identity: 'route=chat · release=r43 · claim=gpu-06',
    precondition: 'route generation=18 · controller lease=free · old pool warm',
    action: 'canary 확대를 멈추고 검증된 old pool weight를 100%로 고정한다.',
    actionKey: 'inc-742:route-r43:g18',
    expected: 'waiting ↓ → TTFT ↓, attempt와 request cost는 유지',
    undo: '10분 안에 Ready capacity가 늘지 않으면 scale 요청을 취소하고 claim·device health를 다시 조사한다.',
    burn: '5m 4.2× · 1h 2.1×',
  },
  retry: {
    label: 'Gateway retry storm',
    metrics: [
      { value: '1.18 s', detail: 'TTFT p95', tone: 'bad' },
      { value: '57 ms', detail: 'ITL p99 · 안정', tone: 'good' },
      { value: '71', detail: 'waiting request', tone: 'bad' },
      { value: '1.60×', detail: 'attempt / request', tone: 'bad' },
    ],
    evidence: 'Ingress 800/min은 그대로인데 backend attempt만 1,280/min으로 증가',
    counterevidence: 'Pod Ready 수와 device health가 유지되어 물리 capacity 상실이 첫 원인은 아니다.',
    owner: 'Gateway policy',
    identity: 'request_id → attempt_id[] · route_reason=retry',
    precondition: 'policy generation=31 · retry executor lease=free',
    action: 'retry budget을 1회로 낮추고 실패 endpoint를 cooldown 상태로 전환한다.',
    actionKey: 'inc-743:retry-policy:g31',
    expected: 'attempt/request ↓ → queue ↓ → TTFT ↓, 첫 시도 성공률은 별도 확인',
    undo: '첫 시도 성공률이 회복되지 않고 logical success만 더 떨어지면 정책을 원복하고 backend 오류를 격리한다.',
    burn: '5m 6.8× · 1h 1.4×',
  },
  decode: {
    label: 'Decode release 회귀',
    metrics: [
      { value: '1.05 s', detail: 'TTFT p95', tone: 'warn' },
      { value: '910 ms', detail: 'ITL p99', tone: 'bad' },
      { value: '18', detail: 'waiting request · 안정', tone: 'good' },
      { value: '1.00×', detail: 'attempt / request', tone: 'good' },
    ],
    evidence: 'ITL tail·preemption이 r43에서만 상승하고 r42 control은 안정',
    counterevidence: 'Queue와 retry가 안정적이어서 admission·gateway 가설은 뒤로 간다.',
    owner: 'Runtime / release',
    identity: 'release_id=r43 · engine_config=ec9',
    precondition: 'route generation=9 · r42 rollback capacity reserved',
    action: 'r43 weight를 0%로 고정하고 in-flight request를 drain한 뒤 r42로 되돌린다.',
    actionKey: 'inc-744:release-r43:g09',
    expected: 'ITL tail ↓, preemption ↓, queue와 attempt는 변화 없음',
    undo: 'r42에서도 ITL tail이 같으면 rollback 효과를 부정하고 workload·GPU clock evidence를 조사한다.',
    burn: '5m 3.6× · 1h 3.1×',
  },
  device: {
    label: '할당 GPU health 상실',
    metrics: [
      { value: '2.10 s', detail: 'TTFT p95', tone: 'bad' },
      { value: '760 ms', detail: 'ITL p99', tone: 'bad' },
      { value: '54', detail: 'waiting request', tone: 'bad' },
      { value: '1.08×', detail: 'attempt / request', tone: 'warn' },
    ],
    evidence: 'Node Ready이지만 할당 device에서 XID·health error, PodResources identity 일치',
    counterevidence: 'Node Ready는 kubelet 경로를 뜻할 뿐 이미 할당된 GPU의 정상 실행을 보장하지 않는다.',
    owner: 'GPU node operations',
    identity: 'pod_uid=p-81 · device_uuid=GPU-06',
    precondition: 'node resourceVersion=604 · replacement capacity reserved',
    action: '새 배치를 막고 해당 workload를 drain한 뒤 device를 unhealthy inventory로 격리한다.',
    actionKey: 'inc-745:device-GPU-06:g04',
    expected: 'device error 증가 중단, replacement Ready ↑, TTFT·ITL 회복',
    undo: 'replacement에서도 같은 XID가 나타나면 단일 device 가설을 폐기하고 driver·host 범위로 확대한다.',
    burn: '5m 8.4× · 1h 2.8×',
  },
};

export function ObservabilityRecoveryLab() {
  const [scenario, setScenario] = useState<ObservabilityScenario>('capacity');
  const selected = OBSERVABILITY_SCENARIOS[scenario];

  return (
    <LabFrame
      eyebrow="Causal recovery lab"
      title="비슷한 TTFT 경보도 분리 증거가 다르면 조치와 검증 지표가 달라진다"
      description="장애 시나리오를 바꿔 증상, 반증, 소유 제어면과 되돌릴 수 있는 조치를 한 장부에서 비교한다."
      dataAttribute="data-observability-recovery-lab"
      dataState={scenario}
      footer={<><strong className="text-foreground">종료 조건.</strong> 사용자 SLI가 회복되고 예상한 내부 지표가 같은 방향으로 움직이며 retry·cost 같은 숨은 부작용이 늘지 않아야 복구로 인정한다.</>}
    >
      <ScenarioTabs
        label="관측성과 복구 시나리오"
        value={scenario}
        onChange={setScenario}
        options={(Object.entries(OBSERVABILITY_SCENARIOS) as Array<[ObservabilityScenario, (typeof OBSERVABILITY_SCENARIOS)[ObservabilityScenario]]>).map(([value, item]) => ({ value, label: item.label }))}
      />
      <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        {selected.metrics.map((metric) => (
          <Metric
            key={metric.detail}
            label={metric.detail}
            value={metric.value}
            tone={metric.tone}
          />
        ))}
      </div>
      <div className="grid min-w-0 gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="min-w-0 border-y border-border">
          <div className="grid gap-2 py-4 sm:grid-cols-[6.5rem_minmax(0,1fr)]">
            <strong className="text-xs">5m · 1h burn</strong>
            <p className="font-mono text-sm font-black tabular-nums text-rose-700 dark:text-rose-300">{selected.burn}</p>
          </div>
          <div className="grid gap-2 border-t border-border py-4 sm:grid-cols-[6.5rem_minmax(0,1fr)]">
            <strong className="text-xs">가르는 증거</strong>
            <p className="text-sm leading-relaxed text-foreground">{selected.evidence}</p>
          </div>
          <div className="grid gap-2 border-t border-border py-4 sm:grid-cols-[6.5rem_minmax(0,1fr)]">
            <strong className="text-xs">반증</strong>
            <p className="text-sm leading-relaxed text-muted-foreground">{selected.counterevidence}</p>
          </div>
          <div className="grid gap-2 border-t border-border py-4 sm:grid-cols-[6.5rem_minmax(0,1fr)]">
            <strong className="text-xs">첫 소유자</strong>
            <p className="text-sm font-bold">{selected.owner}</p>
          </div>
        </div>
        <div className="min-w-0 border-y border-border">
          <div className="py-4">
            <p className="text-[11px] font-bold text-muted-foreground">CORRELATION IDENTITY</p>
            <code className="mt-2 block break-words text-xs leading-relaxed">{selected.identity}</code>
          </div>
          <div className="border-t border-border py-4">
            <p className="text-[11px] font-bold text-muted-foreground">PRECONDITION · LEASE</p>
            <code className="mt-2 block break-words text-xs text-muted-foreground">{selected.precondition}</code>
          </div>
          <div className="border-t border-border py-4">
            <p className="text-[11px] font-bold text-muted-foreground">ABSOLUTE ACTION · IDEMPOTENCY KEY</p>
            <p className="mt-2 text-sm font-semibold leading-relaxed">{selected.action}</p>
            <code className="mt-2 block break-words text-xs text-muted-foreground">{selected.actionKey}</code>
          </div>
          <div className="border-t border-border py-4">
            <p className="text-[11px] font-bold text-muted-foreground">EXPECTED DIRECTION</p>
            <p className="mt-2 text-sm leading-relaxed text-emerald-700 dark:text-emerald-300">{selected.expected}</p>
          </div>
          <div className="border-t border-border py-4">
            <p className="text-[11px] font-bold text-muted-foreground">UNDO / NEXT HYPOTHESIS</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{selected.undo}</p>
          </div>
        </div>
      </div>
      <div className="grid gap-px border-t border-border bg-border sm:grid-cols-5">
        {[
          ['01', 'Detected', '사용자 SLI 위반'],
          ['02', 'Reserved', 'CAS · lease 확보'],
          ['03', 'Applied', '목표 상태 제출'],
          ['04', 'Observing', 'warm 뒤 표본 수집'],
          ['05', 'Closed / undo', '검증 또는 원복 검증'],
        ].map(([number, label, detail]) => (
          <div key={number} className="min-w-0 bg-muted/15 p-3 sm:p-4">
            <span className="font-mono text-[11px] font-black text-muted-foreground">{number}</span>
            <p className="mt-2 text-xs font-bold">{label}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{detail}</p>
          </div>
        ))}
      </div>
    </LabFrame>
  );
}

export function CostSignal({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <CircleDollarSign className="h-4 w-4 shrink-0" aria-hidden="true" />
      {children}
    </span>
  );
}
