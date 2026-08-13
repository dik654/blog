import VizFrame from "@/components/viz/VizFrame";

const choices = [
  ["Known path", "Low side-effect risk", "Workflow", "code chooses next node"],
  ["Unknown path", "Low / reversible risk", "Agent loop", "model chooses next action"],
  ["Unknown path", "High / irreversible risk", "Hybrid", "model explores · system gates transition"],
  ["Repeated operations", "Harness itself changes", "Outer loop", "trace analysis · human-reviewed canary"],
] as const;

export default function PatternsViz() {
  return (
    <VizFrame
      eyebrow="Control-flow choice"
      title="경로 불확실성과 side-effect 위험을 함께 보면 필요한 제어 구조가 정해집니다"
    >
      <div className="divide-y divide-border/70">
        {choices.map(([path, risk, pattern, control]) => (
          <div
            key={`${path}-${risk}`}
            className="grid min-w-0 gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[8rem_10rem_8rem_1fr] sm:items-center sm:gap-5"
          >
            <p className="font-mono text-xs font-bold text-primary">{path}</p>
            <p className="text-xs leading-5 text-muted-foreground">{risk}</p>
            <p className="text-sm font-bold text-foreground">{pattern}</p>
            <p className="break-words font-mono text-xs leading-5 text-foreground/70">
              {control}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
