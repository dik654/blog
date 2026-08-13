const FULL = ["decode A", "decode B", "prefill P: 2,048", "decode A", "decode B"];
const CHUNKED = ["A·B + P₁ 512", "A·B + P₂ 512", "A·B + P₃ 512", "A·B + P₄ 512"];

export default function ChunkedPrefillViz() {
  return (
    <figure data-viz="chunked-prefill-interleaving" className="not-prose my-12 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b bg-muted/20 px-5 py-5 sm:px-7">
        <p className="text-xs font-bold text-primary">PREFILL · DECODE INTERLEAVING</p>
        <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">Full prefill의 긴 stall을 여러 번의 짧은 batch 경계로 바꿉니다</h3>
      </figcaption>
      <div className="grid gap-6 p-5 sm:p-7">
        <article>
          <div className="flex items-center justify-between gap-4"><h4 className="font-bold">Full prefill</h4><span className="text-xs text-muted-foreground">decode가 긴 prefill 뒤까지 대기</span></div>
          <div className="mt-3 grid gap-2 sm:grid-cols-5">
            {FULL.map((item, index) => <div key={`${item}-${index}`} className={`min-w-0 rounded-md border px-3 py-3 text-center text-xs font-semibold leading-5 ${item.startsWith("prefill") ? "sm:col-span-2 border-amber-500/40 bg-amber-500/[0.06]" : "bg-background"}`}>{item}</div>)}
          </div>
        </article>
        <article className="border-t pt-6">
          <div className="flex items-center justify-between gap-4"><h4 className="font-bold">Chunked prefill</h4><span className="text-xs text-muted-foreground">매 경계에서 decode와 함께 재조립</span></div>
          <div className="mt-3 grid gap-2 sm:grid-cols-4">
            {CHUNKED.map((item) => <div key={item} className="min-w-0 rounded-md border border-primary/30 bg-primary/[0.04] px-3 py-3 text-center text-xs font-semibold leading-5">{item}</div>)}
          </div>
        </article>
      </div>
    </figure>
  );
}
