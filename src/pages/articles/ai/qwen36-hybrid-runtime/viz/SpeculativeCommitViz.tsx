import { LayoutGroup, motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * MTP 후보 4개 중 2개가 승인될 때 세 request state를 token 축 위에 나란히 둔다.
 * 한 mechanism: KV · Delta state · convolution history가 같은 승인 경계 a에서 함께 commit/폐기돼야
 * 다음 token이 하나의 과거를 본다. G 표시는 각 state가 가리키는 generation pointer다.
 */
const COLS = ["t−2", "t−1", "t", "t+1", "t+2", "t+3", "t+4"] as const;
const LANES = [
  { key: "kv", label: "Attention KV", unit: "token당 1열" },
  { key: "delta", label: "Delta state S", unit: "token마다 갱신" },
  { key: "conv", label: "conv history", unit: "최근 입력 창" },
] as const;
const PREFIX_END = 2; // 열 index of t

type CellState = "committed" | "draft" | "accepted" | "rejected" | "gone" | "empty";

interface Scene {
  label: string;
  cell: (lane: number, col: number) => CellState;
  pointer: readonly [number, number, number];
  bad?: boolean;
  note: string;
}

const draftIdx = (c: number) => c - PREFIX_END; // 1..4 for t+1..t+4

const SCENES: readonly Scene[] = [
  {
    label: "정본 prefix t",
    cell: (_l, c) => (c <= PREFIX_END ? "committed" : "empty"),
    pointer: [PREFIX_END, PREFIX_END, PREFIX_END],
    note: "세 state가 모두 token t까지 계산돼 있고 generation pointer G도 세 줄에서 같은 t를 가리킵니다.",
  },
  {
    label: "MTP draft 4개",
    cell: (_l, c) => (c <= PREFIX_END ? "committed" : "draft"),
    pointer: [PREFIX_END, PREFIX_END, PREFIX_END],
    note: "MTP가 t+1~t+4 네 token을 제안하면 세 state 모두에 점선 임시 분기가 생깁니다. 정본 G는 아직 t에 있습니다.",
  },
  {
    label: "verify · 2개 승인",
    cell: (_l, c) => (c <= PREFIX_END ? "committed" : draftIdx(c) <= 2 ? "accepted" : "rejected"),
    pointer: [PREFIX_END, PREFIX_END, PREFIX_END],
    note: "target 모델이 앞의 두 후보만 연속으로 승인했습니다. 승인 경계 a는 2이고 t+3·t+4는 거절입니다.",
  },
  {
    label: "commit · G를 t+2로",
    cell: (_l, c) => (c <= PREFIX_END + 2 ? "committed" : "gone"),
    pointer: [PREFIX_END + 2, PREFIX_END + 2, PREFIX_END + 2],
    note: "세 줄의 G가 한 번에 t+2로 옮겨 갑니다. 거절된 두 token은 세 state에서 함께 버려져 모두 6칸이 사라집니다.",
  },
  {
    label: "잘못된 부분 rollback",
    cell: (l, c) => (c <= PREFIX_END + 2 ? "committed" : l === 1 ? "rejected" : "gone"),
    pointer: [PREFIX_END + 2, PREFIX_END + 4, PREFIX_END + 2],
    bad: true,
    note: "KV와 conv만 되돌리고 Delta state를 t+4에 남겨 두면 G가 갈라집니다. 다음 token은 attention에서는 t+2까지, recurrent state에서는 거절된 t+4까지 본 과거를 섞습니다.",
  },
];

const style: Record<CellState, string> = {
  committed: "border-[#2563eb] bg-[#2563eb]/75",
  draft: "border-dashed border-[#2563eb] bg-transparent",
  accepted: "border-[#16a34a] bg-[#16a34a]/70",
  rejected: "border-[#dc2626] bg-[#dc2626]/60",
  gone: "border-dashed border-border bg-transparent opacity-40",
  empty: "border-dashed border-border bg-transparent",
};

export default function SpeculativeCommitViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4400);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const columns = "grid-cols-[4.5rem_repeat(7,minmax(0,1fr))] sm:grid-cols-[7.5rem_repeat(7,minmax(0,1fr))]";
  const discarded = scenes.active >= 3 ? LANES.reduce((n, _l, li) => n + COLS.filter((_c, ci) => scene.cell(li, ci) === "gone").length, 0) : 0;

  return (
    <VizFrame
      eyebrow="Prefix transaction"
      title="세 state가 같은 승인 경계에서 함께 commit돼야 합니다"
      description="가로는 token 위치, 세 줄은 한 request가 가진 state입니다. G는 그 state가 가리키는 정본 위치입니다. 점선은 MTP 임시 분기, 초록은 승인, 빨강은 거절입니다."
      note="draft 4개·승인 2개는 본문의 질문 사례입니다. conv history 창의 실제 길이는 그리지 않았습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="MTP 승인 경계에서 세 state를 commit하는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>

          <LayoutGroup>
            <div className="mt-3 space-y-3">
              <div className={`grid ${columns} gap-1`}>
                <span />
                {COLS.map((c) => (
                  <span key={c} className="text-center font-mono text-[10px] text-muted-foreground">
                    {c}
                  </span>
                ))}
              </div>
              {LANES.map((lane, li) => (
                <div key={lane.key} className={`grid ${columns} items-center gap-1`}>
                  <span className="min-w-0 leading-tight">
                    <span className="block text-[11px] font-bold text-foreground">{lane.label}</span>
                    <span className="hidden text-[10px] text-muted-foreground sm:block">{lane.unit}</span>
                  </span>
                  {COLS.map((c, ci) => {
                    const st = scene.cell(li, ci);
                    const isPointer = scene.pointer[li] === ci;
                    const off = scene.bad && li === 1;
                    return (
                      <span key={c} className={`relative h-8 rounded-sm border transition-colors duration-300 ${style[st]}`}>
                        {isPointer ? (
                          <motion.span
                            layoutId={`g-${lane.key}`}
                            transition={{ duration: reduced ? 0 : 0.5 }}
                            className={`absolute -right-1 -top-2 z-10 rounded-sm px-1 font-mono text-[10px] font-black text-white ${off ? "bg-[#dc2626]" : "bg-[#0f172a] dark:bg-[#e2e8f0] dark:text-[#0f172a]"}`}
                          >
                            G
                          </motion.span>
                        ) : null}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          </LayoutGroup>

          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">draft</dt>
              <dd className="font-bold text-foreground">{scenes.active >= 1 ? "4개" : "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">승인 경계 a</dt>
              <dd className="font-bold text-[#16a34a]">{scenes.active >= 2 ? "2" : "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">폐기한 칸</dt>
              <dd className="font-bold text-foreground">{scenes.active >= 3 ? `${discarded}칸` : "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">G 위치</dt>
              <dd className={`font-bold ${scene.bad ? "text-[#dc2626]" : "text-foreground"}`}>
                {scene.pointer.every((p) => p === scene.pointer[0]) ? `세 줄 모두 ${COLS[scene.pointer[0]]}` : "갈라짐"}
              </dd>
            </div>
          </dl>

          <p className="mt-4 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[9rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
