import VizFrame from "@/components/viz/VizFrame";

const rows = [
  ["Fact lookup", "Source retrieval → citation", "긴 CoT보다 evidence 확인"],
  ["Arithmetic", "식 → 단위 → 계산 → answer", "Executable calculation"],
  ["Planning", "State → action → observation", "Environment feedback"],
  ["Tool effect", "Proposal → authorization → receipt", "Runtime enforcement"],
] as const;

export default function CoTViz() {
  return (
    <VizFrame eyebrow="Reasoning strategy" title="Task마다 useful intermediate artifact가 다릅니다" description="자연어 reasoning을 늘리는 대신 외부에서 검증할 수 있는 산출물을 선택합니다.">
      <div className="divide-y divide-border/70">
        {rows.map(([task, path, check]) => <section key={task} className="grid min-w-0 gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[7rem_1fr_1fr] sm:items-baseline"><h4 className="text-sm font-bold">{task}</h4><p className="text-xs leading-5 text-primary">{path}</p><p className="text-xs leading-5 text-muted-foreground">{check}</p></section>)}
      </div>
    </VizFrame>
  );
}
