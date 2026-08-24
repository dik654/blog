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
    <div className="mt-6 border-t border-border pt-4">
      <div className="flex flex-wrap items-center gap-2">
        {labels.map((label, index) => (
          <button
            key={label}
            type="button"
            aria-pressed={active === index}
            onClick={() => setActive(index)}
            className={`border px-3 py-2 text-xs font-bold transition-colors ${
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
          className="ml-auto border border-border bg-background px-3 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:text-muted-foreground"
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
