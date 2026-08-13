const rows = [
  ["Base storage", "NF4 code + quant metadata", "frozen", "Resident weight byte 감소"],
  ["Base compute", "dequantize → bf16/fp16 kernel", "gradient 통과", "4-bit integer matmul과 동일하지 않음"],
  ["Adapter", "A·B training dtype", "trainable", "weight·gradient·optimizer 필요"],
  ["Activation", "batch×sequence×hidden", "backward 저장", "Base bit와 무관하게 peak 지배 가능"],
  ["Workspace", "kernel·allocator·paged state", "runtime", "실측 peak에서 확인"],
] as const;

export default function QLoraDetailViz() {
  return (
    <figure data-viz className="rounded-xl border border-border bg-background p-4 sm:p-5">
      <figcaption><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">QLoRA precision ledger</p><p className="mt-1 font-semibold">4-bit라는 한 단어를 저장·연산·학습 state로 나눕니다</p></figcaption>
      <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[44rem] border-collapse text-left text-xs"><thead><tr className="border-y border-border text-muted-foreground"><th className="py-2 pr-4">항목</th><th className="py-2 pr-4">Representation</th><th className="py-2 pr-4">Gradient</th><th className="py-2">Memory/compute 의미</th></tr></thead><tbody>{rows.map(row=><tr key={row[0]} className="border-b border-border/70">{row.map((cell,index)=><td key={`${row[0]}-${index}`} className={`py-3 pr-4 ${index===0?"font-semibold":"text-muted-foreground"}`}>{cell}</td>)}</tr>)}</tbody></table></div>
    </figure>
  );
}
