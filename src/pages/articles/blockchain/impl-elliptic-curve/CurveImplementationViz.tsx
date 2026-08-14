export function CurveImplementationViz() {
  return (
    <div data-viz="curve-implementation-boundary" className="rounded-xl border border-border bg-card p-4 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">untrusted bytes to pairing receipt</p>
      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch">
        {[
          ["encoded point", "tag · coordinates · infinity"],
          ["typed G1/G2", "canonical · on-curve · subgroup"],
          ["operation receipt", "add · scalar mul · pairing product"],
        ].map(([title, detail], index) => (
          <div key={title} className="contents">
            <div className="min-w-0 rounded-lg border border-border bg-muted/20 p-4">
              <p className="break-words font-semibold">{title}</p>
              <p className="mt-1 break-words text-sm leading-6 text-muted-foreground">{detail}</p>
            </div>
            {index < 2 ? <div aria-hidden className="hidden self-center text-muted-foreground md:block">→</div> : null}
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">Admission 검사를 통과하기 전의 bytes는 곡선 점 타입이 아닙니다. Pairing 결과도 profile digest와 vector receipt 없이 release하지 않습니다.</p>
    </div>
  );
}
