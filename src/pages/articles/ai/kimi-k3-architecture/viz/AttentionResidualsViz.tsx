import VizFrame from "@/components/viz/VizFrame";

export default function AttentionResidualsViz() {
  return (
    <VizFrame
      eyebrow="Depth memory"
      title="Full AttnRes의 layer별 source를 K3에서는 8개 block으로 묶는다"
      description="Embedding을 별도 source로 두고 93개 main layer를 최대 12-layer 크기의 8개 block으로 합치면, depth source는 embedding을 포함해 9개가 됩니다."
      note="마지막 block은 12개보다 짧습니다. 그림의 12개 L 표시는 Full AttnRes에서 layer별 source가 늘어나는 방향을 축약한 예이지 K3의 전체 layer 수가 아닙니다."
    >
      <div className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="min-w-0">
          <p className="text-xs font-bold text-foreground">Full AttnRes</p>
          <div className="mt-4 grid grid-cols-6 gap-2">
            {Array.from({ length: 12 }, (_, index) => (
              <span key={index} className="rounded-md border border-border bg-background py-3 text-center font-mono text-[10px] text-muted-foreground">L{index + 1}</span>
            ))}
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">Layer가 깊어질수록 source state가 L에 비례</p>
        </section>
        <section className="min-w-0 border-t border-primary/40 pt-4 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold text-primary">K3 Block AttnRes</p>
            <span className="font-mono text-[11px] text-muted-foreground">8 blocks + embedding</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
            <span className="rounded-md border border-primary/50 bg-primary/5 py-3 text-center text-[10px] font-bold text-primary">Embed</span>
            {Array.from({ length: 8 }, (_, index) => (
              <span key={index} className="rounded-md border border-border bg-background py-3 text-center font-mono text-[10px] text-foreground">B{index + 1}</span>
            ))}
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">Block 안은 partial sum, block 사이는 learned attention</p>
        </section>
      </div>
    </VizFrame>
  );
}
