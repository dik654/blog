import { useEffect, useMemo, useState } from "react";
import VizFrame from "@/components/viz/VizFrame";

const STEPS = [
  {
    label: "DeltaNet 1",
    short: "Δ1",
    memory: "recurrent state 갱신",
    detail: "첫 mixer가 현재 token을 고정 크기 state에 반영합니다.",
    kind: "delta",
  },
  {
    label: "DeltaNet 2",
    short: "Δ2",
    memory: "recurrent state 갱신",
    detail: "두 번째 mixer도 과거 K/V 열을 새로 붙이지 않습니다.",
    kind: "delta",
  },
  {
    label: "DeltaNet 3",
    short: "Δ3",
    memory: "recurrent state 갱신",
    detail: "세 번째 압축 memory 뒤에 direct token retrieval layer가 옵니다.",
    kind: "delta",
  },
  {
    label: "Gated Attention",
    short: "ATTN",
    memory: "K/V token 한 칸 추가",
    detail: "이 layer만 과거 token의 K와 V를 sequence 축으로 보존합니다.",
    kind: "attention",
  },
] as const;

export default function HybridScheduleViz() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useEffect(() => {
    if (!playing || reducedMotion) return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % STEPS.length),
      2200,
    );
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion]);

  const move = (next: number) => {
    setPlaying(false);
    setActive((next + STEPS.length) % STEPS.length);
  };

  return (
    <VizFrame
      eyebrow="Animated layer schedule"
      title="3개의 압축 state layer 뒤에 1개의 direct retrieval layer가 온다"
      description="이 네 layer짜리 block을 16번 반복합니다. 그림에 focus한 뒤 ← →로 layer를 넘기고 Space로 재생·일시정지할 수 있습니다."
      note="각 mixer 뒤에는 FFN과 residual update가 이어집니다. 이 그림은 두 memory 방식의 차이를 드러내기 위해 mixer만 전면에 놓았습니다."
    >
      <div
        tabIndex={0}
        role="group"
        aria-label="Qwen3.6 hybrid layer animation"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            move(active + 1);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            move(active - 1);
          } else if (event.key === " ") {
            event.preventDefault();
            setPlaying((value) => !value);
          }
        }}
        className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(15rem,.8fr)] lg:items-stretch">
          <div className="min-w-0 rounded-lg border border-border bg-background p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold text-muted-foreground">Hybrid block × 16</p>
              <span className="font-mono text-xs font-bold text-foreground">48 Δ + 16 ATTN = 64</span>
            </div>
            <div className="mt-5 grid grid-cols-4 items-center gap-1.5 sm:gap-3">
              {STEPS.map((step, index) => {
                const selected = index === active;
                return (
                  <button
                    key={step.label}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => move(index)}
                    className={`relative min-w-0 rounded-md border px-1 py-5 text-center transition-colors sm:px-3 ${
                      selected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-muted/15 text-foreground"
                    }`}
                  >
                    <span className="block font-mono text-xs font-black sm:text-sm">{step.short}</span>
                    <span className="mt-2 hidden text-[10px] leading-4 text-muted-foreground sm:block">FFN</span>
                    {index < STEPS.length - 1 ? (
                      <span
                        aria-hidden
                        className={`absolute -right-2.5 top-1/2 h-px w-3 sm:-right-4 sm:w-5 ${
                          selected ? "bg-primary" : "bg-border"
                        }`}
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-border/70 pt-4">
              <span className="text-xs leading-5 text-muted-foreground">현재: {STEPS[active].label}</span>
              <button
                type="button"
                onClick={() => setPlaying((value) => !value)}
                className="rounded-md border border-border bg-background px-3 py-2 text-xs font-bold"
              >
                {playing && !reducedMotion ? "일시정지" : "자동 재생"}
              </button>
            </div>
          </div>

          <div className="flex min-w-0 flex-col rounded-lg border border-border bg-background p-5">
            <div className="flex items-center gap-3">
              <span
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border text-xs font-black ${
                  STEPS[active].kind === "delta"
                    ? "border-sky-500/60 bg-sky-500/10 text-sky-700 dark:text-sky-300"
                    : "border-amber-500/60 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                }`}
              >
                {STEPS[active].kind === "delta" ? "Sₜ" : "K/V"}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-primary">{STEPS[active].memory}</p>
                <p className="mt-1 text-sm font-bold leading-6">{STEPS[active].label}</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">{STEPS[active].detail}</p>
            <div className="mt-auto pt-5">
              {STEPS[active].kind === "delta" ? (
                <div className="grid grid-cols-6 gap-1" aria-label="fixed recurrent matrix">
                  {Array.from({ length: 24 }).map((_, index) => (
                    <span key={index} className="aspect-square rounded-sm border border-sky-500/25 bg-sky-500/10" />
                  ))}
                </div>
              ) : (
                <div className="flex items-end gap-1" aria-label="growing KV token history">
                  {Array.from({ length: 9 }).map((_, index) => (
                    <span
                      key={index}
                      className="w-full rounded-sm border border-amber-500/30 bg-amber-500/10"
                      style={{ height: `${18 + index * 4}px` }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </VizFrame>
  );
}
