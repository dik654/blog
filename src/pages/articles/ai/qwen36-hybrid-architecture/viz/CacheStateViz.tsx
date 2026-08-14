import { useEffect, useMemo, useState } from "react";
import VizFrame from "@/components/viz/VizFrame";

const CONTEXTS = [
  { label: "4K", tokens: "4,096", kv: "0.25 GiB", cells: 2 },
  { label: "32K", tokens: "32,768", kv: "2 GiB", cells: 5 },
  { label: "128K", tokens: "131,072", kv: "8 GiB", cells: 8 },
  { label: "262K", tokens: "262,144", kv: "16 GiB", cells: 12 },
] as const;

export default function CacheStateViz() {
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
      () => setActive((value) => (value + 1) % CONTEXTS.length),
      2400,
    );
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion]);

  return (
    <VizFrame
      eyebrow="Memory growth"
      title="Context가 64배 길어져도 DeltaNet matrix는 같은 크기다"
      description="BF16·batch 1·unsharded logical KV 기준입니다. 16 attention layer의 KV만 token 수에 비례하고, 48 DeltaNet layer의 core state는 144 MiB로 고정됩니다."
      note="실제 GPU 할당에는 convolution state, block padding, prefix cache, tensor parallel, CUDA graph와 workspace가 더해집니다."
    >
      <div
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            setPlaying(false);
            setActive((value) => (value + 1) % CONTEXTS.length);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            setPlaying(false);
            setActive((value) => (value - 1 + CONTEXTS.length) % CONTEXTS.length);
          } else if (event.key === " ") {
            event.preventDefault();
            setPlaying((value) => !value);
          }
        }}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="flex flex-wrap gap-2">
          {CONTEXTS.map((context, index) => (
            <button
              type="button"
              key={context.label}
              aria-pressed={active === index}
              onClick={() => {
                setPlaying(false);
                setActive(index);
              }}
              className={`rounded-md border px-3 py-2 text-xs font-bold ${
                active === index
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground"
              }`}
            >
              {context.label}
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

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <section className="rounded-lg border border-amber-500/35 bg-background p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-amber-700 dark:text-amber-300">16 attention layers</p>
                <h4 className="mt-1 text-sm font-bold">Token history를 K/V 열로 보존</h4>
              </div>
              <strong className="font-mono text-sm">{CONTEXTS[active].kv}</strong>
            </div>
            <div className="mt-6 flex h-28 items-end gap-1.5 border-b border-border pb-2">
              {Array.from({ length: CONTEXTS[active].cells }).map((_, index) => (
                <span
                  key={index}
                  className="w-full rounded-sm border border-amber-500/35 bg-amber-500/12 transition-[height] duration-500"
                  style={{ height: `${35 + (index % 4) * 14}%` }}
                />
              ))}
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">T = {CONTEXTS[active].tokens} tokens · 매 token 64 KiB 추가</p>
          </section>

          <section className="rounded-lg border border-sky-500/35 bg-background p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-sky-700 dark:text-sky-300">48 DeltaNet layers</p>
                <h4 className="mt-1 text-sm font-bold">과거를 fixed matrix state에 압축</h4>
              </div>
              <strong className="font-mono text-sm">144 MiB</strong>
            </div>
            <div className="mt-6 grid h-28 grid-cols-8 gap-1.5" aria-label="fixed recurrent state matrix">
              {Array.from({ length: 40 }).map((_, index) => (
                <span key={index} className="rounded-sm border border-sky-500/25 bg-sky-500/10" />
              ))}
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">48 × 48 heads × 128 × 128 × FP32 · T와 무관</p>
          </section>
        </div>
      </div>
    </VizFrame>
  );
}
