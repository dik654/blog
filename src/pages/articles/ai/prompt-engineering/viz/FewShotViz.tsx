import VizFrame from "@/components/viz/VizFrame";

const compare = [
  ["Zero-shot", "Instruction", "0 example", "작은 context·빠른 baseline"],
  ["Few-shot", "Instruction + demonstrations", "N examples", "빠른 task adaptation"],
  ["Fine-tuning", "Training dataset + update", "Weight change", "반복 volume·지속 behavior"],
] as const;

export default function FewShotViz() {
  return (
    <VizFrame eyebrow="Adaptation boundary" title="Zero-shot·few-shot·fine-tuning은 같은 사다리의 점수 단계가 아닙니다" description="변경 속도, request당 반복 비용과 behavior 지속 기간이 다릅니다.">
      <div className="grid gap-7 md:grid-cols-3">{compare.map(([name, input, state, fit], index) => <section key={name} className="min-w-0 border-t border-border/80 pt-4"><div className="flex items-baseline justify-between"><h4 className="text-sm font-bold">{name}</h4><span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span></div><p className="mt-3 text-xs font-semibold text-primary">{input}</p><p className="mt-3 text-xs leading-5 text-muted-foreground">상태 · {state}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">적합 · {fit}</p></section>)}</div>
    </VizFrame>
  );
}
