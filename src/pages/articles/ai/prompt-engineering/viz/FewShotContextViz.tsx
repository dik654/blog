import VizFrame from "@/components/viz/VizFrame";
import { Controls } from "./PromptVizControls";
import { useScenes } from "./usePromptScenes";

const FEW_SHOT_SCENES = ["예시 선택", "순서 교란", "비용 판정"] as const;
const FEW_SHOT_NOTES = [
  "현재 query와 경계를 설명할 demonstration 세 개를 context에 넣습니다.",
  "같은 세 예시의 순서를 바꿔 prediction이 흔들리는지 확인합니다.",
  "Weight는 그대로지만 example token은 모든 request에서 다시 처리됩니다.",
] as const;

export function FewShotContextViz() {
  const scenes = useScenes(FEW_SHOT_SCENES.length);
  const orders =
    scenes.active === 1
      ? [
          ["03", "refund", "negative"],
          ["01", "broken", "negative"],
          ["02", "thanks", "positive"],
        ]
      : [
          ["01", "broken", "negative"],
          ["02", "thanks", "positive"],
          ["03", "refund", "negative"],
        ];

  return (
    <VizFrame
      eyebrow="Animated in-context learning"
      title="예시는 weight가 아니라 이번 context 안의 조건을 바꾼다"
      description="Demonstration을 고르고, 순서를 흔들고, 반복 token 비용까지 확인한 뒤 zero-shot·few-shot·fine-tuning 경계를 정합니다."
      note="한 ordering의 향상만으로 task rule을 배웠다고 결론내리지 않습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        data-viz-scene="prompt-few-shot-context-viz"
        data-story-index={scenes.active}
        tabIndex={0}
        role="group"
        aria-label="Few-shot context and order sensitivity animation"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div data-viz-live-only className="grid flex-1 items-center">
        <div className="border border-border bg-background p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
            <p className="font-mono text-[10px] font-bold">CURRENT REQUEST CONTEXT</p>
            <p className="text-xs text-muted-foreground">weight update 없음</p>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1.5 sm:mt-4 sm:gap-3">
            {orders.map(([id, input, label]) => (
              <div key={id} className="min-w-0 border border-sky-500 bg-sky-500/10 px-1.5 py-2.5 sm:p-3">
                <p className="font-mono text-[9px] font-bold sm:text-[10px]">EXAMPLE {id}</p>
                <div className="mt-2 grid gap-1 text-[10px] sm:mt-3 sm:flex sm:items-center sm:justify-between sm:gap-2 sm:text-xs">
                  <span className="break-all sm:break-normal">{input}</span>
                  <span className="hidden sm:inline">→</span>
                  <strong className="break-all sm:break-normal">{label}</strong>
                </div>
              </div>
            ))}
          </div>
          <div className="mx-auto h-3 w-px bg-border sm:h-6" />
          <div className="mx-auto max-w-md border border-violet-500 bg-violet-500/10 px-3 py-2.5 text-center sm:p-4">
            <p className="font-mono text-[10px] font-bold">CURRENT QUERY</p>
            <p className="mt-1 break-keep text-xs font-bold sm:mt-2 sm:text-base">“배송이 늦지만 상담은 친절했다”</p>
          </div>
          <div className="mx-auto h-3 w-px bg-border sm:h-6" />
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
            <div className="border border-emerald-500 bg-emerald-500/10 px-2 py-3 text-center sm:p-4">
              <p className="font-mono text-[10px]">PREDICTION</p>
              <p className="mt-1 text-base font-black sm:mt-2 sm:text-lg">mixed</p>
            </div>
            <div className="text-center text-base font-black text-muted-foreground sm:text-xl">↔</div>
            <div className={`min-w-0 border px-2 py-3 text-center sm:p-4 ${scenes.active === 2 ? "border-primary bg-primary/10" : "border-border"}`}>
              <p className="font-mono text-[10px]">REPEATED COST</p>
              <p className="mt-1 break-keep text-[11px] font-black sm:mt-2 sm:text-base">examples × requests</p>
            </div>
          </div>
        </div>
        </div>
        <Controls {...scenes} labels={FEW_SHOT_SCENES} />
        <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">
          {FEW_SHOT_SCENES.map((label, index) => (
            <li key={label}>
              <strong>{String(index + 1).padStart(2, "0")} · {label}</strong>
              <span className="mt-1 block text-muted-foreground">{FEW_SHOT_NOTES[index]}</span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}
