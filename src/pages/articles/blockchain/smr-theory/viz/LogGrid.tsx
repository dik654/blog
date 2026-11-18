import type { CSSProperties } from "react";

/** Raft log를 서버 × index 칸으로 그리는 공용 격자입니다. 칸 안의 숫자는 그 entry의 term입니다. */
export interface LogRow {
  name: string;
  terms: readonly (number | null)[];
  /** 칸별 강조: "ok" 일치·새로 기록, "bad" 충돌, "probe" 지금 확인하는 칸 */
  marks?: readonly (("ok" | "bad" | "probe") | null)[];
}

const MARK_CLASS = {
  ok: "border-[#2563eb] text-[#2563eb] font-bold",
  bad: "border-[#dc2626] border-dashed text-[#dc2626] font-bold",
  probe: "border-[#d97706] text-[#d97706] font-bold",
} as const;

export default function LogGrid({ rows, slots, commitIndex }: { rows: readonly LogRow[]; slots: number; commitIndex?: number }) {
  const indices = Array.from({ length: slots }, (_, i) => i + 1);
  return (
    <div className="min-w-0">
      <div className="grid grid-cols-[3.25rem_repeat(var(--slots),minmax(0,1fr))] gap-1.5 text-center text-xs sm:gap-2" style={{ "--slots": slots } as CSSProperties}>
        <span />
        {indices.map((index) => (
          <span key={index} className={`font-mono ${commitIndex !== undefined && index <= commitIndex ? "font-bold text-foreground" : "text-muted-foreground"}`}>
            {index}
          </span>
        ))}
        {rows.map((row) => (
          <div key={row.name} className="contents">
            <span className="self-center text-left text-xs font-semibold">{row.name}</span>
            {indices.map((index, i) => {
              const term = row.terms[i] ?? null;
              const mark = row.marks?.[i] ?? null;
              return (
                <span
                  key={index}
                  className={`flex h-9 items-center justify-center rounded-md border font-mono text-xs sm:text-sm ${
                    term === null ? "border-dashed border-border/50 text-muted-foreground/40" : mark ? MARK_CLASS[mark] : "border-border bg-background"
                  }`}
                >
                  {term === null ? "·" : `t${term}`}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      {commitIndex !== undefined && (
        <div className="mt-2 grid grid-cols-[3.25rem_repeat(var(--slots),minmax(0,1fr))] gap-1.5 sm:gap-2" style={{ "--slots": slots } as CSSProperties}>
          <span />
          {indices.map((index) => (
            <span key={index} className={`h-1 rounded-sm ${index <= commitIndex ? "bg-[#16a34a]" : "bg-transparent"}`} />
          ))}
        </div>
      )}
    </div>
  );
}
