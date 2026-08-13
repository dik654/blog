import { motion } from "framer-motion";
import StepViz from "@/components/ui/step-viz";
import type { ProcessScene } from "./process-flow";

const DEFAULT_COLORS = ["#6366f1", "#0ea5e9", "#f59e0b", "#10b981"];

export default function ProcessFlowViz({
  scenes,
  onOpenCode,
}: {
  scenes: readonly ProcessScene[];
  onOpenCode?: (key: string) => void;
}) {
  return (
    <StepViz steps={scenes}>
      {(step) => {
        const scene = scenes[step];

        return (
          <div className="mx-auto w-full max-w-2xl">
            {scene.eyebrow && (
              <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                {scene.eyebrow}
              </p>
            )}

            <div className="grid gap-2.5" aria-label="프로세스 흐름">
              {scene.nodes.map((node, index) => {
                const color = node.color ?? DEFAULT_COLORS[index];
                return (
                  <div key={node.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08, duration: 0.24 }}
                      className="grid min-w-0 gap-3 rounded-2xl border bg-background p-4 shadow-sm sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:items-center"
                      style={{
                        borderColor: color + "45",
                        background:
                          "linear-gradient(135deg, " +
                          color +
                          "10, transparent 62%)",
                      }}
                    >
                      <span
                        className="inline-flex w-fit rounded-lg px-2 py-1 text-[11px] font-black tracking-[0.12em]"
                        style={{ color, backgroundColor: color + "14" }}
                      >
                        PHASE {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold leading-5 text-foreground">
                          {node.label}
                        </span>
                        {node.sub && (
                          <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                            {node.sub}
                          </span>
                        )}
                      </span>
                    </motion.div>
                    {index < scene.nodes.length - 1 && (
                      <div
                        className="flex h-3 items-center justify-center"
                        aria-hidden="true"
                      >
                        <span className="h-2 w-2 rotate-45 border-b-2 border-r-2 border-border" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {scene.note && (
              <p className="mx-auto mt-4 max-w-xl rounded-xl bg-muted/40 px-4 py-3 text-center text-xs font-semibold leading-5 text-foreground/70">
                {scene.note}
              </p>
            )}

            {onOpenCode && scene.codeRef && (
              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => onOpenCode(scene.codeRef!)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-amber-300 bg-amber-50/60 px-2.5 py-1 text-[11px] text-amber-700 transition-colors hover:bg-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:hover:bg-amber-950/40"
                >
                  {"{ }"} 코드 보기
                </button>
                {scene.codeLabel && (
                  <span className="text-[11px] text-muted-foreground">
                    {scene.codeLabel}
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
