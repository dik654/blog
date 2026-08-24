export function BackpropSceneControls({ labels, active, playing, setActive, setPlaying }: {
  labels: readonly string[];
  active: number;
  playing: boolean;
  setActive: (value: number) => void;
  setPlaying: (value: boolean) => void;
}) {
  return (
    <div className="mt-6 border-t border-border pt-4">
      <div className="flex flex-wrap items-center gap-2">
        {labels.map((label, index) => (
          <button key={label} type="button" aria-pressed={active === index} onClick={() => setActive(index)} className={`border px-3 py-2 text-xs font-bold ${active === index ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
            {String(index + 1).padStart(2, "0")} · {label}
          </button>
        ))}
        <button type="button" onClick={() => setPlaying(!playing)} className="ml-auto border border-border bg-background px-3 py-2 text-xs font-bold">
          {playing ? "일시정지" : "자동 재생"}
        </button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Focus 후 ← → 장면 이동 · Space 재생/일시정지</p>
    </div>
  );
}
