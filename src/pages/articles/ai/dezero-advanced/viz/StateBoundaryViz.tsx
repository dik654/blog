import SceneShell from "./SceneShell";

/**
 * 본문 대응: #rnn-vs-lstm "파라미터 수보다 상태 수명부터 정합니다" + #overview 고정 예제.
 * 긴 sample A를 chunk 1·chunk 2로 나눠 학습하고 그 뒤 독립 sample B가 시작된다.
 * 값(h, c)은 chunk 경계를 넘고 graph는 detach로 끊긴다. 독립 sample 경계에서는 h, c 모두 0으로 reset.
 * 각 chunk 3시점·sample B 3시점은 설명용 가정이다.
 */
const CELLS = [
  { label: "A1", chunk: 0 },
  { label: "A2", chunk: 0 },
  { label: "A3", chunk: 0 },
  { label: "A4", chunk: 1 },
  { label: "A5", chunk: 1 },
  { label: "A6", chunk: 1 },
  { label: "B1", chunk: 2 },
  { label: "B2", chunk: 2 },
  { label: "B3", chunk: 2 },
] as const;

const SCENES = [
  {
    label: "chunk 1 학습",
    summary: "graph = A1~A3",
    note: "긴 sample A를 구간(chunk)으로 잘라 학습합니다. 이 방식을 truncated BPTT라고 부릅니다. 첫 chunk는 0 상태에서 시작해 A1~A3의 계산 graph를 만들고, backward는 이 세 시점 안에서만 흐릅니다.",
  },
  {
    label: "chunk 경계",
    summary: "값은 넘기고 graph는 끊기",
    note: "A3의 마지막 hidden·cell state 값은 A4의 시작 상태로 넘깁니다(carry). 하지만 그 값을 만든 A1~A3의 graph와는 detach로 연결을 끊습니다. 그래서 chunk 2의 backward는 A4~A6에서 멈추고, 보존할 graph도 세 시점 분량에 머뭅니다.",
  },
  {
    label: "새 sample",
    summary: "h, c → 0",
    note: "B는 A와 독립된 sample입니다. A6의 상태 값을 넘기면 서로 무관한 sample이 이어진 것처럼 계산되므로 hidden·cell state를 모두 0으로 reset합니다. 값과 graph가 둘 다 끊깁니다.",
  },
  {
    label: "detach 생략",
    summary: "graph = A1~A6, 계속 증가",
    note: "Chunk 경계에서 값만 넘기고 detach를 빠뜨리면 chunk 2의 graph가 chunk 1의 graph에 계속 매달립니다. Chunk를 지날수록 보존하는 이력이 길어져 메모리가 계속 늘어납니다.",
  },
] as const;

const W = 360;
const H = 160;
const LEFT = 10;
const CELL_W = 30;
const GAP = (W - 2 * LEFT - CELLS.length * CELL_W) / (CELLS.length - 1);
const cx = (i: number) => LEFT + i * (CELL_W + GAP);
const ROW_Y = 44;
const CELL_H = 28;
const GRAPH_Y = 98;

export default function StateBoundaryViz() {
  return (
    <SceneShell
      eyebrow="상태 수명"
      title="chunk 경계는 값을 넘기고, sample 경계는 값을 지웁니다"
      description="칸 하나가 한 시점입니다. 위 줄의 연결선은 다음 시점으로 넘어가는 hidden·cell state 값, 아래 띠는 backward가 지나갈 수 있는 계산 graph입니다. Chunk 길이 3은 설명용 가정입니다."
      ariaLabel="truncated BPTT에서 chunk 경계의 carry와 detach, sample 경계의 reset, detach 생략 시 graph 증가"
      scenes={SCENES}
      render={(active) => {
        const graphSpans: Array<[number, number]> =
          active === 0 ? [[0, 2]] : active === 1 ? [[0, 2], [3, 5]] : active === 2 ? [[0, 2], [3, 5], [6, 8]] : [[0, 5]];
        const visibleUntil = active === 0 ? 2 : active === 1 || active === 3 ? 5 : 8;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={LEFT} y={20} fontSize={12} fill="#64748b">값 (h, c)</text>
            <text x={cx(0) + (3 * CELL_W + 2 * GAP) / 2} y={36} textAnchor="middle" fontSize={11} fill="#64748b">chunk 1</text>
            <text x={cx(3) + (3 * CELL_W + 2 * GAP) / 2} y={36} textAnchor="middle" fontSize={11} fill="#64748b">chunk 2</text>
            <text x={cx(6) + (3 * CELL_W + 2 * GAP) / 2} y={36} textAnchor="middle" fontSize={11} fill="#64748b">sample B</text>
            {CELLS.map((cell, i) => {
              const on = i <= visibleUntil;
              return (
                <g key={cell.label}>
                  <rect x={cx(i)} y={ROW_Y} width={CELL_W} height={CELL_H} rx={4} fill="none" stroke={on ? "#2563eb" : "#cbd5e1"} strokeWidth={1} strokeDasharray={on ? undefined : "3 3"} />
                  <text x={cx(i) + CELL_W / 2} y={ROW_Y + 18} textAnchor="middle" fontSize={12} fontWeight={600} fill={on ? "#2563eb" : "#94a3b8"}>{cell.label}</text>
                  {i < CELLS.length - 1 && (() => {
                    const x1 = cx(i) + CELL_W + 1;
                    const x2 = cx(i + 1) - 1;
                    const y = ROW_Y + CELL_H / 2;
                    const isSampleEdge = i === 5;
                    const shown = i + 1 <= visibleUntil;
                    if (!shown) return null;
                    if (isSampleEdge) {
                      return <text x={(x1 + x2) / 2} y={y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#d97706">0</text>;
                    }
                    const stroke = i === 2 && active === 1 ? "#16a34a" : "#64748b";
                    return <line x1={x1} x2={x2} y1={y} y2={y} stroke={stroke} strokeWidth={i === 2 && active === 1 ? 1.25 : 1} />;
                  })()}
                </g>
              );
            })}
            <text x={LEFT} y={GRAPH_Y - 8} fontSize={12} fill="#64748b">backward가 지나가는 graph</text>
            {graphSpans.map(([from, to]) => {
              const long = to - from > 2;
              return (
                <g key={`${from}-${to}`}>
                  <rect x={cx(from)} y={GRAPH_Y} width={cx(to) + CELL_W - cx(from)} height={16} rx={3} fill={long ? "#fde68a" : "#dbeafe"} stroke={long ? "#d97706" : "#2563eb"} strokeWidth={1} />
                  <text x={(cx(from) + cx(to) + CELL_W) / 2} y={GRAPH_Y + 12} textAnchor="middle" fontSize={11} fill={long ? "#92400e" : "#1e40af"}>
                    {long ? "graph 6시점 · 계속 늘어남" : `${to - from + 1}시점`}
                  </text>
                </g>
              );
            })}
            {active === 1 && (
              <text x={(cx(2) + CELL_W + cx(3)) / 2} y={GRAPH_Y + 34} textAnchor="middle" fontSize={11} fontWeight={700} fill="#16a34a">값 carry · graph detach</text>
            )}
            {active === 2 && (
              <text x={(cx(5) + CELL_W + cx(6)) / 2} y={GRAPH_Y + 34} textAnchor="middle" fontSize={11} fontWeight={700} fill="#d97706">h, c reset → 0</text>
            )}
            {active === 3 && (
              <text x={(cx(2) + CELL_W + cx(3)) / 2} y={GRAPH_Y + 34} textAnchor="middle" fontSize={11} fontWeight={700} fill="#d97706">detach 없음 → graph가 이어짐</text>
            )}
          </svg>
        );
      }}
    />
  );
}
