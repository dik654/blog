import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 입력 12 token인 P가 8 token을 계산한 뒤 저장 공간 부족으로 선점되고, 재개 때 hit 3을 빼고 5를 다시 계산한다.
 * 한 mechanism: 해제와 계산 위치 0 재설정이 먼저 일어나고, 재개 때는 그때의 조회 결과(hit 3)만 건너뛴다.
 * 위 줄은 P의 입력 12칸, 아래 줄은 GPU KV 칸 12개(설명용 크기)다.
 */
const INPUT = 12;
const POOL = 12;

type Tok = "todo" | "done" | "hit" | "redo" | "new";
type Cell = "P" | "Q" | "free";

interface Scene {
  label: string;
  tokens: readonly Tok[];
  pool: { P: number; Q: number };
  counter: number;
  status: string;
  fail?: boolean;
  note: string;
}

const row = (spec: readonly [Tok, number][]): Tok[] => spec.flatMap(([t, n]) => Array<Tok>(n).fill(t));

const SCENES: readonly Scene[] = [
  {
    label: "RUNNING · 8/12",
    tokens: row([["done", 8], ["todo", 4]]),
    pool: { P: 8, Q: 4 },
    counter: 8,
    status: "RUNNING",
    note: "P는 입력 12 token 중 8개를 계산했고 그 기록이 KV 칸 8개를 차지합니다. 다른 요청 Q가 4칸을 써서 12칸이 모두 찼습니다.",
  },
  {
    label: "새 칸 할당 실패",
    tokens: row([["done", 8], ["todo", 4]]),
    pool: { P: 8, Q: 4 },
    counter: 8,
    status: "RUNNING",
    fail: true,
    note: "Q가 다음 token을 쓰려고 한 칸을 더 요청하지만 빈칸이 없습니다. scheduler는 running 목록에서 P를 선점 대상으로 고릅니다.",
  },
  {
    label: "PREEMPT · 해제와 0 재설정",
    tokens: row([["todo", 12]]),
    pool: { P: 0, Q: 5 },
    counter: 0,
    status: "PREEMPTED → WAITING",
    note: "_preempt_request가 P의 8칸을 해제하고 계산 위치를 0으로 되돌립니다. Q는 비운 칸 하나를 받아 계속 진행하고 P는 waiting 대기열로 갑니다.",
  },
  {
    label: "재개 · 조회로 hit 3",
    tokens: row([["hit", 3], ["todo", 9]]),
    pool: { P: 3, Q: 0 },
    counter: 3,
    status: "RUNNING",
    note: "Q가 끝나 칸이 비었다고 둡니다. 재개 때 prefix 조회가 앞 3 token의 기록을 찾으면 계산 위치는 0이 아니라 3에서 시작합니다. (가정)",
  },
  {
    label: "반복 계산 5",
    tokens: row([["hit", 3], ["redo", 5], ["todo", 4]]),
    pool: { P: 8, Q: 0 },
    counter: 8,
    status: "RUNNING",
    note: "4~8번째 token은 선점 전에 이미 계산했지만 기록이 사라져 다시 계산합니다. 8 − 3 = 5칸이 선점 한 번이 남긴 반복 계산입니다.",
  },
  {
    label: "남은 입력 4",
    tokens: row([["hit", 3], ["redo", 5], ["new", 4]]),
    pool: { P: 12, Q: 0 },
    counter: 12,
    status: "RUNNING",
    note: "남은 4 token은 선점이 없었어도 처리할 입력이라 반복량에 넣지 않습니다. 이 회차의 낭비는 주황 5칸이고 대기와 조회 시간은 따로 기록합니다.",
  },
];

const TOK_STYLE: Record<Tok, string> = {
  todo: "border-dashed border-[#94a3b8] bg-transparent text-muted-foreground",
  done: "border-[#2563eb] bg-[#2563eb] text-white",
  hit: "border-[#0891b2] bg-[#cffafe] text-[#155e75]",
  redo: "border-[#ea580c] bg-[#fed7aa] text-[#7c2d12]",
  new: "border-[#2563eb] bg-[#dbeafe] text-[#1e3a8a]",
};

const CELL_STYLE: Record<Cell, string> = {
  P: "border-[#2563eb] bg-[#2563eb] text-white",
  Q: "border-[#64748b] bg-[#e2e8f0] text-[#334155]",
  free: "border-dashed border-[#94a3b8] bg-transparent text-transparent",
};

const LEGEND: readonly [Tok, string][] = [
  ["done", "계산함"],
  ["hit", "재사용 hit"],
  ["redo", "반복 계산"],
  ["new", "새로 처리"],
  ["todo", "아직 안 함"],
];

export default function PreemptRecomputeViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4400);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const cells: Cell[] = [
    ...Array<Cell>(scene.pool.P).fill("P"),
    ...Array<Cell>(scene.pool.Q).fill("Q"),
    ...Array<Cell>(POOL - scene.pool.P - scene.pool.Q).fill("free"),
  ];
  const free = POOL - scene.pool.P - scene.pool.Q;
  const redo = scene.tokens.filter((t) => t === "redo").length;

  return (
    <VizFrame
      eyebrow="Preempt · recompute"
      title="선점은 기록 8칸을 바로 돌려받고, 재개 때 hit 3을 뺀 5칸을 다시 계산합니다"
      description="위 줄은 P의 입력 12 token, 아래 줄은 GPU의 KV 칸 12개입니다. 계산 위치는 num_computed_tokens 값입니다."
      note="KV 칸 12개와 Q는 설명용 배치입니다. 8·3·5·4는 본문 12절의 가정 숫자이며 실제 hit은 재개 시 조회 결과로 정해집니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="선점과 재개 때 P의 token과 KV 칸"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="flex min-h-[3.7rem] flex-wrap content-start items-baseline justify-between gap-2 sm:min-h-0">
            <h4 className="text-base font-bold">{scene.label}</h4>
            <span className="font-mono text-xs font-bold text-primary">P · {scene.status}</span>
          </div>

          <p className="mt-3 text-[11px] font-bold text-muted-foreground">P의 입력 12 token</p>
          <div className="mt-1 grid grid-cols-12 gap-1">
            {scene.tokens.map((t, i) => (
              <motion.span
                key={`${i}-${t}`}
                className={`flex h-8 items-center justify-center rounded-sm border font-mono text-[10px] font-bold ${TOK_STYLE[t]}`}
                initial={{ opacity: 0.25 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : i * 0.04 }}
              >
                {i + 1}
              </motion.span>
            ))}
          </div>
          {/* 계산 위치 표시줄: num_computed_tokens */}
          <div className="relative mt-1 h-5">
            <motion.span
              className="absolute top-0 -translate-x-1/2 font-mono text-[10px] font-bold text-[#2563eb]"
              initial={false}
              animate={{ left: `${(scene.counter / INPUT) * 100}%` }}
              transition={{ duration: reduced ? 0 : 0.5 }}
            >
              ▲{scene.counter}
            </motion.span>
          </div>

          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
            {LEGEND.map(([t, label]) => (
              <span key={t} className="flex items-center gap-1">
                <span className={`inline-block size-2.5 rounded-sm border ${TOK_STYLE[t]}`} />
                {label}
              </span>
            ))}
          </div>

          <p className="mt-4 text-[11px] font-bold text-muted-foreground">GPU KV 칸 12개</p>
          <div className="mt-1 flex items-center gap-2">
            <div className="grid flex-1 grid-cols-12 gap-1">
              {cells.map((c, i) => (
                <span
                  key={i}
                  className={`flex h-7 items-center justify-center rounded-sm border font-mono text-[10px] font-bold transition-colors ${CELL_STYLE[c]}`}
                >
                  {c === "free" ? "·" : c}
                </span>
              ))}
            </div>
            <motion.span
              className="flex h-7 w-8 shrink-0 items-center justify-center rounded-sm border border-dashed font-mono text-[10px] font-bold"
              initial={false}
              animate={{
                borderColor: scene.fail ? "#dc2626" : "rgba(0,0,0,0)",
                color: scene.fail ? "#dc2626" : "rgba(0,0,0,0)",
              }}
              transition={{ duration: reduced ? 0 : 0.3 }}
              aria-hidden={!scene.fail}
            >
              Q+1
            </motion.span>
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">P 칸 · Q 칸</dt>
              <dd className="font-bold">
                {scene.pool.P} · {scene.pool.Q}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">빈칸</dt>
              <dd className={`font-bold ${scene.fail ? "text-[#dc2626]" : ""}`}>{free}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">계산 위치</dt>
              <dd className="font-bold text-[#2563eb]">{scene.counter}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">반복 계산</dt>
              <dd className="font-bold text-[#c2410c]">{redo ? `8 − 3 = ${redo}` : "—"}</dd>
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
