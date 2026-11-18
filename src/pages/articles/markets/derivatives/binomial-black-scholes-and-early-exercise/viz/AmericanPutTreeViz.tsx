import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case·#picture — 두 기간 나무를 만기에서 오늘로 거꾸로 접는다.
 * 주가 100, 상승 1.2·하락 0.8, 한 기간 증가율 1.05, 가격 가중치 0.625·0.375, 행사가 100 풋.
 * 120: (0.625×0+0.375×4)÷1.05=1.43 > 행사 0 → 기다림
 * 80:  (0.625×4+0.375×36)÷1.05=15.24 < 행사 20 → 행사
 * 오늘 미국형: (0.625×1.43+0.375×20)÷1.05=7.99, 유럽형: (0.625×1.43+0.375×15.24)÷1.05=6.29
 */
type NodeId = "today" | "up" | "down" | "uu" | "ud" | "dd";
type NodeState = "pending" | "payoff" | "hold" | "exercise";

const NODES: readonly { id: NodeId; s: number; x: number; y: number }[] = [
  { id: "today", s: 100, x: 48, y: 110 },
  { id: "up", s: 120, x: 180, y: 62 },
  { id: "down", s: 80, x: 180, y: 158 },
  { id: "uu", s: 144, x: 312, y: 26 },
  { id: "ud", s: 96, x: 312, y: 110 },
  { id: "dd", s: 64, x: 312, y: 194 },
];

const EDGES: readonly [NodeId, NodeId][] = [
  ["today", "up"],
  ["today", "down"],
  ["up", "uu"],
  ["up", "ud"],
  ["down", "ud"],
  ["down", "dd"],
];

const COLOR: Record<NodeState, string> = {
  pending: "#94a3b8",
  payoff: "#475569",
  hold: "#2563eb",
  exercise: "#d97706",
};

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  values: Record<NodeId, string>;
  states: Record<NodeId, NodeState>;
  focus: NodeId | null;
  cells: readonly [string, string][];
}[] = [
  {
    label: "만기 지급",
    summary: "144·96·64 → 0·4·36",
    note: "두 기간 뒤 주가는 144, 96, 64 셋입니다. 행사가 100인 풋은 100에서 주가를 뺀 값을 받되 음수면 0이므로 0, 4, 36입니다. 계산은 여기서 시작해 왼쪽으로 갑니다.",
    values: { today: "?", up: "?", down: "?", uu: "0", ud: "4", dd: "36" },
    states: { today: "pending", up: "pending", down: "pending", uu: "payoff", ud: "payoff", dd: "payoff" },
    focus: null,
    cells: [["주가 144", "0"], ["주가 96", "4"], ["주가 64", "36"]],
  },
  {
    label: "주가 120: 기다림",
    summary: "(0.625×0+0.375×4)÷1.05≈1.43",
    note: "위 갈래 지급 0에 0.625, 아래 갈래 지급 4에 0.375를 곱해 더하고 1.05로 나누면 기다린 가치 약 1.43입니다. 지금 행사하면 100−120이 음수라 0이므로 기다립니다.",
    values: { today: "?", up: "1.43", down: "?", uu: "0", ud: "4", dd: "36" },
    states: { today: "pending", up: "hold", down: "pending", uu: "payoff", ud: "payoff", dd: "payoff" },
    focus: "up",
    cells: [["기다린 가치", "1.43"], ["지금 행사", "0"], ["남기는 값", "1.43 (기다림)"]],
  },
  {
    label: "주가 80: 행사",
    summary: "기다림 15.24 < 행사 20",
    note: "다음 지급 4와 36으로 계산한 기다린 가치는 (0.625×4+0.375×36)÷1.05≈15.24입니다. 지금 행사하면 100−80=20을 받으므로 20이 남습니다. 유럽형이라면 이 칸에 15.24가 남습니다.",
    values: { today: "?", up: "1.43", down: "20", uu: "0", ud: "4", dd: "36" },
    states: { today: "pending", up: "hold", down: "exercise", uu: "payoff", ud: "payoff", dd: "payoff" },
    focus: "down",
    cells: [["기다린 가치", "15.24"], ["지금 행사", "20"], ["남기는 값", "20 (행사)"]],
  },
  {
    label: "오늘 가격",
    summary: "미국형 7.99 · 유럽형 6.29",
    note: "미국형은 1.43과 20을, 유럽형은 1.43과 15.24를 같은 가중치로 오늘에 할인합니다. 차이 약 1.70은 주가 80 칸에서 20을 고를 수 있는 권리에서 나옵니다. 오늘 바로 행사하면 0이므로 오늘은 기다립니다.",
    values: { today: "7.99", up: "1.43", down: "20", uu: "0", ud: "4", dd: "36" },
    states: { today: "hold", up: "hold", down: "exercise", uu: "payoff", ud: "payoff", dd: "payoff" },
    focus: "today",
    cells: [["미국형 오늘", "7.99"], ["유럽형 오늘", "6.29"], ["차이", "약 1.70"]],
  },
];

const BOX_W = 80;
const BOX_H = 42;

function nodeOf(id: NodeId) {
  return NODES.find((node) => node.id === id) ?? NODES[0];
}

export default function AmericanPutTreeViz() {
  return (
    <SceneShell
      eyebrow="거꾸로 접기"
      title="만기 지급에서 오늘 가격까지 나무를 접습니다"
      description="칸 위 숫자는 주가, 아래 숫자는 그 칸의 풋 가치입니다. 위 갈래에 0.625, 아래 갈래에 0.375를 곱하는 것은 2절의 가격 가중치이며 실제로 오를 확률이 아닙니다. 파란 칸은 기다림, 주황 칸은 바로 행사(칸 아래에 글자로도 적음), 점선 칸은 아직 계산 전이며 수치는 본문의 설명용 가정입니다."
      ariaLabel="두 기간 이항 나무에서 미국형 풋을 만기부터 오늘까지 역진 계산하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 240" className="mx-auto h-auto w-full max-w-[400px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {EDGES.map(([from, to]) => {
                const a = nodeOf(from);
                const b = nodeOf(to);
                const lit = scene.focus === from;
                return (
                  <line
                    key={`${from}-${to}`}
                    x1={a.x + BOX_W / 2}
                    y1={a.y}
                    x2={b.x - BOX_W / 2}
                    y2={b.y}
                    stroke={lit ? "#2563eb" : "#cbd5e1"}
                    strokeWidth={lit ? 1.25 : 1}
                  />
                );
              })}
              {NODES.map((node) => {
                const state = scene.states[node.id];
                const focused = scene.focus === node.id;
                return (
                  <g key={node.id}>
                    <rect
                      x={node.x - BOX_W / 2}
                      y={node.y - BOX_H / 2}
                      width={BOX_W}
                      height={BOX_H}
                      rx={6}
                      fill="none"
                      stroke={COLOR[state]}
                      strokeWidth={focused ? 1.25 : 1}
                      strokeDasharray={state === "pending" ? "3 3" : undefined}
                    />
                    <text x={node.x} y={node.y - 4} textAnchor="middle" fontSize={12} fill="#64748b">
                      주가 {node.s}
                    </text>
                    <text x={node.x} y={node.y + 14} textAnchor="middle" fontSize={14} fontWeight={700} fill={COLOR[state]}>
                      {scene.values[node.id]}
                    </text>
                    {(state === "hold" || state === "exercise") && (
                      <text x={node.x} y={node.y + BOX_H / 2 + 13} textAnchor="middle" fontSize={12} fontWeight={600} fill={COLOR[state]}>
                        {state === "hold" ? "기다림" : "행사"}
                      </text>
                    )}
                  </g>
                );
              })}
              <text x={48} y={236} textAnchor="middle" fontSize={12} fill="#64748b">오늘</text>
              <text x={180} y={236} textAnchor="middle" fontSize={12} fill="#64748b">중간</text>
              <text x={312} y={236} textAnchor="middle" fontSize={12} fill="#64748b">만기</text>
            </svg>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {scene.cells.map(([label, value]) => (
                <div key={label} className="rounded-lg border border-border bg-background px-2 py-2 text-center">
                  <span className="block text-xs text-muted-foreground">{label}</span>
                  <span className="block font-mono text-sm font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
