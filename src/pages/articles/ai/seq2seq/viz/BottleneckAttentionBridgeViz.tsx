import VizFrame from "@/components/viz/VizFrame";

export default function BottleneckAttentionBridgeViz() {
  return (
    <VizFrame
      eyebrow="Interface evolution"
      title="Attention은 encoder–decoder를 없앤 것이 아니라 두 모듈 사이의 handoff를 넓혔습니다"
      description="고정 context 하나 대신 source position별 state를 보관하고 target step마다 다른 weighted view를 만듭니다."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Bridge title="Fixed context" source="h₁ … hₛ → q(X) 하나" access="모든 target step이 같은 q를 사용" boundary="source 위치를 다시 조회하지 못함" />
        <Bridge title="Attention context" source="h₁ … hₛ를 모두 보관" access="step t마다 αₜ₁ … αₜₛ를 다시 계산" boundary="score·value·downstream path까지 함께 해석" accent />
      </div>
    </VizFrame>
  );
}

function Bridge({ title, source, access, boundary, accent = false }: { title: string; source: string; access: string; boundary: string; accent?: boolean }) {
  return <article className={`rounded-lg border p-4 ${accent ? "border-primary/30 bg-primary/[0.035]" : "border-border/70 bg-background"}`}><p className="text-sm font-bold text-foreground">{title}</p><p className="mt-3 font-mono text-xs leading-5 text-primary">{source}</p><p className="mt-3 text-xs leading-5 text-foreground/80">접근: {access}</p><p className="mt-3 border-t border-border/60 pt-3 text-xs leading-5 text-muted-foreground">해석 경계: {boundary}</p></article>;
}
