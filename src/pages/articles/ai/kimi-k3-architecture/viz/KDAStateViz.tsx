import VizFrame from "@/components/viz/VizFrame";

export default function KDAStateViz() {
  return (
    <VizFrame
      eyebrow="Recurrent state update"
      title="KDA는 channel별로 이전 state를 남기고, key 방향의 오차만 고쳐 쓴다"
      description="Retention α가 이전 memory를 먼저 감쇠하고, delta rule이 현재 key에서 예측한 value와 새 value의 차이를 β만큼 반영합니다."
    >
      <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground">이전 state</p>
          <p className="mt-2 font-mono text-sm font-bold text-foreground">Sₜ₋₁</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">과거 key→value association</p>
        </div>
        <span aria-hidden className="hidden text-muted-foreground md:block">→</span>
        <div className="rounded-lg border border-primary/50 bg-primary/5 p-4">
          <p className="text-xs font-bold text-primary">retain + correct</p>
          <div className="mt-3 grid grid-cols-2 gap-3 text-center text-xs">
            <div className="border-r border-primary/20 pr-3"><strong className="font-mono">αₜ</strong><span className="mt-1 block text-muted-foreground">channel memory</span></div>
            <div><strong className="font-mono">βₜ</strong><span className="mt-1 block text-muted-foreground">write strength</span></div>
          </div>
        </div>
        <span aria-hidden className="hidden text-muted-foreground md:block">→</span>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground">현재 state와 read</p>
          <p className="mt-2 font-mono text-sm font-bold text-foreground">Sₜ → Sₜᵀqₜ</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">고정 크기 state에서 query 응답</p>
        </div>
      </div>
    </VizFrame>
  );
}
