import SceneShell from "./SceneShell";

/**
 * 본문 대응: #multiplication (8절) — (PQ)R과 P(QR)의 곱셈 수.
 * P 10×100, Q 100×5, R 5×50. 밀집 곱 a×b · b×c의 곱셈 수 = a·b·c.
 * (PQ)R: 10·100·5=5,000 → 10×5, 10·5·50=2,500 → 합 7,500
 * P(QR): 100·5·50=25,000 → 100×50, 10·100·50=50,000 → 합 75,000
 */
type Block = { name: string; rows: number; cols: number; tone: "input" | "mid" | "out" };

const SCENES = [
  {
    label: "세 표의 모양",
    summary: "10×100 · 100×5 · 5×50",
    note: "P는 10행 100열, Q는 100행 5열, R은 5행 50열입니다. 직사각형의 가로·세로를 행·열 수에 비례해 그렸습니다. 어느 쪽을 먼저 묶어도 최종 결과는 10×50입니다.",
    blocks: [
      { name: "P", rows: 10, cols: 100, tone: "input" },
      { name: "Q", rows: 100, cols: 5, tone: "input" },
      { name: "R", rows: 5, cols: 50, tone: "input" },
    ] as readonly Block[],
    left: 0,
    right: 0,
  },
  {
    label: "(PQ) 먼저",
    summary: "10×100×5 = 5,000",
    note: "P와 Q를 먼저 곱하면 결과 10×5의 50칸마다 가운데 100개를 곱합니다. 10×100×5=5,000번이며 중간 결과는 아주 작은 10×5 표입니다.",
    blocks: [
      { name: "PQ", rows: 10, cols: 5, tone: "mid" },
      { name: "R", rows: 5, cols: 50, tone: "input" },
    ] as readonly Block[],
    left: 5000,
    right: 0,
  },
  {
    label: "(PQ)R 완료",
    summary: "5,000 + 2,500 = 7,500",
    note: "작은 10×5에 R을 곱하면 10×5×50=2,500번이 더 듭니다. 왼쪽 묶음의 합계는 7,500번입니다.",
    blocks: [{ name: "(PQ)R", rows: 10, cols: 50, tone: "out" }] as readonly Block[],
    left: 7500,
    right: 0,
  },
  {
    label: "(QR) 먼저",
    summary: "100×5×50 = 25,000",
    note: "Q와 R을 먼저 곱하면 중간 결과가 100×50으로 커집니다. 그 5,000칸마다 가운데 5개를 곱해 25,000번입니다.",
    blocks: [
      { name: "P", rows: 10, cols: 100, tone: "input" },
      { name: "QR", rows: 100, cols: 50, tone: "mid" },
    ] as readonly Block[],
    left: 7500,
    right: 25000,
  },
  {
    label: "P(QR) 완료",
    summary: "25,000 + 50,000 = 75,000",
    note: "큰 100×50을 P가 읽으면 10×100×50=50,000번이 더 듭니다. 같은 10×50 결과에 왼쪽 묶음의 10배인 75,000번을 씁니다. 곱셈 수를 센 것이며 실행 시간 측정은 아닙니다.",
    blocks: [{ name: "P(QR)", rows: 10, cols: 50, tone: "out" }] as readonly Block[],
    left: 7500,
    right: 75000,
  },
] as const;

const PX = 1.15; // 한 행·열의 길이(px)
const FILL = { input: "#e2e8f0", mid: "#fde68a", out: "#bfdbfe" } as const;
const STROKE = { input: "#64748b", mid: "#d97706", out: "#2563eb" } as const;
const MAX_COST = 75000;

function CostBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_4.25rem] items-center gap-2 text-xs sm:text-sm">
      <span className="font-semibold">{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(value / MAX_COST) * 100}%`, backgroundColor: color }} />
      </div>
      <span className="text-right font-mono">{value.toLocaleString("en-US")}</span>
    </div>
  );
}

export default function ChainOrderCostViz() {
  return (
    <SceneShell
      eyebrow="곱하는 묶음의 순서"
      title="같은 결과라도 중간 표가 크면 곱셈이 10배로 늘어납니다"
      description="a×b 표와 b×c 표의 일반적인 밀집 곱은 결과 a×c의 각 칸마다 가운데 b개를 곱하므로 곱셈 a×b×c번이 듭니다. 아래 막대는 지금까지 쓴 곱셈 수의 누적입니다."
      ariaLabel="(PQ)R과 P(QR)의 중간 표 크기와 곱셈 수 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="flex h-[150px] min-w-0 items-start justify-center gap-4 overflow-hidden">
              {scene.blocks.map((b) => (
                <div key={b.name} className="flex flex-col items-center gap-1">
                  <svg width={b.cols * PX + 2} height={b.rows * PX + 2} aria-hidden>
                    <rect x={1} y={1} width={b.cols * PX} height={b.rows * PX} fill={FILL[b.tone]} stroke={STROKE[b.tone]} strokeWidth={1} />
                  </svg>
                  <span className="whitespace-nowrap font-mono text-xs">
                    <span className="font-bold">{b.name}</span> {b.rows}×{b.cols}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              <CostBar label="(PQ)R" value={scene.left} color="#2563eb" />
              <CostBar label="P(QR)" value={scene.right} color="#d97706" />
            </div>
          </div>
        );
      }}
    />
  );
}
