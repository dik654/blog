import VizFrame from "@/components/viz/VizFrame";

const contracts = [
  ["Objective", "intended state", "판정 가능한 변화"],
  ["Context", "discoverable source", "정본·freshness·scope"],
  ["Authority", "allowed capability", "path·identity·approval"],
  ["Artifact", "durable handoff", "plan·diff·decision log"],
  ["Verifier", "accept / reject evidence", "test·oracle·rubric"],
  ["Recovery", "bounded failure path", "retry·rollback·escalation"],
] as const;

export default function RunContractViz() {
  return (
    <VizFrame
      eyebrow="Contract schema"
      title="여섯 경계를 독립 필드로 두면 누락된 책임을 바로 찾을 수 있습니다"
    >
      <div className="grid gap-x-7 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {contracts.map(([name, value, check]) => (
          <div key={name} className="min-w-0 border-l border-border/80 pl-4">
            <p className="text-sm font-bold text-foreground">{name}</p>
            <p className="mt-2 break-words font-mono text-xs leading-5 text-primary">
              {value}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {check}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
