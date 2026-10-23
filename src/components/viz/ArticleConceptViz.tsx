import { useEffect, useRef } from "react";
import type { ConceptFlow } from "@/content/article-guidance";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";

function BreakableStageLabel({ label }: { label: string }) {
  return label
    .split(
      /([·/→:_]|(?<=[a-z0-9])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z]))/,
    )
    .map((part, index) => {
      if (part === "") return <wbr key={`camel-boundary-${index}`} />;
      return (
        <span key={`${part}-${index}`}>
          {part}
          {/[·/→:_]/.test(part) ? <wbr /> : null}
        </span>
      );
    });
}

function FlowConnector() {
  return (
    <div
      className="relative flex h-auto w-6 shrink-0 items-center justify-center sm:w-5"
      aria-hidden="true"
    >
      <span className="h-px w-full bg-border" />
      <span className="absolute right-0 text-sm text-primary">→</span>
    </div>
  );
}

export default function ArticleConceptViz({ flow }: { flow: ConceptFlow }) {
  const {
    active,
    reducedMotion,
    setActive,
    onKeyDown,
  } = useAnimatedScenes(flow.nodes.length, 3600, {
    loop: false,
    autoPlay: false,
    keyboardPlayback: false,
  });
  const stripRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || strip.scrollWidth <= strip.clientWidth) return;
    const selected = strip.querySelector<HTMLElement>('[aria-current="step"]');
    if (!selected) return;
    const left =
      selected.offsetLeft - (strip.clientWidth - selected.offsetWidth) / 2;
    strip.scrollTo({
      left: Math.max(0, left),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [active, reducedMotion]);

  return (
    <figure
      data-viz="article-entry-flow"
      data-viz-keyboard
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="not-prose min-w-0 overflow-hidden border border-border/70 bg-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/70"
      aria-label="이 글의 전체 흐름"
      aria-keyshortcuts="ArrowLeft ArrowRight"
    >
      <figcaption className="flex flex-col gap-3 border-b border-border/60 bg-muted/20 p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5">
        <div className="min-w-0">
          <p className="text-xs font-bold text-primary">글의 전체 흐름</p>
          <p className="mt-1 text-sm font-bold leading-6 text-foreground sm:text-base">
            {flow.question}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setActive(active - 1)}
            aria-label="이전 단계"
            className="size-11 border border-border bg-background text-sm font-bold text-foreground disabled:opacity-35"
            disabled={active === 0}
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => setActive(active + 1)}
            aria-label="다음 단계"
            className="size-11 border border-border bg-background text-sm font-bold text-foreground disabled:opacity-35"
            disabled={active === flow.nodes.length - 1}
          >
            →
          </button>
        </div>
      </figcaption>

      <div data-viz-canvas className="p-4 sm:p-5">
        <ol
          ref={stripRef}
          className="flex min-w-0 snap-x snap-mandatory items-stretch overflow-x-auto sm:snap-none sm:overflow-visible"
        >
          {flow.nodes.map((node, index) => {
            const isActive = active === index;
            const isPast = index < active;
            return (
              <li key={`${node.label}-${index}`} className="contents">
                <button
                  type="button"
                  aria-current={isActive ? "step" : undefined}
                  onClick={() => setActive(index)}
                  className={`group min-h-[6.75rem] w-[12.5rem] min-w-0 shrink-0 snap-start border p-2.5 text-left transition-colors sm:min-h-[7.5rem] sm:w-auto sm:flex-1 sm:shrink sm:p-2 ${
                    isActive
                      ? "border-primary bg-primary/[0.055]"
                      : isPast
                        ? "border-border bg-muted/25"
                        : "border-border/70 bg-background hover:border-primary/35"
                  }`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span
                      className={`font-mono text-[11px] font-black ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground">
                      {isActive
                        ? "지금 보는 단계"
                        : isPast
                          ? "이전 단계"
                          : "다음 단계"}
                    </span>
                  </span>
                  <strong className="mt-3 block hyphens-none whitespace-normal text-sm leading-5 text-foreground [overflow-wrap:normal] [word-break:keep-all] sm:text-[13px]">
                    <BreakableStageLabel label={node.label} />
                  </strong>
                </button>
                {index < flow.nodes.length - 1 ? (
                  <FlowConnector />
                ) : null}
              </li>
            );
          })}
        </ol>
        <div className="mt-3 min-h-44 border-l-2 border-primary/55 bg-muted/20 px-3 py-2.5 sm:min-h-32 sm:px-4 sm:py-3">
          <p className="font-mono text-[10px] font-black text-primary">
            {String(active + 1).padStart(2, "0")} · 지금 보는 단계
          </p>
          <p className="mt-1 text-sm font-bold leading-5 text-foreground">
            {flow.nodes[active].label}
          </p>
          <p className="mt-1 text-xs leading-5 text-foreground/75">
            {flow.nodes[active].detail}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-border/60 bg-muted/10 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:px-5">
        <p className="text-xs leading-5 text-muted-foreground">
          <strong className="text-foreground/80">읽고 나면:</strong>{" "}
          {flow.takeaway}
        </p>
        <p className="shrink-0 font-mono text-[11px] font-bold tabular-nums text-primary">
          {active + 1} / {flow.nodes.length}
        </p>
      </div>
    </figure>
  );
}
