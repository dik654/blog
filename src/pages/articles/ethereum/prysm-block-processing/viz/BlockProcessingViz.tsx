const STEPS = [
  ["header", "slot·parent·proposer"],
  ["withdrawals + execution", "payload parent·timestamp·Engine result"],
  ["RANDAO", "domain-separated reveal → mix"],
  ["operations", "bounded ordered lists"],
  ["sync aggregate", "fork가 정의한 aggregate"],
] as const;

export default function BlockProcessingViz() {
  return (
    <figure className="my-8 rounded-xl border border-border bg-background p-5 sm:p-6">
      <figcaption className="mb-5 text-sm font-bold">Fulu 계열 process_block의 의존 순서</figcaption>
      <ol className="grid gap-4 md:grid-cols-5 md:gap-6">
        {STEPS.map(([name, check], index) => (
          <li key={name} className="min-w-0 border-t border-border pt-3">
            <p className="font-mono text-[11px] font-semibold text-primary">{String(index + 1).padStart(2, "0")}</p>
            <p className="mt-2 break-words text-sm font-bold">{name}</p>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">{check}</p>
          </li>
        ))}
      </ol>
      <p className="mt-5 border-l border-primary/60 pl-4 text-xs leading-5 text-muted-foreground">이 순서는 포크에 귀속됩니다. Phase 0의 목록을 현재 fork에 그대로 복사하면 execution requests나 새 queue를 빠뜨릴 수 있습니다.</p>
    </figure>
  );
}
