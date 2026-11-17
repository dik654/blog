import SceneShell from "./SceneShell";

/**
 * 본문 대응: #jolteon-path — two-chain은 "인증 블록 두 개"가 아니라
 * (1) 두 블록 모두 인증, (2) 뒤 블록의 부모가 앞 블록, (3) round가 정확히 1 차이를 모두 만족할 때입니다.
 * 장면 1은 본문의 B10·B11, 장면 2·3은 경계를 보이려는 가정입니다(표의 "round 건너뜀·형제 블록").
 */
type Block = { id: string; round: string; x: number; y: number; tone: "focus" | "ancestor" | "gap" | "other"; cert: string };
type Edge = { from: string; to: string };
type Check = { label: string; ok: boolean; value: string };

const SCENES = [
  {
    label: "연속 round · 직접 부모",
    summary: "B10과 조상 커밋",
    note: "B11의 부모는 B10이고 round는 10→11로 하나 차이입니다. QC10과 QC11이 모두 있으므로 세 확인을 통과하고, B10과 그 조상(여기서는 B9)을 커밋합니다.",
    blocks: [
      { id: "B9", round: "round 9", x: 58, y: 62, tone: "ancestor", cert: "QC9" },
      { id: "B10", round: "round 10", x: 180, y: 62, tone: "focus", cert: "QC10" },
      { id: "B11", round: "round 11", x: 302, y: 62, tone: "focus", cert: "QC11" },
    ],
    edges: [{ from: "B11", to: "B10" }, { from: "B10", to: "B9" }],
    checks: [
      { label: "두 블록 인증", ok: true, value: "QC10·QC11" },
      { label: "직접 부모", ok: true, value: "B11→B10" },
      { label: "round 연속", ok: true, value: "10→11" },
    ],
  },
  {
    label: "Round를 건너뜀",
    summary: "이 쌍으로는 커밋 안 함",
    note: "Round 21의 주 노드가 멈춰 그 round에는 인증 블록이 없고, B22가 B20을 직접 잇는 경우입니다(가정). 부모 관계와 두 인증서는 있지만 round가 20→22로 두 칸 차이라 two-chain이 아닙니다.",
    blocks: [
      { id: "B20", round: "round 20", x: 58, y: 62, tone: "focus", cert: "QC20" },
      { id: "—", round: "round 21", x: 180, y: 62, tone: "gap", cert: "블록 없음" },
      { id: "B22", round: "round 22", x: 302, y: 62, tone: "focus", cert: "QC22" },
    ],
    edges: [{ from: "B22", to: "B20" }],
    checks: [
      { label: "두 블록 인증", ok: true, value: "QC20·QC22" },
      { label: "직접 부모", ok: true, value: "B22→B20" },
      { label: "round 연속", ok: false, value: "20→22" },
    ],
  },
  {
    label: "형제 블록",
    summary: "이 쌍으로는 커밋 안 함",
    note: "B11이 B10이 아니라 B9를 잇는다고 해 봅니다(가정). Round는 10·11로 연속이어도 B10과 B11은 같은 부모를 둔 형제라서, 둘 다 인증서를 얻었다고 쳐도 B10을 커밋할 근거가 되지 않습니다.",
    blocks: [
      { id: "B9", round: "round 9", x: 58, y: 62, tone: "ancestor", cert: "QC9" },
      { id: "B10", round: "round 10", x: 180, y: 30, tone: "focus", cert: "QC10" },
      { id: "B11", round: "round 11", x: 302, y: 94, tone: "focus", cert: "QC11 (가정)" },
    ],
    edges: [{ from: "B10", to: "B9" }, { from: "B11", to: "B9" }],
    checks: [
      { label: "두 블록 인증", ok: true, value: "있다고 가정" },
      { label: "직접 부모", ok: false, value: "B11→B9" },
      { label: "round 연속", ok: true, value: "10→11" },
    ],
  },
] as const satisfies readonly { label: string; summary: string; note: string; blocks: readonly Block[]; edges: readonly Edge[]; checks: readonly Check[] }[];

const BW = 84;
const BH = 46;

const FILL = { focus: "#eff6ff", ancestor: "#f8fafc", gap: "#ffffff", other: "#ffffff" } as const;
const STROKE = { focus: "#2563eb", ancestor: "#94a3b8", gap: "#94a3b8", other: "#94a3b8" } as const;

export default function TwoChainShapeViz() {
  return (
    <SceneShell
      eyebrow="Two-chain 확인 · 세 조건"
      title="인증 블록이 두 개여도 모양이 맞아야 커밋합니다"
      description="상자 하나가 블록이고, 화살표는 자식이 부모를 가리킵니다. QC는 그 블록이 서로 다른 2f+1표를 얻었다는 인증서입니다. 아래 세 칸이 모두 맞아야 앞 블록을 커밋합니다."
      note="장면 1은 본문의 B10·B11 예이고, 장면 2·3의 round 번호와 부모 관계는 경계를 보이려는 가정입니다."
      ariaLabel="두 인증 블록이 two-chain이 되는 경우와 되지 않는 두 경우"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const blocks: readonly Block[] = scene.blocks;
        const find = (id: string) => blocks.find((block) => block.id === id);
        return (
          <svg viewBox="0 0 360 214" className="mx-auto block h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <defs>
              <marker id="two-chain-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="#475569" />
              </marker>
            </defs>
            {scene.edges.map((edge) => {
              const from = find(edge.from);
              const to = find(edge.to);
              if (!from || !to) return null;
              const skipsSlot = blocks.some((block) => block.tone === "gap" && block.x > to.x && block.x < from.x);
              if (skipsSlot) {
                const top = from.y - 4;
                return (
                  <path
                    key={`${edge.from}-${edge.to}`}
                    d={`M${from.x},${top} C${from.x},${top - 40} ${to.x},${top - 40} ${to.x},${top - 3}`}
                    fill="none"
                    stroke="#475569"
                    strokeWidth={1.25}
                    markerEnd="url(#two-chain-arrow)"
                  />
                );
              }
              return (
                <line
                  key={`${edge.from}-${edge.to}`}
                  x1={from.x - BW / 2}
                  y1={from.y + BH / 2}
                  x2={to.x + BW / 2 + 2}
                  y2={to.y + BH / 2}
                  stroke="#475569"
                  strokeWidth={1.25}
                  markerEnd="url(#two-chain-arrow)"
                />
              );
            })}
            {blocks.map((block) => (
              <g key={block.round}>
                <rect
                  x={block.x - BW / 2}
                  y={block.y}
                  width={BW}
                  height={BH}
                  rx={8}
                  fill={FILL[block.tone]}
                  stroke={STROKE[block.tone]}
                  strokeWidth={block.tone === "focus" ? 1.25 : 1}
                  strokeDasharray={block.tone === "gap" ? "4 3" : undefined}
                />
                <text x={block.x} y={block.y + 19} textAnchor="middle" fontSize={13} fontWeight={700} fill={block.tone === "gap" ? "#64748b" : "#0f172a"}>{block.id}</text>
                <text x={block.x} y={block.y + 35} textAnchor="middle" fontSize={10} fill="#475569">{block.round}</text>
                <text x={block.x} y={block.y + BH + 13} textAnchor="middle" fontSize={10} fontWeight={block.tone === "focus" ? 700 : 400} fill={block.tone === "focus" ? "#1d4ed8" : "#64748b"}>{block.cert}</text>
              </g>
            ))}
            {scene.checks.map((check, index) => {
              const x = 8 + index * 116;
              return (
                <g key={check.label}>
                  <rect x={x} y={160} width={112} height={48} rx={8} fill={check.ok ? "#f0fdf4" : "#fef2f2"} stroke={check.ok ? "#16a34a" : "#dc2626"} strokeWidth={1} />
                  <text x={x + 56} y={179} textAnchor="middle" fontSize={11} fontWeight={700} fill={check.ok ? "#15803d" : "#b91c1c"}>{check.ok ? "✓" : "✗"} {check.label}</text>
                  <text x={x + 56} y={197} textAnchor="middle" fontSize={10} fill="#334155">{check.value}</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
