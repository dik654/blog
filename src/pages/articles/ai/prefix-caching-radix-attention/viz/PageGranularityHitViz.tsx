import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 같은 R1·R2·R3를 page 크기 1(radix)과 B=4(block hash) 두 저장 단위로 나란히 처리한다.
 * 한 mechanism: 재사용은 저장 단위 경계에서만 끊을 수 있으므로, 6자리 일치가 B=4에서는 4로 내려가고
 * 둘째 block은 5·6이 같아도 통째로 다시 계산·저장한다.
 */
const REQUESTS = [
  { name: "R1", tokens: [1, 2, 3, 4, 5, 6, 7, 8] },
  { name: "R2", tokens: [1, 2, 3, 4, 5, 6, 9, 10] },
  { name: "R3", tokens: [1, 2, 3, 4, 5, 6, 11, 12] },
] as const;

type Model = "page1" | "b4";
/** 요청 r이 처음 오는 경우를 빼면 hit 길이는 모델마다 고정이다: page 1은 6, B=4는 4 */
const HIT: Record<Model, number> = { page1: 6, b4: 4 };

interface Scene {
  label: string;
  /** 지금까지 처리한 요청 수 */
  done: number;
  /** B=4에서 번호는 같지만 다시 계산한 5·6을 강조할지 */
  flagReuseLoss: boolean;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "R1 · 처음 계산", done: 1, flagReuseLoss: false, note: "R1의 여덟 자리는 두 방식 모두 처음이라 전부 계산해 저장합니다. 위는 한 자리씩, 아래는 네 자리 block 두 개로 저장합니다." },
  { label: "R2 · 6 대 4", done: 2, flagReuseLoss: false, note: "R2의 앞 여섯 자리 1~6은 R1과 같습니다. page 크기 1은 6을 그대로 재사용하지만 B=4는 첫 block [1,2,3,4]만 키가 같아 4만 재사용합니다." },
  { label: "B=4의 5·6", done: 2, flagReuseLoss: true, note: "둘째 block [5,6,9,10]은 [5,6,7,8]과 키가 달라 통째로 miss입니다. 빨간 테두리의 5·6은 번호가 같은데도 다시 계산하고 다시 저장합니다." },
  { label: "R3 · 같은 손실 반복", done: 3, flagReuseLoss: true, note: "R3 [1~6,11,12]도 page 크기 1에서는 6, B=4에서는 4를 재사용합니다. 저장 자리는 8 + 2 + 2 = 12와 4 × 4 = 16이 됩니다." },
  { label: "합계 · 12/24 대 8/24", done: 3, flagReuseLoss: false, note: "입력 24자리 중 재사용은 0 + 6 + 6 = 12(50%)와 0 + 4 + 4 = 8(약 33.33%)입니다. 같은 요청인데 저장 단위만 바꿔 재사용은 줄고 저장은 늘었습니다." },
];

type Cell = "calc" | "hit" | "pending";

function stateOf(model: Model, r: number, i: number): Cell {
  if (r === 0) return "calc";
  return i < HIT[model] ? "hit" : "calc";
}

const CELL_STYLE: Record<Cell, string> = {
  calc: "border-[#d97706] bg-[#fef3c7] text-[#78350f] dark:bg-[#78350f]/40 dark:text-[#fde68a]",
  hit: "border-[#16a34a] bg-[#dcfce7] text-[#14532d] dark:bg-[#14532d]/50 dark:text-[#bbf7d0]",
  pending: "border-dashed border-border text-muted-foreground/40",
};

function Panel({ model, scene, sceneKey, reduced }: { model: Model; scene: Scene; sceneKey: number; reduced: boolean }) {
  const hit = REQUESTS.slice(0, scene.done).reduce((sum, _, r) => sum + (r === 0 ? 0 : HIT[model]), 0);
  const stored = REQUESTS.slice(0, scene.done).reduce((sum, _, r) => sum + (r === 0 ? 8 : 8 - HIT[model]), 0);
  const grouped = model === "b4";

  return (
    <div className="min-w-0 rounded-sm border border-border p-2">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <p className="text-xs font-bold">{grouped ? "B = 4 · block hash" : "page 크기 1 · radix"}</p>
        <p className="font-mono text-[11px]">
          재사용 <span className="font-bold text-[#15803d] dark:text-[#86efac]">{hit}</span> · 저장 <span className="font-bold">{stored}</span>자리
        </p>
      </div>
      <div className="mt-1.5 space-y-1">
        {REQUESTS.map((req, r) => {
          const shown = r < scene.done;
          return (
            <div key={req.name} className="grid grid-cols-[1.6rem_minmax(0,1fr)] items-center gap-1.5">
              <span className={`font-mono text-[11px] font-bold ${shown ? "" : "text-muted-foreground/40"}`}>{req.name}</span>
              <div className={`grid ${grouped ? "grid-cols-2 gap-1" : "grid-cols-8 gap-1"}`}>
                {(grouped ? [req.tokens.slice(0, 4), req.tokens.slice(4)] : req.tokens.map((t) => [t])).map((group, g) => (
                  // B=4에서는 네 칸을 테두리 하나로 묶어 block 경계를 보인다
                  <div key={g} className={grouped ? "grid grid-cols-4 gap-px rounded-[3px] border border-[#64748b] p-px" : "contents"}>
                    {group.map((t, k) => {
                      const i = grouped ? g * 4 + k : g;
                      const state: Cell = shown ? stateOf(model, r, i) : "pending";
                      const loss = grouped && shown && r > 0 && scene.flagReuseLoss && (t === 5 || t === 6);
                      return (
                        <motion.span
                          key={`${sceneKey}-${i}`}
                          className={`flex h-6 items-center justify-center rounded-[2px] border font-mono text-[10px] font-bold ${CELL_STYLE[state]} ${
                            loss ? "outline outline-[1.25px] -outline-offset-1 outline-[#dc2626]" : ""
                          }`}
                          initial={shown && r === scene.done - 1 && !reduced ? { opacity: 0.2 } : false}
                          animate={{ opacity: 1 }}
                          transition={{ delay: reduced ? 0 : 0.1 + i * 0.07, duration: 0.2 }}
                        >
                          {t}
                        </motion.span>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PageGranularityHitViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const inputs = scene.done * 8;
  const pct = (hit: number) => (inputs === 0 ? "0" : ((hit / inputs) * 100).toFixed(2).replace(/\.00$/, ""));
  const hitPage = (scene.done - 1) * HIT.page1;
  const hitB4 = (scene.done - 1) * HIT.b4;

  return (
    <VizFrame
      eyebrow="Page granularity"
      title="같은 여섯 자리 일치도 네 자리 묶음에서는 4만 재사용합니다"
      description="위아래 패널은 같은 R1·R2·R3입니다. 칸 숫자는 token ID, 초록은 재사용, 주황은 계산해 저장한 자리입니다. 아래 패널은 네 칸이 한 block입니다."
      note="B=4와 hash 단위 4는 10절의 설명용 가정입니다. 마지막 위치를 남기는 상한(11절)은 이 사례에서 결과를 바꾸지 않습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="page 크기 1과 B=4의 재사용 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>
          <div className="mt-3 grid gap-2 lg:grid-cols-2">
            <Panel model="page1" scene={scene} sceneKey={scenes.active} reduced={reduced} />
            <Panel model="b4" scene={scene} sceneKey={scenes.active} reduced={reduced} />
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">입력 합</dt>
              <dd className="font-bold">{inputs}자리</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">page 1 재사용</dt>
              <dd className="font-bold text-[#15803d] dark:text-[#86efac]">
                {hitPage}/{inputs} = {pct(hitPage)}%
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">B=4 재사용</dt>
              <dd className="font-bold text-[#15803d] dark:text-[#86efac]">
                {hitB4}/{inputs} = {pct(hitB4)}%
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">다시 계산한 5·6</dt>
              <dd className="font-bold text-[#dc2626]">{(scene.done - 1) * 2}자리</dd>
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
