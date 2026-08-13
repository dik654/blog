import VizFrame from "@/components/viz/VizFrame";

const fields = [
  ["Objective", "what must be true", "acceptance"],
  ["Dependencies", "required artifacts", "ready state"],
  ["Execution", "owner · capability · deadline", "work"],
  ["Evidence", "test · receipt · citation", "completion"],
  ["Transition", "pending · active · failed · done", "resume"],
] as const;

export default function PlanStateViz() {
  return (
    <VizFrame
      eyebrow="Plan registry"
      title="Task를 prose checklist가 아니라 검증 가능한 state record로 저장합니다"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {fields.map(([name, field, role]) => (
          <div key={name} className="min-w-0 border-t border-border/80 pt-4">
            <p className="text-sm font-bold text-foreground">{name}</p>
            <p className="mt-3 break-words font-mono text-xs leading-5 text-primary">
              {field}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {role}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
