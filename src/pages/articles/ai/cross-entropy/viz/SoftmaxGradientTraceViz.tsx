import VizFrame from "@/components/viz/VizFrame";

const rows = [
  { name: "고양이", probability: 0.1, target: 0, gradient: 0.1 },
  { name: "개", probability: 0.7, target: 1, gradient: -0.3 },
  { name: "여우", probability: 0.2, target: 0, gradient: 0.2 },
];

export default function SoftmaxGradientTraceViz() {
  return (
    <VizFrame
      eyebrow="Fused gradient"
      title="p − y는 각 logit이 어느 방향으로 움직여야 하는지 바로 보여줍니다"
      description="정답은 ‘개’지만 모델은 0.7만 할당했습니다. gradient descent는 음수 gradient인 정답 logit을 올리고 나머지는 내립니다."
      note="세 gradient의 합은 0입니다. 모든 logit에 같은 상수를 더해도 softmax 확률이 변하지 않는다는 성질과 맞닿아 있습니다."
    >
      <div className="space-y-3">
        {rows.map((row) => {
          const positive = row.gradient > 0;
          return (
            <div key={row.name} className="grid gap-3 rounded-lg border border-border/70 bg-background p-4 sm:grid-cols-[90px_1fr_124px] sm:items-center">
              <div>
                <p className="font-semibold text-foreground">{row.name}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">y = {row.target}</p>
              </div>
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span>prediction</span>
                  <span className="font-mono">p = {row.probability.toFixed(1)}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary/65" style={{ width: `${row.probability * 100}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
                <p className="font-mono text-sm font-bold text-foreground">g = {row.gradient > 0 ? "+" : ""}{row.gradient.toFixed(1)}</p>
                <p className="mt-1 text-xs text-muted-foreground">gradient descent: logit {positive ? "↓" : "↑"}</p>
              </div>
            </div>
          );
        })}
      </div>
    </VizFrame>
  );
}
