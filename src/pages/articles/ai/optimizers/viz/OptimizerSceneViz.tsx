import StepViz from "@/components/ui/step-viz";

export interface OptimizerMetric {
  label: string;
  value: string;
  detail?: string;
}

export interface OptimizerScene {
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  formula?: string;
  metrics: readonly OptimizerMetric[];
  takeaway: string;
}

export default function OptimizerSceneViz({
  scenes,
}: {
  scenes: readonly OptimizerScene[];
}) {
  return (
    <StepViz steps={scenes.map((scene) => scene.label)}>
      {(active) => {
        const scene = scenes[active];
        return (
          <div className="mx-auto w-full max-w-2xl">
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-4 sm:p-5">
              <p className="text-[11px] font-black tracking-[0.12em] text-primary">
                {scene.eyebrow}
              </p>
              <h4 className="mt-2 text-base font-bold leading-6 text-foreground">
                {scene.title}
              </h4>
              <p className="mt-2 text-sm leading-6 text-foreground/70">
                {scene.description}
              </p>
              {scene.formula && (
                <code className="mt-3 block overflow-x-auto rounded-xl border border-border/70 bg-background/80 px-3 py-2.5 text-xs leading-5 text-foreground">
                  {scene.formula}
                </code>
              )}
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {scene.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="min-w-0 rounded-xl border border-border/70 bg-card p-3"
                >
                  <p className="text-[11px] font-bold text-muted-foreground">
                    {metric.label}
                  </p>
                  <p className="mt-1 break-words text-sm font-bold leading-5 text-foreground">
                    {metric.value}
                  </p>
                  {metric.detail && (
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {metric.detail}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <p className="mt-3 rounded-xl bg-emerald-500/8 px-4 py-3 text-xs font-semibold leading-5 text-foreground/75">
              <span className="text-emerald-700 dark:text-emerald-300">
                확인할 점:
              </span>{" "}
              {scene.takeaway}
            </p>
          </div>
        );
      }}
    </StepViz>
  );
}
