import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #case — 3천만 원 위에 200만 원이 36번 쌓여 1억200만 원이 되고, 3천만 원이 돌아와 7천200만 원이 되는 과정.
 * 가로 = 월세를 낸 횟수, 세로 = 점주가 낸 현금에서 돌려받은 돈을 뺀 합계(만 원). 숫자는 본문의 (가정)과 같습니다.
 */
const DEPOSIT = 3000;
const RENT = 200;
const MONTHS = 36;
const PAID_TOTAL = DEPOSIT + RENT * MONTHS;
const NET = RENT * MONTHS;

const W = 340;
const H = 250;
const LEFT = 42;
const TOP = 14;
const BOTTOM = 38;
const N_MAX = 44;
const V_MAX = 12000;
const RIGHT = 6;

const px = (n: number) => LEFT + (n / N_MAX) * (W - LEFT - RIGHT);
const py = (v: number) => TOP + ((V_MAX - v) / V_MAX) * (H - TOP - BOTTOM);

const STAIRS = Array.from({ length: MONTHS }, (_, i) => i + 1)
  .map((n) => `H${px(n).toFixed(1)} V${py(DEPOSIT + RENT * n).toFixed(1)}`)
  .join(" ");
const STAIR_PATH = `M${px(0)} ${py(DEPOSIT)} ${STAIRS}`;
const STAIR_AREA = `${STAIR_PATH} V${py(DEPOSIT)} Z`;

const DEPOSIT_COLOR = "#64748b";
const RENT_COLOR = "#2563eb";
const RETURN_COLOR = "#d97706";
const AXIS_COLOR = "#94a3b8";
const TEXT_COLOR = "#64748b";

const AXIS_LABEL: Record<number, string> = { 0: "0", 3000: "3천만", 6000: "6천만", 9000: "9천만", 12000: "1억2천" };

const SCENES = [
  { label: "시작할 때", summary: "3천만 원을 맡깁니다", note: "아직 월세는 한 번도 내지 않았습니다. 돌려받기로 한 돈이지만 3년 동안 다른 곳에 쓸 수 없고, 반환받지 못할 위험도 있습니다." },
  { label: "36번의 월세", summary: "3천만 + 200만 × 36 = 1억200만 원", note: "한 번 낼 때마다 계단이 200만 원씩 오릅니다. 파란 부분이 사용 대가 7천200만 원이고, 아래 회색 부분은 맡긴 돈 그대로입니다." },
  { label: "마지막 날", summary: "1억200만 − 3천만 = 7천200만 원", note: "공제할 채무가 없고 공간을 약정대로 돌려주면 회색 3천만 원이 돌아옵니다. 남은 순지급액은 파란 부분과 같습니다." },
] as const;

export default function LeaseCashStaircaseViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const active = scenes.active;

  return (
    <VizFrame
      documentFlow
      className="!h-auto !max-h-none"
      eyebrow="3년의 현금"
      title="내는 돈의 계단과 마지막 날 돌아오는 돈을 한 선으로 봅니다"
      description="가로는 월세를 낸 횟수, 세로는 점주가 낸 현금에서 돌려받은 돈을 뺀 합계입니다. 월별 금액은 같고 무상 사용 기간은 없습니다."
      note="금액과 조건은 모두 (가정)입니다. 별도 관리비·세금·공사비는 뺐고, 현금의 지급과 반환만 그렸습니다. 회계상 비용의 인식 시점은 따로 계산하지 않았습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="보증금 위에 월세가 36번 쌓이고 마지막 날 보증금이 돌아오는 현금 그래프"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {[0, 3000, 6000, 9000, 12000].map((value) => (
            <g key={value}>
              <line x1={LEFT} x2={W - RIGHT} y1={py(value)} y2={py(value)} stroke={AXIS_COLOR} strokeWidth={value === 0 ? 1 : 0.5} strokeDasharray={value === 0 ? undefined : "2 3"} />
              <text x={LEFT - 4} y={py(value) + 4} textAnchor="end" fontSize={11} fill={TEXT_COLOR}>{AXIS_LABEL[value]}</text>
            </g>
          ))}
          {[0, 12, 24, 36].map((n) => (
            <text key={n} x={px(n)} y={H - 22} textAnchor="middle" fontSize={12} fill={TEXT_COLOR}>{n}</text>
          ))}
          <text x={px(18)} y={H - 5} textAnchor="middle" fontSize={12} fill={TEXT_COLOR}>월세를 낸 횟수(번)</text>

          <rect x={px(0)} y={py(DEPOSIT)} width={px(MONTHS) - px(0)} height={py(0) - py(DEPOSIT)} fill={DEPOSIT_COLOR} opacity={active === 2 ? 0.1 : 0.22} />
          <line x1={px(0)} x2={px(MONTHS)} y1={py(DEPOSIT)} y2={py(DEPOSIT)} stroke={DEPOSIT_COLOR} strokeWidth={1} strokeDasharray={active === 2 ? "4 3" : undefined} />
          <text x={px(MONTHS / 2)} y={py(DEPOSIT / 2) + 4} textAnchor="middle" fontSize={13} fontWeight={700} fill={DEPOSIT_COLOR}>맡긴 돈 3천만 원</text>

          {active >= 1 && (
            <g>
              <path d={STAIR_AREA} fill={RENT_COLOR} opacity={0.14} />
              <path d={STAIR_PATH} fill="none" stroke={RENT_COLOR} strokeWidth={1.25} />
              <text x={px(35)} y={py(DEPOSIT) - 10} textAnchor="end" fontSize={13} fontWeight={700} fill={RENT_COLOR}>월세 7천200만 원</text>
              <circle cx={px(MONTHS)} cy={py(PAID_TOTAL)} r={3.5} fill={RENT_COLOR} />
              <text x={px(MONTHS) + 6} y={py(PAID_TOTAL) + 4} fontSize={12} fontWeight={700} fill={RENT_COLOR}>1억200만</text>
            </g>
          )}
          {active === 0 && <circle cx={px(0)} cy={py(DEPOSIT)} r={3.5} fill={DEPOSIT_COLOR} />}

          {active === 2 && (
            <g>
              <line x1={px(MONTHS)} x2={px(MONTHS)} y1={py(PAID_TOTAL)} y2={py(NET) - 4} stroke={RETURN_COLOR} strokeWidth={1.25} />
              <path d={`M${px(MONTHS) - 4} ${py(NET) - 7} L${px(MONTHS)} ${py(NET) - 1} L${px(MONTHS) + 4} ${py(NET) - 7}`} fill="none" stroke={RETURN_COLOR} strokeWidth={1.25} />
              <text x={px(MONTHS) - 8} y={py(NET + 500) + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={RETURN_COLOR}>3천만 반환</text>
              <circle cx={px(MONTHS)} cy={py(NET)} r={3.5} fill={RETURN_COLOR} />
              <text x={px(MONTHS) + 6} y={py(NET) + 4} fontSize={12} fontWeight={700} fill={RETURN_COLOR}>7천200만</text>
            </g>
          )}
        </svg>
        <StableSceneStack
          active={active}
          className="mt-2"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={SCENES.map((scene) => scene.label)} />
        <StaticSceneList labels={SCENES.map((scene) => scene.label)} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
