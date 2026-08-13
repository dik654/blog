import VizFrame from "@/components/viz/VizFrame";

export default function ResidualPathViz() {
  return (
    <VizFrame
      eyebrow="Two-path block"
      title="입력은 learnable update와 shortcut 두 경로로 다음 state에 도달합니다"
      description="Shape가 같으면 shortcut에는 parameter가 없고, residual branch만 입력 표현에 더할 변화를 학습합니다."
    >
      <div className="grid gap-5 md:grid-cols-[1fr_4rem_1fr] md:items-center">
        <div className="min-w-0 border-l border-border/80 pl-4">
          <p className="text-sm font-bold text-foreground">Residual branch</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            F(x; W) · convolution · normalization · activation
          </p>
        </div>
        <div className="border-y border-border/80 py-3 text-center font-mono text-sm font-bold text-primary">
          SUM
        </div>
        <div className="min-w-0 border-l border-border/80 pl-4">
          <p className="text-sm font-bold text-foreground">Shortcut</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            x 또는 Wₛx · representation transport
          </p>
        </div>
      </div>
    </VizFrame>
  );
}
