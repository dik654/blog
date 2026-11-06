import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #picture — 취득 15억, 개발비 70억, 매각대금 100억의 누적 금액.
 * 세로 = 받은 돈 − 낸 돈(억 원). 0 → −15 → −85 → +15는 본문 FlowRail 금액의 합입니다.
 * 70억의 월별 일정은 본문에 없으므로 시작과 끝만 점선으로 잇습니다.
 */
const W = 340;
const H = 222;
const LEFT = 38;
const RIGHT = 8;
const TOP = 14;
const BOTTOM = 36;
const V_MAX = 30;
const V_MIN = -100;

const py = (value: number) => TOP + ((V_MAX - value) / (V_MAX - V_MIN)) * (H - TOP - BOTTOM);

const X_ACQUIRE = 66;
const X_BUILD_END = 226;
const X_SALE = 278;
const X_END = W - RIGHT;

const SOLID = "#2563eb";
const DIM = "#94a3b8";
const TEXT = "#64748b";

const SCENES = [
  { label: "취득할 때", summary: "0 → −15억", note: "토지 매도자에게 13억 원, 취득 관련 상대방에게 2억 원을 배정합니다. 아직 들어온 돈은 없습니다." },
  { label: "설계·허가·공사·판매 과정", summary: "−15억 → −85억", note: "나머지 70억 원을 계약과 지급일에 따라 나눠 냅니다. 점선은 시작과 끝만 이은 것이고 실제 모양은 지급 일정마다 다릅니다." },
  { label: "매각대금을 받을 때", summary: "−85억 → +15억", note: "매수자가 100억 원을 내면 15억 원이 남습니다. 모든 가정이 맞았을 때입니다. 100 − 85 = 15라는 뺄셈만으로는 85억 원의 깊이가 보이지 않습니다." },
] as const;

const fmt = (value: number) => (value < 0 ? `−${Math.abs(value)}` : `${value}`);

export default function CashDepthViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="누적 현금"
      title="끝에 남는 15억 원 앞에는 85억 원이 먼저 나가는 구간이 있습니다"
      description="가로는 일의 순서, 세로는 대출 입출금을 넣지 않은 사업 현금, 곧 받은 돈에서 낸 돈을 뺀 금액(억 원)입니다. 사업과 금액은 모두 (가정)입니다."
      note="본문의 순서대로 판매 관련 비용까지 70억 원 전부를 매각대금 전에 놓았습니다. 월별 지급 시점의 할인은 생략했습니다. 85억 원은 조달해야 할 돈이며 모두 자기 돈이라는 뜻은 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="개발 사업의 누적 현금이 0에서 −15억, −85억을 거쳐 +15억이 되는 과정"
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
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[500px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {[0, -50, -100].map((value) => (
            <g key={value}>
              <line x1={LEFT} x2={X_END} y1={py(value)} y2={py(value)} stroke={DIM} strokeWidth={value === 0 ? 1 : 0.5} strokeDasharray={value === 0 ? undefined : "2 3"} />
              <text x={LEFT - 6} y={py(value) + 4} textAnchor="end" fontSize={13} fill={TEXT}>{fmt(value)}</text>
            </g>
          ))}

          {/* 가로축: 일의 순서 */}
          <text x={X_ACQUIRE} y={H - 16} textAnchor="middle" fontSize={13} fontWeight={active === 0 ? 700 : 400} fill={active === 0 ? SOLID : TEXT}>취득</text>
          <text x={(X_ACQUIRE + X_BUILD_END) / 2 + 10} y={H - 16} textAnchor="middle" fontSize={13} fontWeight={active === 1 ? 700 : 400} fill={active === 1 ? SOLID : TEXT}>설계·허가·공사·판매</text>
          <text x={X_SALE + 6} y={H - 16} textAnchor="middle" fontSize={13} fontWeight={active === 2 ? 700 : 400} fill={active === 2 ? SOLID : TEXT}>매각대금</text>

          {/* 0 → −15: 취득 */}
          <polyline points={`${LEFT},${py(0)} ${X_ACQUIRE},${py(0)} ${X_ACQUIRE},${py(-15)}`} fill="none" stroke={SOLID} strokeWidth={1.25} />
          <circle cx={X_ACQUIRE} cy={py(-15)} r={3} fill={SOLID} />
          <text x={X_ACQUIRE + 8} y={py(-15) + 4} fontSize={13} fontWeight={700} fill={SOLID}>−15억</text>

          {/* −15 → −85: 일정이 정해지지 않은 70억 */}
          {active >= 1 && (
            <g>
              <line x1={X_ACQUIRE} y1={py(-15)} x2={X_BUILD_END} y2={py(-85)} stroke={SOLID} strokeWidth={1.25} strokeDasharray="4 3" />
              <circle cx={X_BUILD_END} cy={py(-85)} r={3} fill={SOLID} />
              <text x={(X_ACQUIRE + X_BUILD_END) / 2 - 8} y={py(-50) + 16} textAnchor="end" fontSize={13} fill={TEXT}>70억</text>
              <text x={X_BUILD_END - 8} y={py(-85) + 16} textAnchor="end" fontSize={13} fontWeight={700} fill={SOLID}>−85억</text>
              {/* 깊이 표시 */}
              <line x1={X_BUILD_END} y1={py(0)} x2={X_BUILD_END} y2={py(-85)} stroke="#dc2626" strokeWidth={1} />
              <line x1={X_BUILD_END - 4} y1={py(0)} x2={X_BUILD_END + 4} y2={py(0)} stroke="#dc2626" strokeWidth={1} />
              <text x={X_BUILD_END - 7} y={py(-14)} textAnchor="end" fontSize={13} fontWeight={700} fill="#dc2626">먼저 나간 돈 85억</text>
            </g>
          )}

          {/* −85 → +15: 매각대금 */}
          {active >= 2 && (
            <g>
              <polyline points={`${X_BUILD_END},${py(-85)} ${X_SALE},${py(-85)} ${X_SALE},${py(15)} ${X_END},${py(15)}`} fill="none" stroke={SOLID} strokeWidth={1.25} />
              <path d={`M ${X_SALE - 4} ${py(-30) + 6} L ${X_SALE} ${py(-30)} L ${X_SALE + 4} ${py(-30) + 6} Z`} fill={SOLID} />
              <text x={X_SALE + 7} y={py(-46)} fontSize={13} fontWeight={700} fill={SOLID}>+100억</text>
              <circle cx={X_END - 2} cy={py(15)} r={3} fill={SOLID} />
              <text x={X_END} y={py(15) - 8} textAnchor="end" fontSize={13} fontWeight={700} fill={SOLID}>+15억</text>
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
