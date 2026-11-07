const POSITIONS = [7, 6, 5, 4, 3, 2, 1, 0];

/** 32비트 값의 아래 여덟 자리를 왼쪽 7번부터 오른쪽 0번까지 칸으로 그립니다. lost는 사라진 자리를 표시합니다. */
export default function BitCells({ value, focus = 0, lost = 0 }: { value: number; focus?: number; lost?: number }) {
  return (
    <div className="grid grid-cols-8 gap-1">
      {POSITIONS.map((position) => {
        const on = ((value >> position) & 1) === 1;
        const focused = ((focus >> position) & 1) === 1;
        const gone = ((lost >> position) & 1) === 1;
        return (
          <span
            key={position}
            className={`flex h-7 min-w-0 items-center justify-center rounded border font-mono text-xs font-bold ${
              gone
                ? "border-dashed border-red-600 text-red-700 dark:text-red-400"
                : on
                  ? focused
                    ? "border-amber-600 bg-amber-500 text-black"
                    : "border-slate-500 bg-slate-500 text-white"
                  : focused
                    ? "border-amber-600 text-foreground"
                    : "border-border text-muted-foreground/70"
            }`}
          >
            {on ? 1 : 0}
          </span>
        );
      })}
    </div>
  );
}
