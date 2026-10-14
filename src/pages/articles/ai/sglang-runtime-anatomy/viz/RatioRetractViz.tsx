import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * new_token_ratio 한 값의 일생을 decode step 축에 그린다.
 * 한 mechanism: retract가 없는 step마다 일정량 내려가고, retract가 일어나면 남은 요청의 실제 진행률로 다시 올라간다.
 */
const INIT = 0.7;
const MIN = 0.7 * 0.14;
const DECAY = (INIT - MIN) / 600;
const RETRACT_STEP = 700;
const RETRACT_RATIO = (600 + 20 * 3) / (3000 + 1);
const FLOOR_AGAIN = RETRACT_STEP + (RETRACT_RATIO - MIN) / DECAY;

const X0 = 44;
const X1 = 466;
const Y0 = 168;
const Y1 = 18;
const MAX_STEP = 900;
const MAX_Y = 0.8;

const sx = (step: number) => X0 + (step / MAX_STEP) * (X1 - X0);
const sy = (ratio: number) => Y0 - (ratio / MAX_Y) * (Y0 - Y1);

const SCENES = ["시작 0.7", "200 step 뒤", "바닥 0.098", "retract", "다시 내려감"] as const;

interface SceneState {
  step: number;
  ratio: number;
  showRetract: boolean;
  note: string;
}

const STATES: readonly SceneState[] = [
  {
    step: 0,
    ratio: INIT,
    showRetract: false,
    note: "출력을 999개 더 만들 수 있는 실행 중 요청은 999×0.7=699.3칸으로 장부에 올라갑니다. 끝까지 예약하는 999칸보다 299.7칸 적습니다.",
  },
  {
    step: 200,
    ratio: INIT - 200 * DECAY,
    showRetract: false,
    note: "retract 없이 decode가 200번 지나면 한 번에 0.001003씩 내려가 0.4993입니다. 남은 출력 800개는 399.5칸으로 셈합니다.",
  },
  {
    step: 600,
    ratio: MIN,
    showRetract: false,
    note: "600번째 step에서 바닥 0.7×0.14=0.098에 닿고 더 내려가지 않습니다. 남은 출력 400개의 예약은 39.2칸뿐입니다.",
  },
  {
    step: RETRACT_STEP,
    ratio: RETRACT_RATIO,
    showRetract: true,
    note: "출력 250·200·150·100개인 네 요청 중 100개짜리를 돌려보내면 남은 셋으로 (600+20×3)÷(3,000+1)=0.2199를 다시 셉니다.",
  },
  {
    step: Math.round(FLOOR_AGAIN),
    ratio: MIN,
    showRetract: true,
    note: "다시 올라간 비율도 같은 기울기로 내려가 약 122 step 뒤 바닥으로 돌아옵니다. 장부는 실패가 날 때마다 실제 진행률로 고쳐집니다.",
  },
];

const PATH = [
  `M ${sx(0)} ${sy(INIT)}`,
  `L ${sx(600)} ${sy(MIN)}`,
  `L ${sx(RETRACT_STEP)} ${sy(MIN)}`,
  `L ${sx(RETRACT_STEP)} ${sy(RETRACT_RATIO)}`,
  `L ${sx(FLOOR_AGAIN)} ${sy(MIN)}`,
  `L ${sx(MAX_STEP)} ${sy(MIN)}`,
].join(" ");

export default function RatioRetractViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3600);
  const state = STATES[scenes.active];
  const ticks = [0, 200, 400, 600, 800];

  return (
    <VizFrame
      eyebrow="new_token_ratio"
      title="비율은 조금씩 낮아지고 retract가 날 때 다시 오릅니다"
      description="가로축은 decode step, 세로축은 실행 중 요청의 남은 출력에 곱하는 비율입니다. 점이 지금 장면의 값입니다."
      note="기본값 0.7, 0.14, 600 step, 여유 20 step을 넣었습니다. 700번째 step의 retract와 네 요청의 출력 수는 설명용 가정입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="new_token_ratio가 decode step에 따라 바뀌는 모습"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          <div className="mt-4 w-full min-w-0 overflow-x-auto">
          <svg viewBox="0 0 480 196" className="h-auto w-full min-w-[30rem]" role="img" aria-label={`step ${state.step}에서 비율 ${state.ratio.toFixed(4)}`}>
            <line x1={X0} y1={Y0} x2={X1} y2={Y0} stroke="#9ca3af" strokeWidth={1} />
            <line x1={X0} y1={Y0} x2={X0} y2={Y1} stroke="#9ca3af" strokeWidth={1} />
            {[0, 0.2, 0.4, 0.6].map((value) => (
              <g key={value}>
                <line x1={X0 - 3} y1={sy(value)} x2={X0} y2={sy(value)} stroke="#9ca3af" strokeWidth={1} />
                <text x={X0 - 6} y={sy(value) + 3} fontSize={9} fill="#6b7280" textAnchor="end">
                  {value.toFixed(1)}
                </text>
              </g>
            ))}
            {ticks.map((value) => (
              <text key={value} x={sx(value)} y={Y0 + 14} fontSize={9} fill="#6b7280" textAnchor="middle">
                {value}
              </text>
            ))}
            <text x={X1} y={Y0 + 26} fontSize={9} fill="#6b7280" textAnchor="end">decode step</text>
            <line x1={X0} y1={sy(MIN)} x2={X1} y2={sy(MIN)} stroke="#9ca3af" strokeWidth={1} strokeDasharray="3 3" />
            <text x={X1} y={sy(MIN) - 4} fontSize={9} fill="#6b7280" textAnchor="end">바닥 0.098</text>
            <path d={PATH} fill="none" stroke="#2563eb" strokeWidth={1.25} strokeOpacity={0.35} />
            {state.showRetract ? (
              <text x={sx(RETRACT_STEP) + 6} y={sy(RETRACT_RATIO) - 6} fontSize={9} fill="#d97706" fontWeight={700}>
                retract
              </text>
            ) : null}
            <circle cx={sx(state.step)} cy={sy(state.ratio)} r={4.5} fill="#2563eb" />
          </svg>
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs">
            <div>
              <dt className="text-muted-foreground">decode step</dt>
              <dd className="font-bold text-foreground">{state.step}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">new_token_ratio</dt>
              <dd className="font-bold text-foreground">{state.ratio.toFixed(4)}</dd>
            </div>
          </dl>

          <p className="mt-4 min-h-[9.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:min-h-[4rem]">
            {state.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
