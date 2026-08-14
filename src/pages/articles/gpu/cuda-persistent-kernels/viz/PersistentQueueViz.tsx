import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import VizFrame from "@/components/viz/VizFrame";

const STAGES = [
  {
    label: "Publish",
    short: "01",
    detail:
      "Host가 bounded queue에 task descriptor와 input ownership을 게시합니다.",
  },
  {
    label: "Dequeue",
    short: "02",
    detail:
      "Resident worker가 ticket을 원자적으로 가져가 중복 실행을 막습니다.",
  },
  {
    label: "Execute",
    short: "03",
    detail: "Worker는 고정 resource envelope 안에서 task를 처리합니다.",
  },
  {
    label: "Complete",
    short: "04",
    detail:
      "결과와 completion sequence를 publish해 host·consumer가 관찰합니다.",
  },
  {
    label: "Drain",
    short: "05",
    detail:
      "종료 시 새 입력을 닫고 queue와 in-flight task를 drain한 뒤 모든 workers가 빠져나옵니다.",
  },
] as const;

export default function PersistentQueueViz() {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing || reducedMotion) return;
    const timer = window.setInterval(
      () => setActive((value) => (value + 1) % STAGES.length),
      2200,
    );
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion]);

  const move = (next: number) => {
    setPlaying(false);
    setActive((next + STAGES.length) % STAGES.length);
  };

  return (
    <VizFrame
      eyebrow="Animated persistent-worker lifecycle"
      title="Kernel은 살아 있고 task의 소유권만 queue를 따라 이동한다"
      description="전체 publish→drain 흐름은 항상 보입니다. Focus 뒤 ← →로 장면을 넘기고 Space로 자동 재생할 수 있습니다."
      note="일반 kernel launch가 grid lifetime으로 work를 구획한다면 persistent model은 queue ticket·completion sequence·shutdown state로 work boundary를 다시 만듭니다."
    >
      <div
        tabIndex={0}
        role="group"
        aria-label="GPU persistent kernel queue animation"
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
          {STAGES.map((stage, index) => (
            <button
              key={stage.label}
              type="button"
              aria-pressed={active === index}
              onClick={() => move(index)}
              className={`relative border px-3 py-4 text-left ${active === index ? "border-primary bg-primary/10" : "border-border bg-background"}`}
            >
              <span className="font-mono text-[10px] font-black">
                {stage.short}
              </span>
              <strong className="mt-2 block text-xs">{stage.label}</strong>
              {index < STAGES.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute -bottom-2 left-1/2 h-3 w-px bg-border sm:-right-2 sm:bottom-auto sm:left-auto sm:top-1/2 sm:h-px sm:w-3"
                />
              ) : null}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
          <section className="border border-primary/50 bg-primary/5 p-5">
            <p className="font-mono text-xs font-black">
              SCENE {STAGES[active].short}
            </p>
            <h4 className="mt-2 text-lg font-black">{STAGES[active].label}</h4>
            <p className="mt-4 text-sm leading-7">{STAGES[active].detail}</p>
          </section>

          <section className="border border-border bg-background p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold">Bounded queue</span>
              <span className="font-mono text-[10px] text-muted-foreground">
                head → tail
              </span>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map((slot) => (
                <span
                  key={slot}
                  className={`grid h-12 place-items-center border text-[10px] font-black ${slot <= Math.max(0, 3 - active) ? "border-amber-400 bg-amber-400/15" : "border-border bg-muted/15"}`}
                >
                  {slot <= Math.max(0, 3 - active) ? `T${slot + 1}` : "·"}
                </span>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {["W0", "W1", "W2"].map((worker, index) => (
                <div
                  key={worker}
                  className={`border p-4 text-center ${active >= 1 && active <= 3 && index === (active - 1) % 3 ? "border-sky-400 bg-sky-400/15" : "border-border"}`}
                >
                  <span className="grid h-10 place-items-center rounded-full border border-current font-mono text-xs font-black">
                    {worker}
                  </span>
                  <p className="mt-3 text-[10px] font-bold">resident block</p>
                </div>
              ))}
            </div>
            <div
              className={`mt-5 border p-3 text-center text-xs font-bold ${active === 4 ? "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200" : "border-border text-muted-foreground"}`}
            >
              {active === 4
                ? "input closed → in-flight 0 → all workers exit"
                : "completion sequence advances"}
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
