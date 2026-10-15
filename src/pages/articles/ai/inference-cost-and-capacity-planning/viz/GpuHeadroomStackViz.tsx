import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * GPU 한 장을 100 tokens/s짜리 칸을 쌓은 기둥으로 그리고, peak 6,000 tokens/s를 모든 기둥에 고르게 붓는다.
 * 한 mechanism: 목표 이용률 0.7 선 아래만 계획 용량으로 세므로 6장이 아니라 9장이 필요하고,
 * raw 여유 50%와 계획 여유 5%는 같은 9장을 다른 분모로 센 값이다.
 */
const CELL = 100; // tokens/s per cell
const CELL_PX = 13;
const TARGET = 0.7;

interface Scene {
  label: string;
  gpus: number;
  perGpu: number; // tokens/s
  demand: number; // tokens/s
  extra: number; // 추가된 기둥 수(강조)
  show: "over" | "margin" | "raw" | "none";
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "6장", gpus: 6, perGpu: 1000, demand: 6000, extra: 0, show: "over", note: "6장에 6,000을 부으면 모든 기둥이 꼭대기까지 찹니다. 0.7 선 위 빨간 18칸은 이용률 100% 구간이라 지연이 발산합니다." },
  { label: "9장 · 계획 여유", gpus: 9, perGpu: 1000, demand: 6000, extra: 0, show: "margin", note: "0.7 선 아래 용량은 9 × 700 = 6,300입니다. 6,000을 채우고 남는 300(3칸)이 계획 여유 5%입니다." },
  { label: "9장 · raw 여유", gpus: 9, perGpu: 1000, demand: 6000, extra: 0, show: "raw", note: "같은 9장을 꼭대기까지 세면 9,000입니다. 남는 3,000(30칸)이 raw 여유 50%이고, 그중 27칸은 일부러 비워 둔 0.7 선 위입니다." },
  { label: "처리량 800", gpus: 11, perGpu: 800, demand: 6000, extra: 2, show: "margin", note: "지속 부하로 장당 처리량이 800이 되면 기둥이 8칸으로 줄고 0.7 선은 5.6칸입니다. 6,000 / 560 = 10.7이라 11장이 필요합니다." },
  { label: "12장 · 2배 headroom", gpus: 12, perGpu: 1000, demand: 6000, extra: 3, show: "margin", note: "peak의 2배를 받도록 12장을 두면 추가 3장이 $2/GPU-h × 720시간 × 3 = 한 달 $4,320입니다." },
  { label: "평균 8 RPS", gpus: 9, perGpu: 1000, demand: 2400, extra: 0, show: "none", note: "평균 시간대 2,400 tokens/s를 9장에 부으면 기둥마다 2.7칸, 이용률 27%입니다. 비어 있는 칸만큼 cost/token이 $2.08/M으로 오릅니다." },
];

function Column({ cells, fill, line, show, extra, delay, reduced }: { cells: number; fill: number; line: number; show: Scene["show"]; extra: boolean; delay: number; reduced: boolean }) {
  const below = Math.min(fill, line);
  const above = Math.max(0, fill - line);
  const spareBelow = Math.max(0, line - fill);
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
      <div className="relative w-full overflow-hidden rounded-[3px] border" style={{ height: cells * CELL_PX, borderColor: extra ? "#16a34a" : "#94a3b8" }}>
        {/* 칸 눈금 */}
        {Array.from({ length: cells - 1 }, (_, i) => (
          <span key={i} className="absolute inset-x-0 border-t border-border" style={{ bottom: (i + 1) * CELL_PX }} />
        ))}
        {/* 0.7 선 위 비워 둔 몫 */}
        {show === "raw" ? <span className="absolute inset-x-0 bg-[#e2e8f0] dark:bg-[#334155]" style={{ bottom: line * CELL_PX, height: (cells - line) * CELL_PX }} /> : null}
        {/* 계획 여유 */}
        {show !== "over" && show !== "none" && spareBelow > 0 ? (
          <span className="absolute inset-x-0 bg-[#bbf7d0] dark:bg-[#14532d]" style={{ bottom: fill * CELL_PX, height: spareBelow * CELL_PX }} />
        ) : null}
        <motion.span
          className="absolute inset-x-0 bottom-0 origin-bottom bg-[#2563eb]"
          style={{ height: below * CELL_PX }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: reduced ? 0 : delay, duration: reduced ? 0 : 0.45 }}
        />
        {above > 0 ? (
          <motion.span
            className="absolute inset-x-0 origin-bottom bg-[#dc2626]"
            style={{ bottom: line * CELL_PX, height: above * CELL_PX }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: reduced ? 0 : delay + 0.45, duration: reduced ? 0 : 0.3 }}
          />
        ) : null}
        <span className="absolute inset-x-0 border-t-[1.25px] border-dashed border-[#0f172a] dark:border-[#e2e8f0]" style={{ bottom: line * CELL_PX }} />
      </div>
    </div>
  );
}

export default function GpuHeadroomStackViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4000);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const cells = scene.perGpu / CELL;
  const line = cells * TARGET;
  const fill = scene.demand / scene.gpus / CELL;
  const raw = scene.gpus * scene.perGpu;
  const planned = raw * TARGET;
  const util = scene.demand / raw;

  return (
    <VizFrame
      eyebrow="Headroom"
      title="0.7 선 아래만 계획 용량으로 세면 6장이 아니라 9장입니다"
      description="기둥 하나가 GPU 한 장, 칸 하나가 100 tokens/s입니다. 점선이 목표 이용률 0.7이고, 파랑이 그 시간대 수요를 모든 장에 고르게 나눈 양입니다."
      note="peak 20 RPS × 300 token = 6,000 tokens/s, 장당 1,000 tokens/s, 목표 0.7, $2/GPU-h는 본문의 가정입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="GPU 장수에 따른 이용률 선과 여유 칸"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div key={scenes.active} className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>

          <div className="mt-3 flex items-end gap-1" style={{ height: 10 * CELL_PX + 4 }}>
            {Array.from({ length: scene.gpus }, (_, g) => (
              <Column
                key={g}
                cells={cells}
                fill={fill}
                line={line}
                show={scene.show}
                extra={g >= scene.gpus - scene.extra}
                delay={0.1 + g * 0.06}
                reduced={reduced}
              />
            ))}
            {Array.from({ length: 12 - scene.gpus }, (_, g) => (
              <div key={`pad${g}`} className="flex-1" />
            ))}
          </div>
          <div className="mt-1 flex gap-1 font-mono text-[9px] text-muted-foreground">
            {Array.from({ length: 12 }, (_, g) => (
              <span key={g} className="flex-1 text-center">
                {g < scene.gpus ? g + 1 : ""}
              </span>
            ))}
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">GPU · 장당</dt>
              <dd className="font-bold text-foreground">
                {scene.gpus}장 · {scene.perGpu.toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">수요 / raw</dt>
              <dd className="font-bold text-foreground">
                {scene.demand.toLocaleString()} / {raw.toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">0.7 선 아래 용량</dt>
              <dd className="font-bold" style={{ color: planned < scene.demand ? "#dc2626" : "#16a34a" }}>
                {planned.toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">이용률</dt>
              <dd className="font-bold text-foreground">{Math.round(util * 100)}%</dd>
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
