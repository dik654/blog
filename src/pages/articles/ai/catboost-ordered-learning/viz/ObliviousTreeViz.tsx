import SceneShell from "./SceneShell";

/**
 * 본문 대응: #symmetric-tree — depth 0 age<30, depth 1 income<5천.
 * 같은 depth의 모든 node가 같은 질문 → depth d면 질문 d개, leaf 2^d개 (d=2 → 4).
 * Bit 표기(예=1·아니오=0, depth 0 답이 첫 자리)와 예시 row(age 25·income 7천)는 그림용 가정입니다.
 */
const SCENES = [
  {
    label: "Depth 0: 질문 하나",
    summary: "age<30 → 2갈래",
    note: "Root에서 모든 row가 age<30이라는 같은 질문 하나에 답하고 두 갈래로 나뉩니다.",
  },
  {
    label: "Depth 1: 두 node가 같은 질문",
    summary: "rule 2개가 2² = 4 leaves를 가름",
    note: "Oblivious tree에서는 depth 1의 두 node가 각자 다른 질문을 고르지 않고 둘 다 income<5천을 묻습니다. Leaf 2²=4개는 depth 2 tree면 어느 쪽이든 같고, 다른 점은 depth마다 split rule이 하나뿐이라 rule 2개만으로 4 leaves를 모두 가른다는 것입니다.",
  },
  {
    label: "Leaf = 답의 bit code",
    summary: "age 25 · income 7천 (가정) → 10",
    note: "예=1, 아니오=0으로 depth 순서대로 답을 적으면 그 bit code가 곧 leaf 위치입니다(표기는 가정). age 25·income 7천인 row는 age<30에 예, income<5천에 아니오라 leaf 10에 들어갑니다.",
  },
] as const;

const VW = 360;
const VH = 200;
const ROOT = { x: 180, y: 34 };
const MID = [
  { x: 90, y: 98, bit: "1" },
  { x: 270, y: 98, bit: "0" },
] as const;
const LEAVES = [
  { x: 48, code: "11" },
  { x: 136, code: "10" },
  { x: 224, code: "01" },
  { x: 312, code: "00" },
] as const;
const LEAF_Y = 166;
const NODE_W = 112;
const NODE_H = 28;

export default function ObliviousTreeViz() {
  return (
    <SceneShell
      eyebrow="Symmetric tree"
      title="같은 depth의 node는 모두 같은 질문을 던집니다"
      description="본문 예시 age<30·income<5천으로 만든 depth 2 oblivious tree입니다. 마지막 장면의 파란 선은 예시 row가 지나는 길이며, bit 표기와 예시 row 값은 그림용 가정입니다."
      ariaLabel="depth 0에서 age<30, depth 1의 두 node가 모두 income<5천을 묻고 leaf 네 개가 bit code 11, 10, 01, 00이 되는 oblivious tree"
      scenes={SCENES}
      render={(active) => {
        const showMid = active >= 1;
        const showCode = active === 2;
        const onPath = (leafIndex: number) => showCode && leafIndex === 1;
        return (
          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            className="mx-auto block h-auto w-full max-w-[560px]"
            role="img"
            aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
          >
            {MID.map((mid, i) => (
              <g key={mid.bit}>
                <line
                  x1={ROOT.x}
                  y1={ROOT.y + NODE_H / 2}
                  x2={mid.x}
                  y2={mid.y - NODE_H / 2}
                  stroke={showCode && i === 0 ? "#2563eb" : "#94a3b8"}
                  strokeWidth={showCode && i === 0 ? 1.25 : 1}
                />
                <text x={(ROOT.x + mid.x) / 2 + (i === 0 ? -8 : 8)} y={(ROOT.y + mid.y) / 2 + 2} textAnchor={i === 0 ? "end" : "start"} fontSize={12} fill="#64748b">
                  {i === 0 ? "예" : "아니오"}
                  {showCode ? ` = ${mid.bit}` : ""}
                </text>
              </g>
            ))}
            {MID.map((mid, mi) =>
              LEAVES.slice(mi * 2, mi * 2 + 2).map((leaf, li) => {
                const leafIndex = mi * 2 + li;
                return (
                  <g key={leaf.code} opacity={showMid ? 1 : 0.2}>
                    <line
                      x1={mid.x}
                      y1={mid.y + NODE_H / 2}
                      x2={leaf.x}
                      y2={LEAF_Y - 12}
                      stroke={onPath(leafIndex) ? "#2563eb" : "#94a3b8"}
                      strokeWidth={onPath(leafIndex) ? 1.25 : 1}
                    />
                    <rect
                      x={leaf.x - 30}
                      y={LEAF_Y - 12}
                      width={60}
                      height={24}
                      rx={6}
                      fill={onPath(leafIndex) ? "#dbeafe" : "#f8fafc"}
                      stroke={onPath(leafIndex) ? "#2563eb" : "#94a3b8"}
                      strokeWidth={1}
                    />
                    <text x={leaf.x} y={LEAF_Y + 4} textAnchor="middle" fontSize={13} fontWeight={700} fill={showCode ? "#1e3a8a" : "#64748b"}>
                      {showCode ? leaf.code : `leaf ${leafIndex + 1}`}
                    </text>
                    <text x={leaf.x + (li === 0 ? -8 : 8)} y={LEAF_Y - 22} textAnchor={li === 0 ? "end" : "start"} fontSize={11} fill="#64748b">
                      {li === 0 ? "예" : "아니오"}
                    </text>
                  </g>
                );
              }),
            )}
            <rect x={ROOT.x - NODE_W / 2} y={ROOT.y - NODE_H / 2} width={NODE_W} height={NODE_H} rx={6} fill="#fef3c7" stroke="#d97706" strokeWidth={1} />
            <text x={ROOT.x} y={ROOT.y + 4} textAnchor="middle" fontSize={13} fontWeight={700} fill="#92400e">age&lt;30?</text>
            {MID.map((mid) => (
              <g key={`node-${mid.bit}`} opacity={showMid ? 1 : 0.2}>
                <rect x={mid.x - NODE_W / 2} y={mid.y - NODE_H / 2} width={NODE_W} height={NODE_H} rx={6} fill="#e0f2fe" stroke="#0284c7" strokeWidth={1} />
                <text x={mid.x} y={mid.y + 4} textAnchor="middle" fontSize={13} fontWeight={700} fill="#075985">income&lt;5천?</text>
              </g>
            ))}
            <text x={8} y={ROOT.y + 4} fontSize={11} fill="#64748b">depth 0</text>
            <text x={8} y={MID[0].y - 18} fontSize={11} fill="#64748b" opacity={showMid ? 1 : 0.2}>depth 1</text>
          </svg>
        );
      }}
    />
  );
}
