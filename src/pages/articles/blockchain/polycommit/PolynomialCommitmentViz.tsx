const items = [
  { step: "1", title: "Commit", body: "f(X)=X²+2X+3", foot: "polynomial을 먼저 고정" },
  { step: "2", title: "Commitment", body: "C = Commit(f)", foot: "짧은 digest 또는 group element" },
  { step: "3", title: "Open", body: "z=4 · y=10 · π", foot: "한 점의 값과 opening proof" },
  { step: "4", title: "Verify", body: "Verify(C,4,10,π)", foot: "accept / reject" },
];

export default function PolynomialCommitmentViz() {
  return (
    <figure data-viz="polynomial-commitment-flow" data-viz-canvas className="not-prose my-8 min-w-0 rounded-xl border border-border/70 bg-card p-4 sm:p-6">
      <figcaption className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Commit → open → verify</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Polynomial 전체를 다시 보내지 않고 먼저 고정한 C와 특정 evaluation의 일관성만 검사합니다.
          </p>
      </figcaption>
      <div className="grid gap-3 md:grid-cols-4">
        {items.map((item, index) => (
          <div key={item.step} className="relative min-w-0 rounded-lg border border-border/80 bg-background p-4">
            <div className="flex items-center gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/5 text-xs font-bold text-primary">{item.step}</span>
              <span className="text-sm font-semibold">{item.title}</span>
            </div>
            <p className="mt-4 break-words font-mono text-sm text-foreground">{item.body}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.foot}</p>
            {index < items.length - 1 && <span aria-hidden className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-sm text-muted-foreground md:block">→</span>}
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border/70 bg-muted/20 p-3 text-xs leading-5"><strong>Binding</strong><br /><span className="text-muted-foreground">같은 C를 다른 값으로 열기 어려운가</span></div>
        <div className="rounded-lg border border-border/70 bg-muted/20 p-3 text-xs leading-5"><strong>Hiding</strong><br /><span className="text-muted-foreground">C가 polynomial을 얼마나 숨기는가</span></div>
        <div className="rounded-lg border border-border/70 bg-muted/20 p-3 text-xs leading-5"><strong>Degree·setup</strong><br /><span className="text-muted-foreground">허용 차수와 신뢰 초기화는 무엇인가</span></div>
      </div>
    </figure>
  );
}
