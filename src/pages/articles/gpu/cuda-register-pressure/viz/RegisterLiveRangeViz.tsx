import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  {
    label: "Separate",
    title: "Kernel마다 live range가 끝난다",
    note: "A가 끝나면 A의 temporaries를 반납하고 B는 자기 register budget으로 시작합니다.",
    bars: [
      ["A input", 1, 4],
      ["A tmp", 2, 3],
      ["A out", 3, 4],
    ],
  },
  {
    label: "Fused",
    title: "중간값을 살리면 live range가 겹친다",
    note: "A output을 C까지 보존하는 동안 B temporaries가 생겨 동시에 필요한 register가 늘어납니다.",
    bars: [
      ["A out", 1, 6],
      ["B tmp", 2, 4],
      ["C tmp", 4, 6],
      ["index", 1, 6],
    ],
  },
  {
    label: "Resource",
    title: "Residency가 먼저 줄고 부족하면 spill한다",
    note: "Spill 0도 안전 판정이 아닙니다. Thread당 register가 늘면 resident warp가 먼저 감소할 수 있습니다.",
    bars: [
      ["register", 1, 6],
      ["resident warps", 1, 3],
      ["local spill", 5, 6],
    ],
  },
] as const;

export default function RegisterLiveRangeViz() {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing || reducedMotion) return;
    const timer = window.setInterval(
      () => setActive((value) => (value + 1) % SCENES.length),
      2300,
    );
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion]);

  const move = (next: number) => {
    setPlaying(false);
    setActive((next + SCENES.length) % SCENES.length);
  };

  return (
    <VizFrame
      eyebrow="Animated live-range map"
      title="Register pressure는 변수 개수가 아니라 동시에 살아 있는 구간에서 생긴다"
      description="전체 세 장면을 먼저 보고, focus한 뒤 ← →로 경계를 이동하거나 Space로 자동 재생할 수 있습니다."
      note="실제 register 배정은 compiler와 target architecture가 결정합니다. 이 그림은 live-range overlap이 왜 fusion 자원 비용이 되는지 보여 주는 형태 지도입니다."
    >
      <div
        tabIndex={0}
        role="group"
        aria-label="GPU register live range animation"
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
          {SCENES.map((scene, index) => (
            <button
              key={scene.label}
              type="button"
              aria-pressed={active === index}
              onClick={() => move(index)}
              className={`border px-4 py-4 text-left ${active === index ? "border-primary bg-primary/10" : "border-border bg-background"}`}
            >
              <span className="font-mono text-[10px] font-black">
                0{index + 1}
              </span>
              <strong className="mt-2 block text-sm">{scene.label}</strong>
            </button>
          ))}
        </div>

        <div className="mt-6 border border-border bg-background p-5">
          <h4 className="text-lg font-black">{SCENES[active].title}</h4>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            {SCENES[active].note}
          </p>
          <div className="mt-6 grid gap-3">
            {SCENES[active].bars.map(([label, start, end]) => (
              <div
                key={label}
                className="grid grid-cols-[5.5rem_1fr] items-center gap-3"
              >
                <span className="text-xs font-bold">{label}</span>
                <div
                  className="grid grid-cols-6 gap-1"
                  aria-label={`${label} live range ${start} to ${end}`}
                >
                  {[1, 2, 3, 4, 5, 6].map((slot) => (
                    <span
                      key={slot}
                      className={`h-8 border ${slot >= start && slot <= end ? "border-sky-400 bg-sky-400/20" : "border-border bg-muted/15"}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-6 gap-1 pl-[6.25rem] font-mono text-[9px] text-muted-foreground">
            {[1, 2, 3, 4, 5, 6].map((slot) => (
              <span key={slot} className="text-center">
                t{slot}
              </span>
            ))}
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
