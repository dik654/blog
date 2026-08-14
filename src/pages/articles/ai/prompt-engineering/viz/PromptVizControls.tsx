import { useEffect, useState, type KeyboardEvent } from "react";

export function useScenes(length: number) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(
      () => setActive((value) => (value + 1) % length),
      2200,
    );
    return () => window.clearInterval(timer);
  }, [length, playing]);

  return {
    active,
    playing,
    setActive,
    setPlaying,
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActive((value) => (value + 1) % length);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActive((value) => (value - 1 + length) % length);
      } else if (event.key === " ") {
        event.preventDefault();
        setPlaying((value) => !value);
      }
    },
  };
}

export function Controls({
  active,
  labels,
  playing,
  setActive,
  setPlaying,
}: {
  active: number;
  labels: readonly string[];
  playing: boolean;
  setActive: (index: number) => void;
  setPlaying: (value: boolean) => void;
}) {
  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
      <div className="flex flex-wrap gap-2">
        {labels.map((label, index) => (
          <button
            key={label}
            type="button"
            aria-pressed={active === index}
            onClick={() => setActive(index)}
            className={`border px-3 py-2 text-xs font-bold ${active === index ? "border-primary bg-primary/10" : "border-border bg-background"}`}
          >
            {String(index + 1).padStart(2, "0")} · {label}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setPlaying(!playing)}
        className="border border-border bg-background px-3 py-2 text-xs font-bold"
      >
        {playing ? "일시정지" : "자동 재생"}
      </button>
      <p className="w-full text-xs text-muted-foreground">
        Focus 후 ← → 장면 이동 · Space 재생/일시정지
      </p>
    </div>
  );
}
