import { useEffect, useMemo, useState } from "react";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  {
    label: "01 · 원소 수",
    title: "Parameter headline을 tensor 원소 수로 읽기",
    detail: "27B는 저장 폭이 아니라 학습된 scalar 원소가 약 270억 개라는 뜻입니다.",
    input: "27.781B parameters",
    output: "아직 VRAM 값 아님",
    color: "border-slate-400/50 bg-slate-500/10",
  },
  {
    label: "02 · dtype 장부",
    title: "Tensor마다 실제 byte 폭 적용",
    detail: "BF16·FP8·INT4 payload와 scale·zero-point 같은 보조 tensor를 분리해 더합니다.",
    input: "FP8 원소 × 1 B\nBF16 원소 × 2 B",
    output: "weight floor",
    color: "border-violet-500/40 bg-violet-500/10",
  },
  {
    label: "03 · request state",
    title: "길이에 비례하는 것과 request당 고정인 것 분리",
    detail: "Attention KV는 token 수에 따라 자라고 recurrent state는 active request 수에 따라 늘어납니다.",
    input: "KV(T)\n+ recurrent state",
    output: "known floor",
    color: "border-amber-500/40 bg-amber-500/10",
  },
  {
    label: "04 · 실측 판정",
    title: "Workspace와 allocator를 넣은 peak로 승인",
    detail: "CUDA graph·temporary·activation·fragmentation까지 포함한 startup peak를 device capacity와 비교합니다.",
    input: "known floor\n+ measured overhead",
    output: "admit / reject",
    color: "border-emerald-500/40 bg-emerald-500/10",
  },
] as const;

export default function BudgetPipelineViz() {
  const [sceneIndex, setSceneIndex] = useState(0);
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
      () => setSceneIndex((value) => (value + 1) % SCENES.length),
      2800,
    );
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion]);

  const scene = SCENES[sceneIndex];
  const move = (offset: number) => {
    setPlaying(false);
    setSceneIndex((value) => (value + offset + SCENES.length) % SCENES.length);
  };

  return (
    <VizFrame
      eyebrow="VRAM 계산 흐름"
      title="모델 이름에서 OOM 판정까지 네 장면으로 내려갑니다"
      description="각 장면은 앞 장면의 output을 다음 장면의 input으로 넘깁니다. 좌우 화살표로 직접 이동하고 Space로 자동 재생을 멈추거나 다시 시작할 수 있습니다."
      note="Parameter headline 하나로 결론내리지 않습니다. Shape로 계산한 known floor와 runtime이 실제 예약한 peak를 마지막까지 분리합니다."
    >
      <div
        tabIndex={0}
        role="group"
        aria-label="VRAM 계산 장면"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            move(1);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            move(-1);
          } else if (event.key === " ") {
            event.preventDefault();
            setPlaying((value) => !value);
          }
        }}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="grid grid-cols-4 gap-2" aria-label="장면 선택">
          {SCENES.map((candidate, index) => (
            <button
              type="button"
              key={candidate.label}
              aria-pressed={index === sceneIndex}
              onClick={() => {
                setPlaying(false);
                setSceneIndex(index);
              }}
              className={`min-w-0 rounded-md border px-2 py-2 text-left text-[11px] font-bold transition-colors ${
                index === sceneIndex
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground"
              }`}
            >
              <span className="block sm:hidden">{String(index + 1).padStart(2, "0")}</span>
              <span className="hidden sm:block">{candidate.label}</span>
            </button>
          ))}
        </div>

        <div className={`mt-4 rounded-lg border p-5 ${scene.color}`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="max-w-2xl">
              <p className="text-xs font-black text-primary">{scene.label}</p>
              <h4 className="mt-2 text-lg font-black">{scene.title}</h4>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {scene.detail}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPlaying((value) => !value)}
              className="rounded-md border border-border bg-background px-3 py-2 text-xs font-bold"
            >
              {playing && !reducedMotion ? "일시정지" : "자동 재생"}
            </button>
          </div>

          <div className="mt-6 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
            <div className="min-w-0 rounded-lg border border-border bg-background p-4 text-center">
              <p className="text-[11px] font-bold text-muted-foreground">INPUT</p>
              <p className="mt-2 whitespace-pre-line text-sm font-black leading-6">
                {scene.input}
              </p>
            </div>
            <div aria-hidden className="flex justify-center text-xl font-black text-primary">
              <span className="sm:hidden">↓</span>
              <span className="hidden sm:inline">→</span>
            </div>
            <div className="min-w-0 rounded-lg border border-primary/40 bg-background p-4 text-center">
              <p className="text-[11px] font-bold text-primary">OUTPUT</p>
              <p className="mt-2 text-sm font-black leading-6">{scene.output}</p>
            </div>
          </div>
        </div>
      </div>
    </VizFrame>
  );
}
