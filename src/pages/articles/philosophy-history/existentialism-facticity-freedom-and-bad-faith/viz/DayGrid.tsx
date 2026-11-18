export type DayTone = "bound" | "free" | "freed" | "focus" | "shared" | "quiet";

export interface DayCell {
  text: string;
  tone: DayTone;
}

const TONE: Record<DayTone, { border: string; fill: string; ink: string; dashed: boolean }> = {
  bound: { border: "#94a3b8", fill: "#e2e8f0", ink: "#334155", dashed: false },
  free: { border: "#2563eb", fill: "#2563eb", ink: "#ffffff", dashed: false },
  freed: { border: "#16a34a", fill: "#dcfce7", ink: "#166534", dashed: true },
  focus: { border: "#d97706", fill: "#fef3c7", ink: "#92400e", dashed: false },
  shared: { border: "#7c3aed", fill: "#ede9fe", ink: "#5b21b6", dashed: false },
  quiet: { border: "#cbd5e1", fill: "transparent", ink: "#94a3b8", dashed: true },
};

/** 칸 하나가 1시간인 하루 24칸입니다. 칸의 순서와 자리는 장면이 바뀌어도 같습니다. */
export default function DayGrid({ cells }: { cells: readonly DayCell[] }) {
  return (
    <ol className="grid grid-cols-8 gap-1 sm:grid-cols-12" aria-label="하루 24시간, 칸 하나가 1시간">
      {cells.map((cell, hour) => {
        const tone = TONE[cell.tone];
        return (
          <li
            key={hour}
            className="flex h-9 min-w-0 items-center justify-center rounded-md text-[11px] font-semibold leading-none transition-colors duration-300 motion-reduce:transition-none sm:text-xs"
            style={{
              borderWidth: 1,
              borderStyle: tone.dashed ? "dashed" : "solid",
              borderColor: tone.border,
              backgroundColor: tone.fill,
              color: tone.ink,
            }}
          >
            {cell.text}
          </li>
        );
      })}
    </ol>
  );
}
