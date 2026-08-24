import type { KeyboardEvent, ReactNode } from "react";

export function LessonHeader({
  number,
  eyebrow,
  title,
  children,
}: {
  number: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <header className="space-y-3">
      <p className="text-xs font-black tracking-[0.18em] text-primary">
        {number} · {eyebrow}
      </p>
      <h2 className="text-2xl font-black leading-tight sm:text-3xl">{title}</h2>
      <div className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
        {children}
      </div>
    </header>
  );
}

export function TermLesson({
  name,
  oneLine,
  shape,
  example,
  boundary,
}: {
  name: string;
  oneLine: ReactNode;
  shape: ReactNode;
  example: ReactNode;
  boundary: ReactNode;
}) {
  return (
    <section className="not-prose min-w-0 border border-border bg-background p-5 sm:p-7">
      <p className="text-xs font-black tracking-[0.14em] text-primary">
        용어 하나
      </p>
      <h3 className="mt-2 break-words text-xl font-black leading-8">{name}</h3>
      <div className="mt-3 max-w-3xl text-sm leading-7 text-foreground">
        {oneLine}
      </div>
      <dl className="mt-6 grid min-w-0 gap-5 md:grid-cols-3">
        {[
          ["형태", shape],
          ["작은 예", example],
          ["여기서 멈출 경계", boundary],
        ].map(([label, value]) => (
          <div
            key={label as string}
            className="min-w-0 border-t border-border pt-3"
          >
            <dt className="text-xs font-black text-primary">{label}</dt>
            <dd className="mt-2 break-words text-sm leading-7 text-muted-foreground">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function EvidenceGrid({
  problem,
  contribution,
  assumptions,
  scope,
  notClaim,
}: {
  problem: string;
  contribution: string;
  assumptions: string;
  scope: string;
  notClaim: string;
}) {
  return (
    <dl className="grid gap-3 text-sm leading-6">
      {[
        ["문제", problem],
        ["기여", contribution],
        ["전제", assumptions],
        ["근거 범위", scope],
        ["일반화 금지", notClaim],
      ].map(([label, value]) => (
        <div
          key={label}
          className="grid gap-1 sm:grid-cols-[7rem_minmax(0,1fr)]"
        >
          <dt className="font-black text-foreground">{label}</dt>
          <dd className="min-w-0 break-words text-muted-foreground">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function StoryShell({
  title,
  subtitle,
  labels,
  step,
  playing,
  setStep,
  setPlaying,
  onKeyDown,
  children,
}: {
  title: string;
  subtitle: string;
  labels: readonly string[];
  step: number;
  playing: boolean;
  setStep: (step: number) => void;
  setPlaying: (playing: boolean) => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  children: ReactNode;
}) {
  return (
    <figure
      data-viz="animated-story"
      data-viz-canvas="story-canvas"
      data-story-index={step}
      data-story-playing={playing ? "true" : "false"}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="not-prose min-w-0 overflow-hidden border border-border bg-background outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label={`${title} 애니메이션. 좌우 화살표로 장면 이동, 스페이스로 재생.`}
    >
      <figcaption className="border-b border-border p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-black">{title}</h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              {subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPlaying(!playing)}
            className="border border-border px-3 py-2 text-xs font-black hover:border-primary"
          >
            {playing ? "일시정지" : "자동 재생"}
          </button>
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-4">
          {labels.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(index)}
              className={`min-w-0 border px-3 py-2 text-left text-xs leading-5 transition-colors ${
                step === index
                  ? "border-primary bg-primary/10 font-black text-foreground"
                  : "border-border text-muted-foreground hover:border-primary/60"
              }`}
            >
              {String(index + 1).padStart(2, "0")} · {label}
            </button>
          ))}
        </div>
      </figcaption>
      <div className="min-w-0 p-4 sm:p-6">{children}</div>
      <p className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
        키보드: ← 이전 · → 다음 · Space 자동 재생/정지
      </p>
    </figure>
  );
}

export function NodeBox({
  active,
  title,
  detail,
  tone = "default",
}: {
  active: boolean;
  title: string;
  detail: string;
  tone?: "default" | "sequence" | "depth" | "width";
}) {
  const toneClass = {
    default: "border-border bg-muted/10",
    sequence: "border-cyan-500/50 bg-cyan-500/10",
    depth: "border-violet-500/50 bg-violet-500/10",
    width: "border-amber-500/50 bg-amber-500/10",
  }[tone];
  return (
    <div
      className={`min-w-0 border p-4 transition-all duration-500 ${toneClass} ${
        active ? "translate-y-0 opacity-100" : "translate-y-1 opacity-35"
      }`}
    >
      <p className="break-words text-sm font-black">{title}</p>
      <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">
        {detail}
      </p>
    </div>
  );
}
