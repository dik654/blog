import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 같은 32층 모델에 prefill(A B C D)과 decode(E, F)를 차례로 넣는다.
 * 한 mechanism: 층 수(세로)는 언제나 32이고, 한 번에 새로 계산하는 위치 수(가로)만 4 → 1 → 1로 바뀐다.
 * 아래에서 위로 올라가는 띠가 "지금 이 층을 지나는 중"이고, decode에서 깜빡이는 칸이 그 층의 과거 K/V를 읽는 순간이다.
 */
const POSITIONS = ["A", "B", "C", "D", "E", "F"] as const;
const LAYERS = 32;
/** 화면에 그리는 층 행. 4~31층은 한 줄로 접는다. 위에서 아래 순서(출력 쪽이 위). */
const ROWS = [
  { key: "l32", label: "층 32", step: 4 },
  { key: "gap", label: "층 4–31", step: 3, folded: true },
  { key: "l3", label: "층 3", step: 2 },
  { key: "l2", label: "층 2", step: 1 },
  { key: "l1", label: "층 1", step: 0 },
] as const;
const ROW_DELAY = 0.45;
const START_DELAY = 0.35;

interface Scene {
  label: string;
  fresh: readonly number[];
  past: readonly number[];
  output: string;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "Prefill · A B C D",
    fresh: [0, 1, 2, 3],
    past: [],
    output: "E",
    note: "입력 네 위치가 함께 층 1부터 층 32까지 올라갑니다. 층마다 네 위치의 K/V를 그 층의 cache에 남기고 맨 위에서 D 위치의 결과로 첫 출력 E를 고릅니다.",
  },
  {
    label: "Decode 1 · E",
    fresh: [4],
    past: [0, 1, 2, 3],
    output: "F",
    note: "이번에는 E 한 위치만 올라갑니다. 층을 건너뛰지 않고 32층을 모두 지나며 층마다 그 층에 저장된 A~D의 K/V를 읽고 E의 K/V를 덧붙입니다.",
  },
  {
    label: "Decode 2 · F",
    fresh: [5],
    past: [0, 1, 2, 3, 4],
    output: "G",
    note: "F도 같은 32층을 지납니다. 읽을 과거 K/V는 다섯 위치로 늘었지만 새로 계산하는 위치는 여전히 하나입니다.",
  },
];

const delayFor = (step: number, reduced: boolean) => (reduced ? 0 : START_DELAY + step * ROW_DELAY);

function Cell({ state, delay, reduced, folded }: { state: "empty" | "past" | "fresh"; delay: number; reduced: boolean; folded?: boolean }) {
  const base = "relative flex h-7 items-center justify-center rounded-sm border text-[10px] font-bold sm:text-[11px]";
  if (state === "empty") return <div className={`${base} border-dashed border-border text-transparent`}>·</div>;
  if (state === "past") {
    return (
      <div className={`${base} border-[#93c5fd] bg-[#dbeafe] text-[#1e3a8a] dark:bg-[#1e3a8a]/40 dark:text-[#bfdbfe]`}>
        {folded ? "⋯" : "KV"}
        {/* 이 층을 새 위치가 지나는 순간 과거 K/V를 읽는다 */}
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-sm bg-[#f59e0b]"
          initial={{ opacity: 0 }}
          animate={{ opacity: reduced ? 0 : [0, 0.55, 0] }}
          transition={{ delay, duration: 0.6, times: [0, 0.4, 1] }}
        />
      </div>
    );
  }
  return (
    <motion.div
      className={`${base} border-[#2563eb] text-white`}
      initial={{ backgroundColor: "rgba(37,99,235,0)", color: "rgba(255,255,255,0)" }}
      animate={{ backgroundColor: "rgba(37,99,235,1)", color: "rgba(255,255,255,1)" }}
      transition={{ delay, duration: reduced ? 0 : 0.3 }}
    >
      {folded ? "⋯" : "KV"}
    </motion.div>
  );
}

export default function LayerPassViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const fresh = scene.fresh.length;
  const past = scene.past.length;
  const outputDelay = delayFor(ROWS.length, reduced);
  const columns = "grid-cols-[3.9rem_repeat(6,minmax(0,1fr))] sm:grid-cols-[5rem_repeat(6,minmax(0,1fr))]";

  return (
    <VizFrame
      eyebrow="Layer pass"
      title="decode도 32층을 모두 지나고, 줄어드는 것은 한 번에 넣는 위치 수입니다"
      description="세로는 층, 가로는 토큰 위치입니다. 파란 칸은 이번에 새로 남긴 K/V, 연한 칸은 앞에서 남긴 K/V, 주황 깜빡임은 그 층에서 과거 K/V를 읽는 순간입니다."
      note="32층은 설명용 예시입니다(Llama 3 8B가 32층). 각 층은 자기 층의 K/V만 따로 저장하고 읽습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="prefill과 decode에서 위치가 층을 지나는 순서"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div key={scenes.active} className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>

          {/* 출력 */}
          <div className={`mt-2 grid ${columns} items-center gap-1`}>
            <span className="text-[11px] font-bold text-muted-foreground">다음 토큰</span>
            {POSITIONS.map((p, i) => (
              <div key={p} className="flex h-7 items-center justify-center">
                {i === Math.max(...scene.fresh) ? (
                  <motion.span
                    className="rounded-sm border border-[#16a34a] bg-[#dcfce7] px-2 py-0.5 text-xs font-black text-[#166534] dark:bg-[#14532d]/50 dark:text-[#bbf7d0]"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: outputDelay, duration: reduced ? 0 : 0.35 }}
                  >
                    → {scene.output}
                  </motion.span>
                ) : null}
              </div>
            ))}
          </div>

          {/* 층 */}
          <div className="mt-1 space-y-1 border-y border-border py-2">
            {ROWS.map((row) => {
              const delay = delayFor(row.step, reduced);
              return (
                <div key={row.key} className={`grid ${columns} items-center gap-1`}>
                  <span className={`text-[11px] font-bold ${"folded" in row ? "text-muted-foreground" : "text-foreground"}`}>{row.label}</span>
                  {POSITIONS.map((p, i) => (
                    <Cell
                      key={p}
                      state={scene.fresh.includes(i) ? "fresh" : scene.past.includes(i) ? "past" : "empty"}
                      delay={delay}
                      reduced={reduced}
                      folded={"folded" in row}
                    />
                  ))}
                </div>
              );
            })}
          </div>

          {/* 입력 */}
          <div className={`mt-1 grid ${columns} items-center gap-1`}>
            <span className="text-[11px] font-bold text-muted-foreground">입력 위치</span>
            {POSITIONS.map((p, i) => (
              <div
                key={p}
                className={`flex h-7 items-center justify-center rounded-sm text-sm font-black ${
                  scene.fresh.includes(i) ? "bg-[#2563eb] text-white" : scene.past.includes(i) ? "text-muted-foreground" : "text-muted-foreground/40"
                }`}
              >
                {p}
              </div>
            ))}
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">지나는 층</dt>
              <dd className="font-bold text-foreground">{LAYERS}층</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">새로 계산</dt>
              <dd className="font-bold text-[#2563eb]">
                {fresh}위치 × {LAYERS} = {fresh * LAYERS}칸
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">읽는 과거 K/V</dt>
              <dd className="font-bold text-[#b45309]">
                {past}위치 × {LAYERS} = {past * LAYERS}칸
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">층마다 cache 길이</dt>
              <dd className="font-bold text-foreground">
                {past} → {past + fresh}
              </dd>
            </div>
          </dl>

          <p className="mt-3 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
