import { useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Activity,
  ArrowDown,
  ArrowRight,
  Check,
  CircleAlert,
  Cpu,
  Gauge,
  Layers3,
  MemoryStick,
  Network,
  Router,
  Server,
  TerminalSquare,
  Waypoints,
  Workflow,
  X,
  type LucideIcon,
} from 'lucide-react';
import StepViz from '@/components/ui/step-viz';

type Tone = 'blue' | 'teal' | 'violet' | 'amber' | 'rose' | 'neutral';

const toneClasses: Record<Tone, { icon: string; border: string; surface: string; text: string; dot: string }> = {
  blue: { icon: 'text-blue-700 dark:text-blue-300', border: 'border-blue-500/45', surface: 'bg-blue-500/8', text: 'text-blue-800 dark:text-blue-200', dot: 'bg-blue-500' },
  teal: { icon: 'text-teal-700 dark:text-teal-300', border: 'border-teal-500/45', surface: 'bg-teal-500/8', text: 'text-teal-800 dark:text-teal-200', dot: 'bg-teal-500' },
  violet: { icon: 'text-violet-700 dark:text-violet-300', border: 'border-violet-500/45', surface: 'bg-violet-500/8', text: 'text-violet-800 dark:text-violet-200', dot: 'bg-violet-500' },
  amber: { icon: 'text-amber-700 dark:text-amber-300', border: 'border-amber-500/45', surface: 'bg-amber-500/8', text: 'text-amber-800 dark:text-amber-200', dot: 'bg-amber-500' },
  rose: { icon: 'text-rose-700 dark:text-rose-300', border: 'border-rose-500/45', surface: 'bg-rose-500/8', text: 'text-rose-800 dark:text-rose-200', dot: 'bg-rose-500' },
  neutral: { icon: 'text-muted-foreground', border: 'border-border', surface: 'bg-background/70', text: 'text-foreground', dot: 'bg-muted-foreground' },
};

function Stage({ eyebrow, title, children, dataTest }: { eyebrow: string; title: string; children: ReactNode; dataTest: string }) {
  return (
    <div className="w-full min-w-0" data-testid={dataTest}>
      <div className="mb-5 flex min-w-0 items-start gap-3 border-b border-border/70 pb-4">
        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-teal-500" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase text-muted-foreground">{eyebrow}</p>
          <p className="mt-1 text-base font-bold leading-snug text-foreground sm:text-lg">{title}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function FlowNode({ icon: Icon, title, detail, tone = 'neutral', dim = false, badge }: {
  icon: LucideIcon; title: string; detail: string; tone?: Tone; dim?: boolean; badge?: string;
}) {
  const color = toneClasses[tone];
  return (
    <div className={`min-w-0 rounded-md border p-3.5 transition-opacity ${color.border} ${color.surface} ${dim ? 'opacity-40' : ''}`}>
      <div className="flex min-w-0 items-center gap-2.5">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-current/15 ${color.icon}`}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="break-words text-sm font-bold leading-tight text-foreground">{title}</p>
          {badge && <p className={`mt-1 font-mono text-xs font-bold ${color.text}`}>{badge}</p>}
        </div>
      </div>
      <p className="mt-3 break-words text-xs leading-relaxed text-muted-foreground">{detail}</p>
    </div>
  );
}

function FlowConnector({ label }: { label?: string }) {
  return (
    <div className="flex min-h-8 shrink-0 items-center justify-center text-muted-foreground" aria-hidden="true">
      <ArrowDown className="h-4 w-4 sm:hidden" />
      <div className="hidden flex-col items-center sm:flex">
        {label && <span className="mb-1 whitespace-nowrap font-mono text-xs">{label}</span>}
        <ArrowRight className="h-4 w-4" />
      </div>
    </div>
  );
}

function StatusLine({ tone, label, detail }: { tone: Tone; label: string; detail: string }) {
  const color = toneClasses[tone];
  return (
    <div className="grid min-w-0 grid-cols-[0.75rem_minmax(0,1fr)] gap-x-2.5 gap-y-1 py-2.5">
      <span className={`mt-1.5 h-2 w-2 rounded-full ${color.dot}`} aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-xs font-bold text-foreground">{label}</p>
        <p className="mt-1 break-words text-xs leading-relaxed text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}

function GpuLanes() {
  const reduced = useReducedMotion();
  return (
    <div className="grid grid-cols-8 gap-1.5" aria-label="병렬 GPU lane 32개">
      {Array.from({ length: 32 }, (_, index) => (
        <motion.span
          key={index}
          className="aspect-square min-h-3 rounded-[3px] bg-teal-500/80"
          initial={false}
          animate={reduced ? undefined : { opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1.8, delay: (index % 8) * 0.06, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

function ScaleScene({ step }: { step: number }) {
  const reduced = useReducedMotion();
  if (step === 0) {
    return (
      <Stage eyebrow="병렬화 가능성" title="먼저 계산을 동시에 나눌 수 있어야 한다" dataTest="hpc-scale-scene">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="min-w-0 border-y border-border/70 py-4 sm:border-y-0 sm:border-r sm:pr-5">
            <div className="mb-4 flex items-center gap-3">
              <Cpu className="h-5 w-5 text-blue-600 dark:text-blue-300" aria-hidden="true" />
              <div><p className="text-sm font-bold">CPU</p><p className="text-xs text-muted-foreground">적은 수의 강한 core</p></div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 8 }, (_, index) => <span key={index} className="aspect-square rounded-md border border-blue-500/45 bg-blue-500/10" />)}
            </div>
          </div>
          <div className="min-w-0 py-4 sm:pl-1">
            <div className="mb-4 flex items-center gap-3">
              <Layers3 className="h-5 w-5 text-teal-600 dark:text-teal-300" aria-hidden="true" />
              <div><p className="text-sm font-bold">GPU</p><p className="text-xs text-muted-foreground">많은 병렬 lane</p></div>
            </div>
            <GpuLanes />
          </div>
        </div>
        <p className="mt-5 border-l-2 border-teal-500/60 pl-3 text-xs leading-relaxed text-muted-foreground">같은 kernel을 많은 data 조각에 적용할 수 있을 때 GPU 수가 실제 처리량으로 바뀐다.</p>
      </Stage>
    );
  }

  if (step === 1) {
    return (
      <Stage eyebrow="Scale-up" title="한 node 안에서는 topology가 GPU 사이 거리를 정한다" dataTest="hpc-scale-scene">
        <div className="rounded-md border border-border bg-background/60 p-4">
          <div className="flex items-center justify-between gap-3 border-b border-border/70 pb-3">
            <div className="flex min-w-0 items-center gap-2"><Server className="h-4 w-4 text-blue-600" /><span className="text-sm font-bold">Node A · 하나의 OS</span></div>
            <span className="font-mono text-xs text-muted-foreground">PCIe topology</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {[0, 1, 2, 3].map((gpu) => <FlowNode key={gpu} icon={MemoryStick} title={`GPU ${gpu}`} detail="HBM · compute" tone="teal" />)}
          </div>
          <div className="mt-3 flex min-h-11 items-center justify-center rounded-md border border-violet-500/35 bg-violet-500/8 px-3 text-center text-xs font-bold text-violet-800 dark:text-violet-200">
            NVLink / NVSwitch 또는 PCIe · node 내부 경로
          </div>
        </div>
      </Stage>
    );
  }

  if (step === 2) {
    return (
      <Stage eyebrow="Scale-out" title="node를 넘는 순간 NIC와 fabric이 계산 경로에 들어온다" dataTest="hpc-scale-scene">
        <div className="grid items-stretch gap-2 sm:grid-cols-[minmax(0,1fr)_2rem_minmax(8rem,0.65fr)_2rem_minmax(0,1fr)]">
          <FlowNode icon={Server} title="Node A" detail="GPU × 4 → PCIe → RDMA NIC" tone="blue" badge="rank 0–3" />
          <FlowConnector />
          <FlowNode icon={Router} title="Fabric" detail="RoCEv2 또는 InfiniBand switch" tone="rose" badge="100G+" />
          <FlowConnector />
          <FlowNode icon={Server} title="Node B" detail="RDMA NIC → PCIe → GPU × 4" tone="blue" badge="rank 4–7" />
        </div>
        <div className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          {[
            ['GPU ↔ NIC', 'PCIe locality와 GPUDirect'],
            ['NIC ↔ switch', 'link rate와 congestion'],
            ['Application', 'collective 참여와 overlap'],
          ].map(([label, detail]) => <div key={label} className="bg-background px-3 py-3"><p className="text-xs font-bold">{label}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>)}
        </div>
      </Stage>
    );
  }

  return (
    <Stage eyebrow="Collective invariant" title="각자 다른 gradient가 끝에는 같은 합으로 바뀐다" dataTest="hpc-scale-scene">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {[0, 1, 2, 3].map((rank) => (
          <div key={rank} className="relative min-w-0 rounded-md border border-teal-500/40 bg-background p-3 text-center">
            <p className="text-sm font-bold">Rank {rank}</p>
            <motion.span
              className="mx-auto mt-3 block h-2 w-10 rounded-full bg-teal-500"
              animate={reduced ? undefined : { x: rank % 2 === 0 ? [0, 12, 0] : [0, -12, 0] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            <p className="mt-3 font-mono text-xs text-muted-foreground">g{rank} → Σg</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <StatusLine tone="violet" label="1 · Reduce-scatter" detail="gradient chunk를 돌려 각 chunk의 합을 한 rank가 완성한다." />
        <StatusLine tone="teal" label="2 · All-gather" detail="완성된 chunk를 다시 나눠 모든 rank가 같은 Σg를 갖는다." />
      </div>
    </Stage>
  );
}

export function GpuScaleViz() {
  return (
    <StepViz steps={[
      { label: '1. GPU는 같은 계산을 많은 데이터 조각에 병렬 적용한다.', body: 'HPC의 출발점은 GPU 개수가 아니라 병렬화 가능한 계산이다. 작업이 직렬이면 GPU를 늘려도 빨라지지 않는다.' },
      { label: '2. 한 서버 안에서는 PCIe와 NVLink/NVSwitch가 GPU를 묶는다.', body: '같은 OS 아래의 GPU도 topology에 따라 통신 속도가 다르다. node 내부 확장을 scale-up이라고 부른다.' },
      { label: '3. 서버를 넘으면 NIC와 switch fabric이 필요하다.', body: 'GPU server A와 B 사이에는 NVLink가 아니라 RDMA NIC와 RoCE 또는 InfiniBand fabric이 놓인다. 이 경계가 scale-out이다.' },
      { label: '4. 분산 학습은 gradient 조각을 반복해서 합친다.', body: 'Ring all-reduce는 reduce-scatter와 all-gather를 수행한다. 모든 rank는 마지막에 같은 합을 가진다.' },
    ]}>
      {(step) => <ScaleScene step={step} />}
    </StepViz>
  );
}

function SocketPipeline() {
  const items = [
    { icon: MemoryStick, title: 'GPU A', detail: 'source tensor', tone: 'teal' as Tone },
    { icon: Cpu, title: 'Host path', detail: 'RAM copy · kernel stack', tone: 'blue' as Tone },
    { icon: Network, title: 'NIC + fabric', detail: 'socket packet', tone: 'amber' as Tone },
    { icon: Cpu, title: 'Host path', detail: 'kernel stack · RAM copy', tone: 'blue' as Tone },
    { icon: MemoryStick, title: 'GPU B', detail: 'destination tensor', tone: 'teal' as Tone },
  ];
  return (
    <div className="grid items-stretch gap-2 sm:grid-cols-[1fr_1.5rem_1fr_1.5rem_1fr_1.5rem_1fr_1.5rem_1fr]">
      {items.map((item, index) => (
        <div key={`${item.title}-${index}`} className="contents">
          <FlowNode {...item} />
          {index < items.length - 1 && <FlowConnector label={index === 0 || index === 3 ? 'copy' : undefined} />}
        </div>
      ))}
    </div>
  );
}

function TransportScene({ step }: { step: number }) {
  if (step === 0) {
    return (
      <Stage eyebrow="Socket data path" title="호환성이 높은 대신 host copy와 kernel 처리가 경로에 남는다" dataTest="hpc-transport-scene">
        <SocketPipeline />
      </Stage>
    );
  }
  if (step === 1) {
    return (
      <Stage eyebrow="RDMA control path" title="직접 전송 전에 CPU와 driver가 안전한 길을 준비한다" dataTest="hpc-transport-scene">
        <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
          {[
            ['01', 'Memory 등록', '전송 가능한 주소와 길이를 NIC에 알린다.'],
            ['02', 'Queue 준비', 'send/receive 작업을 넣을 queue를 만든다.'],
            ['03', 'Peer 연결', 'remote key와 endpoint를 교환한다.'],
            ['04', 'Completion 확인', 'NIC가 완료한 작업을 CPU가 회수한다.'],
          ].map(([number, label, detail]) => (
            <div key={number} className="min-w-0 bg-background p-4">
              <p className="font-mono text-xs font-bold text-violet-700 dark:text-violet-300">{number}</p>
              <p className="mt-2 text-sm font-bold">{label}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">“CPU 우회”는 steady-state tensor data path의 copy를 줄인다는 뜻이지 control path가 사라진다는 뜻이 아니다.</p>
      </Stage>
    );
  }
  if (step === 2) {
    return (
      <Stage eyebrow="GPUDirect RDMA" title="등록이 끝나면 NIC DMA가 GPU memory 사이의 host copy를 줄인다" dataTest="hpc-transport-scene">
        <div className="grid items-stretch gap-2 sm:grid-cols-[1fr_1.5rem_1fr_1.5rem_1fr_1.5rem_1fr_1.5rem_1fr]">
          <FlowNode icon={MemoryStick} title="GPU A" detail="registered memory" tone="teal" />
          <FlowConnector />
          <FlowNode icon={Network} title="RDMA NIC" detail="DMA engine" tone="amber" />
          <FlowConnector />
          <FlowNode icon={Router} title="Fabric" detail="RoCEv2 / InfiniBand" tone="rose" />
          <FlowConnector />
          <FlowNode icon={Network} title="RDMA NIC" detail="DMA engine" tone="amber" />
          <FlowConnector />
          <FlowNode icon={MemoryStick} title="GPU B" detail="registered memory" tone="teal" />
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <FlowNode icon={Cpu} title="Node A CPU / RAM" detail="setup과 completion에는 참여하지만 bulk tensor copy 경로에서는 빠진다." tone="blue" dim />
          <FlowNode icon={Cpu} title="Node B CPU / RAM" detail="driver와 오류 복구는 남지만 destination host staging을 줄인다." tone="blue" dim />
        </div>
      </Stage>
    );
  }
  return (
    <Stage eyebrow="Congestion control" title="빠른 link보다 queue가 무너지지 않는 운영이 먼저다" dataTest="hpc-transport-scene">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="min-w-0 rounded-md border border-border bg-background p-4">
          <div className="flex items-end gap-1.5" aria-label="혼잡해지는 switch queue">
            {[28, 36, 46, 58, 72, 88, 100, 100].map((height, index) => (
              <span key={height + index} className={`w-full rounded-t-[3px] ${index > 5 ? 'bg-rose-500' : index > 3 ? 'bg-amber-500' : 'bg-teal-500'}`} style={{ height }} />
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3 text-xs">
            <span className="font-bold">Switch queue</span><span className="font-mono text-rose-700 dark:text-rose-300">ECN marked</span>
          </div>
        </div>
        <div className="divide-y divide-border rounded-md border border-border bg-background px-3">
          <StatusLine tone="amber" label="ECN" detail="drop 전에 sender에게 rate를 낮추라고 알린다." />
          <StatusLine tone="rose" label="PFC 주의" detail="priority를 멈추지만 과하면 pause가 이웃으로 번진다." />
        </div>
      </div>
    </Stage>
  );
}

export function TransportPathViz() {
  return (
    <StepViz steps={[
      { label: '1. 일반 socket 경로는 host memory와 kernel stack을 지난다.', body: '구현과 호환성은 좋지만 copy, syscall, protocol processing이 CPU 시간과 latency를 더한다.' },
      { label: '2. RDMA도 연결 준비에는 CPU와 driver가 필요하다.', body: 'Memory region 등록, queue 생성, 권한 설정은 control path다. “CPU가 전혀 필요 없다”는 설명은 과장이다.' },
      { label: '3. 준비 뒤 data path는 NIC DMA engine이 registered memory를 직접 옮긴다.', body: 'GPUDirect RDMA가 지원되면 host RAM 복사를 줄이고 NIC가 GPU memory와 DMA한다.' },
      { label: '4. RoCEv2는 Ethernet/IP/UDP 위의 RDMA이며 혼잡 제어가 성능을 좌우한다.', body: '100G link가 있다는 사실만으로 RoCE가 되지 않는다. NIC, switch, driver, QoS와 congestion control이 맞아야 한다.' },
    ]}>
      {(step) => <TransportScene step={step} />}
    </StepViz>
  );
}

const stackRows = [
  { label: 'Job', detail: 'PyTorch / MPI application', evidence: 'tensor shape · process group · collective call', tone: 'blue' as Tone, icon: TerminalSquare },
  { label: 'Collective', detail: 'NCCL / MPI', evidence: 'algorithm · protocol · rank count', tone: 'violet' as Tone, icon: Workflow },
  { label: 'Transport', detail: 'UCX · verbs · network plugin', evidence: 'IB/RoCE 또는 Socket 선택', tone: 'teal' as Tone, icon: Waypoints },
  { label: 'Device', detail: 'GPU driver · RDMA NIC', evidence: 'DMA-BUF · HCA · PCIe locality', tone: 'amber' as Tone, icon: MemoryStick },
  { label: 'Fabric', detail: 'Ethernet/RoCEv2 · InfiniBand', evidence: 'link state · rate · loss · congestion', tone: 'rose' as Tone, icon: Router },
];

function StackScene({ step }: { step: number }) {
  const active = stackRows[step];
  return (
    <Stage eyebrow="책임 경계" title={`${active.label} 층의 입력과 증거를 분리해서 본다`} dataTest="hpc-stack-scene">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="grid gap-2">
          {stackRows.map((row, index) => {
            const Icon = row.icon;
            const color = toneClasses[row.tone];
            const selected = index === step;
            return (
              <motion.div key={row.label} initial={false} animate={{ opacity: selected ? 1 : 0.48 }} className={`grid min-w-0 grid-cols-[2.5rem_minmax(0,0.72fr)_minmax(0,1fr)] items-center gap-3 rounded-md border px-3 py-3 ${selected ? `${color.border} ${color.surface}` : 'border-border bg-background'}`}>
                <Icon className={`h-4 w-4 ${selected ? color.icon : 'text-muted-foreground'}`} aria-hidden="true" />
                <div className="min-w-0"><p className="text-xs font-bold text-foreground">{row.label}</p><p className="mt-1 break-words text-xs text-muted-foreground">{row.detail}</p></div>
                <p className="min-w-0 break-words border-l border-border pl-3 text-xs leading-relaxed text-muted-foreground">{row.evidence}</p>
              </motion.div>
            );
          })}
        </div>
        <div className="min-w-0 rounded-md border border-border bg-background p-4">
          <div className="flex items-center gap-2"><Gauge className="h-4 w-4 text-blue-600" /><p className="text-sm font-bold">Scheduler boundary</p></div>
          <p className="mt-2 font-mono text-xs text-muted-foreground">Slurm / Kubernetes</p>
          <div className="mt-4 divide-y divide-border">
            <StatusLine tone="teal" label="하는 일" detail="GPU와 node를 함께 배정하고 queue, quota, retry를 관리한다." />
            <StatusLine tone="rose" label="하지 않는 일" detail="RDMA packet을 옮기거나 all-reduce 결과를 계산하지 않는다." />
          </div>
        </div>
      </div>
    </Stage>
  );
}

export function HpcStackViz() {
  return (
    <StepViz steps={[
      { label: '1. Application은 무엇을 계산할지 정의한다.', body: 'PyTorch Distributed나 MPI program이 tensor와 process group, collective 호출을 만든다.' },
      { label: '2. NCCL과 MPI는 collective algorithm을 실행한다.', body: 'Ring, tree 같은 경로를 topology와 message size에 맞춰 고른다.' },
      { label: '3. UCX와 verbs layer가 RDMA transport를 노출한다.', body: 'RoCEv2 또는 InfiniBand 장치를 queue와 registered memory로 사용할 수 있게 연결한다.' },
      { label: '4. NIC와 driver가 DMA를 처리한다.', body: 'Hardware offload가 실제 data movement를 수행한다. GPU와 NIC의 PCIe topology도 영향을 준다.' },
      { label: '5. Fabric은 packet을 전달하고 congestion을 제어한다.', body: 'Scheduler는 옆에서 자원을 배정한다. 통신 성능은 application부터 switch까지 전체 stack이 맞아야 나온다.' },
    ]}>
      {(step) => <StackScene step={step} />}
    </StepViz>
  );
}

type Scenario = 'healthy' | 'socket' | 'missing';

const scenarioCopy: Record<Scenario, { label: string; tone: Tone; summary: string }> = {
  healthy: { label: '정상 RDMA', tone: 'teal', summary: '8개 rank와 IB/RoCE transport가 모두 증명된다.' },
  socket: { label: 'Socket fallback', tone: 'amber', summary: '정답은 맞아도 의도한 RDMA 성능 계약은 실패다.' },
  missing: { label: 'Rank 누락', tone: 'rose', summary: 'world size가 완성되지 않아 communicator가 시작하지 못한다.' },
};

function RankGrid({ scenario, binding = false }: { scenario: Scenario; binding?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {Array.from({ length: 8 }, (_, rank) => {
        const missing = scenario === 'missing' && rank === 7;
        return (
          <div key={rank} className={`min-w-0 rounded-md border px-3 py-3 ${missing ? 'border-dashed border-rose-500/60 bg-rose-500/8' : 'border-border bg-background'}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold">RANK {rank}</span>
              {missing ? <X className="h-4 w-4 text-rose-600" /> : <Check className="h-4 w-4 text-teal-600" />}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Node {rank < 4 ? 'A' : 'B'}</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">{binding ? `LOCAL_RANK=${rank % 4} → GPU ${rank % 4}` : missing ? 'not joined' : 'joined'}</p>
          </div>
        );
      })}
    </div>
  );
}

function JobTraceScene({ step, scenario }: { step: number; scenario: Scenario }) {
  const state = scenarioCopy[scenario];
  if (step === 0) {
    return (
      <Stage eyebrow="01 · Gang allocation" title="두 node와 GPU 8개를 한 작업의 시작 조건으로 묶는다" dataTest="hpc-job-scene">
        <div className="grid gap-3 sm:grid-cols-2">
          {['Node A', 'Node B'].map((node, nodeIndex) => (
            <div key={node} className="rounded-md border border-border bg-background p-4">
              <div className="flex items-center gap-2"><Server className="h-4 w-4 text-blue-600" /><p className="text-sm font-bold">{node}</p></div>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((gpu) => {
                  const missing = scenario === 'missing' && nodeIndex === 1 && gpu === 3;
                  return <div key={gpu} className={`flex min-h-12 items-center justify-center rounded-md border font-mono text-xs font-bold ${missing ? 'border-dashed border-rose-500 text-rose-700 dark:text-rose-300' : 'border-teal-500/40 bg-teal-500/8 text-teal-800 dark:text-teal-200'}`}>{missing ? '빈 슬롯' : `GPU ${gpu}`}</div>;
                })}
              </div>
            </div>
          ))}
        </div>
        <StatusLine tone={scenario === 'missing' ? 'rose' : 'teal'} label={scenario === 'missing' ? '대기' : '할당 완료'} detail={scenario === 'missing' ? '한 slot이 없으므로 나머지 worker도 먼저 시작시키지 않는 gang scheduling이 필요하다.' : '모든 worker를 함께 시작할 resource가 확보됐다.'} />
      </Stage>
    );
  }
  if (step === 1) {
    return (
      <Stage eyebrow="02 · Rendezvous" title="같은 job id를 가진 worker가 world membership을 완성한다" dataTest="hpc-job-scene">
        <div className="mb-4 grid gap-3 rounded-md border border-violet-500/35 bg-violet-500/8 p-4 sm:grid-cols-3">
          <div><p className="text-xs text-muted-foreground">Endpoint</p><p className="mt-1 font-mono text-xs font-bold">node-a:29400</p></div>
          <div><p className="text-xs text-muted-foreground">Job id</p><p className="mt-1 font-mono text-xs font-bold">train-042</p></div>
          <div><p className="text-xs text-muted-foreground">Expected</p><p className="mt-1 font-mono text-xs font-bold">WORLD_SIZE=8</p></div>
        </div>
        <RankGrid scenario={scenario} />
      </Stage>
    );
  }
  if (step === 2) {
    return (
      <Stage eyebrow="03 · Device binding" title="전역 rank와 node 안 GPU 번호를 섞지 않는다" dataTest="hpc-job-scene">
        <RankGrid scenario={scenario} binding />
        <p className="mt-4 border-l-2 border-blue-500/60 pl-3 text-xs leading-relaxed text-muted-foreground">`RANK`는 worker group 전체의 번호이고 `LOCAL_RANK`는 한 node 안에서 process가 사용할 GPU 번호다.</p>
      </Stage>
    );
  }
  if (step === 3) {
    const transport = scenario === 'healthy' ? 'NET/IB' : scenario === 'socket' ? 'NET/Socket' : 'communicator pending';
    return (
      <Stage eyebrow="04 · Communicator + transport" title="작동 여부와 의도한 data path 사용 여부를 따로 증명한다" dataTest="hpc-job-scene">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_15rem]">
          <div className="grid items-stretch gap-2 sm:grid-cols-[1fr_1.5rem_1fr_1.5rem_1fr]">
            <FlowNode icon={MemoryStick} title="GPU ranks" detail={scenario === 'missing' ? '7 / 8 joined' : '8 / 8 joined'} tone={scenario === 'missing' ? 'rose' : 'teal'} />
            <FlowConnector />
            <FlowNode icon={Network} title="NCCL network" detail={transport} tone={state.tone} badge={scenario === 'healthy' ? 'RDMA selected' : scenario === 'socket' ? 'fallback' : 'not ready'} />
            <FlowConnector />
            <FlowNode icon={Activity} title="All-reduce" detail={scenario === 'missing' ? 'not launched' : 'correctness probe'} tone={scenario === 'missing' ? 'neutral' : 'violet'} />
          </div>
          <div className="rounded-md border border-border bg-background p-4">
            <p className="font-mono text-xs font-bold">NCCL_DEBUG=INFO</p>
            <p className={`mt-3 break-words font-mono text-xs leading-relaxed ${toneClasses[state.tone].text}`}>{scenario === 'healthy' ? 'Using network IB\nDMA-BUF available' : scenario === 'socket' ? 'via NET/Socket/0\nIB plugin not selected' : 'Init START\nwaiting for rank 7'}</p>
          </div>
        </div>
      </Stage>
    );
  }
  const checks = [
    { label: '8 / 8 ranks joined', state: scenario === 'missing' ? 'fail' : 'pass' },
    { label: 'rank ↔ GPU binding unique', state: scenario === 'missing' ? 'skip' : 'pass' },
    { label: 'RDMA transport selected', state: scenario === 'healthy' ? 'pass' : scenario === 'socket' ? 'warn' : 'skip' },
    { label: 'all-reduce same result', state: scenario === 'missing' ? 'skip' : 'pass' },
    { label: 'bandwidth/latency baseline', state: scenario === 'healthy' ? 'pass' : scenario === 'socket' ? 'warn' : 'skip' },
  ];
  return (
    <Stage eyebrow="05 · Execution receipt" title="‘돌았다’가 아니라 어떤 계약이 통과했는지 남긴다" dataTest="hpc-job-scene">
      <div className="overflow-hidden rounded-md border border-border bg-background">
        {checks.map((check, index) => {
          const tone: Tone = check.state === 'pass' ? 'teal' : check.state === 'warn' ? 'amber' : check.state === 'fail' ? 'rose' : 'neutral';
          const Icon = check.state === 'pass' ? Check : check.state === 'warn' ? CircleAlert : check.state === 'fail' ? X : ArrowRight;
          return (
            <div key={check.label} className={`flex min-h-12 items-center gap-3 px-4 ${index > 0 ? 'border-t border-border' : ''}`}>
              <Icon className={`h-4 w-4 shrink-0 ${toneClasses[tone].icon}`} aria-hidden="true" />
              <p className="min-w-0 flex-1 break-words text-xs font-medium text-foreground">{check.label}</p>
              <span className={`font-mono text-xs font-bold uppercase ${toneClasses[tone].text}`}>{check.state}</span>
            </div>
          );
        })}
      </div>
      <p className={`mt-4 text-xs font-bold ${toneClasses[state.tone].text}`}>{state.summary}</p>
    </Stage>
  );
}

export function MultiNodeJobViz() {
  const [scenario, setScenario] = useState<Scenario>('healthy');
  return (
    <div className="my-10 scroll-mt-20" data-hpc-multinode-viz>
      <div className="mb-3 grid grid-cols-3 gap-1 rounded-md border border-border bg-muted/30 p-1" aria-label="멀티노드 실행 시나리오">
        {(Object.keys(scenarioCopy) as Scenario[]).map((key) => {
          const item = scenarioCopy[key];
          return (
            <button
              key={key}
              type="button"
              onClick={() => setScenario(key)}
              aria-pressed={scenario === key}
              className={`min-h-11 min-w-0 rounded-[4px] px-2 py-2 text-xs font-bold leading-tight transition-colors ${scenario === key ? `${toneClasses[item.tone].surface} ${toneClasses[item.tone].text} shadow-sm` : 'text-muted-foreground hover:bg-background hover:text-foreground'}`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <StepViz steps={[
        { label: '1. Scheduler가 두 node와 GPU 8개를 한꺼번에 확보한다.', body: '일부 worker만 먼저 실행하면 rendezvous에서 기다리며 자원을 낭비한다. Multi-node job에는 gang scheduling이 중요한 이유다.' },
        { label: '2. 모든 worker가 같은 rendezvous에 모여 world를 완성한다.', body: 'RANK는 worker의 전역 번호, WORLD_SIZE는 collective에 참여할 전체 worker 수다. 한 rank가 빠지면 같은 collective를 만들 수 없다.' },
        { label: '3. 각 process는 LOCAL_RANK에 해당하는 GPU 하나를 사용한다.', body: 'LOCAL_RANK는 node 안에서만 0부터 다시 시작한다. 두 process가 같은 GPU를 잡지 않도록 launcher와 training code가 같은 계약을 써야 한다.' },
        { label: '4. NCCL communicator가 완성되고 실제 network transport가 선택된다.', body: '정답이 맞는 것과 RDMA 경로를 쓴 것은 다른 증거다. NCCL log에서 IB/RoCE, Socket fallback, topology와 algorithm 선택을 확인한다.' },
        { label: '5. Rank, binding, transport, correctness와 성능을 하나의 receipt로 남긴다.', body: '이 기록이 있어야 model regression과 fabric regression을 구분하고, 다음 변경 전후를 비교할 수 있다.' },
      ]}>
        {(step) => <JobTraceScene step={step} scenario={scenario} />}
      </StepViz>
    </div>
  );
}
