import VizFrame from "@/components/viz/VizFrame";
import { Controls } from "./PromptVizControls";
import { useScenes } from "./usePromptScenes";

const REASONING_SCENES = ["경로 생성", "답 집계", "외부 검증"] as const;

export function ReasoningPathsViz() {
  const scenes = useScenes(REASONING_SCENES.length);
  const paths = [
    { id: "A", answer: "42", tone: "border-sky-500 bg-sky-500/10" },
    { id: "B", answer: "40", tone: "border-amber-500 bg-amber-500/10" },
    { id: "C", answer: "42", tone: "border-emerald-500 bg-emerald-500/10" },
  ];

  return (
    <VizFrame
      eyebrow="Animated reasoning paths"
      title="자연어 풀이와 정답 판정을 같은 것으로 취급하지 않는다"
      description="여러 reasoning path를 만든 뒤 answer만 집계하고, 마지막에는 별도 verifier가 단위·근거·권한을 검사합니다."
      note="Agreement는 estimator의 결과이지 correctness certificate가 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Reasoning path and verifier animation"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.4fr_0.8fr] lg:items-center">
          <div className={`border p-5 text-center ${scenes.active === 0 ? "border-primary bg-primary/10" : "border-border"}`}>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-current text-2xl font-black">
              ?
            </div>
            <p className="mt-3 font-bold">Question</p>
            <p className="mt-1 text-xs text-muted-foreground">같은 입력 · K samples</p>
          </div>

          <div className="relative grid gap-3 sm:grid-cols-3">
            {paths.map((path) => (
              <div
                key={path.id}
                className={`border p-4 text-center ${path.tone} ${scenes.active === 0 ? "opacity-100" : "opacity-75"}`}
              >
                <p className="font-mono text-[10px] font-bold">PATH {path.id}</p>
                <div className="mx-auto my-4 h-10 w-px bg-current" />
                <p className="text-xs">step 1 → step 2</p>
                <p className="mt-3 text-xl font-black">{path.answer}</p>
                {scenes.active === 1 && path.answer === "42" ? (
                  <span className="mt-2 inline-block rounded-full border border-current px-2 py-1 text-[10px] font-bold">
                    vote
                  </span>
                ) : null}
              </div>
            ))}
          </div>

          <div className={`border p-5 ${scenes.active === 2 ? "border-primary bg-primary/10" : "border-border"}`}>
            <div className="grid grid-cols-[auto_1fr] items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center border border-current font-black">
                V
              </div>
              <div>
                <p className="font-bold">Verifier</p>
                <p className="text-xs text-muted-foreground">식 · 단위 · source span</p>
              </div>
            </div>
            <div className="mt-4 border-t border-current/30 pt-4 text-center">
              <p className="font-mono text-[10px]">SELECTED ANSWER</p>
              <p className="mt-2 text-2xl font-black">42</p>
            </div>
          </div>
        </div>
        <Controls {...scenes} labels={REASONING_SCENES} />
      </div>
    </VizFrame>
  );
}
