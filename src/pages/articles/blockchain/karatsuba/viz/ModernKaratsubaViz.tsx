const products = [
  { id: "높은 곱", formula: "12 × 56 = 672", role: "첫 번째 곱" },
  { id: "낮은 곱", formula: "34 × 78 = 2652", role: "두 번째 곱" },
  { id: "합의 곱", formula: "46 × 134 = 6164", role: "세 번째 곱" },
] as const;

export default function ModernKaratsubaViz() {
  return (
    <figure
      data-viz="karatsuba-split-recombine"
      data-viz-canvas
      className="not-prose my-8 min-w-0 rounded-xl border border-border/70 bg-card p-4 sm:p-6"
    >
      <figcaption className="mb-5">
        <p className="text-sm font-semibold text-foreground">
          네 번의 작은 곱을 세 번으로 바꾸는 재결합
        </p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          1234=12·100+34, 5678=56·100+78로 나눈 뒤, 교차항을 합의 곱
          하나에서 꺼냅니다.
        </p>
      </figcaption>
      <div className="grid gap-3 md:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-0 rounded-lg border border-border bg-background p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-sm font-semibold text-primary">
                {product.id}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {product.role}
              </span>
            </div>
            <p className="mt-3 break-words font-mono text-xs leading-5 text-foreground">
              {product.formula}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
        <p className="text-xs text-muted-foreground">가운데 항 = 6164 − 672 − 2652 = 2840</p>
        <p className="mt-2 break-words font-mono text-sm font-semibold text-foreground">
          672·100² + 2840·100 + 2652 = 7,006,652
        </p>
      </div>
    </figure>
  );
}
