import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 요청 A의 block table과 16칸 physical block을 함께 그린다.
 * 한 mechanism: 위치 j는 table[floor(j/16)]의 j mod 16번째 칸으로 번역되고,
 * 길이가 늘면 마지막 block의 빈칸부터 채운 뒤 넘칠 때만 새 block 하나를 table 끝에 붙인다.
 */
const B = 16;
const POOL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const TABLE_FULL = [7, 2, 9, 5] as const;

interface Scene {
  label: string;
  length: number;
  prevLength: number;
  read: number | null;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "길이 35", length: 35, prevLength: 35, read: null, note: "35개 기록이 16 + 16 + 3으로 P7·P2·P9에 들어 있습니다. 마지막 P9에는 13칸이 비어 있습니다." },
  { label: "위치 34 읽기", length: 35, prevLength: 35, read: 34, note: "floor(34/16) = 2이므로 table[2] = P9이고, 34 mod 16 = 2이므로 P9의 2번 칸을 읽습니다." },
  { label: "+3 → 길이 38", length: 38, prevLength: 35, read: null, note: "새 기록 3개는 P9의 빈칸 3·4·5에 들어갑니다. 빈칸이 남아 있으므로 새 block은 0개입니다." },
  { label: "위치 37 읽기", length: 38, prevLength: 38, read: 37, note: "floor(37/16) = 2, 37 mod 16 = 5이므로 P9[5]입니다. 이제 이 칸에 유효한 기록이 있습니다." },
  { label: "+11 → 길이 49", length: 49, prevLength: 38, read: null, note: "P9의 남은 10칸을 채우고도 1개가 남아 48칸을 넘습니다. 빈 block P5 하나를 table 끝에 붙입니다." },
  { label: "위치 48 읽기", length: 49, prevLength: 49, read: 48, note: "floor(48/16) = 3이므로 table[3] = P5, 48 mod 16 = 0입니다. 앞의 P7·P2·P9는 한 칸도 옮기지 않았습니다." },
];

export default function BlockTableGrowthViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const blocks = Math.ceil(scene.length / B);
  const table = TABLE_FULL.slice(0, blocks);
  const empty = blocks * B - scene.length;
  const readRow = scene.read === null ? -1 : Math.floor(scene.read / B);
  const readSlot = scene.read === null ? -1 : scene.read % B;

  return (
    <VizFrame
      eyebrow="Block table"
      title="위치 하나를 table 행과 block 안 칸으로 번역합니다"
      description="왼쪽 열이 A의 block table이고 오른쪽 16칸 띠가 그 행이 가리키는 physical block입니다. 맨 위 띠는 GPU의 block 번호 순서입니다."
      note="block 크기 16과 번호 7·2·9·5는 7절의 설명용 가정입니다. 회색 block은 다른 요청이 쓰거나 비어 있는 block입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="block table과 physical block 칸"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>

          {/* physical 번호 순서: A의 block이 흩어져 있음을 보여 준다 */}
          <div className="mt-3 grid grid-cols-10 gap-1" aria-label="GPU physical block 번호 순서">
            {POOL.map((p) => {
              const logical = table.indexOf(p as (typeof TABLE_FULL)[number]);
              return (
                <div
                  key={p}
                  className={`flex h-7 flex-col items-center justify-center rounded-sm border text-[10px] font-bold leading-3 ${
                    logical >= 0 ? "border-[#2563eb] bg-[#dbeafe] text-[#1e3a8a] dark:bg-[#1e3a8a]/40 dark:text-[#bfdbfe]" : "border-border bg-muted/40 text-muted-foreground"
                  }`}
                >
                  <span>P{p}</span>
                  <span className="text-[9px] font-normal">{logical >= 0 ? `L${logical}` : ""}</span>
                </div>
              );
            })}
          </div>

          {/* block table 행과 16칸 */}
          <div className="mt-3 space-y-1">
            {[0, 1, 2, 3].map((row) => {
              const p = table[row];
              const filled = Math.max(0, Math.min(B, scene.length - row * B));
              const before = Math.max(0, Math.min(B, scene.prevLength - row * B));
              return (
                <div key={row} className="grid grid-cols-[3.6rem_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[5rem_minmax(0,1fr)]">
                  <span className={`font-mono text-xs font-bold ${p === undefined ? "text-muted-foreground/50" : row === readRow ? "text-[#b45309]" : ""}`}>
                    L{row} → {p === undefined ? "—" : `P${p}`}
                  </span>
                  <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${B}, minmax(0, 1fr))` }}>
                    {Array.from({ length: B }, (_, slot) => {
                      const isFilled = p !== undefined && slot < filled;
                      const isNew = isFilled && slot >= before;
                      const isRead = row === readRow && slot === readSlot;
                      return (
                        <motion.span
                          key={`${scenes.active}-${slot}`}
                          className={`relative h-6 rounded-[2px] border ${
                            p === undefined ? "border-dashed border-border/60" : isFilled ? "border-[#2563eb] bg-[#2563eb]" : "border-[#93c5fd] bg-background"
                          } ${isRead ? "outline outline-[1.25px] outline-offset-1 outline-[#f59e0b]" : ""}`}
                          initial={isNew && !reduced ? { opacity: 0.15 } : false}
                          animate={{ opacity: 1 }}
                          transition={{ delay: reduced ? 0 : 0.15 + (slot - before) * 0.08, duration: 0.25 }}
                        >
                          {isRead ? <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white">{slot}</span> : null}
                        </motion.span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <dl className="mt-4 grid auto-rows-[3.4rem] grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:auto-rows-auto sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">table</dt>
              <dd className="font-bold">[{table.map((p) => `P${p}`).join(", ")}]</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">길이 · block</dt>
              <dd className="font-bold">
                {scene.length} · {blocks}개
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">빈칸</dt>
              <dd className="font-bold">{empty}칸</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">읽는 주소</dt>
              <dd className="font-bold text-[#b45309]">{scene.read === null ? "—" : `${scene.read} → P${table[readRow]}[${readSlot}]`}</dd>
            </div>
          </dl>

          <p className="mt-4 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">{scene.note}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
