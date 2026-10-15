import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 8자리 cache 하나에 X·Y 계열 요청 6개를 두 순서로 흘려 보낸다.
 * 한 mechanism: 같은 요청 6개라도 실행 순서가 cache에 남는 앞 6자리를 정하므로 hit이 0/48과 24/48로 갈린다.
 */
type Req = "X1" | "X2" | "X3" | "Y1" | "Y2" | "Y3";
const ALT: readonly Req[] = ["X1", "Y1", "X2", "Y2", "X3", "Y3"];
const GROUPED: readonly Req[] = ["X1", "X2", "X3", "Y1", "Y2", "Y3"];
const PREFIX = 6;
const TAIL = 2;
const LEN = PREFIX + TAIL;

interface Scene {
  label: string;
  order: readonly Req[];
  executed: number;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "번갈아 · X1", order: ALT, executed: 1, note: "처음에는 cache가 비어 있어 X1의 8자리를 모두 계산합니다. 실행 뒤 cache에는 X의 앞 6자리와 X1의 끝 2자리가 남습니다." },
  { label: "번갈아 · Y1", order: ALT, executed: 2, note: "Y1은 Y 계열의 앞 6자리를 써서 X와 겹치는 자리가 없습니다. hit 0이고, 8자리 공간이 Y로 바뀌며 X의 기록이 밀려납니다." },
  { label: "번갈아 · 6개 끝", order: ALT, executed: 6, note: "X2가 올 때는 Y가, Y2가 올 때는 X가 남아 있습니다. 매번 앞 계열을 밀어내므로 48자리 중 hit은 0입니다." },
  { label: "묶음 · X1", order: GROUPED, executed: 1, note: "같은 6개 요청을 X끼리 먼저 실행합니다. X1은 처음이라 여전히 hit 0이고 X의 앞 6자리를 cache에 등록합니다." },
  { label: "묶음 · X2·X3", order: GROUPED, executed: 3, note: "X2와 X3은 cache에 남은 X의 앞 6자리를 그대로 읽습니다. 각각 6자리가 hit이고 끝 2자리만 새로 계산해 교체합니다." },
  { label: "묶음 · Y 계열", order: GROUPED, executed: 6, note: "Y1에서 cache를 Y로 바꾸고, Y2·Y3이 다시 6자리씩 재사용합니다. hit 6 × 4 = 24, 24/48 = 50%입니다." },
];

const series = (r: Req) => r[0] as "X" | "Y";

/** order에서 i번째 요청이 실행될 때 cache에 같은 계열 앞 6자리가 있었는가 */
function hitOf(order: readonly Req[], i: number) {
  return i > 0 && series(order[i - 1]) === series(order[i]) ? PREFIX : 0;
}

const SERIES_CLASS = {
  X: { strong: "border-[#2563eb] bg-[#2563eb] text-white", soft: "border-[#2563eb] bg-[#dbeafe] text-[#1e3a8a] dark:bg-[#1e3a8a]/40 dark:text-[#bfdbfe]" },
  Y: { strong: "border-[#7c3aed] bg-[#7c3aed] text-white", soft: "border-[#7c3aed] bg-[#ede9fe] text-[#4c1d95] dark:bg-[#4c1d95]/40 dark:text-[#ddd6fe]" },
} as const;

export default function CacheAwareOrderViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4000);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const last = scene.order[scene.executed - 1];
  const hits = scene.order.map((_, i) => (i < scene.executed ? hitOf(scene.order, i) : null));
  const total = hits.reduce<number>((sum, h) => sum + (h ?? 0), 0);
  const firstNew = scenes.active === 0 || scenes.active === 3 ? 0 : SCENES[scenes.active - 1].order === scene.order ? SCENES[scenes.active - 1].executed : 0;

  return (
    <VizFrame
      eyebrow="Cache-aware order"
      title="같은 요청 6개도 실행 순서가 hit을 0과 24로 가릅니다"
      description="위는 실행 순서, 가운데는 8자리 cache에 지금 남은 기록, 아래는 요청 6개 × 8자리 = 48칸입니다. 초록 칸이 cache에서 읽은 hit입니다."
      note="15절의 별도 사례입니다. 공간은 한 요청의 8자리만 담고 한 번에 하나씩 처리하며 생성 기록은 세지 않는다고 가정합니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="실행 순서에 따른 cache 내용과 hit 칸"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>

          <p className="mt-2 text-[11px] font-bold text-muted-foreground">실행 순서</p>
          <div className="mt-1 grid grid-cols-6 gap-1">
            {scene.order.map((r, i) => (
              <span
                key={r}
                className={`flex h-6 items-center justify-center rounded-sm border text-xs font-black ${
                  i < scene.executed ? SERIES_CLASS[series(r)].strong : "border-dashed border-border text-muted-foreground"
                } ${i === scene.executed - 1 ? "outline outline-[1.25px] outline-offset-1 outline-[#f59e0b]" : ""}`}
              >
                {r}
              </span>
            ))}
          </div>

          <p className="mt-2 text-[11px] font-bold text-muted-foreground">8자리 cache (실행 뒤)</p>
          <div className="mt-1 grid grid-cols-8 gap-1">
            {Array.from({ length: LEN }, (_, k) => (
              <motion.span
                key={`${scenes.active}-${k}`}
                className={`flex h-6 items-center justify-center rounded-sm border text-[10px] font-bold ${
                  k < PREFIX ? SERIES_CLASS[series(last)].strong : SERIES_CLASS[series(last)].soft
                }`}
                initial={reduced ? false : { opacity: 0.2 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduced ? 0 : 0.05 * k, duration: 0.3 }}
              >
                {k < PREFIX ? series(last) : last}
              </motion.span>
            ))}
          </div>

          <p className="mt-2 text-[11px] font-bold text-muted-foreground">요청 6개 × 8자리 = 48칸 (초록 = hit)</p>
          <div className="mt-1 space-y-1">
            {scene.order.map((r, i) => {
              const h = hits[i];
              return (
                <div key={r} className="grid grid-cols-[2.2rem_minmax(0,1fr)_2.6rem] items-center gap-2">
                  <span className="font-mono text-[11px] font-bold">{r}</span>
                  <div className="grid grid-cols-8 gap-px">
                    {Array.from({ length: LEN }, (_, k) => {
                      const state = h === null ? "todo" : k < h ? "hit" : "miss";
                      const fresh = h !== null && i >= firstNew;
                      return (
                        <motion.span
                          key={`${scenes.active}-${r}-${k}`}
                          className={`h-4 rounded-[2px] border ${
                            state === "hit" ? "border-[#16a34a] bg-[#22c55e]" : state === "miss" ? "border-border bg-muted-foreground/35" : "border-dashed border-border/70"
                          }`}
                          initial={fresh && !reduced ? { opacity: 0 } : false}
                          animate={{ opacity: 1 }}
                          transition={{ delay: reduced ? 0 : 0.25 + (i - firstNew) * 0.35 + k * 0.03, duration: 0.25 }}
                        />
                      );
                    })}
                  </div>
                  <span className="text-right font-mono text-[11px] font-bold text-[#15803d]">{h === null ? "" : `hit ${h}`}</span>
                </div>
              );
            })}
          </div>

          <p className="mt-2 border-y border-border py-1 font-mono text-sm font-bold">
            hit 합계 <span className="text-[#15803d]">{total}</span> / 48{scene.executed === 6 ? ` = ${Math.round((total / 48) * 100)}%` : ""}
          </p>

          <p className="mt-3 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">{scene.note}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
