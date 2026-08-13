import StepViz from "@/components/ui/step-viz";
import type { NarrativeCodeAction, NarrativeFlowStep } from "./narrative-flow";

/**
 * 여러 파일의 좌표·SVG 조각에 흩어졌던 단계형 설명을 하나의 흐름 manifest로 렌더링한다.
 * 단계가 추가되면 manifest만 늘리면 되며, desktop/mobile 모두 CSS layout으로 재배치된다.
 */
export default function NarrativeFlowViz({
  steps,
  getCodeAction,
}: {
  steps: readonly NarrativeFlowStep[];
  getCodeAction?: (step: number) => NarrativeCodeAction | undefined;
}) {
  return (
    <StepViz steps={steps}>
      {(active) => {
        const codeAction = getCodeAction?.(active);
        return (
          <div className="w-full">
            <div
              className="mx-auto grid max-w-2xl gap-2.5"
              aria-label="위에서 아래로 읽는 전체 흐름"
            >
              {steps.map((step, index) => {
                const state =
                  index < active ? "완료" : index === active ? "현재" : "다음";
                return (
                  <div
                    key={`${index}-${step.label}`}
                    aria-current={index === active ? "step" : undefined}
                    className={`grid min-w-0 gap-3 rounded-lg border px-4 py-3 transition-colors sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:items-center ${
                      index === active
                        ? "border-primary/40 bg-primary/[0.04]"
                        : index < active
                          ? "border-emerald-500/25 bg-emerald-500/5"
                          : "border-border/70 bg-muted/20"
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:block">
                      <span
                        className={`inline-flex rounded-md px-2 py-1 text-[11px] font-black tracking-[0.1em] ${
                          index === active
                            ? "bg-primary text-primary-foreground"
                            : "bg-background text-muted-foreground"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[11px] font-semibold text-muted-foreground sm:mt-1.5 sm:block">
                        {state}
                      </span>
                    </div>
                    <p className="min-w-0 break-words text-xs font-semibold leading-5 text-foreground/85 [overflow-wrap:anywhere]">
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {codeAction && (
              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={codeAction.onClick}
                  className="inline-flex cursor-pointer items-center gap-1 rounded border border-amber-300 bg-amber-50/60 px-2 py-1 text-[11px] text-amber-700 transition-colors hover:bg-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:hover:bg-amber-950/40"
                >
                  {"{ }"} 코드 보기
                </button>
                {codeAction.label && (
                  <span className="text-[11px] text-muted-foreground">
                    {codeAction.label}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      }}
    </StepViz>
  );
}
