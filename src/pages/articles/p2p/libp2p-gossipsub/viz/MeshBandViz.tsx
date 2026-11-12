import SceneShell from "./SceneShell";

/**
 * 본문 대응: #publish-heartbeat 02 — 기본 mesh target 6, low 5, high 12.
 * 5명보다 적으면 6까지 GRAFT, 12명 이상이면 6까지 PRUNE, 그 사이는 유지.
 * 3 → +3 = 6, 8(가정) → 그대로, 14 → −8 = 6, 3명인데 후보 1명(가정) → 4.
 */
const LOW = 5;
const TARGET = 6;
const HIGH = 12;
const SLOTS = 16;

const SCENES = [
  { label: "3명: 부족", summary: "3 < 5 → GRAFT 최대 3명 → 6", before: 3, after: 6, note: "3은 low 5보다 작아 보충 branch로 들어갑니다. 목표 6까지 최대 3명을 GRAFT하며, 그림은 조건을 통과한 후보가 충분한 경우입니다. 후보는 연결·topic·score·backoff 조건을 통과한 peer 중에서 고릅니다." },
  { label: "8명: 그대로", summary: "5 ≤ 8 < 12 → 변화 없음", before: 8, after: 8, note: "8명(가정)은 low 5 이상, high 12 미만입니다. 목표 6과 다르더라도 이 구간에서는 크기를 맞추려고 더하거나 빼지 않습니다." },
  { label: "14명: 과잉", summary: "14 ≥ 12 → PRUNE 최대 8명 → 6", before: 14, after: 6, note: "14는 high 12 이상이라 목표 6까지 줄이는 branch로 들어갑니다. 최대 8명을 PRUNE하되 좋은 score 일부와 최소 outbound peer는 보존합니다. 그림은 8명을 모두 뺀 경우입니다." },
  { label: "3명, 후보 1명뿐", summary: "3 → 4 · 아직 5 미만", before: 3, after: 4, note: "조건을 통과한 후보가 1명뿐이라면(가정) 이번 heartbeat는 4명에서 끝납니다. 한 heartbeat만으로 목표에 도달하지 못하는 경우입니다." },
] as const;

const W = 400;
const PAD = 22;
const STEP = (W - 2 * PAD) / SLOTS;
const xOf = (n: number) => PAD + n * STEP;

const EMPTY = { fill: "none", stroke: "#cbd5e1", dash: "2 2" as string | undefined };
const KEPT = { fill: "#64748b", stroke: "#64748b", dash: undefined };
const ADDED = { fill: "#16a34a", stroke: "#16a34a", dash: undefined };
const REMOVED = { fill: "none", stroke: "#dc2626", dash: "3 2" };

function slotStyle(kind: "before" | "after", inBefore: boolean, inAfter: boolean) {
  if (kind === "before") return inBefore ? KEPT : EMPTY;
  if (inAfter) return inBefore ? KEPT : ADDED;
  return inBefore ? REMOVED : EMPTY;
}

export default function MeshBandViz() {
  return (
    <SceneShell
      eyebrow="heartbeat 한 번의 mesh 수선"
      title="low 5와 high 12 사이에서는 손대지 않고, 밖으로 나가면 목표 6으로 되돌립니다"
      description="한 칸이 topic mesh의 peer 한 명입니다. 위 줄은 heartbeat 전, 아래 줄은 heartbeat 뒤입니다. 초록 칸은 GRAFT로 더한 peer, 빨간 점선 칸은 PRUNE으로 뺀 peer입니다. 기본값 기준이며 topic별 override는 다루지 않습니다."
      ariaLabel="mesh 크기가 low 5 미만, 5 이상 12 미만, 12 이상일 때 heartbeat의 GRAFT와 PRUNE"
      scenes={SCENES}
      render={(active) => {
        const { before, after } = SCENES[active];
        const row = (y: number, kind: "before" | "after") =>
          Array.from({ length: SLOTS }, (_, i) => {
            const style = slotStyle(kind, i < before, i < after);
            return <rect key={`${kind}-${i}`} x={xOf(i) + 2} y={y} width={STEP - 4} height={22} rx={4} fill={style.fill} stroke={style.stroke} strokeWidth={1} strokeDasharray={style.dash} />;
          });
        return (
          <svg viewBox={`0 0 ${W} 200`} className="block h-auto w-full" role="img" aria-label={`heartbeat 전 ${before}명, 뒤 ${after}명`}>
            <rect x={xOf(0)} y={16} width={xOf(LOW) - xOf(0)} height={14} fill="#16a34a" fillOpacity={0.14} />
            <rect x={xOf(LOW)} y={16} width={xOf(HIGH) - xOf(LOW)} height={14} fill="#64748b" fillOpacity={0.1} />
            <rect x={xOf(HIGH)} y={16} width={xOf(SLOTS) - xOf(HIGH)} height={14} fill="#dc2626" fillOpacity={0.14} />
            <text x={(xOf(0) + xOf(LOW)) / 2} y={27} textAnchor="middle" fontSize={13} fill="#15803d">0~4 GRAFT</text>
            <text x={(xOf(LOW) + xOf(HIGH)) / 2} y={27} textAnchor="middle" fontSize={13} fill="#64748b">5~11 유지</text>
            <text x={(xOf(HIGH) + xOf(SLOTS)) / 2} y={27} textAnchor="middle" fontSize={13} fill="#b91c1c">12~ PRUNE</text>
            <text x={PAD} y={50} fontSize={13} fill="#64748b">전 {before}명</text>
            {row(56, "before")}
            <text x={PAD} y={104} fontSize={13} fill="#64748b">뒤 {after}명</text>
            {row(110, "after")}
            {[LOW, TARGET, HIGH].map((v) => (
              <g key={v}>
                <line x1={xOf(v)} x2={xOf(v)} y1={40} y2={v === TARGET ? 160 : 144} stroke={v === TARGET ? "#2563eb" : "#94a3b8"} strokeWidth={v === TARGET ? 1.25 : 1} strokeDasharray={v === TARGET ? undefined : "3 3"} />
                <text x={xOf(v)} y={v === TARGET ? 172 : 156} textAnchor="middle" fontSize={13} fontWeight={600} fill={v === TARGET ? "#2563eb" : "#64748b"}>
                  {v === LOW ? "low 5" : v === TARGET ? "target 6" : "high 12"}
                </text>
              </g>
            ))}
            <text x={W / 2} y={192} textAnchor="middle" fontSize={13} fill="#64748b">세로선 왼쪽의 칸 수가 그 기준값입니다</text>
          </svg>
        );
      }}
    />
  );
}
