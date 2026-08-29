import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: tree search 가 후보를 넓히고(branching k=3) 평가한 뒤 상위 b=2 개만 남겨
 * 가지치기하고, 남은 상태에서 다시 넓혀 최종 후보를 고르는 과정. Best-of-N 은 이 tree 의
 * depth 1 짜리 특수한 경우로 note 에서 대비한다. Stage 높이는 다섯 장면의 최대치로 고정한다.
 */
const SCENES = ["Depth 1 후보 생성", "점수 평가", "상위 b=2 유지·가지치기", "유지 상태에서 재확장", "최종 후보 선택"] as const;

const NOTES = [
  "Root 에서 k=3 개 후보 A, B, C 를 만듭니다. Best-of-N 이었다면 이 단계에서 N 개를 한 번에 만들고 depth 를 더 늘리지 않습니다.",
  "Evaluator 가 각 후보에 점수를 매깁니다. B=0.7 이 가장 높고 C=0.3 이 가장 낮습니다.",
  "점수 상위 b=2 개인 A, B 만 다음 depth 로 남기고 C 는 버립니다(점선). Best-of-N 에는 이 가지치기가 없습니다.",
  "남은 A, B 각각에서 다시 k=3 개씩 만들어 6개 후보를 평가합니다. Depth 가 늘수록 평가 수는 b·k 씩 늘어납니다.",
  "6개 중 B2=0.9 가 가장 높아 최종 후보로 선택됩니다. 나머지 5개와 그 KV·중간 상태는 버려집니다.",
] as const;

type Node = { id: string; x: number; y: number; depth: number; parent: string | null; score?: number };
const NODES: readonly Node[] = [
  { id: "r", x: 100, y: 16, depth: 0, parent: null },
  { id: "A", x: 55, y: 62, depth: 1, parent: "r", score: 0.4 },
  { id: "B", x: 100, y: 62, depth: 1, parent: "r", score: 0.7 },
  { id: "C", x: 145, y: 62, depth: 1, parent: "r", score: 0.3 },
  { id: "A1", x: 15, y: 118, depth: 2, parent: "A", score: 0.5 },
  { id: "A2", x: 40, y: 118, depth: 2, parent: "A", score: 0.3 },
  { id: "A3", x: 65, y: 118, depth: 2, parent: "A", score: 0.6 },
  { id: "B1", x: 100, y: 118, depth: 2, parent: "B", score: 0.4 },
  { id: "B2", x: 125, y: 118, depth: 2, parent: "B", score: 0.9 },
  { id: "B3", x: 150, y: 118, depth: 2, parent: "B", score: 0.2 },
];
const KEPT_DEPTH1 = ["A", "B"];
const WINNER = "B2";

export default function SearchBasedReasoningAndTestTimeComputeViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  const scene = scenes.active;

  const visibleDepth1 = scene >= 0;
  const showScoresDepth1 = scene >= 1;
  const pruned = scene >= 2;
  const visibleDepth2 = scene >= 3;
  const showScoresDepth2 = scene >= 3;
  const selected = scene >= 4;

  return (
    <VizFrame
      eyebrow="Tree search · best-of-N 대비"
      title="후보가 branching 으로 넓어지고 점수로 가지치기되어 최종 후보 하나만 남습니다"
      description="원이 후보 상태, 숫자가 evaluator 점수입니다. 점선은 가지치기로 버려진 후보입니다."
      note="실제 tree 는 depth 와 branching 이 더 크고 evaluator 호출도 그만큼 늘어납니다. 그림은 b=2, k=3, d=2 로 단순화했습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Tree search 의 후보 확장과 가지치기 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(34rem,calc(100dvh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scene + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>
          <div className="mt-4 border border-border p-3">
            <svg viewBox="0 0 200 140" className="mx-auto h-auto w-full max-w-[20rem]" role="img" aria-label="후보 tree 의 확장과 가지치기">
              {NODES.filter((n) => n.parent).map((n) => {
                const isDepth2 = n.depth === 2;
                if (isDepth2 && !visibleDepth2) return null;
                if (n.depth === 1 && !visibleDepth1) return null;
                const parent = NODES.find((p) => p.id === n.parent)!;
                const discardedEdge = n.depth === 1 && pruned && !KEPT_DEPTH1.includes(n.id);
                return (
                  <line
                    key={`e-${n.id}`}
                    x1={parent.x}
                    y1={parent.y + 10}
                    x2={n.x}
                    y2={n.y - 10}
                    strokeWidth={1}
                    strokeDasharray={discardedEdge ? "2 3" : undefined}
                    className={discardedEdge ? "stroke-border" : "stroke-muted-foreground"}
                  />
                );
              })}
              {NODES.map((n) => {
                if (n.depth === 1 && !visibleDepth1) return null;
                if (n.depth === 2 && !visibleDepth2) return null;
                const discarded = n.depth === 1 && pruned && !KEPT_DEPTH1.includes(n.id);
                const isWinner = selected && n.id === WINNER;
                const showScore = (n.depth === 1 && showScoresDepth1) || (n.depth === 2 && showScoresDepth2);
                return (
                  <g key={n.id}>
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={10}
                      strokeWidth={1}
                      strokeDasharray={discarded ? "2 3" : undefined}
                      className={
                        isWinner
                          ? "fill-primary/25 stroke-primary"
                          : discarded
                            ? "fill-transparent stroke-border"
                            : "fill-transparent stroke-muted-foreground"
                      }
                    />
                    <text x={n.x} y={n.y + 3} textAnchor="middle" className={`font-mono text-[7px] ${discarded ? "fill-muted-foreground" : "fill-foreground"}`}>
                      {n.id}
                    </text>
                    {showScore && n.score !== undefined && (
                      <text x={n.x} y={n.y + 20} textAnchor="middle" className={`font-mono text-[7px] ${isWinner ? "fill-primary" : "fill-muted-foreground"}`}>
                        {n.score.toFixed(1)}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
            <p className="mt-1 text-center font-mono text-[10px] text-muted-foreground">
              {scene === 0 && "평가 3회"}
              {scene === 1 && "평가 3회 · 점수 부여 완료"}
              {scene === 2 && "유지 2 · 폐기 1"}
              {scene === 3 && "이번 depth 평가 6회 · 누적 9회"}
              {scene === 4 && "최종 선택 B2=0.9 · 누적 평가 9회"}
            </p>
          </div>
          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scene]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
