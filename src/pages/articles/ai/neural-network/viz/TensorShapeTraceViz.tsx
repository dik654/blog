import VizFrame from "@/components/viz/VizFrame";

const operations = [
  ["Batch input", "X", "B × 784", "B개 이미지를 행으로 묶음"],
  ["Hidden affine", "XW¹ + b¹", "B × 128", "784→128 projection"],
  ["Hidden activation", "ReLU(Z¹)", "B × 128", "shape는 유지"],
  ["Output affine", "A¹W² + b²", "B × 10", "열 개 class logit"],
];

export default function TensorShapeTraceViz() {
  return (
    <VizFrame
      eyebrow="Tensor contract"
      title="Forward pass는 값보다 먼저 shape contract를 따라가면 안전합니다"
      description="MNIST용 784→128→10 MLP를 예로 들었습니다. Bias는 마지막 축에 broadcast됩니다."
    >
      <div className="divide-y divide-border/60 rounded-lg border border-border/70 bg-background">
        {operations.map(([name, expression, shape, note], index) => (
          <div key={name} className="grid min-w-0 gap-2 p-4 sm:grid-cols-[2rem_8rem_minmax(0,1fr)_6rem] sm:items-center">
            <span className="text-[11px] font-bold text-muted-foreground">{index + 1}</span>
            <p className="text-sm font-semibold text-foreground">{name}</p>
            <p className="min-w-0 break-words font-mono text-xs text-primary">{expression}</p>
            <div className="sm:text-right">
              <p className="font-mono text-xs font-bold text-foreground">{shape}</p>
              <p className="mt-1 text-[10px] text-muted-foreground sm:hidden">{note}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">검사 순서: batch 축 보존 → contraction 축 일치 → output feature 축 확인 → bias broadcast 축 확인.</p>
    </VizFrame>
  );
}
