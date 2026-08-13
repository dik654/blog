import VizFrame from "@/components/viz/VizFrame";

const examples = [
  ["positive", "(창가에서, 따뜻한)", "label 1", "dot product를 키움"],
  ["negative 1", "(창가에서, 위성)", "label 0", "dot product를 줄임"],
  ["negative 2", "(창가에서, 세금)", "label 0", "dot product를 줄임"],
];

export default function SGNSUpdateViz() {
  return (
    <VizFrame eyebrow="Sparse parameter update" title="한 SGNS step은 center vector와 선택된 context vector만 갱신합니다" description="Negative distribution에서 뽑지 않은 vocabulary row는 이번 pair의 forward·backward에 참여하지 않습니다.">
      <div className="grid gap-4 lg:grid-cols-3">
        {examples.map(([type,pair,label,move])=><article key={type} className="rounded-lg border border-border/70 bg-background p-4"><p className="text-[11px] font-bold text-primary">{type}</p><p className="mt-3 break-words font-mono text-xs leading-5 text-foreground">{pair}</p><p className="mt-3 text-xs text-muted-foreground">{label}</p><p className="mt-3 border-t border-border/60 pt-3 text-xs text-foreground/75">{move}</p></article>)}
      </div>
    </VizFrame>
  );
}
