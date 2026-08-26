import VizFrame from "@/components/viz/VizFrame";

const LANES = [
  {
    title: "Monolithic policy",
    flow: ["image + language", "shared representation", "action head", "robot action"],
    strength: "공동 학습으로 perception과 action을 직접 맞출 수 있습니다.",
    boundary: "Robot data·action space·closed-loop failure가 한 model 안에 결합됩니다.",
  },
  {
    title: "Hierarchical / modular",
    flow: ["VLM decision", "pixel / waypoint", "geometry + planner", "controller"],
    strength: "검증된 SLAM·solver·controller의 좌표와 safety contract를 재사용합니다.",
    boundary: "Module 사이 calibration·latency·error composition을 별도로 검증해야 합니다.",
  },
] as const;

export default function SystemBoundaryViz() {
  return (
    <VizFrame
      eyebrow="System boundary choice"
      title="End-to-end와 모듈식은 진화 단계가 아니라 서로 다른 실패를 소유합니다"
      description="같은 instruction을 두 경로로 실행해, 학습 가능한 범위와 deterministic component에 맡기는 범위를 비교합니다."
      note="선택은 유행이 아니라 target robot의 data, action frequency, safety fixture와 recovery evidence로 결정합니다."
    >
      <div data-viz-canvas className="grid gap-4 lg:grid-cols-2">
        {LANES.map((lane) => (
          <section key={lane.title} className="min-w-0 border border-border/70 bg-background p-4 sm:p-5">
            <h4 className="text-sm font-black text-primary">{lane.title}</h4>
            <div className="mt-4 flex min-w-0 flex-col gap-2 sm:flex-row sm:items-stretch">
              {lane.flow.map((item, index) => (
                <div key={item} className="contents">
                  <div className="flex min-w-0 flex-1 items-center justify-center border border-border/70 bg-muted/20 px-2 py-3 text-center font-mono text-[11px] leading-5">
                    {item}
                  </div>
                  {index < lane.flow.length - 1 && (
                    <span aria-hidden className="self-center text-primary">
                      <span className="sm:hidden">↓</span>
                      <span className="hidden sm:inline">→</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-border/60 pt-4 text-xs leading-5">
              <p><strong>얻는 것:</strong> {lane.strength}</p>
              <p className="mt-2 text-muted-foreground"><strong>남는 경계:</strong> {lane.boundary}</p>
            </div>
          </section>
        ))}
      </div>
    </VizFrame>
  );
}
