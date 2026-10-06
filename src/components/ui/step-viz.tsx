import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type StepDef = string | { label: string; body?: ReactNode };

interface Props {
  steps: readonly StepDef[];
  children: (step: number) => ReactNode;
}

export default function StepViz({ steps, children }: Props) {
  const [step, setStep] = useState(0);
  const cur = steps[step];
  const label = typeof cur === "string" ? cur : cur.label;
  const body = typeof cur === "string" ? undefined : cur.body;

  return (
    <div
      data-viz="step-flow"
      className="not-prose group/viz relative mb-14 min-w-0 overflow-hidden rounded-xl border border-border/70 bg-card"
    >
      <div className="border-b border-border/60 bg-muted/20 p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-4 px-1">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md border border-primary/25 bg-background text-primary">
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5"
                aria-hidden="true"
              >
                <path
                  d="M5 7.5h9M10.5 4 14 7.5 10.5 11M19 16.5h-9M13.5 13 10 16.5l3.5 3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div>
              <p className="text-[10px] font-bold text-primary/85">
                단계별 해설
              </p>
              <p className="text-xs font-semibold text-foreground/75">
                단계를 선택해 변화 과정을 따라가세요
              </p>
            </div>
          </div>
          <span className="hidden border-l border-border/80 pl-3 text-[10px] font-semibold tabular-nums text-muted-foreground sm:inline-flex">
            {step + 1} / {steps.length}
          </span>
        </div>
        <div className="hidden min-w-0 sm:flex sm:overflow-x-auto">
          {steps.map((item, i) => {
            const itemLabel = typeof item === "string" ? item : item.label;
            const isActive = i === step;
            return (
              <button
                key={`${i}-${itemLabel}`}
                type="button"
                onClick={() => setStep(i)}
                aria-current={isActive ? "step" : undefined}
                title={itemLabel}
                className={`group relative flex min-w-0 items-start gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors sm:min-w-32 sm:flex-1 ${
                  isActive
                    ? "border-primary/40 bg-background text-foreground"
                    : i < step
                      ? "border-border/70 bg-background/70 text-foreground/70"
                      : "border-transparent bg-transparent text-muted-foreground hover:border-border hover:bg-background"
                }`}
              >
                {isActive && (
                  <span className="absolute inset-x-3 bottom-0 h-px bg-primary" />
                )}
                <span
                  className={`rounded-md px-1.5 py-0.5 text-xs font-bold tabular-nums ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 break-words text-xs font-semibold leading-5 [overflow-wrap:anywhere]">
                  {itemLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          data-viz-canvas
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative flex min-h-[220px] min-w-0 items-center justify-center overflow-hidden bg-background p-4 sm:min-h-[290px] sm:overflow-x-auto sm:p-8 [&_svg]:relative [&_svg]:z-[1] [&_svg]:block [&_svg]:h-auto [&_svg]:w-full [&_svg]:min-w-0 [&_svg]:max-w-full sm:[&_svg]:w-auto [&_svg_line]:[stroke-linecap:round] [&_svg_path]:[stroke-linecap:round] [&_svg_path]:[stroke-linejoin:round]"
        >
          <div className="relative z-[1] flex w-full min-w-0 max-w-full items-center justify-center p-1 sm:min-w-full sm:p-2">
            {children(step)}
          </div>
        </motion.div>
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.div
          key={`text-${step}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="border-t border-border/60 bg-muted/15 px-4 py-4 sm:px-6"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 border-r border-primary/30 pr-3 text-[10px] font-bold text-primary">
              STEP {String(step + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-6 text-foreground">
                {label}
              </p>
              {body && (
                <p className="mt-1 whitespace-pre-line text-xs leading-5 text-muted-foreground">
                  {body}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div
        data-step-viz-mobile-controls
        className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 border-t border-border/50 bg-muted/10 px-4 py-3 sm:hidden"
      >
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="min-h-11 min-w-0 cursor-pointer rounded-lg border bg-background px-2 py-1.5 text-xs font-bold transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-30"
        >
          ← 이전
        </button>
        <span className="whitespace-nowrap px-1 text-xs text-muted-foreground tabular-nums">
          {step + 1} / {steps.length}
        </span>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
          disabled={step === steps.length - 1}
          className="min-h-11 min-w-0 cursor-pointer rounded-lg border bg-background px-2 py-1.5 text-xs font-bold transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-30"
        >
          다음 →
        </button>
      </div>
      <div className="hidden items-center justify-between gap-3 border-t border-border/50 bg-muted/10 px-6 py-3 sm:flex">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="cursor-pointer rounded-lg border bg-background px-3 py-1.5 text-xs transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-30"
        >
          ← 이전
        </button>
        <span className="text-xs text-muted-foreground tabular-nums">
          {step + 1} / {steps.length}
        </span>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
          disabled={step === steps.length - 1}
          className="cursor-pointer rounded-lg border bg-background px-3 py-1.5 text-xs transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-30"
        >
          다음 →
        </button>
      </div>
    </div>
  );
}
