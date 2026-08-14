export function EcGpuOpsMappingViz() {
  const stages = [
    ["01", "canonical input", "bytes → field limbs"],
    ["02", "lane schedule", "mul-wide + carry"],
    ["03", "point schedule", "Jacobian add/double"],
    ["04", "canonical output", "normalize + parity"],
  ];
  return (
    <figure className="rounded-xl border border-border bg-card p-4 sm:p-6" aria-labelledby="ec-ops-viz-title">
      <figcaption id="ec-ops-viz-title"><p className="text-sm font-semibold text-primary">표현 계약이 kernel 전체를 관통한다</p><p className="mt-1 text-sm leading-6 text-muted-foreground">빠른 limb 연산도 입력 domain과 output normalization이 어긋나면 다른 곡선점을 만듭니다.</p></figcaption>
      <ol className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stages.map(([n, title, detail]) => <li key={n} className="min-w-0 rounded-lg border border-border bg-background p-4"><span className="text-xs font-semibold text-primary">{n}</span><strong className="mt-2 block break-words">{title}</strong><span className="mt-1 block break-words text-sm text-muted-foreground">{detail}</span></li>)}
      </ol>
      <div className="mt-5 rounded-lg border border-amber-500/45 bg-amber-500/5 p-4 text-sm"><strong>잘못된 최적화 경계</strong><p className="mt-1 leading-6 text-muted-foreground">carry가 끝나기 전에 다음 limb를 사용하거나, Montgomery-domain 값을 normal residue처럼 encode하거나, infinity·doubling 예외를 일반 add 식에 흘려보내면 안 됩니다.</p></div>
    </figure>
  );
}
