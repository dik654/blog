import VizFrame from "@/components/viz/VizFrame";

const loop = [
  ["Observe", "state · user input · tool result", "typed context"],
  ["Decide", "model selects next action", "proposal"],
  ["Authorize", "policy · approval · budget", "admission"],
  ["Execute", "tool changes or reads environment", "receipt"],
  ["Exit / continue", "verifier · limit · final schema", "run state"],
] as const;

export default function AgentStateViz() {
  return (
    <VizFrame
      eyebrow="Agent run"
      title="Model 판단은 runtime의 권한·실행·관찰 경계를 지나야 실제 action이 됩니다"
    >
      <div className="divide-y divide-border/70">
        {loop.map(([name, operation, output], index) => (
          <div
            key={name}
            className="grid min-w-0 gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[3rem_8rem_1fr_7rem] sm:items-center sm:gap-5"
          >
            <span className="font-mono text-xs font-bold text-primary">
              0{index + 1}
            </span>
            <p className="text-sm font-bold text-foreground">{name}</p>
            <p className="break-words font-mono text-xs leading-5 text-muted-foreground">
              {operation}
            </p>
            <p className="text-xs font-semibold text-foreground/70 sm:text-right">
              {output}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
