import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 16칸 cell 배열 하나에 A·B 두 대화가 쓰고, 공유하고, 지워지는 과정을 그린다.
 * 한 mechanism: cell은 위치 pos와 sequence bitset만 가지며, 공유는 비트를 하나 더 켜는 일이다.
 * 모바일에서도 글자가 줄지 않도록 SVG 대신 8칸×2줄(데스크톱 16칸×1줄) 격자로 그린다.
 */
const SCENES = ["A가 7칸을 씀", "앞 4칸을 B와 공유", "B가 뒷부분 2칸을 씀", "두 대화가 한 token씩", "B의 mask 한 행", "A가 끝남"] as const;

type Owner = "" | "A" | "B" | "AB";
interface Cell {
  owner: Owner;
  pos: number | null;
}

const EMPTY: Cell = { owner: "", pos: null };

function build(entries: Record<number, Cell>): Cell[] {
  return Array.from({ length: 16 }, (_, index) => entries[index] ?? EMPTY);
}

const A7: Record<number, Cell> = {
  0: { owner: "A", pos: 0 },
  1: { owner: "A", pos: 1 },
  2: { owner: "A", pos: 2 },
  3: { owner: "A", pos: 3 },
  4: { owner: "A", pos: 4 },
  5: { owner: "A", pos: 5 },
  6: { owner: "A", pos: 6 },
};
const SHARED: Record<number, Cell> = { ...A7, 0: { owner: "AB", pos: 0 }, 1: { owner: "AB", pos: 1 }, 2: { owner: "AB", pos: 2 }, 3: { owner: "AB", pos: 3 } };
const B2: Record<number, Cell> = { ...SHARED, 7: { owner: "B", pos: 4 }, 8: { owner: "B", pos: 5 } };
const STEP: Record<number, Cell> = { ...B2, 9: { owner: "A", pos: 7 }, 10: { owner: "B", pos: 6 } };
const AFTER: Record<number, Cell> = {
  0: { owner: "B", pos: 0 },
  1: { owner: "B", pos: 1 },
  2: { owner: "B", pos: 2 },
  3: { owner: "B", pos: 3 },
  7: { owner: "B", pos: 4 },
  8: { owner: "B", pos: 5 },
  10: { owner: "B", pos: 6 },
};

const STATES: readonly Cell[][] = [build(A7), build(SHARED), build(B2), build(STEP), build(STEP), build(AFTER)];

const NOTES = [
  "A의 prompt 7 token이 cell 0~6에 위치 0~6으로 들어갑니다. 각 cell의 bitset에는 A 비트 하나만 켜져 있습니다.",
  "같은 system prompt 4 token을 B에게 넘깁니다. cell 0~3에 B 비트를 더 켤 뿐 K·V 값은 한 byte도 복사하지 않습니다.",
  "B만의 뒷부분 2 token은 head가 가리키는 다음 빈 cell 7·8에 위치 4·5로 들어갑니다. B의 cell은 이제 연속이 아닙니다.",
  "decode 한 step에 A의 위치 7은 cell 9, B의 위치 6은 cell 10에 씁니다. 두 대화의 cell이 배열 안에서 번갈아 섞입니다.",
  "B의 위치 6 query가 읽을 행입니다. n_kv는 11을 256으로 올린 256칸이고, 그중 B 비트가 있는 7칸만 0, 나머지는 −∞입니다.",
  "A를 지우면 A 비트만 꺼집니다. cell 4·5·6·9는 비트가 0개가 되어 비고, 공유 cell 0~3은 B 비트가 남아 그대로 있습니다.",
] as const;

const B_KEEP = new Set([0, 1, 2, 3, 7, 8, 10]);

const STYLE: Record<Owner, string> = {
  "": "border-border bg-transparent text-muted-foreground",
  A: "border-amber-500 bg-amber-500 text-white",
  B: "border-blue-600 bg-blue-600 text-white",
  AB: "border-violet-600 bg-violet-600 text-white",
};

export default function KvCellArrayViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const scene = scenes.active;
  const cells = STATES[scene];
  const used = cells.filter((cell) => cell.owner !== "").length;
  const maskScene = scene === 4;
  const lastUsed = cells.reduce((last, cell, index) => (cell.owner ? index : last), -1);

  return (
    <VizFrame
      eyebrow="KV cell array"
      title="공유도 반환도 cell의 sequence 비트를 켜고 끄는 일입니다"
      description="칸 하나가 KV cell 하나입니다. 칸 안의 수는 그 cell에 적힌 token 위치, 색은 어느 대화의 비트가 켜져 있는지입니다."
      note="실제 n_ctx는 이보다 훨씬 크고 sequence 비트는 256개입니다. 16칸·두 대화는 설명용 축소입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="KV cell 배열의 상태 변화"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(scene + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <ol className="mt-4 grid grid-cols-8 gap-1.5 sm:grid-cols-16" aria-label={`사용 중인 cell ${used}개`}>
            {cells.map((cell, index) => {
              const masked = maskScene && !B_KEEP.has(index);
              return (
                <li key={index} className="flex min-w-0 flex-col items-center">
                  <span className="text-[10px] tabular-nums text-muted-foreground">{index}</span>
                  <span
                    className={`mt-0.5 flex h-9 w-full items-center justify-center rounded-sm border text-sm font-bold tabular-nums transition-opacity duration-300 ${STYLE[cell.owner]} ${
                      masked && cell.owner ? "opacity-25" : "opacity-100"
                    }`}
                  >
                    {cell.pos ?? ""}
                  </span>
                  <span className={`mt-0.5 h-4 text-[11px] font-bold ${B_KEEP.has(index) ? "text-blue-600" : "text-rose-600"}`}>
                    {maskScene ? (B_KEEP.has(index) ? "0" : "−∞") : ""}
                  </span>
                </li>
              );
            })}
          </ol>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-2.5 bg-amber-500" />A 비트
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-2.5 bg-blue-600" />B 비트
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-2.5 bg-violet-600" />A·B 둘 다
            </span>
            <span className={`sm:ml-auto ${maskScene ? "" : "invisible"}`}>cell 16~255도 전부 −∞</span>
          </div>

          <dl className="mt-3 grid grid-cols-3 gap-x-4 gap-y-2 font-mono text-xs">
            <div>
              <dt className="text-muted-foreground">사용 cell</dt>
              <dd className="font-bold text-foreground">{used}/16</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">used_max_p1</dt>
              <dd className="font-bold text-foreground">{lastUsed + 1}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">n_kv</dt>
              <dd className="font-bold text-foreground">256</dd>
            </div>
          </dl>

          <p className="mt-4 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:min-h-[3.5rem]">
            {NOTES[scene]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
