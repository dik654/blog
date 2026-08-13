import VizFrame from "@/components/viz/VizFrame";

function Path({ title, steps, result, accent = false }: { title: string; steps: string[]; result: string; accent?: boolean }) {
  return (
    <article className={`rounded-lg border p-4 ${accent ? "border-primary/30 bg-primary/[0.035]" : "border-border/70 bg-background"}`}>
      <p className="text-sm font-bold text-foreground">{title}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step} className="min-w-0 border-l border-border pl-3">
            <p className="text-[10px] font-bold text-muted-foreground">{index + 1}</p>
            <p className="mt-1 break-words font-mono text-xs leading-5 text-foreground/80">{step}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 border-t border-border/60 pt-3 text-xs leading-5 text-muted-foreground">결과: {result}</p>
    </article>
  );
}

export default function LinearCollapseViz() {
  return (
    <VizFrame
      eyebrow="Why nonlinearity"
      title="Activation이 없으면 깊이를 늘려도 하나의 affine layer로 접힙니다"
      description="두 경로의 차이는 layer 수가 아니라 중간에 비선형 좌표 변환이 있느냐입니다."
    >
      <div className="grid gap-4">
        <Path title="Affine만 연결" steps={["xW₁+b₁", "(·)W₂+b₂", "xW_eff+b_eff"]} result="결정 경계는 여전히 하나의 hyperplane입니다." />
        <Path accent title="Activation을 사이에 배치" steps={["xW₁+b₁", "φ(·)", "φ(·)W₂+b₂"]} result="입력 공간을 구간별로 다시 배치해 여러 경계를 조합할 수 있습니다." />
      </div>
    </VizFrame>
  );
}
