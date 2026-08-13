const tokens = [
  { name: "[CLS]", source: "learned", vector: [".2", "−.4", ".7"] },
  { name: "age", source: "42·w + b", vector: [".8", ".1", "−.3"] },
  { name: "city", source: "E[서울] + b", vector: ["−.1", ".6", ".4"] },
  { name: "income", source: "3.7·w + b", vector: [".5", "−.2", ".9"] },
];

export default function FTTransformerViz() {
  return (
    <figure data-viz="ft-transformer-token-path" className="min-w-0 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
      <figcaption>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary/75">Feature tokenizer</p>
        <p className="mt-2 text-lg font-semibold">Column별 계산이 같은 token shape로 모인 뒤 row 안에서 상호작용합니다</p>
      </figcaption>
      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[1.3fr_.8fr]">
        <div className="min-w-0 overflow-hidden rounded-lg border border-border/70">
          <div className="grid grid-cols-[5rem_1fr_7rem] gap-3 bg-muted/35 px-3 py-3 text-xs font-semibold text-muted-foreground sm:grid-cols-[6rem_1fr_9rem]">
            <span>Token</span><span>Column-specific transform</span><span>d차원 일부</span>
          </div>
          {tokens.map((token) => (
            <div key={token.name} className="grid min-w-0 grid-cols-[5rem_1fr_7rem] items-center gap-3 border-t border-border/60 px-3 py-4 sm:grid-cols-[6rem_1fr_9rem]">
              <p className="font-mono text-sm font-semibold">{token.name}</p>
              <p className="min-w-0 break-words text-sm text-muted-foreground">{token.source}</p>
              <div className="grid grid-cols-3 gap-1 font-mono text-[11px]">
                {token.vector.map((v, i) => <span key={`${token.name}-${i}`} className="border-b border-primary/35 pb-1 text-center">{v}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div className="min-w-0 border-l border-border/70 pl-5">
          <p className="text-sm font-semibold">한 row의 attention read</p>
          <div className="mt-4 grid grid-cols-[4.5rem_repeat(4,1fr)] gap-1 text-center text-[10px] sm:text-xs">
            <span />
            {tokens.map((t) => <span key={`h-${t.name}`} className="truncate py-1">{t.name}</span>)}
            {tokens.map((row, ri) => (
              <div key={`r-${row.name}`} className="contents">
                <span className="truncate py-2 text-left font-medium">{row.name}</span>
                {tokens.map((col, ci) => {
                  const values = [[.42,.19,.16,.23],[.14,.48,.17,.21],[.18,.12,.51,.19],[.31,.20,.18,.31]];
                  const value = values[ri][ci];
                  return <span key={`${row.name}-${col.name}`} className="border border-border/55 py-2 text-muted-foreground" style={{ backgroundColor: `hsl(var(--primary) / ${0.04 + value * 0.22})` }}>{value.toFixed(2)}</span>;
                })}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">마지막 [CLS] vector만 prediction head로 전달합니다. 숫자는 동작을 보여 주기 위한 예시이며 feature importance가 아닙니다.</p>
        </div>
      </div>
    </figure>
  );
}
