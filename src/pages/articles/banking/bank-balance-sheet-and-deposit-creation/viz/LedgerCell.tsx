/** 장부 한 칸. 값이 바뀌면 전→후와 증감을 글자로 함께 적어 색 없이도 읽힙니다. */
export default function LedgerCell({ name, before, after }: { name: string; before: number; after: number }) {
  const delta = after - before;
  return (
    <div className={`rounded-lg border px-3 py-2 ${delta === 0 ? "border-border/60" : "border-primary bg-primary/5"}`}>
      <p className="text-xs leading-5 text-muted-foreground">{name}</p>
      <p className="flex flex-wrap items-baseline gap-x-2">
        <span className="font-mono text-base font-bold tabular-nums">{delta === 0 ? after : `${before} → ${after}`}</span>
        <span className={`text-xs leading-5 ${delta === 0 ? "text-muted-foreground" : "font-semibold text-primary"}`}>
          {delta === 0 ? "그대로" : `${delta > 0 ? "+" : "−"}${Math.abs(delta)}`}
        </span>
      </p>
    </div>
  );
}
