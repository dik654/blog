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
  return (
    <div
      data-viz-controls
      className="sticky bottom-0 z-20 mt-auto min-h-[6.75rem] shrink-0 border-t border-border bg-background/95 pt-4 backdrop-blur-sm"
    >
      <div className="flex flex-wrap items-center gap-2">
        {labels.map((label, index) => (
          <button
            key={label}
            type="button"
            aria-pressed={active === index}
            onClick={() => setActive(index)}
            className={`min-h-9 border px-3 py-2 text-xs font-bold transition-colors ${
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
          className="ml-auto min-h-9 w-[7.75rem] shrink-0 border border-border bg-background px-3 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:text-muted-foreground"
        >
          {reducedMotion ? "자동 재생 꺼짐" : playing ? "일시정지" : "자동 재생"}
        </button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Viz에 focus한 뒤 ← →로 이동 · Space로 재생/일시정지
      </p>
    </div>
  );
}
