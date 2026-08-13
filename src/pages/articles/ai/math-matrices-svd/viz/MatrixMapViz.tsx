import VizFrame from "@/components/viz/VizFrame";

const steps = [
  ["Input coordinates", "x ∈ ℝⁿ", "n values"],
  ["Row-wise dot products", "A x", "m comparisons"],
  ["Output coordinates", "y ∈ ℝᵐ", "m values"],
] as const;

export default function MatrixMapViz() {
  return (
    <VizFrame eyebrow="Linear map" title="각 row가 input 전체를 읽어 output coordinate 하나를 만듭니다" description="행렬의 shape는 저장 모양뿐 아니라 함수의 input·output interface입니다.">
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map(([title, expression, note], index) => (
          <div key={title} className="min-w-0 border-t border-border/80 pt-4">
            <p className="font-mono text-xs font-bold text-primary">0{index + 1}</p>
            <p className="mt-3 text-sm font-bold">{title}</p>
            <p className="mt-3 break-words font-mono text-sm">{expression}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{note}</p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
