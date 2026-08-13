import VizFrame from "@/components/viz/VizFrame";

export default function ProjectionViz() {
  return (
    <VizFrame
      eyebrow="Projection"
      title="원래 vector에서 기준 방향과 평행한 성분을 떼어 냅니다"
      description="u=(3,4)를 x축에 비추면 평행 성분 (3,0)과 수직 성분 (0,4)로 분해됩니다."
    >
      <div className="grid gap-5 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
        <div className="min-w-0 border-t border-border/80 pt-3">
          <p className="text-xs font-bold text-muted-foreground">원래 vector</p>
          <p className="mt-1 font-mono text-lg font-bold text-foreground">u = (3, 4)</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">두 방향의 성분을 모두 가집니다.</p>
        </div>
        <span className="hidden text-sm text-muted-foreground sm:block">→</span>
        <div className="min-w-0 border-t border-primary/50 pt-3">
          <p className="text-xs font-bold text-primary">v 방향의 그림자</p>
          <p className="mt-1 font-mono text-lg font-bold text-foreground">(3, 0)</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">x축과 평행한 성분만 남깁니다.</p>
        </div>
        <span className="hidden text-sm text-muted-foreground sm:block">+</span>
        <div className="min-w-0 border-t border-border/80 pt-3">
          <p className="text-xs font-bold text-muted-foreground">수직으로 남은 성분</p>
          <p className="mt-1 font-mono text-lg font-bold text-foreground">(0, 4)</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">두 성분을 더하면 다시 u가 됩니다.</p>
        </div>
      </div>
    </VizFrame>
  );
}
