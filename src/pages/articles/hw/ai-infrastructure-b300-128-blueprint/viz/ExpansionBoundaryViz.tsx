import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — GPU 256개는 32노드. 서버는 두 배지만 스위치는 정확히 두 배가 아닐 수 있다.
 * 랙 공간·배전·냉각수·케이블 트레이는 나중에 늘리기 어려워 초기 여유, 모든 스위치·스토리지·라이선스를 첫날 32노드 크기로 사면 유휴 자본.
 * 랙 배치: 공개 배치안 rack당 4대(high-density) 또는 2대. 전력: DGX B300 system max 15kW × 노드 수(장비 상한 합계).
 * 16노드 → 4 또는 8 rack, 240kW / 32노드 → 8 또는 16 rack, 480kW. 판정 예시는 depthData의 port budget 통과·재설계 조건.
 */
const NODES_PER_RACK_DENSE = 4;
const NODES_PER_RACK_LOW = 2;
const SYSTEM_MAX_KW = 15;
const GPU_PER_NODE = 8;

const RACK_SLOTS = 8;
const W = 480;
const H = 186;
const RACK_W = 46;
const GAP = (W - 2 * 20 - RACK_SLOTS * RACK_W) / (RACK_SLOTS - 1);
const RACK_TOP = 30;
const SLOT_H = 22;
const RACK_H = SLOT_H * NODES_PER_RACK_DENSE + 8;
const BAND_Y = RACK_TOP + RACK_H + 12;
const rx = (index: number) => 20 + index * (RACK_W + GAP);

type RackState = "filled" | "reserved" | "none";

const SCENES = [
  {
    label: "1단계 · 16노드",
    summary: "GPU 128 · 랙 4개(가정)",
    note: "16노드를 rack당 4대 배치안으로 놓으면 랙 4개, rack당 2대면 8개입니다. DGX B300 system max 15kW를 16대 더하면 240kW이며, 스위치·스토리지·냉각·전력 이중화와 여유를 더하기 전의 장비 상한 합계입니다.",
    racks: 4,
    reserved: false,
  },
  {
    label: "2단계 · 32노드",
    summary: "GPU 256 · 서버 2배",
    note: "GPU 256개는 같은 8-GPU 기준에서 32노드이고 서버 수는 정확히 두 배입니다. 스위치는 포트와 이중화 단위 때문에 정확히 두 배가 아닐 수 있어 숫자를 적지 않았습니다.",
    racks: 8,
    reserved: false,
  },
  {
    label: "늘리기 어려운 기반",
    summary: "랙 공간·배전·냉각수·트레이",
    note: "랙 공간·배전·냉각수·케이블 트레이는 나중에 늘리기 어려워 초기 여유를 둘 가치가 큽니다. 그림은 32노드분 자리를 잡아 둔 경우이며(가정), 점선 랙은 아직 장비가 없는 자리입니다.",
    racks: 4,
    reserved: true,
  },
  {
    label: "첫날 전부 사면",
    summary: "32노드 크기 구매 → 유휴",
    note: "반대로 스위치·스토리지·라이선스까지 첫날 32노드 크기로 사면 16노드만 쓰는 동안 나머지가 유휴 자본이 됩니다. 첫 단계가 따로 검수되고 두 번째 단계에서 교체 없이 늘어나는 최소 공통 기반이 목표입니다.",
    racks: 4,
    reserved: true,
  },
  {
    label: "증설 판정",
    summary: "추가만 vs 교체",
    note: "이 절 아래 port budget 예시의 판정입니다(leaf는 서버가 붙는 스위치, spine은 leaf를 잇는 상위 스위치, plane B는 이중 compute 망의 두 번째 면). 추가만으로 끝나면 1단계 선투자와 2단계 추가 항목을 나눠 설명하고, 운영 중단과 전량 교체가 필요하면 초기 비용이 싸도 별도 대안으로 표시합니다.",
    racks: 4,
    reserved: true,
  },
] as const;

function Racks({ racks, reserved, bandStrong }: { racks: number; reserved: boolean; bandStrong: boolean }) {
  const states: RackState[] = Array.from({ length: RACK_SLOTS }, (_, index) =>
    index < racks ? "filled" : reserved ? "reserved" : "none",
  );
  const bandEnd = racks === RACK_SLOTS || reserved ? RACK_SLOTS : racks;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`랙 ${racks}개 설치${reserved ? ", 나머지 자리 확보" : ""}`}>
      {states.map((state, index) => (
        <g key={index} opacity={state === "none" ? 0.18 : 1}>
          <rect
            x={rx(index)}
            y={RACK_TOP}
            width={RACK_W}
            height={RACK_H}
            rx={3}
            fill="none"
            stroke={state === "filled" ? "#475569" : "#94a3b8"}
            strokeWidth={1}
            strokeDasharray={state === "filled" ? undefined : "4 3"}
          />
          {state === "filled"
            ? Array.from({ length: NODES_PER_RACK_DENSE }, (_, slot) => (
                <rect
                  key={slot}
                  x={rx(index) + 4}
                  y={RACK_TOP + 4 + slot * SLOT_H}
                  width={RACK_W - 8}
                  height={SLOT_H - 4}
                  rx={2}
                  fill="#2563eb"
                  opacity={0.8}
                />
              ))
            : null}
          <text x={rx(index) + RACK_W / 2} y={RACK_TOP - 8} textAnchor="middle" fontSize={15} fill="#64748b">
            랙 {index + 1}
          </text>
        </g>
      ))}
      <rect
        x={rx(0)}
        y={BAND_Y}
        width={rx(bandEnd - 1) + RACK_W - rx(0)}
        height={14}
        rx={2}
        fill={bandStrong ? "#d97706" : "#94a3b8"}
        opacity={bandStrong ? 0.85 : 0.45}
      />
      <text x={rx(0)} y={BAND_Y + 34} fontSize={15} fill={bandStrong ? "#b45309" : "#64748b"}>
        배전·냉각수·케이블 트레이
      </text>
    </svg>
  );
}

function Fact({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="min-w-0 rounded-md border border-border bg-background px-2 py-1.5">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="font-mono text-sm font-bold">{value}</p>
      {sub ? <p className="text-[10px] leading-4 text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

function Facts({ nodes, switchText }: { nodes: number; switchText: string }) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
      <Fact label="설치 노드 · GPU" value={`${nodes} · ${nodes * GPU_PER_NODE}`} />
      <Fact label="랙 (rack당 4대 / 2대)" value={`${nodes / NODES_PER_RACK_DENSE} / ${nodes / NODES_PER_RACK_LOW}개`} />
      <Fact label="system max 합" value={`${nodes * SYSTEM_MAX_KW}kW`} sub={`${nodes} × 15kW, 장비 상한만`} />
      <Fact label="스위치" value={switchText} />
    </div>
  );
}

function Verdicts() {
  const pass = ["16→32노드: leaf 추가와 cable 추가", "기존 16노드 cable 재배선: 없음", "기존 spine 교체: 없음"];
  const fail = ["기존 leaf 전량 교체", "plane B uplink 공간 없음", "rack 간 cable reach 초과"];
  return (
    <div className="mt-3 grid gap-2 sm:grid-cols-2">
      <div className="min-w-0 rounded-md border border-emerald-600/60 bg-background px-3 py-2">
        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">추가만으로 증설 · 통과</p>
        <ul className="mt-1 space-y-0.5 text-xs leading-5">
          {pass.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="min-w-0 rounded-md border border-dashed border-red-600 bg-background px-3 py-2">
        <p className="text-xs font-bold text-red-700 dark:text-red-400">교체가 필요 · 재설계</p>
        <ul className="mt-1 space-y-0.5 text-xs leading-5">
          {fail.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ExpansionBoundaryViz() {
  return (
    <SceneShell
      eyebrow="16 → 32노드"
      title="서버는 두 배가 되지만 첫날 무엇을 미리 잡아 둘지는 따로 정합니다"
      description="파란 칸 하나가 노드 한 대입니다. 공개 배치안 가운데 rack당 4대를 골라 그렸고(가정), 전력은 DGX B300 system max 15kW를 노드 수만큼 더한 장비 상한입니다. 판정 문구는 설계 판정 예시입니다."
      ariaLabel="16노드에서 32노드로 늘릴 때 랙, 전력 상한, 미리 확보할 기반과 증설 판정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const nodes = scene.racks * NODES_PER_RACK_DENSE;
        return (
          <div>
            <Racks racks={scene.racks} reserved={scene.reserved} bandStrong={active === 2} />
            {active === 4 ? (
              <Verdicts />
            ) : active === 3 ? (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="min-w-0 rounded-md border border-border bg-background px-3 py-2 text-xs leading-5">
                  <p className="font-bold">사용 중</p>
                  <p>16노드 · GPU 128</p>
                </div>
                <div className="min-w-0 rounded-md border border-dashed border-red-600 bg-background px-3 py-2 text-xs leading-5">
                  <p className="font-bold text-red-700 dark:text-red-400">32노드 크기로 미리 산 스위치·스토리지·라이선스</p>
                  <p>2단계 전까지 쓰지 않는 몫 = 유휴 자본 (크기는 정하지 않음)</p>
                </div>
              </div>
            ) : (
              <Facts nodes={active === 1 ? 32 : nodes} switchText={active === 1 ? "정확히 2배 아닐 수 있음" : "미확정"} />
            )}
          </div>
        );
      }}
    />
  );
}
