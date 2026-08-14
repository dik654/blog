import VizFrame from "@/components/viz/VizFrame";
import { Controls, useScenes } from "./PromptVizControls";

const OUTPUT_SCENES = ["Parse", "Schema", "Domain", "Fallback"] as const;

export function OutputValidationViz() {
  const scenes = useScenes(OUTPUT_SCENES.length);
  const stages = [
    ["01", "Parse", "JSON 문법"],
    ["02", "Schema", "field · type"],
    ["03", "Domain", "ID · 상태 · 근거"],
    ["04", "Fallback", "unknown · review"],
  ] as const;

  return (
    <VizFrame
      eyebrow="Animated output validation"
      title="JSON처럼 보이는 문자열을 신뢰 가능한 record로 바꾸는 네 문"
      description="각 문은 서로 다른 질문을 판정합니다. 앞 문을 통과해도 뒤 문에서 실패할 수 있습니다."
      note="Constrained decoding은 주로 앞쪽 syntax 공간을 줄이며 실제 상품 ID나 권한까지 검증하지 않습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Structured output validation ladder animation"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="grid gap-3 md:grid-cols-4">
          {stages.map(([id, name, detail], index) => (
            <div key={name} className="relative min-w-0">
              <div
                className={`h-full border p-4 ${scenes.active === index ? "border-primary bg-primary/10" : "border-border bg-background"}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold">{id}</span>
                  <span className={`h-3 w-3 ${index < 3 ? "rounded-full" : "rotate-45"} border border-current`} />
                </div>
                <p className="mt-5 text-lg font-black">{name}</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</p>
              </div>
              {index < stages.length - 1 ? (
                <span className="absolute -bottom-4 left-1/2 text-muted-foreground md:-right-3 md:bottom-auto md:left-auto md:top-1/2">
                  <span className="md:hidden">↓</span>
                  <span className="hidden md:inline">→</span>
                </span>
              ) : null}
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div className="border border-rose-500 bg-rose-500/10 p-4 text-center">
            <p className="font-mono text-[10px]">INVALID ORIGINAL</p>
            <p className="mt-2 font-bold">원본·실패 단계 보존</p>
          </div>
          <div className="text-center text-xl font-black">→</div>
          <div className="border border-emerald-500 bg-emerald-500/10 p-4 text-center">
            <p className="font-mono text-[10px]">BOUNDED RESULT</p>
            <p className="mt-2 font-bold">valid record 또는 typed unknown</p>
          </div>
        </div>
        <Controls {...scenes} labels={OUTPUT_SCENES} />
      </div>
    </VizFrame>
  );
}
