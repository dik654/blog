import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case·#need — 세 번 새로 던지면 순서 8가지 중 앞앞앞 하나(1/8),
 * 한 번 던진 결과를 세 칸에 복사하면 가능한 줄은 앞앞앞·뒤뒤뒤 둘뿐이라 1/2.
 */
const SCENES = [
  { label: "세 번 새로 던짐", summary: "8가지 순서 중 1가지", note: "갈림길마다 앞과 뒤로 새로 나뉘어 끝에는 순서가 여덟 가지입니다. 공정한 동전의 가정에서 각 순서의 가능성이 같고, 모두 앞면인 순서는 앞앞앞 하나뿐이라 1/8입니다." },
  { label: "곱셈으로 같은 길", summary: "1/2 × 1/2 × 1/2 = 1/8", note: "같은 앞앞앞 길을 위에서부터 따라가면 갈림길을 세 번 지나고, 갈림길마다 앞면 쪽 1/2을 곱합니다. 새로 나뉘는 갈림길이 세 번 있어서 1/2을 세 번 곱할 수 있습니다." },
  { label: "한 번 던져 세 칸에 복사", summary: "2가지 줄 중 1가지 → 1/2", note: "첫 칸에서만 갈림길이 생기고 둘째·셋째 칸은 첫 결과를 그대로 받아 적습니다. 각 칸의 앞면 가능성은 여전히 1/2이지만 가능한 줄이 앞앞앞과 뒤뒤뒤 둘뿐이라 모두 앞면일 가능성도 1/2입니다." },
] as const;

const W = 360;
const LEVEL_Y = [22, 72, 122, 172] as const;
const ACCENT = "#2563eb";
const MUTED = "#94a3b8";
const TEXT = "#64748b";

/** 깊이 depth(0~3)에서 index번째 노드의 x 좌표 */
const nodeX = (depth: number, index: number) => {
  const count = 2 ** depth;
  const span = W / count;
  return span * index + span / 2;
};

const LEAVES = ["앞앞앞", "앞앞뒤", "앞뒤앞", "앞뒤뒤", "뒤앞앞", "뒤앞뒤", "뒤뒤앞", "뒤뒤뒤"] as const;

export default function CoinBranchViz() {
  return (
    <SceneShell
      eyebrow="갈림길 세기"
      title="새로 던질 때와 결과를 복사할 때 갈림길 수가 다릅니다"
      description="위에서 아래로 한 칸 내려갈 때마다 한 번의 결과를 적습니다. 공정한 동전(앞면 1/2)은 본문의 가정입니다."
      ariaLabel="세 번 독립으로 던진 경우의 여덟 갈래와 한 번 던져 복사한 경우의 두 갈래 비교"
      scenes={SCENES}
      render={(active) => {
        const copy = active === 2;
        const showProduct = active === 1;
        const edges = [0, 1, 2].flatMap((depth) =>
          Array.from({ length: 2 ** depth }, (_, parent) =>
            [0, 1].map((side) => {
              const child = parent * 2 + side;
              const onPath = parent === 0 && side === 0;
              const firstBranch = depth === 0;
              const visible = !copy || firstBranch;
              return { depth, parent, child, side, onPath, visible };
            }),
          ).flat(),
        );
        return (
          <svg viewBox={`0 0 ${W} 214`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {edges.map((e) =>
              e.visible ? (
                <g key={`${e.depth}-${e.child}`}>
                  <line
                    x1={nodeX(e.depth, e.parent)}
                    y1={LEVEL_Y[e.depth] + 6}
                    x2={nodeX(e.depth + 1, e.child)}
                    y2={LEVEL_Y[e.depth + 1] - 10}
                    stroke={e.onPath && !copy ? ACCENT : MUTED}
                    strokeWidth={e.onPath && !copy ? 1.25 : 1}
                  />
                  {showProduct && e.onPath && (
                    <text x={(nodeX(e.depth, e.parent) + nodeX(e.depth + 1, e.child)) / 2 - 8} y={(LEVEL_Y[e.depth] + LEVEL_Y[e.depth + 1]) / 2} textAnchor="end" fontSize={11} fontWeight={700} fill={ACCENT}>
                      ×1/2
                    </text>
                  )}
                </g>
              ) : null,
            )}
            {copy &&
              [0, 1].map((side) => (
                <g key={side}>
                  <line x1={nodeX(1, side)} y1={LEVEL_Y[1] + 6} x2={nodeX(1, side)} y2={LEVEL_Y[3] - 10} stroke={side === 0 ? ACCENT : MUTED} strokeWidth={side === 0 ? 1.25 : 1} strokeDasharray="4 3" />
                  <text x={nodeX(1, side) + 8} y={LEVEL_Y[2] - 4} fontSize={11} fill={TEXT}>복사</text>
                </g>
              ))}
            <circle cx={nodeX(0, 0)} cy={LEVEL_Y[0]} r={4} fill={TEXT} />
            <text x={nodeX(0, 0) + 10} y={LEVEL_Y[0] + 4} fontSize={11} fill={TEXT}>시작</text>
            {[1, 2].map((depth) =>
              Array.from({ length: 2 ** depth }, (_, i) =>
                !copy || depth === 1 ? (
                  <text key={`${depth}-${i}`} x={nodeX(depth, i)} y={LEVEL_Y[depth] + 4} textAnchor="middle" fontSize={12} fill={TEXT}>
                    {i % 2 === 0 ? "앞" : "뒤"}
                  </text>
                ) : null,
              ),
            )}
            {copy
              ? [0, 1].map((side) => (
                  <text key={side} x={nodeX(1, side)} y={LEVEL_Y[3] + 4} textAnchor="middle" fontSize={12} fontWeight={side === 0 ? 700 : 400} fill={side === 0 ? ACCENT : TEXT}>
                    {side === 0 ? "앞앞앞" : "뒤뒤뒤"}
                  </text>
                ))
              : LEAVES.map((leaf, i) => (
                  <text key={leaf} x={nodeX(3, i)} y={LEVEL_Y[3] + 4} textAnchor="middle" fontSize={12} fontWeight={i === 0 ? 700 : 400} fill={i === 0 ? ACCENT : TEXT}>
                    {leaf}
                  </text>
                ))}
            <text x={W / 2} y={206} textAnchor="middle" fontSize={12} fill={TEXT}>
              {copy ? "끝에 남는 줄 2가지 · 모두 앞면은 1가지" : "끝에 남는 순서 8가지 · 모두 앞면은 1가지"}
            </text>
          </svg>
        );
      }}
    />
  );
}
