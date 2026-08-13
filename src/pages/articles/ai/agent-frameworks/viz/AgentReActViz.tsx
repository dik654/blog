import VizFrame from "@/components/viz/VizFrame";

const steps = [
  ["Request", "목표·입력·완료 조건", "application contract"],
  ["Decide", "다음 action 또는 완료", "model proposes"],
  ["Act", "허용된 tool만 실행", "runtime enforces"],
  ["Observe", "결과·오류·effect receipt", "state updates"],
  ["Verify", "근거와 완료 조건 판정", "test or evaluator"],
] as const;

export default function AgentReActViz() {
  return (
    <VizFrame
      eyebrow="Agent control loop"
      title="Request에서 시작해 Decide·Act·Observe를 거친 뒤 Verify가 반복 여부를 결정합니다"
      description="Model은 action을 제안하지만 permission·argument validation·side effect는 runtime이 강제합니다."
      note="Verify가 실패하면 검증 결과를 새 observation으로 기록하고 Decide로 돌아갑니다. 무한 반복을 막기 위해 step·time·cost 상한도 함께 둡니다."
    >
      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map(([name, artifact, owner], index) => (
          <li key={name} className="min-w-0 border-t border-border/80 pt-4">
            <span className="font-mono text-[11px] text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h4 className="mt-2 text-sm font-bold">{name}</h4>
            <p className="mt-3 min-w-0 text-xs leading-5 text-foreground [overflow-wrap:anywhere]">
              {artifact}
            </p>
            <p className="mt-2 min-w-0 text-xs font-semibold leading-5 text-primary [overflow-wrap:anywhere]">
              {owner}
            </p>
          </li>
        ))}
      </ol>
    </VizFrame>
  );
}
