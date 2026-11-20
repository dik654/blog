import SceneShell from "./SceneShell";

/**
 * 본문 대응: #post "한 번의 PASS와 기간 전체 보장을 구분합니다" —
 * proof 생성 전 job ID·submit intent를 durable store에 먼저 남기고, digest·tx ID를 같은 record에 추가.
 * Restart 뒤 chain inclusion 재조회로 pending/included/reorged를 맞추고, 같은 ID 재제출은 중복 제거,
 * deadline을 넘긴 job은 late와 원인을 보존. Missing·invalid·late·reorged는 서로 다른 상태.
 */
const SCENES = [
  {
    label: "만들기 전에 기록",
    summary: "job ID + submit intent",
    note: "Proof를 만들기 전에 stable proof/job ID와 submit intent를 durable store(재시작해도 남는 저장소)에 먼저 남깁니다. 아직 digest와 transaction ID 칸은 비어 있습니다.",
  },
  {
    label: "같은 record에 추가",
    summary: "+ proof digest + tx ID",
    note: "생성된 proof digest와 transaction ID는 새 record가 아니라 같은 record에 덧붙입니다. 그래서 어떤 job이 어떤 제출로 이어졌는지 한 줄로 따라갈 수 있습니다.",
  },
  {
    label: "restart 뒤 재조회",
    summary: "pending · included · reorged",
    note: "Node가 restart되면 chain inclusion을 다시 조회해 세 상태 중 하나로 맞춥니다. reorged는 체인이 다른 갈래로 바뀌는 reorg 때문에 포함됐던 제출이 빠진 상태입니다. Chain state와 local job state를 맞춰야 중복 제출과 누락된 fault recovery를 막을 수 있습니다.",
  },
  {
    label: "같은 ID 재제출",
    summary: "중복 제거 → record 하나",
    note: "같은 job ID의 재제출은 중복으로 걸러 냅니다. Restart 뒤에 다시 제출을 시도해도 그 job의 record는 하나로 남습니다.",
  },
  {
    label: "deadline을 넘김",
    summary: "late + 원인 보존",
    note: "Deadline을 넘긴 job은 late 상태와 그 원인을 그대로 남깁니다. 아래 네 칸처럼 missing, invalid, late, reorged는 서로 다른 상태이므로 '실패' 하나로 합치지 않습니다.",
  },
] as const;

const W = 360;
const H = 228;
const FIELDS = ["job ID", "submit intent", "proof digest", "tx ID"] as const;
const STATES = ["missing", "invalid", "late", "reorged"] as const;

function Arrow({ x1, y1, x2, y2, color = "#94a3b8" }: { x1: number; y1: number; x2: number; y2: number; color?: string }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const ax = x2 - 6 * Math.cos(angle - 0.4);
  const ay = y2 - 6 * Math.sin(angle - 0.4);
  const bx = x2 - 6 * Math.cos(angle + 0.4);
  const by = y2 - 6 * Math.sin(angle + 0.4);
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} />
      <path d={`M ${x2} ${y2} L ${ax} ${ay} L ${bx} ${by} Z`} fill={color} />
    </g>
  );
}

function Chip({ x, y, w, text, on, tone = "accent" }: { x: number; y: number; w: number; text: string; on: boolean; tone?: "accent" | "warn" }) {
  const stroke = on ? (tone === "warn" ? "#dc2626" : "#2563eb") : "#cbd5e1";
  const color = on ? (tone === "warn" ? "#b91c1c" : "#1d4ed8") : "#94a3b8";
  return (
    <g>
      <rect x={x} y={y} width={w} height={24} rx={6} fill="#ffffff" stroke={stroke} strokeWidth={1} />
      <text x={x + w / 2} y={y + 16} textAnchor="middle" fontSize={10} fontWeight={on ? 700 : 400} fill={color}>{text}</text>
    </g>
  );
}

export default function ProofJobRecordViz() {
  return (
    <SceneShell
      eyebrow="PoSt 제출 기록 · restart와 reorg"
      title="proof job 하나는 같은 record를 따라 상태가 바뀝니다"
      description="왼쪽 칸이 durable store의 record 한 줄입니다. 오른쪽은 그 장면에서 일어나는 일이고, 아래 네 칸은 서로 구분해 남기는 상태입니다."
      ariaLabel="PoSt proof job record가 기록, proof 추가, restart 재조회, 중복 제거, deadline 초과를 거치는 다섯 단계"
      scenes={SCENES}
      render={(active) => {
        const filled = active === 0 ? 2 : 4;
        const rx = 8;
        const ry = 10;
        const rw = 136;
        const rowH = 30;
        const right = 168;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={rx} y={ry - 1} fontSize={9} fill="#64748b">durable record</text>
            {FIELDS.map((field, index) => {
              const on = index < filled;
              const isNew = active === 1 && index >= 2;
              return (
                <g key={field}>
                  <rect x={rx} y={ry + 4 + index * rowH} width={rw} height={rowH - 4} rx={4} fill="#ffffff" stroke={isNew ? "#2563eb" : on ? "#64748b" : "#cbd5e1"} strokeWidth={1} strokeDasharray={on ? undefined : "3 3"} />
                  <text x={rx + 8} y={ry + 21 + index * rowH} fontSize={10} fontWeight={on ? 700 : 400} fill={isNew ? "#1d4ed8" : on ? "#0f172a" : "#94a3b8"}>{field}</text>
                  <text x={rx + rw - 8} y={ry + 21 + index * rowH} textAnchor="end" fontSize={10} fill={on ? "#16a34a" : "#94a3b8"}>{on ? "기록됨" : "빈 칸"}</text>
                </g>
              );
            })}

            {active === 0 && (
              <>
                <text x={right} y={36} fontSize={10} fontWeight={700} fill="#0f172a">1. 기록 먼저</text>
                <text x={right} y={52} fontSize={10} fill="#64748b">2. 그다음 proof 생성</text>
                <Arrow x1={right - 4} y1={32} x2={rx + rw + 4} y2={28} color="#2563eb" />
              </>
            )}
            {active === 1 && (
              <>
                <rect x={right + 20} y={70} width={120} height={30} rx={6} fill="#ffffff" stroke="#64748b" strokeWidth={1} />
                <text x={right + 80} y={89} textAnchor="middle" fontSize={10} fontWeight={700} fill="#0f172a">proof 생성·제출</text>
                <Arrow x1={right + 18} y1={85} x2={rx + rw + 4} y2={95} color="#2563eb" />
                <text x={right + 20} y={118} fontSize={10} fill="#1d4ed8">digest·tx ID를 같은 줄에</text>
              </>
            )}
            {active === 2 && (
              <>
                <rect x={right} y={14} width={184} height={26} rx={6} fill="#ffffff" stroke="#64748b" strokeWidth={1} />
                <text x={right + 92} y={31} textAnchor="middle" fontSize={10} fontWeight={700} fill="#0f172a">restart → chain inclusion 재조회</text>
                <Arrow x1={right + 92} y1={40} x2={right + 30} y2={78} />
                <Arrow x1={right + 92} y1={40} x2={right + 92} y2={78} />
                <Arrow x1={right + 92} y1={40} x2={right + 154} y2={78} />
                <Chip x={right} y={80} w={58} text="pending" on />
                <Chip x={right + 63} y={80} w={58} text="included" on />
                <Chip x={right + 126} y={80} w={58} text="reorged" on tone="warn" />
                <text x={right} y={126} fontSize={9} fill="#64748b">chain state와 local job state를 맞춤</text>
              </>
            )}
            {active === 3 && (
              <>
                <rect x={right + 20} y={20} width={150} height={28} rx={6} fill="#ffffff" stroke="#64748b" strokeWidth={1} />
                <text x={right + 95} y={38} textAnchor="middle" fontSize={10} fontWeight={700} fill="#0f172a">이미 제출한 job ID</text>
                <rect x={right + 20} y={70} width={150} height={28} rx={6} fill="#ffffff" stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" />
                <text x={right + 95} y={88} textAnchor="middle" fontSize={10} fontWeight={700} fill="#b91c1c">같은 ID 재제출 → 중복 제거</text>
                <Arrow x1={right + 18} y1={34} x2={rx + rw + 4} y2={28} color="#2563eb" />
                <text x={right + 20} y={122} fontSize={10} fill="#1d4ed8">record는 여전히 하나</text>
              </>
            )}
            {active === 4 && (
              <>
                <line x1={right} x2={W - 8} y1={60} y2={60} stroke="#94a3b8" strokeWidth={1} />
                <line x1={right + 110} x2={right + 110} y1={48} y2={72} stroke="#dc2626" strokeWidth={1} />
                <text x={right + 110} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill="#b91c1c">deadline</text>
                <circle cx={right + 150} cy={60} r={5} fill="#dc2626" />
                <text x={right + 150} y={88} textAnchor="middle" fontSize={10} fill="#b91c1c">이 job은 그 뒤</text>
                <text x={right} y={118} fontSize={10} fontWeight={700} fill="#b91c1c">late + 원인을 그대로 보존</text>
              </>
            )}

            <text x={rx} y={164} fontSize={9} fill="#64748b">서로 다른 상태 · 하나로 합치지 않음</text>
            {STATES.map((state, index) => {
              const on = (active === 4 && state === "late") || (active === 2 && state === "reorged");
              return <Chip key={state} x={rx + index * 87} y={172} w={80} text={state} on={on} tone="warn" />;
            })}
            <text x={rx} y={216} fontSize={9} fill="#64748b">{active === 4 ? "이 job은 late · 나머지 셋과 섞지 않고 따로 남깁니다" : active === 2 ? "reorged도 그중 하나입니다" : "이 장면에서 다루는 상태 없음"}</text>
          </svg>
        );
      }}
    />
  );
}
