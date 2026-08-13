import VizFrame from "@/components/viz/VizFrame";

const checks = [
  ["Schema", "arguments valid?", "reject malformed call"],
  ["Capability", "is this action allowed?", "least privilege"],
  ["Risk", "reversible or high impact?", "approval / escalation"],
  ["Execution", "idempotent and traceable?", "receipt + observation"],
] as const;

export default function ToolBoundaryViz() {
  return (
    <VizFrame
      eyebrow="Action admission"
      title="Tool call은 model output에서 바로 side effect로 내려가지 않습니다"
    >
      <div className="divide-y divide-border/70">
        {checks.map(([name, question, result]) => (
          <div
            key={name}
            className="grid min-w-0 gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[8rem_1fr_10rem] sm:gap-5"
          >
            <p className="text-sm font-bold text-foreground">{name}</p>
            <p className="text-xs leading-5 text-muted-foreground">
              {question}
            </p>
            <p className="text-xs font-semibold text-primary sm:text-right">
              {result}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
