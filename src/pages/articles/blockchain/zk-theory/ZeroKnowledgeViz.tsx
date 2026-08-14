const messages = [
  { who: "Prover", label: "commit", value: "R = gʳ" },
  { who: "Verifier", label: "challenge", value: "e ← random" },
  { who: "Prover", label: "response", value: "s = r + ew" },
  { who: "Verifier", label: "check", value: "gˢ = R·Yᵉ" },
];

export default function ZeroKnowledgeViz() {
  return (
    <figure data-viz="sigma-protocol-flow" data-viz-canvas className="not-prose my-8 min-w-0 rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <figcaption className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Sigma protocol</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">먼저 commitment를 고정하고 예측할 수 없는 challenge에 답해야 witness를 몰라도 흉내 내는 전략과 실제 knowledge를 구분할 수 있습니다.</p>
      </figcaption>
      <div className="grid gap-3 md:grid-cols-4">
        {messages.map((message, index) => (
          <div key={message.label} className="relative min-w-0 rounded-lg border border-border/80 bg-background p-4">
            <p className="text-xs font-semibold text-primary">{message.who}</p>
            <p className="mt-2 text-sm font-semibold">{message.label}</p>
            <p className="mt-3 break-words font-mono text-sm">{message.value}</p>
            {index < messages.length - 1 && <span aria-hidden className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-sm text-muted-foreground md:block">→</span>}
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border/70 bg-muted/20 p-4 text-xs leading-5"><strong>Extractor 관점</strong><br /><span className="text-muted-foreground">같은 R에 서로 다른 e,e′ 응답이 있으면 witness w를 계산합니다.</span></div>
        <div className="rounded-lg border border-border/70 bg-muted/20 p-4 text-xs leading-5"><strong>Simulator 관점</strong><br /><span className="text-muted-foreground">w 없이도 verifier가 보는 transcript와 구별하기 어려운 view를 만듭니다.</span></div>
      </div>
    </figure>
  );
}
