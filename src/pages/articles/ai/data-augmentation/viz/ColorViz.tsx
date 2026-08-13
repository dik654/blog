const stages = [
  ["Raw image", "uint8 0–255 또는 float 0–1", "입력 단위를 먼저 고정"],
  ["Stochastic color", "brightness·contrast·hue", "Train에서만 random sampling"],
  ["Deterministic normalize", "(x−μ)/σ", "Weight가 기대하는 좌표계"],
  ["Model input", "channel×height×width", "Train·validation·serving 동일"],
];

export default function ColorViz() {
  return (
    <figure data-viz="color-preprocess-order" className="min-w-0 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
      <figcaption className="mb-5 text-sm font-semibold">랜덤 증강과 입력 전처리를 순서로 분리합니다</figcaption>
      <div className="grid gap-4 md:grid-cols-4">
        {stages.map(([title, operation, check], index) => (
          <div key={title} className={`min-w-0 border-t pt-4 ${index === 1 ? "border-fuchsia-500/50" : "border-border"}`}>
            <p className="text-xs font-bold text-muted-foreground">0{index + 1}</p>
            <p className="mt-2 font-semibold">{title}</p>
            <p className="mt-2 font-mono text-xs leading-5 text-foreground">{operation}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{check}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}
