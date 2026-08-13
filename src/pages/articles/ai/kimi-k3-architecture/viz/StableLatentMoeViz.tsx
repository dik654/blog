import VizFrame from "@/components/viz/VizFrame";

export default function StableLatentMoeViz() {
  return (
    <VizFrame
      eyebrow="Width path"
      title="Full-width shared path와 half-width routed path를 합친다"
      description="Hidden 7,168 전체를 모든 routed expert에 보내지 않고 3,584 latent로 내린 뒤, 선택된 16개 expert의 결과만 다시 full width로 올립니다."
      note="2개의 shared expert는 모든 token이 계산하고, 896개의 routed expert 가운데 16개만 선택됩니다. Active parameter는 이 두 경로와 나머지 shared layer를 함께 셉니다."
    >
      <div className="grid gap-6 lg:grid-cols-[0.55fr_1fr_0.55fr] lg:items-center">
        <div className="rounded-lg border border-border bg-background p-4 text-center">
          <p className="text-xs text-muted-foreground">model hidden</p>
          <p className="mt-2 font-mono text-lg font-bold text-foreground">7,168</p>
        </div>
        <div className="space-y-4">
          <section className="rounded-lg border border-border bg-background p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold text-foreground">Shared path</p>
              <span className="font-mono text-xs text-primary">2 / always</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">Full width에서 공통 feature를 처리</p>
          </section>
          <section className="rounded-lg border border-primary/50 bg-primary/5 p-4">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
              <div><p className="text-[11px] text-muted-foreground">down</p><p className="mt-1 font-mono text-xs font-bold">3,584</p></div>
              <span aria-hidden className="text-muted-foreground">→</span>
              <div><p className="text-[11px] text-muted-foreground">Top-k</p><p className="mt-1 font-mono text-xs font-bold">16 / 896</p></div>
            </div>
            <p className="mt-4 border-t border-primary/20 pt-3 text-center text-xs text-muted-foreground">RMSNorm 뒤 Wup으로 full width 복원</p>
          </section>
        </div>
        <div className="rounded-lg border border-primary/50 bg-primary/5 p-4 text-center">
          <p className="text-xs text-muted-foreground">합산 output</p>
          <p className="mt-2 font-mono text-lg font-bold text-foreground">7,168</p>
        </div>
      </div>
    </VizFrame>
  );
}
