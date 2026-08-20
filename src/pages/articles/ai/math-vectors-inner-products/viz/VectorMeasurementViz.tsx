import VizFrame from "@/components/viz/VizFrame";

const measures = [
  { step: "01", label: "좌표", value: "x = (3, 4)", detail: "가로 3 · 세로 4" },
  { step: "02", label: "길이", value: "‖x‖ = 5", detail: "원점부터의 거리" },
  { step: "03", label: "방향 비교", value: "x · v", detail: "겹치는 성분을 scalar로" },
] as const;

export default function VectorMeasurementViz() {
  return (
    <VizFrame
      eyebrow="Vector reading path"
      title="좌표를 묶고, 길이를 재고, 다른 방향과 비교합니다"
      description="하나의 vector를 읽는 세 계산은 이후 모델 수식에서도 같은 순서로 재사용됩니다."
    >
      <div className="grid gap-6 md:grid-cols-[1.05fr_1fr] md:gap-10">
        <div className="min-w-0">
          <div className="relative mx-auto aspect-square w-full max-w-[280px] border-l border-b border-border/80">
            <span className="absolute -bottom-6 right-0 text-[10px] text-muted-foreground">x₁</span>
            <span className="absolute -left-5 top-0 text-[10px] text-muted-foreground">x₂</span>
            <span className="absolute bottom-[-0.3rem] left-[-0.3rem] h-2 w-2 rounded-sm bg-foreground" />
            <span className="absolute bottom-0 left-0 h-px w-[60%] origin-left -rotate-[53deg] bg-primary" />
            <span className="absolute bottom-[48%] left-[36%] h-3 w-3 -translate-x-1/2 translate-y-1/2 rounded-sm border border-primary bg-background" />
            <span className="absolute bottom-[52%] left-[40%] font-mono text-xs font-bold text-primary">(3, 4)</span>
            <span className="absolute bottom-2 left-2 text-[10px] text-muted-foreground">원점</span>
          </div>
        </div>
        <ol className="divide-y divide-border/70 border-y border-border/70">
          {measures.map((item) => (
            <li key={item.step} className="grid grid-cols-[2rem_1fr] gap-3 py-4">
              <span className="font-mono text-xs font-bold text-primary">{item.step}</span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground">{item.label}</p>
                <p className="mt-1 break-words font-mono text-sm text-foreground">{item.value}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}
