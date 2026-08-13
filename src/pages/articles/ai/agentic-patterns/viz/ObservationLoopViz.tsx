import VizFrame from "@/components/viz/VizFrame";

const events = [
  ["Decision", "tool + typed arguments", "model proposal"],
  ["Runtime", "validate + authorize", "accepted action"],
  ["Environment", "execute once", "result or error"],
  ["Observation", "source + status + payload", "new state"],
] as const;

export default function ObservationLoopViz() {
  return (
    <VizFrame
      eyebrow="ReAct loop"
      title="외부 observation이 들어와야 다음 판단이 이전 추측과 달라질 수 있습니다"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {events.map(([name, action, output], index) => (
          <div key={name} className="min-w-0 border-l border-border/80 pl-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-foreground">{name}</p>
              <span className="font-mono text-xs text-primary">
                0{index + 1}
              </span>
            </div>
            <p className="mt-3 break-words font-mono text-xs leading-5 text-primary">
              {action}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {output}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
