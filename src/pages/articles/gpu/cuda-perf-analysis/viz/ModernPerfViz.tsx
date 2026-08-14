import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import VizFrame from "@/components/viz/VizFrame";

const LOOP = [
  {
    label: "Locate",
    short: "01",
    detail:
      "전체 timeline에서 copy·launch·kernel·sync 중 critical path를 찾습니다.",
    evidence: "Nsight Systems timeline",
    shape: "rounded-full",
  },
  {
    label: "Bound",
    short: "02",
    detail:
      "Amdahl 비중과 Roofline으로 고칠 가치와 첫 resource 가설을 만듭니다.",
    evidence: "end-to-end share · roof",
    shape: "rotate-45",
  },
  {
    label: "Explain",
    short: "03",
    detail:
      "Traffic·eligible-warps·dependency counter 중 가설을 가르는 최소 항목을 봅니다.",
    evidence: "Nsight Compute counter",
    shape: "rounded-md",
  },
  {
    label: "Change",
    short: "04",
    detail:
      "Layout·tile·fusion boundary 중 변수 하나만 바꿔 인과 관계를 보존합니다.",
    evidence: "single candidate diff",
    shape: "skew-x-[-8deg]",
  },
  {
    label: "Verify",
    short: "05",
    detail:
      "Reference parity와 profiler 없는 end-to-end 반복으로 최종 채택·rollback을 정합니다.",
    evidence: "paired release receipt",
    shape: "rounded-full",
  },
] as const;

export function PerfLoopViz() {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing || reducedMotion) return;
    const timer = window.setInterval(
      () => setActive((value) => (value + 1) % LOOP.length),
      2300,
    );
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion]);

  const move = (next: number) => {
    setPlaying(false);
    setActive((next + LOOP.length) % LOOP.length);
  };

  return (
    <VizFrame
      eyebrow="Animated profile-driven loop"
      title="Counter를 많이 모으는 대신 가설 하나가 좁아지는 장면을 따라간다"
      description="전체 loop는 항상 보입니다. Focus 뒤 ← →로 장면을 넘기고 Space로 자동 재생할 수 있습니다."
      note="Verify 뒤 결과가 가설과 다르면 Locate로 되돌아갑니다. 이 반복 구조가 metric shopping과 비핵심 kernel 최적화를 막습니다."
    >
      <div
        tabIndex={0}
        role="group"
        aria-label="CUDA performance hypothesis loop animation"
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
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="grid gap-2 sm:grid-cols-5">
          {LOOP.map((step, index) => (
            <button
              key={step.label}
              type="button"
              aria-pressed={active === index}
              onClick={() => move(index)}
              className={`relative grid min-h-24 place-items-center border p-3 text-center ${active === index ? "border-primary bg-primary/10" : "border-border bg-background"}`}
            >
              <span
                className={`grid h-11 w-11 place-items-center border border-current text-[10px] font-black ${step.shape}`}
              >
                <span
                  className={step.shape.includes("rotate") ? "-rotate-45" : ""}
                >
                  {step.short}
                </span>
              </span>
              <strong className="mt-2 text-xs">{step.label}</strong>
              {index < LOOP.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute -bottom-2 left-1/2 h-3 w-px bg-border sm:-right-2 sm:bottom-auto sm:left-auto sm:top-1/2 sm:h-px sm:w-3"
                />
              ) : null}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,.8fr)_auto_minmax(0,1.2fr)] lg:items-center">
          <section className="border border-primary/50 bg-primary/5 p-5">
            <p className="font-mono text-xs font-black">
              SCENE {LOOP[active].short}
            </p>
            <h4 className="mt-2 text-xl font-black">{LOOP[active].label}</h4>
            <p className="mt-4 text-sm leading-7">{LOOP[active].detail}</p>
          </section>
          <span
            aria-hidden
            className="mx-auto h-6 w-px bg-border lg:h-px lg:w-8"
          />
          <section className="border border-border bg-background p-5">
            <p className="text-[10px] font-black uppercase tracking-wide text-muted-foreground">
              Evidence leaving this scene
            </p>
            <div className="mt-5 flex items-center gap-4">
              <span
                className={`grid h-14 w-14 shrink-0 place-items-center border border-sky-500 bg-sky-500/10 text-xs font-black ${LOOP[active].shape}`}
              >
                <span
                  className={
                    LOOP[active].shape.includes("rotate") ? "-rotate-45" : ""
                  }
                >
                  E
                </span>
              </span>
              <div className="h-px min-w-5 flex-1 bg-border" />
              <div className="min-w-0 border border-emerald-500/50 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-900 dark:text-emerald-100">
                {LOOP[active].evidence}
              </div>
            </div>
          </section>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">
            ← 이전 · → 다음 · Space 재생/일시정지
          </p>
          <button
            type="button"
            onClick={() => setPlaying((value) => !value)}
            className="border border-border bg-background px-3 py-2 text-xs font-bold"
          >
            {playing && !reducedMotion ? "일시정지" : "자동 재생"}
          </button>
        </div>
      </div>
    </VizFrame>
  );
}

const SEGMENTS = [
  { id: "input", label: "Input", lane: "host" },
  { id: "h2d", label: "H2D", lane: "copy" },
  { id: "launch", label: "Launch", lane: "host" },
  { id: "kernel", label: "Kernel", lane: "gpu" },
  { id: "d2h", label: "D2H", lane: "copy" },
  { id: "output", label: "Output", lane: "host" },
] as const;

const BOUNDARIES = [
  {
    label: "End-to-end",
    selected: [0, 1, 2, 3, 4, 5],
    numerator: "사용자가 기다린 전체 경로",
    denominator: "wall-clock time",
  },
  {
    label: "Kernel-only",
    selected: [3],
    numerator: "같은 stream의 kernel",
    denominator: "CUDA event time",
  },
  {
    label: "Achieved ledger",
    selected: [3],
    numerator: "useful FLOPs 또는 actual bytes",
    denominator: "같은 kernel elapsed",
  },
] as const;

export function MetricBoundaryViz() {
  const [active, setActive] = useState(0);

  return (
    <VizFrame
      eyebrow="Measurement boundary map"
      title="같은 timeline에서 선택한 구간이 달라지면 답하는 질문도 달라진다"
      description="세 측정 경계를 눌러 어느 구간과 분모가 선택되는지 비교합니다. Focus 뒤 ← →로도 이동할 수 있습니다."
      note="Occupancy·stall은 시간 분모가 아니라 느린 이유를 좁히는 counter입니다. End-to-end와 kernel-only 결과를 대신하지 않습니다."
    >
      <div
        tabIndex={0}
        role="group"
        aria-label="CUDA measurement boundary comparison"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            setActive((value) => (value + 1) % BOUNDARIES.length);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            setActive(
              (value) => (value - 1 + BOUNDARIES.length) % BOUNDARIES.length,
            );
          }
        }}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="grid gap-2 sm:grid-cols-3">
          {BOUNDARIES.map((boundary, index) => (
            <button
              key={boundary.label}
              type="button"
              aria-pressed={active === index}
              onClick={() => setActive(index)}
              className={`border px-4 py-4 text-left text-sm font-bold ${active === index ? "border-primary bg-primary/10" : "border-border bg-background"}`}
            >
              <span className="font-mono text-[10px]">0{index + 1}</span>
              <span className="mt-2 block">{boundary.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 border border-border bg-background p-5">
          <div className="grid grid-cols-6 gap-1.5">
            {SEGMENTS.map((segment, index) => {
              const selected = (
                BOUNDARIES[active].selected as readonly number[]
              ).includes(index);
              const tone =
                segment.lane === "gpu"
                  ? "border-violet-500 bg-violet-500/15"
                  : segment.lane === "copy"
                    ? "border-sky-500 bg-sky-500/15"
                    : "border-amber-500 bg-amber-500/15";
              return (
                <div
                  key={segment.id}
                  className={`relative min-w-0 border px-1 py-5 text-center ${selected ? tone : "border-border bg-muted/10 opacity-35"}`}
                >
                  <span className="block whitespace-nowrap text-[8px] font-black tracking-[-0.02em] sm:text-xs sm:tracking-normal">
                    {segment.label}
                  </span>
                  {index < SEGMENTS.length - 1 ? (
                    <span
                      aria-hidden
                      className="absolute -right-2 top-1/2 h-px w-2 bg-border"
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-muted-foreground">
            <span className="border-t border-amber-500 pt-2">HOST</span>
            <span className="border-t border-sky-500 pt-2">TRANSFER</span>
            <span className="border-t border-violet-500 pt-2">GPU</span>
          </div>
        </div>

        <div className="mt-5 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
          <div className="border border-emerald-500/50 bg-emerald-500/10 p-4 text-center text-sm font-bold">
            {BOUNDARIES[active].numerator}
          </div>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-border font-mono text-xl font-black">
            ÷
          </div>
          <div className="border border-primary/50 bg-primary/10 p-4 text-center text-sm font-bold">
            {BOUNDARIES[active].denominator}
          </div>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">← 이전 · → 다음</p>
      </div>
    </VizFrame>
  );
}
