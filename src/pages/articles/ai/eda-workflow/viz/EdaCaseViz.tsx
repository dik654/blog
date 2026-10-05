import VizFrame from "@/components/viz/VizFrame";

const stages = [
  ["Unit", "1 row = 1 delivery", "1,000 orders · repeated customers"],
  ["Overall", "100 / 1,000 = 10%", "전체 sensor missing"],
  ["Device slice", "80 / 200 = 40%", "특정 장비에 결측 집중"],
  ["Boundary", "customer + date", "group·time split before fitting"],
] as const;

export default function EdaCaseViz() {
  return (
    <VizFrame
      eyebrow="1,000-delivery case"
      title="전체 10%가 특정 장비에서는 40%입니다"
      description="같은 배송 데이터도 unit·전체 집계·slice·split boundary를 함께 봐야 결측 구조가 드러납니다."
    >
      <div data-viz data-viz-canvas className="grid min-w-0 gap-3 sm:grid-cols-2">
        {stages.map(([title, value, detail], index) => (
          <article key={title} className="min-w-0 border border-border/70 bg-background p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-foreground">{title}</p>
              <span className="font-mono text-xs text-primary">0{index + 1}</span>
            </div>
            <p className="mt-4 font-mono text-base font-bold text-foreground">{value}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
          </article>
        ))}
      </div>
      <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">
        10%를 그대로 대체 규칙으로 쓰지 않습니다. 장비별 40%가 생긴 수집 경로와 target 시점을 먼저 확인합니다.
      </p>
    </VizFrame>
  );
}
