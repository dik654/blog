const STAGES = [
  ["finality", "justification · inactivity"],
  ["accounting", "reward · penalty · slashing"],
  ["membership", "registry · pending queues"],
  ["rotation", "balances · RANDAO · history"],
  ["lookahead", "participation · committee · proposer"],
] as const;

export default function EpochPipelineViz() {
  return (
    <figure className="my-8 rounded-xl border border-border bg-background p-5 sm:p-6">
      <figcaption className="mb-5 text-sm font-bold">같은 pre-state를 단계마다 갱신하므로 순서를 바꿀 수 없습니다</figcaption>
      <ol className="grid gap-4 md:grid-cols-5 md:gap-6">
        {STAGES.map(([title, detail], index) => (
          <li key={title} className="min-w-0 border-t border-border pt-3">
            <p className="font-mono text-[11px] font-semibold text-primary">{String(index + 1).padStart(2, "0")}</p>
            <p className="mt-2 text-sm font-bold">{title}</p>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">{detail}</p>
          </li>
        ))}
      </ol>
    </figure>
  );
}
