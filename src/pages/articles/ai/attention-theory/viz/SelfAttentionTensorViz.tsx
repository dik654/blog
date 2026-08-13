const rows = [
  ["Input", "X", "n × dmodel", "같은 sequence representation"],
  ["Project", "Q · K · V", "n × dk · n × dk · n × dv", "서로 다른 learned projection"],
  ["Compare", "S=QKᵀ/√dk", "n × n", "query–key pair score"],
  ["Select", "A=softmax(S+M)", "n × n", "mask 뒤 row-wise probability"],
  ["Read", "Z=AV", "n × dv", "query마다 value를 weighted sum"],
];

export default function SelfAttentionTensorViz() {
  return (
    <figure data-viz="self-attention-tensor-flow" className="not-prose my-9 overflow-hidden rounded-xl border border-border/75 bg-card">
      <figcaption className="border-b border-border/60 px-4 py-4 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Tensor trace</p>
        <p className="mt-1 font-semibold">n×n은 어디서 생기고 무엇을 저장하는가</p>
      </figcaption>
      <div className="overflow-x-auto">
        <div className="min-w-[620px] divide-y divide-border/60">
          {rows.map(([stage, symbol, shape, meaning], index) => (
            <div key={stage} className="grid grid-cols-[3rem_5rem_10rem_1fr] items-center gap-3 bg-background px-4 py-3.5 sm:px-6">
              <p className="text-xs font-bold text-muted-foreground">0{index + 1}</p>
              <p className="text-sm font-semibold">{stage}</p>
              <code className="text-xs font-semibold text-primary">{symbol}<span className="ml-2 text-muted-foreground">{shape}</span></code>
              <p className="text-sm text-muted-foreground">{meaning}</p>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}
