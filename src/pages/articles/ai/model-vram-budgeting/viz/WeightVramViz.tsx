import { useEffect, useMemo, useState } from "react";
import VizFrame from "@/components/viz/VizFrame";

const CONTEXTS = [
  { label: "32K", kv: 2 },
  { label: "128K", kv: 8 },
  { label: "262K", kv: 16 },
] as const;

const PROFILES = [
  {
    id: "bf16",
    label: "BF16 원본",
    weight: 51.75,
    detail: "27.781B × 2 byte",
  },
  {
    id: "fp8",
    label: "공식 혼합 FP8",
    weight: 28.75,
    detail: "24.699B FP8 + 3.084B BF16",
  },
] as const;

const CAPACITY = 48;
const DELTA_STATE = 0.14;

function segmentWidth(value: number) {
  return `${Math.min(100, (value / CAPACITY) * 100)}%`;
}

export default function WeightVramViz() {
  const [profileIndex, setProfileIndex] = useState(1);
  const [contextIndex, setContextIndex] = useState(0);
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
      () => setContextIndex((value) => (value + 1) % CONTEXTS.length),
      2600,
    );
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion]);

  const profile = PROFILES[profileIndex];
  const context = CONTEXTS[contextIndex];
  const knownFloor = profile.weight + context.kv + DELTA_STATE;
  const remaining = Math.max(0, CAPACITY - knownFloor);
  const overflow = Math.max(0, knownFloor - CAPACITY);

  return (
    <VizFrame
      eyebrow="48 GiB admission"
      title="가중치가 들어간 뒤 남은 칸에 KV와 request state가 들어간다"
      description="가중치 dtype과 context를 바꿔 48 GiB 한 장의 known memory floor를 비교합니다. 빈칸은 공짜가 아니라 workspace·CUDA graph·allocator headroom이 경쟁하는 최대 공간입니다."
      note="BF16 KV·batch 1·request 1의 logical 계산입니다. 공식 FP8 weight라고 KV cache까지 자동으로 FP8이 되는 것은 아닙니다."
    >
      <div
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            setPlaying(false);
            setContextIndex((value) => (value + 1) % CONTEXTS.length);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            setPlaying(false);
            setContextIndex(
              (value) => (value - 1 + CONTEXTS.length) % CONTEXTS.length,
            );
          } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault();
            setProfileIndex((value) => (value + 1) % PROFILES.length);
          } else if (event.key === " ") {
            event.preventDefault();
            setPlaying((value) => !value);
          }
        }}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="flex flex-wrap gap-2">
          {PROFILES.map((candidate, index) => (
            <button
              type="button"
              key={candidate.id}
              aria-pressed={profileIndex === index}
              onClick={() => setProfileIndex(index)}
              className={`rounded-md border px-3 py-2 text-xs font-bold ${
                profileIndex === index
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground"
              }`}
            >
              {candidate.label}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {CONTEXTS.map((candidate, index) => (
            <button
              type="button"
              key={candidate.label}
              aria-pressed={contextIndex === index}
              onClick={() => {
                setPlaying(false);
                setContextIndex(index);
              }}
              className={`rounded-md border px-3 py-2 text-xs font-bold ${
                contextIndex === index
                  ? "border-amber-500 bg-amber-500/10 text-amber-800 dark:text-amber-200"
                  : "border-border bg-background text-muted-foreground"
              }`}
            >
              {candidate.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPlaying((value) => !value)}
            className="ml-auto rounded-md border border-border bg-background px-3 py-2 text-xs font-bold"
          >
            {playing && !reducedMotion ? "일시정지" : "자동 재생"}
          </button>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-background p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-muted-foreground">
                GPU 한 장의 physical capacity
              </p>
              <h4 className="mt-1 text-lg font-black">48 GiB</h4>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">known floor</p>
              <strong className={overflow ? "text-rose-700 dark:text-rose-300" : ""}>
                {knownFloor.toFixed(2)} GiB
              </strong>
            </div>
          </div>

          <div
            className="mt-5 flex h-20 w-full overflow-hidden rounded-md border border-border bg-muted/30"
            aria-label="48 GiB VRAM stacked budget"
          >
            <div
              className="flex items-center justify-center border-r border-violet-500/40 bg-violet-500/15 px-1 text-center text-[10px] font-bold text-violet-900 transition-[width] duration-500 dark:text-violet-100"
              style={{ width: segmentWidth(profile.weight) }}
            >
              weights
            </div>
            {!overflow && (
              <>
                <div
                  className="flex items-center justify-center border-r border-amber-500/40 bg-amber-500/15 px-1 text-center text-[10px] font-bold text-amber-900 transition-[width] duration-500 dark:text-amber-100"
                  style={{ width: segmentWidth(context.kv) }}
                >
                  KV
                </div>
                <div
                  className="min-w-1 border-r border-sky-500/50 bg-sky-500/25 transition-[width] duration-500"
                  style={{ width: segmentWidth(DELTA_STATE) }}
                  title="Delta state 0.14 GiB"
                />
                <div
                  className="flex items-center justify-center bg-background px-1 text-center text-[10px] font-bold text-muted-foreground transition-[width] duration-500"
                  style={{ width: segmentWidth(remaining) }}
                >
                  workspace 후보
                </div>
              </>
            )}
          </div>

          {overflow ? (
            <p className="mt-3 rounded-md border border-rose-500/35 bg-rose-500/10 px-3 py-2 text-sm font-bold text-rose-800 dark:text-rose-200">
              가중치 단계에서 이미 {overflow.toFixed(2)} GiB 초과합니다. KV를 만들기 전이라도 한 장 적재가 불가능합니다.
            </p>
          ) : (
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              남은 {remaining.toFixed(2)} GiB 안에서 CUDA graph, kernel temporary, allocator padding, vision activation과 안전 headroom을 모두 해결해야 합니다.
            </p>
          )}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-violet-500/30 bg-background p-4">
            <p className="text-xs font-bold text-violet-700 dark:text-violet-300">01 · weights</p>
            <strong className="mt-2 block text-lg">{profile.weight.toFixed(2)} GiB</strong>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{profile.detail}</p>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-background p-4">
            <p className="text-xs font-bold text-amber-700 dark:text-amber-300">02 · attention KV</p>
            <strong className="mt-2 block text-lg">{context.kv.toFixed(0)} GiB</strong>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{context.label} · BF16 · 64 KiB/token</p>
          </div>
          <div className="rounded-lg border border-sky-500/30 bg-background p-4">
            <p className="text-xs font-bold text-sky-700 dark:text-sky-300">03 · Delta core</p>
            <strong className="mt-2 block text-lg">144 MiB</strong>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">request당 fixed state · workspace 제외</p>
          </div>
        </div>
      </div>
    </VizFrame>
  );
}
