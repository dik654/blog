import { useEffect, useState } from "react";

type Mode = "classic" | "sequence" | "on-policy" | "self";
type Shape =
  "teacher" | "distribution" | "bridge" | "document" | "loop" | "gauge";
type Scene = { code: string; title: string; detail: string; shape: Shape };

const FLOWS: Record<Mode, { caption: string; scenes: Scene[] }> = {
  classic: {
    caption:
      "Teacher output을 그대로 복사하지 않고 student가 읽을 target interface로 바꿉니다.",
    scenes: [
      {
        code: "T",
        title: "Teacher",
        detail: "Input에서 logits·feature를 관측",
        shape: "teacher",
      },
      {
        code: "SOFT",
        title: "Soft target",
        detail: "Temperature로 class 관계 노출",
        shape: "distribution",
      },
      {
        code: "MAP",
        title: "Feature bridge",
        detail: "Layer·position·dimension을 대응",
        shape: "bridge",
      },
      {
        code: "S",
        title: "Student gate",
        detail: "정답·quality·runtime을 함께 검증",
        shape: "gauge",
      },
    ],
  },
  sequence: {
    caption:
      "공유 vocabulary가 없으면 teacher text를 provenance가 있는 student dataset으로 바꿉니다.",
    scenes: [
      {
        code: "PROMPT",
        title: "Prompt slice",
        detail: "Domain·language·difficulty 목표",
        shape: "document",
      },
      {
        code: "GEN",
        title: "Teacher generation",
        detail: "Version·prompt·sampling 고정",
        shape: "teacher",
      },
      {
        code: "FILTER",
        title: "Receipt",
        detail: "Quality·rights·dedup·reject reason",
        shape: "gauge",
      },
      {
        code: "TOK",
        title: "Student sequence",
        detail: "재토큰화와 response-only loss",
        shape: "document",
      },
    ],
  },
  "on-policy": {
    caption:
      "Student가 실제 방문한 prefix를 teacher가 다시 채점해 inference 상태에서 배웁니다.",
    scenes: [
      {
        code: "ROLL",
        title: "Student rollout",
        detail: "현재 policy가 prefix를 생성",
        shape: "loop",
      },
      {
        code: "VISIT",
        title: "Visited state",
        detail: "실수까지 포함한 실제 prefix",
        shape: "document",
      },
      {
        code: "SCORE",
        title: "Teacher feedback",
        detail: "같은 prefix의 token 분포",
        shape: "distribution",
      },
      {
        code: "UPDATE",
        title: "Policy update",
        detail: "Divergence와 domain gate 검증",
        shape: "gauge",
      },
    ],
  },
  self: {
    caption:
      "직전 세대의 prediction을 다음 세대가 배우되 agreement와 정답 quality를 분리합니다.",
    scenes: [
      {
        code: "G0",
        title: "Frozen teacher",
        detail: "세대와 artifact를 고정",
        shape: "teacher",
      },
      {
        code: "G1",
        title: "Next student",
        detail: "같은 task에서 soft signal 학습",
        shape: "loop",
      },
      {
        code: "AUDIT",
        title: "Inheritance audit",
        detail: "Agreement와 accuracy 변화 분리",
        shape: "distribution",
      },
      {
        code: "STOP",
        title: "Stop gate",
        detail: "Worst slice 악화 전 중단",
        shape: "gauge",
      },
    ],
  },
};

function Glyph({ shape, active }: { shape: Shape; active: boolean }) {
  const tone = active
    ? "border-primary bg-primary/10 text-primary"
    : "border-border bg-background text-muted-foreground";
  if (shape === "teacher")
    return (
      <div className={`relative h-20 w-24 rounded-xl border ${tone}`}>
        <span className="absolute left-5 right-5 top-5 h-8 rounded-full border border-current" />
        <span className="absolute bottom-4 left-7 right-7 h-px bg-current" />
      </div>
    );
  if (shape === "distribution")
    return (
      <div
        className={`flex h-20 w-24 items-end justify-center gap-2 rounded-xl border p-4 ${tone}`}
      >
        <span className="h-5 w-2 bg-current" />
        <span className="h-10 w-2 bg-current" />
        <span className="h-7 w-2 bg-current" />
        <span className="h-3 w-2 bg-current" />
      </div>
    );
  if (shape === "bridge")
    return (
      <div className={`relative h-20 w-24 rounded-xl border ${tone}`}>
        <span className="absolute left-3 top-5 h-10 w-5 border border-current" />
        <span className="absolute right-3 top-4 h-12 w-7 border border-current" />
        <span className="absolute left-8 right-9 top-1/2 h-px bg-current" />
      </div>
    );
  if (shape === "document")
    return (
      <div className={`relative h-20 w-16 rounded-md border ${tone}`}>
        <span className="absolute left-3 right-3 top-5 h-px bg-current" />
        <span className="absolute left-3 right-3 top-9 h-px bg-current" />
        <span className="absolute left-3 right-5 top-12 h-px bg-current" />
      </div>
    );
  if (shape === "loop")
    return (
      <div className={`relative h-20 w-20 rounded-full border ${tone}`}>
        <span className="absolute inset-4 rounded-full border border-current border-l-transparent" />
        <span className="absolute right-3 top-5 h-2 w-2 rotate-45 border-r border-t border-current" />
      </div>
    );
  return (
    <div className={`relative h-20 w-24 rounded-xl border ${tone}`}>
      <span className="absolute bottom-4 left-4 right-4 h-px bg-current" />
      <span className="absolute bottom-4 left-1/2 h-10 w-px origin-bottom rotate-45 bg-current" />
      <span className="absolute bottom-3 left-[calc(50%-3px)] h-2 w-2 rounded-full bg-current" />
    </div>
  );
}

export default function DistillationLearningFlowViz({ mode }: { mode: Mode }) {
  const flow = FLOWS[mode];
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const timer = setInterval(() => setActive((v) => (v + 1) % 4), 2200);
    return () => clearInterval(timer);
  }, [playing]);
  const move = (d: number) => {
    setPlaying(false);
    setActive((v) => (v + d + 4) % 4);
  };
  return (
    <figure
      data-viz="distillation-learning-flow"
      tabIndex={0}
      onKeyDown={(e) => {
        if (["ArrowRight", " ", "Enter"].includes(e.key)) {
          e.preventDefault();
          move(1);
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          move(-1);
        }
      }}
      className="not-prose my-8 overflow-hidden rounded-2xl border border-border bg-card"
    >
      <figcaption className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black tracking-[.15em] text-primary">
            DISTILLATION TRACE · 4 SCENES
          </p>
          <p className="mt-2 text-sm font-semibold leading-6">{flow.caption}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            ← → · Space로 이동하거나 자동 재생합니다.
          </p>
        </div>
        <button
          type="button"
          aria-pressed={playing}
          onClick={() => setPlaying((v) => !v)}
          className="w-fit rounded-full border border-border px-3 py-1.5 text-xs font-bold"
        >
          {playing ? "일시정지" : "흐름 재생"}
        </button>
      </figcaption>
      <div data-viz-canvas className="p-5 sm:p-7">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-center">
          {flow.scenes.map((scene, i) => (
            <div className="contents" key={scene.code}>
              <button
                type="button"
                aria-current={i === active ? "step" : undefined}
                onClick={() => {
                  setPlaying(false);
                  setActive(i);
                }}
                className={`flex min-w-0 items-center gap-4 rounded-xl border p-4 text-left md:flex-col md:border-transparent md:text-center ${i === active ? "border-primary/50 bg-primary/5" : "border-border/70 bg-background/50 md:bg-transparent"}`}
              >
                <Glyph shape={scene.shape} active={i <= active} />
                <span>
                  <span className="block text-[10px] font-black text-primary">
                    0{i + 1} · {scene.code}
                  </span>
                  <span className="mt-1 block text-sm font-bold">
                    {scene.title}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                    {scene.detail}
                  </span>
                </span>
              </button>
              {i < 3 ? (
                <div className="hidden items-center md:flex" aria-hidden="true">
                  <span
                    className={`h-px w-8 ${i < active ? "bg-primary" : "bg-border"}`}
                  />
                  <span className="-ml-1 h-2 w-2 rotate-45 border-r border-t border-current text-muted-foreground" />
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <div className="mt-6 border-t border-border pt-5 text-sm">
          <strong>
            {active + 1}. {flow.scenes[active].title}
          </strong>{" "}
          — {flow.scenes[active].detail}
        </div>
      </div>
    </figure>
  );
}
