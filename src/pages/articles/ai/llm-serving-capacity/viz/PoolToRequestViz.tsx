import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * KV pool의 token slot을 칸으로 깔고, 요청 하나가 몇 칸을 예약하는지 덮어 본다.
 * 한 mechanism: 동시에 받을 수 있는 요청 수 = pool token ÷ 요청 하나가 예약하는 token.
 * 1칸 = 4,096 token, 한 줄 16칸 = max_model_len 65,536 요청 하나.
 */
const CELL = 4096;
const PER_ROW = 16;
const ROWS = 6;

interface Scene {
  label: string;
  pool: number;
  request: number;
  claimed?: number;
  assumed?: boolean;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "byte → token slot",
    pool: 40960,
    request: 65536,
    note: "남은 KV 예산 10 GiB를 token 하나의 KV 256 KiB로 나누면 40,960 token, 곧 10칸입니다. 한 줄(65,536 token)을 다 채우지 못하므로 max-length 요청 하나도 온전히 들어가지 않습니다.",
  },
  {
    label: "Gemma · 88,824",
    pool: 88824,
    request: 65536,
    note: "88,824 token은 21.7칸입니다. 한 줄을 채운 요청 1개 뒤에 5.7칸이 남아 88,824 ÷ 65,536 ≈ 1.36입니다. startup log의 1.36×와 같습니다.",
  },
  {
    label: "Muse · 352,736",
    pool: 352736,
    request: 65536,
    note: "352,736 token은 86.1칸입니다. 줄 5개를 다 채우고 6.1칸이 남아 5.38입니다. 이것도 log의 5.38×와 맞습니다.",
  },
  {
    label: "Qwen · 97,216 vs 5.17×",
    pool: 97216,
    request: 65536,
    claimed: 5.17,
    note: "97,216 token은 23.7칸이라 직접 나누면 1.48입니다. log의 5.17×를 그리려면 빨간 점선까지 82.7칸이 필요합니다. 차이 3.69×는 cache group이나 표시 단위를 확인하라는 신호입니다.",
  },
  {
    label: "Gemma · max_model_len 절반",
    pool: 88824,
    request: 32768,
    assumed: true,
    note: "(가정) 같은 pool에서 요청 하나의 예약을 32,768 token(8칸)으로 줄이면 8칸 묶음 2개와 5.7칸이 남아 2.71입니다. 예산은 그대로인데 받는 수가 두 배 가까이 됩니다.",
  },
  {
    label: "Muse · p95 24k 요청",
    pool: 352736,
    request: 24576,
    assumed: true,
    note: "(가정) 실제 요청이 p95 길이 24k(6칸)라면 같은 86.1칸에 14개가 들어갑니다. 그래서 admission 상한은 max_model_len이 아니라 실제 길이 분포를 재생해 정합니다.",
  },
];

const fmt = (n: number) => n.toLocaleString();

export default function PoolToRequestViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4800);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const poolCells = scene.pool / CELL;
  const unit = scene.request / CELL;
  const fullRequests = Math.floor(scene.pool / scene.request);
  const claimedCells = scene.claimed ? (scene.claimed * scene.request) / CELL : 0;
  const total = ROWS * PER_ROW;

  return (
    <VizFrame
      eyebrow="Memory → admission"
      title="pool의 token 칸을 요청 하나가 예약하는 칸으로 나눠 셉니다"
      description="칸 하나는 4,096 token, 한 줄 16칸은 max_model_len 65,536 요청 하나입니다. 같은 색 묶음이 요청 하나가 예약한 칸이고 회색은 요청 하나를 채우지 못한 나머지입니다."
      note="10 GiB·256 KiB, 세 runtime의 cache token과 배수는 본문의 startup log 값입니다. 마지막 두 장면은 예약 크기를 바꾼 가정입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="KV pool token 칸과 요청 예약 단위"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div key={scenes.active} className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>

          <div className="mt-3 grid grid-cols-[repeat(16,minmax(0,1fr))] gap-[3px]" aria-label={`pool ${poolCells.toFixed(1)}칸`}>
            {Array.from({ length: total }, (_, i) => {
              const fill = Math.max(0, Math.min(1, poolCells - i));
              const inRequest = i < fullRequests * unit;
              const req = Math.floor(i / unit);
              const color = !inRequest ? "#94a3b8" : req % 2 === 0 ? "#2563eb" : "#60a5fa";
              const overClaim = !fill && scene.claimed && i < claimedCells;
              const delay = reduced ? 0 : 0.2 + i * 0.012;
              return (
                <span
                  key={i}
                  className={`relative h-4 overflow-hidden rounded-[2px] border sm:h-5 ${overClaim ? "border-dashed border-[#dc2626]" : fill ? "border-transparent" : "border-dashed border-border"}`}
                >
                  {fill > 0 ? (
                    <motion.span
                      className="absolute inset-y-0 left-0"
                      style={{ backgroundColor: color }}
                      initial={{ width: "0%" }}
                      animate={{ width: `${fill * 100}%` }}
                      transition={{ delay, duration: reduced ? 0 : 0.2 }}
                    />
                  ) : null}
                </span>
              );
            })}
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">pool</dt>
              <dd className="font-bold text-foreground">
                {fmt(scene.pool)} = {poolCells.toFixed(1)}칸
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">요청 하나 예약</dt>
              <dd className="font-bold text-foreground">
                {fmt(scene.request)} = {unit}칸
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">pool ÷ 예약</dt>
              <dd className="font-bold text-[#2563eb]">{(scene.pool / scene.request).toFixed(2)}개</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{scene.claimed ? "log 보고값" : "온전히 들어간 요청"}</dt>
              <dd className={`font-bold ${scene.claimed ? "text-[#dc2626]" : "text-foreground"}`}>
                {scene.claimed ? `${scene.claimed}× = ${claimedCells.toFixed(1)}칸` : `${fullRequests}개`}
              </dd>
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
