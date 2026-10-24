import VizFrame from "@/components/viz/VizFrame";
import { Controls } from "./PromptVizControls";
import { useScenes } from "./usePromptScenes";

const OUTPUT_SCENES = ["Parse", "Schema", "Domain", "Fallback"] as const;
const OUTPUT_NOTES = [
  "먼저 문자열이 JSON 문법으로 끝까지 해석되는지 확인합니다.",
  "다음으로 required field·type·enum 규칙을 검사합니다.",
  "실제 ID·상태 전이·근거 span처럼 업무 규칙을 확인합니다.",
  "실패하면 제한된 repair 뒤 valid record 또는 typed unknown으로 끝냅니다.",
] as const;

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
        id={scenes.playbackId}
        data-viz-canvas
        data-viz-scene="prompt-output-validation-viz"
        data-story-index={scenes.active}
        tabIndex={0}
        role="group"
        aria-label="Structured output validation ladder animation"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div data-viz-live-only className="grid flex-1 items-center">
          <div>
            <div className="grid grid-cols-4 gap-1.5 px-1 sm:gap-3 sm:px-0">
              {stages.map(([id, name, detail], index) => (
                <div key={name} className="relative min-w-0">
                  <div
                    className={`h-full border px-1.5 py-3 sm:p-4 ${scenes.active === index ? "border-primary bg-primary/10" : "border-border bg-background"}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] font-bold">{id}</span>
                      <span className={`h-3 w-3 ${index < 3 ? "rounded-full" : "rotate-45"} border border-current`} />
                    </div>
                    <p className="mt-3 whitespace-nowrap text-[10px] font-black sm:mt-5 sm:text-lg">{name}</p>
                    <p className="mt-1 hidden text-xs leading-5 text-muted-foreground sm:mt-2 sm:block">{detail}</p>
                  </div>
                  {index < stages.length - 1 ? (
                    <span className="absolute -right-2.5 top-1/2 z-10 -translate-y-1/2 bg-background px-0.5 text-muted-foreground sm:-right-3">
                      <span>→</span>
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:mt-6 sm:gap-3">
              <div className="border border-rose-500 bg-rose-500/10 px-2 py-3 text-center sm:p-4">
                <p className="font-mono text-[10px]">INVALID ORIGINAL</p>
                <p className="mt-1 break-keep text-[11px] font-bold sm:mt-2 sm:text-base">원본·실패 단계 보존</p>
              </div>
              <div className="text-center text-base font-black sm:text-xl">→</div>
              <div className="border border-emerald-500 bg-emerald-500/10 px-2 py-3 text-center sm:p-4">
                <p className="font-mono text-[10px]">BOUNDED RESULT</p>
                <p className="mt-1 break-keep text-[11px] font-bold sm:mt-2 sm:text-base">valid record 또는 typed unknown</p>
              </div>
            </div>
          </div>
        </div>
        <Controls {...scenes} labels={OUTPUT_SCENES} />
        <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">
          {OUTPUT_SCENES.map((label, index) => (
            <li key={label}>
              <strong>{String(index + 1).padStart(2, "0")} · {label}</strong>
              <span className="mt-1 block text-muted-foreground">{OUTPUT_NOTES[index]}</span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}
