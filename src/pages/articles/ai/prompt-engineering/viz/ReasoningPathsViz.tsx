import VizFrame from "@/components/viz/VizFrame";
import { Controls } from "./PromptVizControls";
import { useScenes } from "./usePromptScenes";

const REASONING_SCENES = ["경로 생성", "답 집계", "외부 검증"] as const;
const REASONING_NOTES = [
  "같은 질문에서 서로 다른 reasoning path A·B·C를 생성합니다.",
  "Path 문장을 섞지 않고 최종 answer만 세면 42가 두 표를 얻습니다.",
  "다수가 고른 42도 식·단위·source span을 외부 verifier가 다시 판정합니다.",
] as const;

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
        id={scenes.playbackId}
        data-viz-canvas
        data-viz-scene="prompt-reasoning-paths-viz"
        data-story-index={scenes.active}
        tabIndex={0}
        role="group"
        aria-label="Reasoning path and verifier animation"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div data-viz-live-only className="grid flex-1 items-center">
        <div className="grid grid-cols-[4rem_minmax(0,1fr)_5rem] items-stretch gap-2 sm:grid-cols-[0.8fr_1.4fr_0.8fr] sm:items-center sm:gap-5">
          <div className={`min-w-0 border px-1.5 py-3 text-center sm:p-5 ${scenes.active === 0 ? "border-primary bg-primary/10" : "border-border"}`}>
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-current text-lg font-black sm:h-14 sm:w-14 sm:text-2xl">
              ?
            </div>
            <p className="mt-2 break-keep text-[11px] font-bold sm:mt-3 sm:text-base">Question</p>
            <p className="mt-1 hidden text-xs text-muted-foreground sm:block">같은 입력 · K samples</p>
          </div>

          <div className="relative grid grid-cols-3 gap-1.5 sm:gap-3">
            {paths.map((path) => (
              <div
                key={path.id}
                className={`min-w-0 border px-1 py-3 text-center sm:p-4 ${path.tone} ${scenes.active === 0 ? "opacity-100" : "opacity-75"}`}
              >
                <p className="font-mono text-[9px] font-bold sm:text-[10px]">PATH {path.id}</p>
                <div className="mx-auto my-2 h-6 w-px bg-current sm:my-4 sm:h-10" />
                <p className="hidden text-xs sm:block">step 1 → step 2</p>
                <p className="mt-2 whitespace-nowrap text-base font-black sm:mt-3 sm:text-xl">{path.answer}</p>
                {scenes.active === 1 && path.answer === "42" ? (
                  <span className="mt-2 inline-block rounded-full border border-current px-2 py-1 text-[10px] font-bold">
                    vote
                  </span>
                ) : null}
              </div>
            ))}
          </div>

          <div className={`min-w-0 border px-1.5 py-3 sm:p-5 ${scenes.active === 2 ? "border-primary bg-primary/10" : "border-border"}`}>
            <div className="grid gap-2 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-3">
              <div className="flex h-8 w-8 items-center justify-center border border-current text-xs font-black sm:h-12 sm:w-12 sm:text-base">
                V
              </div>
              <div>
                <p className="break-keep text-[11px] font-bold sm:text-base">Verifier</p>
                <p className="hidden text-xs text-muted-foreground sm:block">식 · 단위 · source span</p>
              </div>
            </div>
            <div className="mt-3 border-t border-current/30 pt-3 text-center sm:mt-4 sm:pt-4">
              <p className="hidden font-mono text-[10px] sm:block">SELECTED ANSWER</p>
              <p className="text-xl font-black sm:mt-2 sm:text-2xl">42</p>
            </div>
          </div>
        </div>
        </div>
        <Controls {...scenes} labels={REASONING_SCENES} />
        <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">
          {REASONING_SCENES.map((label, index) => (
            <li key={label}>
              <strong>{String(index + 1).padStart(2, "0")} · {label}</strong>
              <span className="mt-1 block text-muted-foreground">{REASONING_NOTES[index]}</span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}
