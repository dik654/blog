import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 길이 35인 A와 B를 16 · 16 · 3으로 나누고, B가 block을 하나씩 조회하는 순서를 따라간다.
 * 한 mechanism: 꽉 찬 block만 Hash(parent, token 16개)로 키를 만들고, 키가 같으면 A의 physical block을 참조한다.
 * parent가 사슬로 이어지므로 첫 block이 다르면 둘째 block의 token이 같아도 키가 달라진다.
 */
const B = 16;
const LENGTH = 35;

type Cell = "pending" | "stored" | "hit" | "miss";
interface BlockState {
  state: Cell;
  key: string;
  phys: string;
}
interface Scene {
  label: string;
  second: "B" | "C";
  row: readonly BlockState[];
  /** 지금 조회 중인 block 번호 */
  focus: number | null;
  refs: { p7: number; p2: number };
  hit: number;
  note: string;
}

const A_ROW: readonly BlockState[] = [
  { state: "stored", key: "H₀", phys: "P7" },
  { state: "stored", key: "H₁", phys: "P2" },
  { state: "stored", key: "키 없음", phys: "P9" },
];
const KEY_TEXT = ["Hash(NONE, 0–15)", "Hash(H₀, 16–31)", "3칸 · full 아님"] as const;
const C_KEY_TEXT = ["Hash(NONE, 0–15′)", "Hash(H₀′, 16–31)", "3칸 · full 아님"] as const;
/** C에서 A와 다른 token 위치(가정) */
const C_DIFF = 5;

const SCENES: readonly Scene[] = [
  {
    label: "A가 키를 남김",
    second: "B",
    row: [
      { state: "pending", key: "?", phys: "" },
      { state: "pending", key: "?", phys: "" },
      { state: "pending", key: "?", phys: "" },
    ],
    focus: null,
    refs: { p7: 1, p2: 1 },
    hit: 0,
    note: "A의 35 token은 16 · 16 · 3으로 P7·P2·P9에 있습니다. 꽉 찬 두 block만 키 H₀·H₁을 얻고, 3칸짜리 P9에는 키가 없습니다.",
  },
  {
    label: "B block 0 · H₀ hit",
    second: "B",
    row: [
      { state: "hit", key: "H₀", phys: "P7" },
      { state: "pending", key: "?", phys: "" },
      { state: "pending", key: "?", phys: "" },
    ],
    focus: 0,
    refs: { p7: 2, p2: 1 },
    hit: 16,
    note: "B의 token 0–15를 NONE_HASH와 묶어 hash하면 A와 같은 H₀가 나옵니다. B는 P7을 새로 계산하지 않고 참조하므로 P7의 ref가 2가 됩니다.",
  },
  {
    label: "B block 1 · H₁ hit",
    second: "B",
    row: [
      { state: "hit", key: "H₀", phys: "P7" },
      { state: "hit", key: "H₁", phys: "P2" },
      { state: "pending", key: "?", phys: "" },
    ],
    focus: 1,
    refs: { p7: 2, p2: 2 },
    hit: 32,
    note: "다음 키는 앞에서 얻은 H₀를 parent로 넣어 만듭니다. token 16–31도 같으므로 H₁이 나오고 P2의 ref도 2가 됩니다.",
  },
  {
    label: "끝 3 token · miss",
    second: "B",
    row: [
      { state: "hit", key: "H₀", phys: "P7" },
      { state: "hit", key: "H₁", phys: "P2" },
      { state: "miss", key: "키 없음", phys: "P11" },
    ],
    focus: 2,
    refs: { p7: 2, p2: 2 },
    hit: 32,
    note: "남은 3 token은 16칸을 채우지 못해 키가 없습니다. B는 새 block P11을 받아 35 − 32 = 3 token만 prefill합니다. table 항목은 3 + 3 = 6개, 실제 block은 4개입니다.",
  },
  {
    label: "앞 block이 다르면",
    second: "C",
    row: [
      { state: "miss", key: "H₀′", phys: "새" },
      { state: "miss", key: "H₁′", phys: "새" },
      { state: "miss", key: "키 없음", phys: "새" },
    ],
    focus: 1,
    refs: { p7: 1, p2: 1 },
    hit: 0,
    note: "B 대신 token 5 하나만 다른 C가 오면 첫 키 H₀′부터 어긋납니다. token 16–31은 A와 같아도 parent H₀′가 들어가 H₁′이 되므로 둘째 block도 miss이고 35 token을 모두 prefill합니다.",
  },
];

const CELL_STYLE: Record<Cell, string> = {
  pending: "border-border bg-muted/40",
  stored: "border-[#2563eb] bg-[#2563eb]",
  hit: "border-[#16a34a] bg-[#16a34a]",
  miss: "border-[#f59e0b] bg-[#f59e0b]",
};
const TAG_STYLE: Record<Cell, string> = {
  pending: "text-muted-foreground",
  stored: "text-[#1d4ed8] dark:text-[#93c5fd]",
  hit: "text-[#15803d] dark:text-[#86efac]",
  miss: "text-[#b45309] dark:text-[#fcd34d]",
};

function RequestRow({
  name,
  row,
  keys,
  focus,
  diff,
  reduced,
  sceneKey,
}: {
  name: string;
  row: readonly BlockState[];
  keys: readonly string[];
  focus: number | null;
  diff?: number;
  reduced: boolean;
  sceneKey: number;
}) {
  return (
    <div className="grid grid-cols-[1.4rem_minmax(0,1fr)] items-start gap-2">
      <span className="pt-5 font-mono text-sm font-black">{name}</span>
      <div className="grid grid-cols-3 gap-1.5">
        {row.map((block, b) => {
          const filled = Math.min(B, LENGTH - b * B);
          const isFocus = focus === b;
          return (
            <div key={b} className="min-w-0">
              <p className="truncate font-mono text-[10px] text-muted-foreground">
                {b * B}–{b * B + filled - 1}
              </p>
              <div
                className={`grid gap-px rounded-[3px] border p-0.5 ${isFocus ? "border-[#0f172a] dark:border-[#e2e8f0]" : "border-border"}`}
                style={{ gridTemplateColumns: `repeat(${B}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: B }, (_, slot) => {
                  const real = slot < filled;
                  const isDiff = diff !== undefined && b * B + slot === diff;
                  return (
                    <motion.span
                      key={`${sceneKey}-${slot}`}
                      className={`h-5 rounded-[1px] border ${
                        !real ? "border-dashed border-border/60" : isDiff ? "border-[#dc2626] bg-[#dc2626]" : CELL_STYLE[block.state]
                      }`}
                      initial={isFocus && real && !reduced ? { opacity: 0.2 } : false}
                      animate={{ opacity: 1 }}
                      transition={{ delay: reduced ? 0 : 0.1 + slot * 0.04, duration: 0.2 }}
                    />
                  );
                })}
              </div>
              <p className="mt-1 min-h-[2rem] text-[10px] leading-4 text-muted-foreground sm:min-h-0">{keys[b]}</p>
              <p className={`font-mono text-[11px] font-bold ${TAG_STYLE[block.state]}`}>
                {block.key}
                {block.phys ? ` → ${block.phys}` : ""}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PrefixHashChainViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const isC = scene.second === "C";

  return (
    <VizFrame
      eyebrow="Chained block hash"
      title="꽉 찬 block마다 앞 키를 넣어 다음 키를 만들고, 같은 키면 A의 block을 참조합니다"
      description="한 줄이 요청 하나의 35 token이고 16칸 상자 하나가 block 하나입니다. 상자 아래 식이 그 block의 키를 만드는 입력입니다."
      note="block 크기 16, 번호 P7·P2·P9·P11은 13절의 설명용 가정이고 C는 parent 사슬을 보이려고 덧붙인 가상의 요청입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="요청 A와 B의 block 키 조회"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>

          <div className="mt-3 space-y-3">
            <RequestRow name="A" row={A_ROW} keys={KEY_TEXT} focus={null} reduced={reduced} sceneKey={scenes.active} />
            <RequestRow
              name={scene.second}
              row={scene.row}
              keys={isC ? C_KEY_TEXT : KEY_TEXT}
              focus={scene.focus}
              diff={isC ? C_DIFF : undefined}
              reduced={reduced}
              sceneKey={scenes.active}
            />
          </div>

          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
            <span><span className="mr-1 inline-block size-2 rounded-[1px] bg-[#2563eb] align-middle" />A가 계산함</span>
            <span><span className="mr-1 inline-block size-2 rounded-[1px] bg-[#16a34a] align-middle" />hit · 재사용</span>
            <span><span className="mr-1 inline-block size-2 rounded-[1px] bg-[#f59e0b] align-middle" />miss · prefill</span>
            <span><span className="mr-1 inline-block size-2 rounded-[1px] bg-[#dc2626] align-middle" />A와 다른 token</span>
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">{scene.second}의 hit</dt>
              <dd className="font-bold text-[#15803d] dark:text-[#86efac]">{scene.hit} token</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">새로 prefill</dt>
              <dd className="font-bold text-[#b45309] dark:text-[#fcd34d]">{scenes.active >= 3 ? `${LENGTH - scene.hit} token` : "조회 중"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">ref P7 · P2</dt>
              <dd className="font-bold">
                {scene.refs.p7} · {scene.refs.p2}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">조회 방향</dt>
              <dd className="font-bold">NONE → H₀ → H₁</dd>
            </div>
          </dl>

          <p className="mt-3 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[9rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
