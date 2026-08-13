import { motion } from "framer-motion";
import StepViz from "@/components/ui/step-viz";
import { CodeViewButton } from "@/components/code";
import { STAGES, STEPS, STEP_REFS } from "./CreateBlockVizData";

const spring = { type: "spring" as const, bounce: 0.12, duration: 0.38 };

export default function CreateBlockViz({
  onOpenCode,
}: {
  onOpenCode?: (key: string) => void;
}) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <div className="grid gap-3 lg:grid-cols-5" role="img" aria-label="Lotus 블록 생성의 다섯 단계">
            {STAGES.map((stage, index) => {
              const active = index === step;
              const done = index < step;

              return (
                <motion.article
                  key={stage.label}
                  animate={{ opacity: active ? 1 : done ? 0.72 : 0.42, y: active ? -2 : 0 }}
                  transition={spring}
                  className={`relative min-w-0 overflow-hidden rounded-2xl border p-4 ${
                    active ? "bg-background shadow-sm" : "bg-muted/20"
                  }`}
                  style={{ borderColor: active ? stage.color : undefined }}
                >
                  <div
                    className="absolute inset-x-0 top-0 h-1"
                    style={{ backgroundColor: stage.color, opacity: active ? 1 : 0.35 }}
                  />
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs font-bold text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="rounded-full px-2 py-1 text-xs font-bold"
                      style={{ color: stage.color, backgroundColor: `${stage.color}12` }}
                    >
                      {active ? "현재 단계" : done ? "완료" : "다음"}
                    </span>
                  </div>
                  <strong className="mt-4 block break-words text-sm" style={{ color: stage.color }}>
                    {stage.label}
                  </strong>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{stage.sub}</p>
                </motion.article>
              );
            })}
          </div>

          <div className="mt-4 rounded-xl border bg-background px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">CreateBlock progress</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500"
                animate={{ width: `${((step + 1) / STAGES.length) * 100}%` }}
                transition={spring}
              />
            </div>
          </div>

          {onOpenCode && STEP_REFS[step] !== undefined && (
            <div className="mt-3 flex items-center justify-end gap-2">
              <CodeViewButton onClick={() => onOpenCode(STEP_REFS[step])} />
              <span className="text-xs text-muted-foreground">mine.go — CreateBlock</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
