import StepViz from "@/components/ui/step-viz";

const trace = [
  {
    t: 1,
    previous: "0.600000",
    leaked: "0.480000",
    input: "0.700000",
    beforeReset: "1.180000",
    spike: 1,
    afterReset: "0.180000",
  },
  {
    t: 2,
    previous: "0.180000",
    leaked: "0.144000",
    input: "0.100000",
    beforeReset: "0.244000",
    spike: 0,
    afterReset: "0.244000",
  },
  {
    t: 3,
    previous: "0.244000",
    leaked: "0.195200",
    input: "0.900000",
    beforeReset: "1.095200",
    spike: 1,
    afterReset: "0.095200",
  },
  {
    t: 4,
    previous: "0.095200",
    leaked: "0.076160",
    input: "0.300000",
    beforeReset: "0.376160",
    spike: 0,
    afterReset: "0.376160",
  },
  {
    t: 5,
    previous: "0.376160",
    leaked: "0.300928",
    input: "0.700000",
    beforeReset: "1.000928",
    spike: 1,
    afterReset: "0.000928",
  },
] as const;

const steps = trace.map((row) => ({
  label: `${row.t}번째 시점`,
  body:
    row.spike === 1
      ? `${row.beforeReset}이 문턱 1을 넘으므로 발화 1을 내고 1을 뺍니다.`
      : `${row.beforeReset}이 문턱 1보다 작으므로 발화하지 않고 전압을 그대로 넘깁니다.`,
}));

export default function SpikeLifecycleViz() {
  return (
    <StepViz steps={steps}>
      {(step) => {
        const row = trace[step];
        const voltageWidth = Math.min(100, Number(row.beforeReset) * 100);

        return (
          <div className="w-full max-w-4xl space-y-5">
            <div className="grid min-w-0 gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
              <div className="rounded-lg border border-border/75 bg-background p-3 text-center">
                <p className="text-[11px] font-semibold text-muted-foreground">
                  이전 전압 × 0.8
                </p>
                <p className="mt-2 font-mono text-sm font-bold">
                  {row.previous} × 0.8
                </p>
                <p className="mt-1 font-mono text-sm text-primary">
                  = {row.leaked}
                </p>
              </div>
              <span className="hidden text-lg text-muted-foreground sm:block">
                +
              </span>
              <div className="rounded-lg border border-border/75 bg-background p-3 text-center">
                <p className="text-[11px] font-semibold text-muted-foreground">
                  지금 들어온 값
                </p>
                <p className="mt-2 font-mono text-sm font-bold">{row.input}</p>
              </div>
              <span className="hidden text-lg text-muted-foreground sm:block">
                =
              </span>
              <div className="rounded-lg border border-primary/35 bg-primary/[0.05] p-3 text-center">
                <p className="text-[11px] font-semibold text-primary">
                  리셋 전 전압
                </p>
                <p className="mt-2 font-mono text-sm font-bold">
                  {row.beforeReset}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border/75 bg-background p-4">
              <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                <span>0</span>
                <span>문턱 1</span>
              </div>
              <div className="relative mt-2 h-7 overflow-hidden rounded-md border border-border bg-muted/30">
                <div
                  className={`h-full transition-[width] duration-300 ${
                    row.spike ? "bg-amber-500/45" : "bg-primary/30"
                  }`}
                  style={{ width: `${voltageWidth}%` }}
                />
                <div className="absolute inset-y-0 right-0 border-l-2 border-dashed border-foreground/60" />
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <p className="rounded-md bg-muted/35 px-3 py-2 text-center font-mono text-xs font-bold">
                  spike = {row.spike}
                </p>
                <p className="rounded-md bg-muted/35 px-3 py-2 text-center font-mono text-xs font-bold">
                  다음 전압 = {row.afterReset}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {trace.map((item, index) => (
                <div
                  key={item.t}
                  className={`min-w-0 rounded-md border px-1 py-2 text-center ${
                    index === step
                      ? "border-primary bg-primary/10"
                      : index < step
                        ? "border-primary/30 bg-primary/[0.03]"
                        : "border-border/70 bg-background"
                  }`}
                >
                  <p className="text-[10px] text-muted-foreground">t{item.t}</p>
                  <p className="mt-1 font-mono text-sm font-black">
                    {index <= step ? item.spike : "·"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    </StepViz>
  );
}
