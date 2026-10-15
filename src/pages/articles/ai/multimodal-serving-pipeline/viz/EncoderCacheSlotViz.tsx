import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * encoder 예산 8,192와 encoder cache 8,192를 사진 단위(1,369) 블록으로 채운다.
 * 한 mechanism: 예산은 사진 하나를 통째로 빼므로 남은 1,347로는 여섯째 사진 U를 시작하지 못한다.
 */
const TOTAL = 8192;
const PHOTO = 1369;
const COLORS: Record<string, string> = {
  P: "#2563eb",
  Q: "#0891b2",
  R: "#7c3aed",
  S: "#db2777",
  T: "#ea580c",
  U: "#16a34a",
};

interface Block {
  id: string;
  refs?: readonly string[];
}

interface Scene {
  label: string;
  budget: readonly string[];
  cache: readonly Block[];
  reject?: string;
  requests: Record<string, "run" | "wait" | "idle">;
  note: string;
}

const REQS = ["R1", "R2", "R3", "R4", "R5", "R6", "R7"] as const;

const SCENES: readonly Scene[] = [
  {
    label: "R1 · P",
    budget: ["P"],
    cache: [{ id: "P", refs: ["R1"] }],
    requests: { R1: "run" },
    note: "cache에 P가 없어 R1이 사진 P를 통째로 encode합니다. 예산 8,192에서 1,369를 빼 6,823이 남습니다.",
  },
  {
    label: "R2 · P 재사용",
    budget: ["P"],
    cache: [{ id: "P", refs: ["R1", "R2"] }],
    requests: { R1: "run", R2: "run" },
    note: "R2도 같은 사진 P를 씁니다. 새 블록 없이 P의 참조에 R2만 더하므로 예산은 6,823 그대로입니다.",
  },
  {
    label: "R3~R6 · Q R S T",
    budget: ["P", "Q", "R", "S", "T"],
    cache: [{ id: "P", refs: ["R1", "R2"] }, { id: "Q", refs: ["R3"] }, { id: "R", refs: ["R4"] }, { id: "S", refs: ["R5"] }, { id: "T", refs: ["R6"] }],
    requests: { R1: "run", R2: "run", R3: "run", R4: "run", R5: "run", R6: "run" },
    note: "서로 다른 사진 네 장을 각각 encode합니다. 블록 다섯 개가 6,845를 쓰고 예산은 1,347 남습니다.",
  },
  {
    label: "R7 · U 거부",
    budget: ["P", "Q", "R", "S", "T"],
    cache: [{ id: "P", refs: ["R1", "R2"] }, { id: "Q", refs: ["R3"] }, { id: "R", refs: ["R4"] }, { id: "S", refs: ["R5"] }, { id: "T", refs: ["R6"] }],
    reject: "U",
    requests: { R1: "run", R2: "run", R3: "run", R4: "run", R5: "run", R6: "run", R7: "wait" },
    note: "U 하나가 1,369인데 남은 예산은 1,347이라 22가 모자랍니다. 사진 일부만 encode할 수 없으므로 R7은 이번 step에 0 token을 받습니다.",
  },
  {
    label: "다음 step (가정)",
    budget: ["U"],
    cache: [{ id: "Q", refs: ["R3"] }, { id: "R", refs: ["R4"] }, { id: "S", refs: ["R5"] }, { id: "T", refs: ["R6"] }, { id: "U", refs: ["R7"] }],
    requests: { R1: "idle", R2: "idle", R3: "run", R4: "run", R5: "run", R6: "run", R7: "run" },
    note: "(가정) R1·R2가 P를 다 읽어 참조가 0이 됐다고 둡니다. 예산은 다시 8,192가 되고, cache는 6,845+1,369가 8,192를 넘으므로 참조 0인 P를 지우고 U를 넣습니다.",
  },
];

const pct = (n: number) => `${(n / TOTAL) * 100}%`;

function Bar({ title, blocks, reject, reduced }: { title: string; blocks: readonly Block[]; reject?: string; reduced: boolean }) {
  const used = blocks.length * PHOTO;
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-bold text-foreground">{title}</span>
        <span className="font-mono text-muted-foreground">
          {used.toLocaleString()} 사용 · {(TOTAL - used).toLocaleString()} 남음
        </span>
      </div>
      <div className="relative mt-1 h-14 w-full rounded-sm border border-border bg-muted/40">
        {blocks.map((b, i) => (
          <motion.div
            key={b.id}
            className="absolute inset-y-0 flex flex-col items-center justify-center border-r border-background text-white"
            style={{ left: pct(i * PHOTO), width: pct(PHOTO), backgroundColor: COLORS[b.id] }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduced ? 0 : 0.15 + i * 0.12, duration: reduced ? 0 : 0.3 }}
          >
            <span className="text-sm font-black leading-none">{b.id}</span>
            {b.refs ? <span className="mt-1 text-[9px] leading-none sm:text-[10px]">{b.refs.join("·")}</span> : null}
          </motion.div>
        ))}
        {reject ? (
          <motion.div
            className="absolute inset-y-0 flex items-center justify-center border border-dashed border-[#dc2626] bg-[#dc2626]/10 text-sm font-black text-[#dc2626]"
            style={{ left: pct(blocks.length * PHOTO), width: pct(PHOTO) }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.8, duration: reduced ? 0 : 0.35 }}
          >
            {reject} ✕
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}

export default function EncoderCacheSlotViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const budgetBlocks = scene.budget.map((id) => ({ id }));

  return (
    <VizFrame
      eyebrow="Encoder budget · cache"
      title="encoder 예산은 사진 한 장을 통째로 빼므로 남은 1,347로는 여섯째 사진을 못 넣습니다"
      description="두 띠의 전체 폭이 각각 8,192입니다. 블록 하나가 사진 한 장의 embedding 1,369개이고, cache 블록 아래 글자는 그 사진을 참조하는 요청입니다."
      note="max_num_batched_tokens 8,192와 사진당 1,369는 본문의 가정입니다. 마지막 장면의 참조 해제 시점도 설명용 가정입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="encoder 예산과 cache의 사진 블록"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div key={scenes.active} className="flex shrink-0 flex-col gap-4">
          <h4 className="text-base font-bold">{scene.label}</h4>
          <Bar title="이번 step encoder 예산" blocks={budgetBlocks} reject={scene.reject} reduced={reduced} />
          <Bar title="encoder cache" blocks={scene.cache} reduced={reduced} />
          <ul className="grid grid-cols-4 gap-1.5 text-center font-mono text-[11px] sm:grid-cols-7" aria-label="요청 상태">
            {REQS.map((r) => {
              const s = scene.requests[r];
              return (
                <li
                  key={r}
                  className={`whitespace-nowrap rounded-sm border px-1 py-1 ${
                    s === "run" ? "border-[#2563eb] text-foreground" : s === "wait" ? "border-[#dc2626] text-[#dc2626]" : "border-dashed border-border text-muted-foreground"
                  }`}
                >
                  {r} {s === "run" ? "진행" : s === "wait" ? "대기" : "·"}
                </li>
              );
            })}
          </ul>
          <p className="min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
