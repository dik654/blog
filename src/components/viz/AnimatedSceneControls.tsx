export function AnimatedSceneControls({
  labels,
  active,
  playing,
  reducedMotion,
  setActive,
  setPlaying,
  playLabel = "재생",
}: {
  labels: readonly string[];
  active: number;
  playing: boolean;
  reducedMotion: boolean;
  setActive: (value: number) => void;
  setPlaying: (value: boolean) => void;
  playLabel?: string;
}) {
  const previous = () => setActive(Math.max(0, active - 1));
  const next = () => setActive(Math.min(labels.length - 1, active + 1));

  return (
    <div
      data-viz-controls
      data-viz-live-only
      className="z-20 mt-auto w-full shrink-0 sm:min-h-[6.75rem] sm:border-t sm:border-border sm:pt-4"
    >
      <div
        data-viz-mobile-controls
        className="relative mt-2 flex min-h-11 items-center justify-end gap-0.5 border-t border-border/45 bg-background/95 pt-1 backdrop-blur-sm sm:hidden"
      >
        <span className="sr-only" style={{ left: 0, top: 0 }} aria-live="polite">
          {labels.length}개 장면 중 {active + 1}번, {labels[active]}
        </span>
        <button
          type="button"
          onClick={previous}
          disabled={active === 0}
          aria-label="이전 장면"
          title="이전 장면"
          className="group flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground/55 transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:bg-muted/60 focus-visible:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-20"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          disabled={reducedMotion}
          onClick={() => setPlaying(!playing)}
          aria-label={reducedMotion ? `${playLabel} 꺼짐` : playing ? "일시정지" : playLabel}
          title={reducedMotion ? `${playLabel} 꺼짐` : playing ? "일시정지" : playLabel}
          className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground/55 transition-colors hover:bg-muted/60 hover:text-primary focus-visible:bg-muted/60 focus-visible:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-20"
        >
          {playing ? (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="m8 5 11 7-11 7z" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={next}
          disabled={active === labels.length - 1}
          aria-label="다음 장면"
          title="다음 장면"
          className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground/55 transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:bg-muted/60 focus-visible:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-20"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      <div data-viz-desktop-controls className="hidden flex-wrap items-stretch gap-2 pb-1 sm:flex">
        {labels.map((label, index) => (
          <button
            key={label}
            type="button"
            aria-pressed={active === index}
            onClick={() => setActive(index)}
            className={`min-h-11 min-w-[6.5rem] flex-1 break-keep border px-3 py-2 text-xs font-bold leading-5 transition-colors ${
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
          className="min-h-11 w-[7.75rem] shrink-0 border border-border bg-background px-3 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:text-muted-foreground sm:ml-auto"
        >
          {reducedMotion ? `${playLabel} 꺼짐` : playing ? "일시정지" : playLabel}
        </button>
      </div>
      <p className="mt-3 hidden text-xs text-muted-foreground sm:block">
        그림에 초점을 둔 뒤 ← →로 이동 · Space로 재생/일시정지
      </p>
    </div>
  );
}
