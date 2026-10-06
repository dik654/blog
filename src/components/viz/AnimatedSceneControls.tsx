export function AnimatedSceneControls({
  labels,
  active,
  playing,
  reducedMotion,
  setActive,
  setPlaying,
}: {
  labels: readonly string[];
  active: number;
  playing: boolean;
  reducedMotion: boolean;
  setActive: (value: number) => void;
  setPlaying: (value: boolean) => void;
}) {
  const previous = () => setActive(Math.max(0, active - 1));
  const next = () => setActive(Math.min(labels.length - 1, active + 1));

  return (
    <div
      data-viz-controls
      className="z-20 mt-auto w-full shrink-0 border-t border-border bg-background/95 pt-4 backdrop-blur-sm sm:sticky sm:bottom-0 sm:min-h-[6.75rem]"
    >
      <div data-viz-mobile-controls className="sm:hidden">
        <p className="min-w-0 break-words text-center text-sm font-bold leading-6 text-foreground">
          {String(active + 1).padStart(2, "0")} · {labels[active]}
        </p>
        <div className="mt-3 grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
          <button
            type="button"
            onClick={previous}
            disabled={active === 0}
            className="min-h-11 min-w-0 rounded-md border border-border bg-background px-2 text-xs font-bold disabled:opacity-35"
          >
            ← 이전
          </button>
          <span className="whitespace-nowrap px-1 text-xs tabular-nums text-muted-foreground">
            {active + 1} / {labels.length}
          </span>
          <button
            type="button"
            onClick={next}
            disabled={active === labels.length - 1}
            className="min-h-11 min-w-0 rounded-md border border-border bg-background px-2 text-xs font-bold disabled:opacity-35"
          >
            다음 →
          </button>
        </div>
        <button
          type="button"
          disabled={reducedMotion}
          onClick={() => setPlaying(!playing)}
          className="mt-2 min-h-11 w-full rounded-md border border-primary/35 bg-primary/[0.045] px-3 text-xs font-bold text-primary disabled:cursor-not-allowed disabled:text-muted-foreground"
        >
          {reducedMotion ? "자동 재생 꺼짐" : playing ? "일시정지" : "자동 재생"}
        </button>
      </div>

      <div data-viz-desktop-controls className="hidden items-center gap-2 overflow-x-auto pb-1 sm:flex">
        {labels.map((label, index) => (
          <button
            key={label}
            type="button"
            aria-pressed={active === index}
            onClick={() => setActive(index)}
            className={`min-h-9 shrink-0 whitespace-nowrap border px-3 py-2 text-xs font-bold transition-colors ${
              active === index
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-background text-muted-foreground"
            }`}
          >
            {String(index + 1).padStart(2, "0")} · {label}
          </button>
        ))}
        <button
          type="button"
          disabled={reducedMotion}
          onClick={() => setPlaying(!playing)}
          className="min-h-9 w-[7.75rem] shrink-0 border border-border bg-background px-3 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:text-muted-foreground sm:ml-auto"
        >
          {reducedMotion ? "자동 재생 꺼짐" : playing ? "일시정지" : "자동 재생"}
        </button>
      </div>
      <p className="mt-3 hidden text-xs text-muted-foreground sm:block">
        Viz에 focus한 뒤 ← →로 이동 · Space로 재생/일시정지
      </p>
    </div>
  );
}
