import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 같은 5개 output 을 functional correctness(실행 pass/fail)와
 * semantic similarity(임베딩 코사인 유사도)로 각각 재면 순위가 달라진다는 것.
 * stage 높이는 네 장면 모두 같은 행(output·functional·semantic)을 그리고
 * 값만 채워 넣어 고정한다.
 */
const SCENES = ["같은 질문, 5개 output", "Functional correctness: pass/fail", "Semantic similarity: 임베딩 거리", "같은 output, 다른 신호"] as const;

const NOTES = [
  "코드 생성 문제 하나에 대해 model 이 낸 output 5개입니다. 아직 채점 전이라 다섯 개 모두 같은 상자로 보입니다.",
  "각 output 을 실행해 unit test 를 통과하는지만 봅니다. O1·O2·O5 가 통과해 pass@1 근사치는 3/5=0.60 이고 부분 점수는 없습니다.",
  "같은 output 을 reference 와의 embedding 코사인 유사도로 다시 잽니다. 점수는 0~1 사이 연속값이고 표현이 비슷할수록 높습니다.",
  "O2 는 통과했지만 표현이 달라 유사도가 낮고(0.55), O3 는 실패했지만 표현이 비슷해 유사도가 높습니다(0.85). 두 metric 이 같은 output 에 다른 순위를 매기는 지점입니다.",
] as const;

type Candidate = { id: string; pass: boolean; sem: number };
const CANDIDATES: readonly Candidate[] = [
  { id: "O1", pass: true, sem: 0.95 },
  { id: "O2", pass: true, sem: 0.55 },
  { id: "O3", pass: false, sem: 0.85 },
  { id: "O4", pass: false, sem: 0.2 },
  { id: "O5", pass: true, sem: 0.6 },
];
const PASS_AT_1 = CANDIDATES.filter((c) => c.pass).length / CANDIDATES.length;
const AVG_SEM = CANDIDATES.reduce((sum, c) => sum + c.sem, 0) / CANDIDATES.length;
const DISAGREEMENT = new Set(["O2", "O3"]);

const COL_X = [58, 148, 238, 328, 418];
const BAR_MAX = 76;
const BAR_BASE = 176;

export default function LlmEvaluationCriteriaAndMethodsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  const scene = scenes.active;
  return (
    <VizFrame
      eyebrow="Functional correctness · semantic similarity evaluation"
      title="같은 output 5개를 실행 결과와 임베딩 거리로 각각 재면 순위가 갈립니다"
      description="위 행은 output, 가운데 행은 functional correctness(pass/fail), 아래 행은 semantic similarity(임베딩 유사도)입니다."
      note="실제로는 model 이 수십~수백 개 sample 을 내고 pass@k 는 k 개 중 하나라도 통과하면 성공으로 셉니다. 그림은 5개로 단순화했습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Functional correctness 와 semantic similarity evaluation 의 순위 불일치"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(32rem,calc(100dvh-15rem))] min-h-[25rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scene + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>
          <div className="mt-4 border border-border p-3">
            <svg viewBox="0 0 480 196" className="mx-auto h-auto w-full max-w-[28rem]" role="img" aria-label="5개 output 의 functional correctness 와 semantic similarity 비교">
              <text x={8} y={12} className="fill-muted-foreground font-mono text-[8px]">Output</text>
              <text x={8} y={54} className="fill-muted-foreground font-mono text-[8px]">Functional (실행)</text>
              <text x={8} y={96} className="fill-muted-foreground font-mono text-[8px]">Semantic (임베딩)</text>

              {CANDIDATES.map((c, i) => {
                const x = COL_X[i];
                const highlight = scene === 3 && DISAGREEMENT.has(c.id);
                const barH = scene >= 2 ? c.sem * BAR_MAX : 0;
                return (
                  <g key={c.id}>
                    <rect
                      x={x - 28}
                      y={18}
                      width={56}
                      height={24}
                      strokeWidth={1}
                      className={highlight ? "fill-primary/10 stroke-primary" : "fill-transparent stroke-border"}
                    />
                    <text x={x} y={34} textAnchor="middle" className="fill-foreground font-mono text-[9px]">
                      {c.id}
                    </text>

                    <rect
                      x={x - 28}
                      y={60}
                      width={56}
                      height={20}
                      strokeWidth={1}
                      strokeDasharray={scene >= 1 ? undefined : "2 3"}
                      className={
                        scene >= 1
                          ? c.pass
                            ? "fill-primary/20 stroke-primary"
                            : "fill-transparent stroke-red-600"
                          : "fill-transparent stroke-border"
                      }
                    />
                    <text
                      x={x}
                      y={74}
                      textAnchor="middle"
                      className={`font-mono text-[8px] ${scene >= 1 ? (c.pass ? "fill-primary" : "fill-red-600") : "fill-muted-foreground"}`}
                    >
                      {scene >= 1 ? (c.pass ? "PASS" : "FAIL") : "…"}
                    </text>

                    <rect
                      x={x - 14}
                      y={BAR_BASE - barH}
                      width={28}
                      height={barH}
                      className={highlight ? "fill-primary/70" : "fill-muted-foreground/50"}
                    />
                    <line x1={x - 28} y1={BAR_BASE} x2={x + 28} y2={BAR_BASE} strokeWidth={1} className="stroke-border" />
                    <text x={x} y={190} textAnchor="middle" className="fill-muted-foreground font-mono text-[8px]">
                      {scene >= 2 ? c.sem.toFixed(2) : "–"}
                    </text>
                  </g>
                );
              })}
            </svg>
            <p className="mt-1 text-center font-mono text-[10px] text-muted-foreground">
              {scene === 0
                ? "채점 전"
                : scene === 1
                  ? `pass@1 = 3/5 = ${PASS_AT_1.toFixed(2)}`
                  : scene === 2
                    ? `평균 semantic 유사도 ≈ ${AVG_SEM.toFixed(2)}`
                    : "O2: PASS·0.55 · O3: FAIL·0.85 — 두 metric 의 순위가 엇갈립니다"}
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
