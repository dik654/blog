export type CellTone = "hit" | "calc" | "stored" | "miss" | "idle";

const TONE: Record<CellTone, string> = {
  hit: "border-[#16a34a] bg-[#dcfce7] text-[#14532d] dark:bg-[#14532d]/50 dark:text-[#bbf7d0]",
  calc: "border-[#d97706] bg-[#fef3c7] text-[#78350f] dark:bg-[#78350f]/40 dark:text-[#fde68a]",
  stored: "border-[#64748b] bg-[#e2e8f0] text-[#1e293b] dark:bg-[#334155] dark:text-[#e2e8f0]",
  miss: "border-[#dc2626] bg-[#fee2e2] text-[#7f1d1d] dark:bg-[#7f1d1d]/40 dark:text-[#fecaca]",
  idle: "border-border text-muted-foreground",
};

/** 입력 위치 한 칸입니다. 색과 함께 글자·테두리 모양으로 상태를 구분합니다. */
export function TokenCell({ value, tone }: { value: number | string; tone: CellTone }) {
  return (
    <span className={`flex h-8 min-w-0 items-center justify-center rounded-[3px] border font-mono text-xs font-bold ${TONE[tone]}`}>
      {value}
    </span>
  );
}

/** 라벨과 여덟 칸 한 줄입니다. */
export function TokenRow({ name, values, tones }: { name: string; values: readonly (number | string)[]; tones: readonly CellTone[] }) {
  return (
    <div className="grid grid-cols-[3.25rem_minmax(0,1fr)] items-center gap-2">
      <span className="font-mono text-xs font-bold">{name}</span>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))` }}>
        {values.map((value, index) => (
          <TokenCell key={index} value={value} tone={tones[index]} />
        ))}
      </div>
    </div>
  );
}
