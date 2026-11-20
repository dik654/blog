import SceneShell from "./SceneShell";

/**
 * 본문 대응: #status — E₀ → E₁ → E₂ branch에서 newPayload(E₂)=INVALID, latestValidHash=E₀.
 * E₀ 뒤의 E₁·E₂는 valid로 계속 취급할 수 없고, Prysm은 invalid root와 descendant의 block·state를 제거.
 * E₃은 descendant를 보이려고 둔 가정 node.
 */
type NodeState = "valid" | "optimistic" | "invalid" | "removed";

const NODES = ["E₀", "E₁", "E₂", "E₃"] as const;

const SCENES = [
  {
    label: "검증 전 branch",
    summary: "E₀ 뒤로 optimistic",
    states: ["valid", "optimistic", "optimistic", "optimistic"],
    note: "E₀ 뒤의 E₁·E₂와 E₂의 자식 E₃은 아직 VALID로 확정되지 않아 optimistic 후보로 남아 있다고 둡니다(가정). E₃은 descendant를 보이려고 넣은 가정 node입니다.",
  },
  {
    label: "INVALID 응답",
    summary: "newPayload(E₂) → INVALID · LVH = E₀",
    states: ["valid", "invalid", "invalid", "optimistic"],
    note: "E₂가 INVALID이고 latestValidHash(LVH, 마지막으로 valid인 hash)가 E₀이면, E₀ 다음부터 E₂까지는 valid로 계속 취급할 수 없습니다. E₂만이 아니라 E₁도 포함됩니다.",
  },
  {
    label: "descendant까지 제거",
    summary: "E₁ · E₂ · E₃ 제거 → E₀ 남음",
    states: ["valid", "removed", "removed", "removed"],
    note: "Prysm은 fork-choice store에서 invalid root와 그 descendant를 찾고, 연결된 block·state를 제거합니다. invalid 구간 위에 쌓인 E₃도 함께 빠집니다.",
  },
] as const satisfies readonly { label: string; summary: string; states: readonly NodeState[]; note: string }[];

const STYLE: Record<NodeState, { stroke: string; fill: string; text: string; tagColor: string; dash?: string; tag: string }> = {
  valid: { stroke: "#16a34a", fill: "#f0fdf4", text: "#166534", tagColor: "#16a34a", tag: "VALID" },
  optimistic: { stroke: "#64748b", fill: "#f8fafc", text: "#334155", tagColor: "#64748b", dash: "4 3", tag: "optimistic" },
  invalid: { stroke: "#dc2626", fill: "#fef2f2", text: "#991b1b", tagColor: "#dc2626", tag: "INVALID 구간" },
  removed: { stroke: "#cbd5e1", fill: "#ffffff", text: "#94a3b8", tagColor: "#94a3b8", dash: "2 3", tag: "제거" },
};

const W = 360;
const H = 150;
const BOX_W = 62;
const BOX_H = 40;
const Y = 54;
const xAt = (index: number) => 16 + index * 88;

export default function InvalidPruneViz() {
  return (
    <SceneShell
      eyebrow="INVALID와 latestValidHash"
      title="INVALID 하나가 E₀ 뒤의 branch 전체를 끊습니다"
      description="상자 하나가 execution payload 하나이고, 화살표는 parent → child입니다. latestValidHash는 execution client가 '여기까지는 valid'라고 돌려주는 마지막 hash입니다."
      ariaLabel="E₂의 INVALID 응답과 latestValidHash E₀를 기준으로 E₁, E₂와 descendant를 제거하는 세 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {NODES.slice(1).map((_, index) => (
              <line key={index} x1={xAt(index) + BOX_W} x2={xAt(index + 1) - 4} y1={Y + BOX_H / 2} y2={Y + BOX_H / 2} stroke="#94a3b8" strokeWidth={1} markerEnd="url(#prune-arrow)" />
            ))}
            <defs>
              <marker id="prune-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0 0 L8 4 L0 8 z" fill="#94a3b8" />
              </marker>
            </defs>
            {NODES.map((name, index) => {
              const style = STYLE[scene.states[index]];
              return (
                <g key={name}>
                  <rect x={xAt(index)} y={Y} width={BOX_W} height={BOX_H} rx={8} fill={style.fill} stroke={style.stroke} strokeWidth={1.25} strokeDasharray={style.dash} />
                  <text x={xAt(index) + BOX_W / 2} y={Y + 25} textAnchor="middle" fontSize={14} fontWeight={700} fill={style.text}>{name}</text>
                  <text x={xAt(index) + BOX_W / 2} y={Y + BOX_H + 16} textAnchor="middle" fontSize={11} fill={style.tagColor}>{style.tag}</text>
                  {index === 3 && <text x={xAt(index) + BOX_W / 2} y={Y + BOX_H + 30} textAnchor="middle" fontSize={10} fill="#64748b">(가정)</text>}
                </g>
              );
            })}
            {active >= 1 && (
              <g>
                <line x1={xAt(0) + BOX_W / 2} x2={xAt(0) + BOX_W / 2} y1={22} y2={Y - 2} stroke="#16a34a" strokeWidth={1} />
                <text x={xAt(0) + 2} y={16} fontSize={11} fill="#16a34a">LVH = E₀</text>
                <line x1={xAt(2) + BOX_W / 2} x2={xAt(2) + BOX_W / 2} y1={22} y2={Y - 2} stroke="#dc2626" strokeWidth={1} />
                <text x={xAt(2) + BOX_W / 2} y={16} textAnchor="middle" fontSize={11} fill="#dc2626">INVALID</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
