import { useEffect, useMemo, useState } from "react";
import VizFrame from "@/components/viz/VizFrame";

const STAGES = [
  {
    id: "prompt",
    label: "Prompt chunks",
    short: "입력 묶음",
    detail: "Text·image·video token을 작은 chunk로 나눠 prefill합니다.",
    state: "아직 확정된 cache 없음",
    tone: "border-slate-500/40 bg-slate-500/10 text-slate-800 dark:text-slate-200",
  },
  {
    id: "prefill",
    label: "Prefill commit",
    short: "두 state 생성",
    detail:
      "Attention은 KV block을 붙이고 DeltaNet은 chunk 끝의 recurrent state를 만듭니다.",
    state: "KV prefix + Delta state",
    tone: "border-sky-500/50 bg-sky-500/10 text-sky-800 dark:text-sky-200",
  },
  {
    id: "decode",
    label: "Decode step",
    short: "한 token 갱신",
    detail:
      "Attention은 긴 KV를 읽어 한 칸 추가하고 DeltaNet은 같은 shape의 state를 한 번 고칩니다.",
    state: "accepted prefix + 1",
    tone: "border-amber-500/50 bg-amber-500/10 text-amber-900 dark:text-amber-100",
  },
  {
    id: "draft",
    label: "MTP draft",
    short: "임시 분기",
    detail:
      "여러 미래 token 후보를 임시 KV·recurrent state에 계산합니다. 아직 정본 prefix는 바꾸지 않습니다.",
    state: "committed + speculative branch",
    tone: "border-violet-500/50 bg-violet-500/10 text-violet-900 dark:text-violet-100",
  },
  {
    id: "decision",
    label: "Accept / rollback",
    short: "원자적 판정",
    detail:
      "Target이 승인한 prefix까지만 두 cache와 convolution history를 함께 commit하고 나머지는 버립니다.",
    state: "같은 token boundary로 정렬",
    tone: "border-emerald-500/50 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100",
  },
] as const;

function StateShape({ active }: { active: number }) {
  const kvColumns = Math.min(11, 3 + active * 2);
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <section className="min-w-0 border border-amber-500/35 bg-background p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-amber-800 dark:text-amber-200">
              Attention KV
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              accepted token마다 한 열
            </p>
          </div>
          <span className="font-mono text-xs font-bold">O(T)</span>
        </div>
        <div className="mt-5 flex h-20 items-end gap-1 border-b border-border pb-1">
          {Array.from({ length: kvColumns }).map((_, index) => (
            <span
              key={index}
              className="w-full border border-amber-500/35 bg-amber-500/10 transition-[height] duration-500"
              style={{ height: `${32 + (index % 4) * 15}%` }}
            />
          ))}
        </div>
      </section>

      <section className="min-w-0 border border-sky-500/35 bg-background p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-sky-800 dark:text-sky-200">
              Delta state
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              request마다 같은 matrix
            </p>
          </div>
          <span className="font-mono text-xs font-bold">O(1) in T</span>
        </div>
        <div
          className="mt-5 grid h-20 grid-cols-8 gap-1"
          aria-label="fixed recurrent matrix"
        >
          {Array.from({ length: 32 }).map((_, index) => (
            <span
              key={index}
              className={`border border-sky-500/25 transition-colors duration-500 ${
                index % 7 === active ? "bg-sky-500/30" : "bg-sky-500/10"
              }`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function HybridRuntimeFlowViz() {
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
      2400,
    );
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion]);

  const move = (next: number) => {
    setPlaying(false);
    setActive((next + STAGES.length) % STAGES.length);
  };

  return (
    <VizFrame
      eyebrow="Animated request lifecycle"
      title="두 종류의 state가 같은 accepted prefix를 따라 움직인다"
      description="전체 흐름은 항상 보이고, 현재 단계만 확대됩니다. 그림에 focus한 뒤 ← →로 이동하고 Space로 자동 재생을 켜거나 끌 수 있습니다."
      note="MTP 후보는 임시 분기입니다. Attention KV만 되돌리거나 Delta state만 앞서가면 다음 token이 서로 다른 과거에서 계산됩니다."
    >
      <div
        tabIndex={0}
        role="group"
        aria-label="Qwen hybrid runtime flow"
        onKeyDown={(event) => {
          const target = event.target as HTMLElement;
          if (
            target.matches("input, textarea, select, [contenteditable='true']")
          )
            return;
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
        <div className="grid gap-3 sm:grid-cols-5 sm:items-center">
          {STAGES.map((stage, index) => {
            const selected = index === active;
            return (
              <button
                type="button"
                key={stage.id}
                aria-pressed={selected}
                onClick={() => move(index)}
                className={`relative min-w-0 border px-3 py-4 text-left transition-colors ${
                  selected
                    ? stage.tone
                    : "border-border bg-background text-muted-foreground"
                }`}
              >
                <span className="font-mono text-[10px] font-black">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-2 block text-xs font-bold leading-5">
                  {stage.label}
                </span>
                {index < STAGES.length - 1 ? (
                  <span
                    aria-hidden
                    className={`absolute -bottom-2 left-1/2 h-3 w-px sm:-right-2 sm:bottom-auto sm:left-auto sm:top-1/2 sm:h-px sm:w-3 ${
                      selected ? "bg-primary" : "bg-border"
                    }`}
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,.72fr)_minmax(0,1.28fr)]">
          <section className={`border p-5 ${STAGES[active].tone}`}>
            <p className="text-xs font-black">{STAGES[active].short}</p>
            <h4 className="mt-2 text-lg font-black">{STAGES[active].label}</h4>
            <p className="mt-4 text-sm leading-7">{STAGES[active].detail}</p>
            <div className="mt-5 border-t border-current/20 pt-4">
              <p className="text-[11px] font-bold uppercase tracking-wide">
                현재 state
              </p>
              <p className="mt-2 font-mono text-xs leading-5">
                {STAGES[active].state}
              </p>
            </div>
          </section>
          <StateShape active={active} />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <p className="text-xs leading-5 text-muted-foreground">
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
