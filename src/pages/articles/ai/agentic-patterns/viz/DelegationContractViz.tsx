import VizFrame from "@/components/viz/VizFrame";

const fields = [
  ["Objective", "bounded subtask"],
  ["Input", "artifact + version"],
  ["Authority", "read/write/tool scope"],
  ["Output", "typed artifact"],
  ["Acceptance", "verifier + deadline"],
] as const;

export default function DelegationContractViz() {
  return (
    <VizFrame
      eyebrow="Delegation contract"
      title="Sub-agent에게 역할 이름보다 입력·권한·산출물·검증을 전달합니다"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {fields.map(([name, detail], index) => (
          <div key={name} className="min-w-0 border-t border-border/80 pt-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-foreground">{name}</p>
              <span className="font-mono text-xs text-primary">
                0{index + 1}
              </span>
            </div>
            <p className="mt-3 break-words font-mono text-xs leading-5 text-muted-foreground">
              {detail}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
