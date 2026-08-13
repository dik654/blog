const rows = [
  ["Full fine-tuning", "Base 전체", "Base 전체", "Task별 full checkpoint", "가장 넓은 update freedom"],
  ["LoRA", "A·B + 선택 module", "Base+adapter 경로", "작은 adapter", "Base forward/activation은 남음"],
  ["QLoRA", "A·B + 선택 module", "Quantized base 복원+adapter", "Adapter+quant config", "Base storage memory 절감"],
] as const;

export default function PeftCompareViz() {
  return (
    <figure data-viz className="rounded-xl border border-border bg-background p-4 sm:p-5">
      <figcaption><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Adaptation boundary</p><p className="mt-1 font-semibold">무엇을 학습하고 저장하며 실행하는지 분리합니다</p></figcaption>
      <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[44rem] border-collapse text-left text-xs"><thead><tr className="border-y border-border text-muted-foreground"><th className="py-2 pr-4">방법</th><th className="py-2 pr-4">Trainable</th><th className="py-2 pr-4">Forward</th><th className="py-2 pr-4">Task artifact</th><th className="py-2">주의할 경계</th></tr></thead><tbody>{rows.map(row=><tr key={row[0]} className="border-b border-border/70">{row.map((cell,index)=><td key={`${row[0]}-${index}`} className={`py-3 pr-4 ${index===0?"font-semibold":"text-muted-foreground"}`}>{cell}</td>)}</tr>)}</tbody></table></div>
    </figure>
  );
}
