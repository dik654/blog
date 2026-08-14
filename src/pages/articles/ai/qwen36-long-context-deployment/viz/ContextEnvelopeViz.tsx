import { useEffect, useMemo, useState } from "react";
import VizFrame from "@/components/viz/VizFrame";

const PROFILES = [
  {
    label: "Native text",
    limit: "262K",
    input: "text tokens",
    position: "native position profile",
    test: "위치별 retrieval",
  },
  {
    label: "Native multimodal",
    limit: "262K",
    input: "text + visual tokens",
    position: "time · height · width",
    test: "token budget + retrieval",
  },
  {
    label: "Extended",
    limit: "1.01M",
    input: "scaled long sequence",
    position: "separate scaling profile",
    test: "quality · latency · peak",
  },
] as const;

export default function ContextEnvelopeViz() {
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
      () => setActive((value) => (value + 1) % PROFILES.length),
      2600,
    );
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion]);

  const move = (next: number) => {
    setPlaying(false);
    setActive((next + PROFILES.length) % PROFILES.length);
  };

  return (
    <VizFrame
      eyebrow="Context support envelope"
      title="같은 max length 숫자라도 입력·위치 표현·검증 범위가 다르다"
      description="세 profile을 비교합니다. ← →로 profile을 넘기고 Space로 자동 재생을 켜거나 끌 수 있습니다."
      note="Extended profile은 native profile의 자동 확대판이 아닙니다. 위치별 품질·latency·memory를 별도 evidence로 남깁니다."
    >
      <div
        tabIndex={0}
        role="group"
        aria-label="Qwen context profile comparison"
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
        <div className="grid gap-3 sm:grid-cols-3">
          {PROFILES.map((profile, index) => (
            <button
              key={profile.label}
              type="button"
              aria-pressed={active === index}
              onClick={() => move(index)}
              className={`border px-4 py-4 text-left ${active === index ? "border-primary bg-primary/10" : "border-border bg-background"}`}
            >
              <span className="text-xs font-bold">{profile.label}</span>
              <strong className="mt-2 block font-mono text-lg">
                {profile.limit}
              </strong>
            </button>
          ))}
        </div>

        <div className="mt-6 grid items-center gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
          <div className="border border-sky-500/40 bg-sky-500/10 p-5 text-center">
            <p className="text-[10px] font-black uppercase tracking-wide text-sky-800 dark:text-sky-200">
              Input
            </p>
            <p className="mt-2 text-sm font-bold">{PROFILES[active].input}</p>
          </div>
          <span
            aria-hidden
            className="mx-auto h-5 w-px bg-border md:h-px md:w-8"
          />
          <div className="border border-violet-500/40 bg-violet-500/10 p-5 text-center">
            <p className="text-[10px] font-black uppercase tracking-wide text-violet-800 dark:text-violet-200">
              Position
            </p>
            <p className="mt-2 text-sm font-bold">
              {PROFILES[active].position}
            </p>
          </div>
          <span
            aria-hidden
            className="mx-auto h-5 w-px bg-border md:h-px md:w-8"
          />
          <div className="border border-emerald-500/40 bg-emerald-500/10 p-5 text-center">
            <p className="text-[10px] font-black uppercase tracking-wide text-emerald-800 dark:text-emerald-200">
              Release evidence
            </p>
            <p className="mt-2 text-sm font-bold">{PROFILES[active].test}</p>
          </div>
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
