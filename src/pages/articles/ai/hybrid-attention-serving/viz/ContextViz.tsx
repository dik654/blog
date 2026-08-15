import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import VizFrame from "@/components/viz/VizFrame";

const CUTS = [
  {
    label: "현재 token",
    title: "t₄에서 Query·Key·Value를 만듭니다",
    note: "Q₄는 지금 조회할 질문이고, K₄·V₄는 다음 step도 다시 쓸 현재 token의 기록입니다.",
  },
  {
    label: "과거 cache",
    title: "이전 step의 K₁…K₃·V₁…V₃는 이미 남아 있습니다",
    note: "원문을 다시 projection하지 않고 layer별 cache에서 과거 주소와 내용을 읽습니다.",
  },
  {
    label: "조회",
    title: "Q₄는 과거 Key와 비교하고 대응하는 Value를 섞습니다",
    note: "현재 질문은 이번 step에서 소비되므로 다음 step의 cache 항목이 되지 않습니다.",
  },
  {
    label: "Append",
    title: "K₄·V₄만 cache 끝에 붙이고 t₅로 넘어갑니다",
    note: "그래서 attention KV memory는 token이 늘 때마다 layer별 K/V 한 칸씩 증가합니다.",
  },
] as const;

function Arrow({ active = false }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 74 18" aria-hidden className="h-5 w-14 shrink-0 sm:w-16">
      <motion.path
        d="M2 9h62"
        fill="none"
        className="stroke-muted-foreground/60"
        strokeWidth="1.25"
        strokeDasharray="5 4"
        animate={active ? { strokeDashoffset: [9, 0] } : undefined}
        transition={active ? { duration: 0.8, repeat: Infinity, ease: "linear" } : undefined}
      />
      <path d="m58 4 8 5-8 5" fill="none" className="stroke-primary" strokeWidth="1.25" />
    </svg>
  );
}

function CacheRow({ kind, active, appended }: { kind: "K" | "V"; active: boolean; appended: boolean }) {
  return (
    <div className="grid min-w-0 grid-cols-[1.5rem_repeat(4,minmax(0,1fr))] gap-1.5">
      <span className="grid place-items-center font-mono text-xs font-black text-primary">{kind}</span>
      {[1, 2, 3, 4].map((token) => (
        <motion.span
          key={token}
          className={`grid h-11 min-w-0 place-items-center border font-mono text-xs font-black ${
            token === 4 && !appended
              ? "border-dashed border-border text-muted-foreground/35"
              : "border-primary/45 bg-primary/[0.07] text-primary"
          }`}
          animate={active && token <= 3 ? { y: [0, -3, 0] } : undefined}
          transition={{ duration: 0.8, delay: token * 0.08, repeat: active ? Infinity : 0 }}
        >
          {token === 4 && !appended ? "·" : `${kind}${token}`}
        </motion.span>
      ))}
    </div>
  );
}

export default function ContextViz() {
  const reducedMotion = useReducedMotion();
  const [cut, setCut] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing || reducedMotion) return;
    const timer = window.setTimeout(() => {
      setCut((current) => {
        if (current === CUTS.length - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 2300);
    return () => window.clearTimeout(timer);
  }, [cut, playing, reducedMotion]);

  const move = (next: number) => {
    setPlaying(false);
    setCut((next + CUTS.length) % CUTS.length);
  };

  return (
    <VizFrame
      eyebrow="Animated KV-cache trace"
      title="현재 Query는 읽고 사라지고, 새 Key·Value는 과거 기록에 붙습니다"
      description="전체 데이터 경로를 한눈에 본 뒤 ← →로 한 단계씩 이동하거나 Space로 자동 재생합니다."
      note="한 layer·한 sequence의 logical trace입니다. 실제 model은 이 동작을 KV를 소유하는 모든 attention layer에서 반복합니다."
    >
      <div
        data-viz="kv-cache-decode-animation"
        tabIndex={0}
        role="group"
        aria-label="KV cache decode animation"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            move(cut + 1);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            move(cut - 1);
          } else if (event.key === " ") {
            event.preventDefault();
            if (!playing && cut === CUTS.length - 1) setCut(0);
            setPlaying((value) => !value);
          }
        }}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
          {CUTS.map((item, index) => (
            <button
              key={item.label}
              type="button"
              aria-pressed={cut === index}
              onClick={() => move(index)}
              className={`min-w-0 px-3 py-3 text-left ${cut === index ? "bg-primary/[0.08]" : "bg-background"}`}
            >
              <span className="font-mono text-[9px] font-black text-primary">0{index + 1}</span>
              <strong className="mt-1 block text-xs">{item.label}</strong>
            </button>
          ))}
        </div>

        <div data-viz-canvas className="mt-5 grid min-w-0 gap-5 lg:grid-cols-[12rem_4rem_minmax(0,1fr)] lg:items-center">
          <div className="grid gap-3 border border-border bg-background p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">current token · t₄</p>
            <div className="grid grid-cols-3 gap-2">
              {["Q₄", "K₄", "V₄"].map((item, index) => (
                <motion.span
                  key={item}
                  className={`grid aspect-square place-items-center rounded-full border font-mono text-xs font-black ${
                    cut === 0 || (cut === 2 && index === 0) || (cut === 3 && index > 0)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                  animate={playing && ((cut === 2 && index === 0) || (cut === 3 && index > 0)) ? { scale: [1, 1.08, 1] } : undefined}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </div>

          <span className="rotate-90 justify-self-center lg:rotate-0"><Arrow active={playing && cut >= 2} /></span>

          <div className="grid min-w-0 gap-3 border border-primary/45 bg-primary/[0.025] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-primary">past-token cache</p>
              <span className="font-mono text-[10px] text-muted-foreground">time →</span>
            </div>
            <CacheRow kind="K" active={playing && cut === 2} appended={cut === 3} />
            <CacheRow kind="V" active={playing && cut === 2} appended={cut === 3} />
          </div>
        </div>

        <div className="mt-5 border-l border-primary/60 pl-4">
          <p className="font-mono text-xs font-black text-primary">CUT 0{cut + 1}</p>
          <p className="mt-1 text-sm font-bold">{CUTS[cut].title}</p>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">{CUTS[cut].note}</p>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">← 이전 · → 다음 · Space 재생/일시정지</p>
          <button
            type="button"
            disabled={Boolean(reducedMotion)}
            onClick={() => {
              if (!playing && cut === CUTS.length - 1) setCut(0);
              setPlaying((value) => !value);
            }}
            className="border border-primary/45 px-3 py-2 text-xs font-bold text-primary disabled:opacity-50"
          >
            {reducedMotion ? "모션 줄이기 적용" : playing ? "일시정지" : "흐름 재생"}
          </button>
        </div>
      </div>
    </VizFrame>
  );
}
