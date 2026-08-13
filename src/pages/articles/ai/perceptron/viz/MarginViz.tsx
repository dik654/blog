import VizFrame from "@/components/viz/VizFrame";

const cases = [
  {
    title: "경계에 가까운 분리",
    margin: "최소 거리 γ = 0.25",
    detail: "조금만 흔들려도 가장 가까운 example이 반대편으로 넘어갑니다.",
    positions: ["8%", "44%", "56%", "92%"],
  },
  {
    title: "여유가 큰 분리",
    margin: "최소 거리 γ = 0.50",
    detail: "모든 example이 경계에서 더 멀어 update가 찾아야 할 방향이 분명합니다.",
    positions: ["6%", "26%", "74%", "94%"],
  },
] as const;

export default function MarginViz() {
  return (
    <VizFrame
      eyebrow="Margin intuition"
      title="둘 다 정답을 맞혀도 경계와 가장 가까운 example의 거리는 다를 수 있습니다"
      description="Margin은 평균 거리가 아니라 가장 불리한 training example이 확보한 최소 여유입니다."
    >
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        {cases.map((item) => (
          <section key={item.title} className="min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-bold text-foreground">{item.title}</p>
              <p className="font-mono text-xs font-bold text-primary">
                {item.margin}
              </p>
            </div>
            <div className="relative mt-6 h-16 border-y border-border/70">
              <div className="absolute bottom-2 top-2 left-1/2 w-px bg-foreground/60" />
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 translate-y-full pt-2 text-[10px] text-muted-foreground">
                결정 경계
              </span>
              {item.positions.map((left, index) => (
                <span
                  key={left}
                  className={`absolute top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md border text-[10px] font-bold ${
                    index < 2
                      ? "border-border bg-background text-muted-foreground"
                      : "border-primary/40 bg-background text-primary"
                  }`}
                  style={{ left }}
                >
                  {index < 2 ? "−" : "+"}
                </span>
              ))}
            </div>
            <p className="mt-8 text-xs leading-5 text-muted-foreground">
              {item.detail}
            </p>
          </section>
        ))}
      </div>
    </VizFrame>
  );
}
