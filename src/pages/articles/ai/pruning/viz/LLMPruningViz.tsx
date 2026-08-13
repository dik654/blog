const rows = [
  ["Magnitude", "|Wᵢⱼ|", "없음", "없음", "가장 싼 기준선"],
  ["Wanda", "|Wᵢⱼ| ‖X₍:i₎‖₂", "channel norm", "없음", "activation-aware score"],
  ["SparseGPT", "‖XW−XW′‖²", "XᵀX proxy", "남은 weight 보정", "layer reconstruction"],
] as const;

export default function LLMPruningViz() {
  return (
    <figure data-viz className="overflow-hidden rounded-xl border border-border bg-card">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-semibold text-muted-foreground">LLM one-shot decision ledger</p>
        <h3 className="mt-1 text-base font-semibold">정보를 더 사용할수록 계산 비용과 보정 범위가 달라집니다</h3>
      </figcaption>
      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-[1fr_1.35fr_1fr_1.15fr_1.4fr] border-b border-border bg-muted/25 px-5 py-2.5 text-xs font-medium text-muted-foreground">
            <span>방법</span><span>importance / objective</span><span>activation 사용</span><span>weight update</span><span>해석</span>
          </div>
          {rows.map((row) => (
            <div key={row[0]} className="grid grid-cols-[1fr_1.35fr_1fr_1.15fr_1.4fr] border-b border-border/70 px-5 py-3 text-sm last:border-b-0">
              <strong>{row[0]}</strong>
              {row.slice(1).map((cell, index) => <span key={`${row[0]}-${index}`} className="pr-3 text-muted-foreground">{cell}</span>)}
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-px border-t border-border bg-border sm:grid-cols-3">
        {[["Calibration", "언어 · 길이 · prompt 형식"], ["Constraint", "unstructured · N:M · layer budget"], ["Output", "artifact + quality + runtime"]].map(([title, body]) => (
          <div key={title} className="bg-card px-4 py-3">
            <p className="text-xs font-semibold">{title}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}
