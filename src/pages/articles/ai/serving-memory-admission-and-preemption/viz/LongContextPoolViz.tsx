import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 12절의 27,648block pool을 한 줄로 그리고 128K 요청이 차지하는 몫과 짧은 대화 자리를 함께 센다.
 * 한 mechanism: 긴 요청은 끝날 때까지 block을 돌려주지 않으므로, 남은 block ÷ 94가 짧은 대화의 동시 자리다.
 */
const POOL = 27648;
const LONG = 8192;
const SHORT = 94;
const SHORT_POOL_MAX = 2048;

const SCENES = ["긴 요청 없음", "128K 요청 셋", "긴 요청 한 개로 제한", "짧은 묶음 32K 상한"] as const;

interface SceneState {
  longRunning: number;
  longWaiting: number;
  cap?: number;
  note: string;
}

const STATES: readonly SceneState[] = [
  {
    longRunning: 0,
    longWaiting: 0,
    note: "pool 전체 27,648block을 1,500토큰까지 크는 짧은 대화가 나눠 씁니다. 대화 하나가 94block이므로 294개가 동시에 들어갑니다.",
  },
  {
    longRunning: 3,
    longWaiting: 0,
    note: "128K 요청 하나가 8,192block, pool의 29.6%입니다. 셋이 돌면 24,576block이 묶이고 3,072block만 남아 짧은 대화 자리는 32개입니다.",
  },
  {
    longRunning: 1,
    longWaiting: 2,
    note: "긴 요청 등급을 한 개로 묶으면 나머지 둘은 대기열에서 자기 차례를 기다립니다. 짧은 대화는 19,456block을 얻어 206개가 들어갑니다.",
  },
  {
    longRunning: 0,
    longWaiting: 0,
    cap: SHORT_POOL_MAX,
    note: "짧은 묶음의 max_model_len을 32,768로 두면 요청 하나가 많아야 2,048block, pool의 7.4%입니다. 128K 요청은 이 묶음이 받지 않으므로 선택기가 긴 묶음으로 보냅니다.",
  },
];

export default function LongContextPoolViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3600);
  const scene = scenes.active;
  const state = STATES[scene];
  const longBlocks = state.longRunning * LONG;
  const free = POOL - longBlocks;
  const shortSlots = Math.floor(free / SHORT);
  const longShare = longBlocks / POOL;

  return (
    <VizFrame
      eyebrow="Long-context pool"
      title="긴 요청이 묶어 둔 block만큼 짧은 대화 자리가 사라집니다"
      description="가로 막대 하나가 12절의 KV pool 27,648block입니다. 주황 칸은 실행 중인 128K 요청, 파란 영역은 짧은 대화가 쓸 수 있는 나머지입니다."
      note="128KiB/토큰 모델, 16토큰 block, 짧은 대화 94block은 10·12절의 가정을 그대로 씁니다. 하한 block과 prefix 공유는 넣지 않았습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="긴 문맥 요청이 KV pool을 차지하는 비율"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scene + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <svg viewBox="0 0 480 96" className="mt-4 w-full" role="img" aria-label={`pool 중 긴 요청 ${Math.round(longShare * 1000) / 10}%`}>
            <rect x={0} y={20} width={480} height={36} rx={3} fill="#93c5fd" fillOpacity={0.45} stroke="#2563eb" strokeOpacity={0.5} />
            {Array.from({ length: state.longRunning }, (_, index) => (
              <rect
                key={index}
                x={(index * LONG * 480) / POOL}
                y={20}
                width={(LONG * 480) / POOL - 2}
                height={36}
                rx={2}
                fill="#d97706"
              />
            ))}
            {Array.from({ length: state.longRunning }, (_, index) => (
              <text
                key={`label-${index}`}
                x={((index + 0.5) * LONG * 480) / POOL}
                y={42}
                textAnchor="middle"
                fontSize={10}
                fontWeight={700}
                fill="#ffffff"
              >
                128K · 8,192
              </text>
            ))}
            {state.cap ? (
              <>
                <rect x={0} y={20} width={(state.cap * 480) / POOL} height={36} rx={2} fill="none" stroke="#d97706" strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={(state.cap * 480) / POOL + 6} y={42} fontSize={10} fill="#d97706" fontWeight={700}>
                  요청 하나 상한 2,048
                </text>
              </>
            ) : null}
            <text x={0} y={12} fontSize={10} fill="#6b7280">0</text>
            <text x={480} y={12} fontSize={10} fill="#6b7280" textAnchor="end">27,648block</text>
            <text x={0} y={76} fontSize={10} fill="#6b7280">
              {state.longWaiting > 0 ? `대기 중인 128K 요청 ${state.longWaiting}개 (block 없음)` : " "}
            </text>
          </svg>

          <dl className="mt-3 grid grid-cols-3 gap-x-4 gap-y-2 font-mono text-xs">
            <div>
              <dt className="text-muted-foreground">긴 요청 몫</dt>
              <dd className="font-bold text-foreground">{longBlocks.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">남은 block</dt>
              <dd className="font-bold text-foreground">{free.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">짧은 대화</dt>
              <dd className="font-bold text-foreground">{shortSlots}개</dd>
            </div>
          </dl>

          <p className="mt-4 min-h-[8.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:min-h-[5.5rem]">
            {state.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
