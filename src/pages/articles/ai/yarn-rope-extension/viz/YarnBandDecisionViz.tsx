const bands = [
  {
    range: "r < βslow",
    title: "긴 파장 · interpolation",
    rotations: "학습 구간에서 한 바퀴 미만",
    action: "θ를 1/s로 낮춰 새 위치도 익숙한 각도 범위에 넣습니다.",
    bars: 2,
    tone: "bg-sky-500/70",
    border: "border-sky-500/25",
  },
  {
    range: "βslow ≤ r ≤ βfast",
    title: "전환 구간 · blend",
    rotations: "일부는 절대 위치, 일부는 상대 거리를 학습",
    action: "원래 frequency와 보간 frequency를 ramp로 섞습니다.",
    bars: 5,
    tone: "bg-violet-500/70",
    border: "border-violet-500/25",
  },
  {
    range: "r > βfast",
    title: "짧은 파장 · extrapolation",
    rotations: "학습 구간에서 여러 번 회전",
    action: "근거리 위치 해상도를 지키도록 원래 θ를 보존합니다.",
    bars: 9,
    tone: "bg-fuchsia-500/70",
    border: "border-fuchsia-500/25",
  },
];

export default function YarnBandDecisionViz() {
  return (
    <figure
      data-viz="yarn-band-decision"
      className="not-prose my-9 overflow-hidden rounded-xl border border-border/75 bg-card"
    >
      <figcaption className="border-b border-border/60 px-4 py-4 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
          Frequency-wise routing
        </p>
        <p className="mt-1 font-semibold">같은 scaling factor를 모든 RoPE 차원에 적용하지 않습니다</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          r=L/λ는 pretraining context 안에서 해당 차원이 몇 바퀴 회전했는지 나타냅니다.
        </p>
      </figcaption>

      <div className="grid gap-px bg-border/60 lg:grid-cols-3">
        {bands.map((band, index) => (
          <div key={band.title} className="min-w-0 bg-background p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-bold text-muted-foreground">0{index + 1}</p>
              <code className="rounded-md bg-muted px-2 py-1 text-[11px] font-semibold text-foreground">
                {band.range}
              </code>
            </div>
            <p className="mt-4 font-semibold">{band.title}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{band.rotations}</p>

            <div className={`mt-4 rounded-lg border ${band.border} bg-muted/15 p-3`}>
              <div className="grid grid-cols-9 gap-1" aria-hidden="true">
                {Array.from({ length: 9 }, (_, cell) => (
                  <span
                    key={cell}
                    className={`h-2 rounded-[2px] ${cell < band.bars ? band.tone : "bg-muted"}`}
                  />
                ))}
              </div>
              <p className="mt-3 text-sm leading-6 text-foreground/75">{band.action}</p>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}
