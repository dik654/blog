import StepViz from "@/components/ui/step-viz";

const PIPELINE_STEPS = [
  {
    label: "HBM에는 A·B 원본 tile이 있다",
    tabLabel: "원본 tile",
    body: "예시는 한 thread block이 계산할 A·B tile 하나입니다. 아직 Tensor Core가 바로 읽을 수 있는 가까운 작업대에는 올라오지 않았습니다.",
  },
  {
    label: "Producer thread 하나가 TMA 복사를 발행한다",
    tabLabel: "TMA 발행",
    body: "Tensor map이 차원·stride·tile 좌표를 들고 있으므로 여러 thread가 원소마다 주소를 계산하는 일을 줄입니다. 발행한 thread도 복사 완료를 기다리며 멈출 필요가 없습니다.",
  },
  {
    label: "Transaction barrier가 tile 도착을 알린다",
    tabLabel: "도착 확인",
    body: "TMA가 shared memory에 약속한 byte를 쓰면 barrier 상태가 진행됩니다. Consumer는 이 신호를 확인한 뒤에만 tile을 읽습니다.",
  },
  {
    label: "네 warp의 warpgroup이 WGMMA를 발행한다",
    tabLabel: "WGMMA",
    body: "128개 thread가 함께 shared-memory descriptor가 가리키는 operand를 읽고 비동기 행렬곱을 시작합니다. B는 shared memory에서 오며 A도 보통 이 예시처럼 shared memory에서 옵니다.",
  },
  {
    label: "결과는 warpgroup의 register accumulator에 쌓인다",
    tabLabel: "결과·다음 tile",
    body: "현재 tile을 계산하는 동안 다른 buffer에는 다음 tile을 가져올 수 있습니다. 겹침이 성립할 때만 copy+compute의 합이 아니라 둘 중 느린 쪽이 steady cadence를 정합니다.",
  },
] as const;

const active = (step: number, index: number) => step === index;
const reached = (step: number, index: number) => step >= index;

function MobilePipeline({ step }: { step: number }) {
  const rows = [
    { y: 16, title: "HBM · A/B 원본", note: "멀리 있는 큰 저장소", icon: "▦" },
    { y: 92, title: "TMA producer", note: "한 thread가 비동기 복사 발행", icon: "⇣" },
    { y: 168, title: "Shared ping/pong", note: "barrier가 ready를 보증", icon: "◫" },
    { y: 244, title: "WGMMA · 4 warps", note: "128 threads가 함께 계산", icon: "●●" },
    { y: 320, title: "Register accumulator", note: "D = A×B+C 결과 조각", icon: "▥" },
  ] as const;
  return (
    <svg className="!block sm:!hidden" viewBox="0 0 360 394" role="img" aria-label="한 타일이 HBM에서 TMA와 shared memory, WGMMA를 거쳐 register 결과가 되는 다섯 단계">
      <defs>
        <marker id="hopper-arrow-mobile" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0 0 7 3.5 0 7Z" fill="var(--muted-foreground)" />
        </marker>
      </defs>
      {rows.slice(0, -1).map((row, index) => (
        <path key={row.title} d={`M180 ${row.y + 58} V${rows[index + 1].y - 8}`} fill="none" stroke={reached(step, index + 1) ? "var(--primary)" : "var(--border)"} strokeWidth="1.25" markerEnd="url(#hopper-arrow-mobile)" />
      ))}
      {rows.map((row, index) => (
        <g key={row.title} opacity={step < index ? 0.5 : 1}>
          <rect x="22" y={row.y} width="316" height="58" rx="13" fill={active(step, index) ? "var(--accent)" : "var(--card)"} stroke={active(step, index) ? "var(--primary)" : "var(--border)"} strokeWidth={active(step, index) ? 1.25 : 1} />
          <rect x="36" y={row.y + 11} width="38" height="36" rx="9" fill={reached(step, index) ? "var(--accent)" : "var(--muted)"} />
          <text x="55" y={row.y + 34} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--foreground)">{row.icon}</text>
          <text x="88" y={row.y + 24} fontSize="12" fontWeight="700" fill="var(--foreground)">{row.title}</text>
          <text x="88" y={row.y + 42} fontSize="10" fill="var(--muted-foreground)">{row.note}</text>
          <circle cx="321" cy={row.y + 29} r="10" fill={reached(step, index) ? "var(--primary)" : "var(--muted)"} />
          <text x="321" y={row.y + 33} textAnchor="middle" fontSize="10" fontWeight="800" fill={reached(step, index) ? "var(--primary-foreground)" : "var(--muted-foreground)"}>{index + 1}</text>
        </g>
      ))}
    </svg>
  );
}

function DesktopPipeline({ step }: { step: number }) {
  const nodes = [
    { x: 24, title: "HBM", sub: "A·B 원본 tile" },
    { x: 184, title: "TMA", sub: "producer 1 thread" },
    { x: 344, title: "Shared", sub: "ping / pong buffer" },
    { x: 504, title: "WGMMA", sub: "4 warps · 128 threads" },
    { x: 664, title: "Registers", sub: "accumulator D" },
  ] as const;
  return (
    <svg className="!hidden sm:!block" viewBox="0 0 820 306" role="img" aria-label="한 타일이 HBM에서 TMA와 shared memory, WGMMA를 거쳐 register 결과가 되는 다섯 단계">
      <defs>
        <marker id="hopper-arrow-desktop" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0 0 8 4 0 8Z" fill="var(--muted-foreground)" />
        </marker>
      </defs>
      <rect x="153" y="30" width="170" height="218" rx="18" fill="var(--muted)" stroke="var(--primary)" strokeDasharray="5 5" opacity="0.55" />
      <text x="238" y="54" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--primary)">PRODUCER · COPY</text>
      <rect x="473" y="30" width="318" height="218" rx="18" fill="var(--muted)" stroke="var(--border)" strokeDasharray="5 5" opacity="0.55" />
      <text x="632" y="54" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--muted-foreground)">CONSUMER · COMPUTE</text>
      {nodes.slice(0, -1).map((node, index) => (
        <path key={node.title} d={`M${node.x + 126} 137 H${nodes[index + 1].x - 12}`} fill="none" stroke={reached(step, index + 1) ? "var(--primary)" : "var(--border)"} strokeWidth="1.25" markerEnd="url(#hopper-arrow-desktop)" />
      ))}
      {nodes.map((node, index) => (
        <g key={node.title} opacity={step < index ? 0.46 : 1}>
          <rect x={node.x} y="85" width="126" height="104" rx="15" fill={active(step, index) ? "var(--accent)" : "var(--card)"} stroke={active(step, index) ? "var(--primary)" : "var(--border)"} strokeWidth="1.25" />
          {index === 0 && [0, 1, 2, 3].map((cell) => <rect key={cell} x={node.x + 22 + cell * 20} y="105" width="15" height="15" rx="2" fill="var(--accent)" stroke="var(--primary)" />)}
          {index === 1 && <><circle cx={node.x + 47} cy="113" r="10" fill="var(--accent)" stroke="var(--primary)"/><path d={`M${node.x + 67} 113h28`} stroke="var(--primary)" strokeWidth="1.25"/><path d={`M${node.x + 89} 108l7 5-7 5`} fill="none" stroke="var(--primary)" strokeWidth="1.25"/></>}
          {index === 2 && <><rect x={node.x + 23} y="102" width="34" height="22" rx="4" fill="var(--accent)"/><rect x={node.x + 67} y="102" width="34" height="22" rx="4" fill="var(--muted)"/><circle cx={node.x + 107} cy="113" r="5" fill={step >= 2 ? "var(--primary)" : "var(--muted)"}/></>}
          {index === 3 && [0, 1, 2, 3].map((warp) => <circle key={warp} cx={node.x + 30 + warp * 22} cy="113" r="8" fill="var(--accent)" stroke="var(--primary)"/>)}
          {index === 4 && [0, 1, 2].map((row) => [0, 1, 2].map((col) => <rect key={`${row}-${col}`} x={node.x + 36 + col * 18} y={101 + row * 10} width="14" height="7" rx="1" fill="var(--accent)" stroke="var(--primary)"/>))}
          <text x={node.x + 63} y="150" textAnchor="middle" fontSize="13" fontWeight="800" fill="var(--foreground)">{node.title}</text>
          <text x={node.x + 63} y="169" textAnchor="middle" fontSize="10" fill="var(--muted-foreground)">{node.sub}</text>
          <circle cx={node.x + 112} cy="96" r="10" fill={reached(step, index) ? "var(--primary)" : "var(--muted)"} />
          <text x={node.x + 112} y="100" textAnchor="middle" fontSize="10" fontWeight="800" fill={reached(step, index) ? "var(--primary-foreground)" : "var(--muted-foreground)"}>{index + 1}</text>
        </g>
      ))}
      <path d="M412 201v30" stroke={step >= 2 ? "var(--primary)" : "var(--border)"} strokeWidth="1.25" />
      <rect x="325" y="231" width="174" height="44" rx="11" fill="var(--background)" stroke={step >= 2 ? "var(--primary)" : "var(--border)"} />
      <text x="412" y="249" textAnchor="middle" fontSize="10" fontWeight="800" fill="var(--foreground)">TRANSACTION BARRIER</text>
      <text x="412" y="265" textAnchor="middle" fontSize="10" fill="var(--muted-foreground)">도착한 byte와 phase를 확인</text>
    </svg>
  );
}

export function HopperPipelineViz() {
  return <StepViz steps={PIPELINE_STEPS}>{(step) => <><MobilePipeline step={step} /><DesktopPipeline step={step} /></>}</StepViz>;
}

export function ClusterScopeViz() {
  const rows = [["Thread", "register", "자기 instruction"], ["Block", "shared memory", "block barrier"], ["Cluster", "DSM", "cluster sync·rank"], ["Grid", "global memory", "kernel boundary"]] as const;
  return <figure data-viz="hopper-cluster-scope" className="not-prose my-9 rounded-xl border border-border bg-card p-5 sm:p-6"><figcaption><p className="text-xs font-semibold text-primary">협력 범위가 하나 늘어났다</p><p className="mt-1 text-base font-bold">Cluster는 모든 block을 하나로 합치는 기능이 아니다</p></figcaption><div data-viz-canvas className="mt-5 grid gap-3 sm:grid-cols-2">{rows.map(([scope,memory,sync])=><section key={scope} className="min-w-0 rounded-lg border border-border bg-background p-4"><div className="flex flex-wrap items-center justify-between gap-2"><strong className="text-sm">{scope}</strong><span className="rounded-md bg-muted px-2 py-1 text-[11px] font-semibold">{memory}</span></div><p className="mt-2 text-xs text-muted-foreground">{sync}</p></section>)}</div></figure>;
}
