import StepViz from "@/components/ui/step-viz";
import type {
  ArticleFlowStage,
  ArticleFlowStep,
} from "@/components/viz/article-flow";

export interface ArticleFlowVizStep extends ArticleFlowStep {
  codeRef?: string;
  codeLabel?: string;
}

const STAGES: readonly {
  id: ArticleFlowStage;
  label: string;
  color: string;
}[] = [
  { id: "background", label: "배경", color: "#64748b" },
  { id: "problem", label: "문제", color: "#ef4444" },
  { id: "idea", label: "아이디어", color: "#f59e0b" },
  { id: "implementation", label: "구현", color: "#10b981" },
];

/**
 * A compact overview for article-level narrative data.
 * Every label comes from the same flow manifest used by the stepper, so the
 * visible overview cannot silently drift from the article order.
 */
export default function ArticleFlowViz({
  steps,
  onOpenCode,
}: {
  steps: readonly ArticleFlowVizStep[];
  onOpenCode?: (key: string) => void;
}) {
  return (
    <StepViz steps={steps}>
      {(currentIndex) => {
        const current = steps[currentIndex];
        return (
          <div className="w-full">
            <div
              className="mx-auto max-w-2xl space-y-3"
              role="img"
              aria-label="배경에서 구현으로 내려가는 탑다운 글 흐름"
            >
              {STAGES.map((stage, stageIndex) => {
                const stageSteps = steps
                  .map((step, index) => ({ step, index }))
                  .filter(({ step }) => step.stage === stage.id);
                const active = current.stage === stage.id;
                const visited = stageSteps.some(
                  ({ index }) => index <= currentIndex,
                );

                return (
                  <section
                    key={stage.id}
                    className={`min-w-0 rounded-lg border p-4 transition-colors ${
                      active
                        ? "border-current"
                        : visited
                          ? "border-border bg-background/80"
                          : "border-border/60 bg-muted/20"
                    }`}
                    style={{
                      color: active ? stage.color : undefined,
                      backgroundColor: active ? `${stage.color}0a` : undefined,
                    }}
                  >
                    <div className="grid min-w-0 gap-3 sm:grid-cols-[7rem_minmax(0,1fr)] sm:items-start">
                      <div>
                        <span
                          className="inline-flex rounded-md px-2 py-1 text-xs font-black tracking-[0.12em]"
                          style={{
                            color: stage.color,
                            backgroundColor: `${stage.color}12`,
                          }}
                        >
                          STAGE {String(stageIndex + 1).padStart(2, "0")}
                        </span>
                        <p className="mt-2 text-sm font-bold text-foreground">
                          {stage.label}
                        </p>
                        <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
                          {active
                            ? "지금 읽는 단계"
                            : visited
                              ? "읽은 단계"
                              : "다음 단계"}
                        </p>
                      </div>
                      <ol className="grid min-w-0 gap-2">
                        {stageSteps.map(({ step, index }) => (
                          <li
                            key={step.id}
                            className={`min-w-0 break-words rounded-md border px-3 py-2.5 text-xs leading-5 transition-colors [overflow-wrap:anywhere] ${
                              index === currentIndex
                                ? "border-current bg-background font-semibold text-foreground"
                                : index < currentIndex
                                  ? "border-border/70 bg-background/70 text-muted-foreground"
                                  : "border-transparent bg-background/40 text-muted-foreground/75"
                            }`}
                          >
                            {step.label}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </section>
                );
              })}
            </div>

            {onOpenCode && current.codeRef && (
              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => onOpenCode(current.codeRef!)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded border border-amber-300 bg-amber-50/60 px-2 py-1 text-xs text-amber-700 transition-colors hover:bg-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:hover:bg-amber-950/40"
                >
                  {"{ }"} 코드 보기
                </button>
                {current.codeLabel && (
                  <span className="text-xs text-muted-foreground">
                    {current.codeLabel}
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
