import VizFrame from "@/components/viz/VizFrame";

export default function MethodBridgeViz() {
  return (
    <VizFrame eyebrow="같은 evidence · 다른 계산 경로" title="PPMI+SVD는 행렬을 먼저 만들고, SGNS는 관측쌍을 뽑아 score를 학습합니다" description="둘을 같은 알고리즘으로 부를 수는 없지만 word–context 통계를 압축한다는 연결은 비교할 수 있습니다." note="SGNS≈shifted PMI는 독립 cell optimum을 보는 분석입니다. 유한 차원·공유 parameter·SGD 결과의 정확한 등식은 아닙니다.">
      <div data-viz-canvas className="grid gap-3 lg:grid-cols-[8rem_minmax(0,1fr)_2rem_minmax(0,1fr)] lg:items-stretch">
        <div className="grid place-items-center border border-border p-4 text-center"><strong className="text-sm">19개 관측쌍</strong><span className="mt-2 text-[10px] text-muted-foreground">word · context</span></div>
        <div className="border border-border p-4"><p className="text-[10px] font-bold text-primary">명시적 경로</p><p className="mt-2 text-sm font-bold">Count → PPMI → SVD</p><p className="mt-2 font-mono text-xs text-muted-foreground">matrix cell을 만든 뒤 factorize</p></div>
        <div className="grid place-items-center text-primary"><span aria-hidden className="hidden lg:block">→</span><span aria-hidden className="lg:hidden">↓</span></div>
        <div className="border border-primary/45 bg-primary/[.04] p-4"><p className="text-[10px] font-bold text-primary">암묵적 경로</p><p className="mt-2 text-sm font-bold">Positive pair + k negatives → SGNS</p><p className="mt-2 font-mono text-xs text-muted-foreground">uᵥᵀv꜀ ≈ PMI(w,c) − log k</p></div>
      </div>
      <div className="mt-4 border-l-2 border-primary/45 pl-4 text-xs leading-6 text-muted-foreground">GloVe는 nonzero global count의 log를 bilinear score로 맞춰 두 관점을 또 다른 objective로 연결합니다. Contextual model은 같은 표면형도 문장 위치마다 다시 계산합니다.</div>
    </VizFrame>
  );
}
