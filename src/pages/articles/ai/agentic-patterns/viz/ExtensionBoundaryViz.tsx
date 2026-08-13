import VizFrame from "@/components/viz/VizFrame";

const layers = [
  ["Hook", "runtime event", "deterministic callback"],
  ["Skill", "task context", "model-selected guidance"],
  ["Guardrail", "policy boundary", "block · redact · escalate"],
  ["Verifier", "artifact boundary", "pass · fail + evidence"],
] as const;

export default function ExtensionBoundaryViz() {
  return (
    <VizFrame
      eyebrow="Extension layers"
      title="확장 장치는 실행 시점과 결정 주체가 서로 다릅니다"
    >
      <div className="divide-y divide-border/70">
        {layers.map(([name, trigger, action]) => (
          <div
            key={name}
            className="grid min-w-0 gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[8rem_10rem_1fr] sm:gap-5"
          >
            <p className="text-sm font-bold text-foreground">{name}</p>
            <p className="break-words font-mono text-xs leading-5 text-primary">
              {trigger}
            </p>
            <p className="text-xs leading-5 text-muted-foreground">{action}</p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
