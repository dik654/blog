import VizFrame from "@/components/viz/VizFrame";

const pieces = [
  ["State", "schema + reducer", "현재 snapshot과 update 병합"],
  ["Node", "function", "LLM·tool·결정적 계산 수행"],
  ["Edge", "routing", "고정 또는 조건부 다음 node 선택"],
  ["Checkpoint", "durability", "중단·검토·재개를 위한 저장 경계"],
] as const;

export default function LangGraphDetailViz() {
  return (
    <VizFrame
      eyebrow="State graph anatomy"
      title="State를 Node가 바꾸고 Edge가 다음 경로를 고르며 Checkpoint가 재개 지점을 남깁니다"
      description="Graph 정의와 durable execution을 구분하면 상태 전이 오류와 storage·retry 문제를 따로 진단할 수 있습니다."
      note="Checkpoint 이후 replay에서는 node가 다시 실행될 수 있습니다. 외부 API 호출과 결제 같은 side effect에는 idempotency key·effect receipt·중복 방지가 필요합니다."
    >
      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
        {pieces.map(([name, kind, role], index) => (
          <section key={name} className="min-w-0 border-t border-border/80 pt-4">
            <div className="flex min-w-0 items-baseline justify-between gap-4">
              <h4 className="text-sm font-bold">{name}</h4>
              <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <p className="mt-3 min-w-0 text-xs font-semibold leading-5 text-primary [overflow-wrap:anywhere]">
              {kind}
            </p>
            <p className="mt-3 min-w-0 text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
              {role}
            </p>
          </section>
        ))}
      </div>
    </VizFrame>
  );
}
