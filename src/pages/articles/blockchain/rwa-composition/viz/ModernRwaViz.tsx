const actors = [
  ["법적 원장", "issuer/SPV · holder rights · insolvency rank"],
  ["자산 운영", "custodian · servicer · valuation · cash flow"],
  ["토큰 원장", "mint/burn · transfer eligibility · holder address"],
  ["DeFi 사용", "oracle cutoff · haircut · liquidation · redemption queue"],
] as const;

export default function ModernRwaViz() {
  return (
    <figure
      data-viz="rwa-claim-map"
      className="rounded-xl border border-border bg-card p-4 sm:p-6"
    >
      <figcaption className="mb-4">
        <p className="text-sm font-semibold text-primary">RWA claim map</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Token transfer와 underlying legal title 이전은 같은 event라고 가정하지
          않습니다.
        </p>
      </figcaption>
      <div data-viz-canvas className="grid gap-3 md:grid-cols-2">
        {actors.map(([a, b], i) => (
          <div
            key={a}
            className="flex min-w-0 gap-3 border-t border-border pt-3"
          >
            <span className="text-xs font-semibold text-primary">{i + 1}</span>
            <div className="min-w-0">
              <p className="font-semibold">{a}</p>
              <p className="mt-1 break-words text-sm leading-6 text-muted-foreground">
                {b}
              </p>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}
