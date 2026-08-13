import VizFrame from "@/components/viz/VizFrame";

const layers = [
  ["Application", "업무 상태·사용자 경험·권한 정책·품질 기준", "제품 팀"],
  ["LangChain", "model·tool adapter와 일반 agent 구성", "integration layer"],
  ["LangGraph", "state transition·checkpoint·interrupt·resume", "workflow runtime"],
  ["Infrastructure", "provider API·database·queue·telemetry", "platform team"],
] as const;

export default function FrameworkArchViz() {
  return (
    <VizFrame
      eyebrow="Ownership stack"
      title="Framework를 도입해도 application의 업무 판단과 infrastructure 책임은 사라지지 않습니다"
      description="각 계층이 무엇을 소유하는지 먼저 정하면 framework abstraction이 새어 나올 때 수정할 위치를 찾기 쉽습니다."
    >
      <div className="divide-y divide-border/70">
        {layers.map(([layer, responsibility, owner], index) => (
          <section
            key={layer}
            className="grid min-w-0 gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[2rem_8rem_1fr_8rem] sm:items-baseline"
          >
            <span className="font-mono text-[11px] text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h4 className="text-sm font-bold">{layer}</h4>
            <p className="min-w-0 text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
              {responsibility}
            </p>
            <p className="min-w-0 text-xs font-semibold leading-5 text-primary [overflow-wrap:anywhere]">
              {owner}
            </p>
          </section>
        ))}
      </div>
    </VizFrame>
  );
}
