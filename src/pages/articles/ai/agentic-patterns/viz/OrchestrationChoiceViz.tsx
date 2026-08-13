import VizFrame from "@/components/viz/VizFrame";

const modes = [
  ["Manager as tools", "one conversation owner", "central synthesis"],
  ["Handoff", "execution owner changes", "specialist interaction"],
  ["Parallel fan-out", "independent tasks", "defined merge"],
  ["Actor–reviewer", "separate contexts", "independent critique"],
] as const;

export default function OrchestrationChoiceViz() {
  return (
    <VizFrame
      eyebrow="Orchestration"
      title="누가 state와 사용자 응답을 소유하는지에 따라 multi-agent graph가 달라집니다"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {modes.map(([name, ownership, fit]) => (
          <div key={name} className="min-w-0 border-l border-border/80 pl-4">
            <p className="text-sm font-bold text-foreground">{name}</p>
            <p className="mt-3 break-words font-mono text-xs leading-5 text-primary">
              {ownership}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {fit}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
