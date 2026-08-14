const flow = [
  ["BERA stake", "validator active set·proposal probability"],
  ["BGT boost", "holder가 validator에 non-transferable voting power 위임"],
  [
    "block emission",
    "validator reward allocation이 whitelisted vault로 BGT 분배",
  ],
  [
    "vault stake",
    "사용자가 eligible receipt token을 맡기고 vault share만큼 BGT 수령",
  ],
] as const;

export default function ModernBerachainViz() {
  return (
    <figure
      data-viz="berachain-pol-flow"
      className="rounded-xl border border-border bg-card p-4 sm:p-6"
    >
      <figcaption className="mb-4">
        <p className="text-sm font-semibold text-primary">
          Security와 incentive의 두 경로
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          BERA stake가 block proposer를 정하고, BGT boost·allocation은 emission
          방향을 바꿉니다.
        </p>
      </figcaption>
      <div data-viz-canvas className="grid gap-3 md:grid-cols-4">
        {flow.map(([a, b], i) => (
          <div key={a} className="min-w-0 border-l border-border pl-3">
            <p className="text-xs font-semibold text-primary">
              {i + 1} · {a}
            </p>
            <p className="mt-2 break-words text-sm leading-6">{b}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}
