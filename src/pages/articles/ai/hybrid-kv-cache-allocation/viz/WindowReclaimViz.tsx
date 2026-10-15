import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * global 2층·local 6층이 T token을 담을 때 보존하는 block을 칸으로 그린다.
 * 한 mechanism: local layer가 읽는 범위(최근 W=1,024)와 붙잡고 있는 범위는 다르다.
 * 회수를 켜야 창 밖 칸이 free pool로 돌아가 32,768 → 14,336이 된다.
 * 1칸 = 256 token block. 최대 T=4,096 = 16칸.
 */
const BLOCK = 256;
const COLS = 16;
const WINDOW_BLOCKS = 4; // W = 1,024
const ROWS = [
  { key: "G1", global: true },
  { key: "G2", global: true },
  { key: "L1", global: false },
  { key: "L2", global: false },
  { key: "L3", global: false },
  { key: "L4", global: false },
  { key: "L5", global: false },
  { key: "L6", global: false },
] as const;

interface Scene {
  label: string;
  t: number;
  reclaim: boolean;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "T=1,024",
    t: 1024,
    reclaim: false,
    note: "모든 층이 4칸(1,024 token)을 잡습니다. local 층의 읽기 창이 아직 전부를 덮으므로 읽는 칸과 잡은 칸이 같습니다. 8 × 1,024 = 8,192입니다.",
  },
  {
    label: "T=2,048 · 회수 끔",
    t: 2048,
    reclaim: false,
    note: "local 층은 최근 4칸만 읽고 앞 4칸은 더 읽지 않습니다. 그래도 회수하지 않으면 흐린 칸까지 그대로 잡고 있어 8 × 2,048 = 16,384가 됩니다.",
  },
  {
    label: "T=4,096 · 회수 끔",
    t: 4096,
    reclaim: false,
    note: "local 6층마다 읽지 않는 칸이 12개입니다. 읽기 규칙은 1,024 token인데 잡은 양은 global과 같아 8 × 4,096 = 32,768입니다.",
  },
  {
    label: "T=4,096 · 회수 켬",
    t: 4096,
    reclaim: true,
    note: "allocator가 창 밖 block을 돌려주면 local 층마다 12칸, 모두 72칸(18,432 token)이 free pool로 갑니다. 남는 것은 2 × 16 + 6 × 4 = 56칸, 14,336입니다.",
  },
];

export default function WindowReclaimViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const filled = scene.t / BLOCK;
  const windowStart = Math.max(0, filled - WINDOW_BLOCKS);
  const localHeld = scene.reclaim ? Math.min(filled, WINDOW_BLOCKS) : filled;
  const heldBlocks = 2 * filled + 6 * localHeld;
  const returned = scene.reclaim ? 6 * (filled - localHeld) : 0;
  const columns = "grid-cols-[1.75rem_repeat(16,minmax(0,1fr))] sm:grid-cols-[2.5rem_repeat(16,minmax(0,1fr))]";

  return (
    <VizFrame
      eyebrow="Visibility ≠ allocation"
      title="local 층은 최근 4칸만 읽지만 회수해야 메모리가 줄어듭니다"
      description="행은 층(G=global, L=local), 칸 하나는 256 token block입니다. 진한 칸은 지금 읽는 범위, 흐린 칸은 읽지 않지만 잡고 있는 block입니다."
      note="T=4,096, W=1,024, global 2층·local 6층은 본문 사례입니다. block 크기 256은 칸을 셀 수 있게 정한 설명용 단위입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="local window 밖 block 회수 전후의 보존 칸"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div key={scenes.active} className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>

          <div className="mt-3 space-y-1">
            {ROWS.map((row, r) => (
              <div key={row.key} className={`grid ${columns} items-center gap-[2px]`}>
                <span className={`text-[10px] font-bold ${row.global ? "text-[#b45309]" : "text-[#2563eb]"}`}>{row.key}</span>
                {Array.from({ length: COLS }, (_, c) => {
                  if (c >= filled) return <span key={c} className="h-5 rounded-[2px] border border-dashed border-border" />;
                  const inWindow = row.global || c >= windowStart;
                  const color = row.global ? "#f59e0b" : "#2563eb";
                  if (inWindow) {
                    return <span key={c} className="h-5 rounded-[2px] border" style={{ backgroundColor: color, borderColor: color }} />;
                  }
                  // local 층의 창 밖 칸: 회수하면 free pool로 빠진다
                  return (
                    <motion.span
                      key={c}
                      className="h-5 rounded-[2px] border border-[#93c5fd] bg-[#dbeafe] dark:bg-[#1e3a8a]/40"
                      initial={{ opacity: 1, x: 0 }}
                      animate={scene.reclaim ? { opacity: 0, x: 24 } : { opacity: 1, x: 0 }}
                      transition={{ delay: reduced ? 0 : 0.4 + (r - 2) * 0.12 + c * 0.03, duration: reduced ? 0 : 0.35 }}
                    />
                  );
                })}
              </div>
            ))}
            <div className={`grid ${columns} gap-[2px] pt-1`}>
              <span />
              {Array.from({ length: COLS }, (_, c) => (
                <span key={c} className="text-center text-[8px] tabular-nums text-muted-foreground sm:text-[9px]">
                  {(c + 1) % 4 === 0 ? `${((c + 1) * BLOCK) / 1024}K` : ""}
                </span>
              ))}
            </div>
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">요청 길이 T</dt>
              <dd className="font-bold text-foreground">{scene.t.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">잡은 칸</dt>
              <dd className="font-bold text-foreground">
                {heldBlocks}칸 = {(heldBlocks * BLOCK).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">free pool로 반환</dt>
              <dd className="font-bold text-[#16a34a]">
                {returned}칸 = {(returned * BLOCK).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">local 층이 읽는 범위</dt>
              <dd className="font-bold text-[#2563eb]">{(Math.min(filled, WINDOW_BLOCKS) * BLOCK).toLocaleString()} token</dd>
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
