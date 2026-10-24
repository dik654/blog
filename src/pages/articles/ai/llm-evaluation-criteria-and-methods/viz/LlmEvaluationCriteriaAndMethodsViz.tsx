import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 같은 5개 output 을 functional correctness(실행 pass/fail)와
 * semantic similarity(임베딩 코사인 유사도)로 각각 재면 순위가 달라진다는 것.
 * stage 높이는 네 장면 모두 같은 행(output·functional·semantic)을 그리고
 * 값만 채워 넣어 고정한다.
 */
const SCENES = ["출력 5개", "실행 판정", "의미 거리", "신호 충돌"] as const;

const NOTES = [
  "코드 생성 문제 하나에서 나온 출력 다섯 개를 아직 채점하지 않은 상태입니다.",
  "직접 실행하면 O1·O2·O5가 통과합니다. 실행 통과율은 3/5=0.60입니다.",
  "같은 출력을 참조 답과의 임베딩 유사도로 재면 0부터 1 사이의 연속값이 나옵니다.",
  "O2는 실행에 성공했지만 0.55이고, O3는 실패했지만 0.85입니다. 두 지표가 다른 질문에 답합니다.",
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
  const scenes = useAnimatedScenes(SCENES.length, 6200);
  const scene = scenes.active;
  return (
    <VizFrame
      eyebrow="Functional correctness · semantic similarity evaluation"
      title="같은 output 5개를 실행 결과와 임베딩 거리로 각각 재면 순위가 갈립니다"
      description="위 행은 output, 가운데 행은 functional correctness(pass/fail), 아래 행은 semantic similarity(임베딩 유사도)입니다."
      note="실제로는 model 이 수십~수백 개 sample 을 내고 pass@k 는 k 개 중 하나라도 통과하면 성공으로 셉니다. 그림은 5개로 단순화했습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        data-viz-scene="evaluation-measurement-contract-viz"
        data-story-index={scenes.active}
        tabIndex={0}
        role="group"
        aria-label="Functional correctness 와 semantic similarity evaluation 의 순위 불일치"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(32rem,calc(100svh-15rem))] min-h-[25rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scene + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>
          <div className="mt-4 border border-border p-3">
            <div className="grid grid-cols-5 gap-1 sm:hidden" aria-label="출력 다섯 개의 실행 판정과 의미 유사도 비교">
              {CANDIDATES.map((candidate) => {
                const highlight = scene === 3 && DISAGREEMENT.has(candidate.id);
                return (
                  <div key={candidate.id} className={`min-w-0 border px-1 py-2 text-center ${highlight ? "border-primary bg-primary/10" : "border-border"}`}>
                    <p className="font-mono text-[10px] font-black">{candidate.id}</p>
                    <p className={`mt-2 text-[9px] font-bold ${scene >= 1 ? (candidate.pass ? "text-primary" : "text-red-600") : "text-muted-foreground"}`}>
                      {scene >= 1 ? (candidate.pass ? "PASS" : "FAIL") : "대기"}
                    </p>
                    <div className="mx-auto mt-2 flex h-14 w-5 items-end border-b border-border">
                      <div className={`w-full ${highlight ? "bg-primary/70" : "bg-muted-foreground/50"}`} style={{ height: scene >= 2 ? `${candidate.sem * 100}%` : 0 }} />
                    </div>
                    <p className="mt-1 font-mono text-[9px] text-muted-foreground">{scene >= 2 ? candidate.sem.toFixed(2) : "–"}</p>
                  </div>
                );
              })}
            </div>
            <svg viewBox="0 0 480 196" className="mx-auto hidden h-auto w-full max-w-[28rem] sm:block" role="img" aria-label="5개 output 의 functional correctness 와 semantic similarity 비교">
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
        <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">
          {SCENES.map((label, index) => (
            <li key={label}>
              <strong>{String(index + 1).padStart(2, "0")} · {label}</strong>
              <span className="mt-1 block text-muted-foreground">{NOTES[index]}</span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}
