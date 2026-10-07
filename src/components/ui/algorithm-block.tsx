import { useState } from "react";

export interface AlgorithmStep {
  /** 실제로 코드로 옮길 수 있는 한 줄 연산. */
  code: string;
  /** 이 연산을 하는 이유 또는 shape·주의사항. */
  note?: string;
}

interface AlgorithmBlockProps {
  title: string;
  input: readonly string[];
  steps: readonly AlgorithmStep[];
  output: string;
  /** "수렴할 때까지 반복" 같은 loop 안내. 없으면 표시하지 않는다. */
  repeatUntil?: string;
}

/**
 * ExplainedFormula가 "왜 이 식이 맞는가"를 설명한다면, AlgorithmBlock은
 * "이걸 어떻게 코드 한 줄씩으로 옮기는가"를 답한다. 실행 가능한 언어 문법이
 * 아니라 언어 무관 pseudocode로 적어, 독자가 PyTorch·NumPy·Rust 어디로든
 * 그대로 옮길 수 있게 한다.
 */
export default function AlgorithmBlock({
  title,
  input,
  steps,
  output,
  repeatUntil,
}: AlgorithmBlockProps) {
  const [activeStage, setActiveStage] = useState(0);
  const outputStage = steps.length + 1;
  const activeStep = activeStage > 0 && activeStage < outputStage
    ? steps[activeStage - 1]
    : undefined;
  const stageLabel = activeStage === 0
    ? "입력 확인"
    : activeStage === outputStage
      ? "출력 확인"
      : `${String(activeStage).padStart(2, "0")}번 줄 실행`;

  return (
    <div
      data-algorithm-viz
      className="not-prose my-9 min-w-0 overflow-hidden rounded-lg border border-border/70 bg-background"
    >
      <div className="border-b border-border/60 bg-muted/20 px-4 py-3 sm:px-6">
        <p className="text-xs font-bold text-primary">과정으로 보는 의사코드</p>
        <p className="mt-1 text-sm font-semibold text-foreground">{title}</p>
      </div>
      <div className="min-w-0 px-4 py-5 sm:px-6">
        <div
          role="group"
          aria-label={`${title} 실행 단계`}
          className="flex min-w-0 flex-wrap gap-1.5"
        >
          {["입력", ...steps.map((_, index) => String(index + 1).padStart(2, "0")), "출력"].map((label, index) => (
            <button
              key={`${label}-${index}`}
              type="button"
              aria-pressed={activeStage === index}
              onClick={() => setActiveStage(index)}
              className={`min-h-9 min-w-9 rounded-md border px-2.5 py-1.5 text-xs font-bold ${
                activeStage === index
                  ? "border-primary bg-primary/10 text-foreground"
                  : index < activeStage
                    ? "border-primary/30 bg-primary/[0.04] text-muted-foreground"
                    : "border-border bg-background text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div
          aria-live="polite"
          className="mt-4 min-w-0 rounded-lg border border-primary/25 bg-primary/[0.035] p-4"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-primary">
            현재 단계 · {stageLabel}
          </p>
          {activeStage === 0 && (
            <ul className="mt-2 space-y-1">
              {input.map((item) => (
                <li key={item} className="break-words font-mono text-xs leading-6 text-foreground">
                  {item}
                </li>
              ))}
            </ul>
          )}
          {activeStep && (
            <>
              <code className="mt-2 block min-w-0 break-words font-mono text-xs font-semibold leading-6 text-foreground">
                {activeStep.code}
              </code>
              {activeStep.note && (
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {activeStep.note}
                </p>
              )}
            </>
          )}
          {activeStage === outputStage && (
            <code className="mt-2 block min-w-0 break-words font-mono text-xs font-semibold leading-6 text-foreground">
              {output}
            </code>
          )}
        </div>

        <div className="mt-3 grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
          <button
            type="button"
            disabled={activeStage === 0}
            onClick={() => setActiveStage((stage) => Math.max(0, stage - 1))}
            className="min-h-11 min-w-0 rounded-md border border-border bg-background px-2 text-xs font-bold disabled:opacity-35"
          >
            이전
          </button>
          <span className="whitespace-nowrap px-1 text-xs tabular-nums text-muted-foreground">
            {activeStage + 1} / {outputStage + 1}
          </span>
          <button
            type="button"
            disabled={activeStage === outputStage}
            onClick={() => setActiveStage((stage) => Math.min(outputStage, stage + 1))}
            className="min-h-11 min-w-0 rounded-md border border-border bg-background px-2 text-xs font-bold disabled:opacity-35"
          >
            다음
          </button>
        </div>

        <div className="my-5 border-t border-border/60" />
        <div className="mb-4">
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
            입력
          </p>
          <ul className="mt-1.5 space-y-1">
            {input.map((item) => (
              <li key={item} className="break-words font-mono text-xs leading-6 text-foreground/85">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <ol className="space-y-2">
          {steps.map((step, index) => (
            <li
              key={`${index}-${step.code}`}
              aria-current={activeStage === index + 1 ? "step" : undefined}
              className={`min-w-0 rounded-md border-l-2 px-3 py-2 transition-colors ${
                activeStage === index + 1
                  ? "border-primary bg-primary/[0.06]"
                  : activeStage > index + 1
                    ? "border-primary/35 bg-muted/10"
                    : "border-border/60"
              }`}
            >
              <div className="flex min-w-0 items-baseline gap-2">
                <span className="font-mono text-[10px] font-bold text-primary">
                  {activeStage > index + 1 ? "✓" : String(index + 1).padStart(2, "0")}
                </span>
                <code className="min-w-0 break-words font-mono text-xs leading-6 text-foreground">
                  {step.code}
                </code>
              </div>
              {step.note && (
                <p className="mt-1 pl-6 text-xs leading-5 text-muted-foreground">
                  {step.note}
                </p>
              )}
            </li>
          ))}
        </ol>
        {repeatUntil && (
          <p className="mt-3 border-l border-amber-600/50 pl-4 text-xs leading-5 text-muted-foreground">
            <span className="font-semibold text-amber-700 dark:text-amber-400">
              반복:
            </span>{" "}
            {repeatUntil}
          </p>
        )}
        <div className="mt-4 border-t border-border/60 pt-3">
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
            출력
          </p>
          <code className="mt-1.5 block break-words font-mono text-xs leading-6 text-foreground/85">
            {output}
          </code>
        </div>
      </div>
    </div>
  );
}
