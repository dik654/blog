import { Fragment } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 배치 안 4개 (query, document) 쌍이 학습 전에는 공간에 흩어져 있다가,
 * in-batch negative InfoNCE loss의 attract/repel gradient를 받아 정답 쌍끼리 뭉치고
 * 다른 쌍과는 멀어지는 과정. 장면 = 학습 이전 → 유사도 판정 → gradient → 학습 이후.
 * Stage 높이는 고정, 좌표는 4장면 모두 같은 480×220 viewBox 안에 둔다.
 */
const SCENES = [
  "학습 전 · 배치 안 4쌍이 공간에 흩어져 있음",
  "유사도 판정 · 대각선만 positive",
  "Gradient · positive는 당기고 negative는 밀어냄",
  "학습 후 · 같은 쌍끼리 뭉치고 다른 쌍과 멀어짐",
] as const;

const NOTES = [
  "아직 fine-tuning 전이라 query와 자기 정답 document가 서로 멀리 있을 수 있습니다. 색은 어느 (query, document)가 진짜 정답 쌍인지를 나타낼 뿐 지금 거리와는 무관합니다.",
  "B×B similarity 행렬에서 대각선 4칸만 정답(positive)이고 나머지 12칸은 in-batch negative입니다. Negative는 추가로 고르지 않고 배치에 이미 있는 다른 쌍의 document를 그대로 씁니다.",
  "InfoNCE loss의 gradient는 각 query를 자기 정답 document 쪽으로 당기고(실선) 다른 document로부터는 밀어냅니다(점선). 이 예시는 Q1의 gradient만 표시했지만 나머지 세 query도 같은 방식으로 동시에 갱신됩니다.",
  "여러 step이 지나면 정답 쌍은 서로 가까운 작은 군집을 이루고, 군집끼리는 서로 멀어집니다. Recall·NDCG 같은 retrieval metric은 이 재배치가 실제로 일어났는지를 검증합니다.",
] as const;

type Point = { id: string; x: number; y: number; label: string };

const PAIR_COLOR = [
  "fill-primary stroke-primary",
  "fill-amber-600 stroke-amber-600",
  "fill-emerald-600 stroke-emerald-600",
  "fill-sky-600 stroke-sky-600",
] as const;

// 학습 전: 정답 쌍(같은 색)이 멀리 흩어져 있음.
const PRE: readonly Point[] = [
  { id: "q1", x: 70, y: 40, label: "Q1" },
  { id: "d1", x: 400, y: 190, label: "D1" },
  { id: "q2", x: 320, y: 30, label: "Q2" },
  { id: "d2", x: 90, y: 150, label: "D2" },
  { id: "q3", x: 430, y: 70, label: "Q3" },
  { id: "d3", x: 210, y: 20, label: "D3" },
  { id: "q4", x: 150, y: 200, label: "Q4" },
  { id: "d4", x: 360, y: 110, label: "D4" },
];

// 학습 후: 정답 쌍끼리 4개의 작은 군집으로 뭉침.
const POST: readonly Point[] = [
  { id: "q1", x: 75, y: 45, label: "Q1" },
  { id: "d1", x: 105, y: 70, label: "D1" },
  { id: "q2", x: 225, y: 35, label: "Q2" },
  { id: "d2", x: 255, y: 60, label: "D2" },
  { id: "q3", x: 365, y: 40, label: "Q3" },
  { id: "d3", x: 395, y: 65, label: "D3" },
  { id: "q4", x: 215, y: 165, label: "Q4" },
  { id: "d4", x: 250, y: 190, label: "D4" },
];

function byId(points: readonly Point[]) {
  return new Map(points.map((point) => [point.id, point] as const));
}

export default function EmbeddingModelFineTuningViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="In-batch negative fine-tuning"
      title="정답 (query, document) 쌍은 뭉치고 나머지 배치 쌍과는 멀어집니다"
      description="네 가지 색은 배치 안 네 개의 정답 (query, document) 쌍입니다. 학습 전/후는 설명을 위한 배치이며 실제 embedding 좌표가 아닙니다."
      note="배치 크기는 4로 줄여 그렸습니다. 본문 수치 예(배치 256 · negative 255개)는 이 그림의 4쌍·12칸 negative를 그대로 키운 것입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="배치 안 positive·negative pair가 학습으로 재배치되는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(34rem,calc(100dvh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[active]}</h4>

          <div className="mt-4 min-w-0 overflow-x-auto border border-border">
            {active === 1 ? (
              <SimilarityMatrix />
            ) : (
              <ScatterSpace points={active === 3 ? POST : PRE} showGradient={active === 2} />
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-muted-foreground">
            {["Q1·D1", "Q2·D2", "Q3·D3", "Q4·D4"].map((label, index) => (
              <span key={label} className="flex items-center gap-1">
                <span className={`inline-block h-2 w-2 rounded-full ${PAIR_COLOR[index].split(" ")[0]}`} />
                {label}
              </span>
            ))}
          </div>

          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

function ScatterSpace({ points, showGradient }: { points: readonly Point[]; showGradient: boolean }) {
  const map = byId(points);
  const q1 = map.get("q1")!;
  const others = ["d1", "d2", "d3", "d4"].map((id) => map.get(id)!);

  return (
    <svg viewBox="0 0 480 220" className="h-[13.5rem] w-full min-w-[26rem]" role="img" aria-label="embedding 공간의 query·document 배치">
      <rect x={1} y={1} width={478} height={218} className="fill-none stroke-border" strokeWidth={1} />
      {showGradient &&
        others.map((target, index) => {
          const isPositive = index === 0;
          return (
            <line
              key={target.id}
              x1={q1.x}
              y1={q1.y}
              x2={target.x}
              y2={target.y}
              className={isPositive ? "stroke-primary" : "stroke-muted-foreground"}
              strokeWidth={1}
              strokeDasharray={isPositive ? undefined : "3 3"}
            />
          );
        })}
      {points.map((point, index) => {
        const pairIndex = Math.floor(index / 2);
        const classes = PAIR_COLOR[pairIndex];
        const isQuery = point.id.startsWith("q");
        return (
          <g key={point.id}>
            <circle
              cx={point.x}
              cy={point.y}
              r={isQuery ? 7 : 6}
              className={`${classes} ${isQuery ? "" : "fill-opacity-30"}`}
              strokeWidth={1.25}
            />
            <text x={point.x} y={point.y - 11} textAnchor="middle" className="fill-foreground text-[9px] font-bold">
              {point.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function SimilarityMatrix() {
  const queries = ["Q1", "Q2", "Q3", "Q4"];
  const docs = ["D1", "D2", "D3", "D4"];
  return (
    <div className="grid grid-cols-[2.5rem_repeat(4,1fr)] gap-1 p-3">
      <div />
      {docs.map((doc) => (
        <div key={doc} className="text-center text-[9px] font-bold text-muted-foreground">
          {doc}
        </div>
      ))}
      {queries.map((query, rowIndex) => (
        <Fragment key={query}>
          <div className="flex items-center text-[9px] font-bold text-muted-foreground">
            {query}
          </div>
          {docs.map((_, colIndex) => {
            const isPositive = rowIndex === colIndex;
            return (
              <div
                key={`${query}-${colIndex}`}
                className={`flex h-9 items-center justify-center border text-[8px] font-bold ${
                  isPositive
                    ? "border-primary/60 bg-primary/15 text-foreground"
                    : "border-border bg-muted/40 text-muted-foreground"
                }`}
              >
                {isPositive ? "pos" : "neg"}
              </div>
            );
          })}
        </Fragment>
      ))}
    </div>
  );
}
