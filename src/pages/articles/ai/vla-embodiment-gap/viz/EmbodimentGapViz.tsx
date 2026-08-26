import { useEffect, useMemo, useState } from "react";
import VizFrame from "@/components/viz/VizFrame";

const STAGES = [
  {
    label: "의미",
    input: "\"컵을 집어\"",
    output: "대상·의도",
    receipt: "instruction / object",
    failure: "그럴듯한 대상 오인",
  },
  {
    label: "공간",
    input: "pixel + depth",
    output: "3D pose",
    receipt: "camera frame / calibration",
    failure: "깊이·좌표계 오차",
  },
  {
    label: "행동",
    input: "pose + state",
    output: "action chunk",
    receipt: "action space / horizon",
    failure: "표현·morphology 불일치",
  },
  {
    label: "제어",
    input: "waypoint",
    output: "motor command",
    receipt: "rate / safety limits",
    failure: "latency·contact 불안정",
  },
  {
    label: "검증",
    input: "new observation",
    output: "continue / recover",
    receipt: "success / recovery trace",
    failure: "open-loop drift",
  },
] as const;

export default function EmbodimentGapViz() {
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
      () => setActive((value) => (value + 1) % STAGES.length),
      3000,
    );
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion]);

  return (
    <VizFrame
      eyebrow="Embodiment boundary map"
      title="Semantic correctness가 다섯 개 실행 계약을 연속 통과해야 행동이 됩니다"
      description="모든 단계는 한 화면에 남겨 전체 경로를 보여 주고, 재생 중에는 현재 실패 경계와 필요한 receipt만 확대합니다."
      note="어느 한 단계가 정확해도 뒤 단계의 좌표·동역학·제어 계약을 대신 보장하지 않습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="의미에서 물리 행동까지 다섯 단계"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            setPlaying(false);
            setActive((value) => (value + 1) % STAGES.length);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            setPlaying(false);
            setActive((value) => (value - 1 + STAGES.length) % STAGES.length);
          } else if (event.key === " ") {
            event.preventDefault();
            setPlaying((value) => !value);
          }
        }}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="grid gap-3 md:grid-cols-5">
          {STAGES.map((stage, index) => (
            <button
              type="button"
              key={stage.label}
              aria-pressed={active === index}
              onClick={() => {
                setPlaying(false);
                setActive(index);
              }}
              className={`relative min-w-0 border p-4 text-left transition-colors ${
                active === index
                  ? "border-primary bg-primary/8"
                  : "border-border/70 bg-background"
              }`}
            >
              <span className="font-mono text-[10px] font-bold text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="mt-2 block text-sm font-black">{stage.label}</span>
              <span className="mt-3 block break-words font-mono text-[11px] leading-5 text-muted-foreground">
                {stage.input}
              </span>
              <span className="mt-2 block text-xs font-semibold">→ {stage.output}</span>
              {index < STAGES.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -bottom-3 left-1/2 z-10 -translate-x-1/2 text-primary md:-right-3 md:bottom-auto md:left-auto md:top-1/2 md:translate-x-0 md:-translate-y-1/2"
                >
                  <span className="md:hidden">↓</span>
                  <span className="hidden md:inline">→</span>
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-px overflow-hidden border border-border/70 bg-border/60 sm:grid-cols-2">
          <div className="min-w-0 bg-background p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-primary">
              필요한 receipt
            </p>
            <p className="mt-2 break-words font-mono text-sm font-semibold">
              {STAGES[active].receipt}
            </p>
          </div>
          <div className="min-w-0 bg-background p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-amber-700 dark:text-amber-400">
              대표 실패
            </p>
            <p className="mt-2 text-sm font-semibold">{STAGES[active].failure}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setPlaying((value) => !value)}
          className="mt-4 border border-border bg-background px-3 py-2 text-xs font-bold"
        >
          {playing && !reducedMotion ? "일시정지" : "자동 재생"}
        </button>
      </div>
    </VizFrame>
  );
}
