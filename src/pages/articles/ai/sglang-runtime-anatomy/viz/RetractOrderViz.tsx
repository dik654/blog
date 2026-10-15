import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 실행 중인 요청 4개를 입력 200칸 + 출력 칸으로 그리고, decode 칸이 모자랄 때 누가 빠지는지 따라간다.
 * 한 mechanism: 출력 수 내림차순으로 세운 목록의 끝(출력이 가장 적은 요청)부터 빼고,
 * 남은 요청의 실제 진행률로 비율을 다시 셈한다.
 */
interface Req {
  id: string;
  out: number;
}
const INPUT = 200;
const MAX_NEW = 1000;
const STEPS = 20;
const ARRIVAL: readonly Req[] = [
  { id: "R1", out: 150 },
  { id: "R2", out: 250 },
  { id: "R3", out: 100 },
  { id: "R4", out: 200 },
];
const SORTED = [...ARRIVAL].sort((a, b) => b.out - a.out);
const SCALE = INPUT + 250;

interface Scene {
  label: string;
  rows: readonly Req[];
  queued: Req | null;
  ratio: number;
  returned: number;
  note: string;
}

const kept = SORTED.slice(0, 3);
const outSum = kept.reduce((s, r) => s + r.out, 0);
const newRatio = (outSum + STEPS * kept.length) / (MAX_NEW * kept.length + 1);

const SCENES: readonly Scene[] = [
  { label: "decode 칸 검사 실패", rows: ARRIVAL, queued: null, ratio: 0.098, returned: 0, note: "check_decode_mem은 다음 decode 한 번에 요청마다 한 칸, 모두 4칸이 있는지 봅니다. (가정) 남은 칸이 4보다 적어 retract_decode가 불립니다." },
  { label: "출력 내림차순 정렬", rows: SORTED, queued: null, ratio: 0.098, returned: 0, note: "기본 순서는 이미 만든 출력 수의 내림차순입니다. 250 · 200 · 150 · 100 순으로 세우면 끝에 가까운 요청이 앞에 옵니다." },
  { label: "끝에서 하나 빼기", rows: kept, queued: SORTED[3], ratio: 0.098, returned: INPUT + SORTED[3].out, note: "목록의 끝, 출력 100개짜리 요청이 먼저 빠집니다. 그 KV 300칸은 radix tree에 넣지 않고 바로 반환합니다." },
  { label: "비율 다시 셈", rows: kept, queued: SORTED[3], ratio: newRatio, returned: INPUT + SORTED[3].out, note: `남은 세 요청의 출력 ${outSum}에 요청당 ${STEPS} step 여유를 더해 상한 합으로 나눕니다. 바닥 0.098이던 비율이 ${newRatio.toFixed(4)}로 올라가 다음 수용을 다시 조심스럽게 만듭니다.` },
  { label: "대기열에서 재진입", rows: kept, queued: SORTED[3], ratio: newRatio, returned: INPUT + SORTED[3].out, note: "빠진 요청은 대기열로 돌아갑니다. 다시 들어올 때는 입력 200과 이미 만든 출력 100을 합친 최대 300 token을 prefill로 다시 계산합니다." },
];

const pct = (n: number) => `${(n / SCALE) * 100}%`;
const RATIO_MAX = 0.3;

export default function RetractOrderViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const t = { duration: reduced ? 0 : 0.5 };

  return (
    <VizFrame
      eyebrow="Retract order"
      title="칸이 모자라면 출력이 가장 적은 요청부터 대기열로 돌려보냅니다"
      description="행 하나가 실행 중인 요청입니다. 회색은 입력 200칸, 파랑은 이미 만든 출력 칸입니다. 아래 눈금은 다음 수용에 쓰는 비율입니다."
      note="출력 250·200·150·100과 출력 상한 1,000은 11절의 설명용 가정입니다. 비율 식은 고정한 SGLang 코드의 estimate_new_token_ratio_after_retract입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="retract 순서와 비율 재계산"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>

          <p className="mt-2 text-[11px] font-bold text-muted-foreground">실행 중 batch</p>
          <div className="mt-1 min-h-[6.25rem] space-y-1">
            {scene.rows.map((r) => (
              <motion.div key={r.id} layout={!reduced} transition={t} className="grid grid-cols-[2rem_minmax(0,1fr)_3.2rem] items-center gap-2">
                <span className="font-mono text-xs font-bold">{r.id}</span>
                <div className="flex h-5 overflow-hidden rounded-sm border border-border bg-muted/20">
                  <span className="h-full border-r border-background bg-muted-foreground/35" style={{ width: pct(INPUT) }} />
                  <span className="h-full bg-[#2563eb]" style={{ width: pct(r.out) }} />
                </div>
                <span className="text-right font-mono text-xs font-bold">출력 {r.out}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-[minmax(0,1fr)_7rem] items-start gap-3">
            <div>
              <p className="text-[11px] font-bold text-muted-foreground">대기열</p>
              <div className="mt-1 flex h-8 items-center gap-2 rounded-sm border border-dashed border-border px-2">
                {scene.queued ? (
                  <motion.span
                    initial={reduced ? false : { opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={t}
                    className="whitespace-nowrap rounded-sm border border-[#ea580c] bg-[#ffedd5] px-2 py-0.5 font-mono text-[11px] font-bold text-[#9a3412] dark:bg-[#7c2d12]/40 dark:text-[#fed7aa]"
                  >
                    {scene.queued.id} · 재진입 prefill {INPUT + scene.queued.out}
                  </motion.span>
                ) : (
                  <span className="text-[11px] text-muted-foreground">비어 있음</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-muted-foreground">반환한 KV</p>
              <p className="mt-1 flex h-8 items-center font-mono text-sm font-bold text-[#15803d]">{scene.returned ? `+${scene.returned}칸` : "0칸"}</p>
            </div>
          </div>

          <div className="mt-2">
            <p className="text-[11px] font-bold text-muted-foreground">새 요청 수용 비율</p>
            <div className="relative mt-1 h-6 rounded-sm border border-border bg-muted/20">
              <motion.span
                className="absolute inset-y-0 left-0 rounded-sm bg-[#f59e0b]/70"
                initial={false}
                animate={{ width: `${(scene.ratio / RATIO_MAX) * 100}%` }}
                transition={{ duration: reduced ? 0 : 0.8 }}
              />
              <span className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold">{scene.ratio.toFixed(scene.ratio === 0.098 ? 3 : 4)}</span>
            </div>
            <p className="mt-1 min-h-[2.5rem] font-mono text-[11px] text-muted-foreground sm:min-h-[1.25rem]">
              {scene.ratio === 0.098 ? "0 ─ 바닥 0.098에 머문 상태 ─ 0.3" : `(${kept.map((r) => r.out).join(" + ")} + ${STEPS}×${kept.length}) / (${MAX_NEW}×${kept.length} + 1) = ${newRatio.toFixed(4)}`}
            </p>
          </div>

          <p className="mt-3 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">{scene.note}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
