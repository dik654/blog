import SceneShell from "./SceneShell";

/**
 * 본문 대응: #security — PoW network가 갈라지면 양쪽 branch에 work가 쌓이고, 연결이 돌아온 뒤
 * 더 큰 누적 work를 가진 유효한 chain을 채택하면서 다른 branch의 낮은 깊이 거래가 되돌아갈 수 있다.
 * 블록 수, 블록마다 work 1이라는 값, 송금이 B쪽 블록 4b에 들어갔다는 배치는 설명용 가정이다.
 * 누적 work: A쪽 1+1+1+1+1 = 5, B쪽 1+1+1+1 = 4.
 */
type Block = { id: string; x: number; y: number; side: "common" | "a" | "b" };

const BLOCKS: readonly Block[] = [
  { id: "1", x: 20, y: 96, side: "common" },
  { id: "2", x: 76, y: 96, side: "common" },
  { id: "3", x: 132, y: 96, side: "common" },
  { id: "4a", x: 196, y: 46, side: "a" },
  { id: "5a", x: 252, y: 46, side: "a" },
  { id: "4b", x: 196, y: 146, side: "b" },
];
const BW = 44;
const BH = 30;
const WORK_A = BLOCKS.filter((b) => b.side !== "b").length;
const WORK_B = BLOCKS.filter((b) => b.side !== "a").length;

const SCENES = [
  {
    label: "분리 전",
    summary: "한 chain · 누적 work 3",
    note: "모든 노드가 블록 1–3으로 이어진 한 chain을 봅니다. 블록마다 work가 1이라고 가정하면 누적 work는 3입니다.",
  },
  {
    label: "분리 중",
    summary: `A쪽 ${WORK_A} · B쪽 ${WORK_B}`,
    note: "Network가 A와 B로 갈라지자 양쪽에서 각자 블록을 이어 붙입니다. A쪽은 4a·5a, B쪽은 4b를 만들었고 송금 요청은 4b에 들어갔습니다. B쪽 노드에게 이 송금은 깊이 1의 거래로 보입니다.",
  },
  {
    label: "연결 복구",
    summary: `${WORK_A} > ${WORK_B} → A쪽 branch 채택`,
    note: "연결이 돌아오면 노드는 두 branch의 누적 work를 비교해 더 큰 쪽의 유효한 chain을 고릅니다. 블록 1–3은 두 branch가 공유하므로 그대로 남습니다.",
  },
  {
    label: "낮은 깊이 되돌림",
    summary: "4b와 그 안의 송금이 선택 chain에서 빠짐",
    note: "4b는 선택된 chain에 없으므로 그 안에 있던 깊이 1의 송금도 선택 chain의 history에서 빠집니다. 이 송금이 다시 포함됐는지는 새 chain에서 다시 확인해야 합니다.",
  },
] as const;

export default function PowForkReorgViz() {
  return (
    <SceneShell
      eyebrow="PoW branch 경쟁"
      title="갈라진 동안 쌓인 work가 비교되고, 진 쪽의 얕은 거래가 빠집니다"
      description="사각형 하나가 블록입니다. 블록 수, 블록마다 work 1, 송금이 들어간 위치는 설명용 가정입니다."
      ariaLabel="PoW network 분리 중 두 branch가 자라고, 복구 후 누적 work가 큰 branch를 채택하며 다른 branch의 송금이 빠지는 과정"
      scenes={SCENES}
      render={(active) => {
        const split = active >= 1;
        const chosen = active >= 2;
        const dropped = active >= 3;
        const visible = (b: Block) => b.side === "common" || split;
        const stroke = (b: Block) => {
          if (b.side === "b" && dropped) return "#dc2626";
          if (b.side === "a" && chosen) return "#2563eb";
          if (b.side === "common" && chosen) return "#2563eb";
          return "#64748b";
        };
        return (
          <svg viewBox="0 0 360 214" className="mx-auto block h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {split && (
              <>
                <line x1={182} x2={350} y1={96} y2={96} stroke={active >= 2 ? "#94a3b8" : "#dc2626"} strokeWidth={1} strokeDasharray="4 4" />
                <text x={350} y={20} textAnchor="end" fontSize={11} fontWeight={700} fill="#475569">Network A쪽</text>
                <text x={350} y={208} textAnchor="end" fontSize={11} fontWeight={700} fill="#475569">Network B쪽</text>
              </>
            )}
            {BLOCKS.filter(visible).map((b, index, list) => {
              const prev = b.id === "4a" || b.id === "4b" ? list.find((p) => p.id === "3") : index > 0 ? list[index - 1] : undefined;
              const fromX = prev ? prev.x + BW : 0;
              const fromY = prev ? prev.y + BH / 2 : 0;
              return (
                <g key={b.id} opacity={dropped && b.side === "b" ? 0.55 : 1}>
                  {prev && <line x1={fromX} y1={fromY} x2={b.x} y2={b.y + BH / 2} stroke="#94a3b8" strokeWidth={1} />}
                  <rect x={b.x} y={b.y} width={BW} height={BH} rx={6} fill="#ffffff" stroke={stroke(b)} strokeWidth={stroke(b) === "#64748b" ? 1 : 1.25} strokeDasharray={dropped && b.side === "b" ? "4 3" : undefined} />
                  <text x={b.x + BW / 2} y={b.y + 19} textAnchor="middle" fontSize={12} fontWeight={700} fill="#1e293b">
                    {b.id}
                  </text>
                </g>
              );
            })}
            {split && (
              <text x={196} y={194} fontSize={11} fontWeight={700} fill={dropped ? "#dc2626" : "#b45309"}>
                {dropped ? "송금: 선택 chain에서 빠짐" : "송금 포함 · 깊이 1"}
              </text>
            )}
            <text x={20} y={150} fontSize={11} fill="#475569">
              {active === 0 ? "누적 work 3" : "공통 블록 1–3"}
            </text>
            {split && (
              <>
                <text x={196} y={38} fontSize={11} fontWeight={700} fill={chosen ? "#2563eb" : "#475569"}>누적 work {WORK_A}</text>
                <text x={248} y={166} fontSize={11} fontWeight={700} fill="#475569">누적 work {WORK_B}</text>
              </>
            )}
            {chosen && (
              <text x={20} y={30} fontSize={12} fontWeight={700} fill="#2563eb">
                {WORK_A} &gt; {WORK_B} → A쪽 chain 선택
              </text>
            )}
          </svg>
        );
      }}
    />
  );
}
