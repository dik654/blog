import VizFrame from "@/components/viz/VizFrame";
import { Controls, useScenes } from "./PromptVizControls";

const FEW_SHOT_SCENES = ["예시 선택", "순서 교란", "비용 판정"] as const;

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
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Few-shot context and order sensitivity animation"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="border border-border bg-background p-4">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
            <p className="font-mono text-[10px] font-bold">CURRENT REQUEST CONTEXT</p>
            <p className="text-xs text-muted-foreground">weight update 없음</p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {orders.map(([id, input, label]) => (
              <div key={id} className="border border-sky-500 bg-sky-500/10 p-3">
                <p className="font-mono text-[10px] font-bold">EXAMPLE {id}</p>
                <div className="mt-3 flex items-center justify-between gap-2 text-xs">
                  <span>{input}</span>
                  <span>→</span>
                  <strong>{label}</strong>
                </div>
              </div>
            ))}
          </div>
          <div className="mx-auto h-6 w-px bg-border" />
          <div className="mx-auto max-w-md border border-violet-500 bg-violet-500/10 p-4 text-center">
            <p className="font-mono text-[10px] font-bold">CURRENT QUERY</p>
            <p className="mt-2 font-bold">“배송이 늦지만 상담은 친절했다”</p>
          </div>
          <div className="mx-auto h-6 w-px bg-border" />
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <div className="border border-emerald-500 bg-emerald-500/10 p-4 text-center">
              <p className="font-mono text-[10px]">PREDICTION</p>
              <p className="mt-2 text-lg font-black">mixed</p>
            </div>
            <div className="text-center text-xl font-black text-muted-foreground">↔</div>
            <div className={`border p-4 text-center ${scenes.active === 2 ? "border-primary bg-primary/10" : "border-border"}`}>
              <p className="font-mono text-[10px]">REPEATED COST</p>
              <p className="mt-2 font-black">examples × requests</p>
            </div>
          </div>
        </div>
        <Controls {...scenes} labels={FEW_SHOT_SCENES} />
      </div>
    </VizFrame>
  );
}
